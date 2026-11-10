export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

export const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

export const normalizar = (s: string) => semAcento(s).toLowerCase();

// (37) 99999-9999 enquanto a pessoa digita
export function mascaraTelefone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
