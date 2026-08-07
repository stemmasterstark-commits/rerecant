import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    // 1. Get initial session/user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // 2. Listen for login / logout state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-gray-800">🛒 ReReCant</h1>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
                👤 {user.email?.split("@")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-800 font-bold transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Renders the Auth Login/Signup Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}