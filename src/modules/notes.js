import { getStore, saveStore } from "../core/store.js";

/**
 * Get all notes
 */
export function getNotes() {
  return getStore().notes;
}

/**
 * Create new note
 */
export function addNote(title, content) {
  const store = getStore();

  const note = {
    id: Date.now(),
    title,
    content,
    createdAt: Date.now()
  };

  store.notes.push(note);
  saveStore(store);

  return note;
}

/**
 * Delete note
 */
export function deleteNote(id) {
  const store = getStore();
  store.notes = store.notes.filter(n => n.id !== id);
  saveStore(store);
}
