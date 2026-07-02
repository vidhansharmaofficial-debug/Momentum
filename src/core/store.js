const STORE_KEY = "momentum_data";

/**
 * Get full app state
 */
export function getStore() {
  return JSON.parse(localStorage.getItem(STORE_KEY)) || {
    tasks: [],
    notes: [],
    habits: [],
    settings: {
      focusMode: false,
      theme: "dark"
    },
    meta: {
      createdAt: Date.now()
    }
  };
}

/**
 * Save full app state
 */
export function saveStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

/**
 * Reset everything (use carefully)
 */
export function resetStore() {
  localStorage.removeItem(STORE_KEY);
}
