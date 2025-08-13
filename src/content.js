(function () {
  "use strict";

  const browserAPI = typeof browser !== "undefined" ? browser : chrome;
  const THEME_KEY = "hnTheme";
  const DARK = "dark";
  const LIGHT = "light";
  const SYSTEM = "system";
  const DARK_CLASS = "hn-dark-theme";
  let systemThemeListener = null;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  if (document.getElementById("hn-theme-switcher")) {
    return;
  }

  function readThemeSync() {
    try {
      const fromLS = window.localStorage.getItem(THEME_KEY);
      if ([DARK, LIGHT, SYSTEM].includes(fromLS)) return fromLS;
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

  function getSystemTheme() {
    return mediaQuery.matches ? DARK : LIGHT;
  }

  function applyTheme(theme) {
    const effectiveTheme = theme === SYSTEM ? getSystemTheme() : theme;
    document.documentElement.classList.toggle(DARK_CLASS, effectiveTheme === DARK);
  }

  const earlyTheme = readThemeSync();
  if (earlyTheme === DARK || (earlyTheme === SYSTEM && getSystemTheme() === DARK)) {
    applyTheme(earlyTheme || DARK);
  }

  function setupSystemThemeListener() {
    if (systemThemeListener) {
      mediaQuery.removeEventListener("change", systemThemeListener);
    }

    systemThemeListener = () => {
      browserAPI.storage.local.get([THEME_KEY]).then((result) => {
        if (result[THEME_KEY] === SYSTEM) {
          applyTheme(SYSTEM);
        }
      });
    };

    mediaQuery.addEventListener("change", systemThemeListener);
  }

  function createThemeSwitcher() {
    const dropdown = document.createElement("select");
    dropdown.id = "hn-theme-switcher";
    dropdown.title = "Choose theme";
    dropdown.innerHTML = `
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    `;

    dropdown.addEventListener("change", (e) => {
      const theme = e.target.value;
      applyTheme(theme);
      persistTheme(theme);

      if (theme === SYSTEM) {
        setupSystemThemeListener();
      }
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

      if (theme === SYSTEM) {
        setupSystemThemeListener();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeExtension);
  } else {
    initializeExtension();
  }
})();
