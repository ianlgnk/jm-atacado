"use client";

import { useSyncExternalStore } from "react";
import { LINHAS, VARIACOES, linhaPorId, paresDaGrade } from "@/data/catalogo";
import { img } from "@/lib/caminho";
import { abrirFolha } from "@/lib/folhas";
import { plural } from "@/lib/formato";
import { lerSeparar } from "@/lib/separar";
import { IconeWhatsApp } from "./Icones";

// Pedido com fotos para quem atende e para quem separa no estoque.
// O pedido vem do # do endereço; o "separado" de cada cor fica guardado só neste aparelho.

const assinarHash = (f: () => void) => {
  window.addEventListener("hashchange", f);
  return () => window.removeEventListener("hashchange", f);
};
const lerHash = () => window.location.hash;

const ouvintes = new Set<() => void>();
const assinarSeparados = (f: () => void) => {
  ouvintes.add(f);
  return () => ouvintes.delete(f);
};
const chave = (numero: string) => `jm-separado-${numero || "sem-numero"}`;
function lerSeparados(numero: string) {
  try {
    return localStorage.getItem(chave(numero)) ?? "[]";
  } catch {
    return "[]";
  }
}
function marcar(numero: string, cod: string, feito: boolean) {
  const atual = new Set<string>(JSON.parse(lerSeparados(numero)));
  if (feito) atual.add(cod);
  else atual.delete(cod);
  try {
    localStorage.setItem(chave(numero), JSON.stringify([...atual]));
  } catch {
    /* sem armazenamento: a marca vale só até fechar */
  }
  ouvintes.forEach((f) => f());
}

export function Separacao() {
  const hash = useSyncExternalStore(assinarHash, lerHash, () => "");
  const { numero, itens } = lerSeparar(hash);
  const separadosTexto = useSyncExternalStore(assinarSeparados, () => lerSeparados(numero), () => "[]");
  const separados = new Set<string>(JSON.parse(separadosTexto));

  const validos = itens.filter((i) => VARIACOES[i.cod]);
  const desconhecidos = itens.filter((i) => !VARIACOES[i.cod]);
  const porLinha = LINHAS.map((linha) => ({ linha, itens: validos.filter((i) => VARIACOES[i.cod].linhaId === linha.id) })).filter((x) => x.itens.length);
  const grades = validos.reduce((a, i) => a + i.g, 0);
  const pares = validos.reduce((a, i) => a + i.g * paresDaGrade(linhaPorId(VARIACOES[i.cod].linhaId)!), 0);
  const feitos = validos.filter((i) => separados.has(i.cod)).length;

  function enviar() {
    const url = window.location.href;
    const titulo = numero ? `Separar pedido ${numero}` : "Separar pedido";
    if (navigator.share) navigator.share({ title: titulo, text: titulo, url }).catch(() => {});
    else window.open(`https://wa.me/?text=${encodeURIComponent(`${titulo}: ${url}`)}`, "_blank", "noopener");
  }

  if (!hash) return <p className="sub separar-carregando">Abrindo o pedido…</p>;

  if (!validos.length) {
    return (
      <div className="vazio">
        <h1 className="titulo">Pedido não encontrado</h1>
        <p className="sub">Este link não tem modelos. Abra o link “Ver com fotos” que veio na mensagem do pedido.</p>
      </div>
    );
  }

  return (
    <div className="separar">
      <header className="separar-cab">
        <h1 className="titulo">{numero ? `Pedido ${numero}` : "Pedido"}</h1>
        <p className="sub">
          {plural(validos.length, "modelo", "modelos")} · {plural(grades, "grade", "grades")} · {pares} pares
          <span className="separar-progresso">
            {feitos === validos.length ? " · tudo separado" : ` · ${feitos} de ${validos.length} separados`}
          </span>
        </p>
        <div className="ctas separar-acoes">
          <button type="button" className="btn btn-tinta" onClick={enviar}>
            <IconeWhatsApp /> Enviar para quem separa
          </button>
          <button type="button" className="btn btn-contorno" onClick={() => window.print()}>
            Imprimir
          </button>
        </div>
      </header>

      {porLinha.map(({ linha, itens: daLinha }) => (
        <section key={linha.id} className="separar-linha">
          <div className="separar-linha-cab">
            <h2>{linha.nome}</h2>
            <span>1 grade = {linha.grade.map((t) => `${t.n} ×${t.q}`).join(" · ")}</span>
          </div>
          <ul className="separar-lista">
            {daLinha.map(({ cod, g }) => {
              const v = VARIACOES[cod];
              const feito = separados.has(cod);
              return (
                <li key={cod} className={`separar-item${feito ? " feito" : ""}`}>
                  <button type="button" className="separar-foto" onClick={() => abrirFolha({ tipo: "zoom", cod })} aria-label={`Ampliar foto ${cod}`}>
                    <img src={img(`${v.foto}-480.jpg`)} alt="" />
                  </button>
                  <div className="separar-info">
                    <b className="separar-cod">{cod}</b>
                    <span className="separar-nome">{v.nome}</span>
                    <span className="separar-qtd">
                      <b>{plural(g, "grade", "grades")}</b> · {g * paresDaGrade(linha)} pares
                    </span>
                    <small>{linha.grade.map((t) => `${t.n}: ${t.q * g}`).join(" · ")}</small>
                  </div>
                  <label className="separar-check">
                    <input type="checkbox" checked={feito} onChange={(ev) => marcar(numero, cod, ev.target.checked)} />
                    <span>Separado</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {desconhecidos.length > 0 && (
        <p className="nota separar-faltam">
          Não estão mais no catálogo: {desconhecidos.map((i) => `${i.cod} (${plural(i.g, "grade", "grades")})`).join(", ")}.
        </p>
      )}
    </div>
  );
}
