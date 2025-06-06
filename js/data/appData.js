import { loadData, saveData } from "../services/storage.js";

let notebooks = [];

export const initializeAppData = () => {
  notebooks = loadData();
};

export const getNotebooks = () => {
  return notebooks;
};

export const addNotebook = (name) => {
  let newNotebook = {
    id: Date.now().toString(),
    name: name,
    notes: [],
  };

  notebooks.push(newNotebook);
  saveData(notebooks);
};

export const deleteNotebook = (notebookId) => {
  notebooks = notebooks.filter((notebook) => notebook.id !== notebookId);
  saveData(notebooks);
};
