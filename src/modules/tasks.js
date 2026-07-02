import { getStore, saveStore } from "../core/store.js";

/**
 * Get all tasks
 */
export function getTasks() {
  const store = getStore();
  return store.tasks || [];
}

/**
 * Add new task
 */
export function addTask(text) {
  const store = getStore();

  store.tasks = store.tasks || [];

  const newTask = {
    id: Date.now(),
    text,
    done: false,
    createdAt: Date.now()
  };

  store.tasks.push(newTask);
  saveStore(store);

  return newTask;
}

/**
 * Delete task
 */
export function deleteTask(id) {
  const store = getStore();

  store.tasks = store.tasks || [];

  store.tasks = store.tasks.filter(t => t.id !== id);

  saveStore(store);
}

/**
 * Toggle task completion
 */
export function toggleTask(id) {
  const store = getStore();

  const task = store.tasks.find(t => t.id === id);
  if (!task) return;

  task.done = !task.done;

  saveStore(store);
}

/**
 * Clear completed tasks
 */
export function clearCompleted() {
  const store = getStore();

  store.tasks = store.tasks || [];

  store.tasks = store.tasks.filter(t => !t.done);

  saveStore(store);
}
