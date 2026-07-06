"use client";

import React, { useState, useRef, useEffect } from "react";
import { CreateTaskInput } from "../lib/types/task";

interface QuickAddBarProps {
  onSubmit: (input: CreateTaskInput) => Promise<void>;
  onShowToast: (msg: string, type?: "success" | "error") => void;
}

export function QuickAddBar({ onSubmit, onShowToast }: QuickAddBarProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("none");
  const [dueDate, setDueDate] = useState("");

  const [isFocused, setIsFocused] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (title.trim() === "") {
          setIsFocused(false);
        }
      }
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [title]);

  const getPriorityColor = (pri: string) => {
    switch (pri) {
      case "high":
        return "var(--color-primary)";
      case "medium":
        return "var(--color-tertiary)";
      case "low":
        return "var(--color-success)";
      default:
        return "var(--color-tertiary)";
    }
  };

  const getPriorityLabel = (pri: string) => {
    switch (pri) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return "Trung bình";
    }
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      onShowToast("Vui lòng nhập tiêu đề công việc!", "error");
      return;
    }
    if (trimmedTitle.length > 200) {
      onShowToast("Tiêu đề công việc không được vượt quá 200 ký tự!", "error");
      return;
    }

    const payload: CreateTaskInput = {
      title: trimmedTitle,
      priority,
      category: category === "none" ? null : category,
      due_date: dueDate || null,
    };

    try {
      await onSubmit(payload);
      setTitle("");
      setPriority("medium");
      setCategory("none");
      setDueDate("");
      setIsFocused(false);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Thao tác thất bại";
      onShowToast(errMsg, "error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const isActive = isFocused || title.trim() !== "";

  return (
    <div
      ref={containerRef}
      id="quick-add-bar"
      className={`quick-add-container ${isActive ? "active" : ""}`}
    >
      {/* Mini Toolbar */}
      <div className="quick-add-toolbar">
        {/* Priority selector pill */}
        <div style={{ position: "relative", display: "inline-block" }} ref={popoverRef}>
          <button
            id="qa-priority-btn"
            type="button"
            className={`btn-toolbar-select pri-${priority}`}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            <span
              id="qa-priority-dot"
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: getPriorityColor(priority),
              }}
            ></span>
            <span id="qa-priority-text">{getPriorityLabel(priority)}</span>
          </button>

          {/* Popover */}
          <div id="qa-priority-popover" className={`pri-popover ${isPopoverOpen ? "active" : ""}`}>
            <button
              type="button"
              className="pri-option-btn"
              onClick={() => {
                setPriority("high");
                setIsPopoverOpen(false);
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-primary)" }}></span>
              Cao
            </button>
            <button
              type="button"
              className="pri-option-btn"
              onClick={() => {
                setPriority("medium");
                setIsPopoverOpen(false);
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-tertiary)" }}></span>
              Trung bình
            </button>
            <button
              type="button"
              className="pri-option-btn"
              onClick={() => {
                setPriority("low");
                setIsPopoverOpen(false);
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-success)" }}></span>
              Thấp
            </button>
          </div>
        </div>

        {/* Category selector pill */}
        <select
          id="qa-category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select-toolbar"
        >
          <option value="none">🏷️ Không có danh mục</option>
          <option value="work">💼 Công việc</option>
          <option value="personal">🏠 Cá nhân</option>
          <option value="learning">📚 Học tập</option>
          <option value="shopping">🛒 Mua sắm</option>
        </select>

        {/* Due Date selector pill */}
        <input
          type="date"
          id="qa-date-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="date-toolbar"
          title="Chọn hạn chót"
        />
      </div>

      {/* Input Row */}
      <div className="quick-add-input-row">
        <input
          type="text"
          id="qa-task-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="quick-add-input"
          placeholder="Thêm công việc mới..."
          autoComplete="off"
        />
        <button
          onClick={handleSubmit}
          id="qa-send-btn"
          className="btn-send-task"
          title="Gửi công việc"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19V5m0 0l-7 7m7-7l7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
