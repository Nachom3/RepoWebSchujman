# Changelog

Todas las modificaciones relevantes de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Changed
- **Pivot hormigonera → constructora.** Se reemplaza el modelo de hormigón (fórmulas, silos, camiones, pedidos de m³, portal de autogestión por CUIT) por el modelo de constructora: obras, presupuestos, materiales, proveedores, personal, tareas, pagos y portal del cliente.
- **API:** rutas reorganizadas. Reemplazan `orders`, `formulas`, `silos`, `trucks`, `clientMovements`, `panel` por `projects`, `budgets`, `materials`, `suppliers`, `staff`, `tasks`, `payments`, `panel`. Sub-recurso `clients/:id/payments`. Portal usa ID o CUIT/DNI y expone `projects` y `payments` del cliente autenticado.
- **Frontend:** sidebar y rutas reemplazan Pedidos / Inventario / Flota / Panel hormigonera / Portal hormigonera por Clientes, Obras, Presupuestos, Materiales, Proveedores, Personal, Tareas, Pagos, Panel overview.
- **Prisma:** nuevo schema alineado al dominio constructora. Migración nueva `pivot_constructora` (las migraciones previas se mantienen aplicadas para preservar historial; la base se regenera en dev).
- **Profundidad constructora:** se profundiza el modelo de personal y materiales para reflejar cómo trabaja una constructora real. `StaffRole` ahora distingue `PROJECT_MANAGER`, `SITE_MANAGER`, `WORKER` (oficial/ayudante) y `ADMINISTRATIVE`; cada miembro tiene `status` (`ACTIVE` / `INACTIVE` / `ON_LEAVE`) y `taxId` opcional. `ProjectStaff` soporta jerarquía con `supervisorId` y `subordinatesCount`, más `startDate`, `endDate`, `notes` y `ProjectStaffStatus` (`ASSIGNED` / `ACTIVE` / `FINISHED` / `PAUSED`). `Material` agrega `category`, `minStock`, `location`, `supplierId` y `notes`; `Supplier` agrega `contactName`, `website`, `paymentTerms`. La API mantiene `active` legacy sincronizado con `status`. Migración nueva `staff_hierarchy_materials_suppliers_depth`.
- **API:** `GET /staff` ahora acepta filtro `status=`, devuelve `activeAssignments` (cuántas obras tiene) y mantiene la firma de los campos existentes. Sub-recurso `GET/POST/PATCH/DELETE /projects/:projectId/staff` para asignar personal a una obra con jerarquía y CRUD completo. `Material` y `Supplier` exponen `supplier: { id, name }` y `materialsCount` respectivamente.

### Added
- **Prisma:** modelos `Project`, `Budget`, `BudgetItem`, `Material`, `ProjectMaterial`, `Supplier`, `StaffMember`, `ProjectStaff`, `Task`, `Payment`. Enums `ProjectType`, `ProjectStatus`, `BudgetStatus`, `MaterialUnit`, `StaffRole`, `TaskStatus`, `PaymentType`, `PaymentMethod`.
- **Prisma:** enums `StaffStatus`, `ProjectStaffStatus` y campos `taxId`/`status`/`notes` en `StaffMember`; campos `role`, `status`, `startDate`, `endDate`, `notes`, `supervisorId` y relación self `subordinates` en `ProjectStaff`; campos `category`, `minStock`, `location`, `supplierId` y `notes` en `Material`; relación `Material.supplier`; campos `contactName`, `website`, `paymentTerms` en `Supplier`.
- **Backend:** use cases y repositorios para asignación de personal a proyectos (`AssignStaffToProjectUseCase`, `ListProjectStaffUseCase`, `UpdateProjectStaffUseCase`, `RemoveProjectStaffUseCase`, `PrismaProjectStaffRepository`) con validación de supervisor dentro del mismo proyecto, duplicados y dominio errors tipados.
- **Backend:** el listado de `staff` ahora enriquece cada miembro con `activeAssignments` (`Map<staffId, count>` agrupado en una sola query a `ProjectStaff`).
- **Frontend:** sección **Equipo** en `ProjectDetailView` con tabla de asignaciones (rol, responsabilidad, status, reporta a, cantidad de subordinados) y diálogo para asignar nuevo personal desde el módulo global.
- **Frontend:** el módulo de **Personal** muestra estado (`Disponible` / `Inactivo` / `Con licencia`), CUIT/DNI, contador de obras activas, y el formulario soporta los nuevos roles y campos (tax id, status, notes).
- **Frontend:** el módulo de **Materiales** muestra categoría, ubicación, proveedor (nombre + id), y un valor estimado del inventario; el formulario permite elegir proveedor y categoría desde selectores.
- **Frontend:** el módulo de **Proveedores** muestra `contactName` prominentemente, website, condiciones de pago, dirección y la cantidad de materiales vinculados; el formulario soporta todos los nuevos campos.
- **Docs:** README y CHANGELOG actualizados con la nueva profundidad.

### Removed
- **Frontend:** features `pedidos`, `inventario`, `flota`, `panel` y `portal` hormigonera, junto con sus pages (`Pedidos`, `PedidoDetail`, `PedidoNew`, `Inventario`, `Flota`, `Panel`, `Portal*`).
- **Backend:** features y routes hormigonera (`orders`, `formulas`, `silos`, `trucks`, `clientMovements`, `panel`).
- **Prisma:** modelos `Formula`, `FormulaMaterial`, `SiloStock`, `Truck`, `Order`, `CuentaCorrienteMovimiento`. Enums `OrderStatus`, `TruckStatus`, `MovementTipo`.
- **Docs:** `docs/PRODUCTO-HORMIGONERA.md` (eliminado).

## [0.1.1] - 2026-06-24

### Added

- **CI/CD** Agregamos el auto build and push al servidor
- **Frontend:** se mejoraron las rutas/vistas de Inventario, Clientes, Panel y Dashboard con una presentación más consistente.
- **Frontend:** se incorporaron charts con el patrón de shadcn/ui Charts, tomando como referencia la guía oficial de área charts: <https://ui.shadcn.com/charts/area>.

### Fixed

- **API/Frontend:** se corrigió la integración de clientes y quedó conectada con el frontend.


### Added
- **Frontend:** rutas protegidas de alta para `/clientes/new` y `/pedidos/new`, reutilizando los formularios existentes y evitando que `new` caiga en las rutas dinámicas `/:id`.
- **Frontend:** acciones de creación en **Flota** e **Inventario**: `Nuevo Camión`, `Nueva Fórmula` y `Nuevo Silo`, con dialogs shadcn y formularios existentes.
- **Frontend:** layout administrativo compartido para todas las rutas internas, manteniendo sidebar/header en Dashboard, Clientes, Pedidos, Inventario, Flota y Panel.
- **Frontend:** pantallas y componentes shadcn para Auth, Landing, Cliente Detail, Portal Login, Portal Orders, Portal Track y Portal New Order.
- **Backend:** casos de uso y repositorios para Health y Portal, dejando las rutas Express como adaptadores más finos.
### Changed

- **Frontend:** se simplificaron componentes fabricados de más y se reemplazaron wrappers innecesarios por primitivos shadcn ya disponibles.
- **Frontend:** se centralizó parte de la presentación de estados en Portal para evitar duplicación entre listado y detalle.
- **Frontend:** se reorganizaron los formularios de Auth en piezas más enfocadas (`LoginForm`, `RegisterForm`, `AuthHeader`, `AuthPageShell`) y se eliminaron exports públicos que no se usaban.
- **Frontend:** se refactorizó Cliente Detail en secciones con tabs, estados de carga/error y composición de dominio.

### Fixed

- **Frontend:** `/clientes/new` y `/pedidos/new` ya no muestran “ID inválido”; ahora renderizan los formularios de alta correspondientes.
- **Frontend:** el sidebar ya no desaparece al navegar fuera de `/dashboard` dentro del área protegida.
- **Backend:** el endpoint de Health ya no consulta Prisma directamente desde la ruta.
- **Backend:** las rutas de Portal ya no concentran lógica de sesión, creación/listado/detalle de pedidos ni consultas Prisma inline.

### Removed

- **Frontend:** componentes muertos o wrappers sin responsabilidad real: `ClientRow`, `PedidoRow`, `AuthFooter`, `NavLink`, `TrackingSkeleton` exportado y el barrel no usado de `features/portal`.
- **Frontend:** assets no referenciados (`react.svg`, `vite.svg`, `hero.png`) y dependencia no usada `@fontsource-variable/geist`.
- **Frontend:** imports, tipos e interfaces vacías que quedaron como ruido después de la migración.

## [0.1.0] - 2026-06-21

### Added
- **Frontend:** skill `react-feature-architecture` (`.agents/skills/react-feature-architecture/SKILL.md`) para guiar la estructura del código con separación por features, componentes pequeños y una responsabilidad clara por archivo.
- **Backend:** skill `backend-clean-architecture` (`.agents/skills/backend-clean-architecture/SKILL.md`) de buenas prácticas para orientar los cambios hacia una arquitectura **Limpia / Hexagonal / Cebolla**, separando la lógica de negocio de frameworks, rutas, base de datos y detalles externos. Principio: las dependencias deben apuntar hacia el núcleo de dominio; los casos de uso no deberían depender directamente de Express, Prisma ni de detalles de infraestructura. Objetivo: código más mantenible, testeable y preparado para cambiar UI, base de datos o adaptadores sin reescribir la lógica principal.

### Changed

- **Frontend:** se migró a **shadcn/ui puro** para usar primitivos reutilizables y evitar componentes armados a mano cuando ya existe una solución estándar.
