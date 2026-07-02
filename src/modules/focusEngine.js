import { startFocusSession, completeFocusSession } from "./focus.js";

/**
 * Active timer state
 */
let activeSession = null;
let timer = null;
let remainingSeconds = 0;

/**
 * Start a focus session (real timer)
 */
export function startFocus(duration = 25) {
  // create session in storage
  const session = startFocusSession(duration);

  activeSession = session;
  remainingSeconds = duration * 60;

  runTimer(session.id);

  return session;
}

/**
 * Internal timer engine
 */
function runTimer(sessionId) {
  clearInterval(timer);

  timer = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds <= 0) {
      clearInterval(timer);
      finish(sessionId);
    }
  }, 1000);
}

/**
 * Finish session
 */
function finish(sessionId) {
  activeSession = null;
  remainingSeconds = 0;

  completeFocusSession(sessionId);
}

/**
 * Stop session manually
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
