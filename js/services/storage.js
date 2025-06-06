const APP_DATA_KEY = 'appData';

export const loadData = () => {
    const data = localStorage.getItem(APP_DATA_KEY);
    const parsedData = JSON.parse(data) ?? [];
    return parsedData;
}