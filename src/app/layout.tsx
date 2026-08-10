import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Inter,
  JetBrains_Mono,
  Outfit,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-doodi",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "800"],
});

const outfit = Outfit({
  variable: "--font-landing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Diagnóstico DevStudio",
    template: "%s · Diagnóstico DevStudio",
  },
  description:
    "Analiza la madurez digital de tu negocio y recibe un reporte con hallazgos concretos en 2 minutos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${plusJakarta.variable} ${bricolage.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
