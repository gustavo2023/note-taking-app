const body = document.querySelector("body");
const THEME_KEY = "note-app-theme";

export const loadTheme = (toggleButton) => {
  let themeToApply;
  const storedTheme = localStorage.getItem(THEME_KEY);

  if (storedTheme) {
    themeToApply = storedTheme;
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    themeToApply = prefersDark ? "dark" : "light";

    localStorage.setItem(THEME_KEY, themeToApply);
  }

  if (themeToApply === "dark") {
    body.classList.add("dark-mode");
    toggleButton.checked = true;
  } else {
    body.classList.remove("dark-mode");
    toggleButton.checked = false;
  }
};

const saveTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

export const toggleTheme = (toggleButton) => {
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    saveTheme("light");
    toggleButton.checked = false;
  } else {
    body.classList.add("dark-mode");
    saveTheme("dark");
    toggleButton.checked = true;
  }
};
