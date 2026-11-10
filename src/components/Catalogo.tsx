"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { EVENTO_BUSCAR } from "@/lib/busca";
import { LINHAS, VARIACOES } from "@/data/catalogo";
import { normalizar, plural } from "@/lib/formato";
import { BlocoTenis } from "./BlocoTenis";
import { CardModelo } from "./CardModelo";
import { IconeFechar, IconeLupa } from "./Icones";

type Filtro = "todos" | "lancamentos" | "tenis" | string; // string = id da linha

const FIXOS: [Filtro, string][] = [
  ["todos", "Todos"],
  ["lancamentos", "Lançamentos"],
];

const semAssinatura = () => () => {};
const filtroDaUrl = () => new URLSearchParams(window.location.search).get("f") ?? "todos";

// Vitrine com todos os modelos. /catalogo/?f=lancamentos ou ?f=<linha> abre já filtrado.
// O filtro do endereço é lido só no navegador (o servidor gera a vitrine com "Todos").
export function Catalogo() {
  const daUrl = useSyncExternalStore(semAssinatura, filtroDaUrl, () => "todos");
  const valido = (f: string) => ["todos", "lancamentos", "tenis", "chinelos"].includes(f) || LINHAS.some((l) => l.id === f);
  const [escolhido, setFiltro] = useState<Filtro | null>(null);
  const filtro: Filtro = escolhido ?? (valido(daUrl) ? (daUrl === "chinelos" ? "todos" : daUrl) : "todos");
  const [busca, setBusca] = useState("");
  const campo = useRef<HTMLInputElement>(null);

  // Lupa do topo: /catalogo/?busca=1 (vindo de outra página) ou o evento (já no catálogo).
  useEffect(() => {
    const focar = () => campo.current?.focus({ preventScroll: true });
    if (new URLSearchParams(window.location.search).has("busca")) focar();
    const aoBuscar = () => {
      setFiltro("todos");
      setBusca("");
      focar();
      campo.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    window.addEventListener(EVENTO_BUSCAR, aoBuscar);
    return () => window.removeEventListener(EVENTO_BUSCAR, aoBuscar);
  }, []);

  const termo = normalizar(busca.trim());
  const todos = Object.values(VARIACOES);
  const lista = termo
    ? todos.filter((v) => {
        const l = LINHAS.find((x) => x.id === v.linhaId)!;
        return normalizar(`${v.cod} ${v.nome} ${v.busca} ${l.nome}`).includes(termo);
      })
    : filtro === "lancamentos"
      ? todos.filter((v) => LINHAS.find((l) => l.id === v.linhaId)?.lancamento)
      : filtro === "todos"
        ? todos
        : todos.filter((v) => v.linhaId === filtro);

  const chips: [Filtro, string][] = [...FIXOS, ...LINHAS.map((l) => [l.id, l.curto] as [Filtro, string]), ["tenis", "Tênis"]];

  return (
    <>
      <div className="busca">
        <IconeLupa />
        <input
          ref={campo}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder="Cor, estampa ou código"
          aria-label="Buscar por cor, estampa ou código"
          value={busca}
          onChange={(ev) => setBusca(ev.target.value)}
        />
        {busca && (
          <button type="button" onClick={() => setBusca("")} aria-label="Limpar busca">
            <IconeFechar />
          </button>
        )}
      </div>
      <div className="chips" role="group" aria-label="Filtrar por linha">
        {chips.map(([id, rotulo]) => (
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

      {!termo && filtro === "tenis" ? (
        <BlocoTenis />
      ) : lista.length ? (
        <>
          <p className="contagem">
            {plural(lista.length, "modelo", "modelos")}
            {termo ? ` para “${busca.trim()}”` : ""}
          </p>
          <div className="vitrine">
            {lista.map((v) => (
              <CardModelo key={v.cod} v={v} />
            ))}
          </div>
        </>
      ) : (
        <div className="nada">
          <p>Nenhum modelo com “{busca.trim()}”.</p>
          <p className="nota">Tente uma cor (preta, azul), uma estampa (olho grego) ou um código (FP-13).</p>
        </div>
      )}
    </>
  );
}
