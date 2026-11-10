"use client";

// Estado do pedido, salvo no aparelho do lojista (localStorage). Sem servidor por enquanto.
// Cada modelo guarda os pares por numeração; "grade" é só um atalho que soma 2-4-4-2 na linha.

import { useSyncExternalStore } from "react";
import { LOJA } from "@/config/loja";
import { VARIACOES, linhaDaVariacao, linhaPorId } from "@/data/catalogo";
import { gradesCompletas, paresDoItem } from "./pedido";

export type Item = { p: Record<string, number> }; // pares por numeração, ex.: { "35/36": 8 }

export type Cliente = {
  nome: string;
  loja: string;
  cidade: string;
  uf: string;
  telefone: string;
  transportadora: string;
  obs: string;
};

export type FormaPagamento = "pix" | "combinar";
export type SeFaltar = "avisar" | "trocar" | "tirar";

export type UltimoPedido = { itens: Record<string, Item>; quando: string; pares: number };

export type Estado = {
  itens: Record<string, Item>;
  numero: string;
  pagamento: FormaPagamento;
  seFaltar: SeFaltar;
  cliente: Cliente;
  ultimo: UltimoPedido | null;
  removido: { cod: string; item: Item } | null; // para "Desfazer" depois de remover uma cor
};

const CHAVE = "jm-atacado-pedido-v2";
const CHAVE_ANTIGA = "jm-atacado-pedido-v1";

const VAZIO: Estado = {
  itens: {},
  numero: "",
  pagamento: "pix",
  seFaltar: "avisar",
  cliente: { nome: "", loja: "", cidade: "", uf: "", telefone: "", transportadora: "", obs: "" },
  ultimo: null,
  removido: null,
};

const gradeDe = (cod: string) => linhaDaVariacao(cod)!.grade;

// Mantém só modelos que existem e números inteiros positivos nas numerações da categoria.
function limparItens(bruto: unknown): Record<string, Item> {
  const saida: Record<string, Item> = {};
  if (!bruto || typeof bruto !== "object") return saida;
  for (const [cod, it] of Object.entries(bruto as Record<string, { p?: Record<string, unknown> }>)) {
    if (!VARIACOES[cod] || !it?.p) continue;
    const p: Record<string, number> = {};
    for (const t of gradeDe(cod)) {
      const q = Math.floor(Number(it.p[t.n]) || 0);
      if (q > 0) p[t.n] = q;
    }
    if (Object.keys(p).length) saida[cod] = { p }; // linhas zeradas da tabela não voltam ao recarregar
  }
  return saida;
}

// Pedido salvo pela versão anterior do site: { g: grades, s: avulsos por numeração }.
function converterAntigo(itens: Record<string, { g?: number; s?: Record<string, number> }>) {
  const convertido: Record<string, Item> = {};
  for (const [cod, it] of Object.entries(itens || {})) {
    if (!VARIACOES[cod]) continue;
    convertido[cod] = { p: Object.fromEntries(gradeDe(cod).map((t) => [t.n, (it.g ?? 0) * t.q + (it.s?.[t.n] ?? 0)])) };
  }
  return convertido;
}

let estado: Estado = VAZIO;
let carregado = false;
const ouvintes = new Set<() => void>();

function carregar() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  try {
    let s = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (!s) {
      const antigo = JSON.parse(localStorage.getItem(CHAVE_ANTIGA) || "null");
      if (antigo) s = { ...antigo, itens: converterAntigo(antigo.itens) };
    }
    if (s && typeof s === "object") {
      estado = {
        itens: limparItens(s.itens),
        numero: s.numero || "",
        pagamento: s.pagamento === "combinar" ? "combinar" : "pix",
        seFaltar: ["avisar", "trocar", "tirar"].includes(s.seFaltar) ? s.seFaltar : "avisar",
        cliente: { ...VAZIO.cliente, ...(s.cliente || {}) },
        ultimo: s.ultimo?.itens ? { ...s.ultimo, itens: limparItens(s.ultimo.itens) } : null,
        removido: null,
      };
    }
  } catch {
    /* sem localStorage: o pedido só vive nesta aba */
  }
}

function assinar(f: () => void) {
  ouvintes.add(f);
  return () => ouvintes.delete(f);
}

function ler() {
  carregar();
  return estado;
}

export function usePedido(): Estado {
  return useSyncExternalStore(assinar, ler, () => VAZIO);
}

function mudar(fn: (e: Estado) => Estado) {
  carregar();
  estado = fn(estado);
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    /* ignora */
  }
  ouvintes.forEach((f) => f());
}

function novoNumero() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const sufixo = Array.from({ length: 3 }, () => letras[Math.floor(Math.random() * letras.length)]).join("");
  return `${LOJA.prefixoPedido}-${p(d.getDate())}${p(d.getMonth() + 1)}-${sufixo}`;
}

// manterVazio: na tabela, apagar o número de uma célula não some com a linha enquanto o lojista digita.
function gravarItens(novos: Record<string, Item>, manterVazio = false) {
  mudar((e) => {
    const itens = { ...e.itens };
    for (const [cod, it] of Object.entries(novos)) {
      const p = Object.fromEntries(Object.entries(it.p).filter(([, q]) => q > 0));
      if (Object.keys(p).length || manterVazio) itens[cod] = { p };
      else delete itens[cod];
    }
    return { ...e, itens, removido: null, numero: Object.keys(itens).length ? e.numero || novoNumero() : e.numero };
  });
}

export const itemDe = (e: Estado, cod: string): Item => e.itens[cod] ?? { p: {} };

const somarGrade = (cod: string, it: Item, vezes: number): Item => ({
  p: Object.fromEntries(gradeDe(cod).map((t) => [t.n, Math.max(0, (it.p[t.n] ?? 0) + t.q * vezes)])),
});

export const pedido = {
  maisGrade(cod: string) {
    gravarItens({ [cod]: somarGrade(cod, itemDe(ler(), cod), 1) });
  },
  menosGrade(cod: string) {
    const it = itemDe(ler(), cod);
    if (gradesCompletas(cod, it) > 0) gravarItens({ [cod]: somarGrade(cod, it, -1) });
  },
  // manterVazio = true na tabela do pedido (a linha não some enquanto o lojista digita).
  definirPar(cod: string, numeracao: string, pares: number, manterVazio = true) {
    const it = itemDe(ler(), cod);
    gravarItens({ [cod]: { p: { ...it.p, [numeracao]: Math.max(0, Math.floor(pares) || 0) } } }, manterVazio);
  },
  definirPares(cod: string, p: Record<string, number>) {
    gravarItens({ [cod]: { p } });
  },
  // +1 grade em cada cor disponível da linha
  gradeEmTodas(linhaId: string) {
    const linha = linhaPorId(linhaId);
    if (!linha) return;
    const e = ler();
    gravarItens(Object.fromEntries(linha.variacoes.filter((v) => !v.esgotado).map((v) => [v.cod, somarGrade(v.cod, itemDe(e, v.cod), 1)])));
  },
  remover(cod: string) {
    mudar((e) => {
      const itens = { ...e.itens };
      const item = itens[cod];
      delete itens[cod];
      return { ...e, itens, removido: item ? { cod, item } : null };
    });
  },
  desfazerRemocao() {
    mudar((e) => (e.removido ? { ...e, itens: { ...e.itens, [e.removido.cod]: e.removido.item }, removido: null } : e));
  },
  esquecerRemocao() {
    mudar((e) => ({ ...e, removido: null }));
  },
  cliente(campo: keyof Cliente, valor: string) {
    mudar((e) => ({ ...e, cliente: { ...e.cliente, [campo]: valor } }));
  },
  pagamento(forma: FormaPagamento) {
    mudar((e) => ({ ...e, pagamento: forma }));
  },
  seFaltar(op: SeFaltar) {
    mudar((e) => ({ ...e, seFaltar: op }));
  },
  // Chamado ao abrir o WhatsApp: guarda o pedido para "Repetir último pedido".
  registrarEnvio() {
    mudar((e) => ({
      ...e,
      ultimo: {
        itens: e.itens,
        quando: new Date().toISOString(),
        pares: Object.entries(e.itens).reduce((a, [cod, it]) => a + paresDoItem(cod, it), 0),
      },
    }));
  },
  // Põe no pedido os modelos do último envio que ainda não estão esgotados.
  repetirUltimo() {
    const u = ler().ultimo;
    if (!u) return;
    gravarItens(Object.fromEntries(Object.entries(u.itens).filter(([cod]) => !VARIACOES[cod]?.esgotado)));
  },
  // Limpa os itens e o número, mas guarda os dados do lojista e o último pedido.
  novo() {
    mudar((e) => ({ ...e, itens: {}, numero: "", removido: null }));
  },
};
