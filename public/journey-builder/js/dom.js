export const byId = id => document.getElementById(id);
export const cloneTemplate = id => byId(id).content.firstElementChild.cloneNode(true);
