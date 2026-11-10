"use client";

// Estado do pedido, salvo no aparelho do lojista (localStorage). Sem servidor por enquanto.

import { useSyncExternalStore } from "react";
import { LOJA } from "@/config/loja";
import { VARIACOES } from "@/data/catalogo";

export type Item = { g: number; s: Record<string, number> }; // g = grades fechadas, s = pares avulsos por numeração

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

export type Estado = {
  itens: Record<string, Item>;
  numero: string;
  pagamento: FormaPagamento;
  cliente: Cliente;
};

const CHAVE = "jm-atacado-pedido-v1";

const VAZIO: Estado = {
  itens: {},
  numero: "",
  pagamento: "pix",
  cliente: { nome: "", loja: "", cidade: "", uf: "", telefone: "", transportadora: "", obs: "" },
};

let estado: Estado = VAZIO;
let carregado = false;
const ouvintes = new Set<() => void>();

function carregar() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  try {
    const s = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (s && typeof s === "object") {
      estado = {
        itens: Object.fromEntries(Object.entries(s.itens || {}).filter(([c]) => VARIACOES[c])) as Record<string, Item>,
        numero: s.numero || "",
        pagamento: s.pagamento === "combinar" ? "combinar" : "pix",
        cliente: { ...VAZIO.cliente, ...(s.cliente || {}) },
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

const vazio = (it: Item) => it.g === 0 && Object.values(it.s).every((q) => !q);

function gravarItem(cod: string, it: Item) {
  mudar((e) => {
    const itens = { ...e.itens };
    if (vazio(it)) delete itens[cod];
    else itens[cod] = it;
    return { ...e, itens, numero: e.numero || novoNumero() };
  });
}

export const itemDe = (e: Estado, cod: string): Item => e.itens[cod] ?? { g: 0, s: {} };

export const pedido = {
  maisGrade(cod: string) {
    const it = itemDe(ler(), cod);
    gravarItem(cod, { ...it, g: it.g + 1 });
  },
  menosGrade(cod: string) {
    const it = itemDe(ler(), cod);
    gravarItem(cod, { ...it, g: Math.max(0, it.g - 1) });
  },
  definirAvulsos(cod: string, s: Record<string, number>) {
    const limpo = Object.fromEntries(Object.entries(s).filter(([, q]) => q > 0));
    gravarItem(cod, { ...itemDe(ler(), cod), s: limpo });
  },
  remover(cod: string) {
    mudar((e) => {
      const itens = { ...e.itens };
      delete itens[cod];
      return { ...e, itens };
    });
  },
  cliente(campo: keyof Cliente, valor: string) {
    mudar((e) => ({ ...e, cliente: { ...e.cliente, [campo]: valor } }));
  },
  pagamento(forma: FormaPagamento) {
    mudar((e) => ({ ...e, pagamento: forma }));
  },
  // Limpa os itens e o número, mas guarda os dados do lojista para o próximo pedido.
  novo() {
    mudar((e) => ({ ...e, itens: {}, numero: "" }));
  },
};
