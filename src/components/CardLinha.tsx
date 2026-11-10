import Link from "next/link";
import { paresPorGrade, type Linha } from "@/data/catalogo";
import { brl } from "@/lib/formato";
import { Foto } from "./Foto";

export function CardLinha({ linha: l, sizes = "(min-width:1100px) 25vw, (min-width:760px) 33vw, 50vw" }: { linha: Linha; sizes?: string }) {
  const disponiveis = l.variacoes.filter((v) => !v.esgotado).length;
  return (
    <Link className="card-linha" href={`/linha/${l.id}/`}>
      <div className="foto">
        <Foto f={l.capa} sizes={sizes} alt={l.nome} />
      </div>
      {l.lancamento && <span className="selo">Lançamento</span>}
      <div className="info">
        <h3>{l.nome}</h3>
        <div className="preco">
          {brl(l.preco)} <small>o par</small>
        </div>
        <div className="qtd-var">
          {disponiveis} {l.rotulo} · grade {brl(l.preco * paresPorGrade(l.categoria))}
        </div>
      </div>
    </Link>
  );
}
