import React, { useState } from "react";

export default function Navbar({
  activePage,
  setActivePage,
  cartCount,
  onOpenAuth,
  user,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper function: Extract username before '@'
  const getUserDisplayName = () => {
    if (!user) return "";
    if (user.displayName) return user.displayName;
    if (user.email) return user.email.split("@")[0];
    return "Account";
  };

  const username = getUserDisplayName();

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-emerald-600 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2 cursor-pointer font-black text-xl tracking-tight"
          >
            <span className="text-2xl">🛒</span>
            <span>RERECANT</span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleNavClick("home")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === "home"
                  ? "bg-emerald-700 text-white"
                  : "hover:bg-emerald-500/50"
              }`}
            >
              HOME
            </button>

            <button
              onClick={() => handleNavClick("grocery")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === "grocery"
                  ? "bg-emerald-700 text-white"
                  : "hover:bg-emerald-500/50"
              }`}
            >
              GROCERY STORE
            </button>

            <button
              onClick={() => handleNavClick("orders")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === "orders"
                  ? "bg-emerald-700 text-white"
                  : "hover:bg-emerald-500/50"
              }`}
            >
              ORDERS
            </button>

            <button
              onClick={() => handleNavClick("cart")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all relative ${
                activePage === "cart"
                  ? "bg-emerald-700 text-white"
                  : "hover:bg-emerald-500/50"
              }`}
            >
              CART
              {cartCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-amber-400 text-gray-900 font-extrabold text-[10px] rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* LOGIN / LOGOUT TOGGLE */}
            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-xs font-bold bg-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-500 capitalize">
                  👤 {username}
                </span>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="ml-2 px-4 py-2 bg-white text-emerald-800 hover:bg-gray-100 font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                LOGIN
              </button>
            )}
          </nav>

          {/* MOBILE TOGGLE & CART BUTTON */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => handleNavClick("cart")}
              className="p-2 bg-emerald-700 rounded-lg text-xs font-bold relative"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-amber-400 text-gray-900 text-[10px] rounded-full font-black">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-emerald-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-700 border-t border-emerald-600 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => handleNavClick("home")}
            className="block w-full text-left px-3 py-2 rounded-xl text-xs font-bold"
          >
            HOME
          </button>
          <button
            onClick={() => handleNavClick("grocery")}
            className="block w-full text-left px-3 py-2 rounded-xl text-xs font-bold"
          >
            GROCERY STORE
          </button>
          <button
            onClick={() => handleNavClick("orders")}
            className="block w-full text-left px-3 py-2 rounded-xl text-xs font-bold"
          >
            ORDERS
          </button>
          <button
            onClick={() => handleNavClick("cart")}
            className="block w-full text-left px-3 py-2 rounded-xl text-xs font-bold"
          >
            CART ({cartCount})
          </button>

          {/* MOBILE LOGIN / USER STATUS */}
          <div className="pt-2 border-t border-emerald-600">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-xs font-bold text-emerald-100 capitalize">
                  Logged in as: <span className="text-amber-300">{username}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2 bg-red-500 text-white font-bold text-xs rounded-xl text-center"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl text-center"
              >
                LOGIN
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}