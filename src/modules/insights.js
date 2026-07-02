import { getStore } from "../core/store.js";
import { getFocusSessions } from "./focus.js";
/**
 * Calculate task completion rate
 */
export function getTaskStats() {
  const store = getStore();

  const total = store.tasks.length;
  const done = store.tasks.filter(t => t.done).length;

  return {
    total,
    done,
    rate: total === 0 ? 0 : Math.round((done / total) * 100)
  };
}

/**
 * Habit stats
 */
export function getHabitStats() {
  const store = getStore();

  const total = store.habits.length;
  const avgStreak =
    total === 0
      ? 0
      : Math.round(
          store.habits.reduce((sum, h) => sum + (h.streak || 0), 0) / total
        );

  return {
    total,
    avgStreak
  };
}

/**
 * Momentum Score (core identity metric)
 * Weighted system:
 * - task completion: 60%
 * - habit consistency: 40%
 */
export function getMomentumScore() {
  const taskStats = getTaskStats();
  const habitStats = getHabitStats();
  const focusStats = getFocusStats();

  // Task performance (0–100)
  const taskScore = taskStats.rate;

  // Habit consistency (0–100)
  const habitScore = Math.min(habitStats.avgStreak * 10, 100);

  // Focus productivity (based on time spent)
  const focusScore = Math.min(focusStats.minutes, 120); // cap at 120 min
  const normalizedFocusScore = Math.round((focusScore / 120) * 100);

  // Weighted system
  const score = Math.round(
    taskScore * 0.4 +
    habitScore * 0.3 +
    normalizedFocusScore * 0.3
  );

  return {
    score,
    taskScore,
    habitScore,
    focusScore: normalizedFocusScore,
    focusMinutes: focusStats.minutes
  };
}
export function getFocusStats() {
  const sessions = getFocusSessions();

  const total = sessions.length;
  const completed = sessions.filter(s => s.completed).length;

  const minutes = sessions
    .filter(s => s.completed)
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  return {
    total,
    completed,
    minutes
  };
}
