"use client";

import { FormEvent, useState } from "react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setMessage("Password change API coming soon.");
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Change Password
        </h1>
        <p className="mt-1 text-sm text-muted">Update your admin account password.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="space-y-2">
          <label htmlFor="current" className="block text-[13px] font-medium text-foreground">
            Current password
          </label>
          <input
            id="current"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-foreground"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="new" className="block text-[13px] font-medium text-foreground">
            New password
          </label>
          <input
            id="new"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-foreground"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm" className="block text-[13px] font-medium text-foreground">
            Confirm new password
          </label>
          <input
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="login-input w-full rounded-xl border border-[var(--form-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-foreground"
            required
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-[var(--error-border)] bg-[var(--error-bg)] px-4 py-3 text-sm text-[var(--error-text)]">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--orange)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#d94e1f]"
        >
          Update password
        </button>
      </form>
    </div>
  );
}
