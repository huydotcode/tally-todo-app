"use client";

import React, { useState, useEffect } from "react";
import { Task, CreateTaskInput, UpdateTaskInput } from "../lib/types/task";
import { TaskService } from "../lib/services/taskService";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput | UpdateTaskInput) => Promise<void>;
  task?: Task | null;
}

export function TaskFormModal({ isOpen, onClose, onSubmit, task }: TaskFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("none");
  const [dueDate, setDueDate] = useState("");

  const [titleError, setTitleError] = useState("");
  const [descError, setDescError] = useState("");
  const [dateWarning, setDateWarning] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(task.priority);
        setCategory(task.category || "none");
        setDueDate(task.due_date || "");
      } else {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setCategory("none");
        const today = new Date().toISOString().split("T")[0];
        setDueDate(today);
      }
      setTitleError("");
      setDescError("");
      setDateWarning("");
    }
  }, [isOpen, task]);

  useEffect(() => {
    const warning = TaskService.checkDueDateWarning(dueDate);
    setDateWarning(warning || "");
  }, [dueDate]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (val.trim() === "") {
      setTitleError("Tiêu đề không được để trống.");
    } else if (val.length > 200) {
      setTitleError("Tiêu đề tối đa 200 ký tự.");
    } else {
      setTitleError("");
    }
  };

  const handleDescChange = (val: string) => {
    setDescription(val);
    if (val.length > 1000) {
      setDescError("Mô tả tối đa 1000 ký tự.");
    } else {
      setDescError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") {
      setTitleError("Tiêu đề không được để trống.");
      return;
    }
    if (title.length > 200) {
      setTitleError("Tiêu đề tối đa 200 ký tự.");
      return;
    }
    if (description.length > 1000) {
      setDescError("Mô tả tối đa 1000 ký tự.");
      return;
    }

    const payload: CreateTaskInput = {
      title,
      description: description || null,
      priority,
      category: category === "none" ? null : category,
      due_date: dueDate || null,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      console.error("Submission failed:", err);
    }
  };

  return (
    <div id="task-modal" className="modal-overlay active">
      <div className="modal-card">
        <div className="modal-header">
          <h3 id="modal-title" className="modal-title">
            {task ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
          </h3>
          <button onClick={onClose} className="btn-icon" title="Đóng">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <form id="task-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="task-form-title">
                TIÊU ĐỀ <span style={{ color: "var(--color-error)" }}>*</span>
              </label>
              <input
                type="text"
                id="task-form-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="input-field"
                placeholder="Nhập tiêu đề công việc (tối đa 200 ký tự)"
                style={{ borderColor: titleError ? "var(--color-error)" : "" }}
                required
              />
              {titleError && (
                <div id="title-error-msg" className="text-caption" style={{ color: "var(--color-error)", display: "block" }}>
                  {titleError}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-form-desc">
                MÔ TẢ (TÙY CHỌN)
              </label>
              <textarea
                id="task-form-desc"
                value={description}
                onChange={(e) => handleDescChange(e.target.value)}
                className="input-field"
                rows={4}
                placeholder="Nhập mô tả chi tiết công việc (tối đa 1000 ký tự)"
                style={{ resize: "vertical", borderColor: descError ? "var(--color-error)" : "" }}
              />
              {descError && (
                <div id="desc-error-msg" className="text-caption" style={{ color: "var(--color-error)", display: "block" }}>
                  {descError}
                </div>
              )}
            </div>

            <div className="input-row">
              <div className="form-group">
                <label className="form-label" htmlFor="task-form-priority">
                  MỨC ƯU TIÊN
                </label>
                <select
                  id="task-form-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                  className="input-field"
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-form-category">
                  DANH MỤC
                </label>
                <select
                  id="task-form-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                >
                  <option value="none">🏷️ Không có danh mục</option>
                  <option value="work">💼 Công việc</option>
                  <option value="personal">🏠 Cá nhân</option>
                  <option value="learning">📚 Học tập</option>
                  <option value="shopping">🛒 Mua sắm</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="task-form-date">
                HẠN CHÓT
              </label>
              <input
                type="date"
                id="task-form-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
              {dateWarning && (
                <div
                  id="date-warning-msg"
                  className="text-caption font-semibold"
                  style={{ color: "var(--color-tertiary)", filter: "brightness(0.85)", display: "block" }}
                >
                  {dateWarning}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Hủy
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            Lưu công việc
          </button>
        </div>
      </div>
    </div>
  );
}
