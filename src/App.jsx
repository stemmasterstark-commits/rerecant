import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AuthModal from "./components/AuthModal";
import GroceryStore from "./pages/GroceryStore"; 

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [cartItems, setCartItems] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // User state
  const [user, setUser] = useState(null); 

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
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
      />

      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activePage === "home" && <Home setActivePage={setActivePage} />}
        
        {/* Updated to render GroceryStore with selection and single-store guard */}
        {activePage === "grocery" && (
  <GroceryStore
    cartItems={cartItems}
    setCartItems={setCartItems}
    setActivePage={setActivePage}
    user={user} //  Pass the logged-in user object here
  />
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