import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import ProductCard from "./ProductCard";

export default function ProductGrid({ cartItems = [], setCartItems }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (!error) {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!setCartItems) return;

    const existingInCart = cartItems.find((item) => item.id === product.id);
    const currentQtyInCart = existingInCart ? existingInCart.quantity : 0;
    const availableStock = Number(product.stock ?? 0);

    // Hard Stop Check
    if (currentQtyInCart >= availableStock) {
      setToastMessage(`⚠️ Cannot add more! Maximum available stock is ${availableStock}.`);
      setTimeout(() => setToastMessage(""), 2500);
      return;
    }

    setCartItems((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    setToastMessage(`Added "${product.name}" to your cart! 🛒`);
    setTimeout(() => setToastMessage(""), 2500);
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-emerald-600 font-bold text-sm">
        Loading snacks...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">Grocery Store</h2>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          {products.length} Products Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-xl border border-emerald-600 animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
}