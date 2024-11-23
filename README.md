# ngx-custom-navigation

# Índice

1. [Descripción de la Aplicación](#descripción-de-la-aplicación)
2. [Características Principales](#características-principales)
3. [Ejemplo de Uso](#ejemplo-de-uso)
4. [Estructura General](#estructura-general)
   - [last_update](#last_update)
   - [homePageId](#homepageid)
   - [steppers](#steppers)
   - [pageMap](#pagemap)
   - [links](#links)
   - [literals](#literals)
5. [Detalle de las Secciones](#detalle-de-las-secciones)
   - [Steppers](#steppers-1)
   - [PageMap](#pagemap-1)
   - [Condiciones de Navegación](#condiciones-de-navegación)
   - [Literals](#literals-1)
   - [Entry Points](#entry-points)
6. [Funcionamiento General](#funcionamiento-general)
7. [Ejemplo de Flujo de Navegación](#ejemplo-de-flujo-de-navegación)
8. [Literales en `ngx-custom-navigation`](#literales-en-ngx-custom-navigation)
   - [Tipos de Literales](#tipos-de-literales)
9. [Ejemplos de Uso](#ejemplos-de-uso)
10. [Descripción del archivo package.json](#descripción-del-archivo-packagejson)
11. [Proceso de Arranque de la Aplicación](#proceso-de-arranque-de-la-aplicación)
12. [Licencia](#licencia)

### Descripción de la Aplicación

`ngx-custom-navigation` es una biblioteca de Angular diseñada para facilitar la creación y gestión de flujos de navegación complejos a través de archivos JSON. Esta herramienta permite definir de manera flexible y dinámica la estructura de navegación de una aplicación, incluyendo pasos, páginas, y configuraciones específicas. 

#### Características Principales:
- **Configuración Dinámica**: Define la navegación utilizando archivos JSON, permitiendo actualizaciones sin necesidad de modificar el código fuente.
- **Flujos Condicionales**: Soporta condiciones de navegación basadas en datos del usuario o estados específicos.
- **Flexibilidad y Personalización**: Permite una configuración detallada de cada página, incluyendo textos, encabezados, y opciones de navegación.

#### Ejemplo de Uso:
```json
{
  "last_update": "2024-06-13 15:00:00",
  "homePageId": "on-boarding",
  "steppers": [
    {
      "steps": [
        {
          "label": "Datos personales",
          "pages": ["is-client", "place", "birthdate", "driving-license-date", "driving-license-location", "date-of-issue"]
        },
        ...
      ]
    }
  ],
  "pageMap": [
    {
      "pageId": "on-boarding",
      "nextOptionList": [
        {
          "nextPageId": "is-client"
        }
      ],
      "configuration": {
        "literals": {
          "footer-next": "EMPEZAR",
          "header": "Calcular mi seguro",
          "subheader": "Estás a menos de 5 minutos de conseguir el seguro más completo",
          "coverage-1": "Asistencia en carretera nacional e internacional 24/7",
          "coverage-2": "Te llevamos el coche de sustitución a tu casa",
          "coverage-3": "Red de talleres excelentes a tu disposición"
        },
        "data": {
          "headerConfig": {
            "showBack": false,
            "showContactUs": false
          }
        }
      }
    },
    ...
  ]
}
```


Esta aplicación ofrece una solución robusta y escalable para la gestión de flujos de navegación en aplicaciones Angular, haciendo posible la personalización y actualización de la experiencia del usuario de manera eficiente y efectiva.

El archivo JSON proporcionado describe la estructura de navegación de una aplicación, con detalles específicos sobre las páginas, pasos y configuraciones necesarias para guiar al usuario a través de un proceso, probablemente relacionado con la obtención de un seguro. Aquí tienes una interpretación detallada del contenido y funcionamiento del JSON:

### Estructura General

- **last_update**: Fecha y hora de la última actualización del archivo JSON.
- **homePageId**: Identificador de la página de inicio.
- **steppers**: Lista de grupos de pasos que el usuario debe seguir. Cada grupo contiene una serie de pasos, y cada paso puede contener múltiples páginas.
- **pageMap**: Mapa de las páginas disponibles en la navegación, incluyendo configuraciones específicas y opciones de navegación.
- **links**: Enlaces a otras partes de la aplicación.
- **literals**: Conjunto de literales utilizados en la interfaz de usuario para diversos textos y etiquetas.

### Detalle de las Secciones

#### Steppers
Contiene varios grupos de pasos. Cada grupo de pasos tiene una lista de pasos, donde cada paso tiene una etiqueta (label) y una lista de páginas (pages).

Ejemplo:
```json
{
  "steps": [
    {
      "label": "Datos personales",
      "pages": ["is-client", "place", "birthdate", "driving-license-date", "driving-license-location", "date-of-issue"]
    },
    ...
  ]
}
```
- **label**: La etiqueta del paso, que se muestra al usuario.
- **pages**: Lista de identificadores de páginas que pertenecen a este paso.

#### PageMap
Define cada página de la navegación con sus configuraciones y reglas de navegación.

Ejemplo:
```json
{
  "pageId": "on-boarding",
  "nextOptionList": [
    {
      "nextPageId": "is-client"
    }
  ],
  "configuration": {
    "literals": {
      "footer-next": "EMPEZAR",
      "header": "Calcular mi seguro",
      "subheader": "Estás a menos de 5 minutos de conseguir el seguro más completo",
      "coverage-1": "Asistencia en carretera nacional e internacional 24/7",
      "coverage-2": "Te llevamos el coche de sustitución a tu casa",
      "coverage-3": "Red de talleres excelentes a tu disposición"
    },
    "data": {
      "headerConfig": {
        "showBack": false,
        "showContactUs": false
      }
    }
  }
}
```

- **pageId**: Identificador único de la página.
- **nextOptionList**: Lista de opciones de navegación para determinar la siguiente página, basada en condiciones específicas.
- **configuration**: Configuración específica de la página, incluyendo literales y datos.
- **entryPoints**: Puntos de ejecución de funcionalidades.

#### Condiciones de Navegación
Las condiciones de navegación determinan la siguiente página basada en expresiones lógicas.

Ejemplo:
```json
{
  "nextPageId": "is-client-client-name",
  "conditions": [
    {
      "expression": "client.isClient",
      "value": "true"
    }
  ]
}
```
- **expression**: Expresión lógica que debe evaluarse.
- **value**: Valor esperado para que la condición sea verdadera.

#### Literals
Define los textos y etiquetas que se utilizan en la interfaz de usuario.

Ejemplo:
```json
{
  "footer-next": "EMPEZAR",
  "header": "Calcular mi seguro",
  "subheader": "Estás a menos de 5 minutos de conseguir el seguro más completo",
  "or-more": { "value": "Label.OrMore", "type": "translate" },
}
```
- **footer-next**: Texto para el botón de siguiente en el pie de página.
- **header**: Texto del encabezado de la página.
- **subheader**: Texto del subencabezado de la página.
- **or-more**: value representa una clave a ser traducida.

#### Entry Points
Define los puntos de entrada para determinadas acciones o eventos. También se pueden configurar condiciones para la ejecución del activador.

Ejemplo:
```json
{
  "entryPoints": [
    {
      "id": "next-page",
      "activator": "black-list-plate",
      "params": { "percent": 0.7 },
      "conditions": [
        {
          "expression": "user.isLoggedIn",
          "value": "true"
        }
      ]
    }
  ]
}
```
- **id**: Identificador del punto de entrada.
- **activator**: Activador que inicia el punto de entrada.
- **params**: Parámetros adicionales necesarios para el punto de entrada.
- **conditions**: Lista de condiciones que deben cumplirse para que se ejecute el activador.
- **expression**: Expresión lógica que debe evaluarse.
- **value**: Valor esperado para que la condición sea verdadera.
### Funcionamiento General
1. **Inicio**: La navegación comienza en la página identificada por `homePageId`.
2. **Pasos**: El usuario sigue los pasos definidos en `steppers`. Cada paso puede contener varias páginas.
3. **Páginas**: Cada página tiene configuraciones específicas y puede determinar la siguiente página basada en las condiciones definidas en `nextOptionList`.
4. **Condiciones**: Las condiciones de navegación permiten decisiones dinámicas basadas en los datos del usuario o el estado actual.
5. **Literales**: Los textos y etiquetas se configuran dinámicamente utilizando los literales definidos.

### Ejemplo de Flujo de Navegación
1. El usuario comienza en la página `on-boarding`.
2. Si el usuario es cliente (`client.isClient` es `true`), la siguiente página es `is-client-client-name`.
3. De lo contrario, la siguiente página es `place`.
4. En la página `place`, si el código postal es `51` o `52`, la siguiente página es `contact-us`.
5. De lo contrario, la siguiente página es `date-of-issue`.

Este JSON proporciona una forma flexible y configurable de definir la navegación y flujo de una aplicación, permitiendo actualizar y modificar la experiencia del usuario sin necesidad de cambios en el código fuente.


### Literales en `ngx-custom-navigation`

En el proyecto `ngx-custom-navigation`, los literales se utilizan para definir textos estáticos y dinámicos que se muestran en la interfaz de usuario. A continuación, se describen detalladamente los tipos de literales y sus usos.

#### Tipos de Literales

1. **LiteralType**
   - **Descripción**: Define el tipo de literal.
   - **Valores posibles**:
     - `value`: Indica que el literal es un valor estático.
     - `translate`: Indica que el literal es una clave que debe ser traducida.

2. **QuoteLiteral**
   - **Descripción**: Representa un literal con un valor y un tipo opcional.
   - **Propiedades**:
     - `value` (string): El valor del literal.
     - `type` (LiteralType, opcional): El tipo del literal (`value` o `translate`).

3. **LiteralParam**
   - **Descripción**: Utiliza el tipo `DataInfo` de `@shagui/ng-shagui/core` para definir parámetros literales.
   - **Tipo**: `DataInfo<LiteralModel>`

4. **LiteralModel**
   - **Descripción**: Define el modelo de un literal, que puede ser un string, un número o un `QuoteLiteral`.
   - **Valores posibles**:
     - String: Un texto estático.
     - Number: Un número.
     - `QuoteLiteral`: Un objeto que incluye un valor y un tipo opcional.

```typescript
import { DataInfo } from '@shagui/ng-shagui/core';

export type LiteralType = 'value' | 'translate';

export interface QuoteLiteral {
  value: string;
  type?: LiteralType;
}

export type LiteralParam = DataInfo<LiteralModel>;

export type LiteralModel = string | number | QuoteLiteral;
```

### Ejemplos de Uso

1. **Literal Estático (value)**
   ```typescript
   const staticLiteral: QuoteLiteral = {
     value: "Bienvenido",
     type: 'value'
   };
   ```

2. **Literal para Traducción (translate)**
   ```typescript
   const translatedLiteral: QuoteLiteral = {
     value: "welcome_message",
     type: 'translate'
   };
   ```

3. **Literal de Tipo String**
   ```typescript
   const stringLiteral: LiteralModel = "Texto estático";
   ```

4. **Literal de Tipo Número**
   ```typescript
   const numberLiteral: LiteralModel = 42;
   ```

Estos literales permiten una mayor flexibilidad y personalización en los textos mostrados en la aplicación, facilitando tanto la localización como la actualización de contenidos.


### Descripción del archivo package.json

El archivo `package.json` contiene información esencial sobre el proyecto `ngx-custom-navigation`, incluyendo las dependencias y los scripts necesarios para el desarrollo y despliegue de la aplicación.

#### Estructura del archivo package.json:

- **name**: Nombre del proyecto (`ngx-custom-navigation`).
- **version**: Versión actual del proyecto (`0.0.0`).
- **scripts**: Comandos que pueden ejecutarse usando `npm run <script>`:
  - `ng`: Ejecuta el comando Angular CLI.
  - `start`: Inicia la aplicación en modo de desarrollo.
  - `build`: Compila la aplicación para producción.
  - `watch`: Compila la aplicación en modo observador.
  - `test`: Ejecuta las pruebas unitarias.
  - `test:coverage`: Ejecuta las pruebas unitarias con cobertura de código.
  - `lint`: Ejecuta el linter para verificar el código.

- **private**: Indica que el proyecto es privado.
- **dependencies**: Lista de dependencias necesarias para que la aplicación funcione:
  - `@angular/animations`, `@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/forms`, `@angular/platform-browser`, `@angular/platform-browser-dynamic`, `@angular/router`: Paquetes esenciales de Angular.
  - `@aposin/ng-aquila`: Biblioteca de componentes de UI.
  - `@fortawesome/fontawesome-free`: Iconos FontAwesome.
  - `@ngx-translate/core`, `@ngx-translate/http-loader`: Soporte de traducción.
  - `crypto-js`: Biblioteca de criptografía.
  - `rxjs`: Biblioteca de programación reactiva.
  - `tslib`, `zone.js`: Librerías de soporte.

- **devDependencies**: Lista de dependencias necesarias para el desarrollo:
  - `@angular-devkit/build-angular`, `@angular/cli`, `@angular/compiler-cli`: Herramientas de desarrollo de Angular.
  - `@types/crypto-js`, `@types/jasmine`: Tipos de TypeScript para bibliotecas.
  - `angular-eslint`, `eslint`: Herramientas de linting.
  - `jasmine-core`, `jasmine-spec-reporter`: Herramientas de pruebas unitarias.
  - `karma`, `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`, `karma-mocha-reporter`, `karma-spec-reporter`: Herramientas y reporteros para pruebas con Karma.
  - `typescript`, `typescript-eslint`: Herramientas relacionadas con TypeScript.

### Proceso de Arranque de la Aplicación

Para iniciar la aplicación en modo de desarrollo, sigue estos pasos:

1. Asegúrate de tener Node.js y npm instalados en tu máquina.
2. Clona el repositorio y navega al directorio del proyecto:
   ```bash
   git clone https://github.com/ShaguiXYZ/ngx-custom-navigation.git
   cd ngx-custom-navigation
   ```
3. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
4. Inicia la aplicación en modo de desarrollo:
   ```bash
   npm start
   ```
   Esto ejecutará el comando `ng serve`, iniciando un servidor de desarrollo y abriendo la aplicación en tu navegador.

### Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

Para más información, visita el [repositorio en GitHub](https://github.com/ShaguiXYZ/ngx-custom-navigation).