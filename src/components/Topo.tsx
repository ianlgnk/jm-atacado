"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { LOJA } from "@/config/loja";
import { focarCampoTemporario, pedirBusca } from "@/lib/busca";
import { img } from "@/lib/caminho";
import { usePedido } from "@/lib/carrinho";
import { alternarPainel, usePainel } from "@/lib/painel";
import { totais } from "@/lib/pedido";
import { IconeLupa, IconeSacola } from "./Icones";
import { LinkSecao } from "./LinkSecao";

const LINKS = [
  { href: "/", rotulo: "Início" },
  { href: "/catalogo/", rotulo: "Catálogo" },
  { href: "/#como", rotulo: "Como funciona" },
];

// Na página inicial o topo fica transparente sobre o vídeo e ganha fundo depois que a pessoa rola.
const assinarRolagem = (f: () => void) => {
  window.addEventListener("scroll", f, { passive: true });
  return () => window.removeEventListener("scroll", f);
};
const rolou = () => window.scrollY > 24;

export function Topo() {
  const caminho = usePathname();
  const router = useRouter();
  const e = usePedido();
  const aberto = usePainel();
  const passouDaCapa = useSyncExternalStore(assinarRolagem, rolou, () => false);
  const t = totais(e.itens);
  const naFinalizacao = caminho.startsWith("/pedido") || caminho.startsWith("/pagamento");
  const ativo = (href: string) =>
    href === "/catalogo/" ? ["/catalogo", "/linha", "/modelo"].some((p) => caminho.startsWith(p)) : href === "/" && caminho === "/";
  const sacola = (
    <>
      <IconeSacola />
      <span>Pedido</span>
      {t.pares > 0 && <span className="badge">{t.pares}</span>}
    </>
  );

  return (
    <header className={`topo${caminho === "/" ? " flutuante" : ""}${caminho === "/" && passouDaCapa ? " rolou" : ""}`}>
      <div className="wrap">
        <Link className="marca" href="/" aria-label={`${LOJA.nome}, início`}>
          <img src={img("logo-160.jpg")} alt="" width={34} height={34} />
          <b>JM Calçados</b>
        </Link>
        <nav className="nav-desk" aria-label="Seções">
          {LINKS.map((l) => (
            <LinkSecao key={l.href} href={l.href} aria-current={ativo(l.href) ? "page" : undefined}>
              {l.rotulo}
            </LinkSecao>
          ))}
        </nav>
        <div className="topo-acoes">
          <button
            type="button"
            className="busca-topo"
            aria-label="Buscar no catálogo"
            onClick={() => {
              focarCampoTemporario();
              if (caminho.startsWith("/catalogo")) pedirBusca();
              else router.push("/catalogo/?busca=1");
            }}
          >
            <IconeLupa />
            <span aria-hidden="true">Buscar no catálogo</span>
          </button>
          {naFinalizacao ? (
            <Link className="btn-pedido" href="/pedido/" aria-label={`Pedido: ${t.pares} pares`}>
              {sacola}
            </Link>
          ) : (
            <button type="button" className="btn-pedido" onClick={alternarPainel} aria-expanded={aberto} aria-label={`Pedido: ${t.pares} pares`}>
              {sacola}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
