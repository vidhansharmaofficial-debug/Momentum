const STORE_KEY = "momentum_data";

const DEFAULT_STATE = {
  tasks: [],
  notes: [],
  habits: [],
  focusSessions: [],
  settings: {
    focusMode: false,
    theme: "dark"
  },
  meta: {
    createdAt: Date.now()
  }
};

/**
 * Safe get store (never crashes)
 */
export function getStore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORE_KEY));

    if (!data) return structuredClone(DEFAULT_STATE);

    return {
      ...structuredClone(DEFAULT_STATE),
      ...data
    };
  } catch (e) {
    return structuredClone(DEFAULT_STATE);
  }
}

/**
 * Safe save store
 */
export function saveStore(data) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Save failed:", e);
  }
}

/**
 * Reset store
 */
export function resetStore() {
  localStorage.removeItem(STORE_KEY);
}
