import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import AuthModal from '../components/AuthModal';

export default function Cart({ cartItems = [], setCartItems, clearCart, setActivePage }) {
  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity becomes 0
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Prevent increasing beyond database stock
          if (newQuantity > item.stock) {
            alert(`Sorry, only ${item.stock} units of ${item.name} are available in stock.`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    // 1. Enforce Auth
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      setLoading(false);
      return;
    }

    // 2. Open Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'ReReCant Canteen',
      description: 'Canteen Food Order',
      prefill: { email: user.email },
      handler: async function (response) {
        try {
          // Decrement stock in Supabase
          for (const item of cartItems) {
            const newStock = Math.max(0, (item.stock || item.quantity) - item.quantity);
            await supabase.from('products').update({ stock: newStock }).eq('id', item.id);
          }

          // Save order to orders table
          await supabase.from('orders').insert([
            {
              user_id: user.id,
              total_amount: totalAmount,
              payment_id: response.razorpay_payment_id,
              status: 'Paid',
              items: cartItems
            }
          ]);

          alert('🎉 Order placed successfully!');
          if (clearCart) clearCart();
          if (setActivePage) setActivePage('orders');
        } catch (err) {
          console.error('Payment error:', err);
        } finally {
          setLoading(false);
        }
      },
      theme: { color: '#059669' }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm">
          🛒
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6 text-sm">Looks like you haven't added any snacks or drinks yet!</p>
        <button
          onClick={() => setActivePage && setActivePage('home')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto py-6">
        <h1 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
          <span>🛒</span> Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                  )}
                  <div>
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-xs text-emerald-600 font-semibold">₹{item.price} each</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-200 text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-xs text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-200 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-bold text-gray-900 w-16 text-right">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-3">Order Summary</h2>

            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taxes & Fees</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>

            <div className="flex justify-between text-lg font-black text-gray-900 border-t pt-3">
              <span>Total Amount</span>
              <span className="text-emerald-600">₹{totalAmount}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm disabled:opacity-50 mt-4"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}