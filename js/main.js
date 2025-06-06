// -- Importing necessary modules and services --
import { loadTheme, toggleTheme } from "./services/theme.js";

// -- DOM Elements --
const sidebar = document.querySelector(".sidebar");
const openSidebarButton = document.querySelector(".menu-open-btn");
const closeSidebarButton = document.querySelector(".close-menu-btn");
const sidebarOverlay = document.querySelector(".overlay");
const themeToggleButton = document.querySelector(".theme-toggle");

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

// -- Function to initialize the application --
const initializeApp = () => {
  if (themeToggleButton) {
    loadTheme(themeToggleButton);
    themeToggleButton.addEventListener("change", () => {
      toggleTheme(themeToggleButton);
    });
  } else {
    console.warn("Theme toggle button not found.");
  }
};

// Event listeners for opening and closing the sidebar
document.addEventListener("keydown", handleEscapeKeydown);
sidebarOverlay.addEventListener("click", toggleSidebar);
openSidebarButton.addEventListener("click", toggleSidebar);
closeSidebarButton.addEventListener("click", toggleSidebar);

// Initialize the application
initializeApp();
