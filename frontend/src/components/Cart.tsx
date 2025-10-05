import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

type TabType = 'items' | 'shipping';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('items');
  const [promoCode, setPromoCode] = useState('');

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyPromo = () => {
    // Placeholder for promo code functionality
    alert('Promo code functionality coming soon!');
  };

  const shippingThreshold = 100;
  const remainingForFreeShipping = shippingThreshold - cart.subtotal;

  // Empty cart state
  if (cart.items.length === 0) {
    return (
      <div className={`min-h-screen pt-20 pb-32 ${darkMode ? 'bg-dark' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className={`${darkMode ? 'bg-gray-800 text-light' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-12 text-center`}>
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary hover:bg-accent text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 pb-32 ${darkMode ? 'bg-dark' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
          Shopping Cart
        </h1>

        {/* Tabbed Interface */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
          {/* Tab Headers */}
          <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setActiveTab('items')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab('items');
                }
              }}
              className={`flex-1 px-6 py-4 text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset ${
                activeTab === 'items'
                  ? `${darkMode ? 'bg-gray-700 text-primary border-b-2 border-primary' : 'bg-gray-50 text-primary border-b-2 border-primary'}`
                  : `${darkMode ? 'text-gray-400 hover:text-light' : 'text-gray-600 hover:text-gray-800'}`
              }`}
              role="tab"
              aria-selected={activeTab === 'items'}
              aria-controls="items-panel"
            >
              Items ({cart.itemCount})
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab('shipping');
                }
              }}
              className={`flex-1 px-6 py-4 text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset ${
                activeTab === 'shipping'
                  ? `${darkMode ? 'bg-gray-700 text-primary border-b-2 border-primary' : 'bg-gray-50 text-primary border-b-2 border-primary'}`
                  : `${darkMode ? 'text-gray-400 hover:text-light' : 'text-gray-600 hover:text-gray-800'}`
              }`}
              role="tab"
              aria-selected={activeTab === 'shipping'}
              aria-controls="shipping-panel"
            >
              Shipping & Notes
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Items Tab */}
            {activeTab === 'items' && (
              <div id="items-panel" role="tabpanel" aria-labelledby="items-tab">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.product.productId}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <img
                        src={`/${item.product.imgName}`}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          {item.product.name}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          ${item.unitPrice.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.product.productId, item.quantity - 1)}
                          className={`px-3 py-1 rounded ${
                            darkMode
                              ? 'bg-gray-600 hover:bg-gray-500 text-light'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                          }`}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product.productId, parseInt(e.target.value) || 0)}
                          className={`w-16 text-center px-2 py-1 rounded ${
                            darkMode
                              ? 'bg-gray-600 text-light border-gray-500'
                              : 'bg-white text-gray-800 border-gray-300'
                          } border`}
                          min="0"
                          aria-label={`Quantity for ${item.product.name}`}
                        />
                        <button
                          onClick={() => handleQuantityChange(item.product.productId, item.quantity + 1)}
                          className={`px-3 py-1 rounded ${
                            darkMode
                              ? 'bg-gray-600 hover:bg-gray-500 text-light'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                          }`}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <div className="w-24 text-right">
                        <p className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          ${item.total.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.productId)}
                        className="text-red-500 hover:text-red-700 p-2"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping & Notes Tab */}
            {activeTab === 'shipping' && (
              <div id="shipping-panel" role="tabpanel" aria-labelledby="shipping-tab">
                <div className="space-y-6">
                  {/* Free Shipping Threshold */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <h3 className={`font-semibold mb-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      Shipping Information
                    </h3>
                    {cart.subtotal >= shippingThreshold ? (
                      <p className={`${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        🎉 Congratulations! You qualify for free shipping!
                      </p>
                    ) : (
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Add ${remainingForFreeShipping.toFixed(2)} more to qualify for free shipping!
                        <br />
                        <span className="text-sm">
                          (Free shipping on orders over ${shippingThreshold.toFixed(2)})
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Promo Code */}
                  <div>
                    <h3 className={`font-semibold mb-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      Promo Code
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className={`flex-1 px-4 py-2 rounded border ${
                          darkMode
                            ? 'bg-gray-700 text-light border-gray-600'
                            : 'bg-white text-gray-800 border-gray-300'
                        }`}
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="bg-primary hover:bg-accent text-white px-6 py-2 rounded transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Shipping Message */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold mb-2 ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                      Delivery Information
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Standard shipping takes 3-5 business days. Express shipping available at checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Footer Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} z-40`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Totals */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between md:gap-8">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Subtotal:
                </span>
                <span className={`text-sm ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  ${cart.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between md:gap-8">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Discount (5%):
                </span>
                <span className={`text-sm ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  -${cart.discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between md:gap-8">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Shipping:
                </span>
                <span className={`text-sm ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  {cart.shipping === 0 ? 'FREE' : `$${cart.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between md:gap-8 pt-2 border-t border-gray-300">
                <span className={`font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                  Total:
                </span>
                <span className={`font-bold text-primary`}>
                  ${cart.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link
                to="/products"
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-light'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Continue Shopping
              </Link>
              <button
                className="bg-primary hover:bg-accent text-white px-8 py-3 rounded-md font-medium transition-colors"
                onClick={() => alert('Checkout functionality coming soon!')}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
