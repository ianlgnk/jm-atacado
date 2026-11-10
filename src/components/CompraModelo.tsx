"use client";

import { linhaPorId, paresDaGrade, VARIACOES } from "@/data/catalogo";
import { LOJA, linkWhatsApp } from "@/config/loja";
import { useAtendimento } from "@/lib/vendedor";
import { itemDe, pedido, usePedido } from "@/lib/carrinho";
import { brl, plural } from "@/lib/formato";
import { abrirPainel, abrirSeTelaLarga } from "@/lib/painel";
import { paresDoItem } from "@/lib/pedido";
import { GradeViva } from "./GradeViva";
import { IconeMais, IconeMenos, IconeSacola } from "./Icones";

// Parte de compra da tela do modelo. Só grade fechada: a numeração é a composição da grade,
// e o lojista escolhe quantas grades desta cor quer.
export function CompraModelo({ cod }: { cod: string }) {
  const v = VARIACOES[cod];
  const linha = linhaPorId(v.linhaId)!;
  const e = usePedido();
  const { whatsapp } = useAtendimento();
  const it = itemDe(e, cod);
  const porGrade = paresDaGrade(linha);
  const pares = paresDoItem(cod, it);

  const mais = () => {
    const vazio = !Object.keys(e.itens).length;
    pedido.maisGrade(cod);
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
        <h2>Grade fechada</h2>
        <span>
          {porGrade} pares · {brl(porGrade * linha.preco)}
        </span>
      </div>
      <GradeViva v={v} />
      {it.g === 0 ? (
        <button type="button" className="btn btn-tinta largo" onClick={mais}>
          <IconeMais /> Pôr 1 grade · {brl(porGrade * linha.preco)}
        </button>
      ) : (
        <div className="compra-grades">
          <span className="passo-grade passo-grande" role="group" aria-label={`Grades de ${v.cod}`}>
            <button type="button" onClick={() => pedido.menosGrade(cod)} aria-label={it.g > 1 ? "Tirar uma grade" : "Tirar do pedido"}>
              <IconeMenos />
            </button>
            <output aria-live="polite">{plural(it.g, "grade", "grades")}</output>
            <button type="button" onClick={mais} aria-label="Pôr mais uma grade">
              <IconeMais />
            </button>
          </span>
          <span className="compra-total">
            <b>{plural(pares, "par", "pares")}</b> · {brl(pares * linha.preco)}
          </span>
        </div>
      )}
      {it.g > 0 && (
        <button type="button" className="link-acao" onClick={abrirPainel}>
          <IconeSacola /> Ver pedido
        </button>
      )}
    </div>
  );
}
