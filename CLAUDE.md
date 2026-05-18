# RepoWebSchujman — Project Context

Login + Register fullstack para cátedra "Aplicaciones Específicas de Redes" (Instituto Politécnico Superior General San Martín). Deploy a servidor de clase administrado con PM2 + reverse proxy Apache.

**Usuario de cátedra**: `seis`. El `vite.config.js` tiene `base: '/~seis/'` hardcodeado — si esto se reutiliza para otro alumno, cambiar ahí.

---

## Stack

### Backend (`backend/`)
- **TypeScript** estricto, **CommonJS** (`tsconfig.json` con `module: "commonjs"`, `target: "ES2020"`)
- **Express 4.21** + **Prisma 6.19** + **SQLite** (`@prisma/client` 6.19.3)
- **bcrypt 5** (rounds=12) + **jsonwebtoken 9** + **zod 4** + **express-rate-limit 8**
- **dotenv** para `.env` — `JWT_SECRET` es REQUERIDO, el server muere si falta
- Build: `tsc` → `dist/`. Dev: `ts-node-dev`
- Entry: `src/index.ts`

### Frontend (`frontend/`)
- **React 19.2** + **Vite 8** + **React Router 7** + **Axios 1.16**
- **Tailwind CSS v4** (CSS-first via `@import "tailwindcss"` + `@theme` con tokens OKLCH)
- **`@tailwindcss/vite`** como plugin (NO usar PostCSS/Autoprefixer — ya no hace falta en v4)
- Composición de clases: `clsx` + `tailwind-merge` + `class-variance-authority` (helper en `src/lib/cn.js`)
- Atomic design: `components/atoms/`, `components/molecules/`, `components/organisms/`
- Entry: `src/main.jsx`. Auth state: `src/context/AuthContext.jsx` + `src/context/auth-context.js` (separados para evitar warning de react-refresh)

### Monorepo
- Root tiene `concurrently` con script `dev` que levanta backend + frontend en paralelo
- `npm run dev` arranca ambos: backend en `:3001`, Vite en `:5173`

---

## Convenciones críticas (de la guía de cátedra `GUIA_SCHUJMAN_2026.pdf`)

### Import de Prisma (¡NO usar named import!)
```ts
// ✅ Como dice la guía
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

// ❌ NO HACER
import { PrismaClient } from "@prisma/client";
```
Mismo patrón para `Prisma` (namespace) cuando se necesita `PrismaClientKnownRequestError`.

### Express listen con `'0.0.0.0'`
```ts
app.listen(env.port, "0.0.0.0", () => { ... });
```
Sin esto, no escucha en todas las interfaces y el reverse proxy del server no llega.

### Reverse proxy reescribe paths
El proxy Apache del server entrega los requests **SIN el prefix `/api`**. Es decir: cuando el browser pide `POST /~seis/api/auth/login`, Express recibe `POST /auth/login`. Por eso `index.ts` monta los routers DOS veces:
```ts
app.use("/auth", authRouter);       // ← para el server
app.use("/api/auth", authRouter);   // ← para dev local
app.use("/health", healthRouter);
app.use("/api/health", healthRouter);
```

### `trust proxy` obligatorio
```ts
app.set("trust proxy", 1);
```
Sin esto, `express-rate-limit` lanza `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` y crashea las requests.

### Detección automática de API_BASE en frontend
`src/lib/api.js` usa el snippet exacto de la guía:
```js
const API_BASE = window.location.pathname.startsWith('/~')
  ? `/${window.location.pathname.split('/')[1]}/api`
  : 'http://localhost:3001/api'
```
NO hardcodear `localhost:3001` en ningún componente; usar siempre `import { api } from '../lib/api'`.

### `base` de Vite hardcodeado
`vite.config.js` tiene `base: '/~seis/'`. El `BrowserRouter` recibe `basename={import.meta.env.BASE_URL}` para que el routing funcione bajo el subpath.

---

## Variables de entorno

### `backend/.env` (LOCAL, no committeado)
```
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="<random 48 bytes base64url>"
```
Generar JWT: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`

### `~/servicios/.env` en el SERVER (no se sube, ya está)
```
PORT=3006
SERVER_IP=0.0.0.0
DATABASE_URL="file:./seis.db"   ← cambiado de dev.db porque root es dueño del original
JWT_SECRET="<mismo o distinto, decisión>"
```

---

## Servidor de cátedra

| Dato | Valor |
|------|-------|
| IP | `200.3.127.46` |
| Puerto web | `8002` |
| Puerto SSH | **`22002`** (NO 22 — la guía dice 22 pero está cerrado externamente) |
| Usuario | `seis` |
| Password | `Faro2026` |
| Frontend URL | http://200.3.127.46:8002/~seis/ |
| API URL | http://200.3.127.46:8002/~seis/api/ |
| Health | http://200.3.127.46:8002/~seis/api/health |

### Restricciones del entorno
- `seis` **NO tiene sudo**
- `~/servicios/prisma/dev.db` y `~/servicios/prisma/migrations/` son propiedad de **root** → `scp -r prisma/*` falla. Workaround: `DATABASE_URL="file:./seis.db"` (archivo propio) + `npx prisma db push` en el server cuando cambia el schema.
- `sqlite3` CLI no está instalado en el server
- `node_modules` del server SE INSTALAN ahí (no se suben) — la guía es clara: "Nunca subas node_modules/"

### Estado actual del server
- PM2 corre proceso `servicios` (id 0) → `node dist/index.js`, puerto 3006
- `~/public_html/` tiene el build del frontend
- `~/servicios/dist/` tiene el build compilado del backend
- `seis.db` con tabla `User` ya creada (smoke user `smoke-test@example.com` / `smokepass123` presente)

---

## Deploy workflow

### Comandos de cero a deploy completo
```bash
# 1. Build local
cd frontend && npm run build           # → frontend/dist/
cd ../backend && npm run build         # → backend/dist/ (vía tsc)

# 2. SCP frontend (puerto 22002, NO 22)
sshpass -p 'Faro2026' scp -P 22002 -r frontend/dist/* seis@200.3.127.46:~/public_html/

# 3. SCP backend (PM2 watch reinicia automático en ~2s)
sshpass -p 'Faro2026' scp -P 22002 -r backend/dist/* seis@200.3.127.46:~/servicios/dist/

# 4. (Solo si cambió el schema) — sync DB en el server por SSH
sshpass -p 'Faro2026' ssh -p 22002 seis@200.3.127.46 'cd ~/servicios && npx prisma db push'

# 5. Verificar
curl http://200.3.127.46:8002/~seis/api/health
```

### Después de instalar deps nuevas
La guía dice: SSH al server, `cd ~/servicios`, `npm install <pkg>`, luego rebuild local y re-SCP del dist.
Ya están instaladas en el server: `bcrypt`, `jsonwebtoken`, `zod`, `express-rate-limit`, `@prisma/client`, `cors`, `dotenv`, `express`.

### Logs en producción
```bash
ssh -p 22002 seis@200.3.127.46
pm2 logs servicios              # tiempo real
pm2 logs servicios --lines 50   # últimas 50
pm2 list                        # estado
pm2 restart servicios           # reinicio manual
pm2 flush servicios             # vaciar logs
```

---

## Estructura del proyecto

```
backend/
├── prisma/
│   ├── schema.prisma           ← model User { id, email @unique, passwordHash, createdAt, updatedAt }
│   ├── migrations/             ← local (no se sube por permisos root en server)
│   └── dev.db                  ← gitignored
├── src/
│   ├── index.ts                ← entry, trust proxy, monta routers /auth + /api/auth + /health
│   ├── config/env.ts           ← carga + valida .env, mata el proceso si falta JWT_SECRET
│   ├── db/prisma.ts            ← import pkg from '@prisma/client'; singleton
│   ├── middleware/
│   │   ├── auth.ts             ← authenticateToken (JWT bearer)
│   │   ├── rateLimit.ts        ← authLimiter (10/15min)
│   │   └── validate.ts         ← validateBody(schema) genérico
│   ├── routes/
│   │   ├── auth.ts             ← /register, /login, /me
│   │   └── health.ts           ← /health (status + DB check)
│   ├── validation/schemas.ts   ← zod registerBodySchema, loginBodySchema
│   └── types/                  ← JwtPayload, PublicUser, etc.
├── .env / .env.example
├── tsconfig.json               ← module: commonjs, strict
└── package.json                ← scripts: build, start, dev, prisma:migrate, prisma:generate

frontend/
├── index.html                  ← font Outfit vía <link>, NO @import en CSS
├── vite.config.js              ← base: '/~seis/', plugins react + @tailwindcss/vite
├── src/
│   ├── index.css               ← @import "tailwindcss" + @theme con tokens OKLCH
│   ├── main.jsx                ← BrowserRouter basename={import.meta.env.BASE_URL}
│   ├── App.jsx                 ← routes / → /login, /login, /register, /dashboard (ProtectedRoute)
│   ├── context/
│   │   ├── auth-context.js     ← createContext + useAuth hook (separado por react-refresh lint)
│   │   └── AuthContext.jsx     ← AuthProvider con login/register/logout/bootstrap
│   ├── lib/
│   │   ├── api.js              ← axios instance, API_BASE auto-detect, interceptors token + 401→logout
│   │   └── cn.js               ← cn() = twMerge(clsx(...))
│   ├── components/
│   │   ├── atoms/              ← Button (cva variants), Input (forwardRef), Label, Alert
│   │   ├── molecules/          ← FormField (Label+Input+error), Card (variants glass/solid/night)
│   │   ├── organisms/          ← AuthForm (compartido entre Login y Register)
│   │   └── ProtectedRoute.jsx
│   └── pages/
│       ├── Login.jsx           ← container thin → <AuthForm accent="primary" />
│       ├── Register.jsx        ← container thin → <AuthForm accent="accent" />
│       └── Dashboard.jsx       ← usa Card surface="night" + Button variant="nightGhost"
└── package.json
```

---

## Endpoints del API

| Method | Path | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | - | "Backend Auth API Running" |
| GET | `/health` | - | JSON con status, uptime, timestamp, DB check |
| POST | `/auth/register` | - | Body `{email, password}` → 201 + userId |
| POST | `/auth/login` | - | Body `{email, password}` → 200 + JWT + user |
| GET | `/auth/me` | Bearer JWT | → user `{id, email}` |

Todos también disponibles bajo `/api/...` (para dev local). Login y register pasan por `authLimiter` (10 req / 15min por IP).

---

## Decisiones / convenciones del proyecto

- **bcrypt rounds = 12** (no 10). Hard-coded en `routes/auth.ts:25`.
- **Email se normaliza con zod**: `.trim().toLowerCase()` antes de tocar DB.
- **Login uniforme**: "Invalid credentials" tanto si el email no existe como si la password es incorrecta (anti enumeration).
- **JWT exp**: 1h por default (`env.jwtExpiresIn = "1h"`).
- **CORS**: abierto (`app.use(cors())`) — la guía lo pide así. NO endurecer sin razón explícita.
- **Atomic design estricto en frontend**: NO meter lógica de fetch ni estado en components/, eso es de pages/.
- **Token en localStorage**: aceptable para MVP de cátedra. Sin httpOnly cookies.
- **NO hay tests**: no hay test runner instalado. Verificación = lint + smoke manual.

---

## Reglas de trabajo con este proyecto

1. **Siempre matchear la guía del PDF** cuando el código va a deployarse. Si tenés dudas entre "best practice" y "lo que dice la guía", **gana la guía**.
2. **No agregar deps al backend sin avisar al usuario** — cada dep nueva requiere `npm install` en el server por SSH.
3. **Cambios al schema Prisma** → `npx prisma migrate dev --name <nombre>` local + (en server) `npx prisma db push`. No subir `migrations/` por SCP (permisos root).
4. **No tocar `~/servicios/prisma/dev.db` ni `~/servicios/prisma/migrations/`** — son de root, no se puede.
5. **Antes de SCP**: SIEMPRE rebuild (`npm run build`). PM2 watch detecta el cambio de `dist/` y reinicia solo.
6. **SSH siempre con `-p 22002`**. SCP con `-P 22002` (P mayúscula).
7. **Si PM2 entra en crash loop**, lo primero es `pm2 logs servicios --lines 30` → ver el error real. Lo más común: falta `JWT_SECRET` en server, falta `prisma generate`, o schema/DB desincronizados.
