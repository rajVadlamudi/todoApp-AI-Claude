import { useState } from "react";

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  function startEditing() {
    setDraftTitle(task.title);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setDraftTitle(task.title);
  }

  async function saveEditing() {
    const trimmed = draftTitle.trim();
    if (!trimmed) {
      cancelEditing();
      return;
    }
    if (trimmed !== task.title) {
      await onEdit(task.id, { title: trimmed });
    }
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") saveEditing();
    if (e.key === "Escape") cancelEditing();
  }

  return (
    <li className={`task-item${task.completed ? " task-item--completed" : ""}`}>
      <label className="task-item__checkbox-wrap">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
          aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        />
        <span className="task-item__checkmark" aria-hidden="true" />
      </label>

      {isEditing ? (
        <input
          type="text"
          className="task-item__edit-input"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onBlur={saveEditing}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span className="task-item__title" onDoubleClick={startEditing}>
          {task.title}
        </span>
      )}

      <div className="task-item__actions">
        {isEditing ? (
          <button type="button" className="task-item__action" onClick={saveEditing}>
            Save
          </button>
        ) : (
          <button type="button" className="task-item__action" onClick={startEditing}>
            Edit
          </button>
        )}
        <button
          type="button"
          className="task-item__action task-item__action--danger"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
