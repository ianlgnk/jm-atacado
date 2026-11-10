"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { LINHAS, VARIACOES } from "@/data/catalogo";
import { normalizar, plural } from "@/lib/formato";
import { BlocoTenis } from "./BlocoTenis";
import { CardLinha } from "./CardLinha";
import { CardVariacao } from "./CardVariacao";
import { IconeLupa } from "./Icones";

const FILTROS = [
  ["todos", "Todos"],
  ["lancamentos", "Lançamentos"],
  ["chinelos", "Chinelos"],
  ["tenis", "Tênis"],
] as const;

type Filtro = (typeof FILTROS)[number][0];

// /catalogo/?f=lancamentos abre já filtrado. Fica dentro de <Suspense> na página (site estático).
export function Catalogo() {
  const daUrl = useSearchParams().get("f");
  const [escolhido, setFiltro] = useState<Filtro | null>(null);
  const filtro: Filtro = escolhido ?? (FILTROS.find(([id]) => id === daUrl)?.[0] || "todos");
  const [busca, setBusca] = useState("");

  const termo = normalizar(busca.trim());
  const achados = termo
    ? Object.values(VARIACOES).filter((v) => {
        const l = LINHAS.find((x) => x.id === v.linhaId)!;
        return normalizar(`${v.cod} ${v.nome} ${v.busca} ${l.nome} ${l.marca}`).includes(termo);
      })
    : [];
  const linhas = filtro === "lancamentos" ? LINHAS.filter((l) => l.lancamento) : filtro === "chinelos" ? LINHAS.filter((l) => l.categoria === "chinelos") : LINHAS;

  return (
    <>
      <label className="busca">
        <IconeLupa />
        <input
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder="Buscar cor, estampa ou código"
          aria-label="Buscar cor, estampa ou código"
          value={busca}
          onChange={(ev) => setBusca(ev.target.value)}
        />
      </label>
      <div className="chips" role="group" aria-label="Filtrar catálogo">
        {FILTROS.map(([id, rotulo]) => (
          <button
            key={id}
            type="button"
            className="chip"
            aria-pressed={filtro === id && !termo}
            onClick={() => {
              setFiltro(id);
              setBusca("");
            }}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {termo ? (
        achados.length ? (
          <>
            <p className="sub">{plural(achados.length, "modelo encontrado", "modelos encontrados")}</p>
            <div className="grade-vars">
              {achados.map((v) => (
                <CardVariacao key={v.cod} v={v} comLinha />
              ))}
            </div>
          </>
        ) : (
          <p className="sub">Nada encontrado para “{busca}”. Tente uma cor (preta, azul) ou um código (FP-13).</p>
        )
      ) : filtro === "tenis" ? (
        <BlocoTenis />
      ) : (
        <>
          <div className="grade-linhas">
            {linhas.map((l) => (
              <CardLinha key={l.id} linha={l} />
            ))}
          </div>
          {filtro === "todos" && (
            <div style={{ marginTop: 18 }}>
              <BlocoTenis />
            </div>
          )}
        </>
      )}
    </>
  );
}
