// A "grade viva": as numerações do modelo mostrando os pares que já estão no pedido.
// Usado só dentro de componentes de cliente. Tocar abre o editor por numeração.

import { linhaPorId, type Variacao } from "@/data/catalogo";
import { itemDe, usePedido } from "@/lib/carrinho";
import { abrirFolha } from "@/lib/folhas";

export function GradeViva({ v }: { v: Variacao }) {
  const e = usePedido();
  const it = itemDe(e, v.cod);
  const grade = linhaPorId(v.linhaId)!.grade;
  const resumo = grade.map((t) => `${t.n}: ${it.p[t.n] ?? 0}`).join(", ");

  return (
    <button
      type="button"
      className={`grade-viva${grade.length === 2 ? " grade-2" : ""}`}
      disabled={v.esgotado}
      onClick={() => abrirFolha({ tipo: "numeracao", cod: v.cod })}
      aria-label={`Editar pares por numeração de ${v.cod}. No pedido: ${resumo}`}
    >
      {grade.map((t) => {
        const q = it.p[t.n] ?? 0;
        return (
          <span key={t.n} className={q ? "cheia" : undefined}>
            <small>{t.n}</small>
            <b>{q || "–"}</b>
          </span>
        );
      })}
    </button>
  );
}
