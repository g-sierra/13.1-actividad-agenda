/* constantes */
const DARK_MODE = "dark-mode";
const LIGHT_MODE = "light-mode";
const THEME_KEY = "theme";

/* DOM */
const bodyEl = document.body;
const navbar = document.querySelector(".navbar");
const themeToggleBtn = document.querySelector("#toggle-theme");
const formCard = document.querySelector("#form-card");
const form = document.querySelector("#agenda-form");
const contactList = document.querySelector("#contactos");

/* estado */
const state = {
  contactos: JSON.parse(localStorage.getItem("contactos")) || [],
  theme: localStorage.getItem(THEME_KEY) || LIGHT_MODE, // light por defecto
};

/* funciones de tema */
function setThemeState(theme) {
  state.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}

function applyTheme(theme) {
  const isDark = theme === DARK_MODE;

  bodyEl.classList.toggle(DARK_MODE, isDark);
  bodyEl.classList.toggle(LIGHT_MODE, !isDark);

  navbar.classList.toggle("navbar-dark", isDark);
  navbar.classList.toggle("bg-dark", isDark);
  navbar.classList.toggle("navbar-light", !isDark);
  navbar.classList.toggle("bg-light", !isDark);

  themeToggleBtn.classList.toggle("btn-outline-light", isDark);
  themeToggleBtn.classList.toggle("btn-outline-dark", !isDark);
  themeToggleBtn.textContent = isDark ? "Modo Día" : "Modo Noche";

  formCard.classList.toggle("bg-secondary", isDark);
  formCard.classList.toggle("text-light", isDark);
}

function setTheme(theme) {
  setThemeState(theme);
  applyTheme(theme);
}

function toggleTheme() {
  const newTheme = state.theme === LIGHT_MODE ? DARK_MODE : LIGHT_MODE;
  setTheme(newTheme);
  renderContacts();
}

/* funciones de guardar datos */
function getFormFields() {
  return Array.from(form.elements)
    .filter((el) => el.type !== "submit")
    .map((el) => el.id);
}

function saveContact() {
  const contact = {};
  const fields = getFormFields();

  fields.forEach((field) => {
    const input = document.getElementById(field);
    const value = input.value.trim();
    if (value) contact[field] = value;
    input.value = "";
  });

  state.contactos.push(contact);
  localStorage.setItem("contactos", JSON.stringify(state.contactos));
  renderContacts();
}

/* funciones de mostrar datos */
function createElement(tag, classes = [], text = "") {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  if (text) el.textContent = text;
  return el;
}

function renderContacts() {
  contactList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const isDark = state.theme === DARK_MODE;

  state.contactos.forEach((c) => {
    const card = document.createElement("li");
    card.classList.add("card");
    card.classList.toggle("bg-secondary", isDark);
    card.classList.toggle("text-white", isDark);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    card.append(cardBody);

    Object.entries(c).forEach(([key, value]) => {
      if (key === "nombre") {
        const title = createElement("h5", ["card-title", "fw-bold"], value);
        cardBody.append(title);
      } else {
        const p = createElement(
          "p",
          ["card-text", "mb-1"],
          (key === "notas" ? "Notas: " : "") + value,
        );
        cardBody.append(p);
      }
    });

    fragment.append(card);
  });

  contactList.append(fragment);
}

/* proceso principal */
function main() {
  // definir tema inicial
  setTheme(state.theme);

  // render inicial
  renderContacts();

  // event listeners
  themeToggleBtn.addEventListener("click", toggleTheme);

  form.addEventListener("click", (e) => {
    e.preventDefault();
    saveContact();
  });
}

/* ejecutar al cargar la pagina */
document.addEventListener("DOMContentLoaded", main);
