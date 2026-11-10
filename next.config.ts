import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site estático: `npm run build` gera a pasta `out/`, que pode ir para qualquer hospedagem.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
