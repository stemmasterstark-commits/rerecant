import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabase";

export default function Orders({ onNavigate }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const userPhoneKey = `user_orders_${user?.phone || ""}`;
      const localOrders = JSON.parse(localStorage.getItem(userPhoneKey) || "[]");

      if (user?.phone) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_phone", user.phone)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setOrders(data);
        } else {
          setOrders(localOrders);
        }
      } else {
        setOrders(localOrders);
      }
      setLoading(false);
    }

    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pb-12">
       

      <main className="max-w-2xl mx-auto px-4 pt-8">
        <h1 style={{ color: "#0f172a" }} className="text-3xl font-black mb-6 flex items-center gap-2">
          <span>📦</span> Your Order History
        </h1>

        {loading ? (
          <div className="text-center py-12 font-bold text-slate-700 animate-pulse">Loading orders... 🛒</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-gray-200 shadow-md">
            <div className="text-5xl mb-3">🛒</div>
            <h2 style={{ color: "#0f172a" }} className="text-2xl font-black mb-2">No past orders found</h2>
            <button
              onClick={() => onNavigate("home")}
              className="mt-4 bg-green-700 hover:bg-green-800 text-white font-extrabold px-6 py-3 rounded-xl shadow-md transition"
            >
              Start Shopping Now 🚀
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => (
              <div key={order.id || idx} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-black text-gray-400 uppercase">Order ID: #{String(order.id).slice(0, 10)}</span>
                    <p style={{ color: "#0f172a" }} className="text-xs font-extrabold mt-0.5">
                      📅 {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })} at {new Date(order.created_at).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-900 text-xs font-black px-3 py-1 rounded-full border border-green-300">
                    ✅ Paid & Confirmed
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span style={{ color: "#0f172a" }} className="font-bold">
                        {item.name} <span className="text-gray-500 font-normal">x{item.cartQuantity}</span>
                      </span>
                      <span style={{ color: "#0f172a" }} className="font-extrabold">₹{item.price * item.cartQuantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-base font-black">
                  <span>Total Paid:</span>
                  <span className="text-green-700 text-lg">₹{order.total_price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}