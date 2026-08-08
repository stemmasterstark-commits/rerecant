import React from "react";

export default function Home({ setActivePage }) {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-8 md:p-12 shadow-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-4">
          <span className="bg-emerald-500/30 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-400/30">
            Campus Night Canteen Reimagined
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Craving Late Night Snacks? We’ve Got You Covered.
          </h1>
          <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
            Order your favorite puffs, chips, and instant meals straight from the ReReCant canteen with instant Razorpay checkout.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActivePage("grocery")}
              className="px-8 py-4 bg-white text-emerald-700 font-extrabold rounded-2xl shadow-lg hover:bg-emerald-50 hover:scale-105 transition-all text-sm tracking-wide"
            >
              🛍️ Explore Grocery Store
            </button>
          </div>
        </div>
        <div className="text-8xl md:text-9xl select-none">
          🍿
        </div>
      </section>

      {/* History & Vision Section */}
      <section className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-black!">The Story Behind ReReCant</h2>
          <p className="text-gray-500 text-sm">Building the future of campus snacking & late-night convenience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/60 space-y-2">
            <div className="text-3xl">🌙</div>
            <h3 className="font-bold text-gray-800 text-lg">Late Night Savior</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Founded to solve the late-night hunger pangs during exam crunch hours or whenever you get the urge to eat anything and when vending machine goes down.
            </p>
          </div>

          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/60 space-y-2">
            <div className="text-3xl">⚡</div>
            <h3 className="font-bold text-gray-800 text-lg">Instant Live Stock</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Real-time inventory decrementing so you never order something that's already out of stock at the counter.
            </p>
          </div>

          <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/60 space-y-2">
            <div className="text-3xl">💳</div>
            <h3 className="font-bold text-gray-800 text-lg">Cashless & Seamless</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Integrated with Razorpay UPI and Supabase database security for quick, single-tap student order fulfillment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}