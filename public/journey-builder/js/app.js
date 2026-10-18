import { byId } from './dom.js';
import { handleEditorClick, handleEditorInput } from './editor-events.js';
import { importCatalog, importJourney } from './file-operations.js';
import { setMetadataInputs } from './flow-model.js';
import { refresh } from './renderer.js';
import { handleConfigurationEditorKeydown, syncConfigurationEditorScroll } from './configuration-editor.js';

const editor = document.querySelector('.editor-column');
const preview = document.querySelector('.preview-column');
const flowIndex = document.querySelector('.flow-index-column');

editor.addEventListener('input', handleEditorInput);
editor.addEventListener('change', handleEditorInput);
editor.addEventListener('click', handleEditorClick);
editor.addEventListener('keydown', handleConfigurationEditorKeydown);
editor.addEventListener('scroll', event => {
  if (event.target.matches('.page-configuration')) syncConfigurationEditorScroll(event.target);
}, true);
preview.addEventListener('click', handleEditorClick);
flowIndex.addEventListener('click', handleEditorClick);
byId('import-journey-file').addEventListener('change', event => importJourney(event.target.files[0]));
byId('import-catalog-file').addEventListener('change', event => importCatalog(event.target.files[0]));

setMetadataInputs();
refresh();
