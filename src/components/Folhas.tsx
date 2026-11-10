"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORIAS, VARIACOES, linhaPorId, paresPorGrade } from "@/data/catalogo";
import { img } from "@/lib/caminho";
import { itemDe, pedido, usePedido } from "@/lib/carrinho";
import { fecharFolha, useFolha } from "@/lib/folhas";
import { brl, plural } from "@/lib/formato";
import { abrirSeTelaLarga } from "@/lib/painel";
import { gradesCompletas } from "@/lib/pedido";
import { IconeFechar, IconeMais } from "./Icones";
import { Stepper } from "./Stepper";

// Folhas por cima da página: escolha de pares avulsos e foto ampliada.
export function Folhas() {
  const folha = useFolha();
  const veu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!folha) return;
    const antes = document.activeElement as HTMLElement | null;
    const esc = (ev: KeyboardEvent) => ev.key === "Escape" && fecharFolha();
    document.addEventListener("keydown", esc);
    veu.current?.querySelector<HTMLElement>("[data-foco]")?.focus();
    return () => {
      document.removeEventListener("keydown", esc);
      antes?.focus?.();
    };
  }, [folha]);

  if (!folha || !VARIACOES[folha.cod]) return null;

  return (
    <div className="veu" ref={veu} onClick={(ev) => ev.target === ev.currentTarget && fecharFolha()}>
      {folha.tipo === "numeracao" ? <Numeracao key={folha.cod} cod={folha.cod} /> : <Zoom cod={folha.cod} />}
    </div>
  );
}

function Numeracao({ cod }: { cod: string }) {
  const v = VARIACOES[cod];
  const linha = linhaPorId(v.linhaId)!;
  const grade = CATEGORIAS[linha.categoria].grade;
  const e = usePedido();
  const [tmp, setTmp] = useState<Record<string, number>>(() => ({ ...itemDe(e, cod).p }));
  const total = Object.values(tmp).reduce((a, q) => a + q, 0);
  const mudar = (n: string, d: number) => setTmp((s) => ({ ...s, [n]: Math.max(0, (s[n] ?? 0) + d) }));
  const umaGrade = () => setTmp((s) => Object.fromEntries(grade.map((t) => [t.n, (s[t.n] ?? 0) + t.q])));
  const grades = gradesCompletas(cod, { p: tmp });
  const avulsos = total - grades * paresPorGrade(linha.categoria);

  return (
    <div className="folha" role="dialog" aria-modal="true" aria-labelledby="num-t">
      <h2 id="num-t">
        {v.cod} · {v.nome}
      </h2>
      <p className="nota" style={{ marginBottom: 8 }}>
        {linha.nome} · {brl(linha.preco)} o par.{" "}
        <button type="button" className="link-num" onClick={umaGrade}>
          <IconeMais /> 1 grade
        </button>
      </p>
      {grade.map((t, i) => (
        <div className="linha-num" key={t.n}>
          <div>
            <b>{t.n}</b>
            <small>pares</small>
          </div>
          <div data-foco={i === 0 ? "" : undefined} tabIndex={-1} style={{ outline: "none" }}>
            <Stepper valor={tmp[t.n] ?? 0} rotulo={["par", "pares"]} nome={`Pares ${t.n}`} onMais={() => mudar(t.n, 1)} onMenos={() => mudar(t.n, -1)} />
          </div>
        </div>
      ))}
      <p className="nota" style={{ margin: "12px 0 14px" }}>
        {total
          ? `${plural(total, "par", "pares")} (${[grades ? plural(grades, "grade", "grades") : "", avulsos ? plural(avulsos, "avulso", "avulsos") : ""].filter(Boolean).join(" + ")}) · ${brl(total * linha.preco)}`
          : "Nenhum par escolhido."}
      </p>
      <div className="ctas">
        <button
          type="button"
          className="btn btn-tinta"
          style={{ flex: 1 }}
          onClick={() => {
            const vazio = !Object.keys(e.itens).length;
            pedido.definirPares(cod, tmp);
            fecharFolha();
            if (vazio && total) abrirSeTelaLarga();
          }}
        >
          Pronto
        </button>
        <button type="button" className="btn btn-contorno" onClick={fecharFolha}>
          Cancelar
        </button>
      </div>
      <p className="nota" style={{ marginTop: 12 }}>
        1 grade = {grade.map((t) => `${t.n} ×${t.q}`).join(" · ")}. A vendedora confirma se a numeração avulsa está disponível.
      </p>
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
