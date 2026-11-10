import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogo } from "@/components/Catalogo";
import { LINHAS, TOTAL_MODELOS, paresPorGrade } from "@/data/catalogo";

export const metadata: Metadata = { title: "Catálogo" };

export default function PaginaCatalogo() {
  return (
    <section className="secao">
      <div className="wrap">
        <span className="eyebrow">Atacado</span>
        <h1 className="titulo">Catálogo</h1>
        <p className="sub">
          {LINHAS.length} linhas · {TOTAL_MODELOS} modelos · preço por par, grade com {paresPorGrade("chinelos")} pares
        </p>
        <Suspense>
          <Catalogo />
        </Suspense>
      </div>
    </section>
  );
}
