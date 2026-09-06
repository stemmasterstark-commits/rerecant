import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import ProductCard from "../components/ProductCard";

const STORE_MAP = {
  Omega: "Old Mega",
  Nmega: "New Mega",
};

const ADMIN_EMAILS = [
  "stemmastersstark@gmail.com",
  "stemmasterstark@gmail.com",
];

export default function GroceryStore({ cartItems = [], setCartItems, user }) {
  const [selectedStore, setSelectedStore] = useState(
    localStorage.getItem("rerecant_dark_store") || ""
  );
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storeStatus, setStoreStatus] = useState({ Omega: true, Nmega: true });
  const [isUpdating, setIsUpdating] = useState(false);

  const isAdmin =
    user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

  useEffect(() => {
    fetchStoreStatuses();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      const dbStoreValue = STORE_MAP[selectedStore] || selectedStore;
      fetchProducts(dbStoreValue);
    }
  }, [selectedStore]);

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

    setStoreStatus((prev) => ({ ...prev, [storeCode]: newStatus }));

    const { error } = await supabase
      .from("store_status")
      .upsert({ id: storeCode, is_open: newStatus }, { onConflict: "id" });

    if (error) {
      console.error("Supabase toggle error:", error.message);
      setStoreStatus((prev) => ({ ...prev, [storeCode]: currentStatus }));
    } else {
      await fetchStoreStatuses();
    }

    setIsUpdating(false);
  };

  const fetchProducts = async (dbStoreValue) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("store_location", dbStoreValue)
      .gt("stock", 0)
      .order("id", { ascending: true });

    if (error) console.error("Error fetching store products:", error);
    else setProducts(data || []);
    setLoading(false);
  };

  const handleSelectStore = (storeCode) => {
    if (selectedStore === storeCode) return;

    if (cartItems.length > 0 && selectedStore && selectedStore !== storeCode) {
      const confirmClear = window.confirm(
        `Your cart contains items from "${selectedStore}". Switching to "${storeCode}" will clear your cart. Do you want to proceed?`
      );
      if (!confirmClear) return;
      setCartItems([]);
    }

    setSelectedStore(storeCode);
    localStorage.setItem("rerecant_dark_store", storeCode);
  };

  const handleToggleStore = () => {
    const nextStore = selectedStore === "Omega" ? "Nmega" : "Omega";
    handleSelectStore(nextStore);
  };

  // ⚡ CENTERED ADMIN CONTROL PANEL COMPONENT
  const AdminControlPanel = () => {
    if (!isAdmin) return null;

    return (
      <div className="max-w-xl mx-auto mt-10 px-4">
        <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center justify-center space-y-1 w-full text-center">
            <span className="text-xs font-black tracking-widest uppercase text-emerald-400 text-center">
              ⚡ Admin Store Control
            </span>
            <span className="text-[11px] font-medium bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 text-center">
              {user.email}
            </span>
          </div>

          <p className="text-xs text-slate-400 max-w-xs text-center">
            Toggle stores open or closed in real-time.
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
                  <span className="font-bold text-sm text-center">{store}</span>
                  <span className="bg-black/30 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase">
                    {isOpen ? "OPEN" : "CLOSED"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 1️⃣ INITIAL STORE SELECTION VIEW
  if (!selectedStore) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 space-y-6 text-center">
        <div className="text-center space-y-2 flex flex-col items-center justify-center">
          <div className="text-6xl">🏪</div>
          <h1 className="text-2xl font-black text-gray-900 text-center">Choose Your Store</h1>
          <p className="text-xs text-gray-500 text-center">
            Select your hostel dark store location to browse available items.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {["Omega", "Nmega"].map((store) => {
            const isOpen = storeStatus[store] !== false;
            return (
              <button
                key={store}
                onClick={() => handleSelectStore(store)}
                className={`p-6 rounded-2xl border-2 transition-all text-left shadow-sm relative cursor-pointer ${
                  isOpen
                    ? "border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/50 bg-white"
                    : "border-gray-200 bg-gray-50 opacity-80"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-3xl">{store === "Omega" ? "🏢" : "🏬"}</div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      isOpen
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {isOpen ? "Open" : "Closed"}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{store}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {store === "Omega" ? "Old Mega Block" : "New Mega Block"}
                </p>
              </button>
            );
          })}
        </div>

        <AdminControlPanel />
      </div>
    );
  }

  // 2️⃣ STORE CATALOG VIEW
  const alternateStore = selectedStore === "Omega" ? "Nmega" : "Omega";
  const isCurrentStoreOpen = storeStatus[selectedStore] !== false;

  return (
    <div className="max-w-7xl mx-auto p-4 pb-20 space-y-6">
      {/* Store Banner */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Active Store
            </span>
            <span
              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                isCurrentStoreOpen
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {isCurrentStoreOpen ? "Open" : "Currently Closed"}
            </span>
          </div>
          <h1 className="text-xl font-black text-gray-900 mt-1">{selectedStore}</h1>
        </div>

        <button
          onClick={handleToggleStore}
          className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Switch to {alternateStore}</span>
          <span>🔄</span>
        </button>
      </div>

      {/* 🎯 PERFECTLY CENTERED CLOSED STORE NOTICE */}
      {!isCurrentStoreOpen ? (
        <div className="py-16 bg-white rounded-2xl border border-red-100 p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="text-5xl">🌙</div>
          <h2 className="text-xl font-black text-gray-900 text-center">
            {selectedStore} is Currently Closed
          </h2>
          <p className="text-xs text-gray-500 max-w-sm text-center">
            This dark store is currently not taking orders. Please check back later or switch to another active store.
          </p>
          <button
            onClick={handleToggleStore}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition-all cursor-pointer text-center"
          >
            Switch to {alternateStore}
          </button>
        </div>
      ) : loading ? (
        <div className="py-16 text-center text-xs text-emerald-600 font-bold flex justify-center">
          Loading catalog for {selectedStore}...
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 text-gray-500 text-sm flex justify-center">
          No items currently available in {selectedStore}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          ))}
        </div>
      )}

      {/* Admin Panel */}
      <AdminControlPanel />
    </div>
  );
}