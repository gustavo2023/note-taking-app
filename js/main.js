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
};

// Event listeners for opening and closing the sidebar
document.addEventListener("keydown", handleEscapeKeydown);
sidebarOverlay.addEventListener("click", toggleSidebar);
openSidebarButton.addEventListener("click", toggleSidebar);
closeSidebarButton.addEventListener("click", toggleSidebar);

// Initialize the application
initializeApp();
