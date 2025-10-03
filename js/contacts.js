import { DOM } from "./constants.js";
import { state, setState } from "./state.js";
import { createContactCard } from "./render.js";

function getFormFields() {
  return Array.from(DOM.form.elements)
    .filter((el) => el.type !== "submit")
    .map((el) => el.id);
}

function getContactFromForm() {
  const contact = { id: Date.now() };
  const fields = getFormFields();

  fields.forEach((field) => {
    const input = DOM.form.elements[field];
    const value = input.value.trim();
    if (value) contact[field] = value;
    input.value = "";
  });

  return contact;
}

export function saveContact() {
  const contact = getContactFromForm();
  if (Object.keys(contact).length <= 1) return;

  setState({ contactos: [...state.contactos, contact] });

  const newCard = createContactCard(contact);
  DOM.contactList.append(newCard);
}

export function removeContact(id, cardElement) {
  const newContacts = state.contactos.filter((c) => c.id !== id);
  setState({ contactos: newContacts });
  cardElement.remove();
}
