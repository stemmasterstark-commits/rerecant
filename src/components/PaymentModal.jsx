import { useState } from "react";

function PaymentModal({ isOpen, onClose, totalAmount, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");

  if (!isOpen) return null;

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Payment Gateway API Processing Delay (2 Seconds)
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <span>💳</span> Secure Payment
            </h3>
            <p className="text-xs text-gray-500 font-medium">ReReCant Checkout Gateway</p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Amount Banner */}
        <div className="my-5 bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <span className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-1">Total Payable</span>
          <span className="text-3xl font-black text-green-700">₹{totalAmount}</span>
        </div>

        {/* Form */}
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider block mb-2">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`p-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition ${
                  paymentMethod === "upi"
                    ? "border-green-600 bg-green-50 text-green-900"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                📱 UPI / GPay
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition ${
                  paymentMethod === "card"
                    ? "border-green-600 bg-green-50 text-green-900"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                💳 Card / NetBanking
              </button>
            </div>
          </div>

          {paymentMethod === "upi" ? (
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Enter UPI ID</label>
              <input
                type="text"
                required
                placeholder="username@okaxis or 9876543210@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm font-medium"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                required
                placeholder="Card Number (4532 ....)"
                maxLength={16}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium"
                />
                <input
                  type="password"
                  required
                  placeholder="CVV"
                  maxLength={3}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white py-3.5 rounded-xl font-extrabold text-base transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
          >
            {isProcessing ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <span>Pay ₹{totalAmount} & Complete Order 🚀</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;