# Aurora Design System

Sistema de diseño para una app de práctica diaria de inglés. Concepto central: **cada palabra aprendida enciende una estrella**. El producto se siente como un cielo nocturno (o un papel claro con magia, en tema claro) que se ilumina con el progreso de quien practica.

Este documento es la fuente de verdad técnica del sistema — pensado para guiar una refactorización modular fuera del artifact original de un solo archivo (`aurora-design-system.jsx`).

---

## 1. Principios

1. **El brillo se gana.** El color `glow` aparece solo en momentos de logro: racha activa, respuesta correcta, carta de recompensa desbloqueada. Nunca es decorativo porque sí — si todo brilla, nada se siente especial.
2. **Noche profunda, no pastel.** El tema oscuro usa un violeta-noche real, no un rosa claro plano. El tema claro no es solo "invertir colores": el contraste se mueve a la saturación (colores más profundos sobre blanco), no a la oscuridad del fondo.
3. **Serif con calidez.** Fraunces en títulos da un toque editorial y humano frente al sans-serif frío típico de apps de productividad.

---

## 2. Tokens

### 2.1 Color — Tema oscuro (`dark`)

| Token | Valor | Uso |
|---|---|---|
| `bgDeep` | `#1A0E2E` | Fondo base de pantalla |
| `bgSurface` | `#2A1B45` | Cards, superficies elevadas |
| `bgSurfaceRaised` | `#35225A` | Superficies sobre cards (inputs, chips) |
| `primary` | `#C13FCC` | Acción principal (magenta) |
| `primaryDim` | `#8C2E94` | Variante atenuada de primary |
| `secondary` | `#7C4DFF` | Acentos de apoyo (violeta) |
| `glow` | `#FF8FE3` | Logro, celebración, foco emocional (rosa brillante) |
| `glowSoft` | `#FF8FE333` | Fondo sutil con tinte de glow |
| `success` | `#4ADE80` | Estado correcto/completado |
| `warning` | `#FBBF24` | Advertencia |
| `danger` | `#FB7185` | Error / acción destructiva |
| `text` | `#F5F0FF` | Texto principal |
| `textMuted` | `#B8A9D9` | Texto secundario |
| `textFaint` | `#7A6896` | Metadata, placeholders |
| `border` | `#3F2B63` | Bordes |
| `starColor` | `#FFFFFF` | Color de las partículas del Starfield |
| `focusRing` | `#FF8FE3` | Color del anillo de foco de teclado |

### 2.2 Color — Tema claro (`light`)

| Token | Valor | Uso |
|---|---|---|
| `bgDeep` | `#FBF7FF` | Fondo base de pantalla |
| `bgSurface` | `#FFFFFF` | Cards, superficies elevadas |
| `bgSurfaceRaised` | `#F6EEFC` | Superficies sobre cards |
| `primary` | `#B82FC2` | Acción principal |
| `primaryDim` | `#9421A0` | Variante atenuada de primary |
| `secondary` | `#6C3CE9` | Acentos de apoyo |
| `glow` | `#E0249A` | Logro, celebración |
| `glowSoft` | `#E0249A22` | Fondo sutil con tinte de glow |
| `success` | `#16A34A` | Estado correcto/completado |
| `warning` | `#D97706` | Advertencia |
| `danger` | `#E11D48` | Error / acción destructiva |
| `text` | `#2B1B42` | Texto principal |
| `textMuted` | `#6B5A85` | Texto secundario |
| `textFaint` | `#9C8BB5` | Metadata, placeholders |
| `border` | `#E7D9F4` | Bordes |
| `starColor` | `#B82FC2` | Color de las partículas del Starfield |
| `focusRing` | `#B82FC2` | Color del anillo de foco de teclado |

Cada tema también define: `heroGradient`, `shadowSm`, `shadow`, `shadowLg`, `shadowXl` (sombras con tinte de marca, no negro plano en modo claro).

### 2.3 Reglas de uso de color

| Color | Usar para | No usar para |
|---|---|---|
| **Glow** | Racha activa, respuesta correcta, carta desbloqueada, badge destacado | Decoración de fondo o elementos siempre visibles |
| **Primary** | Una sola acción principal por pantalla (botón "Continuar", tab activo) | Repetirlo en más de una acción principal en la misma vista |
| **Secondary** | Acentos de apoyo, mitad de gradientes, decoración de fondo | Como única señal de una acción que el usuario debe tomar |
| **Success / Danger / Warning** | Exclusivamente estado real del sistema (correcto / error / advertencia) | Por valor estético sin que haya pasado algo correcto/incorrecto |
| **Text / TextMuted / TextFaint** | Jerarquía de lectura (principal / secundario / metadata) | TextFaint nunca debe llevar información necesaria para continuar |

### 2.4 Tipografía

| Familia | Token | Uso | No usar para |
|---|---|---|---|
| **Fraunces** (serif) | `font.display` | Títulos de pantalla, nombre de lección, título de carta de recompensa | Párrafos largos o botones |
| **Inter** (sans) | `font.body` | Default de toda la UI: botones, inputs, body, navegación | — (es el default; úsala si dudas) |
| **JetBrains Mono** | `font.mono` | Números/datos: racha, XP, código de cupón, etiquetas tipo "NIVEL A2" | Nombres propios o frases — fuera de datos se lee robótica |

Import de Google Fonts: `Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700` + `Inter:wght@400;500;600;700` + `JetBrains+Mono:wght@500;600`

### 2.5 Espaciado, radios, iconos

```js
radius: { sm: '8px', md: '14px', lg: '22px', full: '999px' }
space: [0, 4, 8, 12, 16, 24, 32, 48, 64]   // escala base 4px
iconSize: { sm: 16, md: 20, lg: 24, xl: 32 }
container: { sm: '480px', md: '720px', lg: '960px', full: '100%' }
```

### 2.6 Z-index

```js
zIndex: {
  base: 0,
  dropdown: 30,
  sticky: 40,
  overlay: 90,
  modal: 100,
  toast: 200,
  tooltip: 250,
}
```

### 2.7 Breakpoints

```js
breakpoint: { mobile: '480px', tablet: '768px', desktop: '1024px', wide: '1280px' }
```

### 2.8 Motion

```js
duration: { fast: '0.15s', base: '0.25s', slow: '0.4s' }
easing: {
  standard:   'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0.16, 1, 0.3, 1)',  // entradas: modal, toast
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',      // salidas
  bounce:     'cubic-bezier(0.34, 1.56, 0.64, 1)', // streak / celebración
}
```

- `fast` → hover, foco
- `base` → modales, toasts
- `slow` → celebraciones de racha / desbloqueo de carta

### 2.9 Estados interactivos

```js
state: {
  hoverScale: 'scale(1.02)',
  activeScale: 'scale(0.97)',
  hoverLift: 'translateY(-2px)',
  disabledOpacity: 0.4,
  pressedOpacity: 0.85,
}
```

### 2.10 Accesibilidad

- **Touch target mínimo**: 44px (WCAG 2.5.5 / Apple HIG) — `tokens.touchTarget.min`
- **Foco de teclado**: visible solo vía navegación por teclado (`:focus-visible`), nunca al hacer click. Clase `aurora-focusable` + `focusRingStyle(c)` → `0 0 0 2px {bgSurface}, 0 0 0 4px {focusRing}`
- **`prefers-reduced-motion`**: respetado globalmente — todas las animaciones se acortan a 0.01ms si el sistema operativo lo pide
- Componentes interactivos llevan `aria-*` apropiado: `aria-pressed`, `aria-expanded`, `aria-selected`, `aria-current`, `aria-invalid`, `aria-label`, `role="radiogroup"`, etc.

---

## 3. Voz y tono

| Principio | Ejemplo |
|---|---|
| **Voz activa, sin relleno** | Botón dice "Guardar palabra", no "Enviar". Mismo verbo del botón al toast de confirmación. |
| **Errores sin disculpas** | Nunca "Oops, algo salió mal". Decir qué pasó y qué hacer: "Esa palabra no coincide. Revisa el tiempo verbal." |
| **Vacíos como invitación** | Un estado vacío explica qué va a aparecer ahí y da un botón para empezar — nunca solo "No hay datos". |
| **Cercano, no infantil** | Una racha de 4 días dice "4 días", no "¡¡¡Wow, 4 días seguidos!!!". El calor visual (glow, estrellas) ya comunica la calidez; el texto no necesita sobre-explicar. |

---

## 4. Inventario de componentes

### Layout primitives
| Componente | Props | Descripción |
|---|---|---|
| `Page` | `children, starDensity, padding='24px'` | Wrapper de pantalla completa: fondo con gradiente de tema + Starfield + safe area |
| `Container` | `children, size='lg'` (`sm│md│lg│full`) | Limita y centra el ancho de contenido |
| `Stack` | `children, direction='vertical', gap=3, align, justify, wrap=false` | Apila con flexbox y gap consistente desde `tokens.space` |
| `Grid` | `children, columns, minColWidth=200, gap=3` | Grid responsive auto-fit o columnas fijas |
| `Spacer` | `size=6, axis='vertical'` | Espaciador flexible |

### Componentes base
| Componente | Props principales |
|---|---|
| `Button` | `variant='primary│secondary│ghost│glow', size='sm│md│lg', icon, onClick, disabled` |
| `Card` | `padding=20, glow=false` |
| `Badge` | `variant='default│success│glow'` |
| `Avatar` | `initials, size=40, online=false` |
| `ProgressBar` | `value, max=100, label` |
| `Tooltip` | `children, label` |

### Formularios
| Componente | Props principales |
|---|---|
| `Input` | `label, placeholder, type='text', status='error│success', message, value, onChange` |
| `RadioGroup` | `label, options[], defaultValue, name` |
| `Checkbox` | `label, defaultChecked=false` |
| `Slider` | `label, min=0, max=100, defaultValue=50, unit=''` |
| `Select` | `label, options[], defaultValue` |
| `Switch` | `label, defaultChecked=false` |
| `Stepper` | `steps[], current=0` |

### Overlays y feedback
| Componente | Props principales |
|---|---|
| `Modal` | `open, onClose, title, children, footer` |
| `AlertDialog` | `open, onClose, onConfirm, variant='danger│success│info', title, description, confirmLabel, cancelLabel` |
| `Toast` | `open, onClose, variant='success│danger│info', message` (auto-cierra a los 3s) |
| `DropdownMenu` | `items[{label, icon, onClick, danger}]` |
| `Tabs` | `items[{value, label, content}], defaultValue` |
| `Accordion` | `items[{title, content}]` |
| `Table` | `columns[], rows[][]` |

### Estados de pantalla
| Componente | Props principales |
|---|---|
| `EmptyState` | `icon, title, description, actionLabel, onAction` |
| `Skeleton` / `SkeletonCard` | `width, height, radius` |

### Específicos del dominio (aprendizaje de inglés)
| Componente | Descripción |
|---|---|
| `StreakConstellation` | `lit, total` — racha semanal visualizada como estrellas que se encienden |
| `WordCard` | `word, translation, example` — flashcard que se voltea (click o teclado) |

### Sistema de recompensas (cupones coleccionables)
| Componente | Descripción |
|---|---|
| `RewardCard` | `category, title, subtitle, code, size` — carta coleccionable descargable como `.svg` |
| `RewardCardMini` | `category, title, onClick` — miniatura para grid de bóveda |
| `RewardUnlockModal` | `open, onClose, category, title, subtitle, code, onSaveToVault` — celebración con partículas al desbloquear |
| `RewardVault` | `items[{earned, category, title, subtitle, code, unlockHint}]` — colección persistente |
| `ParticleBurst` | `colors[]` — efecto de partículas tipo confeti-estrella |

5 categorías de recompensa, cada una con paleta e ilustración SVG original (sin stock/fotos):

| Categoría | Rareza | Ilustración |
|---|---|---|
| `dinner` (Cena) | special | Copa + tenedor + cuchillo |
| `massage` (Masaje) | special | Espiral concéntrica relajante |
| `makeup` (Maquillaje) | rare | Espejo de mano + brocha |
| `date` (Plan juntos) | unique | Dos lunas entrelazadas |
| `surprise` (Sorpresa) | common | Caja de regalo + constelación |

### Showcase / documentación interna
`IconChip`, `IconLibrary`, `Swatch`, `CodeBlock`, `DoDont`, `Section`, `MotionDemo` — componentes auxiliares usados solo dentro del showcase para documentar el propio sistema; no son parte de la librería de producto.

---

## 5. Cuándo usar qué (overlays)

| Situación | Usar |
|---|---|
| Mostrar contenido/detalle que la persona pidió ver | `Modal` |
| Confirmar una acción destructiva o que pierde progreso | `AlertDialog` (nunca `Modal`) |
| Confirmar que algo pasó, sin que la persona deba actuar | `Toast` (nunca si requiere una decisión) |
| Feedback de un ejercicio específico, en el momento | `Input status="error/success"` (no acumular en un resumen al final) |

---

## 6. Iconografía

**Librería**: [Lucide React](https://lucide.dev) `v0.383.0` — `npm install lucide-react@0.383.0`

Por qué: trazo fino (1.5–2px), esquinas redondeadas, coherente con el lenguaje delicado de Aurora sin competir con el glow. Usa `currentColor`, así hereda el color de tema automáticamente en claro/oscuro.

⚠️ **Usar siempre los nombres canónicos**, no los alias legacy (algunos entornos no resuelven alias):
- `CircleCheck` (no `CheckCircle2`)
- `CircleX` (no `XCircle`)

Set curado por categoría — ver `IconLibrary` en el archivo fuente para la lista completa organizada en: Navegación, Aprendizaje y práctica, Progreso y gamificación, Feedback y estado, Acciones de interfaz, Social y perfil.

---

## 7. Arquitectura técnica actual y siguiente paso

**Estado actual**: todo el sistema vive en un único archivo (`aurora-design-system.jsx`, ~2850 líneas) como artifact de React. Incluye: tokens, 50+ componentes, y un showcase interactivo (`AuroraApp`) que documenta todo en vivo con un toggle de tema claro/oscuro.

**Limitación conocida**: no es importable como librería (`import { Button } from 'aurora'`) en un proyecto real todavía. El showcase y los componentes están en el mismo archivo.

**Refactor recomendado al pasar a un repositorio real**:

```
src/
  tokens/
    colors.ts       # themes.dark / themes.light
    typography.ts   # font, iconSize
    spacing.ts       # radius, space, container
    motion.ts        # duration, easing, state
    a11y.ts           # touchTarget, focusRingStyle
  context/
    ThemeContext.tsx
  components/
    layout/         # Page, Container, Stack, Grid, Spacer
    primitives/      # Button, Card, Badge, Avatar, ProgressBar, Tooltip
    forms/            # Input, RadioGroup, Checkbox, Slider, Select, Switch, Stepper
    overlays/         # Modal, AlertDialog, Toast, DropdownMenu, Tabs, Accordion, Table
    feedback/         # EmptyState, Skeleton, SkeletonCard
    domain/
      StreakConstellation.tsx
      WordCard.tsx
      rewards/
        RewardCard.tsx
        RewardCardMini.tsx
        RewardUnlockModal.tsx
        RewardVault.tsx
        illustrations/   # Dinner, Massage, Makeup, Date, Surprise SVGs
  screens/            # pantallas reales de la app (fuera del scope del design system)
```

Este `DESIGN.md` debería vivir en la raíz del repo como referencia técnica al hacer ese split.

---

## 8. Checklist antes de dar por terminada una pantalla nueva

- [ ] Usa los tokens (`c.primary`, `tokens.radius...`) en vez de valores sueltos
- [ ] Todo elemento clicable tiene mínimo 44px de área tocable
- [ ] El foco de teclado es visible (`className="aurora-focusable"`)
- [ ] Hay un estado vacío y uno de carga, no solo el estado "feliz"
- [ ] El texto sigue la voz: activo, sin disculpas, mismo verbo de principio a fin
- [ ] Se ve bien en tema claro y oscuro
