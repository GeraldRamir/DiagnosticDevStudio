# Diagnóstico DevStudio — Sistema de diseño

> **Metáfora rectora:** instrumento de medición, no folleto. Consola de taller / equipo médico: precisión, lecturas en vivo, números que se mueven. Nada de gradientes genéricos ni copy de agencia.

---

## 1. Tokens de color

Definidos en `app/globals.css` como variables CSS. **Ningún color literal en componentes.**

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#0A1628` | Fondo principal (landing, formulario) |
| `--ink-2` | `#111F38` | Superficies elevadas, tarjetas oscuras |
| `--signal` | `#2563EB` | Azul de marca — estructura, datos, enlaces |
| `--flare` | `#FF6B2C` | Naranja de marca — **≤5% de cada pantalla**. Solo CTAs y el dato más crítico |
| `--mist` | `#F5F7FA` | Texto sobre oscuro; fondo del reporte (modo claro) |
| `--slate` | `#7A8699` | Texto secundario, ejes, etiquetas |
| `--good` | `#0FA97F` | Estado saludable en medidores y señales |
| `--warn` | `#F5A524` | Estado de advertencia |

### Modos de superficie

| Contexto | Fondo | Texto | Superficies |
|---|---|---|---|
| **Landing / formulario** | `--ink` + retícula 48px @ 8% opacidad | `--mist` / `--slate` | `--ink-2` |
| **Reporte / admin** | `--mist` | `--ink` / `--slate` | `#FFFFFF` con borde sutil |

**Cambio intencional de modo:** marketing oscuro → entregable claro. El reporte se lee como documento, no como landing.

### Regla del naranja

Si hay naranja en más de un lugar por vista (CTA + dato crítico + decoración), quitar decoración. El CTA gana siempre.

---

## 2. Tipografía

| Rol | Familia | Pesos | Uso |
|---|---|---|---|
| **Display** | Bricolage Grotesque | 600, 800 | Titulares, tracking cerrado, `text-balance` |
| **Cuerpo** | Inter | 400, 500 | Párrafos, labels, UI |
| **Datos** | JetBrains Mono | 400, 500 | **Todo número** — puntajes, horas, %, ejes. Siempre `tabular-nums` |

### Escala tipográfica (sin tamaños intermedios)

| Token Tailwind | px | Uso |
|---|---|---|
| `text-xs` | 12 | Etiquetas, metadata |
| `text-sm` | 14 | Cuerpo secundario, captions |
| `text-base` | 16 | Cuerpo principal |
| `text-lg` | 20 | Subtítulos, KPI labels |
| `text-xl` | 28 | Secciones |
| `text-2xl` | 40 | Titulares de sección |
| `text-3xl` | 64 | Hero secundario |
| `text-4xl` | 96 | Hero principal (solo landing) |

---

## 3. Elemento firma: `<Gauge />`

SVG puro, arco de 240°, componente reutilizable en:

1. Hero landing (medidor en vivo con datos rotativos)
2. Encabezado del reporte
3. Portada del PDF

**Comportamiento:**
- Arco anima 0 → valor con easing de instrumento (rápido al inicio, asentamiento al final)
- Aguja con ligero rebote al llegar
- Número central cuenta hacia arriba en mono
- Color del arco interpola: `--good` (80+) → `--warn` (40–79) → `--flare` (<40)
- `prefers-reduced-motion`: valor final directo, sin animación

---

## 4. Utilidades de layout

| Clase | Descripción |
|---|---|
| `ds-container` | max-width 72rem, padding horizontal 1.25rem |
| `ds-landing-bg` | Fondo `--ink` + retícula técnica 48px |
| `ds-report-bg` | Fondo `--mist`, texto `--ink` |
| `ds-card-dark` | Tarjeta sobre landing (`--ink-2`) |
| `ds-card-light` | Tarjeta sobre reporte (`#fff`) |
| `ds-mono-num` | JetBrains Mono + tabular-nums |

---

## 5. Movimiento

- **Una secuencia orquestada** al cargar la landing: medidor → texto
- **Revelaciones al scroll** escalonadas en secciones (Qué medimos)
- Sin parallax, sin elementos flotando
- Gráficos Recharts: animan al entrar en viewport; respetan `prefers-reduced-motion`
- Easing instrumento: `cubic-bezier(0.22, 1, 0.36, 1)`

---

## 6. Wireframe — Landing (`/`)

Modo oscuro. Retícula de fondo. Naranja solo en CTA.

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo DevStudio]                              [Privacidad]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    Tu negocio tiene un puntaje.             │
│   │              │    Descúbrelo en 2 minutos, gratis.          │
│   │   ╭──────╮   │                                              │
│   │  ╱  58   ╲  │    Analizamos presencia, operación y         │
│   │ │  /100  │  │    captación con datos reales.               │
│   │  ╲      ╱   │                                              │
│   │   ╰──────╯   │    ┌─────────────────────────────┐         │
│   │ Gimnasio·MX  │    │ Diagnóstico gratis en 2 min │ ← flare  │
│   └──────────────┘    └─────────────────────────────┘         │
│   ↑ medidor en vivo (rota cada 4s)                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  QUÉ MEDIMOS                                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ mini    │ │ mini    │ │ mini    │ │ mini    │ │ mini    │  │
│  │ gauge   │ │ gauge   │ │ gauge   │ │ gauge   │ │ gauge   │  │
│  │Presencia│ │Rendim.  │ │Captación│ │Operación│ │ Datos   │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  CÓMO SE VE TU REPORTE                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [mockup real del dashboard de reporte — modo claro]    │   │
│  │  gauge · KPIs · radar · hallazgos                       │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  01 ── Respondes     02 ── Analizamos     03 ── Recibes       │
│       4 pasos              en segundos          tu reporte    │
├─────────────────────────────────────────────────────────────────┤
│  [gauge de fondo tenue]                                         │
│         ┌─────────────────────────────┐                         │
│         │ Diagnóstico gratis en 2 min │ ← único flare          │
│         └─────────────────────────────┘                         │
├─────────────────────────────────────────────────────────────────┤
│  © DevStudio · Privacidad                                       │
└─────────────────────────────────────────────────────────────────┘
```

**Lo que NO va:** precios, logos falsos, testimonios inventados, sección "nosotros" genérica.

---

## 7. Wireframe — Reporte (`/reporte/[slug]`)

Modo claro. Documento-dashboard.

```
┌─────────────────────────────────────────────────────────────────┐
│  Restaurante La Esquina          ┌──────────┐                   │
│  Restaurante · México · 6 ago    │  gauge   │ 41 · Frágil       │
│                                  └──────────┘                   │
├─────────────────────────────────────────────────────────────────┤
│  "Tu operación depende demasiado de WhatsApp manual"           │
│  (headline IA — display grande, mucho aire)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ 41 /100  │ │ 47 hrs   │ │ 3 crít.  │ │ P34 ind. │          │
│  │ vs ind.  │ │ /mes     │ │          │ │          │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
├─────────────────────────────────────────────────────────────────┤
│  RADAR (5 pilares)          │  Barras horizontales detalle     │
│  ● negocio  ○ industria     │  Presencia ████░░ 14/25          │
├─────────────────────────────────────────────────────────────────┤
│  HORAS PERDIDAS — barra apilada + fórmula expandible           │
├─────────────────────────────────────────────────────────────────┤
│  PROYECCIÓN 12 MESES — area chart (actual vs automatizado)     │
├─────────────────────────────────────────────────────────────────┤
│  MATRIZ DE SEÑALES (~25) — semáforo por pilar                   │
├─────────────────────────────────────────────────────────────────┤
│  5 HALLAZGOS — tarjetas con severidad, qué / por qué          │
├─────────────────────────────────────────────────────────────────┤
│  QUICK WIN — fondo flare suave (único en la página)             │
├─────────────────────────────────────────────────────────────────┤
│  [Descargar PDF]  [Agendar llamada 15 min]                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Wireframe — Formulario (`/diagnostico`)

Mismo modo oscuro que landing. Barra de progreso arriba.

```
┌─────────────────────────────────────────────────────────────────┐
│  ████████░░░░░░░░  Paso 2 de 4                                  │
├─────────────────────────────────────────────────────────────────┤
│  Presencia digital                                              │
│                                                                 │
│  ¿Tienes sitio web?                                             │
│  ( ) Sí   ( ) No   ( ) Solo redes sociales                     │
│                                                                 │
│  URL del sitio (condicional)                                    │
│  [________________________________]                             │
│                                                                 │
│  Instagram (opcional)                                           │
│  [________________________________]                             │
│                                                                 │
│              [ ← Atrás ]    [ Continuar → ]                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Diferenciación vs. landing genérica de software

| Genérico (evitar) | Diagnóstico DevStudio |
|---|---|
| Hero con gradiente violeta y "transformamos tu negocio" | Medidor en vivo con datos reales rotando |
| 6 secciones de features con iconos Lucide | 4 secciones: qué medimos, mockup reporte, 3 pasos, cierre |
| Testimonios con fotos stock | Sin testimonios si no existen |
| Pricing cards | Sin precios — la venta es post-reporte |
| Números decorativos ("500+ clientes") | Solo números medidos del análisis |
| Mismo modo claro/oscuro en toda la app | Oscuro = marketing; claro = entregable |
| Sans-serif en puntajes | JetBrains Mono en **todo** dato numérico |

---

## 10. Accesibilidad y responsive

- Mínimo 360px — móvil es el caso principal (tráfico desde Instagram)
- Contraste AA mínimo en ambos modos
- Focus visible en todos los interactivos
- `prefers-reduced-motion` en gauge, scroll reveals y gráficos
- Reporte: gráficos apilados en móvil, radar con etiquetas abreviadas
