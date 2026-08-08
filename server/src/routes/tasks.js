import { Router } from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../taskStore.js";

const router = Router();

router.get("/", async (req, res) => {
  const tasks = await getAllTasks();
  res.json(tasks);
});

router.post("/", async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const task = await createTask({ title: title.trim() });
  res.status(201).json(task);
});

router.put("/:id", async (req, res) => {
  const { title, completed } = req.body;
  const updates = {};
  if (title !== undefined) {
    if (!title.trim()) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    updates.title = title.trim();
  }
  if (completed !== undefined) updates.completed = Boolean(completed);

  const task = await updateTask(req.params.id, updates);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

router.delete("/:id", async (req, res) => {
  const ok = await deleteTask(req.params.id);
  if (!ok) return res.status(404).json({ error: "Task not found" });
  res.status(204).end();
});

export default router;
