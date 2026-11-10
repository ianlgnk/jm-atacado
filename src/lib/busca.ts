"use client";

// A lupa do topo leva ao catálogo com o filtro em "Todos" e o campo de busca focado.
// No iPhone o teclado só abre se algum campo ganhar foco no próprio toque, por isso
// um campo invisível recebe o foco na hora e o catálogo passa o foco adiante.

export const EVENTO_BUSCAR = "jm:buscar";

export function focarCampoTemporario() {
  let campo = document.getElementById("foco-busca") as HTMLInputElement | null;
  if (!campo) {
    campo = document.createElement("input");
    campo.id = "foco-busca";
    campo.type = "search";
    campo.setAttribute("aria-hidden", "true");
    campo.tabIndex = -1;
    campo.className = "foco-temporario";
    document.body.appendChild(campo);
  }
  campo.focus({ preventScroll: true });
}

export const pedirBusca = () => window.dispatchEvent(new Event(EVENTO_BUSCAR));
