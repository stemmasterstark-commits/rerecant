import React, { useState } from "react";
import { supabase } from "../services/supabase";

export default function Cart({
  cartItems,
  setCartItems,
  clearCart,
  setActivePage,
}) {
  const [loading, setLoading] = useState(false);

  // Stepper logic inside Cart
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
              alert(
                `Only ${maxStock} units of "${item.name}" available in stock!`
              );
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

  // Direct Checkout Handler: Updates stock in `products` table directly
  const handleCheckout = async () => {
    setLoading(true);

    try {
      // 1. Deduct quantity directly from the `products` table in Supabase
      for (const item of cartItems) {
        const currentStock =
          typeof item.stock === "number"
            ? item.stock
            : Number(item.stock || 0);

        const updatedStock = Math.max(0, currentStock - item.quantity);

        const { error } = await supabase
          .from("products")
          .update({ stock: updatedStock })
          .eq("id", item.id);

        if (error) {
          console.error(`Failed to update stock for ${item.name}:`, error);
          throw new Error(`Could not update stock for ${item.name}`);
        }
      }

      alert("🎉 Order placed successfully! Product stock has been updated.");
      clearCart();
      if (setActivePage) setActivePage("grocery");
    } catch (err) {
      alert(`Checkout failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-black text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">
          Looks like you haven't added any snacks or groceries yet.
        </p>
        <button
          onClick={() => setActivePage && setActivePage("grocery")}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          Browse Grocery Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-black text-gray-900">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-500 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3">
        {cartItems.map((item) => {
          const maxStock =
            typeof item.stock === "number"
              ? item.stock
              : Number(item.stock || 0);

          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4"
            >
              {/* Image & Title */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      🍿
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {item.name}
                  </h3>
                  <p className="text-xs text-emerald-600 font-bold">
                    ₹{item.price} each
                  </p>
                </div>
              </div>

              {/* Stepper Controls & Price */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-50 text-gray-700 font-black hover:bg-gray-100 transition-all"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-black text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    disabled={item.quantity >= maxStock}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-50 text-gray-700 font-black hover:bg-gray-100 disabled:opacity-30 transition-all"
                  >
                    +
                  </button>
                </div>
                <span className="font-black text-sm text-gray-900 w-16 text-right">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-lg font-black text-gray-900">
          <span>Total</span>
          <span className="text-emerald-600">₹{totalAmount}</span>
        </div>
        <button
          disabled={loading}
          onClick={handleCheckout}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-sm transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? "Updating Inventory..." : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
}