// Contas do pedido e a mensagem que vai para o WhatsApp da vendedora.

import { LOJA } from "@/config/loja";
import { CATEGORIAS, LINHAS, VARIACOES, linhaDaVariacao, paresPorGrade, type Linha, type Variacao } from "@/data/catalogo";
import type { Estado, Item } from "./carrinho";
import { brl, plural } from "./formato";

export const avulsos = (it: Item) => Object.values(it.s).reduce((a, q) => a + q, 0);

export function paresDoItem(cod: string, it: Item) {
  const l = linhaDaVariacao(cod);
  return l ? it.g * paresPorGrade(l.categoria) + avulsos(it) : 0;
}

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
  const porCat = new Map<string, number>();
  for (const [cod, it] of Object.entries(itens)) {
    const l = linhaDaVariacao(cod);
    if (!l) continue;
    const p = paresDoItem(cod, it);
    t.modelos++;
    t.grades += it.g;
    t.avulsos += avulsos(it);
    t.pares += p;
    t.valor += p * l.preco;
    t.comissao += p * CATEGORIAS[l.categoria].comissaoPorPar;
    porCat.set(l.categoria, (porCat.get(l.categoria) ?? 0) + p);
  }
  t.paresPorCategoria = [...porCat].map(([c, pares]) => {
    const cat = CATEGORIAS[c as keyof typeof CATEGORIAS];
    return { nome: cat.nome.toLowerCase(), pares, taxa: cat.comissaoPorPar };
  });
  return t;
}

export function grupos(itens: Estado["itens"]): { linha: Linha; vars: Variacao[] }[] {
  return LINHAS.map((linha) => ({ linha, vars: linha.variacoes.filter((v) => itens[v.cod]) })).filter((g) => g.vars.length);
}

export function descreverItem(cod: string, it: Item) {
  const l = linhaDaVariacao(cod)!;
  const partes: string[] = [];
  if (it.g) partes.push(plural(it.g, "grade", "grades"));
  const av = CATEGORIAS[l.categoria].grade.filter((t) => it.s[t.n]).map((t) => `${t.n}: ${it.s[t.n]}`);
  if (av.length) partes.push(`avulsos ${av.join(", ")}`);
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
  L.push(`Pagamento: ${e.pagamento === "pix" ? "Pix (comprovante em anexo)" : "combinar no WhatsApp"}`);

  for (const { linha, vars } of grupos(e.itens)) {
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

  if (LOJA.comissaoNaMensagem && t.pares) {
    const contas = t.paresPorCategoria.map((x) => `${x.pares} × ${brl(x.taxa)}`).join(" + ");
    L.push(`Comissão: ${contas} = ${brl(t.comissao)}`);
  }

  const grades = [...new Set(grupos(e.itens).map((g) => g.linha.categoria))]
    .map((cat) => CATEGORIAS[cat])
    .filter((cat) => cat.grade.length)
    .map((cat) => `Grade ${cat.nome.toLowerCase()}: ${cat.grade.map((g) => `${g.n} ×${g.q}`).join(" · ")}`);
  L.push(...grades);

  if (c.obs.trim()) L.push("", `Obs.: ${c.obs.trim()}`);
  return L.join("\n");
}

export const modeloExiste = (cod: string) => Boolean(VARIACOES[cod]);
