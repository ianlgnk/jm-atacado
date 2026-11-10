"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { LOJA, linkWhatsAppVendedora } from "@/config/loja";
import { pedido, usePedido } from "@/lib/carrinho";
import { brl } from "@/lib/formato";
import { faltandoNoFormulario, mensagem, totais } from "@/lib/pedido";
import { pixCopiaECola } from "@/lib/pix";
import { IconeCopiar, IconeWhatsApp } from "./Icones";

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
        <span className="eyebrow">Pagamento</span>
        <h1 className="titulo">Nenhum pedido aberto</h1>
        <p className="sub">Monte o pedido no catálogo primeiro.</p>
        <Link className="btn btn-ouro" href="/catalogo/">
          Ver catálogo →
        </Link>
      </div>
    );
  }

  if (faltandoNoFormulario(e).length && !enviado) {
    return (
      <div className="vazio">
        <span className="eyebrow">Pagamento</span>
        <h1 className="titulo">Faltam seus dados</h1>
        <p className="sub">Preencha nome, cidade e telefone no pedido antes de pagar.</p>
        <Link className="btn btn-ouro" href="/pedido/">
          Voltar ao pedido →
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
        <span className="eyebrow">Pedido {e.numero || ""}</span>
        <h1 className="titulo">Seu WhatsApp abriu com o pedido</h1>
        <p className="sub">
          Confira a mensagem{e.pagamento === "pix" ? ", anexe o comprovante do Pix" : ""} e toque em enviar. A vendedora responde confirmando estoque, frete e
          pagamento.
        </p>
        <div className="ctas" style={{ justifyContent: "center" }}>
          <a className="btn btn-wa" href={linkWhatsAppVendedora(mensagem(e))} target="_blank" rel="noopener" style={{ width: "auto" }}>
            <IconeWhatsApp /> Abrir o WhatsApp de novo
          </a>
          <button
            type="button"
            className="btn btn-linha"
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
        ← Voltar ao pedido
      </Link>
      <span className="eyebrow">Pedido {e.numero}</span>
      <h1 className="titulo">{e.pagamento === "pix" ? "Pagamento por Pix" : "Enviar pedido"}</h1>
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
              <button type="button" className="btn btn-linha" onClick={copiar}>
                <IconeCopiar /> {copiado ? "Copiado!" : "Copiar código Pix"}
              </button>
            </div>
            <p className="nota">Recebedor: {LOJA.pix.recebedor}. Confira o nome no app do banco antes de pagar.</p>
          </div>
        )}

        {e.pagamento === "pix" && !comPix && (
          <div className="bloco">
            <b>Chave Pix</b>
            <p className="nota" style={{ marginTop: 6 }}>
              A vendedora manda a chave Pix no WhatsApp assim que receber o pedido.
            </p>
          </div>
        )}

        <div className="bloco">
          <p className="aviso-confirma">
            <b>Seu pedido só é confirmado depois que a vendedora receber{e.pagamento === "pix" ? " o comprovante e" : ""} a mensagem no WhatsApp.</b>
          </p>
          <a className="btn btn-wa" href={linkWhatsAppVendedora(mensagem(e))} target="_blank" rel="noopener" onClick={() => setEnviado(true)}>
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
