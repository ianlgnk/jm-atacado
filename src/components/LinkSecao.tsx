"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { rolarAteSecao } from "@/lib/rolagem";

const semBarraNoFim = (c: string) => c.replace(/\/+$/, "") || "/";

// Link para uma seção (/#como, /linha/al/#cores).
// Em outra página, o Next navega e para na seção. Na mesma página a rolagem é nossa:
// o Next não rola de novo quando o endereço já tem o mesmo #, e assim o ponto de chegada é sempre o mesmo.
export function LinkSecao({ href, onClick, ...resto }: ComponentProps<typeof Link> & { href: string }) {
  const caminho = usePathname();
  const [destino, id = ""] = href.split("#");

  function aoClicar(ev: MouseEvent<HTMLAnchorElement>) {
    onClick?.(ev);
    if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
    if (!id || semBarraNoFim(destino) !== semBarraNoFim(caminho)) return;
    if (!rolarAteSecao(id)) return;
    ev.preventDefault();
    if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`);
  }

  return <Link href={href} onClick={aoClicar} {...resto} />;
}
