"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOJA } from "@/config/loja";
import { img } from "@/lib/caminho";
import { usePedido } from "@/lib/carrinho";
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
  const t = totais(e.itens);
  const ativo = (href: string) =>
    href === "/catalogo/" ? caminho.startsWith("/catalogo") || caminho.startsWith("/linha") : href === "/" && caminho === "/";

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
        <Link className="btn-pedido" href="/pedido/" aria-label={`Pedido: ${t.pares} pares`}>
          <IconeSacola /> Pedido <span className={`badge${t.pares ? "" : " zero"}`}>{t.pares}</span>
        </Link>
      </div>
    </header>
  );
}
