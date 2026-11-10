"use client";

// Qual folha está aberta por cima da página: numeração avulsa ou foto ampliada.

import { useSyncExternalStore } from "react";

export type Folha = { tipo: "numeracao" | "zoom"; cod: string } | null;

let atual: Folha = null;
const ouvintes = new Set<() => void>();

const assinar = (f: () => void) => {
  ouvintes.add(f);
  return () => ouvintes.delete(f);
};

export const useFolha = () => useSyncExternalStore(assinar, () => atual, () => null);

export function abrirFolha(f: Folha) {
  atual = f;
  ouvintes.forEach((o) => o());
}

export const fecharFolha = () => abrirFolha(null);
