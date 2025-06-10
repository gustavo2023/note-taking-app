import {
  initializeAppData,
  getNotebooks,
  addNotebook,
  deleteNotebook,
  renameNotebook,
  addNote,
  deleteNote,
  editNote,
} from "../data/appData.js";

/* DOM Elements */
const notebooksList = document.getElementById("notebooks-list");
const notesContainer = document.querySelector(".notes-container");

const renderNotebooks = (activeNotebookId) => {
  const notebooks = getNotebooks();
  notebooksList.innerHTML = ""; // Clear existing notebooks

  if (notebooks.length === 0) {
    const noNotebooksMessage = document.createElement("li");
    noNotebooksMessage.textContent =
      'No notebooks available yet. Click "New Notebook" to create one.';
    noNotebooksMessage.classList.add("no-notebooks-msg");
    notebooksList.appendChild(noNotebooksMessage);
    return;
  }

  notebooks.forEach((notebook) => {
    const notebookItem = document.createElement("li");
    notebookItem.classList.add("notebook-item");
    notebookItem.dataset.notebookId = notebook.id;

    const notebookNameSpan = document.createElement("span");
    notebookNameSpan.classList.add("notebook-name");
    notebookNameSpan.textContent = notebook.name;

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("notebook-action-btns");

    const deleteNotebookBtn = document.createElement("button");
    deleteNotebookBtn.classList.add("delete-notebook-btn");
    deleteNotebookBtn.setAttribute(
      "aria-label",
      `Delete notebook ${notebook.name}`
    );

    // Create delete icon
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteNotebookBtn.appendChild(deleteIcon);

    const editNotebookBtn = document.createElement("button");
    editNotebookBtn.classList.add("edit-notebook-btn");
    editNotebookBtn.setAttribute(
      "aria-label",
      `Rename notebook ${notebook.name}`
    );

    // Create edit icon
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-pen-to-square");
    editNotebookBtn.appendChild(editIcon);

    // Append elements
    actionsDiv.appendChild(deleteNotebookBtn);
    actionsDiv.appendChild(editNotebookBtn);

    notebookItem.appendChild(notebookNameSpan);
    notebookItem.appendChild(actionsDiv);

    notebooksList.appendChild(notebookItem);
  });
};

const renderNotes = (notebookId) => {
  const activeNotebook = getNotebooks().find(
    (notebook) => notebook.id === notebookId
  );
  const notes = activeNotebook ? activeNotebook.notes : [];
  notesContainer.innerHTML = ""; // Clear existing notes

  if (notes.length === 0) {
    notesContainer.textContent =
      "No notes available. Click 'New Note' to create one.";
    return;
  }

  notes.forEach((note) => {
    const noteItem = document.createElement("article");
    noteItem.classList.add("note");
    noteItem.dataset.noteId = note.id;

    const noteTitle = document.createElement("h4");
    noteTitle.classList.add("note-title");
    noteTitle.textContent = note.title || "Untitled Note";

    const noteContent = document.createElement("p");
    noteContent.classList.add("note-content");
    noteContent.textContent = note.content || "No content available.";

    const noteFooter = document.createElement("div");
    noteFooter.classList.add("note-footer");

    const noteDate = document.createElement("span");
    noteDate.classList.add("note-creation-date");
    noteDate.textContent = new Date(note.createdAt).toLocaleString();

    const noteActions = document.createElement("div");
    noteActions.classList.add("note-buttons-container");

    const deleteNoteBtn = document.createElement("button");
    deleteNoteBtn.classList.add("delete-note-btn");
    deleteNoteBtn.setAttribute("aria-label", `Delete note ${note.title || "Untitled Note"}`);

    // Create delete icon
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteNoteBtn.appendChild(deleteIcon);

    const editNoteBtn = document.createElement("button");
    editNoteBtn.classList.add("edit-note-btn");
    editNoteBtn.setAttribute("aria-label", `Edit note ${note.title || "Untitled Note"}`);

    // Create edit icon
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-pen-to-square");
    editNoteBtn.appendChild(editIcon);

    noteActions.appendChild(deleteNoteBtn);
    noteActions.appendChild(editNoteBtn);
    noteFooter.appendChild(noteDate);
    noteFooter.appendChild(noteActions);

    noteItem.appendChild(noteTitle);
    noteItem.appendChild(noteContent);
    noteItem.appendChild(noteFooter);

    notesContainer.appendChild(noteItem);
  });
};
