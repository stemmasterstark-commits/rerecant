import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { supabase } from "../services/supabase";

export default function Cart({ onNavigate }) {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { user, loginWithPhone, markOrderCompleted } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("cart"); // 'cart' | 'phone' | 'otp' | 'success'
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  // Trigger Razorpay Checkout Modal directly on frontend
  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Please refresh the page.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TMq8V3xUQPaCWC",
      amount: totalPrice * 100, // Amount in paise
      currency: "INR",
      name: "ReReCant",
      description: "Night Canteen Order",
      image: "https://via.placeholder.com/150",
      handler: async function (response) {
        // Called on successful payment
        await processSuccessfulOrder(response.razorpay_payment_id);
      },
      prefill: {
        contact: user?.phone || phone,
      },
      theme: {
        color: "#16a34a",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // Process order, decrement Supabase stock, and save order record
  const processSuccessfulOrder = async (paymentId) => {
    const orderTimestamp = new Date().toISOString();

    const orderData = {
      id: paymentId || `REC-${Date.now()}`,
      items: cart,
      total_price: totalPrice,
      user_phone: user?.phone || phone,
      created_at: orderTimestamp,
    };

    try {
      // 1. Decrement Stock in Supabase
      for (const item of cart) {
        const remainingStock = Math.max(0, (item.quantity ?? 0) - item.cartQuantity);
        await supabase
          .from("products")
          .update({ quantity: remainingStock })
          .eq("id", item.id);
      }

      // 2. Insert into Supabase Orders table
      await supabase.from("orders").insert([
        {
          items: cart,
          total_price: totalPrice,
          user_phone: user?.phone || phone,
          created_at: orderTimestamp,
        },
      ]);
    } catch (e) {
      console.error("Database order log error:", e);
    }

    // 3. Save locally for user history
    const userPhoneKey = `user_orders_${user?.phone || phone}`;
    const userOrders = JSON.parse(localStorage.getItem(userPhoneKey) || "[]");
    localStorage.setItem(userPhoneKey, JSON.stringify([orderData, ...userOrders]));

    setLastOrderDetails(orderData);
    markOrderCompleted();
    clearCart();
    setStep("success");
  };

  // OTP Login Mock Handlers
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) return alert("Enter valid 10-digit mobile number");
    setStep("otp");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== "1234") return alert("Invalid OTP. Use test OTP: 1234");
    loginWithPhone(phone);
    setStep("cart");
    handleRazorpayPayment();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar onNavigate={onNavigate} currentPage="cart" />

      <main className="max-w-2xl mx-auto px-4 pt-8">
        <h1 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <span>🛒</span> Your Cart
        </h1>

        {step === "success" ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg text-center space-y-6">
            <div className="text-6xl animate-bounce">🎉</div>
            <h2 className="text-2xl font-black text-slate-900">Order Placed Successfully!</h2>
            <p className="text-sm font-bold text-gray-500">
              Payment ID: <span className="text-green-700">{lastOrderDetails?.id}</span>
            </p>

            <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900">
              {user?.orderCount > 1 ? (
                <div className="font-extrabold text-lg">
                  🛵 "You know from where to get it self delivered!"
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-bold text-base">
                    Welcome to ReReCant! Contact us on WhatsApp for pick-up/delivery:
                  </p>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20ReReCant,%20I%20just%20placed%20an%20order!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-md transition active:scale-95"
                  >
                    💬 Contact on WhatsApp
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate("orders")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-xl transition"
            >
              View Order History 📦
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 shadow-sm space-y-4">
            <div className="text-5xl">🛒</div>
            <h2 className="text-xl font-black text-slate-900">Your cart is empty</h2>
            <button
              onClick={() => onNavigate("home")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl transition"
            >
              Start Shopping 🚀
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-b-0">
                  <div>
                    <h3 className="font-black text-slate-900 text-base">{item.name}</h3>
                    <p className="text-sm font-bold text-green-700">₹{item.price * item.cartQuantity}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 border rounded-xl p-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 font-bold bg-white rounded-lg border">-</button>
                    <span className="font-black text-slate-900 px-2">{item.cartQuantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 font-bold bg-green-600 text-white rounded-lg">+</button>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 font-bold ml-2">🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-900 text-lg">📱 Enter Mobile Number to Continue</h3>
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-gray-300 font-bold outline-none"
                />
                <button type="submit" className="w-full bg-green-600 text-white font-black py-3.5 rounded-xl">
                  Send OTP 🚀
                </button>
              </form>
            ) : step === "otp" ? (
              <form onSubmit={handleVerifyOtp} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-extrabold text-slate-900 text-lg">🔑 Enter OTP (Use: 1234)</h3>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-gray-300 font-bold text-center tracking-widest text-xl outline-none"
                />
                <button type="submit" className="w-full bg-green-600 text-white font-black py-3.5 rounded-xl">
                  Verify OTP & Proceed 💳
                </button>
              </form>
            ) : (
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-md space-y-4">
                <div className="flex justify-between items-center text-xl font-black text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-green-700">₹{totalPrice}</span>
                </div>
                <button
                  onClick={() => {
                    if (!user) {
                      setStep("phone");
                    } else {
                      handleRazorpayPayment();
                    }
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-lg py-4 rounded-xl shadow-lg transition active:scale-95"
                >
                  {user ? `Pay ₹${totalPrice} with Razorpay 💳` : "Login with Mobile No. to Checkout 📱"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}