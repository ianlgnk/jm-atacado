"use client";

import { useEffect, type ReactNode } from "react";
import { linkWhatsApp } from "@/config/loja";
import { guardarVendedorDaUrl, useAtendimento } from "@/lib/vendedor";

// Guarda o vendedor do link (?v=) assim que o site abre.
export function CapturaVendedor() {
  useEffect(() => guardarVendedorDaUrl(), []);
  return null;
}

// Link de WhatsApp para quem atende este cliente (o vendedor do link ou a loja).
export function LinkWhatsApp({ texto, className, children }: { texto: string; className?: string; children: ReactNode }) {
  const { whatsapp } = useAtendimento();
  return (
    <a className={className} href={linkWhatsApp(texto, whatsapp)} target="_blank" rel="noopener">
      {children}
    </a>
  );
}

// O número de quem atende, para mostrar na tela.
export function NumeroAtendimento() {
  return <>{useAtendimento().exibir}</>;
}
