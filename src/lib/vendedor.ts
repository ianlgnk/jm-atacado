"use client";

import { useSyncExternalStore } from "react";
import { LOJA, VENDEDORES, type Atendimento, type Vendedor } from "@/config/loja";

// Qual vendedor trouxe o cliente: vem do ?v=<id> do link e fica guardado no aparelho.
// Um link novo de outro vendedor troca; sem link de vendedor, vale o atendimento da loja.
const CHAVE = "jm-atacado-vendedor";
const ouvintes = new Set<() => void>();

export const vendedorPorId = (id: string | null | undefined): Vendedor | undefined =>
  id ? VENDEDORES.find((v) => v.id === id.trim().toLowerCase()) : undefined;

const daUrl = () => vendedorPorId(new URLSearchParams(window.location.search).get("v"))?.id ?? null;

function guardado() {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

// O ?v= da página aberta vale antes do guardado: assim já sai certo no primeiro desenho.
const atual = () => daUrl() ?? guardado();

function assinar(aviso: () => void) {
  ouvintes.add(aviso);
  const deOutraAba = (ev: StorageEvent) => ev.key === CHAVE && aviso();
  window.addEventListener("storage", deOutraAba);
  return () => {
    ouvintes.delete(aviso);
    window.removeEventListener("storage", deOutraAba);
  };
}

// Chamado uma vez ao abrir o site (CapturaVendedor no layout).
export function guardarVendedorDaUrl() {
  const id = daUrl();
  if (!id) return;
  try {
    localStorage.setItem(CHAVE, id);
  } catch {
    /* aba anônima sem armazenamento: vale só nesta visita, pelo endereço */
  }
  ouvintes.forEach((f) => f());
}

export function useVendedor(): Vendedor | undefined {
  return vendedorPorId(useSyncExternalStore(assinar, atual, () => null));
}

export function useAtendimento(): Atendimento {
  return useVendedor() ?? LOJA.atendimento;
}
