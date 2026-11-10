"use client";

// Rolagem até uma seção da própria página (#como, #cores).
// O desconto do topo fixo vem do CSS (scroll-padding-top no html), então o título da seção
// para logo abaixo do topo, venha a pessoa de cima ou de baixo.
// Se alguma coisa acima mudar de altura no meio do caminho (foto carregando), confere no fim e acerta.
export function rolarAteSecao(id: string) {
  const alvo = document.getElementById(id);
  if (!alvo) return false;
  const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  alvo.scrollIntoView({ block: "start", behavior: suave ? "smooth" : "auto" });

  const folga = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const conferir = () => {
    const fimDaPagina = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    if (!fimDaPagina && Math.abs(alvo.getBoundingClientRect().top - folga()) > 2) {
      alvo.scrollIntoView({ block: "start", behavior: "auto" });
    }
  };
  if ("onscrollend" in window) window.addEventListener("scrollend", conferir, { once: true });
  else setTimeout(conferir, 900);
  return true;
}
