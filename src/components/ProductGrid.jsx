import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import ProductCard from "./ProductCard";

export default function ProductGrid({ cartItems = [], setCartItems }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve current store selection
  const activeStore = localStorage.getItem("rerecant_dark_store") || "Old Mega";

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      // 1. Filter by active store location
      // 2. STOPS OUT OF STOCK ITEMS: Filters only items where stock > 0
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("store_location", activeStore)
        .gt("stock", 0) 
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [activeStore]);

  if (loading) {
    return (
      <div className="py-16 text-center text-emerald-600 font-bold text-sm">
        Loading snacks for {activeStore}...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-black">Grocery Store</h2>
          <p className="text-xs text-gray-500 font-medium">
            Fulfilling from: <span className="text-emerald-600 font-bold">{activeStore}</span>
          </p>
        </div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          {products.length} Products Available
        </span>
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center text-gray-500 font-medium text-sm bg-white rounded-2xl border border-gray-100">
          No available stock in {activeStore} right now.
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
    </div>
  );
}