"use client";

import { linhaPorId, paresDaGrade } from "@/data/catalogo";
import { brl } from "@/lib/formato";
import { useVendedor } from "@/lib/vendedor";
import { IconeWhatsApp } from "./Icones";

// Manda a linha para qualquer conversa do WhatsApp. O endereço da página só é lido no clique,
// e leva o ?v= do vendedor: quem recebe também manda o pedido para ele.
export function BotaoCompartilhar({ linhaId }: { linhaId: string }) {
  const l = linhaPorId(linhaId)!;
  const vendedor = useVendedor();

  function compartilhar() {
    const endereco = new URL(window.location.href);
    endereco.hash = "";
    if (vendedor) endereco.searchParams.set("v", vendedor.id);
    const texto = `${l.nome} · ${brl(l.preco)} o par (grade com ${paresDaGrade(l)} pares). ${l.variacoes.length} ${l.rotulo} para escolher: ${endereco}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  }

  return (
    <button type="button" className="btn btn-contorno" onClick={compartilhar}>
      <IconeWhatsApp /> Compartilhar
    </button>
  );
}
