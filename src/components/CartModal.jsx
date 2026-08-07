import { useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../services/supabase";
import PaymentModal from "./PaymentModal";

function CartModal({ isOpen, onClose }) {
  const { cart, totalPrice, clearCart } = useCart();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Called after payment is verified successfully
  const handlePaymentSuccess = async () => {
    setIsPaymentOpen(false);

    try {
      // 1. Deduct real stock in Supabase database
      for (const item of cart) {
        const remainingStock = Math.max(0, (item.quantity ?? 0) - item.cartQuantity);
        
        await supabase
          .from("products")
          .update({ quantity: remainingStock })
          .eq("id", item.id);
      }

      // 2. Insert record into Supabase Orders table
      await supabase.from("orders").insert([
        {
          items: cart,
          total_price: totalPrice,
          created_at: new Date().toISOString()
        }
      ]);

      alert("🎉 Payment Successful! Your order has been placed.");
      clearCart();
      onClose();
    } catch (err) {
      console.error("Order processing error:", err);
      alert("Payment processed, but order logging failed.");
    }
  };

  return (
    <>
      {/* Existing Cart Modal JSX ... */}
      <button 
        onClick={() => setIsPaymentOpen(true)}
        disabled={cart.length === 0}
        className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700"
      >
        Proceed to Pay ₹{totalPrice}
      </button>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={totalPrice}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
export default CartModal;