import { Router } from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../taskStore.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

function validateId(req, res, next) {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ error: "Invalid task id" });
  }
  next();
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tasks = await getAllTasks();
    res.json(tasks);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    const task = await createTask({ title: title.trim() });
    res.status(201).json(task);
  })
);

router.put(
  "/:id",
  validateId,
  asyncHandler(async (req, res) => {
    const { title, completed } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      updates.title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "Completed must be a boolean" });
      }
      updates.completed = completed;
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one of title or completed is required" });
    }

    const task = await updateTask(req.params.id, updates);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  })
);

router.delete(
  "/:id",
  validateId,
  asyncHandler(async (req, res) => {
    const ok = await deleteTask(req.params.id);
    if (!ok) return res.status(404).json({ error: "Task not found" });
    res.status(204).end();
  })
);

export default router;
