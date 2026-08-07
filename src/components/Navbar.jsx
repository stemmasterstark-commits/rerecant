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

  return (
    <>
      <header className="sticky top-0 z-40 bg-emerald-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => setActivePage && setActivePage("home")}
            className="flex items-center gap-2 text-2xl font-black tracking-wide cursor-pointer hover:opacity-90 transition"
          >
            ReReCant
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setActivePage && setActivePage("home")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activePage === "home" 
                  ? "bg-emerald-700 text-white font-bold shadow-inner" 
                  : "text-emerald-50 hover:bg-emerald-500"
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => setActivePage && setActivePage("orders")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activePage === "orders" 
                  ? "bg-emerald-700 text-white font-bold shadow-inner" 
                  : "text-emerald-50 hover:bg-emerald-500"
              }`}
            >
              Orders
            </button>

            <button
              type="button"
              onClick={() => setActivePage && setActivePage("cart")}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition ${
                activePage === "cart" 
                  ? "bg-emerald-700 text-white font-bold shadow-inner" 
                  : "text-emerald-50 hover:bg-emerald-500"
              }`}
            >
              Cart
              {cartCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-emerald-800 bg-white rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          {/* Auth Section */}
          <div>
            {user ? (
              <div className="flex items-center gap-3 bg-emerald-700 border border-emerald-500/50 rounded-full py-1.5 px-4 shadow-sm">
                <span className="text-xs font-semibold text-emerald-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                  {user.email?.split("@")[0]}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-red-200 hover:text-white font-bold transition-colors pl-2 border-l border-emerald-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="px-5 py-2 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-sm rounded-full shadow transition-all active:scale-95"
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