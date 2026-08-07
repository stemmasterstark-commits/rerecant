import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function AuthModal({ isOpen, onClose }) {
  // Modes: "login" | "signup" | "forgot" | "reset_password"
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // 1. Automatically detect recovery token in URL on load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && (hash.includes("type=recovery") || hash.includes("access_token"))) {
      setMode("reset_password");
    }

    // Listen for auth state changes (e.g. PASSWORD_RECOVERY event)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setMode("reset_password");
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (!isOpen && mode !== "reset_password") return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({
          text: "Account created! You can log in or check your email if confirmation is enabled.",
          type: "success",
        });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}`,
        });
        if (error) throw error;
        setMessage({
          text: "Password reset link sent! Please check your email inbox.",
          type: "success",
        });
      } else if (mode === "reset_password") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage({
          text: "Password updated successfully! Logging you in...",
          type: "success",
        });
        setTimeout(() => {
          // Clean hash from URL and close modal
          window.history.replaceState(null, "", window.location.pathname);
          setMode("login");
          onClose();
        }, 1500);
      }
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage({ text: "", type: "" });
  };

  const handleClose = () => {
    if (mode === "reset_password") {
      window.history.replaceState(null, "", window.location.pathname);
      setMode("login");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border border-gray-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
        >
          ✕
        </button>

        {/* Modal Titles */}
        <h2 className="text-2xl font-black mb-1 text-center text-gray-800">
          {mode === "login" && "Welcome Back"}
          {mode === "signup" && "Create Account"}
          {mode === "forgot" && "Reset Password"}
          {mode === "reset_password" && "Set New Password"}
        </h2>
        <p className="text-xs text-gray-500 text-center mb-6">
          {mode === "login" && "Log in to continue your checkout"}
          {mode === "signup" && "Sign up to order from ReReCant"}
          {mode === "forgot" && "Enter your email to receive a recovery link"}
          {mode === "reset_password" && "Enter your new password below"}
        </p>

        {/* Toast / Alert Message */}
        {message.text && (
          <div
            className={`p-3 text-xs rounded-xl mb-4 text-center font-medium ${
              message.type === "error"
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {/* Email Input (Hidden during reset_password) */}
          {mode !== "reset_password" && (
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 tracking-wider uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          {/* Password Input (Hidden during forgot password request) */}
          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-600 tracking-wider uppercase">
                  {mode === "reset_password" ? "New Password" : "Password"}
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-xs text-emerald-600 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-100 transition-all text-sm disabled:opacity-50"
          >
            {loading ? (
              "Processing..."
            ) : mode === "login" ? (
              "Log In"
            ) : mode === "signup" ? (
              "Sign Up"
            ) : mode === "forgot" ? (
              "Send Reset Link"
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        {/* Footer Toggles */}
        {mode !== "reset_password" && (
          <div className="mt-5 text-center pt-4 border-t border-gray-100">
            {mode === "forgot" ? (
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-xs text-emerald-600 hover:underline font-semibold"
              >
                ← Back to Login
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                className="text-xs text-emerald-600 hover:underline font-semibold"
              >
                {mode === "signup"
                  ? "Already have an account? Log In"
                  : "Don't have an account? Sign Up"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}