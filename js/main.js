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
  showGenericModal,
  renderMainContentHeader,
  updateMainContentTitle,
  renderNotebooks,
  renderNotes,
  renderActiveNoteEditor,
} from "./ui/render.js";
import { saveDraft, clearDraft } from "./services/draftStorage.js";

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
const noteTitleInput = document.getElementById("note-title");
const noteContentInput = document.getElementById("note-content");

let activeNotebookId = null;
let currentEditingNoteId = null;
let lastFocusedElementBeforeModal = null;

// -- Utility Functions --
const _handleOperationResult = (
  success,
  failureMessage,
  failureDetails = null,
  callbackOnSuccess = () => {}
) => {
  if (success) {
    updateUI();
    callbackOnSuccess();
  } else {
    showGenericModal({
      title: "Error",
      message: failureMessage,
      confirmText: "OK",
      cancelText: "Close",
    });
    console.error(failureMessage, failureDetails);
  }
};

const _handleItemActions = (
  event,
  itemSelector,
  idDatasetName,
  actionHandlers
) => {
  const targetElement = event.target.closest(itemSelector);

  if (targetElement) {
    if (
      event.type === "keydown" &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
    }

    const itemId = targetElement.dataset[idDatasetName];
    const contextId = itemSelector === ".note" ? activeNotebookId : itemId;

    let handled = false;

    for (const [btnSelector, handlerFn] of Object.entries(actionHandlers)) {
      if (btnSelector !== "default" && event.target.closest(btnSelector)) {
        if (itemSelector === ".note") {
          handlerFn(contextId, itemId); 
        } else {
          handlerFn(itemId);
        }
        handled = true;
        break;
      }
    }

    // If no specific button was clicked/focused, perform the default action
    if (!handled && actionHandlers.default) {
      if (itemSelector === ".note") {
        actionHandlers.default(contextId, itemId);
      } else {
        actionHandlers.default(itemId);
      }
    }
  }
};

// -- Main Functionality --

//  -- Sidebar Toggle Functionality --
const toggleSidebar = () => {
  sidebar.classList.toggle("open");
  sidebarOverlay.classList.toggle("visible");

  // Toggle the aria attributes for accessibility
  const isOpen = sidebar.classList.contains("open");
  openSidebarButton.setAttribute("aria-expanded", isOpen);
  sidebar.setAttribute("aria-hidden", !isOpen);
  sidebarOverlay.setAttribute("aria-hidden", !isOpen);

  sidebar.toggleAttribute("inert", !isOpen);

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

  const activeNotebook = findNotebookById(activeNotebookId);
  const notebookName = activeNotebook ? activeNotebook.name : null;

  renderMainContentHeader();
  updateMainContentTitle(notebookName);
};

const handleDeleteNotebook = (notebookId) => {
  const notebookToDelete = findNotebookById(notebookId);

  if (!notebookToDelete) {
    return;
  }

  const notebookName = notebookToDelete.name;

  showGenericModal({
    title: "Confirm Deletion",
    message: `Are you sure you want to delete the notebook "${notebookName}" and all its notes? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    onConfirm: () => {
      const success = deleteNotebook(notebookId);

      if (success) {
        if (activeNotebookId === notebookId) {
          const remainingNotebooks = getNotebooks();
          activeNotebookId =
            remainingNotebooks.length > 0 ? remainingNotebooks[0].id : null;
        }
        updateUI();
      } else {
        showGenericModal({
          title: "Error",
          message: `Failed to delete notebook "${notebookName}". Please try again.`,
          confirmText: "OK",
          cancelText: "Close",
        });

        console.error(`Failed to delete notebook "${notebookName}".`);
      }
    },
    onCancel: () => {
      return; // No action needed on cancel
    },
  });
};

const handleRenameNotebook = (notebookId) => {
  const notebookToRename = findNotebookById(notebookId);

  if (!notebookToRename) {
    return;
  }

  const currentName = notebookToRename.name;

  showGenericModal({
    title: "Rename Notebook",
    message: `Enter a new name for the notebook "${currentName}":`,
    confirmText: "Rename",
    cancelText: "Cancel",
    showInput: true,
    inputValue: currentName,
    inputPlaceholder: "New notebook name...",
    onConfirm: (newName) => {
      if (newName.trim() === "") {
        showGenericModal({
          title: "Error",
          message: "Notebook name cannot be empty. Please enter a valid name.",
          confirmText: "OK",
          cancelText: "Close",
        });

        return;
      }

      const success = renameNotebook(notebookId, newName);
      if (success) {
        updateUI();
      } else {
        showGenericModal({
          title: "Error",
          message: `Failed to rename notebook "${currentName}". Please try again.`,
          confirmText: "OK",
          cancelText: "Close",
        });

        console.error(`Failed to rename notebook "${currentName}".`);
      }
    },
    onCancel: () => {
      return;
    },
  });
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

const handleNotebookListKeydown = (event) => {
  if (event.key === "Enter" || event.key === " ") {
    const focusedElement = event.target.closest(".notebook-item");

    if (focusedElement) {
      event.preventDefault();

      const notebookId = focusedElement.dataset.notebookId;

      // Check if focus is on a nested button or the main item
      if (event.target.closest(".delete-notebook-btn")) {
        handleDeleteNotebook(notebookId);
      } else if (event.target.closest(".edit-notebook-btn")) {
        handleRenameNotebook(notebookId);
      } else {
        handleSelectedNotebook(notebookId);
      }
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

  showGenericModal({
    title: "Confirm Deletion",
    message: `Are you sure you want to delete note "${noteTitle}"? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    onConfirm: () => {
      const success = deleteNote(notebookId, noteId);
      if (success) {
        updateUI();
      } else {
        showGenericModal({
          title: "Error",
          message: `Failed to delete note "${noteTitle}". Please try again.`,
          confirmText: "OK",
          cancelText: "Close",
        });

        console.error(`Failed to delete note "${noteTitle}".`);
      }
    },
    onCancel: () => {
      return;
    },
  });
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

const handleNotesContainerKeydown = (event) => {
  if (event.key === "Enter" || event.key === " ") {
    const focusedElement = event.target.closest(".note");

    if (focusedElement) {
      event.preventDefault();

      const noteId = focusedElement.dataset.noteId;
      const notebookId = activeNotebookId;

      if (!notebookId) {
        console.warn("No active notebook selected.");
        return;
      }

      // Check if focus is on a nested button or the main item
      if (event.target.closest(".edit-note-btn")) {
        handleEditNote(notebookId, noteId);
      } else if (event.target.closest(".delete-note-btn")) {
        handleDeleteNote(notebookId, noteId);
      } else {
        handleViewNote(notebookId, noteId);
      }
    }
  }
};

const handleNewNoteClick = () => {
  if (!activeNotebookId) {
    showGenericModal({
      title: "Action Required",
      message: "Please select or create a notebook first to add a note.",
      confirmText: "OK",
      cancelText: "Close",
    });

    return;
  }

  currentEditingNoteId = null;
  renderActiveNoteEditor(activeNotebookId);
};

const handleNewNotebookClick = () => {
  showGenericModal({
    title: "New Notebook",
    message: "Enter a name for the new notebook:",
    confirmText: "Create",
    cancelText: "Cancel",
    showInput: true,
    inputValue: "",
    inputPlaceholder: "Notebook name...",
    onConfirm: (notebookName) => {
      if (notebookName.trim() === "") {
        showGenericModal({
          title: "Error",
          message: "Notebook name cannot be empty. Please enter a valid name.",
          confirmText: "OK",
          cancelText: "Close",
        });

        return;
      }

      const success = addNotebook(notebookName);

      if (success) {
        const newNotebooks = getNotebooks();
        activeNotebookId = newNotebooks[newNotebooks.length - 1].id;
        updateUI();
      } else {
        showGenericModal({
          title: "Error",
          message: `Failed to create notebook "${notebookName.trim()}". Please try again.`,
          confirmText: "OK",
          cancelText: "Close",
        });
        console.error(`Failed to create notebook "${notebookName.trim()}".`);
      }
    },
    onCancel: () => {
      return;
    },
  });
};

const handleNoteFormSubmit = (event) => {
  event.preventDefault();

  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();

  if (!activeNotebookId) {
    showGenericModal({
      title: "Action Required",
      message: "Please select a notebook first. Closing the modal.",
      confirmText: "OK",
      cancelText: "Close",
      onConfirm: () => noteModal.close(),
    });
    return;
  }

  let success = false;
  let actionMessage = "";

  if (currentEditingNoteId) {
    success = editNote(activeNotebookId, currentEditingNoteId, title, content);
    if (success) {
      actionMessage = `Note "${
        title || "Untitled Note"
      }" updated successfully.`;
    } else {
      actionMessage = `Failed to update note "${title || "Untitled Note"}".`;
    }
  } else {
    success = addNote(activeNotebookId, title, content);
    if (success) {
      actionMessage = `Note "${
        title || "Untitled Note"
      }" created successfully.`;
    } else {
      actionMessage = `Failed to create note "${title || "Untitled Note"}".`;
    }
  }

  if (success) {
    updateUI();
    noteModal.close();
    clearDraft(); // Clear draft after saving
  } else {
    showGenericModal({
      title: "Error",
      message: actionMessage,
      confirmText: "OK",
      cancelText: "Close",
    });
    console.error(actionMessage);
  }
};

const handleCloseModalClick = () => {
  noteModal.close();

  if (lastFocusedElementBeforeModal) {
    lastFocusedElementBeforeModal.focus();
    lastFocusedElementBeforeModal = null;
  }
};

const handleNoteInputForDraft = () => {
  if (currentEditingNoteId === null) {
    const content = noteContentInput.value.trim();
    if (content) {
      saveDraft(content);
    } else {
      clearDraft(); // Clear draft if content is empty
    }
  }
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
  notebooksList.addEventListener("keydown", handleNotebookListKeydown);
  notesContainer.addEventListener("click", handleNotesContainerClick);
  notesContainer.addEventListener("keydown", handleNotesContainerKeydown);
  newNoteButton.addEventListener("click", handleNewNoteClick);
  newNotebookButton.addEventListener("click", handleNewNotebookClick);

  modalForm.addEventListener("submit", handleNoteFormSubmit);
  closeModalButton.addEventListener("click", handleCloseModalClick);

  newNoteButton.addEventListener("click", () => {
    lastFocusedElementBeforeModal = newNoteButton;
  });

  newNotebookButton.addEventListener("click", () => {
    lastFocusedElementBeforeModal = newNotebookButton;
  });

  noteContentInput.addEventListener("input", handleNoteInputForDraft);
  noteTitleInput.addEventListener("input", handleNoteInputForDraft);
};

// Initialize the application
initializeApp();
