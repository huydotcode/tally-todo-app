"use client";

import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "info";
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  type = "info",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <div className="modal-overlay active" style={{ zIndex: 1100 }}>
      <div className="modal-card" style={{ maxWidth: "440px" }}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ color: isDanger ? "var(--color-error)" : "" }}>
            {title}
          </h3>
          <button onClick={onCancel} className="btn-icon" title="Đóng">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <p className="text-body-md" style={{ color: "var(--color-secondary)", opacity: 0.85 }}>
            {message}
          </p>
        </div>

        <div className="modal-footer">
          <button onClick={onCancel} className="btn btn-secondary">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${isDanger ? "btn-danger" : "btn-primary"}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
