"use client";

import React from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

interface AuthStatusProps {
  user: User | null;
  signOut: () => void;
}

export function AuthStatus({ user, signOut }: AuthStatusProps) {
  if (user) {
    const userEmail = user.email || "";
    // Extract name before '@' or first letter for avatar
    const namePart = userEmail.split("@")[0] || "User";
    const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const initial = namePart.charAt(0).toUpperCase();

    return (
      <div id="auth-logged-in" className="auth-status-row flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
            {initial}
          </div>
          <span className="text-label-md hidden sm:inline-block">Hi, {displayName}!</span>
        </div>
        <button
          onClick={signOut}
          className="btn btn-secondary btn-small"
        >
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div id="auth-logged-out" className="auth-status-row">
      <Link href="/login" className="btn btn-primary btn-small">
        Đăng nhập
      </Link>
    </div>
  );
}
