import Link from "next/link";
import { CardModelo } from "@/components/CardModelo";
import { LinkSecao } from "@/components/LinkSecao";
import { Foto } from "@/components/Foto";
import { IconeCaminhao, IconeConferir, IconeFabrica, IconeRelogio, IconeSeta } from "@/components/Icones";
import { VideoCapa } from "@/components/VideoCapa";
import { LINHAS, PUBLICOS, TOTAL_MODELOS, VARIACOES } from "@/data/catalogo";
import { LOJA } from "@/config/loja";
import { brl } from "@/lib/formato";

// Uma cor de cada linha de lançamento, mais a segunda cor da primeira, para fechar 4 cards.
const DESTAQUES = ["AL-02", "GL-02", "EC-01", "AL-01"];

const PASSOS = [
  { titulo: "Escolha e monte a grade", texto: "Toque em + para pôr uma grade de 12 pares, ou escolha par a par em cada numeração." },
  { titulo: "Envie no WhatsApp", texto: `O pedido chega pronto para a ${LOJA.vendedora.nome}, com cores, numeração e totais.` },
  { titulo: "Pague depois de confirmar", texto: "Ela confere o estoque e manda a chave Pix na conversa. Você paga e manda o comprovante ali mesmo." },
];

const CONFIANCA = [
  { Icone: IconeConferir, titulo: "Confere antes de pagar", texto: "A vendedora confirma estoque e frete no WhatsApp. O Pix só vem depois." },
  { Icone: IconeCaminhao, titulo: "Envio para todo o Brasil", texto: "Pela transportadora que você indicar no pedido." },
  { Icone: IconeFabrica, titulo: "Fabricação própria", texto: "Parte dos modelos é feita pela JM, em Nova Serrana." },
  { Icone: IconeRelogio, titulo: "Pedido pronto em minutos", texto: "Grades, numeração e totais chegam organizados para a vendedora." },
];

export default function Inicio() {
  return (
    <>
      <section className="capa">
        <div className="capa-cartao">
          <VideoCapa className="capa-video" />
          <div className="capa-texto">
            <h1>
              <span className="capa-linha">
                <span>Chinelos</span>
              </span>
              <span className="capa-linha">
                <span>no atacado.</span>
              </span>
            </h1>
            <p className="capa-sub">Grade de 12 pares, direto de Nova Serrana.</p>
            <div className="ctas capa-ctas">
              <Link className="btn btn-tinta" href="/catalogo/">
                Ver catálogo <IconeSeta />
              </Link>
              <LinkSecao className="link-capa" href="/#como">
                Como funciona
              </LinkSecao>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap secao secao-primeira">
        <div className="secao-cab">
          <h2>Lançamentos</h2>
          <Link className="ver-tudo" href="/catalogo/?f=lancamentos">
            Ver todos <IconeSeta />
          </Link>
        </div>
        <div className="vitrine">
          {DESTAQUES.map((c) => (
            <CardModelo key={c} v={VARIACOES[c]} />
          ))}
        </div>
      </section>

      <section className="wrap secao" id="como">
        <h2>Como funciona</h2>
        <ol className="passos">
          {PASSOS.map((p) => (
            <li key={p.titulo}>
              <b>{p.titulo}</b>
              <span>{p.texto}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap secao">
        <div className="secao-cab">
          <h2>Linhas</h2>
          <span className="nota">
            {LINHAS.length} linhas · {TOTAL_MODELOS} modelos
          </span>
        </div>
        {PUBLICOS.map((p) => {
          const linhas = LINHAS.filter((l) => l.publico === p.id);
          return (
            <div className="publico" key={p.id}>
              <div className="publico-cab">
                <h3>{p.nome}</h3>
                <Link className="ver-tudo" href={`/catalogo/?f=${p.id}`}>
                  {linhas.length} linhas <IconeSeta />
                </Link>
              </div>
              <div className="linhas">
                {linhas.map((l) => (
                  <Link key={l.id} href={`/linha/${l.id}/`} className="linha-atalho">
                    <span className="linha-foto">
                      <Foto f={l.capa} sizes="160px" alt="" />
                    </span>
                    <b>{l.curto}</b>
                    <small>
                      {brl(l.preco)}/par · {l.variacoes.length} {l.rotulo}
                    </small>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="wrap secao">
        <h2>Compre com confiança</h2>
        <ul className="confianca">
          {CONFIANCA.map(({ Icone, titulo, texto }) => (
            <li key={titulo}>
              <Icone />
              <span>
                <b>{titulo}</b>
                {texto}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap secao">
        <div className="fecho">
          <Foto f="ec-00" sizes="(min-width:900px) 1200px, 100vw" alt="" className="fecho-foto" />
          <div className="fecho-texto">
            <h2>Monte seu pedido.</h2>
            <p>Escolha as cores, ponha as grades e mande para a {LOJA.vendedora.nome} conferir.</p>
            <Link className="btn btn-papel" href="/catalogo/">
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
