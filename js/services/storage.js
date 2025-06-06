const APP_DATA_KEY = "appData";

export const loadData = () => {
  try {
    const data = localStorage.getItem(APP_DATA_KEY);
    const parsedData = JSON.parse(data) ?? [];

    if (!Array.isArray(parsedData)) {
      console.warn(
        "Data in localStorage is not an array, resetting to empty array."
      );
      return [];
    }

    return parsedData;
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    localStorage.removeItem(APP_DATA_KEY); // Clear corrupted data
    return [];
  }
};

export const saveData = (data) => {
  if (!Array.isArray(data)) {
    console.error("Data to save must be an array.");
    return;
  }

  try {
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
};
