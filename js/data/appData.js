import { loadData, saveData } from "../services/storage.js";

let notebooks = [];

const initializeAppData = () => {
  notebooks = loadData();
};

const getNotebooks = () => {
  return notebooks;
};

const createNotebook = (name) => {
  return {
    id: Date.now().toString(),
    name: name.trim(),
    notes: [],
  };
};

const createNote = (title, content) => {
  const nowTimestamp = Date.now();
  return {
    id: nowTimestamp.toString(),
    title: title.trim(),
    content: content.trim(),
    createdAt: nowTimestamp,
    updatedAt: nowTimestamp,
  };
};

const addNotebook = (name) => {
  if (!name || typeof name !== "string" || name.trim() === "") {
    console.error("Invalid notebook name.");
    return false;
  }

  let newNotebook = createNotebook(name);

  notebooks.push(newNotebook);
  saveData(notebooks);

  return true;
};

const deleteNotebook = (notebookId) => {
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

const renameNotebook = (notebookId, newName) => {
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

const addNote = (notebookId, title, content) => {
  if (
    !notebookId ||
    typeof notebookId !== "string" ||
    notebookId.trim() === ""
  ) {
    console.error("Invalid notebook ID.");
    return false;
  }

  if (!title || typeof title !== "string") {
    console.error("Invalid note title.");
    return false;
  }

  if (!content || typeof content !== "string") {
    console.error("Invalid note content.");
    return false;
  }

  let notebook = notebooks.find((notebook) => notebook.id === notebookId);
  if (!notebook) {
    console.warn("Notebook not found for adding note.");
    return false;
  }

  let newNote = createNote(title, content);
  notebook.notes.push(newNote);
  saveData(notebooks);
  return true;
};

const deleteNote = (notebookId, noteId) => {
  if (
    !notebookId ||
    typeof notebookId !== "string" ||
    notebookId.trim() === ""
  ) {
    console.error("Invalid notebook ID.");
    return false;
  }

  if (!noteId || typeof noteId !== "string" || noteId.trim() === "") {
    console.error("Invalid note ID.");
    return false;
  }

  let notebook = notebooks.find((notebook) => notebook.id === notebookId);
  if (!notebook) {
    console.warn("Notebook not found for deleting note.");
    return false;
  }

  const initialNotesLength = notebook.notes.length;
  notebook.notes = notebook.notes.filter((note) => note.id !== noteId);

  if (notebook.notes.length < initialNotesLength) {
    saveData(notebooks);
    return true;
  } else {
    console.warn("Note not found for deletion.");
    return false;
  }
};

const editNote = (notebookId, noteId, newTitle, newContent) => {
  if (
    !notebookId ||
    typeof notebookId !== "string" ||
    notebookId.trim() === ""
  ) {
    console.error("Invalid notebook ID.");
    return false;
  }

  if (!noteId || typeof noteId !== "string" || noteId.trim() === "") {
    console.error("Invalid note ID.");
    return false;
  }

  let notebook = notebooks.find((notebook) => notebook.id === notebookId);
  if (!notebook) {
    console.warn("Notebook not found for editing note.");
    return false;
  }

  let noteToEdit = notebook.notes.find((note) => note.id === noteId);
  if (!noteToEdit) {
    console.warn("Note not found for editing.");
    return false;
  }

  if (newTitle && typeof newTitle === "string") {
    noteToEdit.title = newTitle.trim();
  }

  if (newContent && typeof newContent === "string") {
    noteToEdit.content = newContent.trim();
  }

  noteToEdit.updatedAt = Date.now();

  saveData(notebooks);
  return true;
};

export {
  initializeAppData,
  getNotebooks,
  addNotebook,
  deleteNotebook,
  renameNotebook,
  addNote,
  deleteNote,
  editNote,
};
