import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ProductGrid from "./components/ProductGrid";
import AuthModal from "./components/AuthModal";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [cartItems, setCartItems] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 1. User state (Set this when user logs in via AuthModal or Auth Provider)
  const [user, setUser] = useState(null); 
  // Example user object: { email: "johndoe@gmail.com", name: "John" }

  const clearCart = () => setCartItems([]);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    setUser(null); // Clear user state on logout
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} // Set user on login
      />

      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user} // 👈 Passed down user object
        onLogout={handleLogout} // 👈 Passed down logout handler
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
            onOpenAuth={() => setIsAuthOpen(true)}
            user={user}
          />
        )}
        {activePage === "orders" && <Orders setActivePage={setActivePage} />}
      </main>
    </div>
  );
}