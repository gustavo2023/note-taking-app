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
const noteContainer = document.querySelector(".note-container");

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

    // TODO: Add event listeners for notebook actions
  });
};
