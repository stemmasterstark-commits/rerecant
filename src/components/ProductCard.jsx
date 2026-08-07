import React, { useState } from "react";

export default function ProductCard({ product, onAddToCart, cartItems = [] }) {
  const [added, setAdded] = useState(false);

  // 1. Calculate how many of this product are already in the cart
  const inCartItem = cartItems.find((item) => item.id === product.id);
  const currentInCartCount = inCartItem ? inCartItem.quantity : 0;

  // 2. Determine actual remaining available stock
  const stockLimit = Number(product.stock ?? 0);
  const isOutOfStock = stockLimit <= 0;
  const isMaxInCartReached = currentInCartCount >= stockLimit;

  const handleAdd = () => {
    if (isMaxInCartReached || isOutOfStock) return;

    if (onAddToCart) {
      onAddToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between p-4">
      <div>
        {/* Product Image */}
        <div className="relative w-full h-44 bg-gray-50 rounded-xl overflow-hidden mb-3">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              🍿
            </div>
          )}
          {product.category && (
            <span className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              {product.category}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-bold text-gray-800 text-base mb-1">{product.name}</h3>

        {/* Stock Status Indicator */}
        <div className="flex items-center gap-1.5 mb-3">
          <span
            className={`w-2 h-2 rounded-full ${
              isOutOfStock
                ? "bg-red-500"
                : isMaxInCartReached
                ? "bg-amber-500"
                : "bg-emerald-500 animate-pulse"
            }`}
          ></span>
          <span
            className={`text-xs font-semibold ${
              isOutOfStock
                ? "text-red-600"
                : isMaxInCartReached
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : isMaxInCartReached
              ? `Max in Cart (${currentInCartCount}/${stockLimit})`
              : `Available: ${stockLimit}`}
          </span>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
        <span className="text-lg font-black text-emerald-600">
          ₹{product.price}
        </span>

        <button
          type="button"
          disabled={isOutOfStock || isMaxInCartReached}
          onClick={handleAdd}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : isMaxInCartReached
              ? "bg-amber-100 text-amber-700 cursor-not-allowed"
              : added
              ? "bg-emerald-800 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100"
          }`}
        >
          {isOutOfStock
            ? "Out of Stock"
            : isMaxInCartReached
            ? "Limit Reached"
            : added
            ? "✓ Added!"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}