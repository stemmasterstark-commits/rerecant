import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../services/supabase";
import AuthModal from "./AuthModal";

export default function Navbar({ cartCount = 0 }) {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 1. Get initial session/user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // 2. Listen for auth changes (Login / Logout)
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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-gray-900 tracking-tight">
            <span className="text-2xl">🛒</span>
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ReReCant
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive("/") 
                  ? "text-indigo-600 bg-indigo-50" 
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>

            <Link
              to="/orders"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive("/orders") 
                  ? "text-indigo-600 bg-indigo-50" 
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              Orders
            </Link>

            <Link
              to="/cart"
              className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive("/cart") 
                  ? "text-indigo-600 bg-indigo-50" 
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200/80 rounded-full py-1.5 px-3">
                <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {user.email?.split("@")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors pl-1 border-l border-gray-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95"
              >
                Login
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Auth Modal Component */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}