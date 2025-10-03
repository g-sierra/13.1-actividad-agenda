import { THEME_KEY, DATA_KEY, LIGHT_MODE } from "./constants.js";

export const state = {
  contactos: JSON.parse(localStorage.getItem(DATA_KEY)) || [],
  theme: localStorage.getItem(THEME_KEY) || LIGHT_MODE, // light por defecto
};

export function setState(newState, callback) {
  Object.assign(state, newState);

  localStorage.setItem(DATA_KEY, JSON.stringify(state.contactos));
  localStorage.setItem(THEME_KEY, state.theme);

  if (callback) callback();
}
