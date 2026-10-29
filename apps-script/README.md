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
4. **Implementar → Nueva implementación → Aplicación web**: Ejecutar como **Yo** · Acceso **Cualquier usuario**.
   Esa URL `/exec` sirve para dos cosas:
   - Va en los embeds de Webflow (`/express-diagnostics` y `/engagement-survey`).
   - Abierta en el navegador **es el admin**. Guárdala en favoritos.
5. Acceso al admin: **sin contraseña**. Escribes tu correo y te llega un código de 6 dígitos desde info@ (dura 10
   minutos; la sesión dura 7 días en ese navegador). Si Google ya reconoce tu cuenta @adizes.com, entras directo.
   Quién puede entrar:
   - `ADMIN_EMAILS` en **Configuración del proyecto (⚙️) → Propiedades de la secuencia de comandos**
     (separados por comas; `@dominio.com` permite todo un dominio).
   - `CONFIG.ADMIN_DOMAINS` en el código (hoy: `nuclea.solutions`).

### Por qué así
- Con una contraseña compartida no sabríamos quién entró; con el código por correo cada persona entra con su propio
  correo y se puede quitar el acceso borrándolo de la lista (las sesiones abiertas se invalidan al instante).
- Todo se ejecuta como dario@adizes.com: la hoja y los reportes viven en su Drive y los correos salen del alias
  **info@adizes.com**.
- Si tenías una segunda implementación “Admin” (solo adizes.com), puedes seguir usándola o archivarla.

## Actualizar a una versión nueva

Pega el nuevo `Code.gs` → Guarda → **Implementar → Gestionar implementaciones** → en **cada** implementación
que tengas: ✏️ → Versión: **Nueva versión** → Implementar. Las URLs no cambian.

## Qué guarda (pestañas de la hoja)

- **Companies**, **Employees**: el CRUD del admin.
- **Launches**: cada lanzamiento (tipo, estado, fechas, destinatarios, enlace al PDF).
- **Invitations**: un enlace personal por participante (estado: Pending / Sent / Completed).
- **ED Answers**: respuestas del Diagnóstico Exprés (con nombre: es un reporte con participantes nominales).
- **ES Answers**: respuestas de la Encuesta de Compromiso, **anónimas**: sin nombre ni enlace a la invitación, solo
  el día, el área y el resultado, insertadas en orden aleatorio.

## Correos a grupos de Google (p. ej. it@adizes.com)
Si un correo a un grupo no llega, casi siempre es la configuración del grupo: en groups.google.com → el grupo →
**Configuración → Quién puede publicar** debe permitir a la organización (o a cualquiera), y revisa la cola de
**mensajes pendientes** de moderación.
- Activador cada hora: los lanzamientos cuya fecha de cierre pasó quedan “Listo” si tienen el mínimo; si no,
  se avisa una vez a los admins y a it@adizes.com.
