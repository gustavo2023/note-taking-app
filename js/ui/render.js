import {
  getNotebooks,
  findNotebookById,
  findNoteInNotebookById,
} from "../data/appData.js";
import { loadDraft } from "../services/draftStorage.js";
import {
  formatRelativeDate,
  getGreetingMessage,
  getCurrentFormatDate,
} from "../utils/dateHelpers.js";

// DOM Elements
const greetingMessageElement = document.querySelector(".greeting-msg");
const currentDateElement = document.querySelector(".current-date");
const mainContentNotebookTitle = document.querySelector(".notebook-title");
const notesSection = document.querySelector(".notes-section");
const notebooksList = document.getElementById("notebooks-list");
const notesContainer = document.querySelector(".notes-container");
const noteModal = document.getElementById("note-modal");
const modalTitle = noteModal.querySelector(".modal-title");
const noteTitleInput = document.getElementById("note-title");
const noteContentInput = document.getElementById("note-content");
const noteSaveBtn = document.getElementById("save-note-btn");

// Generic Modal DOM Elements
const genericModal = document.getElementById("generic-modal");
const genericModalTitle = genericModal.querySelector("#generic-modal-title");
const genericModalMessage = genericModal.querySelector(
  "#generic-modal-message"
);
const genericModalInputGroup = genericModal.querySelector(
  ".generic-input-group"
);
const genericModalInput = genericModal.querySelector("#generic-modal-input");
const genericConfirmBtn = genericModal.querySelector("#generic-confirm-btn");
const genericCancelBtn = genericModal.querySelector("#generic-cancel-btn");
const genericModalCloseBtn = genericModal.querySelector(".close-modal-btn");

let currentConfirmCallback = null;
let currentCancelCallback = null;
let currentGenericModalCloseCallback = null;

const cleanupGenericModalListeners = () => {
  if (currentConfirmCallback) {
    genericConfirmBtn.removeEventListener("click", currentConfirmCallback);
    currentConfirmCallback = null;
  }
  if (currentCancelCallback) {
    genericCancelBtn.removeEventListener("click", currentCancelCallback);
    currentCancelCallback = null;
  }
  if (currentGenericModalCloseCallback) {
    genericModalCloseBtn.removeEventListener(
      "click",
      currentGenericModalCloseCallback
    );
    currentGenericModalCloseCallback = null;
  }
};

const _setGenericModalContent = (title, message, confirmText, cancelText) => {
  genericModalTitle.textContent = title;
  genericModalMessage.textContent = message;
  genericConfirmBtn.textContent = confirmText;
  genericCancelBtn.textContent = cancelText;
};

const _configureGenericModalInput = (
  showInput,
  inputValue,
  inputPlaceholder,
  inputType
) => {
  if (showInput) {
    genericModalInputGroup.style.display = "flex";
    genericModalInput.value = inputValue;
    genericModalInput.placeholder = inputPlaceholder;
    genericModalInput.type = inputType;
    genericModalInput.focus();
  } else {
    genericModalInputGroup.style.display = "none";
    genericModalInput.value = "";
  }
};

const _attachGenericModalEventListeners = (onConfirm, onCancel, showInput) => {
  const handleConfirm = (event) => {
    event.preventDefault();
    onConfirm(showInput ? genericModalInput.value.trim() : undefined);
    genericModal.close();
  };

  const handleCancel = () => {
    onCancel();
    genericModal.close();
  };

  const handleModalCloseByX = (event) => {
    event.preventDefault();
    onCancel();
    genericModal.close();
  };

  currentConfirmCallback = handleConfirm;
  currentCancelCallback = handleCancel;
  currentGenericModalCloseCallback = handleModalCloseByX;

  genericConfirmBtn.addEventListener("click", currentConfirmCallback);
  genericCancelBtn.addEventListener("click", currentCancelCallback);
  genericModalCloseBtn.addEventListener(
    "click",
    currentGenericModalCloseCallback
  );

  genericModal.onclose = () => {
    genericModal.onclose = null;
    cleanupGenericModalListeners();
  };
};

const showGenericModal = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm = () => {},
  onCancel = () => {},
  showInput = false,
  inputValue = "",
  inputPlaceholder = "",
  inputType = "text",
}) => {
  cleanupGenericModalListeners();

  _setGenericModalContent(title, message, confirmText, cancelText);

  _configureGenericModalInput(
    showInput,
    inputValue,
    inputPlaceholder,
    inputType
  );

  _attachGenericModalEventListeners(onConfirm, onCancel, showInput);

  genericModal.showModal();
};

const renderMainContentHeader = () => {
  if (greetingMessageElement) {
    greetingMessageElement.textContent = getGreetingMessage();
  } else {
    console.warn("Greeting message element not found.");
  }

  if (currentDateElement) {
    currentDateElement.textContent = getCurrentFormatDate();
  } else {
    console.warn("Current date element not found.");
  }
};

const updateMainContentTitle = (notebookName) => {
  if (notebookName) {
    mainContentNotebookTitle.textContent = notebookName;
  } else {
    mainContentNotebookTitle.textContent = "Select a Notebook";
  }
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

    if (notebook.id === activeNotebookId) {
      notebookItem.classList.add("active");
    }

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
  let notes = [];
  const existingNoNotesMsg = notesSection.querySelector(".no-notes-msg");

  if (existingNoNotesMsg) {
    existingNoNotesMsg.remove();
  }

  if (notebookId) {
    const activeNotebook = findNotebookById(notebookId);
    notes = activeNotebook ? activeNotebook.notes : [];
  }

  notesContainer.innerHTML = ""; // Clear existing notes

  if (notes.length === 0) {
    const noNotesMessage = document.createElement("p");
    noNotesMessage.classList.add("no-notes-msg");
    noNotesMessage.textContent =
      "No notes available in this notebook. Create a new note to get started.";
    notesSection.appendChild(noNotesMessage);
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

      if (mode === "view") {
        modalTitle.textContent = noteToDisplay.title || "View Note";
      }
    } else {
      console.warn(
        `Note with ID ${noteId} not found in notebook with ID ${notebookId}.`
      );
      noteTitleInput.value = "";
      noteContentInput.value = "";
      noteModal.close();
      return;
    }
  } else {
    noteTitleInput.value = "";
    noteContentInput.value = "";

    const draftContent = loadDraft();

    if (draftContent) {
      noteContentInput.value = draftContent;
    }
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

export {
  showGenericModal,
  renderMainContentHeader,
  updateMainContentTitle,
  renderNotebooks,
  renderNotes,
  renderActiveNoteEditor,
};
