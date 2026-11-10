"use client";

import { linhaPorId, paresPorGrade } from "@/data/catalogo";
import { pedido, usePedido } from "@/lib/carrinho";
import { brl } from "@/lib/formato";
import { abrirSeTelaLarga } from "@/lib/painel";

// Atalho de atacado: +1 grade de cada cor disponível da linha.
export function TodasAsCores({ linhaId }: { linhaId: string }) {
  const e = usePedido();
  const l = linhaPorId(linhaId)!;
  const cores = l.variacoes.filter((v) => !v.esgotado).length;
  const pares = cores * paresPorGrade(l.categoria);
  if (!cores) return null;

  return (
    <button
      type="button"
      className="btn btn-linha btn-todas"
      onClick={() => {
        const vazio = !Object.keys(e.itens).length;
        pedido.gradeEmTodas(linhaId);
        if (vazio) abrirSeTelaLarga();
      }}
    >
      + 1 grade de cada {l.rotulo === "cores" ? "cor" : "estampa"}
      <small>
        {cores} {l.rotulo} · {pares} pares · {brl(pares * l.preco)}
      </small>
    </button>
  );
}
