"use client";

import { useEffect, useRef } from "react";
import { VARIACOES, linhaPorId } from "@/data/catalogo";
import { img } from "@/lib/caminho";
import { prenderFocoEm } from "@/lib/foco";
import { fecharFolha, useFolha } from "@/lib/folhas";
import { brl } from "@/lib/formato";
import { IconeFechar } from "./Icones";

// Folha por cima da página: a foto ampliada de uma cor.
export function Folhas() {
  const folha = useFolha();
  const veu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!folha) return;
    const antes = document.activeElement as HTMLElement | null;
    const soltar = prenderFocoEm(veu.current);
    const esc = (ev: KeyboardEvent) => ev.key === "Escape" && fecharFolha();
    document.addEventListener("keydown", esc);
    veu.current?.querySelector<HTMLElement>("[data-foco]")?.focus();
    return () => {
      document.removeEventListener("keydown", esc);
      soltar();
      if (antes && document.contains(antes)) antes.focus({ preventScroll: true });
    };
  }, [folha]);

  if (!folha || !VARIACOES[folha.cod]) return null;

  return (
    <div className="veu" ref={veu} onClick={(ev) => ev.target === ev.currentTarget && fecharFolha()}>
      <Zoom cod={folha.cod} />
    </div>
  );
}

function Zoom({ cod }: { cod: string }) {
  const v = VARIACOES[cod];
  const linha = linhaPorId(v.linhaId)!;
  return (
    <div className="zoom" role="dialog" aria-modal="true" aria-label={`${v.cod} ${v.nome}`}>
      <button type="button" className="fechar" onClick={fecharFolha} aria-label="Fechar" data-foco="">
        <IconeFechar />
      </button>
      <img src={img(`${v.foto}-1200.jpg`)} alt={`${linha.nome} ${v.nome}`} />
      <p>
        {v.cod} · {v.nome} · {brl(linha.preco)} o par{v.esgotado ? " · esgotado" : ""}
      </p>
    </div>
  );
}
