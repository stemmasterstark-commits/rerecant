import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const ADMIN_EMAILS = [
  "sanjaykrishp2005@gmail.com",
  "stemmasterstark@gmail.com",
  "kdsaif570@gmail.com"
];

export default function Home({ setActivePage, user }) {
  const [storeStatus, setStoreStatus] = useState({ Omega: true, Nmega: true });
  const [isUpdating, setIsUpdating] = useState(false);

  const isAdmin =
    user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  useEffect(() => {
    fetchStoreStatuses();
  }, []);

  const fetchStoreStatuses = async () => {
    const { data, error } = await supabase.from("store_status").select("*");
    if (!error && data && data.length > 0) {
      const statusObj = { Omega: true, Nmega: true };
      data.forEach((item) => {
        statusObj[item.id] = item.is_open;
      });
      setStoreStatus(statusObj);
    }
  };

  const toggleStoreStatus = async (storeCode) => {
    if (!isAdmin || isUpdating) return;
    setIsUpdating(true);

    const currentStatus = storeStatus[storeCode] !== false;
    const newStatus = !currentStatus;

    // 1. Optimistic local state update
    setStoreStatus((prev) => ({ ...prev, [storeCode]: newStatus }));

    // 2. Perform explicit update query in Supabase
    const { error } = await supabase
      .from("store_status")
      .upsert({ id: storeCode, is_open: newStatus }, { onConflict: "id" });

    if (error) {
      console.error("Supabase toggle error:", error.message);
      alert(`Failed to update ${storeCode}: ${error.message}`);
      // Revert local state on database error
      setStoreStatus((prev) => ({ ...prev, [storeCode]: currentStatus }));
    } else {
      // Re-fetch to ensure remote parity
      await fetchStoreStatuses();
    }

    setIsUpdating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-16 px-6 text-center shadow-lg">
        <div className="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center">
          <span className="text-xs font-black uppercase tracking-widest bg-emerald-500/30 px-3 py-1 rounded-full text-emerald-100 border border-emerald-400/30 text-center">
            Hostel Self Delivery Service
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-center">
            Get Your Snacks Self-Delivered Fast.
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto font-medium text-center">
            Get it instantly self delivered to your room from your nearest dark store in minutes.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setActivePage("grocery")}
              className="px-8 py-4 bg-white text-emerald-900 hover:bg-emerald-50 font-black text-sm rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer text-center"
            >
              Explore Grocery Store 🚀
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-4 text-center">
          <div className="text-3xl">⚡</div>
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-gray-900 text-sm">Ultra Fast</h3>
            <p className="text-xs text-gray-500">Get it Self-Delivered directly to your room</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-4 text-center">
          <div className="text-3xl">🏬</div>
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-gray-900 text-sm">Dual Dark Stores</h3>
            <p className="text-xs text-gray-500">Dedicated stock for Omega & Nmega</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-4 text-center">
          <div className="text-3xl">💳</div>
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-gray-900 text-sm">Instant Checkout</h3>
            <p className="text-xs text-gray-500">Pay seamlessly via UPI or Cards</p>
          </div>
        </div>
      </div>

      {/* ⚡ CENTERED ADMIN CONTROL PANEL */}
      {isAdmin && (
        <div className="max-w-xl mx-auto mt-10 px-4">
          <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 flex flex-col items-center text-center">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-xs font-black tracking-widest uppercase text-emerald-400">
                ⚡ Admin Store Operations
              </span>
              <span className="text-[11px] font-medium bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                Logged in as: {user.email}
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-xs text-center">
              Toggle stores open or closed in real-time for all customers.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full pt-2">
              {["Omega", "Nmega"].map((store) => {
                const isOpen = storeStatus[store] !== false;
                return (
                  <button
                    key={store}
                    disabled={isUpdating}
                    onClick={() => toggleStoreStatus(store)}
                    className={`py-3.5 px-4 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-between shadow-md border ${
                      isOpen
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500"
                        : "bg-red-600/90 hover:bg-red-500 text-white border-red-500"
                    } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="font-bold text-sm">{store}</span>
                    <span className="bg-black/30 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase">
                      {isOpen ? "OPEN" : "CLOSED"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}