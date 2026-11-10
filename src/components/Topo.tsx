"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOJA } from "@/config/loja";
import { img } from "@/lib/caminho";
import { usePedido } from "@/lib/carrinho";
import { alternarPainel, usePainel } from "@/lib/painel";
import { totais } from "@/lib/pedido";
import { IconeSacola } from "./Icones";

const LINKS = [
  { href: "/", rotulo: "Início" },
  { href: "/catalogo/", rotulo: "Catálogo" },
  { href: "/#como", rotulo: "Como comprar" },
];

export function Topo() {
  const caminho = usePathname();
  const e = usePedido();
  const aberto = usePainel();
  const t = totais(e.itens);
  const naFinalizacao = caminho.startsWith("/pedido") || caminho.startsWith("/pagamento");
  const ativo = (href: string) =>
    href === "/catalogo/" ? caminho.startsWith("/catalogo") || caminho.startsWith("/linha") : href === "/" && caminho === "/";
  const conteudo = (
    <>
      <IconeSacola /> Pedido <span className={`badge${t.pares ? "" : " zero"}`}>{t.pares}</span>
    </>
  );

  return (
    <header className="topo">
      <div className="wrap">
        <Link className="marca" href="/" aria-label={`${LOJA.nome}, início`}>
          <img src={img("logo-160.jpg")} alt="" width={40} height={40} />
          <span>
            <b>{LOJA.nome}</b>
            <small>Atacado · Nova Serrana</small>
          </span>
        </Link>
        <nav className="nav-desk" aria-label="Seções">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={ativo(l.href) ? "page" : undefined}>
              {l.rotulo}
            </Link>
          ))}
        </nav>
        {naFinalizacao ? (
          <Link className="btn-pedido" href="/pedido/" aria-label={`Pedido: ${t.pares} pares`}>
            {conteudo}
          </Link>
        ) : (
          <button type="button" className="btn-pedido" onClick={alternarPainel} aria-expanded={aberto} aria-label={`Pedido: ${t.pares} pares`}>
            {conteudo}
          </button>
        )}
      </div>
    </header>
  );
}
