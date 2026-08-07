import React, { useState } from "react";

export default function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500); // Reset button feedback after 1.5s
  };

  const isOutOfStock = product.stock <= 0;

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
          {/* Category Tag */}
          {product.category && (
            <span className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              {product.category}
            </span>
          )}
        </div>

        {/* Product Details */}
        <h3 className="font-bold text-gray-800 text-base mb-1">{product.name}</h3>

        {/* Available Stock Indicator (Matches Header Emerald) */}
        <div className="flex items-center gap-1.5 mb-3">
          <span
            className={`w-2 h-2 rounded-full ${
              isOutOfStock ? "bg-red-500" : "bg-emerald-500 animate-pulse"
            }`}
          ></span>
          <span
            className={`text-xs font-semibold ${
              isOutOfStock ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : `Available: ${product.stock ?? "In Stock"}`}
          </span>
        </div>
      </div>

      {/* Price & Add to Cart Button */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
        {/* Price Listing Color */}
        <span className="text-lg font-black text-emerald-600">
          ₹{product.price}
        </span>

        {/* Add to Cart Button */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAdd}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : added
              ? "bg-emerald-800 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}