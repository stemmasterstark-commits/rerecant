import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { supabase } from "../services/supabase";

function ProductGrid({ searchQuery = "", selectedCategory = "All" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to safely parse DB rows into consistent product objects
  const formatProduct = (p) => {
    if (!p) return null;
    return {
      id: p.id,
      name: p.name || p.title || "Product",
      price: Number(p.price) || 0,
      quantity: Number(p.quantity ?? p.stock ?? 0),
      category: p.category || "General",
      image_url: p.image_url || p.image || "https://via.placeholder.com/150",
    };
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data) {
        setProducts(data.map(formatProduct).filter(Boolean));
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Safe Real-time Subscription
    const channel = supabase
      .channel("realtime-products-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          try {
            if (payload.eventType === "UPDATE" && payload.new) {
              const updatedProduct = formatProduct(payload.new);
              setProducts((prev) =>
                prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
              );
            } else if (payload.eventType === "INSERT" && payload.new) {
              const newProduct = formatProduct(payload.new);
              setProducts((prev) => [newProduct, ...prev]);
            } else if (payload.eventType === "DELETE" && payload.old) {
              setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
            }
          } catch (e) {
            console.error("Realtime payload handling error:", e);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Safe Filtering Logic (prevents crashes on empty/null values)
  const filteredProducts = products.filter((product) => {
    if (!product) return false;
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-700 font-bold text-lg animate-pulse">
        Fetching live products... 🛒
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;