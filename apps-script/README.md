# Backend compartido (Express Diagnostics · Engagement Survey · Admin)

Un solo proyecto de Apps Script, **distinto** al de Founder Dependency. Su código está en
`apps-script/Code.gs` (archivo generado: no se edita a mano, se edita `src/` y se corre `npm run build`).

## Instalación (una sola vez)

1. Entra a <https://script.google.com> con **dario@adizes.com** → **Nuevo proyecto**. Ponle de nombre
   “Adizes Assessments”.
2. Borra lo que trae `Código.gs` y pega todo el contenido de `apps-script/Code.gs`. Guarda (💾).
3. En la barra de arriba elige la función **`setup`** y presiona **▶ Ejecutar**. Google te pedirá permisos
   (Hojas de cálculo, Drive, Gmail, activadores): acéptalos. Al terminar, en el **Registro de ejecución**
   aparecen dos enlaces: la hoja **“Adizes Assessments — Data”** y la carpeta **“Adizes Assessments — PDFs”**
   (las dos quedan en tu Drive; puedes moverlas de carpeta sin problema).
4. **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - Descripción: `Público`
   - Ejecutar como: **Yo (dario@adizes.com)**
   - Quién tiene acceso: **Cualquier usuario**
   Copia la **URL de la aplicación web** (termina en `/exec`). Esa URL va en el embed de Webflow.
5. (Opcional) Ejecuta `testEmailToMe` para recibir un correo de prueba.

## Actualizar a una versión nueva

Pega el nuevo `Code.gs` → Guarda → **Implementar → Gestionar implementaciones** → ✏️ (lápiz) en
“Público” → Versión: **Nueva versión** → Implementar. La URL no cambia.

## Qué guarda

- Pestaña **ED Responses**: una fila por diagnóstico (datos de contacto, % de los 16 factores, las 67
  respuestas, enlace al PDF, estado del correo).
- Los PDFs se guardan en `Adizes Assessments — PDFs/Express Diagnostics`.
- Correos: al participante desde **info@adizes.com** (con el PDF), aviso interno a **it@adizes.com**.
  Sin Zapier ni HubSpot.
- Si alguien cierra la pestaña antes de que se genere el PDF, el activador de cada 10 minutos le envía
  el resumen por correo sin PDF.
