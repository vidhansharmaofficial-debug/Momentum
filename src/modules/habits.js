import { getStore, saveStore } from "../core/store.js";

/**
 * Get all habits
 */
export function getHabits() {
  return getStore().habits || [];
}

/**
 * Add new habit
 */
export function addHabit(name) {
  const store = getStore();

  store.habits = store.habits || [];

  // prevent duplicates (basic safety)
  const exists = store.habits.find(h => h.name === name);
  if (exists) return;

  store.habits.push({
    id: Date.now(),
    name,
    streak: 0,
    lastCompleted: null
  });

  saveStore(store);
}

/**
 * Mark habit complete
 */
export function completeHabit(id) {
  const store = getStore();

  const habit = store.habits.find(h => h.id === id);
  if (!habit) return;

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // already done today
  if (habit.lastCompleted === today) return;

  // streak logic
  if (habit.lastCompleted === yesterday) {
    habit.streak += 1;
  } else {
    habit.streak = 1;
  }

  habit.lastCompleted = today;

  saveStore(store);
}

/**
 * Get habits summary stats
 */
export function getHabitStats() {
  const habits = getHabits();

  if (habits.length === 0) {
    return {
      total: 0,
      avgStreak: 0
    };
  }

  const avgStreak =
    habits.reduce((sum, h) => sum + (h.streak || 0), 0) / habits.length;

  return {
    total: habits.length,
    avgStreak: Math.round(avgStreak)
  };
}
