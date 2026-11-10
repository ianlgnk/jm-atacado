"use client";

import { useEffect, useRef } from "react";

// Barra de rolagem da página desenhada por cima do conteúdo (só em telas com mouse).
// A barra nativa ocupava uma faixa à direita e empurrava o layout; esta não ocupa espaço,
// aparece ao rolar ou ao passar o mouse na borda e pode ser arrastada.
export function BarraRolagem() {
  const trilho = useRef<HTMLDivElement>(null);
  const alca = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = trilho.current;
    const a = alca.current;
    if (!t || !a || !window.matchMedia("(pointer: fine)").matches) return;

    let esconder: ReturnType<typeof setTimeout> | undefined;
    let arrastando = false;
    let inicioY = 0;
    let inicioRolagem = 0;

    const medir = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight;
      const visivel = window.innerHeight;
      const sobra = total - visivel;
      t.hidden = sobra <= 2;
      if (sobra <= 2) return { sobra: 0, curso: 0 };
      const altura = Math.max(40, (visivel / total) * visivel);
      const curso = visivel - altura - 8;
      a.style.height = `${altura}px`;
      a.style.transform = `translateY(${(window.scrollY / sobra) * curso}px)`;
      return { sobra, curso };
    };

    const mostrar = () => {
      t.classList.add("ativa");
      clearTimeout(esconder);
      esconder = setTimeout(() => !arrastando && t.classList.remove("ativa"), 900);
    };

    const aoRolar = () => {
      medir();
      mostrar();
    };

    const aoApertar = (ev: PointerEvent) => {
      ev.preventDefault();
      arrastando = true;
      inicioY = ev.clientY;
      inicioRolagem = window.scrollY;
      try {
        a.setPointerCapture(ev.pointerId);
      } catch {
        /* ponteiro sintético: segue sem captura */
      }
      t.classList.add("ativa", "arrastando");
    };
    const aoMover = (ev: PointerEvent) => {
      if (!arrastando) return;
      const { sobra, curso } = medir();
      if (curso > 0) window.scrollTo(0, inicioRolagem + ((ev.clientY - inicioY) / curso) * sobra);
    };
    const aoSoltar = () => {
      arrastando = false;
      t.classList.remove("arrastando");
      mostrar();
    };
    // clique no trilho: pula uma tela para cima ou para baixo
    const aoClicarTrilho = (ev: PointerEvent) => {
      if (ev.target !== t) return;
      const r = a.getBoundingClientRect();
      window.scrollBy({ top: (ev.clientY < r.top ? -1 : 1) * window.innerHeight * 0.9, behavior: "smooth" });
    };

    const observador = new ResizeObserver(() => medir());
    observador.observe(document.body);
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    a.addEventListener("pointerdown", aoApertar);
    a.addEventListener("pointermove", aoMover);
    a.addEventListener("pointerup", aoSoltar);
    a.addEventListener("pointercancel", aoSoltar);
    a.addEventListener("lostpointercapture", aoSoltar);
    t.addEventListener("pointerdown", aoClicarTrilho);
    t.addEventListener("pointerenter", mostrar);
    medir();

    return () => {
      clearTimeout(esconder);
      observador.disconnect();
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      a.removeEventListener("pointerdown", aoApertar);
      a.removeEventListener("pointermove", aoMover);
      a.removeEventListener("pointerup", aoSoltar);
      a.removeEventListener("pointercancel", aoSoltar);
      a.removeEventListener("lostpointercapture", aoSoltar);
      t.removeEventListener("pointerdown", aoClicarTrilho);
      t.removeEventListener("pointerenter", mostrar);
    };
  }, []);

  return (
    <div ref={trilho} className="rolagem" aria-hidden="true" hidden>
      <div ref={alca} className="rolagem-alca" />
    </div>
  );
}
