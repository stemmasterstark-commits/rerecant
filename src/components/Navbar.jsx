import { useState } from "react";
import { useCart } from "../context/CartContext";

function Navbar({ onNavigate, currentPage = "home" }) {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsOpen(false); // Close mobile menu on click
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Title - Click to go Home */}
          <button 
            onClick={() => handleNavigation("home")} 
            className="flex items-center gap-2 focus:outline-none hover:opacity-90 transition group cursor-pointer"
            title="Go to Home"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🛒</span>
            <span className="text-2xl font-extrabold tracking-tight">ReReCant</span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavigation("home")}
              className={`font-medium transition cursor-pointer ${
                currentPage === "home" 
                  ? "text-amber-300 font-bold underline underline-offset-4" 
                  : "hover:text-green-200"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("orders")}
              className={`font-medium transition cursor-pointer ${
                currentPage === "orders" 
                  ? "text-amber-300 font-bold underline underline-offset-4" 
                  : "hover:text-green-200"
              }`}
            >
              Orders
            </button>

            {/* Desktop Cart Button */}
            <button
              onClick={() => handleNavigation("cart")}
              className={`relative bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer ${
                currentPage === "cart" ? "ring-2 ring-amber-400" : ""
              }`}
            >
              <span>🛒 Cart</span>
              {totalItems > 0 && (
                <span className="bg-amber-400 text-gray-900 text-xs font-black px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions Right Side */}
          <div className="md:hidden flex items-center gap-3">
            {/* Quick Mobile Cart Button */}
            <button
              onClick={() => handleNavigation("cart")}
              className={`relative bg-green-700 hover:bg-green-800 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 text-sm cursor-pointer ${
                currentPage === "cart" ? "ring-2 ring-amber-400" : ""
              }`}
            >
              <span>🛒</span>
              {totalItems > 0 && (
                <span className="bg-amber-400 text-gray-900 text-xs font-black px-1.5 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger Menu Toggle Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-green-700 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu (Expanded when Hamburger is clicked) */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-green-500 pt-3 px-2">
            <button
              onClick={() => handleNavigation("home")}
              className={`block w-full text-left px-4 py-2.5 rounded-lg font-bold text-base transition cursor-pointer ${
                currentPage === "home" ? "bg-green-800 text-amber-300" : "hover:bg-green-700"
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => handleNavigation("orders")}
              className={`block w-full text-left px-4 py-2.5 rounded-lg font-bold text-base transition cursor-pointer ${
                currentPage === "orders" ? "bg-green-800 text-amber-300" : "hover:bg-green-700"
              }`}
            >
              📦 Orders
            </button>
            <button
              onClick={() => handleNavigation("cart")}
              className={`block w-full text-left px-4 py-2.5 rounded-lg font-bold text-base transition cursor-pointer ${
                currentPage === "cart" ? "bg-green-800 text-amber-300" : "hover:bg-green-700"
              }`}
            >
              🛒 Cart ({totalItems})
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;