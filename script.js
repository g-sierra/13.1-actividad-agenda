/* constantes */
const DARK_MODE = "dark-mode";
const LIGHT_MODE = "light-mode";
const THEME_KEY = "theme";
const DATA_KEY = "contactos";

/* DOM */
const bodyEl = document.body;
const navbar = document.querySelector(".navbar");
const themeToggleBtn = document.querySelector("#toggle-theme");
const formCard = document.querySelector("#form-card");
const form = document.querySelector("#agenda-form");
const contactList = document.querySelector("#contactos");

/* estado */
const state = {
  contactos: JSON.parse(localStorage.getItem(DATA_KEY)) || [],
  theme: localStorage.getItem(THEME_KEY) || LIGHT_MODE, // light por defecto
};

/* funcion de manejo de estado */
function setState(newState, callback) {
  Object.assign(state, newState);

  localStorage.setItem(DATA_KEY, JSON.stringify(state.contactos));
  localStorage.setItem(THEME_KEY, state.theme);

  if (callback) callback();
}

/* funciones de tema */
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

function toggleTheme() {
  setState(
    { theme: state.theme === LIGHT_MODE ? DARK_MODE : LIGHT_MODE },
    renderAll,
  );
}

/* funciones de guardar datos */
function getFormFields() {
  return Array.from(form.elements)
    .filter((el) => el.type !== "submit")
    .map((el) => el.id);
}

function getContactFromForm() {
  const contact = { id: Date.now() };
  const fields = getFormFields();

  fields.forEach((field) => {
    const input = document.getElementById(field);
    const value = input.value.trim();
    if (value) contact[field] = value;
    input.value = "";
  });

  return contact;
}

function saveContact() {
  const contact = getContactFromForm();
  if (Object.keys(contact).length <= 1) return;

  setState({ contactos: [...state.contactos, contact] });

  const newCard = createContactCard(contact);
  contactList.append(newCard);
}

function removeContact(id, cardElement) {
  const newContacts = state.contactos.filter((c) => c.id !== id);
  setState({ contactos: newContacts });
  cardElement.remove();
}

/* funciones de mostrar datos */
function createElement(tag, classes = [], text = "") {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  if (text) el.textContent = text;
  return el;
}

function createContactCard(contact) {
  const card = createElement("li", ["card"]);
  const isDark = state.theme === DARK_MODE;
  card.classList.toggle("bg-secondary", isDark);
  card.classList.toggle("text-white", isDark);

  const cardBody = createElement("div", ["card-body"]);
  card.append(cardBody);

  Object.entries(contact).forEach(([key, value]) => {
    if (key === "id") return;
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

  const deleteBtn = createElement(
    "button",
    ["btn", "btn-sm", "btn-danger", "mt-2"],
    "Eliminar",
  );
  deleteBtn.addEventListener("click", () => removeContact(contact.id, card));
  cardBody.append(deleteBtn);

  return card;
}

function renderContacts() {
  contactList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  state.contactos.forEach((c) => {
    fragment.append(createContactCard(c));
  });

  contactList.append(fragment);
}

function renderAll() {
  applyTheme(state.theme);
  renderContacts();
}

/* proceso principal */
function main() {
  // render inicial
  renderAll();

  // event listeners
  themeToggleBtn.addEventListener("click", toggleTheme);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveContact();
  });
}

/* ejecutar al cargar la pagina */
document.addEventListener("DOMContentLoaded", main);
