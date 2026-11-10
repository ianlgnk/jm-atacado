"use client";

import { ViewTransition, addTransitionType, startTransition, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { EVENTO_BUSCAR } from "@/lib/busca";
import { LINHAS, PUBLICOS, VARIACOES, type Publico } from "@/data/catalogo";
import { normalizar, plural } from "@/lib/formato";
import { BlocoTenis } from "./BlocoTenis";
import { CardModelo } from "./CardModelo";
import { IconeFechar, IconeLupa } from "./Icones";

type Filtro = "todos" | "lancamentos" | "tenis" | Publico | string; // string = id da linha

const ehPublico = (f: string): f is Publico => PUBLICOS.some((p) => p.id === f);

// Primeira fileira: o público. Escolhido um público, a segunda fileira mostra as linhas dele.
const FILEIRA_1: [Filtro, string][] = [
  ["todos", "Todos"],
  ["lancamentos", "Lançamentos"],
  ...PUBLICOS.map((p) => [p.id, p.nome] as [Filtro, string]),
  ["tenis", "Tênis"],
];

const semAssinatura = () => () => {};
const filtroDaUrl = () => new URLSearchParams(window.location.search).get("f") ?? "todos";

// Troca de filtro ou de busca como transição de vista: o card que continua desliza até o novo lugar,
// o que sai some encolhendo e o que chega cresce no lugar. Só anima com o tipo "filtro",
// para a navegação entre páginas não arrastar os 43 cards junto.
const CHEGA = { filtro: "card-chega", default: "none" };
const SAI = { filtro: "card-sai", default: "none" };
const MOVE = { filtro: "card-move", default: "none" };

// Vitrine com todos os modelos. /catalogo/?f=lancamentos, ?f=feminino ou ?f=<linha> abre já filtrado.
// O filtro do endereço é lido só no navegador (o servidor gera a vitrine com "Todos").
export function Catalogo() {
  const daUrl = useSyncExternalStore(semAssinatura, filtroDaUrl, () => "todos");
  const valido = (f: string) => ["todos", "lancamentos", "tenis", "chinelos"].includes(f) || ehPublico(f) || LINHAS.some((l) => l.id === f);
  const [escolhido, setFiltro] = useState<Filtro | null>(null);
  const filtro: Filtro = escolhido ?? (valido(daUrl) ? (daUrl === "chinelos" ? "todos" : daUrl) : "todos");
  const [busca, setBusca] = useState(""); // o que está no campo, na hora
  const [buscada, setBuscada] = useState(""); // o que a vitrine mostra, um instante depois de parar de digitar
  const [trocou, setTrocou] = useState(false);
  const campo = useRef<HTMLInputElement>(null);
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Depois da primeira troca a entrada em sequência sai de cena e a transição de vista cuida dos cards.
  function trocar(atualizar: () => void) {
    clearTimeout(espera.current);
    startTransition(() => {
      addTransitionType("filtro");
      setTrocou(true);
      atualizar();
    });
  }

  // Lupa do topo: /catalogo/?busca=1 (vindo de outra página) ou o evento (já no catálogo).
  useEffect(() => {
    const focar = () => campo.current?.focus({ preventScroll: true });
    if (new URLSearchParams(window.location.search).has("busca")) focar();
    const aoBuscar = () => {
      clearTimeout(espera.current);
      setFiltro("todos");
      setBusca("");
      setBuscada("");
      focar();
      campo.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    window.addEventListener(EVENTO_BUSCAR, aoBuscar);
    return () => {
      window.removeEventListener(EVENTO_BUSCAR, aoBuscar);
      clearTimeout(espera.current);
    };
  }, []);

  function digitar(valor: string) {
    setBusca(valor);
    clearTimeout(espera.current);
    espera.current = setTimeout(() => trocar(() => setBuscada(valor)), 160);
  }

  const termo = normalizar(buscada.trim());
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
        : ehPublico(filtro)
          ? todos.filter((v) => LINHAS.find((l) => l.id === v.linhaId)?.publico === filtro)
          : todos.filter((v) => v.linhaId === filtro);

  const publicoAtivo: Publico | null = termo ? null : ehPublico(filtro) ? filtro : (LINHAS.find((l) => l.id === filtro)?.publico ?? null);
  const linhasDoPublico = publicoAtivo ? LINHAS.filter((l) => l.publico === publicoAtivo) : [];
  const escolher = (id: Filtro) => {
    setBusca("");
    trocar(() => {
      setFiltro(id);
      setBuscada("");
    });
  };
  const mostraTenis = !termo && filtro === "tenis";
  const cards = mostraTenis ? [] : lista;

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
          onChange={(ev) => digitar(ev.target.value)}
        />
        {busca && (
          <button
            type="button"
            onClick={() => {
              setBusca("");
              trocar(() => setBuscada(""));
            }}
            aria-label="Limpar busca"
          >
            <IconeFechar />
          </button>
        )}
      </div>
      <div className="chips" role="group" aria-label="Filtrar por público">
        {FILEIRA_1.map(([id, rotulo]) => (
          <button
            key={id}
            type="button"
            className="chip"
            aria-pressed={!termo && (filtro === id || publicoAtivo === id)}
            onClick={() => escolher(id)}
          >
            {rotulo}
          </button>
        ))}
      </div>
      {publicoAtivo && (
        <div className="chips chips-linhas" role="group" aria-label={`Linhas ${PUBLICOS.find((p) => p.id === publicoAtivo)!.nome.toLowerCase()}`}>
          <button type="button" className="chip" aria-pressed={filtro === publicoAtivo} onClick={() => escolher(publicoAtivo)}>
            Todas
          </button>
          {linhasDoPublico.map((l) => (
            <button key={l.id} type="button" className="chip" aria-pressed={filtro === l.id} onClick={() => escolher(l.id)}>
              {l.curto}
            </button>
          ))}
        </div>
      )}

      {mostraTenis ? (
        <BlocoTenis />
      ) : lista.length ? (
        <p className="contagem">
          {plural(lista.length, "modelo", "modelos")}
          {termo ? ` para “${buscada.trim()}”` : ""}
        </p>
      ) : (
        <div className="nada">
          <p>Nenhum modelo com “{buscada.trim()}”.</p>
          <p className="nota">Tente uma cor (preta, azul), uma estampa (olho grego) ou um código (FP-13).</p>
        </div>
      )}
      {/* A vitrine fica sempre montada: os cards que continuam deslizam em vez de piscar. */}
      <div className={`vitrine${trocou ? "" : " anima"}`}>
        {cards.map((v, i) => (
          <ViewTransition key={v.cod} enter={CHEGA} exit={SAI} update={MOVE} default="none">
            <CardModelo v={v} ordem={i} />
          </ViewTransition>
        ))}
      </div>
    </>
  );
}
