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
