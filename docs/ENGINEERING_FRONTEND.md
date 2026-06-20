# Aurora — Reglas de ingeniería (Frontend)

Complemento técnico de `DESIGN.md` (que cubre tokens, componentes y voz visual) y de `ENGINEERING_BACKEND.md` (que cubre Supabase, base de datos y API). Este documento cubre **cómo se construye el código del cliente**: framework, manejo de estado, estructura de carpetas, convenciones y performance. Pensado para una sola app, un solo equipo, sin necesidad de SEO — las recomendaciones están ajustadas a ese contexto, no son "mejores prácticas universales" copiadas sin filtro.

Basado en consenso de fuentes de 2026 (ver razonamiento en cada sección). Si en seis meses el contexto cambia (por ejemplo, si la app necesita una landing pública indexable), revisar la sección 1 antes que ninguna otra.

---

## 1. Framework: React + Vite (no Next.js)

**Decisión: React + Vite + react-router. No Next.js.**

### Por qué

Next.js justifica su complejidad (Server Components, file-based routing, SSR, optimización automática de imágenes) cuando el proyecto necesita SEO o contenido público indexable por buscadores. Tu app es una SPA 100% detrás de login — nadie llega a una pantalla de práctica de inglés desde un resultado de Google.

El consenso técnico de 2026 es claro en este punto: para apps autenticadas tipo dashboard/herramienta, React + Vite es la recomendación estándar, incluso desde la propia documentación de React (que recomienda un framework como *default* pero lista Vite explícitamente como la opción avalada para SPAs que no encajan en las asunciones de un framework full-stack).

Lo que se gana con Vite en este caso:
- Arranque de servidor de desarrollo y hot-reload sensiblemente más rápidos
- Cero configuración de SSR/Server Components que no vas a usar
- Bundle final más liviano — gana en métricas de velocidad de interacción (TTI), que es justo lo que importa en una app de uso diario, no en carga inicial pública

### Setup inicial

```bash
npm create vite@latest aurora-app -- --template react-ts
```

- **TypeScript desde el día uno.** Retrofittear tipos a un codebase grande después es doloroso — empezarlo es prácticamente gratis con el template de Vite.
- **Routing**: `react-router` v7 (`react-router-dom`)
- **Data fetching**: `@tanstack/react-query` — ver sección 2

### Cuándo reconsiderar esta decisión

Si en el futuro la app necesita: (a) una landing pública de marketing, (b) contenido indexable en Google, o (c) server-side rendering por requisitos de performance específicos — ahí sí vale la pena evaluar migrar a Next.js. No antes.

---

## 2. Manejo de estado

La pregunta "¿qué librería de estado uso?" en realidad son **cuatro preguntas distintas** — el error más común en 2026 sigue siendo meter todo en una sola caja (típicamente Redux) en vez de usar la herramienta correcta para cada tipo de estado.

| Tipo de estado | Qué es, ejemplos en Aurora | Herramienta |
|---|---|---|
| **Estado de servidor** | Datos que vienen de una API: progreso del usuario, historial de lecciones, vault de recompensas | **TanStack Query** — siempre. Sin excepciones. |
| **Estado de formulario** | Inputs de un ejercicio, validación de respuestas | **React Hook Form** + **Zod** para validación |
| **Estado en la URL** | Qué lección está abierta, qué tab está activo (si es compartible/bookmarkeable) | `useSearchParams` de react-router |
| **Estado local de UI** | Modal abierto/cerrado, hover, qué carta está volteada (`WordCard`) | `useState` / `useReducer` — cubre la mayoría de los casos |
| **Estado global de cliente** | Tema claro/oscuro, sesión de usuario, racha actual en memoria | **Zustand** |

### Por qué Zustand y no Redux

- **Bundle**: Zustand ~3KB vs Redux Toolkit ~15KB — para una app que se usa a diario en el celular, ese peso importa en el tiempo de carga.
- **Sin Provider hell**: Redux necesita envolver la app en un `<Provider>`; Zustand no.
- **Menos boilerplate**: una tienda completa de Zustand cabe en ~12 líneas.
- Redux Toolkit sigue siendo válido para *equipos grandes (10+ devs)* que necesitan el patrón estricto y debugging de time-travel — no es el caso de un proyecto de una sola persona/equipo chico.

### Por qué NO meter datos de servidor en Zustand

Los datos que vienen de una API (historial, progreso, vault) **no son estado de cliente** — necesitan cache, revalidación en background, manejo de loading/error, invalidación tras una mutación. Reimplementar eso a mano dentro de un store de Zustand es reinventar TanStack Query peor. Regla dura: si el dato viene de un fetch, vive en React Query; si es puramente del cliente (UI, tema), vive en Zustand o `useState`.

### Ejemplo — store de tema (reemplaza el Context actual del showcase)

```ts
// src/stores/useThemeStore.ts
import { create } from 'zustand'

type ThemeMode = 'light' | 'dark'

interface ThemeStore {
  mode: ThemeMode
  toggle: () => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'dark',
  toggle: () => set((s) => ({ mode: s.mode === 'dark' ? 'light' : 'dark' })),
}))
```

Esto reemplaza el `ThemeContext` + `useTheme()` del artifact original — mismo concepto, sin Provider que envolver, y con menos re-renders innecesarios.

---

## 3. Estructura de carpetas

**Patrón: feature-based, no por tipo de archivo.** Es el consenso de 2026 para proyectos que van a crecer más allá de ~15 componentes: agrupar por *dominio de negocio* (lección, racha, recompensas) en vez de por tipo técnico (`/components`, `/hooks`, `/utils` planos) reduce la fricción de encontrar y modificar código relacionado.

El `design-system/` sí se mantiene agrupado por tipo (layout, primitives, forms...) porque ahí el "tipo" **es** la unidad de reutilización — un botón no pertenece a ninguna feature, pertenece a todas.

```
src/
├── design-system/        # ver DESIGN.md — tokens, componentes, layout primitives
│   ├── tokens/
│   ├── context/           # o stores/ si se migra a Zustand
│   ├── components/
│   │   ├── layout/
│   │   ├── primitives/
│   │   ├── forms/
│   │   ├── overlays/
│   │   └── feedback/
│   └── index.ts            # barrel export — único punto de entrada
│
├── features/                # un folder por dominio de negocio
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api.ts           # llamadas a la API de este feature
│   │   └── types.ts
│   ├── streak/
│   │   ├── components/      # StreakConstellation vive aquí
│   │   ├── hooks/            # useStreak.ts (React Query)
│   │   └── types.ts
│   ├── lessons/
│   │   ├── components/      # WordCard vive aquí
│   │   ├── hooks/
│   │   └── types.ts
│   └── rewards/
│       ├── components/       # RewardCard, RewardVault, etc.
│       ├── illustrations/    # SVGs de Dinner/Massage/Makeup/Date/Surprise
│       ├── hooks/
│       └── types.ts
│
├── stores/                  # Zustand: useThemeStore, useSessionStore
├── lib/                      # cliente de API, queryClient de React Query, utils puros
├── routes/                   # páginas — una por ruta, componen features
│   ├── Dashboard.tsx
│   ├── Lesson.tsx
│   └── Login.tsx
├── App.tsx                   # router + providers raíz
└── main.tsx
```

### Reglas de esta estructura

- Un componente que se usa en **más de un feature** sube a `design-system/`. Si se usa en uno solo, se queda en `features/<ese-feature>/components/`.
- Cada feature puede tener su propio `api.ts` con las llamadas a la API relevantes — no un `services/` global gigante.
- Las rutas (`routes/`) son delgadas: importan y componen piezas de `features/`, no contienen lógica de negocio propia.

---

## 4. Convenciones de componentes

- **Un componente, un archivo, mismo nombre**: `Button.tsx` exporta `Button`. Nada de `index.tsx` genérico salvo en los barrel files.
- **Props tipadas explícitamente** con `interface`, no `any` ni props implícitas:
  ```tsx
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'ghost' | 'glow'
    size?: 'sm' | 'md' | 'lg'
    icon?: LucideIcon
    onClick?: () => void
    disabled?: boolean
    children: React.ReactNode
  }
  ```
- **Separar UI de lógica de negocio con custom hooks.** Un componente de pantalla no debería tener `useEffect` con llamadas a fetch directas — esa lógica vive en un hook (`useStreak()`, `useLessonProgress()`) que internamente usa React Query.
- **Extraer un componente cuando hay una razón real**: se reutiliza en 2+ lugares, o un bloque de JSX supera ~60-80 líneas y tiene su propia responsabilidad clara. No extraer "por las dudas" — eso fragmenta sin necesidad.
- **Co-locar tests con el componente**: `Button.tsx` + `Button.test.tsx` en la misma carpeta, no en un `/tests` espejo aparte.
- Mantener las convenciones de accesibilidad ya establecidas en `DESIGN.md` (`aurora-focusable`, `aria-*`, touch target 44px) — no son opcionales al migrar de artifact a app real.

---

## 5. Performance

- **Code-splitting por ruta** con `React.lazy()` + `Suspense` — cada pantalla (`Lesson`, `Dashboard`, `Rewards`) se carga solo cuando se navega a ella.
- **`React.memo` solo donde hay un problema medido**, no preventivamente en todos lados — memoizar de más añade complejidad sin beneficio si el componente no re-renderiza con frecuencia.
- React 19 trae el **React Compiler**, que automatiza buena parte de la optimización de re-renders que antes requería `useMemo`/`useCallback` manual — escribir primero código simple y dejar que el compiler optimice, en vez de memoizar a mano de entrada.
- Animaciones (confeti de `RewardUnlockModal`, transiciones de tema) ya respetan `prefers-reduced-motion` — mantenerlo al portar a CSS real / Framer Motion si se adopta.

---

## 6. Testing

- **Vitest** como test runner (mismo motor que Vite, cero configuración extra) — es el estándar 2026 para proyectos Vite.
- **React Testing Library** — testear comportamiento (qué ve y puede hacer el usuario), no implementación interna.
- **Playwright** para los flujos críticos end-to-end (completar una lección → ver carta de recompensa → guardarla en la bóveda).
- Prioridad de qué testear primero en un proyecto chico: lógica de negocio en hooks (`useStreak`, validación de respuestas) > componentes de `design-system/` > flujos E2E críticos. No perseguir 100% de cobertura desde el día uno.

---

## 7. Checklist de arranque del repo

- [ ] `npm create vite@latest aurora-app -- --template react-ts`
- [ ] Instalar: `react-router-dom`, `@tanstack/react-query`, `zustand`, `react-hook-form`, `zod`, `lucide-react@0.383.0`
- [ ] Copiar `DESIGN.md` y este `ENGINEERING.md` a la raíz del repo
- [ ] Crear la estructura de carpetas de la sección 3 (vacía, con `.gitkeep` si hace falta)
- [ ] Migrar `aurora-design-system.jsx` pieza por pieza a `src/design-system/` siguiendo el mapeo ya definido en `DESIGN.md` §7
- [ ] Configurar Vitest + React Testing Library
- [ ] Primer commit: estructura + design system migrado, sin features de negocio todavía
