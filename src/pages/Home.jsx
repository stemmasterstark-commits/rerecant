import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import { supabase } from "../services/supabase";

function Home({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("products").select("category");
      if (data) {
        const uniqueCategories = [
          "All",
          ...new Set(data.map((item) => item.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar onNavigate={onNavigate} currentPage="home" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-800 placeholder-gray-400"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-green-600 text-white shadow-md scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <ProductGrid
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </main>
    </div>
  );
}

export default Home;