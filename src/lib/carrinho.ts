"use client";

// Estado do pedido, salvo no aparelho do lojista (localStorage). Sem servidor por enquanto.
// A fábrica só vende grade fechada: cada cor guarda quantas grades de 12 pares entram no pedido.

import { useSyncExternalStore } from "react";
import { LOJA } from "@/config/loja";
import { VARIACOES, linhaDaVariacao, linhaPorId } from "@/data/catalogo";
import { paresDoItem } from "./pedido";

export type Item = { g: number }; // grades fechadas daquela cor

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
  enviado: string; // assinatura do pedido quando o WhatsApp foi aberto com ele (vazio = ainda não)
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
  enviado: "",
};

// Mantém só modelos que existem, com um número inteiro de grades.
// Também lê pedidos salvos antes: { p: pares por numeração } (vale só o que fecha grade inteira)
// e { g, s } da primeira versão (os avulsos "s" caem).
function limparItens(bruto: unknown): Record<string, Item> {
  const saida: Record<string, Item> = {};
  if (!bruto || typeof bruto !== "object") return saida;
  for (const [cod, it] of Object.entries(bruto as Record<string, { g?: unknown; p?: Record<string, unknown> }>)) {
    const l = VARIACOES[cod] && linhaDaVariacao(cod);
    if (!l || !it) continue;
    let g = Math.floor(Number(it.g) || 0);
    if (!g && it.p) g = Math.min(...l.grade.map((t) => Math.floor((Number(it.p![t.n]) || 0) / t.q)));
    if (g > 0) saida[cod] = { g };
  }
  return saida;
}

let estado: Estado = VAZIO;
let carregado = false;
const ouvintes = new Set<() => void>();

function carregar() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  try {
    const s = JSON.parse(localStorage.getItem(CHAVE) || "null") ?? JSON.parse(localStorage.getItem(CHAVE_ANTIGA) || "null");
    if (s && typeof s === "object") {
      estado = {
        itens: limparItens(s.itens),
        numero: s.numero || "",
        pagamento: s.pagamento === "combinar" ? "combinar" : "pix",
        seFaltar: ["avisar", "trocar", "tirar"].includes(s.seFaltar) ? s.seFaltar : "avisar",
        cliente: { ...VAZIO.cliente, ...(s.cliente || {}) },
        ultimo: s.ultimo?.itens ? { ...s.ultimo, itens: limparItens(s.ultimo.itens) } : null,
        removido: null,
        enviado: typeof s.enviado === "string" ? s.enviado : "",
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

// Grava as grades de cada cor; zero tira a cor do pedido.
function gravarItens(novos: Record<string, Item>) {
  mudar((e) => {
    const itens = { ...e.itens };
    for (const [cod, it] of Object.entries(novos)) {
      const g = Math.max(0, Math.floor(it.g) || 0);
      if (g) itens[cod] = { g };
      else delete itens[cod];
    }
    return { ...e, itens, removido: null, numero: Object.keys(itens).length ? e.numero || novoNumero() : e.numero };
  });
}

export const itemDe = (e: Estado, cod: string): Item => e.itens[cod] ?? { g: 0 };

// O pedido conta como enviado enquanto não mudar depois de abrir o WhatsApp.
const assinatura = (e: Estado) =>
  `${e.numero}|${Object.keys(e.itens)
    .sort()
    .map((cod) => `${cod}:${e.itens[cod].g}`)
    .join(",")}`;

export const foiEnviado = (e: Estado) => e.enviado !== "" && e.enviado === assinatura(e);

export const pedido = {
  maisGrade(cod: string) {
    gravarItens({ [cod]: { g: itemDe(ler(), cod).g + 1 } });
  },
  // Tirar a última grade tira a cor do pedido (com "Desfazer").
  menosGrade(cod: string) {
    const it = itemDe(ler(), cod);
    if (it.g > 1) gravarItens({ [cod]: { g: it.g - 1 } });
    else if (it.g === 1) pedido.remover(cod);
  },
  // +1 grade em cada cor disponível da linha
  gradeEmTodas(linhaId: string) {
    const linha = linhaPorId(linhaId);
    if (!linha) return;
    const e = ler();
    gravarItens(Object.fromEntries(linha.variacoes.filter((v) => !v.esgotado).map((v) => [v.cod, { g: itemDe(e, v.cod).g + 1 }])));
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
  // Chamado ao abrir o WhatsApp: guarda o pedido para "Repetir último pedido" e marca este pedido como enviado.
  registrarEnvio() {
    mudar((e) => ({
      ...e,
      enviado: assinatura(e),
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
    mudar((e) => ({ ...e, itens: {}, numero: "", removido: null, enviado: "" }));
  },
};
