"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { linhaPorId, type Variacao } from "@/data/catalogo";
import { itemDe, pedido, usePedido } from "@/lib/carrinho";
import { brl } from "@/lib/formato";
import { abrirSeTelaLarga } from "@/lib/painel";
import { gradesCompletas, paresDoItem } from "@/lib/pedido";
import { Foto } from "./Foto";
import { GradeViva } from "./GradeViva";
import { IconeMais, IconeMenos } from "./Icones";

// Card da vitrine: foto, nome, preço, + para pôr uma grade e a grade viva embaixo.
// `ordem` escalona a entrada nas vitrines animadas (as 12 primeiras entram uma depois da outra).
export function CardModelo({
  v,
  sizes = "(min-width:1100px) 22vw, (min-width:700px) 30vw, 48vw",
  ordem,
}: {
  v: Variacao;
  sizes?: string;
  ordem?: number;
}) {
  const e = usePedido();
  const linha = linhaPorId(v.linhaId)!;
  const it = itemDe(e, v.cod);
  const grades = gradesCompletas(v.cod, it);
  const noPedido = paresDoItem(v.cod, it) > 0;
  const href = `/modelo/${v.cod.toLowerCase()}/`;

  function mais() {
    const vazio = !Object.keys(e.itens).length;
    pedido.maisGrade(v.cod);
    if (vazio) abrirSeTelaLarga();
  }

  return (
    <article
      className={`modelo${noPedido ? " no-pedido" : ""}${v.esgotado ? " esgotado" : ""}`}
      style={ordem === undefined ? undefined : ({ "--i": Math.min(ordem, 11) } as CSSProperties)}
    >
      <Link href={href} className="modelo-foto" aria-label={`${v.nome}, ${linha.nome}, ver detalhes`}>
        <Foto f={v.foto} sizes={sizes} alt="" />
        {linha.lancamento && !v.esgotado && <span className="selo">Novo</span>}
        {v.esgotado && <span className="selo selo-esgotado">Esgotado</span>}
      </Link>
      <div className="modelo-info">
        <Link href={href} className="modelo-nome">
          {v.nome}
        </Link>
        <span className="modelo-linha">
          {linha.curto} · {v.cod}
        </span>
        <div className="modelo-compra">
          <span className="modelo-preco">
            {brl(linha.preco)}
            <small>/par</small>
          </span>
          {v.esgotado ? null : grades > 0 ? (
            <span className="passo-grade" role="group" aria-label={`Grades de ${v.cod}`}>
              <button type="button" onClick={() => pedido.menosGrade(v.cod)} aria-label={`Tirar uma grade de ${v.cod}`}>
                <IconeMenos />
              </button>
              <output aria-live="polite">{grades}</output>
              <button type="button" onClick={mais} aria-label={`Pôr mais uma grade de ${v.cod}`}>
                <IconeMais />
              </button>
            </span>
          ) : (
            <button type="button" className="botao-mais" onClick={mais} aria-label={`Pôr uma grade de ${v.cod}`}>
              <IconeMais />
            </button>
          )}
        </div>
        <GradeViva v={v} />
      </div>
    </article>
  );
}
