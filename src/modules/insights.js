import { getStore } from "../core/store.js";
import { getFocusSessions, getFocusState } from "./focus.js";

/**
 * Task stats
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
 * Focus stats (history-based)
 */
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

/**
 * Live focus state
 */
export function getLiveFocusState() {
  const sessions = getFocusSessions();
  const state = getFocusState();

  const today = new Date().toDateString();

  const todaySessions = sessions.filter(s =>
    new Date(s.startedAt).toDateString() === today
  );

  return {
    active: state.active,
    remainingSeconds: state.remainingSeconds,
    todayCount: todaySessions.length
  };
}

/**
 * Momentum Score Engine
 */
export function getMomentumScore() {
  const taskStats = getTaskStats();
  const habitStats = getHabitStats();
  const focusSessions = getFocusSessions();
  const live = getLiveFocusState();

  const taskScore = taskStats.rate;

  const habitScore = Math.min(habitStats.avgStreak * 10, 100);

  const focusMinutes = focusSessions
    .filter(s => s.completed)
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  const focusScore = Math.min(focusMinutes, 120);
  const normalizedFocusScore = Math.round((focusScore / 120) * 100);

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
