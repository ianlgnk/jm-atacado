// No GitHub Pages o site fica em /jm-atacado/. Links do next/link já recebem o prefixo;
// arquivos de public/ usados em <img> precisam dele à mão.
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const img = (arquivo: string) => `${BASE}/img/${arquivo}`;

export const video = (arquivo: string) => `${BASE}/video/${arquivo}`;
