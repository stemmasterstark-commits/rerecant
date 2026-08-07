import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function ResetPasswordModal({ isOpen, onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else {
      setMessage({
        text: "Password updated successfully! You can now log in.",
        type: "success",
      });
      setTimeout(() => {
        onClose();
      }, 2000);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
        <h2 className="text-xl font-bold mb-2 text-center">Set New Password</h2>
        
        {message.text && (
          <div className={`p-2 text-xs rounded mb-4 text-center ${
            message.type === "error" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            required
            placeholder="Enter new password"
            className="w-full p-3 border rounded-xl text-sm"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl text-sm"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}