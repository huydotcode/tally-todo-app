"use client";

import React from "react";
import { Task } from "../lib/types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const handleDeleteClick = () => {
    onDelete(task);
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "CAO";
      case "medium":
        return "TRUNG BÌNH";
      case "low":
        return "THẤP";
      default:
        return priority.toUpperCase();
    }
  };

  const getCategoryLabel = (cat: string | null | undefined) => {
    if (!cat || cat === "none") return null;
    const mapping: { [key: string]: string } = {
      work: "💼 Công việc",
      personal: "🏠 Cá nhân",
      learning: "📚 Học tập",
      shopping: "🛒 Mua sắm",
    };
    return mapping[cat] || cat;
  };

  const getDueDateDisplay = (dueDate: string | null | undefined, completed: boolean) => {
    if (completed) {
      return {
        text: "Đã hoàn thành",
        isOverdue: false,
        icon: (
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ),
      };
    }

    if (!dueDate) return null;

    const parts = dueDate.split("-");
    if (parts.length !== 3) return null;
    const dueTime = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    dueTime.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const formatDDMMYYYY = `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;

    if (dueTime.getTime() < today.getTime()) {
      return {
        text: `Đã quá hạn (${formatDDMMYYYY})`,
        isOverdue: true,
        icon: (
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      };
    }

    let text = formatDDMMYYYY;
    if (dueTime.getTime() === today.getTime()) {
      text = "Hôm nay";
    } else if (dueTime.getTime() === tomorrow.getTime()) {
      text = "Ngày mai";
    }

    return {
      text,
      isOverdue: false,
      icon: (
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    };
  };

  const categoryLabel = getCategoryLabel(task.category);
  const dueDateDisplay = getDueDateDisplay(task.due_date, task.completed);

  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""}`}
      data-id={task.id}
      data-priority={task.priority}
      data-category={task.category || ""}
      data-completed={task.completed ? "true" : "false"}
    >
      <label className="checkbox-container">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={(e) => onToggle(task.id, e.target.checked)}
        />
        <span className="checkmark"></span>
      </label>

      <div className="task-content">
        <div className="task-header">
          <span className="task-title">{task.title}</span>
          <div className="task-actions">
            <button
              onClick={() => onEdit(task)}
              className="btn-icon edit-task-btn"
              title="Sửa công việc"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={handleDeleteClick}
              className="btn-icon btn-danger-icon delete-task-btn"
              title="Xóa công việc"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {task.description && <p className="task-desc">{task.description}</p>}

        <div className="task-meta">
          <span className={`chip chip-${task.priority}`}>
            {getPriorityLabel(task.priority)}
          </span>

          {categoryLabel && (
            <span className="chip chip-category">{categoryLabel}</span>
          )}

          {dueDateDisplay && (
            <span className={`due-date ${dueDateDisplay.isOverdue ? "overdue" : ""}`}>
              {dueDateDisplay.icon}
              {dueDateDisplay.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
