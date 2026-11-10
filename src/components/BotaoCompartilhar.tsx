"use client";

import { linhaPorId, paresDaGrade } from "@/data/catalogo";
import { brl } from "@/lib/formato";
import { IconeWhatsApp } from "./Icones";

// Manda a linha para qualquer conversa do WhatsApp. O endereço da página só é lido no clique.
export function BotaoCompartilhar({ linhaId }: { linhaId: string }) {
  const l = linhaPorId(linhaId)!;

  function compartilhar() {
    const texto = `${l.nome} · ${brl(l.preco)} o par (grade com ${paresDaGrade(l)} pares). ${l.variacoes.length} ${l.rotulo} para escolher: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  }

  return (
    <button type="button" className="btn btn-contorno" onClick={compartilhar}>
      <IconeWhatsApp /> Compartilhar
    </button>
  );
}
