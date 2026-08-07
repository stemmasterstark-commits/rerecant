import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching orders:", error);
      else setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-sm font-semibold text-gray-500">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <div className="text-5xl">📦</div>
        <h2 className="text-xl font-black text-gray-900">No Orders Yet</h2>
        <p className="text-xs text-gray-500">
          When you place orders, they will show up here with full details and receipts.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-black text-gray-900 border-b border-gray-100 pb-4">
        Order History
      </h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const dateObj = new Date(order.created_at);
          const formattedDate = dateObj.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const formattedTime = dateObj.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return (
            <div
              key={order.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4"
            >
              {/* Header: Date & Status */}
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <div>
                  <p className="text-xs font-black text-gray-800">
                    Order #{order.id}
                  </p>
                  <p className="text-[11px] font-medium text-gray-400">
                    📅 {formattedDate} at {formattedTime}
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full border border-emerald-100">
                  {order.status || "Paid"}
                </span>
              </div>

              {/* Items List with logos and quantities */}
              <div className="space-y-3">
                {Array.isArray(order.items) &&
                  order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">🍿</span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-[11px] font-semibold text-gray-400">
                            Qty: <span className="text-gray-900 font-bold">{item.quantity}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-gray-800">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Footer: Payment ID & Total */}
              <div className="pt-3 border-t border-gray-50 flex justify-between items-center text-xs">
                <span className="text-gray-400 font-mono text-[10px]">
                  ID: {order.payment_id || "N/A"}
                </span>
                <div className="text-right">
                  <span className="text-gray-500 font-semibold mr-2">Total Paid:</span>
                  <span className="text-sm font-black text-emerald-600">
                    ₹{order.total_amount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}