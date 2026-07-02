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

  const taskScore = taskStats.rate; // 0–100
  const habitScore = Math.min(habitStats.avgStreak * 10, 100); // cap at 100

  const score = Math.round(taskScore * 0.6 + habitScore * 0.4);

  return {
    score,
    taskScore,
    habitScore
  };
}
