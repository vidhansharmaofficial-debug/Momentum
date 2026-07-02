import { getStore } from "../core/store.js";
import { getFocusSessions } from "./focus.js";
import { getFocusState, getFocusSessions } from "./focus.js";
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
  const focusSessions = getFocusSessions();

  const taskScore = taskStats.rate;

  const habitScore = Math.min(habitStats.avgStreak * 10, 100);

  const focusMinutes = focusSessions
    .filter(s => s.completed)
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  const focusScore = Math.min(focusMinutes, 120);
  const normalizedFocusScore = Math.round((focusScore / 120) * 100);

  // LIVE penalty/boost system
  const live = getLiveFocusState();
  const liveBoost = live.active ? 10 : 0;

  const score = Math.round(
    taskScore * 0.35 +
    habitScore * 0.25 +
    normalizedFocusScore * 0.30 +
    liveBoost * 0.10
  );

  return {
    score,
    taskScore,
    habitScore,
    focusScore: normalizedFocusScore,
    focusMinutes,
    liveFocus: live
  };
}

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
export function getLiveFocusState() {
  const sessions = getFocusSessions();
  const state = getFocusState();

  const todaySessions = sessions.filter(s => {
    const d = new Date(s.startedAt).toDateString();
    return d === new Date().toDateString();
  });

  return {
    active: state.active,
    remainingSeconds: state.remainingSeconds,
    todayCount: todaySessions.length
  };
}
