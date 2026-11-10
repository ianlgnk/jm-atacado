"use client";

// Painel do pedido: fixo à direita no computador (empurra a página) e folha de baixo no celular.

import { useSyncExternalStore } from "react";

export const TELA_LARGA = "(min-width: 1100px)";

let aberto = false;
let fechadoPeloLojista = false;
const ouvintes = new Set<() => void>();
const avisar = () => ouvintes.forEach((f) => f());

const assinar = (f: () => void) => {
  ouvintes.add(f);
  return () => ouvintes.delete(f);
};

export const usePainel = () => useSyncExternalStore(assinar, () => aberto, () => false);

export function abrirPainel() {
  aberto = true;
  avisar();
}

export function fecharPainel() {
  aberto = false;
  fechadoPeloLojista = true;
  avisar();
}

export const alternarPainel = () => (aberto ? fecharPainel() : abrirPainel());

// No computador, o painel abre sozinho no primeiro item, a menos que o lojista já tenha fechado.
export function abrirSeTelaLarga() {
  if (!aberto && !fechadoPeloLojista && window.matchMedia(TELA_LARGA).matches) abrirPainel();
}

// Tela larga ou não, acompanhando mudanças de tamanho.
export function useTelaLarga() {
  return useSyncExternalStore(
    (f) => {
      const mq = window.matchMedia(TELA_LARGA);
      mq.addEventListener("change", f);
      return () => mq.removeEventListener("change", f);
    },
    () => window.matchMedia(TELA_LARGA).matches,
    () => true,
  );
}
