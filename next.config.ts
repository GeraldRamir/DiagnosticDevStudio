import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /**
   * El proyecto vive dentro de OneDrive y la sincronización llega a bloquear
   * archivos de `.next` durante el build. `NEXT_DIST_DIR` permite compilar
   * fuera de la carpeta sincronizada sin cambiar el flujo normal.
   */
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  turbopack: {
    root: projectRoot,
  },
  serverExternalPackages: [
    "@react-pdf/renderer",
    "@prisma/client",
    "@prisma/adapter-neon",
    "@neondatabase/serverless",
    "@google/genai",
    "resend",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
