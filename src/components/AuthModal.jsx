import React, { useState } from 'react';
import { supabase } from '../services/supabase';

export default function AuthModal({ isOpen, onClose }) {
  // Mode state: "login" | "signup" | "forgot"
  const [mode, setMode] = useState("login"); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ text: 'Account created! Check your email to confirm or log in.', type: 'success' });
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else if (mode === "forgot") {
        // Send Password Reset Email
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage({ text: 'Password reset link sent! Check your inbox.', type: 'success' });
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage({ text: '', type: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border border-gray-100">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
        >
          ✕
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-black mb-1 text-center text-gray-800">
          {mode === "signup" && 'Create Account'}
          {mode === "login" && 'Welcome Back'}
          {mode === "forgot" && 'Reset Password'}
        </h2>
        <p className="text-xs text-gray-500 text-center mb-6">
          {mode === "signup" && 'Sign up to order from ReReCant'}
          {mode === "login" && 'Log in to continue your checkout'}
          {mode === "forgot" && 'Enter your email to receive a password reset link'}
        </p>

        {/* Alert Messages */}
        {message.text && (
          <div className={`p-3 text-xs rounded-lg mb-4 text-center font-medium ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-600 border border-red-200' 
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
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

          {/* Password Input (Hidden in Forgot Password mode) */}
          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-600 tracking-wider uppercase">
                  Password
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-100 transition-all text-sm disabled:opacity-50"
          >
            {loading ? 'Processing...' : (
              mode === "signup" ? 'Sign Up' : mode === "login" ? 'Log In' : 'Send Reset Link'
            )}
          </button>
        </form>

        {/* Navigation Toggles */}
        <div className="mt-5 text-center pt-4 border-t border-gray-100 space-y-2">
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
              {mode === "signup" ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}