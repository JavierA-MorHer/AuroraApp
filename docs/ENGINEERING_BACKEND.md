# Aurora — Reglas de ingeniería (Backend)

Complemento de `DESIGN.md` (visual) y `ENGINEERING_FRONTEND.md` (React + TS). Este documento cubre **dónde y cómo viven los datos**: backend-as-a-service, modelo de base de datos, seguridad, y cómo se conecta con el frontend ya decidido.

Contexto que define estas reglas: un solo proyecto, sin equipo de backend dedicado, presupuesto de hobby/indie, app 100% autenticada de uso diario.

---

## 1. Backend-as-a-Service: Supabase (no Firebase, no backend custom)

**Decisión: Supabase.**

### Por qué Supabase y no Firebase

| | Supabase | Firebase |
|---|---|---|
| Base de datos | PostgreSQL (SQL relacional) | Firestore (NoSQL documental) |
| Modelo de datos de Aurora | Encaja directo: usuario → racha → lecciones → cupones tiene relaciones claras | Requeriría denormalizar a mano |
| Pricing | Predecible, por recursos, con tope configurable | Por operación — puede dispararse sin aviso |
| Lenguaje de Edge Functions | TypeScript/Deno | Node.js, Python, Go (más runtimes, pero no TS-first) |

El dato decisivo: la app tiene **relaciones reales** entre entidades (un usuario tiene una racha, una racha se compone de sesiones de práctica, completar un módulo desbloquea un cupón de una categoría específica). Eso es exactamente el caso de uso para el que SQL es la herramienta correcta — modelarlo en Firestore significaría duplicar datos y sincronizarlos a mano.

### Por qué no un backend custom (Node.js/Express desde cero)

Construir y mantener tu propio servidor de auth, API REST y base de datos es trabajo real que Supabase ya resuelve. Esa complejidad solo se justifica con lógica de negocio muy específica que un BaaS no puede modelar — no es el caso de Aurora (CRUD + reglas de negocio simples sobre cuándo se desbloquea un cupón).

### Lo que Supabase resuelve de fábrica

| Necesidad de Aurora | Servicio de Supabase |
|---|---|
| Login (email, Google) | **Auth** |
| Guardar racha, progreso, vault de cupones | **Postgres** + API REST/GraphQL auto-generada |
| "Solo yo veo mi propio progreso" | **Row Level Security** (a nivel de base de datos, no en el cliente) |
| Lógica server-side (¿se desbloqueó una carta?) | **Edge Functions** (TypeScript/Deno) |
| Guardar el SVG descargable de cada carta ganada | **Storage** (buckets) |

### Pricing — lo que importa para este proyecto

- **Free tier (mientras se desarrolla)**: 500MB de base de datos, 50,000 usuarios autenticados, requests ilimitados. Más que suficiente para construir y probar.
- ⚠️ **Detalle crítico**: un proyecto free **se pausa tras 7 días sin actividad** — inaceptable para una app de uso diario en producción real, aunque sea de un solo usuario. Antes de que ella empiece a usarla de verdad, mover a **Pro (~$25/mes)**, que además da backups automáticos (el free tier no tiene).
- No hay necesidad de presupuestar esto hasta el lanzamiento real — desarrollar entero en free tier es correcto.

---

## 2. Modelo de datos

Esquema inicial derivado directamente de los componentes que ya existen en el design system (`StreakConstellation`, `WordCard`, `RewardVault`, las 5 categorías de `REWARD_CATEGORIES`).

```sql
-- Perfil de usuario (extiende la tabla auth.users que Supabase crea automáticamente)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  english_level text default 'A2',  -- A1 | A2 | B1 | B2 (ver Select del design system)
  theme_preference text default 'dark',  -- 'dark' | 'light'
  created_at timestamptz default now()
);

-- Racha diaria
create table streaks (
  user_id uuid references profiles(id) on delete cascade primary key,
  current_streak int default 0,
  longest_streak int default 0,
  last_practice_date date,
  updated_at timestamptz default now()
);

-- Módulos/lecciones disponibles (catálogo, igual para todos los usuarios)
create table modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,  -- 'phrasal_verbs' | 'listening' | 'grammar' | ...
  order_index int,
  created_at timestamptz default now()
);

-- Progreso del usuario en cada módulo
create table module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  module_id uuid references modules(id) on delete cascade,
  completed boolean default false,
  accuracy numeric(5,2),  -- ej: 92.50
  completed_at timestamptz,
  unique (user_id, module_id)
);

-- Vocabulario guardado (las WordCard que el usuario marca)
create table saved_words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  word text not null,
  translation text not null,
  example text,
  created_at timestamptz default now()
);

-- Cartas de recompensa ganadas — mapea directo a REWARD_CATEGORIES del design system
create table rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  category text not null check (category in ('dinner', 'massage', 'makeup', 'date', 'surprise')),
  title text not null,
  subtitle text,
  code text unique not null,        -- ej: 'AURORA-001'
  rarity text not null,              -- 'common' | 'rare' | 'special' | 'unique'
  unlocked_by_module_id uuid references modules(id),
  redeemed boolean default false,    -- si ya se "canjeó" en la vida real
  earned_at timestamptz default now()
);
```

### Notas de diseño del esquema

- `rewards.category` usa los mismos 5 valores que `REWARD_CATEGORIES` en `aurora-design-system.jsx` — mantener ambos sincronizados manualmente (no hay una fuente única todavía; ver sección 5).
- `module_progress` separado de `modules` permite que el catálogo de lecciones crezca sin tocar el progreso de cada usuario.
- `redeemed` en `rewards` existe porque el cupón representa algo que pasa *fuera* de la app (una cena real) — la app solo necesita saber si ya se usó, no gestionar el evento en sí.

---

## 3. Seguridad: Row Level Security (RLS)

**Regla no negociable: RLS activado en toda tabla que tenga datos de usuario, desde la primera migración.** Sin RLS, cualquier usuario autenticado podría leer el progreso o las cartas de cualquier otro usuario a través de la API auto-generada.

```sql
alter table profiles enable row level security;
alter table streaks enable row level security;
alter table module_progress enable row level security;
alter table saved_words enable row level security;
alter table rewards enable row level security;

-- Patrón repetido en cada tabla: el usuario solo ve/edita sus propias filas
create policy "Users manage their own data"
  on streaks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- modules es catálogo público — todos los usuarios autenticados pueden leer, nadie escribe desde el cliente
alter table modules enable row level security;
create policy "Anyone authenticated can read modules"
  on modules for select
  using (auth.role() = 'authenticated');
```

`modules` es la excepción: es contenido compartido (el catálogo de lecciones), no datos privados — política de solo lectura para cualquier usuario autenticado, sin escritura desde el cliente (eso se gestiona desde el dashboard de Supabase o una Edge Function con rol de servicio).

---

## 4. Lógica de servidor: Edge Functions

Usar una Edge Function (no lógica en el cliente) para cualquier operación que:
- Decide si se desbloquea una recompensa (no confiar en el cliente para esto — alguien podría manipular el request)
- Actualiza la racha al completar una práctica
- Genera el `code` único de una carta nueva

```ts
// supabase/functions/complete-module/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

serve(async (req) => {
  const { moduleId, accuracy } = await req.json()
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. Marcar el módulo como completado
  // 2. Actualizar la racha (streaks)
  // 3. Si corresponde, crear una fila en `rewards`
  // 4. Devolver el resultado para que el frontend dispare RewardUnlockModal

  return new Response(JSON.stringify({ unlockedReward: null /* o el objeto reward */ }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

Regla general: **todo lo que el design system muestra como "celebración" (`RewardUnlockModal`, actualización de `StreakConstellation`) debe originarse en una respuesta del servidor**, nunca calcularse de antemano en el cliente.

---

## 5. Conexión con el frontend (React Query + Supabase)

Ya definido en `ENGINEERING_FRONTEND.md`: los datos de servidor viven en **TanStack Query**, nunca en Zustand. Supabase entrega un cliente JS que se integra directo:

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

```ts
// src/features/streak/hooks/useStreak.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useStreak(userId: string) {
  return useQuery({
    queryKey: ['streak', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (error) throw error
      return data
    },
  })
}
```

```ts
// src/features/rewards/hooks/useCompleteModule.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useCompleteModule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ moduleId, accuracy }: { moduleId: string; accuracy: number }) => {
      const { data, error } = await supabase.functions.invoke('complete-module', {
        body: { moduleId, accuracy },
      })
      if (error) throw error
      return data  // { unlockedReward: {...} | null }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streak'] })
      queryClient.invalidateQueries({ queryKey: ['rewards'] })
    },
  })
}
```

El componente de pantalla solo consume el hook y decide si mostrar `RewardUnlockModal` según `data.unlockedReward` — toda la lógica de negocio queda en la Edge Function, no en React.

---

## 6. Variables de entorno

```bash
# .env.local — nunca commitear
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>

# Solo en Edge Functions (servidor), nunca expuesta al cliente
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

La `anon key` es segura de exponer en el cliente — es pública por diseño, y RLS es lo que realmente protege los datos (sección 3). La `service_role` key **nunca** debe llegar al bundle de frontend; vive solo en el entorno de las Edge Functions.

---

## 7. Checklist de arranque del backend

- [ ] Crear proyecto en Supabase (free tier para desarrollo)
- [ ] Correr las migraciones de la sección 2 (`supabase migration new init_schema`)
- [ ] Activar RLS y las policies de la sección 3 en cada tabla con datos de usuario
- [ ] Configurar Auth (email + Google) desde el dashboard de Supabase
- [ ] Crear la Edge Function `complete-module` como esqueleto (sección 4)
- [ ] Instalar `@supabase/supabase-js` en el frontend y crear `src/lib/supabase.ts`
- [ ] Variables de entorno en `.env.local`, agregadas a `.gitignore`
- [ ] Antes de que la app pase de "desarrollo" a "uso real diario": migrar a plan Pro para evitar el auto-pausado del free tier
