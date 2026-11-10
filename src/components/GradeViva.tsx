// A "grade viva": as numerações da grade fechada da linha. Quando a cor entra no pedido,
// as casinhas enchem de dourado com os pares de cada numeração. Só mostra: a fábrica não vende par a par.
// Usado só dentro de componentes de cliente.

import { linhaPorId, type Variacao } from "@/data/catalogo";
import { itemDe, usePedido } from "@/lib/carrinho";

export function GradeViva({ v }: { v: Variacao }) {
  const e = usePedido();
  const { g } = itemDe(e, v.cod);
  const grade = linhaPorId(v.linhaId)!.grade;
  const resumo = grade.map((t) => `${t.n}: ${t.q * g}`).join(", ");

  return (
    <div
      className={`grade-viva${grade.length === 2 ? " grade-2" : ""}${v.esgotado ? " esgotada" : ""}`}
      role="img"
      aria-label={g ? `No pedido: ${resumo}` : `Grade: ${grade.map((t) => `${t.n} ×${t.q}`).join(", ")}`}
    >
      {grade.map((t) => (
        <span key={t.n} className={g ? "cheia" : undefined}>
          <small>{t.n}</small>
          <b>{g ? t.q * g : `×${t.q}`}</b>
        </span>
      ))}
    </div>
  );
}
