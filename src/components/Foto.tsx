type Props = { f: string; sizes: string; alt?: string; prioridade?: boolean; className?: string };

// Fotos já otimizadas em duas larguras (public/img/<f>-480.jpg e -1200.jpg).
export function Foto({ f, sizes, alt = "", prioridade = false, className }: Props) {
  return (
    <img
      className={className}
      src={`/img/${f}-480.jpg`}
      srcSet={`/img/${f}-480.jpg 480w, /img/${f}-1200.jpg 1200w`}
      sizes={sizes}
      alt={alt}
      loading={prioridade ? "eager" : "lazy"}
      fetchPriority={prioridade ? "high" : undefined}
      decoding="async"
    />
  );
}
