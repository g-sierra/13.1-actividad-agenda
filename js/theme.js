import { DOM, LIGHT_MODE, DARK_MODE } from "./constants.js";
import { state, setState } from "./state.js";
import { renderAll } from "./render.js";

export function applyTheme(theme) {
  const isDark = theme === DARK_MODE;

  DOM.bodyEl.classList.toggle(DARK_MODE, isDark);
  DOM.bodyEl.classList.toggle(LIGHT_MODE, !isDark);

  DOM.navbar.classList.toggle("navbar-dark", isDark);
  DOM.navbar.classList.toggle("bg-dark", isDark);
  DOM.navbar.classList.toggle("navbar-light", !isDark);
  DOM.navbar.classList.toggle("bg-light", !isDark);

  DOM.themeToggleBtn.classList.toggle("btn-outline-light", isDark);
  DOM.themeToggleBtn.classList.toggle("btn-outline-dark", !isDark);
  DOM.themeToggleBtn.textContent = isDark ? "Modo Día" : "Modo Noche";

  DOM.formCard.classList.toggle("bg-secondary", isDark);
  DOM.formCard.classList.toggle("text-light", isDark);
}

export function toggleTheme() {
  setState(
    { theme: state.theme === LIGHT_MODE ? DARK_MODE : LIGHT_MODE },
    renderAll,
  );
}
