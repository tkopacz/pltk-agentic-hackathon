import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { api } from '../api/config';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { darkMode } = useTheme();

  if (cart.items.length === 0) {
    return (
      <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className={`text-center py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md transition-colors duration-300`}>
            <svg
              className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-300`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className={`mt-4 text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
              Your cart is empty
            </h2>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
              Start shopping to add items to your cart
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingMessage = cart.subtotal >= 100 
    ? "Free shipping!" 
    : `Add $${(100 - cart.subtotal).toFixed(2)} more for free shipping`;

  return (
    <div className={`min-h-screen pt-20 ${darkMode ? 'bg-dark' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
          Shopping Cart
        </h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product.productId}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 transition-colors duration-300`}
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32">
                    <img
                      src={`${api.baseURL}/images/${item.product.imgName}`}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                          {item.product.name}
                        </h3>
                        {item.product.discount && (
                          <span className="inline-block bg-accent text-white text-xs px-2 py-1 rounded mt-1">
                            {Math.round(item.product.discount * 100)}% OFF
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.productId)}
                        className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'} transition-colors`}
                        aria-label="Remove item"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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

                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                      SKU: {item.product.sku}
                    </p>

                    <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                      {/* Quantity Stepper */}
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                          Quantity:
                        </span>
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.product.productId, item.quantity - 1)}
                            className={`px-3 py-1 ${darkMode ? 'hover:bg-gray-700 text-light' : 'hover:bg-gray-100 text-gray-800'} transition-colors`}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className={`px-4 py-1 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                            className={`px-3 py-1 ${darkMode ? 'hover:bg-gray-700 text-light' : 'hover:bg-gray-100 text-gray-800'} transition-colors`}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className={`text-lg font-bold ${darkMode ? 'text-primary' : 'text-primary'}`}>
                          ${item.total.toFixed(2)}
                        </div>
                        {item.product.discount && (
                          <div className={`text-sm line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            ${(item.quantity * item.product.price).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Desktop: Floating, Mobile: Sticky Bottom */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 lg:sticky lg:top-24 transition-colors duration-300`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                  <span>Subtotal ({cart.itemCount} items)</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${cart.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                  <span>Shipping</span>
                  <span>{cart.shipping === 0 ? 'FREE' : `$${cart.shipping.toFixed(2)}`}</span>
                </div>

                {/* Shipping Message */}
                <div className={`text-sm ${cart.subtotal >= 100 ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                  {shippingMessage}
                </div>

                <div className={`pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className={`flex justify-between text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    <span>Total</span>
                    <span className="text-primary">${cart.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-primary hover:bg-accent text-white py-3 rounded-md font-medium transition-colors">
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className={`block text-center mt-4 ${darkMode ? 'text-primary hover:text-accent' : 'text-primary hover:text-accent'} font-medium transition-colors`}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Sheet for Order Summary */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg px-4 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
                  Total ({cart.itemCount} items)
                </div>
                <div className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                  ${cart.grandTotal.toFixed(2)}
                </div>
              </div>
              <button className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-md font-medium transition-colors">
                Checkout
              </button>
            </div>
            <div className={`text-xs text-center ${cart.subtotal >= 100 ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-300`}>
              {shippingMessage}
            </div>
          </div>
        </div>

        {/* Add padding at bottom on mobile to prevent content from being hidden by bottom sheet */}
        <div className="lg:hidden h-32"></div>
      </div>
    </div>
  );
}
