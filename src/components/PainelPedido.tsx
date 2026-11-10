"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { usePedido } from "@/lib/carrinho";
import { brl, plural } from "@/lib/formato";
import { fecharPainel, usePainel, useTelaLarga } from "@/lib/painel";
import { grupos, totais } from "@/lib/pedido";
import { IconeFechar, IconeSeta } from "./Icones";
import { DesfazerRemocao } from "./DesfazerRemocao";
import { Matriz } from "./Matriz";
import { RepetirUltimo } from "./RepetirUltimo";

// Painel do pedido: à direita empurrando a página no computador; folha de baixo no celular.
export function PainelPedido() {
  const aberto = usePainel();
  const larga = useTelaLarga();
  const caminho = usePathname();
  const e = usePedido();
  const titulo = useRef<HTMLHeadingElement>(null);
  const naFinalizacao = caminho.startsWith("/pedido") || caminho.startsWith("/pagamento");
  const visivel = aberto && !naFinalizacao;

  useEffect(() => {
    document.body.classList.toggle("painel-aberto", visivel);
    return () => document.body.classList.remove("painel-aberto");
  }, [visivel]);

  useEffect(() => {
    if (!visivel) return;
    if (!larga) titulo.current?.focus();
    const esc = (ev: KeyboardEvent) => {
      if (ev.key === "Escape" && !document.querySelector(".veu")) fecharPainel();
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [visivel, larga]);

  if (!visivel) return null;

  const t = totais(e.itens);
  const gs = grupos(e.itens, true);
  const sairNoCelular = () => {
    if (!larga) fecharPainel();
  };

  return (
    <>
      {!larga && <div className="painel-veu" onClick={fecharPainel} aria-hidden="true" />}
      <aside className="painel" role={larga ? "complementary" : "dialog"} aria-modal={larga ? undefined : true} aria-labelledby="painel-t">
        <div className="painel-cab">
          <div>
            <h2 id="painel-t" ref={titulo} tabIndex={-1}>
              Seu pedido
            </h2>
            <p>{t.pares ? `${plural(t.pares, "par", "pares")} · ${brl(t.valor)}${e.numero ? ` · ${e.numero}` : ""}` : "Nada escolhido ainda"}</p>
          </div>
          <button type="button" className="fechar-painel" onClick={fecharPainel} aria-label="Fechar o pedido">
            <IconeFechar />
          </button>
        </div>

        <div className="painel-corpo">
          <DesfazerRemocao />
          {gs.length ? (
            <>
              <p className="nota">Digite os pares de cada numeração ou use “+ grade” para somar 2-4-4-2.</p>
              {gs.map((g) => (
                <Matriz key={g.linha.id} linha={g.linha} vars={g.vars} aoSair={sairNoCelular} />
              ))}
            </>
          ) : (
            <div className="painel-vazio">
              <p className="sub">Toque em + nos modelos para montar o pedido. Ele aparece aqui, com as grades por numeração.</p>
              <RepetirUltimo />
            </div>
          )}
        </div>

        {t.pares > 0 && (
          <div className="painel-pe">
            <div className="painel-totais">
              <span>
                {plural(t.grades, "grade", "grades")}
                {t.avulsos ? ` + ${plural(t.avulsos, "avulso", "avulsos")}` : ""} · {plural(t.modelos, "modelo", "modelos")}
              </span>
              <b>{brl(t.valor)}</b>
            </div>
            <Link className="btn btn-tinta largo" href="/pedido/" onClick={sairNoCelular}>
              Finalizar pedido <IconeSeta />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
