# Diagnóstico DevStudio

Aplicación web que analiza la madurez digital de un negocio y genera un reporte automático. Herramienta de captación de leads para DevStudio.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Prisma 7 + Neon PostgreSQL
- Google Gemini 2.5 Flash-Lite (narrativa)
- PageSpeed Insights, Resend, Recharts, Motion, @react-pdf/renderer

## Setup

```bash
npm install
cp .env.example .env   # completar valores
npm run db:migrate     # migraciones locales
npm run dev
```

## Variables de entorno

Ver `.env.example`. Requiere:

- `DATABASE_URL` — Neon pooled (app)
- `DIRECT_URL` — Neon directo (migraciones Prisma)
- `GEMINI_API_KEY`, `PAGESPEED_API_KEY`, `RESEND_API_KEY`
- `ADMIN_PASSWORD`, `NEXT_PUBLIC_APP_URL`

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run test` | Vitest (scoring, hours) |
| `npm run db:migrate` | Migraciones Prisma |
| `npm run logo:transparent` | Quita fondo negro del logo → PNG transparente |

## Diseño

Ver [DESIGN.md](./DESIGN.md) para tokens, tipografía y wireframes.
