/* Aplica o tema antes da renderização e compartilha a escolha entre páginas. */
(() => {
  "use strict";

  const root = document.documentElement;
  const storageKey = "raio-local-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: light)");

  const savedTheme = () => {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "light" ? "#f7f5f0" : "#0b0c0e";

    document.querySelectorAll(".logo-image").forEach((logo) => {
      logo.src = logo.src.replace(
        /logo-raio-local-(?:branca|preta)\.svg$/,
        `logo-raio-local-${theme === "light" ? "preta" : "branca"}.svg`
      );
    });

    const button = document.querySelector(".theme-toggle");
    if (button) {
      const nextTheme = theme === "light" ? "escuro" : "claro";
      button.setAttribute("aria-label", `Ativar tema ${nextTheme}`);
      button.setAttribute("title", `Ativar tema ${nextTheme}`);
      button.querySelector(".theme-toggle-icon").textContent = theme === "light" ? "☾" : "☀";
      button.querySelector(".theme-toggle-text").textContent = theme === "light" ? "Escuro" : "Claro";
    }
  };

  applyTheme(savedTheme() || (systemTheme.matches ? "light" : "dark"));

  const setupToggle = () => {
    const actions = document.querySelector(".header-actions");
    if (!actions) return;

    let button = actions.querySelector(".theme-toggle");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "theme-toggle";
      const icon = document.createElement("span");
      icon.className = "theme-toggle-icon";
      icon.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.className = "theme-toggle-text";
      button.append(icon, label);
      actions.insertBefore(button, actions.querySelector(".menu-toggle"));
    }
    applyTheme(root.dataset.theme);

    button.addEventListener("click", () => {
      const theme = root.dataset.theme === "light" ? "dark" : "light";
      try { localStorage.setItem(storageKey, theme); } catch { /* Preferência apenas nesta página. */ }
      applyTheme(theme);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupToggle, { once: true });
  } else {
    setupToggle();
  }

  systemTheme.addEventListener("change", () => {
    if (!savedTheme()) applyTheme(systemTheme.matches ? "light" : "dark");
  });
})();
