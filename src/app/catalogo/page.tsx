import type { Metadata } from "next";
import { Catalogo } from "@/components/Catalogo";

export const metadata: Metadata = { title: "Catálogo" };

export default function PaginaCatalogo() {
  return (
    <section className="wrap tela">
      <h1 className="titulo">Catálogo</h1>
      <p className="sub">Toque em + para pôr uma grade de 12 pares. Toque na numeração para escolher par a par.</p>
      <Catalogo />
    </section>
  );
}
