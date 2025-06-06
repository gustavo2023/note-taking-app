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
