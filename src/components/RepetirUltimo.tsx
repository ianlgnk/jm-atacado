"use client";

import { pedido, usePedido } from "@/lib/carrinho";
import { plural } from "@/lib/formato";
import { IconeRepetir } from "./Icones";

// Aparece com o pedido vazio, se este celular já enviou um pedido antes.
export function RepetirUltimo() {
  const e = usePedido();
  if (!e.ultimo || !e.ultimo.pares) return null;
  const quando = new Date(e.ultimo.quando).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  return (
    <button type="button" className="btn-todas" onClick={() => pedido.repetirUltimo()}>
      <span className="btn-todas-icone">
        <IconeRepetir />
      </span>
      <span>
        <b>Repetir último pedido</b>
        <small>
          Enviado em {quando} · {plural(e.ultimo.pares, "par", "pares")}
        </small>
      </span>
    </button>
  );
}
