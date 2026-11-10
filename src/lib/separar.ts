// O pedido com fotos (/separar/) não tem servidor: o pedido inteiro vai no próprio link.
// Formato depois do #: <número>_<código sem hífen>x<grades>_..., ex.: #JM-1011-9DW_AL01x2_GL03x1
// Só letras, números, hífen, "_" e "x", para o WhatsApp reconhecer o link inteiro.
// Dados do cliente (nome, telefone) não vão no link.

import { BASE } from "./caminho";

export type ItemSeparar = { cod: string; g: number };

export function hashSeparar(numero: string, itens: Record<string, { g: number }>) {
  const partes = Object.entries(itens)
    .filter(([, it]) => it.g > 0)
    .map(([cod, it]) => `${cod.replace("-", "")}x${it.g}`);
  return [numero.replace(/[^A-Za-z0-9-]/g, "") || "pedido", ...partes].join("_");
}

export function lerSeparar(hash: string): { numero: string; itens: ItemSeparar[] } {
  const [numero = "", ...partes] = decodeURIComponent(hash.replace(/^#/, "")).split("_");
  const itens: ItemSeparar[] = [];
  for (const p of partes) {
    const m = p.match(/^([A-Za-z]+)(\d+)x(\d+)$/);
    if (m && Number(m[3]) > 0) itens.push({ cod: `${m[1].toUpperCase()}-${m[2]}`, g: Number(m[3]) });
  }
  return { numero: numero === "pedido" ? "" : numero, itens };
}

// Endereço completo, para ir na mensagem do WhatsApp. Fora do navegador (build) não há endereço.
export function linkSeparar(numero: string, itens: Record<string, { g: number }>) {
  if (typeof window === "undefined" || !Object.keys(itens).length) return "";
  return `${window.location.origin}${BASE}/separar/#${hashSeparar(numero, itens)}`;
}
