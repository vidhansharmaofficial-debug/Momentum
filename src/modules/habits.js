import { getStore, saveStore } from "../core/store.js";

/**
 * Get all habits
 */
export function getHabits() {
  return getStore().habits;
}

/**
 * Add a new habit
 */
export function addHabit(name) {
  const store = getStore();

  store.habits.push({
    id: Date.now(),
    name,
    streak: 0,
    lastCompleted: null
  });

  saveStore(store);
}

/**
 * Mark habit as completed today
 */
export function completeHabit(id) {
  const store = getStore();

  const habit = store.habits.find(h => h.id === id);
  if (!habit) return;

  const today = new Date().toDateString();

  // already completed today → do nothing
  if (habit.lastCompleted === today) return;

  // streak logic
  if (habit.lastCompleted === new Date(Date.now() - 86400000).toDateString()) {
    habit.streak += 1;
  } else {
    habit.streak = 1;
  }

  habit.lastCompleted = today;

  saveStore(store);
}

/**
 * Reset habits view state (not data loss)
 */
export function resetHabitView() {
  const store = getStore();

  const today = new Date().toDateString();

  store.habits.forEach(h => {
    if (h.lastCompleted && h.lastCompleted !== today) {
      h.canCompleteToday = true;
    } else {
      h.canCompleteToday = false;
    }
  });

  saveStore(store);
}
