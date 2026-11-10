"use client";

import { VARIACOES } from "@/data/catalogo";
import { pedido, usePedido } from "@/lib/carrinho";
import { IconeFechar, IconeRepetir } from "./Icones";

// Depois de remover uma cor do pedido: "FP-13 removido · Desfazer".
export function DesfazerRemocao() {
  const e = usePedido();
  if (!e.removido) return null;
  const v = VARIACOES[e.removido.cod];
  return (
    <div className="desfazer" role="status">
      <span>
        <b>{v?.cod}</b> {v?.nome} saiu do pedido.
      </span>
      <button type="button" className="desfazer-acao" onClick={pedido.desfazerRemocao}>
        <IconeRepetir /> Desfazer
      </button>
      <button type="button" className="desfazer-fechar" onClick={pedido.esquecerRemocao} aria-label="Fechar aviso">
        <IconeFechar />
      </button>
    </div>
  );
}
