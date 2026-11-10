import type { Metadata } from "next";
import { Catalogo } from "@/components/Catalogo";

export const metadata: Metadata = { title: "Catálogo" };

export default function PaginaCatalogo() {
  return (
    <section className="wrap tela">
      <h1 className="titulo">Catálogo</h1>
      <p className="sub">Toque em + para pôr uma grade fechada de 12 pares em cada cor.</p>
      <Catalogo />
    </section>
  );
}
