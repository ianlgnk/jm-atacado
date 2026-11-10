"use client";

import { linhaPorId, paresDaGrade, VARIACOES } from "@/data/catalogo";
import { LOJA, linkWhatsApp } from "@/config/loja";
import { useAtendimento } from "@/lib/vendedor";
import { itemDe, pedido, usePedido } from "@/lib/carrinho";
import { brl, plural } from "@/lib/formato";
import { abrirPainel, abrirSeTelaLarga } from "@/lib/painel";
import { gradesCompletas, paresDoItem, totalAvulsos } from "@/lib/pedido";
import { IconeMais, IconeMenos, IconeSacola } from "./Icones";

// Parte de compra da tela do modelo: pares por numeração, + 1 grade e o total deste modelo.
export function CompraModelo({ cod }: { cod: string }) {
  const v = VARIACOES[cod];
  const linha = linhaPorId(v.linhaId)!;
  const grade = linha.grade;
  const e = usePedido();
  const { whatsapp } = useAtendimento();
  const it = itemDe(e, cod);
  const pares = paresDoItem(cod, it);
  const grades = gradesCompletas(cod, it);
  const avulsos = totalAvulsos(cod, it);

  const comAbertura = (fn: () => void) => () => {
    const vazio = !Object.keys(e.itens).length;
    fn();
    if (vazio) abrirSeTelaLarga();
  };

  if (v.esgotado) {
    return (
      <div className="compra esgotado">
        <p>Esta cor está esgotada no momento.</p>
        <a className="btn btn-contorno" href={linkWhatsApp(`Olá! O ${v.cod} ${v.nome} (${linha.nome}) vai voltar? Vim pelo catálogo da ${LOJA.nome}.`, whatsapp)} target="_blank" rel="noopener">
          Perguntar sobre reposição
        </a>
      </div>
    );
  }

  return (
    <div className="compra">
      <div className="compra-cab">
        <h2>Numeração</h2>
        <span>1 grade = {grade.map((t) => t.q).join("·")} ({paresDaGrade(linha)} pares)</span>
      </div>
      <div className="compra-tamanhos">
        {grade.map((t) => {
          const q = it.p[t.n] ?? 0;
          return (
            <div key={t.n} className={`tamanho${q ? " cheio" : ""}`}>
              <span className="tamanho-n">{t.n}</span>
              <button type="button" onClick={() => pedido.definirPar(cod, t.n, q - 1, false)} disabled={!q} aria-label={`Menos um par ${t.n}`}>
                <IconeMenos />
              </button>
              <output aria-live="polite" aria-label={`${q} pares ${t.n}`}>
                {q}
              </output>
              <button type="button" onClick={comAbertura(() => pedido.definirPar(cod, t.n, q + 1, false))} aria-label={`Mais um par ${t.n}`}>
                <IconeMais />
              </button>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn btn-tinta largo" onClick={comAbertura(() => pedido.maisGrade(cod))}>
        <IconeMais /> Pôr 1 grade · {brl(paresDaGrade(linha) * linha.preco)}
      </button>
      {pares > 0 && (
        <div className="compra-resumo">
          <span>
            <b>{plural(pares, "par", "pares")}</b>
            {grades ? ` · ${plural(grades, "grade", "grades")}` : ""}
            {avulsos ? ` + ${plural(avulsos, "avulso", "avulsos")}` : ""} · {brl(pares * linha.preco)}
          </span>
          <button type="button" className="link-acao" onClick={abrirPainel}>
            <IconeSacola /> Ver pedido
          </button>
        </div>
      )}
    </div>
  );
}
