import Link from "next/link";
import { BlocoTenis } from "@/components/BlocoTenis";
import { CardLinha } from "@/components/CardLinha";
import { Foto } from "@/components/Foto";
import { LINHAS, TOTAL_MODELOS, paresPorGrade } from "@/data/catalogo";

export default function Inicio() {
  const lancamentos = LINHAS.filter((l) => l.lancamento);
  const grade = paresPorGrade("chinelos");

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">
              Atacado<span className="longo">&nbsp;de calçados</span> · Nova Serrana
            </span>
            <h1>
              Seu pedido de atacado <em>pronto em minutos</em>
            </h1>
            <p className="lead">Escolha os modelos, monte as grades e mande o pedido direto para o WhatsApp da vendedora. Sem esperar foto por foto.</p>
            <div className="ctas">
              <Link className="btn btn-ouro" href="/catalogo/">
                Montar meu pedido →
              </Link>
              <Link className="btn btn-linha" href="/#como">
                Como funciona
              </Link>
            </div>
            <div className="numeros">
              <div>
                <b>{LINHAS.length}</b>
                <span>linhas de chinelos</span>
              </div>
              <div>
                <b>{TOTAL_MODELOS}</b>
                <span>cores e estampas</span>
              </div>
              <div>
                <b>{grade}</b>
                <span>pares por grade</span>
              </div>
              <div>
                <b>33–40</b>
                <span>numeração</span>
              </div>
            </div>
          </div>
          <div className="colagem" aria-hidden="true">
            <figure>
              <Foto f="fp-08" sizes="(min-width:920px) 280px, 52vw" prioridade />
            </figure>
            <figure>
              <Foto f="al-02" sizes="(min-width:920px) 280px, 52vw" prioridade />
            </figure>
            <figure>
              <Foto f="fp-13" sizes="(min-width:920px) 280px, 52vw" prioridade />
            </figure>
            <span className="pilula">Grade de {grade} pares · 33/34 ao 39/40</span>
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="wrap">
          <div className="cab-secao">
            <div>
              <span className="eyebrow">Novidades</span>
              <h2>Lançamentos</h2>
            </div>
            <Link className="ver-tudo" href="/catalogo/?f=lancamentos">
              Ver todos →
            </Link>
          </div>
          <div className="trilho">
            {lancamentos.map((l) => (
              <CardLinha key={l.id} linha={l} sizes="(min-width:760px) 33vw, 70vw" />
            ))}
          </div>
        </div>
      </section>

      <section className="secao" id="como">
        <div className="wrap">
          <span className="eyebrow">Como comprar</span>
          <h2>Três passos</h2>
          <p className="sub">Do catálogo ao WhatsApp, sem trocar foto por foto.</p>
          <div className="passos">
            <div className="passo">
              <div className="n">01</div>
              <h3>Escolha os modelos</h3>
              <p>Veja todas as cores e estampas de cada linha, com código e preço por par.</p>
            </div>
            <div className="passo">
              <div className="n">02</div>
              <h3>Monte as grades</h3>
              <p>Toque em + para cada grade de {grade} pares, ou escolha pares avulsos por numeração.</p>
            </div>
            <div className="passo">
              <div className="n">03</div>
              <h3>Pague e envie</h3>
              <p>Pague no Pix e mande o pedido com o comprovante no WhatsApp, ou combine outra forma com a vendedora.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="wrap">
          <span className="eyebrow">Categorias</span>
          <h2>Tudo num lugar só</h2>
          <p className="sub">Chinelos e tênis de várias fábricas de Nova Serrana.</p>
          <div className="cats">
            <Link className="cat" href="/catalogo/?f=chinelos">
              <Foto f="ec-00" sizes="(min-width:760px) 55vw, 100vw" alt="Chinelos" />
              <div>
                <b>Chinelos</b>
                <span>
                  {LINHAS.length} linhas · {TOTAL_MODELOS} modelos
                </span>
              </div>
            </Link>
            <BlocoTenis />
          </div>
        </div>
      </section>
    </>
  );
}
