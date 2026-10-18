# Journey Builder

Standalone editor for creating, importing, validating, and downloading journey JSON configurations. It is served as static content from `public/` and is independent of the quote flow.

## Run locally

From the repository root, start the journey server and Angular in separate terminals:

```bash
node server/server.js
npm run start:local
```

Open <http://localhost:4200/journey-builder/>. Use the HTTP URL: opening `index.html` directly with `file://` prevents fragments and ES modules from loading.

## Create or edit a journey

1. **Load the existing catalog (optional, recommended before importing a journey).** In the *Journey catalog* panel, select `server/data/journey/journeys.json`. This preserves the matching entry's data and version history and detects IDs or file names already in use. Loading the catalog alone does not change the journey being edited.
2. **Import the journey you want to edit.** Click **Import journey** in the identity panel and select a journey JSON file. It must contain a string `homePageId` and an array `pageMap`; if present, `steppers` must be an array. The editor populates the form from the selected file.
3. **Edit the configuration.** Complete the metadata, choose the home page, select a registered component for each page, configure its JSON and routes. Conditions are optional. In *Stepper*, group pages into steps; in *Advanced configuration*, define `errorPageId`, `links`, or `literals`.
4. **Explore the screen flow.** In the *Pages* heading, select the magnifying-glass button to open the visual diagram over the editor. It displays pages, routes, and links from the home page, and highlights unreachable pages. Select a page node to close the diagram and jump to that page's configuration. The diagram updates as the journey changes and can be scrolled in both directions.
5. **Navigate long flows.** The side index lists pages in order; select one to scroll to it. If collapsed, it expands automatically. The index updates when pages are added or removed and when their IDs or components change. On small screens it appears above the editor. You can also collapse or expand cards individually or all at once.
6. **Review and download.** The *Validation* panel shows errors and warnings and lets you inspect both JSON files. Errors block downloads. Download the journey and catalog entry separately.

**Import journey** loads a definition with `homePageId` and `pageMap`; **Select journeys.json** only loads the catalog and does not replace the open journey. To preserve versions, load the catalog before importing the corresponding journey. When a journey is imported, its home page is expanded and the other pages are collapsed.

JSON files are processed in the browser: the editor does not write to the repository or change `settings.json`. After downloading, copy the journey JSON to `server/data/journey/<name>.json` and merge the downloaded catalog entry into `server/data/journey/journeys.json` without removing existing entries. Do not add a catalog entry or enable a journey in `settings.json` unless that is the change you intend to make.

The editor shows an in-app confirmation popup before deleting pages, routes, conditions, or steps; changing the home page, route destinations, or route order; or importing a journey/catalog that replaces data currently in the editor. Cancelling leaves the current data unchanged.

### If a journey does not load

- Make sure you selected **Import journey**, not **Select journeys.json**.
- Confirm that the file contains valid JSON with `homePageId` and `pageMap` at the root. Format errors appear in the *Validation* panel.
- Open the tool at `http://localhost:4200/journey-builder/` and keep the development server running. Do not use `file://`.
- If the editor still shows the previous journey, open **Import journey** again and select the desired file. Cancelling the file picker does not replace the current journey.

## Code organization

The ES modules in `js/` separate responsibilities:

| Module | Responsibility |
| --- | --- |
| `bootstrap.js` | Loads HTML fragments over HTTP and imports the application when they are ready. |
| `app.js` | Entry point: connects events and starts the view. |
| `component-catalog.js` | Available component keys. They must match `src/app/library/library-manifest.ts`. |
| `state.js` | Initial state and editable journey data. |
| `dom.js` | Accesses elements by ID and clones HTML templates. |
| `flow-model.js` | Reads form metadata, validates the model, and builds journey and catalog JSON. |
| `configuration-editor.js` | Highlights JSON syntax, validates the `PageConfiguration` structure, and handles editor indentation. |
| `confirmation.js` | Shows accessible in-app confirmation dialogs for destructive or flow-changing actions. |
| `renderer.js` | Renders pages, steppers, errors, warnings, and previews. |
| `flow-diagram.js` | Builds the interactive screen-flow diagram from journey pages, routes, and links. |
| `editor-events.js` | Synchronizes controls with state and handles editor actions. |
| `file-operations.js` | Imports files and downloads the journey and catalog entry. |
| `partials/intro.html` | Introductory header. |
| `partials/flow-index.html` | Side navigation index for pages. |
| `partials/flow-diagram.html` | Interactive visual screen-flow diagram. |
| `partials/confirmation.html` | In-app confirmation popup. |
| `partials/editor.html` | Forms, pages, steppers, and imports. |
| `partials/preview.html` | Validation, previews, and downloads. |
| `partials/templates.html` | HTML templates for pages, routes, conditions, and steps. |
| `../styles.css` | Responsive editor styles. |
| `../index.html` | Application shell and fragment insertion points. |

Collapse controls store `collapsed` in each page's state, so they remain stable when the editor re-renders the journey. When a journey is imported, the home page is expanded and the others are collapsed; each card can be expanded individually or with the global controls. Buttons use `aria-expanded` and `aria-controls` to support keyboard and assistive technology.

The side index is regenerated when pages are imported, added, or removed and when their IDs or components change. It can jump directly to a page and expand it if collapsed; the highlighted index entry follows the visible page while scrolling.

### JSON configuration editor

Page and advanced journey configuration are edited in text areas with syntax highlighting for keys, strings, numbers, booleans, `null`, and punctuation. Editing and selection use the browser's native text area behavior; press Tab to insert two spaces, or Shift+Tab to remove indentation from the line.

Validation updates as you type:

- Checks that the JSON parses and that the root is an object.
- Checks known structures in `literals`, `data` (`contextData`, `headerConfig`, `footerConfig`, and `stepperConfig`), `validationSettings`, `serviceActivators`, and `zones`.
- Shows errors and warnings beside the editor and in the overall validation panel. Structural errors block downloads; unrecognized top-level page configuration properties are shown as warnings so intentional extensions are not discarded.
- Empty page configuration is optional and retains the general warning that the page has no configuration.
- Advanced configuration only supports `errorPageId`, `links`, and `literals`; it checks that `errorPageId` refers to an existing page and that `links` and `literals` have the expected structure.

Validation reflects the repository models, especially `PageConfiguration` and its associated models in `src/app/core/models/` and `ServiceActivator` in `src/app/core/service-activators/service-activator.model.ts`; it does not replace component-specific business validation.

### Add a component

1. Check that the component is registered in `src/app/library/library-manifest.ts`.
2. Add its key and a readable label to `js/component-catalog.js`.
3. Adjust the initial page configuration only if the application requires it; the catalog does not replace component models or configuration.
4. Verify the list and preview in the browser.

### Change the generated format

Keep the data flow separated:

1. Change reading, validation, and serialization in `js/flow-model.js`.
2. Change the form in `partials/editor.html` and dynamic templates in `partials/templates.html`.
3. Change how state is reflected in `js/renderer.js` and `js/editor-events.js`.
4. Preserve the import/export round trip in `js/file-operations.js`.

When adding fragments, reference their paths relative to `public/journey-builder/` using `data-include` in `index.html`. `bootstrap.js` loads them before starting `app.js`; always serve the editor over HTTP so `fetch` and ES modules work.

Page conditions are evaluated in order; multiple conditions in a route support the model's unions (`AND`, `OR`, `XOR`, `NOR`, `NAND`, `XNOR`). The imported catalog retains existing information and history for the same key and version.

## Checks

- The editor status shows blocking errors and navigation/configuration warnings.
- The preview lets you inspect the JSON files before downloading them.
- In this repository, the manual reference checks are the models in `src/app/core/models/_configuration.model.ts`, versions in `src/app/core/models/quote-version.model.ts`, and the component manifest.
- For responsive layout, check at least one narrow and one desktop viewport.
