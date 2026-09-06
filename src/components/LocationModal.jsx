import React from "react";

export default function LocationModal({ isOpen, selectedStore, onSelectStore }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="text-4xl">🏪</div>
        <div>
          <h2 className="text-xl font-black text-gray-900">Choose your dark store location</h2>
          <p className="text-xs text-gray-500 mt-1">Select your hostel block to view available stock</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onSelectStore("Old Mega")}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm border-2 transition-all flex items-center justify-between ${
              selectedStore === "Old Mega"
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-gray-200 hover:border-emerald-500 bg-white text-gray-800"
            }`}
          >
            <span>🏢 Old Mega Dark Store</span>
            <span className="text-xs text-emerald-600 font-semibold">Active</span>
          </button>

          <button
            onClick={() => onSelectStore("New Mega")}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm border-2 transition-all flex items-center justify-between ${
              selectedStore === "New Mega"
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-gray-200 hover:border-emerald-500 bg-white text-gray-800"
            }`}
          >
            <span>🏢 New Mega Dark Store</span>
            <span className="text-xs text-emerald-600 font-semibold">Active</span>
          </button>
        </div>
      </div>
    </div>
  );
}