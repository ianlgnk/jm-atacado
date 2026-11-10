// Usado só dentro de componentes de cliente (PainelPedido, Pedido).
import { LinkSecao } from "./LinkSecao";
import { paresDaGrade, type Linha, type Variacao } from "@/data/catalogo";
import { img } from "@/lib/caminho";
import { itemDe, pedido, usePedido } from "@/lib/carrinho";
import { abrirFolha } from "@/lib/folhas";
import { brl, plural } from "@/lib/formato";
import { paresDoItem } from "@/lib/pedido";
import { IconeFechar, IconeMais, IconeMenos } from "./Icones";

// Tabela de uma linha: cada cor com quantas grades fechadas vão no pedido.
// A fábrica não vende par a par: a numeração aparece só como a composição da grade.
export function Matriz({ linha, vars, aoSair }: { linha: Linha; vars: Variacao[]; aoSair?: () => void }) {
  const e = usePedido();
  const porGrade = paresDaGrade(linha);
  const gradesLinha = vars.reduce((a, v) => a + itemDe(e, v.cod).g, 0);
  const paresLinha = gradesLinha * porGrade;
  const cor = linha.rotulo === "cores" ? "Cor" : "Estampa";

  return (
    <section className="matriz-bloco" aria-label={`${linha.nome}: grades por ${cor.toLowerCase()}`}>
      <div className="matriz-cab">
        <b>{linha.nome}</b>
        <span>{brl(linha.preco)} o par</span>
      </div>
      <p className="matriz-grade">
        1 grade = {linha.grade.map((t) => `${t.n} ×${t.q}`).join(" · ")} ({porGrade} pares)
      </p>
      <table className="matriz">
        <thead>
          <tr>
            <th scope="col" className="col-cor">
              {cor}
            </th>
            <th scope="col">Grades</th>
            <th scope="col" className="col-tot">
              Pares
            </th>
          </tr>
        </thead>
        <tbody>
          {vars.map((v) => {
            const it = itemDe(e, v.cod);
            return (
              <tr key={v.cod}>
                <th scope="row" className="col-cor">
                  <div className="cor">
                    <button type="button" className="cor-foto" onClick={() => abrirFolha({ tipo: "zoom", cod: v.cod })} aria-label={`Ampliar foto ${v.cod}`}>
                      <img src={img(`${v.foto}-480.jpg`)} alt="" loading="lazy" />
                    </button>
                    <div>
                      <b>{v.cod}</b>
                      <small>{v.nome}</small>
                    </div>
                  </div>
                </th>
                <td>
                  <span className="passo-grade passo-tabela" role="group" aria-label={`Grades de ${v.cod}`}>
                    <button type="button" onClick={() => pedido.menosGrade(v.cod)} aria-label={it.g > 1 ? `Tirar uma grade de ${v.cod}` : `Tirar ${v.cod} do pedido`}>
                      <IconeMenos />
                    </button>
                    <output aria-live="polite">{it.g}</output>
                    <button type="button" onClick={() => pedido.maisGrade(v.cod)} disabled={v.esgotado} aria-label={`Pôr mais uma grade de ${v.cod}`}>
                      <IconeMais />
                    </button>
                  </span>
                </td>
                <td className="col-tot">
                  <span className="tot-num">{paresDoItem(v.cod, it)}</span>
                  <button type="button" className="remover-x" onClick={() => pedido.remover(v.cod)} aria-label={`Remover ${v.cod} do pedido`} title="Remover do pedido">
                    <IconeFechar />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="matriz-pe">
        <LinkSecao className="mais-cores" href={`/linha/${linha.id}/#cores`} onClick={aoSair}>
          <IconeMais /> outras {linha.rotulo}
        </LinkSecao>
        <span>
          {plural(gradesLinha, "grade", "grades")} · {paresLinha} pares · <b>{brl(paresLinha * linha.preco)}</b>
        </span>
      </div>
    </section>
  );
}
