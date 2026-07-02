import {
  startFocusSession,
  completeFocusSession,
  getFocusSessions
} from "./focus.js";

let activeSession = null;
let timer = null;
let remainingSeconds = 0;

/**
 * Start focus session (engine)
 */
export function startFocus(duration = 25) {
  // prevent double sessions
  if (activeSession) return activeSession;

  const session = startFocusSession(duration);

  activeSession = session;
  remainingSeconds = duration * 60;

  runTimer(session.id);

  return session;
}

/**
 * Timer engine
 */
function runTimer(sessionId) {
  clearInterval(timer);

  timer = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds <= 0) {
      finish(sessionId);
    }
  }, 1000);
}

/**
 * Finish session
 */
function finish(sessionId) {
  clearInterval(timer);

  completeFocusSession(sessionId);

  activeSession = null;
  remainingSeconds = 0;
}

/**
 * Stop manually
 */
export function stopFocus() {
  clearInterval(timer);

  if (activeSession) {
    completeFocusSession(activeSession.id);
  }

  activeSession = null;
  remainingSeconds = 0;
}

/**
 * Get current state
 */
export function getFocusState() {
  return {
    active: !!activeSession,
    remainingSeconds
  };
}
