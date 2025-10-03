import { DOM } from "./constants.js";
import { renderAll } from "./render.js";
import { saveContact } from "./contacts.js";
import { toggleTheme } from "./theme.js";

function setEventListeners() {
  DOM.themeToggleBtn.addEventListener("click", toggleTheme);
  DOM.form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveContact();
  });
}

function main() {
  renderAll();
  setEventListeners();
}

document.addEventListener("DOMContentLoaded", main);
