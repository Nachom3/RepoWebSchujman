# Sistema de Gestión para Constructora

Plataforma integral para administrar una empresa constructora: gestión de clientes, obras, presupuestos, materiales, proveedores, personal, pagos y avance de proyectos.

El sistema cubre el ciclo principal de trabajo de una constructora: alta del cliente, carga de la obra, elaboración del presupuesto, asignación de recursos, control de materiales, seguimiento del avance y registro de pagos.

## Stack

- **Backend**: Node.js · Express 5 · TypeScript · Prisma 6 (SQLite en desarrollo)
- **Frontend**: React 19 · Vite · TypeScript · shadcn/ui · Tailwind v4 · React Router 7 · React Hook Form · Zod · Recharts
- **Auth**: JWT con bcrypt
- **Portal cliente**: rutas públicas con token de sesión (x-portal-token)

## Estructura del repositorio

```
backend/   # API Express + Prisma
frontend/  # SPA Vite + React
openspec/  # Especificaciones y cambios (SDD)
```

## Módulos

### 1. Panel Principal

Pantalla de inicio del administrador. Muestra un resumen general del estado de la constructora y de sus obras activas.

* **Obras en curso:** cantidad de proyectos activos, finalizados, pausados o pendientes de inicio.
* **Estado financiero general:** resumen de ingresos, pagos pendientes, deudas de clientes y gastos registrados.
* **Avance de obras:** visualización rápida del porcentaje de avance de cada obra.
* **Alertas importantes:** avisos sobre pagos vencidos, materiales con bajo stock, tareas atrasadas o presupuestos pendientes de aprobación.
* **Próximas actividades:** listado de tareas o entregas programadas para los próximos días.

### 2. Gestión de Clientes

Módulo centralizado para administrar los datos de los clientes de la constructora.

* **Registro de clientes:** carga de nombre, apellido o razón social, CUIT/DNI, teléfono, correo electrónico y dirección.
* **Historial de obras:** acceso a las obras asociadas a cada cliente.
* **Estado de cuenta:** consulta de pagos realizados, pagos pendientes, anticipos y deudas.
* **Datos de contacto:** almacenamiento de información útil para mantener comunicación con el cliente durante el desarrollo de la obra.

### 3. Gestión de Obras

Módulo principal del sistema. Permite crear, consultar, modificar y eliminar obras o proyectos de construcción.

* **Alta de obra:** registro de una nueva obra con nombre, ubicación, cliente asociado, fecha de inicio estimada y fecha de finalización estimada.
* **Tipo de obra:** clasificación según corresponda: vivienda, local comercial, ampliación, remodelación, edificio, galpón u otro tipo de proyecto.
* **Estado de la obra:** seguimiento mediante estados como *Pendiente*, *En curso*, *Pausada*, *Finalizada* o *Cancelada*.
* **Descripción general:** detalle del trabajo a realizar, alcance del proyecto y observaciones importantes.
* **Responsable asignado:** vinculación de la obra con un encargado, arquitecto, maestro mayor de obra o jefe de proyecto.

### 4. Presupuestos y Contratos

Módulo destinado a organizar las propuestas económicas realizadas a los clientes y su posterior aprobación.

* **Creación de presupuestos:** carga de materiales, mano de obra, servicios, maquinaria, transporte y otros costos asociados.
* **Presupuesto por obra:** cada presupuesto queda vinculado a una obra y a un cliente específico.
* **Estados del presupuesto:** control mediante estados como *Borrador*, *Enviado*, *Aprobado*, *Rechazado* o *Vencido*.
* **Actualización de precios:** posibilidad de modificar valores antes de la aprobación final.
* **Registro de aprobación:** cuando el cliente acepta el presupuesto, el sistema permite marcarlo como aprobado y habilitar el inicio de la obra.
* **Documentación asociada:** carga o referencia de contratos, planos, comprobantes, permisos municipales u otros archivos importantes.

### 5. Materiales e Inventario

Módulo para controlar los materiales disponibles y los consumos asociados a cada obra.

* **Stock de materiales:** registro de materiales como cemento, arena, ladrillos, hierro, pintura, caños, cables, placas, aberturas y otros insumos.
* **Categoría y ubicación:** cada material tiene una categoría (`Estructural`, `Sanitario`, `Eléctrico`, etc.) y una ubicación libre (depósito, obra, etc.).
* **Stock mínimo:** alerta de bajo stock configurable; el flag `isLow` se calcula server-side y se devuelve en cada respuesta.
* **Proveedor asociado:** cada material puede vincularse a un proveedor; la lista de materiales muestra el nombre del proveedor y el proveedor expone la cantidad de materiales que le compran.
* **Carga de entradas:** registro de compras o ingresos de materiales al depósito.
* **Salida de materiales:** descuento manual o automático de materiales utilizados en una obra.
* **Materiales por obra:** consulta de qué materiales fueron asignados o consumidos en cada proyecto.
* **Alertas de stock bajo:** aviso cuando un material queda por debajo del mínimo definido.
* **Historial de movimientos:** registro de entradas, salidas, ajustes y responsables de cada movimiento.

### 6. Proveedores y Compras

Módulo para administrar la relación con proveedores y controlar las compras realizadas por la constructora.

* **Registro de proveedores:** carga de razón social, CUIT, persona de contacto, email, teléfono, sitio web, dirección, rubro y condiciones de pago.
* **Notas libres:** campo de notas para contexto adicional.
* **Materiales vinculados:** cada proveedor expone la cantidad de materiales del catálogo que se le compran.
* **Órdenes de compra:** generación de solicitudes de materiales o servicios.
* **Compras por obra:** asociación de cada compra a una obra específica cuando corresponda.
* **Estado de compra:** seguimiento mediante estados como *Solicitada*, *Aprobada*, *Recibida*, *Pagada* o *Cancelada*.
* **Comparación de precios:** posibilidad de registrar distintos presupuestos de proveedores para elegir la mejor opción.
* **Historial de compras:** consulta de compras realizadas, proveedor utilizado, monto total y fecha.

### 7. Personal y Mano de Obra

Módulo para organizar los trabajadores, equipos y responsables que participan en las obras.

* **Registro de personal:** carga de empleados, albañiles, oficiales/ayudantes, electricistas, plomeros, pintores, arquitectos, ingenieros, jefes de proyecto, jefes de obra, capataces, administrativos u otros roles.
* **Disponibilidad:** cada persona tiene un estado (`Disponible`, `Inactivo`, `Con licencia`) sincronizado con el flag legacy `active`.
* **Datos opcionales:** CUIT/DNI, teléfono, email, jornal diario y notas.
* **Asignación a obras:** desde el detalle de cada obra se asigna personal con un rol específico en la obra, responsabilidad opcional, fecha de inicio/fin, status (`Asignado`, `En obra`, `En pausa`, `Finalizado`) y notas.
* **Jerarquía dentro de la obra:** cada asignación puede tener un supervisor (capataz o jefe de obra) y la cantidad de subordinados se muestra junto a su nombre.
* **Roles y responsabilidades:** definición del cargo o función de cada persona tanto a nivel global como dentro de la obra.
* **Control de asistencia:** registro básico de días trabajados, ausencias o jornadas asignadas.
* **Costos de mano de obra:** carga de pagos, jornales o costos asociados al personal.
* **Historial laboral:** consulta de obras en las que participó cada trabajador y contador de obras activas en la lista de personal.

### 8. Tareas y Avance de Obra

Módulo para dividir cada obra en etapas, tareas o actividades concretas.

* **Etapas de obra:** organización por fases como demolición, movimiento de suelo, cimientos, estructura, mampostería, instalaciones, revoques, pintura y terminaciones.
* **Carga de tareas:** creación de tareas específicas dentro de cada obra.
* **Responsables:** asignación de cada tarea a un trabajador o encargado.
* **Fechas estimadas:** definición de fecha de inicio y fecha de finalización para cada tarea.
* **Estado de tareas:** seguimiento mediante estados como *Pendiente*, *En proceso*, *Terminada* o *Atrasada*.
* **Porcentaje de avance:** actualización manual del avance general de la obra según el progreso de sus tareas.
* **Observaciones:** registro de problemas, demoras, cambios solicitados por el cliente o novedades importantes.

### 9. Pagos, Cobros y Gastos

Módulo financiero para controlar el dinero que entra y sale en cada proyecto.

* **Cobros a clientes:** registro de anticipos, cuotas, pagos parciales o pagos finales.
* **Pagos pendientes:** visualización de clientes con deuda o cuotas vencidas.
* **Gastos por obra:** carga de gastos de materiales, mano de obra, herramientas, alquiler de maquinaria, transporte u otros costos.
* **Balance por obra:** comparación entre presupuesto aprobado, gastos reales y dinero cobrado.
* **Métodos de pago:** registro de efectivo, transferencia, cheque u otros medios.
* **Comprobantes:** posibilidad de asociar recibos, facturas o imágenes de comprobantes de pago.

### 10. Portal de Clientes

Interfaz externa para que el cliente pueda consultar información básica sobre su obra sin depender siempre del administrador.

* **Acceso del cliente:** ingreso mediante ID, CUIT o DNI (con o sin puntuación).
* **Consulta de obra:** visualización del estado general del proyecto, porcentaje de avance y próximas tareas.
* **Seguimiento de pagos:** consulta de pagos realizados, saldo pendiente y vencimientos.
* **Documentación disponible:** acceso a presupuestos aprobados, contratos, planos o comprobantes cargados por la constructora.
* **Comunicación con la empresa:** espacio para enviar consultas, observaciones o solicitudes relacionadas con la obra.
* **Historial del proyecto:** resumen de avances, cambios importantes y fechas relevantes.

## Quick start

### Requisitos

- Node.js 20+
- npm 10+

### Backend

```bash
cd backend
cp .env.example .env       # si no existe, ver variables requeridas abajo
npm install
npx prisma migrate dev     # crea la DB SQLite y aplica las migraciones
npx prisma generate        # genera el cliente Prisma
npm run dev                # levanta el server en http://localhost:3001
```

Variables de entorno mínimas (`backend/.env`):

```
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET=cambiame-en-prod
```

### Frontend

```bash
cd frontend
npm install
npm run dev                # Vite dev server en http://localhost:5173
```

Opcional: `VITE_API_BASE` para apuntar a otro backend. Por defecto usa `http://localhost:3001/api`.

### Scripts útiles

| Comando (backend) | Descripción |
| --- | --- |
| `npm run dev` | Levanta el server con `ts-node-dev` |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run prisma:migrate -- --name <name>` | Genera/aplica una nueva migración |
| `npm run prisma:generate` | Regenera el cliente Prisma |

| Comando (frontend) | Descripción |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + build de producción |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint con autofix |

## Endpoints principales

> Prefijo: `/api`. Todas las rutas excepto `/api/auth/*`, `/api/health` y `/api/portal/*` requieren `Authorization: Bearer <token>`.

| Recurso | Rutas |
| --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Health | `GET /health` |
| Clientes | `GET/POST /clients`, `GET/PATCH/DELETE /clients/:id`, `GET/POST /clients/:id/payments` |
| Obras | `GET/POST /projects`, `GET/PATCH/DELETE /projects/:id` |
| Equipo de obra | `GET/POST /projects/:projectId/staff`, `PATCH/DELETE /projects/:projectId/staff/:assignmentId` |
| Presupuestos | `GET/POST /budgets`, `GET/PATCH/DELETE /budgets/:id` |
| Materiales | `GET/POST /materials`, `GET/PATCH/DELETE /materials/:id` |
| Proveedores | `GET/POST /suppliers`, `GET/PATCH/DELETE /suppliers/:id` |
| Personal | `GET/POST /staff`, `GET/PATCH/DELETE /staff/:id` |
| Tareas | `GET/POST /tasks`, `GET/PATCH/DELETE /tasks/:id` |
| Pagos | `GET/POST /payments`, `GET/PATCH/DELETE /payments/:id` |
| Panel resumen | `GET /panel/summary` |
| Portal cliente | `POST /portal/login`, `POST /portal/logout`, `GET /portal/projects`, `GET /portal/projects/:id`, `GET /portal/payments` |

Para ver el registro de cambios del proyecto, consultá el [CHANGELOG.md](./CHANGELOG.md).
