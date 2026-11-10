"use client";

import Link from "next/link";
import { linhaPorId, type Variacao } from "@/data/catalogo";
import { itemDe, pedido, usePedido } from "@/lib/carrinho";
import { abrirFolha } from "@/lib/folhas";
import { brl, plural } from "@/lib/formato";
import { avulsos, paresDoItem } from "@/lib/pedido";
import { Foto } from "./Foto";
import { IconeLupa } from "./Icones";
import { Stepper } from "./Stepper";

export function CardVariacao({ v, comLinha = false }: { v: Variacao; comLinha?: boolean }) {
  const e = usePedido();
  const it = itemDe(e, v.cod);
  const linha = linhaPorId(v.linhaId)!;
  const av = avulsos(it);
  const ativo = paresDoItem(v.cod, it) > 0;

  return (
    <article className={`var${ativo ? " ativa" : ""}${v.esgotado ? " esgotada" : ""}`}>
      <button type="button" className="foto" onClick={() => abrirFolha({ tipo: "zoom", cod: v.cod })} aria-label={`Ampliar foto ${v.cod} ${v.nome}`}>
        <Foto f={v.foto} sizes="(min-width:1180px) 20vw, (min-width:700px) 28vw, 48vw" alt={`${linha.nome} ${v.nome}`} />
        <span className="codigo">{v.cod}</span>
        {v.esgotado ? <span className="tarja">Esgotado</span> : <span className="lupa"><IconeLupa /></span>}
      </button>
      <div className="corpo">
        {comLinha && (
          <Link className="mini-linha" href={`/linha/${linha.id}/`}>
            {linha.nome} · {brl(linha.preco)}/par
          </Link>
        )}
        <div className="nome">{v.nome}</div>
        <Stepper
          valor={it.g}
          rotulo={["grade", "grades"]}
          nome={`Grades fechadas de ${v.cod}`}
          onMais={() => pedido.maisGrade(v.cod)}
          onMenos={() => pedido.menosGrade(v.cod)}
          desativado={v.esgotado}
          destaque
        />
        {v.esgotado ? (
          <span className="nota">Fale com a vendedora para reposição.</span>
        ) : (
          <button type="button" className="link-num" onClick={() => abrirFolha({ tipo: "numeracao", cod: v.cod })}>
            {av ? `+ ${plural(av, "avulso", "avulsos")} · editar` : "Por numeração"}
          </button>
        )}
      </div>
    </article>
  );
}
