const DARK_MODE = "dark-mode";
const LIGHT_MODE = "light-mode";
const THEME_KEY = "theme";

const bodyEl = document.body;
const navbar = document.querySelector(".navbar");
const themeToggleBtn = document.querySelector("#toggle-theme");
const formCard = document.querySelector("#form-card");

const formElements = document.querySelector("#agenda-form").elements;

const contactList = document.querySelector("#contactos");

const state = {
  contactos: JSON.parse(localStorage.getItem("contactos")) || [],
  theme: localStorage.getItem(THEME_KEY) || LIGHT_MODE, // light por defecto
};

function enableDarkMode() {
  state.theme = DARK_MODE;
  localStorage.setItem(THEME_KEY, DARK_MODE);
  bodyEl.classList.remove(LIGHT_MODE);
  bodyEl.classList.add(DARK_MODE);
  navbar.classList.remove("navbar-light", "bg-light");
  navbar.classList.add("navbar-dark", "bg-dark");
  themeToggleBtn.classList.remove("btn-outline-dark");
  themeToggleBtn.classList.add("btn-outline-light");
  themeToggleBtn.textContent = "Modo Día";
  formCard.classList.add("bg-secondary", "text-light");
}

function enableLightMode() {
  state.theme = LIGHT_MODE;
  localStorage.setItem(THEME_KEY, LIGHT_MODE);
  bodyEl.classList.remove(DARK_MODE);
  bodyEl.classList.add(LIGHT_MODE);
  navbar.classList.remove("navbar-dark", "bg-dark");
  navbar.classList.add("navbar-light", "bg-light");
  themeToggleBtn.classList.remove("btn-outline-light");
  themeToggleBtn.classList.add("btn-outline-dark");
  themeToggleBtn.textContent = "Modo Noche";
  formCard.classList.remove("bg-secondary", "text-light");
}

function setTheme() {
  if (state.theme === LIGHT_MODE) enableLightMode();
  if (state.theme === DARK_MODE) enableDarkMode();
}

function toggleTheme() {
  const currentTheme = state.theme;
  if (currentTheme === LIGHT_MODE) enableDarkMode();
  if (currentTheme === DARK_MODE) enableLightMode();
}

function saveContact() {
  const contact = {};
  Array.from(formElements).forEach((el) => {
    if (el.id === "submit") return;
    const field = el.id;
    const value = el.value.trim();
    if (value) {
      contact[field] = value;
    }
    el.value = "";
  });
  state.contactos.push(contact);
  localStorage.setItem("contactos", JSON.stringify(state.contactos));
  renderContacts();
}

function renderContacts() {
  contactList.innerHTML = "";
  state.contactos.forEach((c) => {
    const card = document.createElement("li");
    card.classList.add("card");
    if (state.theme === DARK_MODE) {
      card.classList.add("bg-secondary", "text-white");
    }
    if (state.theme === LIGHT_MODE) {
      card.classList.remove("bg-secondary", "text-white");
    }

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    card.append(cardBody);

    for (const key in c) {
      if (key === "nombre") {
        const title = document.createElement("h5");
        title.classList.add("card-title", "fw-bold");
        title.textContent = c[key];
        cardBody.append(title);
        continue;
      }
      const p = document.createElement("p");
      p.classList.add("card-text", "mb-1");
      if (key === "notas") {
        p.textContent = "Notas: ";
      }
      p.textContent += c[key];
      cardBody.append(p);
    }

    contactList.append(card);
  });
}

function main() {
  setTheme();
  renderContacts();

  themeToggleBtn.addEventListener("click", () => {
    toggleTheme();
    renderContacts();
  });

  formElements.submit.addEventListener("click", (e) => {
    e.preventDefault();
    saveContact();
    renderContacts();
  });
}

document.addEventListener("DOMContentLoaded", main);
