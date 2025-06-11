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
const noteModal = document.getElementById("note-modal");
const modalTitle = document.querySelector(".modal-title");
const noteTitleInput = document.getElementById("note-title");
const noteContentInput = document.getElementById("note-content");
const noteSaveBtn = document.getElementById("save-note-btn");

const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInDays = Math.floor(diffInSeconds / 86400);

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInSeconds / 3600);
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 1) return "Just now";
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  // Default to a simple date format if older than a year or for very recent future dates
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

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
    noteDate.textContent = formatRelativeDate(note.createdAt);

    const noteActions = document.createElement("div");
    noteActions.classList.add("note-buttons-container");

    const deleteNoteBtn = document.createElement("button");
    deleteNoteBtn.classList.add("delete-note-btn");
    deleteNoteBtn.setAttribute(
      "aria-label",
      `Delete note ${note.title || "Untitled Note"}`
    );

    // Create delete icon
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteNoteBtn.appendChild(deleteIcon);

    const editNoteBtn = document.createElement("button");
    editNoteBtn.classList.add("edit-note-btn");
    editNoteBtn.setAttribute(
      "aria-label",
      `Edit note ${note.title || "Untitled Note"}`
    );

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

const renderActiveNoteEditor = (notebookId, noteId = null, mode = "create") => {
  if (mode === "edit" && noteId) {
    modalTitle.textContent = "Edit Note";
  } else if (mode === "view" && noteId) {
    modalTitle.textContent = "View Note";
  } else {
    modalTitle.textContent = "Create Note";
  }

  if (noteId) {
    const noteToDisplay = findNoteInNotebookById(notebookId, noteId);

    if (noteToDisplay) {
      noteTitleInput.value = noteToDisplay.title || "";
      noteContentInput.value = noteToDisplay.content || "";

      // TODO: Load sessionStorage draft here if it's the currently edited note
    } else {
      console.warn(
        `Note with ID ${noteId} not found in notebook with ID ${notebookId}.`
      );
      noteTitleInput.value = "";
      noteContentInput.value = "";
      return;
    }
  } else {
    noteTitleInput.value = "";
    noteContentInput.value = "";

    // TODO: Clear sessionStorage draft if creating a new note. Load sessionStorage draft if it exists.
  }

  if (mode === "view") {
    noteTitleInput.readOnly = true;
    noteContentInput.readOnly = true;
    noteSaveBtn.style.display = "none";
  } else {
    noteTitleInput.readOnly = false;
    noteContentInput.readOnly = false;
    noteSaveBtn.style.display = "flex";
  }

  noteModal.showModal();
};
