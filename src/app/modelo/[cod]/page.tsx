import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompraModelo } from "@/components/CompraModelo";
import { Foto } from "@/components/Foto";
import { IconeVoltar } from "@/components/Icones";
import { TodasAsCores } from "@/components/TodasAsCores";
import { VARIACOES, linhaPorId, paresDaGrade } from "@/data/catalogo";
import { brl } from "@/lib/formato";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(VARIACOES).map((cod) => ({ cod: cod.toLowerCase() }));
}

const achar = (cod: string) => VARIACOES[cod.toUpperCase()];

export async function generateMetadata({ params }: PageProps<"/modelo/[cod]">): Promise<Metadata> {
  const { cod } = await params;
  const v = achar(cod);
  const l = v && linhaPorId(v.linhaId);
  return { title: v && l ? `${v.nome} · ${l.nome}` : "Modelo" };
}

export default async function PaginaModelo({ params }: PageProps<"/modelo/[cod]">) {
  const { cod } = await params;
  const v = achar(cod);
  if (!v) notFound();
  const l = linhaPorId(v.linhaId)!;
  const grade = paresDaGrade(l);

  return (
    <div className="wrap tela-modelo">
      <Link className="voltar" href={`/linha/${l.id}/`}>
        <IconeVoltar /> {l.curto}
      </Link>
      <div className="modelo-detalhe">
        <div className="modelo-galeria">
          <div className="modelo-grande">
            <Foto f={v.foto} sizes="(min-width:900px) 46vw, 100vw" alt={`${l.nome} ${v.nome}`} prioridade />
            {v.esgotado && <span className="selo selo-esgotado">Esgotado</span>}
          </div>
          <nav className="miniaturas" aria-label={`Outras ${l.rotulo} de ${l.curto}`}>
            {l.variacoes.map((x) => (
              <Link
                key={x.cod}
                href={`/modelo/${x.cod.toLowerCase()}/`}
                aria-current={x.cod === v.cod ? "true" : undefined}
                aria-label={`${x.nome} (${x.cod})`}
                className={x.esgotado ? "esgotada" : undefined}
              >
                <Foto f={x.foto} sizes="72px" alt="" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="modelo-dados">
          <h1>{v.nome}</h1>
          <p className="modelo-de">
            {l.nome} · {v.cod}
          </p>
          <p className="modelo-valor">
            <b>{brl(l.preco)}</b> o par · grade com {grade} pares {brl(l.preco * grade)}
          </p>
          <CompraModelo cod={v.cod} />
          <ul className="lista-feat">
            {l.descricao.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <TodasAsCores linhaId={l.id} />
        </div>
      </div>
    </div>
  );
}
