import React from "react";

export default function Home({ setActivePage }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-16 px-6 text-center shadow-lg">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black uppercase tracking-widest bg-emerald-500/30 px-3 py-1 rounded-full text-emerald-100 border border-emerald-400/30">
            Hostel Delivery Service
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Snacks & Essentials, Delivered Fast.
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto font-medium">
            Get instant hostel room delivery from your nearest dark store in minutes.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setActivePage("grocery")}
              className="px-8 py-4 bg-white text-emerald-900 hover:bg-emerald-50 font-black text-sm rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              Explore Grocery Store 🚀
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="text-3xl">⚡</div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Ultra Fast</h3>
            <p className="text-xs text-gray-500">Delivered directly to your block</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="text-3xl">🏬</div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Dual Dark Stores</h3>
            <p className="text-xs text-gray-500">Dedicated stock for Omega & Nmega</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="text-3xl">💳</div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Instant Checkout</h3>
            <p className="text-xs text-gray-500">Pay seamlessly via UPI or Cards</p>
          </div>
        </div>
      </div>
    </div>
  );
}