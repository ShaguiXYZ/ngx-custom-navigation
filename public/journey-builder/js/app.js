import { byId } from './dom.js';
import { handleEditorClick, handleEditorInput } from './editor-events.js';
import { importCatalog, importJourney } from './file-operations.js';
import { setMetadataInputs } from './flow-model.js';
import { refresh } from './renderer.js';
import { handleConfigurationEditorKeydown, syncConfigurationEditorScroll } from './configuration-editor.js';

const editor = document.querySelector('.editor-column');
const preview = document.querySelector('.preview-column');
const flowIndex = document.querySelector('.flow-index-column');
const flowDiagram = byId('flow-diagram');
const flowDiagramDialog = byId('flow-diagram-dialog');

editor.addEventListener('input', handleEditorInput);
editor.addEventListener('change', handleEditorInput);
editor.addEventListener('click', handleEditorClick);
byId('open-flow-diagram').addEventListener('click', () => flowDiagramDialog.showModal());
editor.addEventListener('keydown', handleConfigurationEditorKeydown);
editor.addEventListener('scroll', event => {
  if (event.target.matches('.page-configuration, #flow-extras')) syncConfigurationEditorScroll(event.target);
}, true);
preview.addEventListener('click', handleEditorClick);
flowIndex.addEventListener('click', handleEditorClick);
flowDiagram.addEventListener('click', handleEditorClick);
flowDiagramDialog.addEventListener('click', event => {
  if (event.target === flowDiagramDialog || event.target.closest('[data-close-flow-diagram]')) {
    flowDiagramDialog.close();
  }
});
flowDiagramDialog.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    event.preventDefault();
    flowDiagramDialog.close();
  }
});
byId('import-journey-file').addEventListener('change', event => importJourney(event.target.files[0]));
byId('import-catalog-file').addEventListener('change', event => importCatalog(event.target.files[0]));

setMetadataInputs();
refresh();
