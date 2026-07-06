"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase/client";
import { Toast, ToastItem } from "../../components/Toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push("/");
      }
    };
    checkUser();
  }, [router]);

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegisterMode) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        addToast("Đăng ký thành công! Hãy kiểm tra email để xác thực tài khoản (nếu cần) hoặc đăng nhập.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        addToast("Đăng nhập thành công!");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (err: any) {
      addToast(err.message || "Thao tác thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral p-4">
      <Toast toasts={toasts} onDismiss={removeToast} />
      
      <main className="view-section active flex items-center justify-center w-full">
        <div className="auth-card">
          <Link href="/" className="auth-back-btn inline-flex items-center gap-1">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang chủ
          </Link>

          <div className="auth-header mt-4">
            <h2 id="auth-form-title" className="auth-title">
              {isRegisterMode ? "Tạo tài khoản mới" : "Chào mừng trở lại"}
            </h2>
            <p id="auth-form-subtitle" className="auth-subtitle">
              {isRegisterMode
                ? "Đăng ký để đồng bộ và quản lý công việc từ bất kỳ thiết bị nào."
                : "Đăng nhập để đồng bộ và quản lý công việc của bạn từ mọi nơi."}
            </p>
          </div>

          <form id="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">
                ĐỊA CHỈ EMAIL
              </label>
              <input
                type="email"
                id="auth-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">
                MẬT KHẨU
              </label>
              <input
                type="password"
                id="auth-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="auth-submit-btn"
              className="btn btn-primary w-full mt-4"
            >
              {loading ? "Đang xử lý..." : isRegisterMode ? "Đăng ký" : "Đăng nhập"}
            </button>
          </form>

          <div className="auth-footer mt-6 text-center text-sm">
            <span>
              {isRegisterMode ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
            </span>
            <span
              id="auth-toggle-link"
              className="auth-switch font-semibold cursor-pointer text-primary"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
            >
              {isRegisterMode ? "Đăng nhập ngay" : "Đăng ký ngay"}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
