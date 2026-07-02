import { getStore, saveStore } from "../core/store.js";

export function startFocus(duration = 25) {
  const store = getStore();

  const session = {
    id: Date.now(),
    type: "focus",
    duration,
    startedAt: Date.now(),
    completed: false
  };

  store.focusSessions.push(session);
  saveStore(store);

  return session;
}

export function completeFocus(id) {
  const store = getStore();

  const session = store.focusSessions.find(s => s.id === id);
  if (!session) return;

  session.completed = true;
  session.completedAt = Date.now();

  saveStore(store);
}

export function getFocusSessions() {
  return getStore().focusSessions;
}

export function getFocusStats() {
  const sessions = getFocusSessions();

  return {
    total: sessions.length,
    completed: sessions.filter(s => s.completed).length,
    totalMinutes: sessions
      .filter(s => s.completed)
      .reduce((a, s) => a + s.duration, 0)
  };
}
