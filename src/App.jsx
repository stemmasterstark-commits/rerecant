import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ProductGrid from "./components/ProductGrid";
import AuthModal from "./components/AuthModal"; // 👈 1. Imported AuthModal

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [cartItems, setCartItems] = useState([]);
  
  // 👈 2. Added modal visibility state
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const clearCart = () => setCartItems([]);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* 👈 3. AuthModal placed at app root level */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        onOpenAuth={() => setIsAuthOpen(true)} // Passed down in case your header login button uses it
      />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activePage === "home" && <Home setActivePage={setActivePage} />}
        {activePage === "grocery" && (
          <ProductGrid cartItems={cartItems} setCartItems={setCartItems} />
        )}
        {activePage === "cart" && (
          <Cart
            cartItems={cartItems}
            setCartItems={setCartItems}
            clearCart={clearCart}
            setActivePage={setActivePage}
            onOpenAuth={() => setIsAuthOpen(true)} // 👈 4. Connected "Login to Checkout" button here!
          />
        )}
        {activePage === "orders" && <Orders setActivePage={setActivePage} />}
      </main>
    </div>
  );
}