(function () {
  "use strict";

  const browserAPI = typeof browser !== "undefined" ? browser : chrome;
  const THEME_KEY = "hnTheme";
  const DARK = "dark";
  const LIGHT = "light";
  const DARK_CLASS = "hn-dark-theme";

  if (document.getElementById("hn-theme-switcher")) {
    return;
  }

  function readThemeSync() {
    try {
      const fromLS = window.localStorage.getItem(THEME_KEY);
      if (fromLS === "dark" || fromLS === "light") return fromLS;
    } catch (_) {}
    return null;
  }

  function persistTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}

    if (browserAPI?.storage?.local?.set) {
      browserAPI.storage.local.set({ [THEME_KEY]: theme }).catch(() => {});
    }
  }

  function applyTheme(theme) {
    document.documentElement.classList.toggle(DARK_CLASS, theme === DARK);
  }

  const earlyTheme = readThemeSync();
  if (earlyTheme === DARK) {
    applyTheme(DARK);
  }

  function createThemeSwitcher() {
    const dropdown = document.createElement("select");
    dropdown.id = "hn-theme-switcher";
    dropdown.title = "Choose theme";
    dropdown.innerHTML = `
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    `;

    dropdown.addEventListener("change", (e) => {
      const theme = e.target.value;
      applyTheme(theme);
      persistTheme(theme);
    });

    return dropdown;
  }

  function addSwitcherToPage(dropdown) {
    const header = document.querySelector(".pagetop");
    if (header) {
      header.appendChild(dropdown);
    } else if (document.body) {
      document.body.appendChild(dropdown);
    }
  }

  function initializeExtension() {
    browserAPI.storage.local.get([THEME_KEY]).then((result) => {
      const theme = result[THEME_KEY] || earlyTheme || LIGHT;
      applyTheme(theme);
      persistTheme(theme);

      const dropdown = createThemeSwitcher();
      dropdown.value = theme;
      addSwitcherToPage(dropdown);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeExtension);
  } else {
    initializeExtension();
  }
})();
