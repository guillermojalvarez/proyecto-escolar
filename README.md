# Portal escolar — Guillermo J. Alvarez Briseño

Portal para padres, asesores y dirección de la **Escuela Secundaria Profesor y Licenciado Guillermo J. Alvarez Briseño**.

Stack: **Next.js + TypeScript + Tailwind + Supabase**, con demo usable sin `.env`.

## Arranque

```bash
npm install
npm run dev
```

Abre [http://127.0.0.1:3000](http://127.0.0.1:3000).

### Demo local (sin Supabase)

En `/login`:

- Clave alumno: `GAB-2026-0451` → vista padre
- Botones: Asesor / Dirección

Chats y lista de asistencia se guardan en `localStorage` (`gab_*`).

### Supabase

1. Copia `.env.local.example` → `.env.local` con URL y anon/publishable key
2. SQL Editor, en orden:
   - `supabase/migrations/20260803000000_portal_escolar.sql`
   - `supabase/seed.sql`
3. Crea usuarios Auth (Auto Confirm) con metadata `role` + `name`
4. Ejecuta `supabase/link_demo_users.sql`
5. (Opcional) `supabase/polish_accents.sql` si los textos quedaron sin tildes

Cuentas demo típicas:

| Email | Password | Rol |
|-------|----------|-----|
| `padre@gab.demo` | `Demo123456!` | padre |
| `asesor@gab.demo` | `Demo123456!` | asesor |
| `direccion@gab.demo` | `Demo123456!` | dirección |

## Rutas

| Ruta | Rol |
|------|-----|
| `/login` | público |
| `/padre` | padre |
| `/chat` | padre, asesor |
| `/asesor` | asesor |
| `/direccion` | dirección |

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm start` — servir build
