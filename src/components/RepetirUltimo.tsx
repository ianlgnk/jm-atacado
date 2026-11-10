"use client";

import { pedido, usePedido } from "@/lib/carrinho";
import { plural } from "@/lib/formato";

// Aparece com o pedido vazio, se este celular já enviou um pedido antes.
export function RepetirUltimo() {
  const e = usePedido();
  if (!e.ultimo || !e.ultimo.pares) return null;
  const quando = new Date(e.ultimo.quando).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  return (
    <button type="button" className="btn btn-linha repetir" onClick={() => pedido.repetirUltimo()}>
      ↻ Repetir último pedido
      <small>
        {quando} · {plural(e.ultimo.pares, "par", "pares")}
      </small>
    </button>
  );
}
