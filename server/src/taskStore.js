import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { randomUUID } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data", "tasks.json");

async function readTasks() {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeTasks(tasks) {
  await writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
}

export async function getAllTasks() {
  return readTasks();
}

export async function createTask({ title }) {
  const tasks = await readTasks();
  const task = {
    id: randomUUID(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  await writeTasks(tasks);
  return task;
}

export async function updateTask(id, updates) {
  const tasks = await readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...updates, id: tasks[index].id };
  await writeTasks(tasks);
  return tasks[index];
}

export async function deleteTask(id) {
  const tasks = await readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  await writeTasks(tasks);
  return true;
}
