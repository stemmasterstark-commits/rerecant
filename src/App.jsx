import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AuthModal from "./components/AuthModal";
import GroceryStore from "./pages/GroceryStore"; 
import { supabase } from "./services/supabase"; // Ensure path matches your project setup

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [cartItems, setCartItems] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // User state
  const [user, setUser] = useState(null); 

  // Sync Supabase Auth state on initial render and on auth changes
  useEffect(() => {
    // 1. Get current active session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Listen for auth changes (login, logout, token refreshes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearCart = () => setCartItems([]);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
        
        {activePage === "grocery" && (
          <GroceryStore
            cartItems={cartItems}
            setCartItems={setCartItems}
            setActivePage={setActivePage}
            user={user}
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