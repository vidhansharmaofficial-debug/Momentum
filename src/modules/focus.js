import { getStore, saveStore } from "../core/store.js";

/**
 * Start a focus session
 */
export function startFocusSession(duration = 25) {
  const store = getStore();

  const session = {
    id: Date.now(),
    type: "focus",
    duration, // minutes
    startedAt: Date.now(),
    completed: false
  };

  store.focusSessions = store.focusSessions || [];
  store.focusSessions.push(session);

  saveStore(store);

  return session;
}

/**
 * Mark session complete
 */
export function completeFocusSession(id) {
  const store = getStore();

  const session = store.focusSessions?.find(s => s.id === id);
  if (!session) return;

  session.completed = true;
  session.completedAt = Date.now();

  saveStore(store);
}

/**
 * Get all sessions
 */
export function getFocusSessions() {
  return getStore().focusSessions || [];
}

/**
 * Get focus stats
 */
export function getFocusStats() {
  const sessions = getFocusSessions();

  const total = sessions.length;
  const completed = sessions.filter(s => s.completed).length;

  const totalMinutes = sessions
    .filter(s => s.completed)
    .reduce((sum, s) => sum + s.duration, 0);

  return {
    total,
    completed,
    totalMinutes
  };
}
