# Journey Builder

Editor independiente para crear, importar, validar y descargar configuraciones JSON de journeys. Se sirve como contenido estático de `public/` y no forma parte del flujo de cotización.

## Uso local

Desde la raíz del repositorio, inicia el servidor de journeys y Angular en terminales separadas:

```bash
node server/server.js
npm run start:local
```

Abre <http://localhost:4200/journey-builder/>. Usa la URL servida por HTTP: abrir `index.html` directamente como `file://` impide cargar los fragmentos y módulos ES.

## Crear o editar un journey

1. **Carga el catálogo existente (opcional, recomendado antes del journey).** En el panel *Catálogo de journeys*, selecciona `server/data/journey/journeys.json`. Esto permite conservar los datos e historial de versiones de la entrada coincidente y detectar IDs o nombres ya usados. Cargar el catálogo por sí solo no cambia el flujo que se está editando.
2. **Importa el flujo que quieras editar.** Pulsa **Importar journey** en el panel de identidad y selecciona un archivo JSON de journey. Debe tener `homePageId` de tipo texto y `pageMap` de tipo array; `steppers`, si existe, debe ser un array. El editor actualiza el formulario desde el archivo seleccionado.
3. **Edita la configuración.** Completa los metadatos, elige la página inicial, configura en cada página un componente registrado, su configuración JSON y las rutas. Las condiciones son opcionales. En *Stepper* puedes agrupar páginas en pasos y en *Configuración avanzada* definir `errorPageId`, `links` o `literals`.
4. **Navega por flujos largos.** El índice lateral enumera las páginas en orden; selecciona una para desplazarte a ella. Si estaba plegada, se expande. El índice se actualiza al añadir o eliminar páginas y al cambiar el ID o componente. En pantallas pequeñas se muestra encima del editor. También puedes plegar o expandir tarjetas de forma individual o en conjunto.
5. **Revisa y descarga.** La vista *Validación* muestra errores y avisos y permite inspeccionar ambos JSON. Los errores bloquean la descarga. Descarga el journey y la entrada de catálogo por separado.

El botón **Importar journey** carga una definición con `homePageId` y `pageMap`; **Seleccionar journeys.json** carga únicamente el catálogo y no sustituye el flujo abierto. Para conservar versiones, carga el catálogo antes de importar el journey correspondiente. Al importar un flujo, la página inicial se muestra expandida y las demás plegadas.

Los JSON se procesan en el navegador: el editor no escribe en el repositorio ni cambia `settings.json`. Después de descargar, copia el JSON del journey a `server/data/journey/<name>.json` y combina la entrada descargada con `server/data/journey/journeys.json`, sin eliminar las entradas existentes. No añadas una entrada al catálogo ni habilites un journey en `settings.json` salvo que ese sea el cambio que necesitas.

### Si no se carga un flujo

- Comprueba que seleccionaste **Importar journey**, no **Seleccionar journeys.json**.
- Confirma que el archivo contiene JSON válido con `homePageId` y `pageMap` en la raíz. Los errores de formato se muestran en el panel *Validación*.
- Asegúrate de abrir la herramienta desde `http://localhost:4200/journey-builder/` y de mantener activo el servidor de desarrollo. No uses `file://`.
- Si el editor muestra el flujo anterior, vuelve a abrir el selector **Importar journey** y selecciona el archivo deseado. Cancelar el selector no sustituye el flujo.

## Organización del código

Los módulos ES de `js/` separan las responsabilidades:

| Módulo | Responsabilidad |
| --- | --- |
| `bootstrap.js` | Carga los fragmentos HTML por HTTP y, cuando están listos, importa la aplicación. |
| `app.js` | Punto de entrada: conecta eventos y arranca la vista. |
| `component-catalog.js` | Claves de componentes disponibles. Deben coincidir con `src/app/library/library-manifest.ts`. |
| `state.js` | Estado inicial y datos editables del journey. |
| `dom.js` | Acceso a elementos por ID y clonación de plantillas HTML. |
| `flow-model.js` | Lee metadatos del formulario, valida el modelo y construye el JSON del journey y del catálogo. |
| `configuration-editor.js` | Resalta la sintaxis JSON, valida la estructura de `PageConfiguration` y gestiona la sangría del editor. |
| `renderer.js` | Renderiza páginas, steppers, errores, avisos y vistas previas. |
| `editor-events.js` | Sincroniza los controles con el estado y gestiona las acciones del editor. |
| `file-operations.js` | Importa archivos y descarga el journey y el registro del catálogo. |
| `partials/intro.html` | Encabezado introductorio. |
| `partials/flow-index.html` | Índice lateral de navegación por página. |
| `partials/editor.html` | Formularios, páginas, steppers e importación. |
| `partials/preview.html` | Validación, vistas previas y descargas. |
| `partials/templates.html` | Plantillas HTML para páginas, rutas, condiciones y pasos. |
| `../styles.css` | Estilos del editor, adaptativos a pantallas pequeñas. |
| `../index.html` | Shell de la aplicación y puntos de inserción de los fragmentos. |

Los controles de plegado guardan `collapsed` en el estado de cada página, por lo que permanecen estables cuando el editor vuelve a renderizar el flujo. Al importar un journey se muestra expandida la página inicial y se pliegan las demás; cada tarjeta puede expandirse individualmente o mediante los controles globales. Los botones usan `aria-expanded` y `aria-controls` para que la interacción también sea accesible con teclado y tecnologías de asistencia.

El índice lateral se vuelve a generar al importar, añadir o eliminar páginas y al editar sus IDs o componentes. Permite saltar directamente a una página y la expande si estaba plegada; el resaltado sigue la página visible durante el desplazamiento.

### Editor de configuración JSON

La configuración de cada página y la configuración avanzada del journey se editan en áreas de texto con resaltado de claves, cadenas, números, booleanos, `null` y puntuación. La edición y selección siguen siendo las nativas del navegador; al pulsar Tab se insertan dos espacios, y Mayús+Tab quita la sangría de la línea.

La validación de ambas configuraciones se actualiza mientras se escribe:

- Comprueba que el JSON parsea y que la raíz es un objeto.
- Comprueba las formas conocidas de `literals`, `data` (`contextData`, `headerConfig`, `footerConfig` y `stepperConfig`), `validationSettings`, `serviceActivators` y `zones`.
- Muestra los errores y avisos junto al editor y en el panel general. Los errores estructurales bloquean las descargas; las propiedades superiores no reconocidas se marcan como avisos para no descartar extensiones deliberadamente.
- Una configuración vacía es opcional y conserva el aviso general de que la página no define configuración.
- La configuración avanzada solo admite `errorPageId`, `links` y `literals`; comprueba que `errorPageId` corresponda a una página existente y que `links` y `literals` tengan la estructura esperada.

La validación refleja los modelos del repositorio, en especial `PageConfiguration` y sus modelos asociados en `src/app/core/models/` y `ServiceActivator` en `src/app/core/service-activators/service-activator.model.ts`; no sustituye la validación de negocio de cada componente.

### Añadir un componente

1. Comprueba que el componente esté registrado en `src/app/library/library-manifest.ts`.
2. Añade su clave y una etiqueta legible a `js/component-catalog.js`.
3. Ajusta la configuración inicial de una página solo si la aplicación lo necesita; el catálogo no reemplaza los modelos ni la configuración del componente.
4. Verifica la lista y la vista previa en el navegador.

### Cambiar el formato generado

Mantén el flujo de datos separado:

1. Cambia lectura, validación y serialización en `js/flow-model.js`.
2. Cambia el formulario en `partials/editor.html` y las plantillas dinámicas en `partials/templates.html`.
3. Cambia cómo se refleja el estado en `js/renderer.js` y `js/editor-events.js`.
4. Conserva el viaje de ida y vuelta de importación/exportación en `js/file-operations.js`.

Al añadir nuevos fragmentos, referencia su ruta relativa a `public/journey-builder/` mediante `data-include` en `index.html`. `bootstrap.js` los carga antes de iniciar `app.js`; sirve siempre el editor por HTTP para que `fetch` y los módulos ES funcionen.

Las condiciones de una página se evalúan en orden; varias condiciones dentro de una ruta admiten las uniones del modelo (`AND`, `OR`, `XOR`, `NOR`, `NAND`, `XNOR`). El catálogo importado conserva la información e historial existentes para la misma clave y versión.

## Comprobaciones

- El estado del editor muestra errores bloqueantes y avisos de navegación/configuración.
- La vista previa permite inspeccionar los JSON antes de descargarlos.
- En este repositorio, las comprobaciones manuales de referencia son los modelos en `src/app/core/models/_configuration.model.ts`, las versiones en `src/app/core/models/quote-version.model.ts` y el manifiesto de componentes.
- Para el aspecto adaptable, comprueba al menos una pantalla estrecha y otra de escritorio.
