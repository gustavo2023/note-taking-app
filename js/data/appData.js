import { loadData, saveData } from "../services/storage.js";

let notebooks = [];

export const initializeAppData = () => {
  notebooks = loadData();
};

export const getNotebooks = () => {
  return notebooks;
};
