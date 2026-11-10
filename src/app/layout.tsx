import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { AbasMobile } from "@/components/AbasMobile";
import { BarraRolagem } from "@/components/BarraRolagem";
import { Folhas } from "@/components/Folhas";
import { PainelPedido } from "@/components/PainelPedido";
import { Rodape } from "@/components/Rodape";
import { Topo } from "@/components/Topo";
import { CapturaVendedor } from "@/components/WhatsAppAtendimento";
import { LOJA } from "@/config/loja";
import "./globals.css";

// Uma família só, com eixo de largura: títulos pesados, códigos e numerações condensados.
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

export const metadata: Metadata = {
  title: { default: `${LOJA.nome} · Pedido de atacado`, template: `%s · ${LOJA.nome}` },
  description: `Catálogo de atacado da ${LOJA.nome}: escolha os modelos, monte as grades e envie o pedido pelo WhatsApp.`,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={archivo.variable} data-scroll-behavior="smooth">
      <body>
        <Topo />
        <main id="conteudo">{children}</main>
        <Rodape />
        <AbasMobile />
        <PainelPedido />
        <Folhas />
        <BarraRolagem />
        <CapturaVendedor />
      </body>
    </html>
  );
}
