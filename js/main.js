// -- Importing necessary modules and services --
import { loadTheme, toggleTheme } from "./services/theme.js";
import {
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
} from "./data/appData.js";
import {
  renderNotebooks,
  renderNotes,
  renderActiveNoteEditor,
} from "./ui/render.js";
import { saveDraft, loadDraft, clearDraft } from "./services/draftStorage.js";

// -- DOM Elements --

// Sidebar and related elements
const sidebar = document.querySelector(".sidebar");
const openSidebarButton = document.querySelector(".menu-open-btn");
const closeSidebarButton = document.querySelector(".close-menu-btn");
const sidebarOverlay = document.querySelector(".overlay");
const notebooksList = document.getElementById("notebooks-list");
// Buttons in sidebar
const newNoteButton = document.querySelector(".new-note-btn");
const newNotebookButton = document.querySelector(".new-notebook-btn");

const themeToggleButton = document.querySelector(".theme-toggle");
const notesContainer = document.querySelector(".notes-container");

// Modal elements
const noteModal = document.getElementById("note-modal");
const closeModalButton = noteModal.querySelector(".close-modal-btn");
const modalForm = document.getElementById("note-form");
const modalTitle = noteModal.querySelector(".modal-title");
const noteTitleInput = document.getElementById("note-title");
const noteContentInput = document.getElementById("note-content");
const noteSaveBtn = document.getElementById("save-note-btn");

let activeNotebookId = null;
let currentEditingNoteId = null;

//  -- Sidebar Toggle Functionality --
const toggleSidebar = () => {
  sidebar.classList.toggle("open");
  sidebarOverlay.classList.toggle("visible");

  // Toggle the aria attributes for accessibility
  const isOpen = sidebar.classList.contains("open");
  openSidebarButton.setAttribute("aria-expanded", isOpen);
  sidebar.setAttribute("aria-hidden", !isOpen);
  sidebarOverlay.setAttribute("aria-hidden", !isOpen);

  // Focus management
  if (isOpen) {
    closeSidebarButton.focus();
  } else {
    openSidebarButton.focus();
  }
};

const handleEscapeKeydown = (event) => {
  if (event.key === "Escape" && sidebar.classList.contains("open")) {
    toggleSidebar();
  }
};

const updateUI = () => {
  renderNotebooks(activeNotebookId);
  renderNotes(activeNotebookId);
};

const handleDeleteNotebook = (notebookId) => {
  const notebookToDelete = findNotebookById(notebookId);

  if (!notebookToDelete) {
    return false;
  }

  const notebookName = notebookToDelete.name;

  if (
    confirm(`Are you sure you want to delete the notebook "${notebookName}"?`)
  ) {
    const success = deleteNotebook(notebookId);

    if (success) {
      alert(`Notebook "${notebookName}" deleted successfully.`);
      if (activeNotebookId === notebookId) {
        const remainingNotebooks = getNotebooks();
        activeNotebookId =
          remainingNotebooks.length > 0 ? remainingNotebooks[0].id : null;
      }

      updateUI();
      return true;
    } else {
      alert(`Failed to delete notebook "${notebookName}".`);
      return false;
    }
  }

  return false;
};

const handleRenameNotebook = (notebookId) => {
  const notebookToRename = findNotebookById(notebookId);

  if (!notebookToRename) {
    return false;
  }

  const currentName = notebookToRename.name;
  const newName = prompt(
    `Enter a new name for the notebook "${currentName}":`,
    currentName
  );

  if (newName === null) {
    return false;
  }

  if (newName.trim() === "") {
    alert("Notebook name cannot be empty.");
    return false;
  }

  const success = renameNotebook(notebookId, newName);

  if (success) {
    alert(`Notebook renamed to ${newName.trim()} successfully.`);
    updateUI();
    return true;
  } else {
    alert("Failed to rename notebook");
    return false;
  }
};

const handleSelectedNotebook = (notebookId) => {
  const selectedNotebook = findNotebookById(notebookId);

  if (!selectedNotebook) {
    return false;
  }

  if (activeNotebookId !== notebookId) {
    activeNotebookId = notebookId;
    updateUI();
    return true;
  }

  return false;
};

const handleNotebookListClick = (event) => {
  const clickedElement = event.target.closest(".notebook-item");

  if (clickedElement) {
    const notebookId = clickedElement.dataset.notebookId;

    if (event.target.closest(".delete-notebook-btn")) {
      handleDeleteNotebook(notebookId);
    } else if (event.target.closest(".edit-notebook-btn")) {
      handleRenameNotebook(notebookId);
    } else {
      handleSelectedNotebook(notebookId);
    }
  }
};

const handleEditNote = (notebookId, noteId) => {
  const noteToEdit = findNoteInNotebookById(notebookId, noteId);

  if (!noteToEdit) {
    console.warn(`Note with ID ${noteId} not found in notebook ${notebookId}.`);
    return;
  }

  currentEditingNoteId = noteId;
  renderActiveNoteEditor(notebookId, noteId, "edit");
};

const handleDeleteNote = (notebookId, noteId) => {
  const noteToDelete = findNoteInNotebookById(notebookId, noteId);

  if (!noteToDelete) {
    console.warn(`Note with ID ${noteId} not found in notebook ${notebookId}.`);
    return;
  }

  const noteTitle = noteToDelete.title || "Untitled Note";

  if (confirm(`Are you sure you want to delete the note "${noteTitle}"?`)) {
    const success = deleteNote(notebookId, noteId);

    if (success) {
      alert(`Note "${noteTitle}" deleted successfully.`);
      updateUI();
    } else {
      alert(`Failed to delete note "${noteTitle}".`);
    }
  }
};

const handleViewNote = (notebookId, noteId) => {
  const noteToView = findNoteInNotebookById(notebookId, noteId);

  if (!noteToView) {
    console.warn(`Note with ID ${noteId} not found in notebook ${notebookId}.`);
    return;
  }

  currentEditingNoteId = null;
  renderActiveNoteEditor(notebookId, noteId, "view");
};

const handleNotesContainerClick = (event) => {
  const clickedElement = event.target.closest(".note");

  if (clickedElement) {
    const noteId = clickedElement.dataset.noteId;
    const notebookId = activeNotebookId;

    if (!notebookId) {
      console.warn("No active notebook selected.");
      return;
    }

    if (event.target.closest(".edit-note-btn")) {
      handleEditNote(notebookId, noteId);
    } else if (event.target.closest(".delete-note-btn")) {
      handleDeleteNote(notebookId, noteId);
    } else {
      handleViewNote(notebookId, noteId);
    }
  }
};

const handleNewNoteClick = () => {
  if (!activeNotebookId) {
    alert("Please select a notebook first.");
    return;
  }

  currentEditingNoteId = null; // Reset editing note ID
  renderActiveNoteEditor(activeNotebookId);
};

// -- Function to initialize the application --
const initializeApp = () => {
  // Initialize Themes
  if (themeToggleButton) {
    loadTheme(themeToggleButton);
    themeToggleButton.addEventListener("change", () => {
      toggleTheme(themeToggleButton);
    });
  } else {
    console.warn("Theme toggle button not found.");
  }

  // Initialize App Data
  initializeAppData();

  const notebooks = getNotebooks();
  if (notebooks.length > 0) {
    activeNotebookId = notebooks[0].id; // Set the first notebook as active
  }

  // Render initial UI
  updateUI();

  // Event listeners for opening and closing the sidebar
  document.addEventListener("keydown", handleEscapeKeydown);
  sidebarOverlay.addEventListener("click", toggleSidebar);
  openSidebarButton.addEventListener("click", toggleSidebar);
  closeSidebarButton.addEventListener("click", toggleSidebar);

  notebooksList.addEventListener("click", handleNotebookListClick);
  notesContainer.addEventListener("click", handleNotesContainerClick);
  newNoteButton.addEventListener("click", handleNewNoteClick);
};

// Initialize the application
initializeApp();
