// Contas do pedido e a mensagem que vai para o WhatsApp da vendedora.

import { LOJA } from "@/config/loja";
import { CATEGORIAS, LINHAS, linhaDaVariacao, type CategoriaId, type Linha, type Tamanho, type Variacao } from "@/data/catalogo";
import type { Estado, Item, SeFaltar } from "./carrinho";
import { brl, plural } from "./formato";

const gradeDe = (cod: string): Tamanho[] => {
  const l = linhaDaVariacao(cod);
  return l ? CATEGORIAS[l.categoria].grade : [];
};

export const paresDoItem = (cod: string, it: Item) => gradeDe(cod).reduce((a, t) => a + (it.p[t.n] ?? 0), 0);

// Quantas grades fechadas cabem nos pares escolhidos (o resto conta como avulso).
export function gradesCompletas(cod: string, it: Item) {
  const g = gradeDe(cod);
  return g.length ? Math.min(...g.map((t) => Math.floor((it.p[t.n] ?? 0) / t.q))) : 0;
}

export function avulsosDoItem(cod: string, it: Item) {
  const k = gradesCompletas(cod, it);
  return Object.fromEntries(
    gradeDe(cod)
      .map((t) => [t.n, (it.p[t.n] ?? 0) - k * t.q] as const)
      .filter(([, q]) => q > 0),
  );
}

export const totalAvulsos = (cod: string, it: Item) => Object.values(avulsosDoItem(cod, it)).reduce((a, q) => a + q, 0);

export type Totais = {
  modelos: number;
  grades: number;
  avulsos: number;
  pares: number;
  valor: number;
  comissao: number;
  paresPorCategoria: { nome: string; pares: number; taxa: number }[];
};

export function totais(itens: Estado["itens"]): Totais {
  const t: Totais = { modelos: 0, grades: 0, avulsos: 0, pares: 0, valor: 0, comissao: 0, paresPorCategoria: [] };
  const porCat = new Map<CategoriaId, number>();
  for (const [cod, it] of Object.entries(itens)) {
    const l = linhaDaVariacao(cod);
    if (!l) continue;
    const p = paresDoItem(cod, it);
    if (!p) continue;
    t.modelos++;
    t.grades += gradesCompletas(cod, it);
    t.avulsos += totalAvulsos(cod, it);
    t.pares += p;
    t.valor += p * l.preco;
    t.comissao += p * CATEGORIAS[l.categoria].comissaoPorPar;
    porCat.set(l.categoria, (porCat.get(l.categoria) ?? 0) + p);
  }
  t.paresPorCategoria = [...porCat].map(([c, pares]) => ({ nome: CATEGORIAS[c].nome.toLowerCase(), pares, taxa: CATEGORIAS[c].comissaoPorPar }));
  return t;
}

// Pares de cada numeração, somando todos os modelos de uma categoria.
export function porNumeracao(itens: Estado["itens"], categoria: CategoriaId, cods?: string[]) {
  const grade = CATEGORIAS[categoria].grade;
  const soma = Object.fromEntries(grade.map((t) => [t.n, 0]));
  for (const [cod, it] of Object.entries(itens)) {
    if (cods && !cods.includes(cod)) continue;
    if (linhaDaVariacao(cod)?.categoria !== categoria) continue;
    for (const t of grade) soma[t.n] += it.p[t.n] ?? 0;
  }
  return grade.map((t) => ({ n: t.n, pares: soma[t.n] }));
}

// incluirZerados: a tabela mostra também as cores que o lojista zerou mas ainda não removeu.
export function grupos(itens: Estado["itens"], incluirZerados = false): { linha: Linha; vars: Variacao[] }[] {
  return LINHAS.map((linha) => ({
    linha,
    vars: linha.variacoes.filter((v) => itens[v.cod] && (incluirZerados || paresDoItem(v.cod, itens[v.cod]) > 0)),
  })).filter((g) => g.vars.length);
}

export function descreverItem(cod: string, it: Item) {
  const k = gradesCompletas(cod, it);
  const av = Object.entries(avulsosDoItem(cod, it)).map(([n, q]) => `${n}: ${q}`);
  const partes: string[] = [];
  if (k) partes.push(plural(k, "grade", "grades"));
  if (av.length) partes.push(k ? `avulsos ${av.join(", ")}` : av.join(", "));
  return partes.join(" + ");
}

export function faltandoNoFormulario(e: Estado) {
  const c = e.cliente;
  const falta: (keyof Estado["cliente"])[] = [];
  if (!c.nome.trim()) falta.push("nome");
  if (!c.cidade.trim()) falta.push("cidade");
  if (!c.uf.trim()) falta.push("uf");
  if (c.telefone.replace(/\D/g, "").length < 10) falta.push("telefone");
  return falta;
}

export const TEXTO_SE_FALTAR: Record<SeFaltar, { titulo: string; mensagem: string }> = {
  avisar: { titulo: "Me avise antes", mensagem: "me avise antes de fechar" },
  trocar: { titulo: "Pode trocar por outra cor da mesma linha", mensagem: "pode trocar por outra cor da mesma linha" },
  tirar: { titulo: "Pode tirar do pedido", mensagem: "pode tirar do pedido" },
};

export function mensagem(e: Estado) {
  const c = e.cliente;
  const t = totais(e.itens);
  const L: string[] = [];
  L.push(e.numero ? `*Pedido ${e.numero}* · catálogo ${LOJA.nome}` : `*Pedido pelo catálogo ${LOJA.nome}*`);
  L.push("");
  L.push(`Cliente: ${c.nome.trim() || "—"}`);
  if (c.loja.trim()) L.push(`Loja: ${c.loja.trim()}`);
  L.push(`Cidade: ${c.cidade.trim() || "—"}${c.uf.trim() ? " / " + c.uf.trim().toUpperCase() : ""}`);
  if (c.telefone.trim()) L.push(`Telefone: ${c.telefone.trim()}`);
  L.push(`Transportadora: ${c.transportadora.trim() || "a combinar"}`);
  const pix = LOJA.pix.chave.trim() ? "Pix (comprovante em anexo)" : "Pix (aguardo a chave)";
  L.push(`Pagamento: ${e.pagamento === "pix" ? pix : "combinar no WhatsApp"}`);
  L.push(`Se faltar alguma cor: ${TEXTO_SE_FALTAR[e.seFaltar].mensagem}`);

  const gs = grupos(e.itens);
  for (const { linha, vars } of gs) {
    let pares = 0;
    L.push("", `*${linha.nome}* · ${brl(linha.preco)} o par`);
    for (const v of vars) {
      const it = e.itens[v.cod];
      const p = paresDoItem(v.cod, it);
      pares += p;
      L.push(`• ${v.cod} ${v.nome} — ${descreverItem(v.cod, it)} (${p} pares)`);
    }
    L.push(`Subtotal: ${pares} pares · ${brl(pares * linha.preco)}`);
  }

  L.push("", `*Total: ${t.pares} pares · ${brl(t.valor)}*`);
  L.push(`(${plural(t.grades, "grade fechada", "grades fechadas")}${t.avulsos ? ` + ${plural(t.avulsos, "par avulso", "pares avulsos")}` : ""})`);

  for (const cat of [...new Set(gs.map((g) => g.linha.categoria))]) {
    const nome = CATEGORIAS[cat].nome.toLowerCase();
    L.push(`Numeração (${nome}): ${porNumeracao(e.itens, cat).map((x) => `${x.n}: ${x.pares}`).join(" · ")}`);
    L.push(`1 grade de ${nome} = ${CATEGORIAS[cat].grade.map((g) => `${g.n} ×${g.q}`).join(" · ")}`);
  }

  if (LOJA.comissaoNaMensagem && t.pares) {
    const contas = t.paresPorCategoria.map((x) => `${x.pares} × ${brl(x.taxa)}`).join(" + ");
    L.push(`Comissão: ${contas} = ${brl(t.comissao)}`);
  }

  if (c.obs.trim()) L.push("", `Obs.: ${c.obs.trim()}`);
  return L.join("\n");
}
