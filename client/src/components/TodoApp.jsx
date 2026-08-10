import { useEffect, useMemo, useState } from "react";
import { useAuth, UserButton } from "@clerk/clerk-react";
import Header from "./Header";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import FilterTabs from "./FilterTabs";
import { fetchTasks, addTask, editTask, removeTask } from "../api/tasks";

export default function TodoApp() {
  const { getToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const data = await fetchTasks(token);
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [getToken]);

  async function handleAdd(title) {
    try {
      const token = await getToken();
      const task = await addTask(title, token);
      setTasks((prev) => [...prev, task]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(id, completed) {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
    try {
      const token = await getToken();
      await editTask(id, { completed }, token);
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  }

  async function handleEdit(id, updates) {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    try {
      const token = await getToken();
      await editTask(id, updates, token);
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const token = await getToken();
      await removeTask(id, token);
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
        <div className="app__header-row">
          <Header
            subtitle={
              loading
                ? "Loading tasks…"
                : `${remaining} task${remaining === 1 ? "" : "s"} remaining`
            }
          />
          <UserButton afterSignOutUrl="/" />
        </div>

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
