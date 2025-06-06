import { loadData, saveData } from "../services/storage.js";

let notebooks = [];

export const initializeAppData = () => {
  notebooks = loadData();
};

export const getNotebooks = () => {
  return notebooks;
};

const createNotebook = (name) => {
  return {
    id: Date.now().toString(),
    name: name.trim(),
    notes: [],
  };
};

export const addNotebook = (name) => {
  if (!name || typeof name !== "string" || name.trim() === "") {
    console.error("Invalid notebook name.");
    return false;
  }

  let newNotebook = createNotebook(name);

  notebooks.push(newNotebook);
  saveData(notebooks);

  return true;
};

export const deleteNotebook = (notebookId) => {
  if (
    !notebookId ||
    typeof notebookId !== "string" ||
    notebookId.trim() === ""
  ) {
    console.error("Invalid notebook ID.");
    return false;
  }

  const notebookArrayInitialLength = notebooks.length;
  notebooks = notebooks.filter((notebook) => notebook.id !== notebookId);

  if (notebooks.length < notebookArrayInitialLength) {
    saveData(notebooks);
    return true;
  } else {
    console.warn("Notebook not found for deletion.");
    return false;
  }
};

export const renameNotebook = (notebookId, newName) => {
  if (
    !notebookId ||
    typeof notebookId !== "string" ||
    notebookId.trim() === ""
  ) {
    console.error("Invalid notebook ID.");
    return false;
  }

  if (!newName || typeof newName !== "string" || newName.trim() === "") {
    console.error("Invalid new notebook name.");
    return false;
  }

  let notebookToRename = notebooks.find(
    (notebook) => notebook.id === notebookId
  );

  if (notebookToRename) {
    notebookToRename.name = newName.trim();
    saveData(notebooks);
  } else {
    console.warn("Notebook not found for renaming.");
  }
};
