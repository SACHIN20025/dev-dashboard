import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
        <p className="text-sm" style={{ color: theme.textMuted }}>Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
