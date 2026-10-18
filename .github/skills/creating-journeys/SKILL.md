---
name: creating-journeys
description: "Crea o modifica journeys (workflows) JSON de ngx-custom-navigation: define páginas, navegación, stepper y condiciones; registra el journey y verifica sus referencias. Úsala cuando pidan crear, automatizar, generar o actualizar un journey."
argument-hint: "Describe el flujo que necesitas, sus pasos y sus bifurcaciones"
---

# Crear journeys

Genera journeys compatibles con este repositorio a partir de los requisitos funcionales del usuario. Un journey es una configuración JSON; no es código nuevo de componentes.

## Fuentes del formato

- Los journeys se guardan en `server/data/journey/`.
- `server/data/journey/journeys.json` asocia cada clave de journey con su `id`, el nombre del archivo JSON (sin extensión) y sus versiones.
- `server/api.journey.js` resuelve esa asociación; `name` debe corresponder exactamente al nombre del archivo.
- La configuración de un journey sigue `ConfigurationDTO` en `src/app/core/models/_configuration.model.ts`. Usa `default-journey.json` como ejemplo de configuración y `journeys.json` como ejemplo de metadatos.
- Los componentes/páginas disponibles, sus datos y los nombres de campos válidos se determinan en el código de la aplicación y en sus modelos; no se deben inventar.
- `server/data/journey/settings.json` contiene flags globales de workflow y tracking, no la definición de un journey.

## Procedimiento

1. Lee el catálogo, la configuración por defecto y los journeys existentes relacionados con el caso. Comprueba también los componentes/páginas registrados, sus modelos de datos, los activadores de servicio y la navegación existente antes de reutilizarlos.
2. Convierte la petición en un flujo explícito: página inicial, páginas y orden, bifurcaciones, destino de cada rama y páginas terminales. Si un dato necesario para decidir el comportamiento no está definido, pregunta antes de asumirlo.
3. Elige una clave y un nombre de archivo únicos. No reutilices `not-journey`, `default` ni una entrada/archivo existente. Mantén `id`, clave y `name` coherentes con las convenciones del catálogo.
4. Crea el JSON en `server/data/journey/<name>.json`. Respeta la forma de `ConfigurationDTO`:
   - `homePageId` debe identificar una página existente.
   - `pageMap` es un array de páginas con `pageId` único; `nextOptionList` define sus destinos, y cada `nextPageId` debe resolver a una página del mismo journey.
   - `steppers`, si se usan, agrupan páginas existentes en pasos con `label` y `pages`.
   - `title`, etiquetas y literales usan el formato existente, por ejemplo `{ "value": "Steps.PersonalData", "type": "translate" }` o `{ "value": "journey-title", "type": "literal" }`.
   - Añade `configuration.data`, `contextData`, `validationSettings`, `serviceActivators`, `zones` y `conditions` solo con propiedades y expresiones compatibles con los modelos y servicios existentes.
   - Define `component` solo si la página requiere un componente explícito y ese componente está registrado. No infieras que el valor de `pageId` es automáticamente un componente.
5. Añade la entrada al catálogo `journeys.json` sin alterar las existentes. Mantén el orden y formato del archivo; `name` debe coincidir con el archivo creado y `versions` debe seguir el tipo `VersionInfo` (`value`, y opcionalmente `date` y `breakingchange`). No inventes fechas de publicación. Declara `breakingchange` solo cuando corresponda (`all`, `workflow` o `none`).
6. No cambies `settings.json` para habilitar o deshabilitar un journey. Hazlo únicamente si el usuario lo solicita expresamente, pues sus flags afectan el comportamiento global.
7. Valida antes de terminar:
   - ambos archivos JSON parsean correctamente;
   - la clave del catálogo es única y el `name` apunta al archivo correcto;
   - `homePageId`, los `nextPageId` y las referencias de páginas del stepper existen en el `pageMap`;
   - los componentes, expresiones de condiciones y campos de contexto usados están soportados por el código;
   - el diff no elimina journeys ni cambia flags globales de forma incidental.
8. Ejecuta las comprobaciones existentes más relevantes. Si solo cambian datos JSON y no hay una validación específica para journeys, valida el parseo y las referencias de forma directa; informa cualquier limitación que no pueda comprobarse automáticamente.
9. Resume los archivos creados o modificados, la ruta del journey y las verificaciones realizadas.

## Generador web

La aplicación incluye un editor independiente en `public/journey-builder/`, disponible en `/journey-builder/` al ejecutar `npm run start:local`. Usa **Importar journey** para cargar un flujo (`homePageId` y `pageMap`) y **Seleccionar journeys.json** para cargar el catálogo: son archivos y operaciones distintos. Es recomendable cargar el catálogo antes del journey para conservar la entrada y su historial de versiones. El editor permite configurar rutas y condiciones, editar la configuración JSON de página con resaltado y validación estructural, navegar flujos extensos mediante un índice lateral y descargar por separado el JSON del flujo y su entrada de catálogo. Los archivos descargados se deben copiar manualmente a `server/data/journey/`; el editor no modifica archivos del repositorio ni habilita flags globales. La guía de uso y mantenimiento está en `public/journey-builder/README.md`.

## Límites

- No generes páginas, componentes, claves de traducción ni campos de contexto imaginarios. Si el flujo necesita funcionalidad que no existe, explica el bloqueo y solicita los datos o el cambio de código requerido.
- No reescribas el journey por defecto como atajo para añadir uno nuevo.
- No cambies el servidor, el modelo de datos ni los flags globales como parte de la creación ordinaria de un journey.
