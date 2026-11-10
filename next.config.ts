import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site estático: `npm run build` gera a pasta `out/`, que pode ir para qualquer hospedagem.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // No GitHub Pages o site mora em /jm-atacado/ (o workflow define NEXT_PUBLIC_BASE_PATH).
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  // Só no `npm run dev`: deixa abrir pelo celular na mesma rede (ex.: http://192.168.0.30:3007).
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
