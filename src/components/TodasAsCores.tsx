"use client";

import { linhaPorId, paresDaGrade } from "@/data/catalogo";
import { pedido, usePedido } from "@/lib/carrinho";
import { brl } from "@/lib/formato";
import { abrirSeTelaLarga } from "@/lib/painel";
import { IconeMais } from "./Icones";

// Atalho de atacado: +1 grade de cada cor disponível da linha.
export function TodasAsCores({ linhaId }: { linhaId: string }) {
  const e = usePedido();
  const l = linhaPorId(linhaId)!;
  const cores = l.variacoes.filter((v) => !v.esgotado).length;
  const pares = cores * paresDaGrade(l);
  if (!cores) return null;

  return (
    <button
      type="button"
      className="btn-todas"
      onClick={() => {
        const vazio = !Object.keys(e.itens).length;
        pedido.gradeEmTodas(linhaId);
        if (vazio) abrirSeTelaLarga();
      }}
    >
      <span className="btn-todas-icone">
        <IconeMais />
      </span>
      <span>
        <b>1 grade de cada {l.rotulo === "cores" ? "cor" : "estampa"} de {l.curto}</b>
        <small>
          {cores} {l.rotulo} · {pares} pares · {brl(pares * l.preco)}
        </small>
      </span>
    </button>
  );
}
