# Sistema de Gestión para Constructora

Plataforma integral para administrar una empresa constructora: gestión de clientes, obras, presupuestos, materiales, proveedores, personal, pagos y avance de proyectos.

El sistema cubre el ciclo principal de trabajo de una constructora: alta del cliente, carga de la obra, elaboración del presupuesto, asignación de recursos, control de materiales, seguimiento del avance y registro de pagos.

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
* **Carga de entradas:** registro de compras o ingresos de materiales al depósito.
* **Salida de materiales:** descuento manual o automático de materiales utilizados en una obra.
* **Materiales por obra:** consulta de qué materiales fueron asignados o consumidos en cada proyecto.
* **Alertas de stock bajo:** aviso cuando un material queda por debajo del mínimo definido.
* **Historial de movimientos:** registro de entradas, salidas, ajustes y responsables de cada movimiento.

### 6. Proveedores y Compras

Módulo para administrar la relación con proveedores y controlar las compras realizadas por la constructora.

* **Registro de proveedores:** carga de datos de contacto, CUIT, dirección, rubro y condiciones comerciales.
* **Órdenes de compra:** generación de solicitudes de materiales o servicios.
* **Compras por obra:** asociación de cada compra a una obra específica cuando corresponda.
* **Estado de compra:** seguimiento mediante estados como *Solicitada*, *Aprobada*, *Recibida*, *Pagada* o *Cancelada*.
* **Comparación de precios:** posibilidad de registrar distintos presupuestos de proveedores para elegir la mejor opción.
* **Historial de compras:** consulta de compras realizadas, proveedor utilizado, monto total y fecha.

### 7. Personal y Mano de Obra

Módulo para organizar los trabajadores, equipos y responsables que participan en las obras.

* **Registro de personal:** carga de empleados, albañiles, electricistas, plomeros, pintores, arquitectos, ingenieros, capataces u otros roles.
* **Asignación a obras:** vinculación de trabajadores con una o varias obras.
* **Roles y responsabilidades:** definición del cargo o función de cada persona dentro del proyecto.
* **Control de asistencia:** registro básico de días trabajados, ausencias o jornadas asignadas.
* **Costos de mano de obra:** carga de pagos, jornales o costos asociados al personal.
* **Historial laboral:** consulta de obras en las que participó cada trabajador.

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

* **Acceso del cliente:** ingreso mediante DNI, CUIT, correo electrónico o código de obra.
* **Consulta de obra:** visualización del estado general del proyecto, porcentaje de avance y próximas tareas.
* **Seguimiento de pagos:** consulta de pagos realizados, saldo pendiente y vencimientos.
* **Documentación disponible:** acceso a presupuestos aprobados, contratos, planos o comprobantes cargados por la constructora.
* **Comunicación con la empresa:** espacio para enviar consultas, observaciones o solicitudes relacionadas con la obra.
* **Historial del proyecto:** resumen de avances, cambios importantes y fechas relevantes.


### 21/06 — Buenas prácticas de arquitectura y migración a shadcn/ui

Se incorporaron skills internas para ordenar la forma de construir el frontend y el backend del proyecto.

* **Frontend:** se migró a **shadcn/ui puro** para usar primitivos reutilizables y evitar componentes armados a mano cuando ya existe una solución estándar. La estructura queda guiada por `react-feature-architecture`, con separación por features, componentes pequeños y una responsabilidad clara por archivo.
  * Skill: `.agents/skills/react-feature-architecture/SKILL.md`
* **Backend:** se agregó una skill de buenas prácticas para orientar los cambios hacia una arquitectura **Limpia / Hexagonal / Cebolla**. La idea central es separar la lógica de negocio de frameworks, rutas, base de datos y detalles externos.
  * Skill: `.agents/skills/backend-clean-architecture/SKILL.md`
  * Principio: las dependencias deben apuntar hacia el núcleo de dominio; los casos de uso no deberían depender directamente de Express, Prisma ni de detalles de infraestructura.
  * Objetivo: código más mantenible, testeable y preparado para cambiar UI, base de datos o adaptadores sin reescribir la lógica principal.
