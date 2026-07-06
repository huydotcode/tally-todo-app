"use client";

import React, { useEffect } from "react";

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error";
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastIndividual
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastIndividual({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isSuccess = toast.type === "success";

  return (
    <div className={`toast toast-${toast.type} cursor-pointer`} onClick={onDismiss}>
      {isSuccess ? (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-success)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--color-error)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )}
      <span>{toast.message}</span>
    </div>
  );
}
