import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GitBranch, AlertCircle } from "lucide-react";
import { theme } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: theme.bg, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div className="w-full max-w-sm rounded-xl p-6" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: theme.violet }}>
            <GitBranch size={16} color="#fff" />
          </div>
          <span className="text-base font-semibold" style={{ color: theme.textPrimary, fontFamily: "ui-monospace, monospace" }}>devflow</span>
        </div>

        <h1 className="text-lg font-semibold mb-1" style={{ color: theme.textPrimary }}>Create your account</h1>
        <p className="text-sm mb-6" style={{ color: theme.textMuted }}>Start tracking projects and tasks</p>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-xs" style={{ background: theme.redSoft, color: theme.red }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: theme.textSecondary }}>Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: theme.surfaceRaised, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: theme.textSecondary }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: theme.surfaceRaised, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: theme.textSecondary }}>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: theme.surfaceRaised, border: `1px solid ${theme.border}`, color: theme.textPrimary }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            style={{ background: theme.violet, color: "#fff" }}
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-xs mt-4 text-center" style={{ color: theme.textMuted }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: theme.violet }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
