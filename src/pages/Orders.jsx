import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Orders({ setActivePage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error) setOrders(data || []);
      }
      setLoading(false);
    }

    fetchUserOrders();
  }, []);

  if (loading) return <div className="py-12 text-center text-gray-500 font-medium">Loading your orders...</div>;

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="text-5xl">🔒</div>
        <h2 className="text-2xl font-black text-gray-800">Login Required</h2>
        <p className="text-xs text-gray-500">Please log in to view your order history and live pickup status.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-black text-gray-500 flex items-center gap-2">
        <span>📋</span> My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl text-center border border-gray-100 space-y-3">
          <p className="text-gray-500 text-sm">You haven't placed any orders yet!</p>
          <button
            onClick={() => setActivePage("grocery")}
            className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b pb-3 text-xs">
                <div>
                  <p className="font-bold text-gray-800">Order #{order.id}</p>
                  <p className="text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                  {order.status || "Paid"}
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">{item.name} x {item.quantity}</span>
                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t pt-3 text-sm">
                <span className="text-xs text-gray-400">Payment ID: {order.payment_id}</span>
                <span className="font-black text-emerald-600 text-base">Total: ₹{order.total_amount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}