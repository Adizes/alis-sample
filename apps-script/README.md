# Backend + admin (Express Diagnostics · Engagement Survey)

Un solo proyecto de Apps Script, **distinto** al de Founder Dependency. Todo está en `apps-script/Code.gs`
(archivo generado, incluye el admin). No se edita a mano: se editan `apps-script/src/`, `admin/src/` y
`shared/`, y se corre `npm run build`.

## Instalación (una sola vez)

1. Entra a <https://script.google.com> con **dario@adizes.com** → **Nuevo proyecto** → nómbralo
   “Adizes Assessments”.
2. Borra lo que trae `Código.gs`, pega todo `Code.gs` y guarda (💾).
3. Elige la función **`setup`** → **▶ Ejecutar** → acepta los permisos. En el **Registro de ejecución**
   aparecen los enlaces a la hoja **“Adizes Assessments — Data”** y a la carpeta **“Adizes Assessments — Reports”**.
4. **Implementar → Nueva implementación → Aplicación web**, dos veces:
   - **Pública** (para Webflow): Ejecutar como **Yo** · Acceso **Cualquier usuario**. Su URL `/exec` va en los embeds.
   - **Admin**: Ejecutar como **Yo** · Acceso **Cualquier usuario de adizes.com**. Su URL `/exec` es el admin
     (guárdala en favoritos).
5. Administradores: **Configuración del proyecto (⚙️) → Propiedades de la secuencia de comandos →
   `ADMIN_EMAILS`** (empieza con `dario@adizes.com`; para agregar más, sepáralos con comas).

### Por qué así
- “Ejecutar como Yo” + “usuarios de adizes.com”: Google obliga a iniciar sesión con una cuenta del dominio y el
  servidor puede leer de forma confiable el correo de quien entra. Cada acción del admin vuelve a verificarlo
  contra `ADMIN_EMAILS`; si no está en la lista, no recibe ni la página ni los datos.
- Todo se ejecuta como dario@adizes.com: la hoja y los reportes viven en su Drive y los correos salen del alias
  **info@adizes.com**.

## Actualizar a una versión nueva

Pega el nuevo `Code.gs` → Guarda → **Implementar → Gestionar implementaciones** → en **cada** implementación
(Pública y Admin): ✏️ → Versión: **Nueva versión** → Implementar. Las URLs no cambian.

## Qué guarda (pestañas de la hoja)

- **Companies**, **Employees**: el CRUD del admin.
- **Launches**: cada lanzamiento (tipo, estado, fechas, destinatarios, enlace al PDF).
- **Invitations**: un enlace personal por participante (estado: Pending / Sent / Completed).
- **ED Answers**: respuestas del Diagnóstico Exprés (con nombre: es un reporte con participantes nominales).
- Activador cada hora: los lanzamientos cuya fecha de cierre pasó quedan “Listo” si tienen el mínimo; si no,
  se avisa una vez a los admins y a it@adizes.com.
