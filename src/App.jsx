import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders'; // If you have an Orders page

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [cartItems, setCartItems] = useState([]);

  return (
    <div>
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        cartCount={cartItems.length} 
      />

      <main className="p-4">
        {activePage === 'home' && <Home setCartItems={setCartItems} />}
        {activePage === 'cart' && <Cart cartItems={cartItems} />}
        {activePage === 'orders' && <Orders />}
      </main>
    </div>
  );
}