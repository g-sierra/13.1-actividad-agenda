import { DOM, DARK_MODE } from "./constants.js";
import { state } from "./state.js";
import { applyTheme } from "./theme.js";
import { removeContact } from "./contacts.js";

function createElement(tag, classes = [], text = "") {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  if (text) el.textContent = text;
  return el;
}

export function createContactCard(contact) {
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
  DOM.contactList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  state.contactos.forEach((c) => {
    fragment.append(createContactCard(c));
  });

  DOM.contactList.append(fragment);
}

export function renderAll() {
  applyTheme(state.theme);
  renderContacts();
}
