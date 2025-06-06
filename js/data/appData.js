import { loadData, saveData } from "../services/storage.js";

let notebooks = [];

export const initializeAppData = () => {
  notebooks = loadData();
};

export const getNotebooks = () => {
  return notebooks;
};

export const addNotebook = (name) => {
  if (!name || typeof name !== "string" || name.trim() === "") {
    console.error("Invalid notebook name.");
    return false;
  }

  let newNotebook = {
    id: Date.now().toString(),
    name: name,
    notes: [],
  };

  notebooks.push(newNotebook);
  saveData(notebooks);

  return true;
};

export const deleteNotebook = (notebookId) => {
  notebooks = notebooks.filter((notebook) => notebook.id !== notebookId);
  saveData(notebooks);
};

export const renameNotebook = (notebookId, newName) => {
  let notebookToRename = notebooks.find(
    (notebook) => notebook.id === notebookId
  );

  if (notebookToRename) {
    notebookToRename.name = newName;
    saveData(notebooks);
  } else {
    console.error("Notebook not found for renaming.");
  }
};
