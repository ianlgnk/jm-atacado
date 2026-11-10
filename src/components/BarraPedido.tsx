"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePedido } from "@/lib/carrinho";
import { brl, plural } from "@/lib/formato";
import { totais } from "@/lib/pedido";

// Barra fixa com o resumo do pedido. Some nas telas do próprio pedido.
export function BarraPedido() {
  const caminho = usePathname();
  const e = usePedido();
  const t = totais(e.itens);
  const [pulso, setPulso] = useState(false);
  const anterior = useRef(t.pares);

  useEffect(() => {
    if (t.pares !== anterior.current) {
      anterior.current = t.pares;
      setPulso(true);
      const id = setTimeout(() => setPulso(false), 450);
      return () => clearTimeout(id);
    }
  }, [t.pares]);

  if (!t.pares || caminho.startsWith("/pedido") || caminho.startsWith("/pagamento")) return null;

  return (
    <>
      <div className="barra-espaco" aria-hidden="true" />
      <div className={`barra${pulso ? " pulso" : ""}`}>
        <Link href="/pedido/">
          <span className="resumo">
            <b>
              {t.pares} pares · {brl(t.valor)}
            </b>
            <span>
              {plural(t.grades, "grade", "grades")}
              {t.avulsos ? ` + ${plural(t.avulsos, "avulso", "avulsos")}` : ""} · {plural(t.modelos, "modelo", "modelos")}
            </span>
          </span>
          <span className="ir">Ver pedido →</span>
        </Link>
      </div>
    </>
  );
}
