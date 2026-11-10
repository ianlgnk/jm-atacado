"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOJA, linkWhatsAppVendedora } from "@/config/loja";
import { usePedido } from "@/lib/carrinho";
import { brl, plural } from "@/lib/formato";
import { abrirPainel, usePainel } from "@/lib/painel";
import { totais } from "@/lib/pedido";
import { IconeCasa, IconeGrade, IconeSacola, IconeSeta, IconeWhatsApp } from "./Icones";

// Celular: abas fixas embaixo e, com pares no pedido, uma tira com o total logo acima delas.
// No computador só a tira aparece (quando o painel está fechado).
export function AbasMobile() {
  const caminho = usePathname();
  const e = usePedido();
  const aberto = usePainel();
  const t = totais(e.itens);
  const naFinalizacao = caminho.startsWith("/pedido") || caminho.startsWith("/pagamento");
  const noCatalogo = caminho.startsWith("/catalogo") || caminho.startsWith("/linha") || caminho.startsWith("/modelo");
  const mostrarTira = t.pares > 0 && !aberto && !naFinalizacao;

  return (
    <>
      <div className={`espaco-abas${mostrarTira ? " com-tira" : ""}`} aria-hidden="true" />
      {mostrarTira && (
        <button type="button" className="tira-pedido" onClick={abrirPainel}>
          <span>
            <b>{plural(t.pares, "par", "pares")}</b> · {brl(t.valor)}
          </span>
          <span className="tira-acao">
            Ver pedido <IconeSeta />
          </span>
        </button>
      )}
      <nav className="abas" aria-label="Navegação principal">
        <Link href="/" aria-current={caminho === "/" ? "page" : undefined}>
          <IconeCasa />
          Início
        </Link>
        <Link href="/catalogo/" aria-current={noCatalogo ? "page" : undefined}>
          <IconeGrade />
          Catálogo
        </Link>
        {naFinalizacao ? (
          <Link href="/pedido/" aria-current="page">
            <span className="aba-icone">
              <IconeSacola />
              {t.pares > 0 && <span className="aba-badge">{t.pares}</span>}
            </span>
            Pedido
          </Link>
        ) : (
          <button type="button" onClick={abrirPainel} aria-label={`Pedido: ${t.pares} pares`}>
            <span className="aba-icone">
              <IconeSacola />
              {t.pares > 0 && <span className="aba-badge">{t.pares}</span>}
            </span>
            Pedido
          </button>
        )}
        <a href={linkWhatsAppVendedora(`Olá! Vim pelo catálogo da ${LOJA.nome} e tenho uma dúvida.`)} target="_blank" rel="noopener">
          <IconeWhatsApp />
          WhatsApp
        </a>
      </nav>
    </>
  );
}
