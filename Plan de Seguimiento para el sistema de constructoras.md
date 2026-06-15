### **1\. Panel Principal (Centro de Comandos)**

Es la pantalla de inicio del administrador. Su objetivo es mostrar la situación operativa y financiera de la planta en tiempo real mediante indicadores rápidos:

* **Métricas Financieras:** Resumen visual de los ingresos del mes y el estado de los pagos registrados.  
* **Volumen de Trabajo:** Un gráfico que refleja la cantidad de metros cúbicos de hormigón despachados durante la semana.  
* **Medición de "Hora Pico":** Registro estadístico de los horarios con mayor salida de camiones. Esto permite planificar la disponibilidad del personal y la flota en los momentos de mayor demanda, evitando demoras en la planta.

### **2\. Gestión de Clientes (Las Constructoras)**

Módulo centralizado para organizar la relación comercial y financiera con las empresas compradoras:

* **Identificación por CUIT:** Cada cliente (constructora, contratista o arquitecto) se registra y administra mediante su número de CUIT.  
* **Historial Operativo:** Acceso rápido al perfil de cada empresa para consultar qué materiales pidió, cuándo y para qué obras.  
* **Estado de Cuenta Corriente:** Registro que actúa como filtro financiero. Permite verificar si el cliente está al día con sus pedidos previos, si arrastra deudas que bloqueen nuevos despachos, o si cuenta con saldo a favor por compras anticipadas para congelar precios.

### **3\. Pedidos y Fórmulas**

Es el motor operativo del software, donde se gestiona el flujo de trabajo y las transacciones internas:

* **Flujo del Pedido y Caja:** Las solicitudes ingresan como *Pendientes*. El administrador registra manualmente el cobro (efectivo, transferencia o cheque) para pasarlas a *Aprobadas*, habilitando su producción y posterior despacho hasta marcarlas como *Completadas*.  
* **Catálogo de Mezclas:** Apartado donde se definen los tipos de hormigón ofrecidos (ej. H21, H30) con sus respectivos precios fijos por metro cúbico y especificaciones técnicas.

### **4\. Control de Inventario (Los Silos)**

Módulo crítico que asegura el abastecimiento continuo de la planta, automatizando la matemática de los materiales:

* **Stock en Tiempo Real:** Muestra la disponibilidad exacta en toneladas de las materias primas básicas: **arena, grava, cemento y cal**.  
* **Descuento Inteligente:** Al aprobarse un pedido, el sistema aplica una regla fija que multiplica los metros cúbicos solicitados por la fórmula del hormigón seleccionado, restando de forma automática los kilos consumidos del stock general.  
* **Alertas Visuales:** Indicadores en pantalla que cambian a color rojo cuando los niveles de un silo caen por debajo del mínimo, notificando la necesidad de reponer insumos con anticipación.

### **5\. Logística (La Flota de Camiones)**

Herramienta ágil para coordinar el transporte y la distribución del material sin complejidades de rastreo:

* **Estado de la Flota:** Listado simple de los camiones mezcladores con un selector manual para cambiar su estado entre *Disponible* y *En Recorrido*.  
* **Asignación Rápida:** Vinculación directa de un pedido aprobado a un camión libre, organizando el orden de salida para evitar embudos en las zonas de carga.

### **6\. Portal de Autogestión (Acceso de Clientes)**

Interfaz externa y pública para que los compradores operen de forma independiente mediante una página web dedicada, evitando procesos complejos de registro:

* **Acceso Simplificado por CUIT:** El cliente ingresa a la URL del portal (ej. *hormigonera.com/pedido*s) y digita el CUIT de su empresa. El sistema valida al instante si el CUIT ya fue cargado previamente por el administrador de la planta para permitirle el ingreso  
* **Formulario de Pedidos:** Una vez validado, se le despliega un formulario limpio para seleccionar el tipo de hormigón (del catálogo activo), la cantidad de metros cúbicos ), la dirección de la obra, y la fecha/hora programada para la entrega. La solicitud impacta de inmediato en el panel del administrador como *Pendiente*.  
* **Seguimiento en Vivo:** Panel de consulta donde la constructora verifica en tiempo real el estado de su orden: si ya fue aprobada por la planta tras validarse el pago/crédito, si está en preparación, o si el camión ya va en camino hacia la obra.

