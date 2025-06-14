import { loadData, saveData } from "../services/storage.js";
import { validateNonEmptyString } from "../utils/validation.js";

let notebooks = [];

const findNotebookById = (notebookId) => {
  if (!validateNonEmptyString(notebookId, "notebook ID")) {
    return null;
  }

  const notebook = notebooks.find((nb) => nb.id === notebookId);
  if (!notebook) {
    console.warn(`Notebook not found with ID: ${notebookId}.`);
    return null;
  }
  return notebook;
};

const findNoteInNotebookById = (notebookId, noteId) => {
  if (!validateNonEmptyString(noteId, "note ID")) {
    return null;
  }

  const notebook = findNotebookById(notebookId);
  if (!notebook) {
    return null;
  }

  const note = notebook.notes.find((n) => n.id === noteId);

  if (!note) {
    console.warn(
      `Note not found with ID: ${noteId} in notebook "${notebook.name}".`
    );
    return null;
  }
  return note;
};

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
  if (!validateNonEmptyString(name, "notebook name")) {
    return false;
  }

  let newNotebook = createNotebook(name);

  notebooks.push(newNotebook);
  saveData(notebooks);
  return true;
};

const deleteNotebook = (notebookId) => {
  if (!validateNonEmptyString(notebookId, "notebook ID")) {
    return false;
  }

  const initialLength = notebooks.length;
  notebooks = notebooks.filter((notebook) => notebook.id !== notebookId);

  if (notebooks.length < initialLength) {
    saveData(notebooks);
    return true;
  } else {
    console.warn("Notebook not found for deletion.");
    return false;
  }
};

const renameNotebook = (notebookId, newName) => {
  if (!validateNonEmptyString(newName, "new notebook name")) {
    return false;
  }

  let notebookToRename = findNotebookById(notebookId);
  if (!notebookToRename) {
    return false;
  }

  notebookToRename.name = newName.trim();
  saveData(notebooks);
  return true;
};

const addNote = (notebookId, title, content) => {
  if (!validateNonEmptyString(title, "note title")) {
    return false;
  }

  if (!validateNonEmptyString(content, "note content")) {
    return false;
  }

  const notebook = findNotebookById(notebookId);
  if (!notebook) {
    return false;
  }

  const newNote = createNote(title, content);
  notebook.notes.push(newNote);
  saveData(notebooks);
  return true;
};

const deleteNote = (notebookId, noteId) => {
  if (!validateNonEmptyString(noteId, "note ID")) {
    return false;
  }

  let notebook = findNotebookById(notebookId);
  if (!notebook) {
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
  let noteToEdit = findNoteInNotebookById(notebookId, noteId);
  if (!noteToEdit) {
    return false;
  }

  if (newTitle && typeof newTitle === "string") {
    noteToEdit.title = newTitle.trim();
  }

  if (newContent && typeof newContent === "string") {
    noteToEdit.content = newContent.trim();
  }

  const titleChanged = newTitle && newTitle.trim() !== noteToEdit.title;
  const contentChanged = newContent && newContent.trim() !== noteToEdit.content;

  if (!titleChanged && !contentChanged) {
    console.warn("No changes made to the note.");
    return true;
  } else {
    noteToEdit.updatedAt = Date.now();
    saveData(notebooks);
    return true;
  }
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
  findNotebookById,
  findNoteInNotebookById,
};
