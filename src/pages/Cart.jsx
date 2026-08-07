import React from "react";

export default function Cart({ cartItems, setCartItems, clearCart, setActivePage }) {
  const updateQuantity = (id, newQuantity) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const rawStock = item.stock ?? item.available_stock ?? item.inventory ?? 99;
            const maxStock = Number(rawStock);
            if (newQuantity > maxStock) {
              alert(`Sorry, only ${maxStock} units of "${item.name}" are in stock!`);
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

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-black text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">
          Looks like you haven't added any snacks or groceries yet.
        </p>
        <button
          onClick={() => setActivePage("grocery")} // 👈 Redirects directly to Grocery Store!
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

      <div className="space-y-3">
        {cartItems.map((item) => {
          const rawStock = item.stock ?? item.available_stock ?? item.inventory ?? 99;
          const maxStock = Number(rawStock);

          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                <p className="text-xs text-emerald-600 font-bold">₹{item.price}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-50 text-gray-600 font-bold hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold">{item.quantity}</span>
                  <button
                    disabled={item.quantity >= maxStock}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-50 text-gray-600 font-bold hover:bg-gray-100 disabled:opacity-40"
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

      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center text-lg font-black text-gray-900">
          <span>Total</span>
          <span className="text-emerald-600">₹{totalAmount}</span>
        </div>
        <button className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md text-sm transition-all active:scale-95">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}