"use client";

import { useEffect, useRef } from "react";
import { video } from "@/lib/caminho";

// Vídeo da capa (Pexels, licença livre). Mudo e em loop; com "reduzir movimento" fica parado no primeiro quadro.
export function VideoCapa({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // o iOS só toca sozinho com a propriedade definida, não só o atributo
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.play().catch(() => {
      /* sem autoplay (modo economia): fica a imagem de capa */
    });
  }, []);

  return (
    <video ref={ref} className={className} autoPlay muted loop playsInline preload="metadata" poster={video("capa-poster.jpg")} aria-hidden="true">
      <source src={video("capa-720.webm")} type="video/webm" />
      <source src={video("capa-720.mp4")} type="video/mp4" />
    </video>
  );
}
