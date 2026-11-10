import type { Metadata, Viewport } from "next";
import { Manrope, Oswald } from "next/font/google";
import { BarraPedido } from "@/components/BarraPedido";
import { Folhas } from "@/components/Folhas";
import { Rodape } from "@/components/Rodape";
import { Topo } from "@/components/Topo";
import { LOJA } from "@/config/loja";
import "./globals.css";

const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: `${LOJA.nome} · Pedido de atacado`, template: `%s · ${LOJA.nome}` },
  description: `Catálogo de atacado da ${LOJA.nome}: escolha os modelos, monte as grades e envie o pedido pelo WhatsApp.`,
  icons: { icon: "/img/logo-160.jpg" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0b09",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${oswald.variable} ${manrope.variable}`}>
      <body>
        <Topo />
        <main id="conteudo">{children}</main>
        <Rodape />
        <BarraPedido />
        <Folhas />
      </body>
    </html>
  );
}
