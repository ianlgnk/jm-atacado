"use client";

// Enquanto uma folha (pedido no celular, numeração, foto ampliada) está aberta, o resto da página
// fica "inert": o teclado e o leitor de tela não saem dela. Devolve a função que solta tudo.
// O fundo escuro clicável do painel (.painel-veu) não trava, para o toque fora continuar fechando.
export function prenderFocoEm(modal: HTMLElement | null) {
  if (!modal) return () => {};
  const travados: Element[] = [];
  for (const el of Array.from(document.body.children)) {
    if (el === modal || el.contains(modal)) continue;
    if (el.tagName === "SCRIPT" || el.hasAttribute("inert") || el.classList.contains("painel-veu")) continue;
    el.setAttribute("inert", "");
    travados.push(el);
  }
  return () => travados.forEach((el) => el.removeAttribute("inert"));
}
