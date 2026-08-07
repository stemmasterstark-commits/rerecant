import React from "react";

export default function ProductCard({
  product,
  cartItems = [],
  setCartItems,
}) {
  // STRICT: Read exact 'stock' column from Supabase table. Default to 0 if missing.
  const stockLimit = typeof product.stock === "number" ? product.stock : Number(product.stock || 0);

  // Check how many units of this item are currently in user's cart
  const inCartItem = cartItems.find((item) => item.id === product.id);
  const currentInCartCount = inCartItem ? inCartItem.quantity : 0;

  const isOutOfStock = stockLimit <= 0;
  const isMaxReached = currentInCartCount >= stockLimit;

  // Quantity Handlers
  const handleIncrease = () => {
    if (isMaxReached || isOutOfStock) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleDecrease = () => {
    if (currentInCartCount <= 0) return;

    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
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

        {/* Real DB Stock Badge */}
        <div className="flex items-center gap-1.5 mb-3">
          <span
            className={`w-2 h-2 rounded-full ${
              isOutOfStock
                ? "bg-red-500"
                : isMaxReached
                ? "bg-amber-500"
                : "bg-emerald-500 animate-pulse"
            }`}
          ></span>
          <span
            className={`text-xs font-semibold ${
              isOutOfStock
                ? "text-red-600"
                : isMaxReached
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : isMaxReached
              ? `Max Reached (${currentInCartCount}/${stockLimit})`
              : `In Stock: ${stockLimit}`}
          </span>
        </div>
      </div>

      {/* Price & Stepper Button */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
        <span className="text-lg font-black text-emerald-600">
          ₹{product.price}
        </span>

        {isOutOfStock ? (
          <button
            disabled
            className="px-4 py-2 bg-gray-200 text-gray-400 font-bold text-xs rounded-xl cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : currentInCartCount > 0 ? (
          /* Plus/Minus Stepper Controls */
          <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-xl overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={handleDecrease}
              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-black text-sm transition-all"
            >
              -
            </button>
            <span className="px-3 text-xs font-black text-emerald-900">
              {currentInCartCount}
            </span>
            <button
              type="button"
              disabled={isMaxReached}
              onClick={handleIncrease}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        ) : (
          /* Initial Add Button */
          <button
            type="button"
            onClick={handleIncrease}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-100 transition-all active:scale-95"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}