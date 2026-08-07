import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [cartItems, setCartItems] = useState([]);

  // Clear cart function
  const clearCart = () => setCartItems([]);

  // Calculate total items count for navbar badge
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* 1. SINGLE NAVBAR HERE */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
      />

      {/* 2. DYNAMIC PAGE SWITCHING */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activePage === "home" && (
          <Home cartItems={cartItems} setCartItems={setCartItems} />
        )}
        {activePage === "cart" && (
          <Cart cartItems={cartItems} setCartItems={setCartItems} clearCart={clearCart} setActivePage={setActivePage} />
        )}
        {activePage === "orders" && (
          <Orders setActivePage={setActivePage} />
        )}
      </main>
    </div>
  );
}