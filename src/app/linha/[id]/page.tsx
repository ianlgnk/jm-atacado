import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BotaoCompartilhar } from "@/components/BotaoCompartilhar";
import { CardModelo } from "@/components/CardModelo";
import { IconeVoltar } from "@/components/Icones";
import { TodasAsCores } from "@/components/TodasAsCores";
import { CATEGORIAS, LINHAS, linhaPorId, paresPorGrade } from "@/data/catalogo";
import { brl } from "@/lib/formato";

export const dynamicParams = false;

export function generateStaticParams() {
  return LINHAS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/linha/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: linhaPorId(id)?.nome ?? "Linha" };
}

export default async function PaginaLinha({ params }: PageProps<"/linha/[id]">) {
  const { id } = await params;
  const l = linhaPorId(id);
  if (!l) notFound();
  const grade = paresPorGrade(l.categoria);

  return (
    <section className="wrap tela">
      <Link className="voltar" href="/catalogo/">
        <IconeVoltar /> Catálogo
      </Link>
      <div className="linha-cab">
        <div>
          <h1 className="titulo">{l.nome}</h1>
          <p className="modelo-valor">
            <b>{brl(l.preco)}</b> o par · grade com {grade} pares {brl(l.preco * grade)} · {CATEGORIAS[l.categoria].grade.map((t) => `${t.n} ×${t.q}`).join(" · ")}
          </p>
          <ul className="lista-feat em-linha">
            {l.descricao.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="linha-acoes">
          <TodasAsCores linhaId={l.id} />
          <BotaoCompartilhar linhaId={l.id} />
        </div>
      </div>
      <p className="contagem">
        {l.variacoes.length} {l.rotulo}
      </p>
      <div className="vitrine">
        {l.variacoes.map((v) => (
          <CardModelo key={v.cod} v={v} />
        ))}
      </div>
    </section>
  );
}
