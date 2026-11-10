// Usado só dentro de componentes de cliente (PainelPedido, Pedido).
import Link from "next/link";
import { CATEGORIAS, type Linha, type Variacao } from "@/data/catalogo";
import { img } from "@/lib/caminho";
import { itemDe, pedido, usePedido } from "@/lib/carrinho";
import { abrirFolha } from "@/lib/folhas";
import { brl } from "@/lib/formato";
import { paresDoItem, porNumeracao } from "@/lib/pedido";
import { IconeFechar, IconeMais } from "./Icones";

// Tabela de uma linha: cores nas linhas, numerações nas colunas, pares em cada célula.
export function Matriz({ linha, vars, aoSair }: { linha: Linha; vars: Variacao[]; aoSair?: () => void }) {
  const e = usePedido();
  const grade = CATEGORIAS[linha.categoria].grade;
  const colunas = porNumeracao(e.itens, linha.categoria, vars.map((v) => v.cod));
  const paresLinha = colunas.reduce((a, x) => a + x.pares, 0);

  return (
    <section className="matriz-bloco" aria-label={`${linha.nome}: pares por cor e numeração`}>
      <div className="matriz-cab">
        <b>{linha.nome}</b>
        <span>{brl(linha.preco)} o par</span>
      </div>
      <div className="matriz-rolagem">
        <table className="matriz">
          <thead>
            <tr>
              <th scope="col" className="col-cor">
                Cor
              </th>
              {grade.map((t) => (
                <th scope="col" key={t.n}>
                  {t.n}
                </th>
              ))}
              <th scope="col" className="col-tot">
                Pares
              </th>
            </tr>
          </thead>
          <tbody>
            {vars.map((v) => {
              const it = itemDe(e, v.cod);
              const p = paresDoItem(v.cod, it);
              return (
                <tr key={v.cod} className={p ? undefined : "zerada"}>
                  <th scope="row" className="col-cor">
                    <div className="cor">
                      <button type="button" className="cor-foto" onClick={() => abrirFolha({ tipo: "zoom", cod: v.cod })} aria-label={`Ampliar foto ${v.cod}`}>
                        <img src={img(`${v.foto}-480.jpg`)} alt="" loading="lazy" />
                      </button>
                      <div>
                        <b>{v.cod}</b>
                        <small>{v.nome}</small>
                        <span className="cor-acoes">
                          {!v.esgotado && (
                            <button type="button" onClick={() => pedido.maisGrade(v.cod)} aria-label={`Pôr uma grade de ${v.cod}`}>
                              <IconeMais /> grade
                            </button>
                          )}
                        </span>
                      </div>
                    </div>
                  </th>
                  {grade.map((t) => (
                    <td key={t.n}>
                      <input
                        className={`celula${it.p[t.n] ? " cheia" : ""}`}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                        disabled={v.esgotado}
                        aria-label={`${v.cod} ${v.nome}, pares ${t.n}`}
                        value={it.p[t.n] ? String(it.p[t.n]) : ""}
                        onFocus={(ev) => ev.currentTarget.select()}
                        onChange={(ev) => pedido.definirPar(v.cod, t.n, Number(ev.target.value.replace(/\D/g, "").slice(0, 4) || 0))}
                      />
                    </td>
                  ))}
                  <td className="col-tot">
                    <span className="tot-num">{p}</span>
                    <button type="button" className="remover-x" onClick={() => pedido.remover(v.cod)} aria-label={`Remover ${v.cod} do pedido`} title="Remover do pedido">
                      <IconeFechar />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="col-cor">
                Total
              </th>
              {colunas.map((x) => (
                <td key={x.n}>{x.pares}</td>
              ))}
              <td className="col-tot">{paresLinha}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="matriz-pe">
        <Link className="mais-cores" href={`/linha/${linha.id}/`} onClick={aoSair}>
          <IconeMais /> outras cores
        </Link>
        <span>
          {paresLinha} pares · <b>{brl(paresLinha * linha.preco)}</b>
        </span>
      </div>
    </section>
  );
}
