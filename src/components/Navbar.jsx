import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import AuthModal from "./AuthModal";

export default function Navbar({ activePage = "home", setActivePage, cartCount = 0 }) {
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    // 1. Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // 2. Listen for auth changes
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

  const navTo = (page) => {
    if (setActivePage) {
      setActivePage(page);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => navTo("home")}
            className="flex items-center gap-2 text-xl font-extrabold text-gray-900 tracking-tight cursor-pointer"
          >
            <span className="text-2xl">🛒</span>
            <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ReReCant
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-6">
            <button
              type="button"
              onClick={() => navTo("home")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activePage === "home" 
                  ? "text-indigo-600 bg-indigo-50" 
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => navTo("orders")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activePage === "orders" 
                  ? "text-indigo-600 bg-indigo-50" 
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              Orders
            </button>

            <button
              type="button"
              onClick={() => navTo("cart")}
              className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activePage === "cart" 
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
            </button>
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
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors pl-1 border-l border-gray-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95"
              >
                Login
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}