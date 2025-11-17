import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { darkMode } = useTheme();

  const handleQuantityChange = (productId: number, change: number) => {
    const item = cart.items.find(i => i.product.productId === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto py-16">
          <div className={`text-center ${darkMode ? 'text-light' : 'text-gray-800'}`}>
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Add some items to get started!
            </p>
            <Link
              to="/products"
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg transition-colors inline-block"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 px-4 pb-16 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product.productId}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-md transition-colors duration-300`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-2 flex-shrink-0`}>
                    <img
                      src={`/${item.product.imgName}`}
                      alt={item.product.name}
                      className="w-24 h-24 object-contain"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          {item.product.name}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          ${item.unitPrice.toFixed(2)} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.productId)}
                        className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1`}>
                        <button
                          onClick={() => handleQuantityChange(item.product.productId, -1)}
                          className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          <span aria-hidden="true">-</span>
                        </button>
                        <span
                          className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center font-medium`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product.productId, 1)}
                          className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          <span aria-hidden="true">+</span>
                        </button>
                      </div>

                      <div className="text-right">
                        <p className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${item.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Right Column (Sticky) */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-md sticky top-24 transition-colors duration-300`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Subtotal ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
                  </span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    ${cart.subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Shipping</span>
                  <span className={`font-medium ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                    {cart.shipping === 0 ? 'FREE' : `$${cart.shipping.toFixed(2)}`}
                  </span>
                </div>

                {cart.subtotal > 0 && cart.subtotal <= 100 && (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} italic`}>
                    Add ${(100 - cart.subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}

                {cart.discount > 0 && (
                  <div className="flex justify-between">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Discount</span>
                    <span className="font-medium text-primary">
                      -${cart.discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                  <div className="flex justify-between items-baseline">
                    <span className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      Total
                    </span>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      ${cart.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-primary hover:bg-accent text-white py-3 rounded-lg font-medium transition-colors mb-4">
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className={`block text-center ${darkMode ? 'text-gray-400 hover:text-primary' : 'text-gray-600 hover:text-primary'} transition-colors`}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
