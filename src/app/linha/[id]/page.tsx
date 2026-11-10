import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardVariacao } from "@/components/CardVariacao";
import { BotaoCompartilhar } from "@/components/BotaoCompartilhar";
import { TodasAsCores } from "@/components/TodasAsCores";
import { CATEGORIAS, LINHAS, linhaPorId, paresPorGrade } from "@/data/catalogo";
import { brl } from "@/lib/formato";

export const dynamicParams = false;

export function generateStaticParams() {
  return LINHAS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/linha/[id]">): Promise<Metadata> {
  const { id } = await params;
  const l = linhaPorId(id);
  return { title: l?.nome ?? "Linha" };
}

export default async function PaginaLinha({ params }: PageProps<"/linha/[id]">) {
  const { id } = await params;
  const l = linhaPorId(id);
  if (!l) notFound();
  const cat = CATEGORIAS[l.categoria];
  const grade = paresPorGrade(l.categoria);

  return (
    <div className="wrap">
      <Link className="voltar" href="/catalogo/">
        ← Catálogo
      </Link>
      <div className="det">
        <div className="det-info">
          <span className="eyebrow">{l.lancamento ? "Lançamento" : cat.nome}</span>
          <h1>{l.nome}</h1>
          <div className="preco-grande">
            <b>{brl(l.preco)}</b>
            <span className="nota">
              o par · grade com {grade} pares: {brl(l.preco * grade)}
            </span>
          </div>
          <ul className="lista-feat">
            {l.descricao.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <span className="lbl">Grade fechada · {grade} pares</span>
          <div className="tab-grade">
            {cat.grade.map((t) => (
              <div key={t.n}>
                <small>{t.n}</small>
                <b>{t.q}</b>
              </div>
            ))}
          </div>
          <p className="nota">
            Toque em <b>+</b> para cada grade fechada, ou monte por numeração no modelo ou na tabela do pedido.
          </p>
          <div className="acoes-det">
            <TodasAsCores linhaId={l.id} />
            <BotaoCompartilhar linhaId={l.id} />
          </div>
        </div>
        <div>
          <div className="cab-vars">
            <b>
              {l.variacoes.length} {l.rotulo}
            </b>
            <span className="nota">Toque na foto para ampliar</span>
          </div>
          <div className="grade-vars">
            {l.variacoes.map((v) => (
              <CardVariacao key={v.cod} v={v} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
