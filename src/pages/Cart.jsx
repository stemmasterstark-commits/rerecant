import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function Cart({
  cartItems,
  setCartItems,
  clearCart,
  setActivePage,
  onOpenAuth, // 👈 Received from App.jsx
}) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // 🔒 Sync Supabase session state live
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const maxStock =
              typeof item.stock === "number"
                ? item.stock
                : Number(item.stock || 0);

            if (newQuantity > maxStock) {
              alert(`Only ${maxStock} units available!`);
              return { ...item, quantity: maxStock };
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const processSuccessfulOrder = async (paymentId, currentUser) => {
    const orderItems = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url || null,
    }));

    const { error: orderError } = await supabase.from("orders").insert([
      {
        user_id: currentUser.id,
        items: orderItems,
        total_amount: totalAmount,
        payment_id: paymentId,
        status: "Paid",
      },
    ]);

    if (orderError) console.error("Order error:", orderError);

    for (const item of cartItems) {
      const currentStock =
        typeof item.stock === "number"
          ? item.stock
          : Number(item.stock || 0);

      await supabase
        .from("products")
        .update({ stock: Math.max(0, currentStock - item.quantity) })
        .eq("id", item.id);
    }

    setCompletedOrder({ items: orderItems, total: totalAmount, paymentId });
    setShowSuccessModal(true);
    clearCart();
  };

  const handleCheckout = async () => {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const activeUser = session?.user;

    if (!activeUser) {
      setLoading(false);
      if (onOpenAuth) onOpenAuth(); // Opens auth modal if bypass attempted
      return;
    }

    if (typeof window.Razorpay === "undefined") {
      alert("Razorpay SDK not loaded. Please refresh.");
      setLoading(false);
      return;
    }

    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
        amount: totalAmount * 100,
        currency: "INR",
        name: "ReReCant Canteen",
        description: "Grocery & Snack Purchase",
        image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
        handler: async function (response) {
          try {
            await processSuccessfulOrder(response.razorpay_payment_id, activeUser);
          } catch (err) {
            console.error("Order failed:", err);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: activeUser.user_metadata?.full_name || activeUser.email?.split("@")[0] || "Student",
          email: activeUser.email,
        },
        theme: { color: "#059669" },
        modal: { ondismiss: () => setLoading(false) },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      alert(`Checkout Error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6 relative">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-black text-black!">Your Cart</h1>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="text-xs font-semibold text-red-500 hover:underline">
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="max-w-md mx-auto py-16 text-center space-y-4">
          <div className="text-6xl">🛒</div>
          <h2 className="text-2xl font-black text-gray-900">Your Cart is Empty</h2>
          <button
            onClick={() => setActivePage && setActivePage("grocery")}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            Browse Store
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cartItems.map((item) => {
              const maxStock = typeof item.stock === "number" ? item.stock : Number(item.stock || 0);

              return (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🍿</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                      <p className="text-xs text-emerald-600 font-bold">₹{item.price} each</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 bg-gray-50 font-black">-</button>
                      <span className="px-3 text-xs font-black">{item.quantity}</span>
                      <button disabled={item.quantity >= maxStock} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 bg-gray-50 font-black disabled:opacity-30">+</button>
                    </div>
                    <span className="font-black text-sm text-gray-900 w-16 text-right">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-lg font-black text-gray-900">
              <span>Total</span>
              <span className="text-emerald-600">₹{totalAmount}</span>
            </div>

            {/* IF LOGGED OUT -> OPENS YOUR AUTH MODAL directly! */}
            {!user ? (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-sm transition-all active:scale-95 flex items-center justify-center"
              >
                Login to Checkout
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleCheckout}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? "Opening Gateway..." : "Proceed to Checkout"}
              </button>
            )}
          </div>
        </>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-5 border border-emerald-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">🎉</div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Order Placed!</h2>
              <p className="text-xs text-gray-500 mt-1">Payment received & stock updated.</p>
            </div>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                if (setActivePage) setActivePage("orders");
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition-all active:scale-95"
            >
              View Order History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}