import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterTabs from "./components/FilterTabs";
import { fetchTasks, addTask, editTask, removeTask } from "./api/tasks";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(title) {
    try {
      const task = await addTask(title);
      setTasks((prev) => [...prev, task]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(id, completed) {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
    try {
      await editTask(id, { completed });
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  }

  async function handleEdit(id, updates) {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    try {
      await editTask(id, updates);
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await removeTask(id);
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  }

  const visibleTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <div className="app__card">
        <Header
          subtitle={
            loading
              ? "Loading tasks…"
              : `${remaining} task${remaining === 1 ? "" : "s"} remaining`
          }
        />

        <TaskForm onAdd={handleAdd} />

        {error && (
          <div className="app__error" role="alert">
            {error}
            <button type="button" onClick={() => setError(null)} aria-label="Dismiss error">
              &times;
            </button>
          </div>
        )}

        <FilterTabs current={filter} onChange={setFilter} />

        {loading ? (
          <p className="task-list__empty">Loading…</p>
        ) : (
          <TaskList
            tasks={visibleTasks}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
