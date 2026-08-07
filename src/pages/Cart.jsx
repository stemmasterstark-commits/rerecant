import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import AuthModal from '..components/AuthModal';

export default function Cart({ cartItems, clearCart }) {
  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Calculate total amount
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Load Razorpay Script dynamically
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
    if (cartItems.length === 0) return alert('Your cart is empty!');

    // 1. Enforce User Login Check
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in to complete your order!");
      setIsAuthModalOpen(true);
      return;
    }

    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Check your internet connection.');
      setLoading(false);
      return;
    }

    // 2. Configure Razorpay Options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      name: 'ReReCant Canteen',
      description: 'Order Payment',
      prefill: {
        email: user.email,
      },
      handler: async function (response) {
        try {
          // A. Decrease Stock in Supabase for each purchased item
          for (const item of cartItems) {
            const newStock = Math.max(0, item.stock - item.quantity);
            await supabase
              .from('products')
              .update({ stock: newStock })
              .eq('id', item.id);
          }

          // B. Create Order record tied to user_id
          await supabase.from('orders').insert([
            {
              user_id: user.id,
              total_amount: totalAmount,
              payment_id: response.razorpay_payment_id,
              status: 'Paid',
              items: cartItems
            }
          ]);

          alert('🎉 Payment successful! Your order has been placed.');
          if (clearCart) clearCart();
        } catch (err) {
          console.error('Error processing post-payment logic:', err);
        } finally {
          setLoading(false);
        }
      },
      theme: {
        color: '#4F46E5',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-sm">Your cart is empty.</p>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-700">₹{item.price * item.quantity}</p>
              </div>
            ))}

            <div className="flex justify-between items-center pt-3 font-bold text-lg text-gray-900 border-t">
              <span>Total:</span>
              <span>₹{totalAmount}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
            >
              {loading ? 'Processing Payment...' : 'Proceed to Pay'}
            </button>
          </div>
        )}
      </div>

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}