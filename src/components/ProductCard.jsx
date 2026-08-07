import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { cart, addToCart, updateQuantity } = useCart();

  const title = product?.name || product?.title || "Product";
  const price = product?.price || 0;
  // Actual database stock purchased/available:
  const actualStock = product?.quantity ?? 0;
  const image = product?.image_url || product?.image || "https://via.placeholder.com/150";

  // Get current quantity in local cart
  const cartItem = cart.find((item) => item.id === product.id);
  const cartQuantity = cartItem ? cartItem.cartQuantity : 0;

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      
      {/* Product Image */}
      <div className="w-full h-44 flex items-center justify-center overflow-hidden rounded-xl mb-3 bg-gray-50">
        <img
          src={image}
          alt={title}
          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 justify-between text-center">
        <div>
          <h3 
            style={{ color: "#0f172a" }} 
            className="font-extrabold text-base sm:text-lg leading-snug mb-2 line-clamp-2"
          >
            {title}
          </h3>
        </div>

        <div>
          {/* Price */}
          <div className="text-xl font-black text-green-700 mb-1">
            ₹{price}
          </div>

          {/* Real Stock Status (From Supabase Database) */}
          <div className="mb-3">
            {actualStock > 0 ? (
              <span className="inline-block bg-green-50 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">
                Only {actualStock} available
              </span>
            ) : (
              <span className="inline-block bg-red-50 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200">
                Out of Stock
              </span>
            )}
          </div>

          {/* Action Buttons */}
          {actualStock <= 0 ? (
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-red-100 text-red-600 cursor-not-allowed border border-red-200"
            >
              Out of Stock
            </button>
          ) : cartQuantity > 0 ? (
            <div className="flex items-center justify-between bg-green-50 border-2 border-green-600 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => updateQuantity(product.id, -1)}
                className="w-9 h-9 bg-white text-green-700 border border-green-300 rounded-lg font-black text-lg hover:bg-green-100 flex items-center justify-center transition active:scale-95 cursor-pointer"
                title="Decrease quantity"
              >
                −
              </button>

              <span className="font-black text-base text-green-900 px-2">
                {cartQuantity} in cart
              </span>

              <button
                onClick={() => updateQuantity(product.id, 1)}
                disabled={cartQuantity >= actualStock}
                className={`w-9 h-9 rounded-lg font-black text-lg flex items-center justify-center text-white transition active:scale-95 cursor-pointer ${
                  cartQuantity >= actualStock
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                title={cartQuantity >= actualStock ? "Max available stock reached" : "Increase quantity"}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Add to Cart
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProductCard;