"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { LOJA, linkWhatsAppVendedora } from "@/config/loja";
import { pedido, usePedido } from "@/lib/carrinho";
import { brl } from "@/lib/formato";
import { faltandoNoFormulario, mensagem, totais } from "@/lib/pedido";
import { pixCopiaECola } from "@/lib/pix";
import { IconeCopiar, IconeVoltar, IconeWhatsApp } from "./Icones";

export function Pagamento() {
  const e = usePedido();
  const t = totais(e.itens);
  const [svg, setSvg] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const comPix = e.pagamento === "pix" && LOJA.pix.chave.trim() !== "";
  const codigoPix = comPix
    ? pixCopiaECola({ chave: LOJA.pix.chave, recebedor: LOJA.pix.recebedor, cidade: LOJA.pix.cidade, valor: t.valor, txid: e.numero })
    : "";

  useEffect(() => {
    if (!codigoPix) return;
    QRCode.toString(codigoPix, { type: "svg", margin: 1, errorCorrectionLevel: "M" }).then(setSvg).catch(() => setSvg(""));
  }, [codigoPix]);

  if (!t.modelos && !enviado) {
    return (
      <div className="vazio">
        <h1 className="titulo">Nenhum pedido aberto</h1>
        <p className="sub">Monte o pedido no catálogo primeiro.</p>
        <Link className="btn btn-tinta" href="/catalogo/">
          Ver catálogo
        </Link>
      </div>
    );
  }

  if (faltandoNoFormulario(e).length && !enviado) {
    return (
      <div className="vazio">
        <h1 className="titulo">Faltam seus dados</h1>
        <p className="sub">Preencha nome, cidade e telefone no pedido antes de pagar.</p>
        <Link className="btn btn-tinta" href="/pedido/">
          Voltar ao pedido
        </Link>
      </div>
    );
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigoPix);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* navegador sem área de transferência: o código continua visível para copiar à mão */
    }
  }

  if (enviado) {
    return (
      <div className="vazio">
        <h1 className="titulo">Seu WhatsApp abriu com o pedido</h1>
        <p className="numero-pedido">Pedido {e.numero || ""}</p>
        <p className="sub">
          {comPix
            ? "Confira a mensagem, anexe o comprovante do Pix e toque em enviar. A vendedora responde confirmando estoque e frete."
            : e.pagamento === "pix"
              ? "Confira a mensagem e toque em enviar. A vendedora confere o estoque e responde com a chave Pix; depois é só pagar e mandar o comprovante na mesma conversa."
              : "Confira a mensagem e toque em enviar. A vendedora confere o estoque e combina com você o frete e a forma de pagamento."}
        </p>
        <div className="ctas" style={{ justifyContent: "center" }}>
          <a className="btn btn-wa" href={linkWhatsAppVendedora(mensagem(e))} target="_blank" rel="noopener" style={{ width: "auto" }}>
            <IconeWhatsApp /> Abrir o WhatsApp de novo
          </a>
          <button
            type="button"
            className="btn btn-contorno"
            onClick={() => {
              pedido.novo();
              setEnviado(false);
            }}
          >
            Começar outro pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Link className="voltar" href="/pedido/">
        <IconeVoltar /> Voltar ao pedido
      </Link>
      <h1 className="titulo">{comPix ? "Pagamento por Pix" : "Enviar pedido"}</h1>
      <p className="numero-pedido">Pedido {e.numero}</p>
      <div className="pagamento">
        <div className="bloco destaque-total">
          <span className="lbl">Total do pedido</span>
          <b>{brl(t.valor)}</b>
          <span className="nota">
            {t.pares} pares · {e.cliente.nome}
            {e.cliente.loja ? ` · ${e.cliente.loja}` : ""}
          </span>
        </div>

        {e.pagamento === "pix" && comPix && (
          <div className="bloco pix">
            <ol className="passos-pix">
              <li>Abra o app do seu banco e escolha pagar com Pix.</li>
              <li>Leia o QR Code ou cole o código “copia e cola”. O valor já vem preenchido.</li>
              <li>Guarde o comprovante e envie junto com o pedido no WhatsApp.</li>
            </ol>
            <div className="qr" aria-label="QR Code do Pix" role="img" dangerouslySetInnerHTML={{ __html: svg }} />
            <div className="copia-cola">
              <code>{codigoPix}</code>
              <button type="button" className="btn btn-contorno" onClick={copiar}>
                <IconeCopiar /> {copiado ? "Copiado!" : "Copiar código Pix"}
              </button>
            </div>
            <p className="nota">Recebedor: {LOJA.pix.recebedor}. Confira o nome no app do banco antes de pagar.</p>
          </div>
        )}

        {!comPix && (
          <div className="bloco">
            <span className="lbl">Como funciona</span>
            <ol className="passos-pix">
              <li>Você envia o pedido no WhatsApp da vendedora.</li>
              <li>Ela confere o estoque e {e.pagamento === "pix" ? "manda a chave Pix" : "combina a forma de pagamento"} na conversa.</li>
              <li>{e.pagamento === "pix" ? "Você paga e manda o comprovante ali mesmo." : "Você paga do jeito combinado."}</li>
            </ol>
          </div>
        )}

        <div className="bloco">
          <p className="aviso-confirma">
            <b>{comPix ? "Seu pedido só é confirmado depois que a vendedora receber o comprovante e a mensagem no WhatsApp." : "Seu pedido só é confirmado depois do pagamento."}</b>
          </p>
          <a
            className="btn btn-wa"
            href={linkWhatsAppVendedora(mensagem(e))}
            target="_blank"
            rel="noopener"
            onClick={() => {
              pedido.registrarEnvio();
              setEnviado(true);
            }}
          >
            <IconeWhatsApp /> Enviar pedido no WhatsApp
          </a>
          <details className="previa-msg">
            <summary>Mensagem que vai para a vendedora</summary>
            <div className="msg">{mensagem(e)}</div>
          </details>
        </div>
      </div>
    </>
  );
}
