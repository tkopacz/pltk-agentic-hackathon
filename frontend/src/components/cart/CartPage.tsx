import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useTheme } from '../../context/ThemeContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { darkMode } = useTheme();
  const isEmpty = cart.items.length === 0;

  const handleAdjustQuantity = (productId: number, delta: number) => {
    const item = cart.items.find(cartItem => cartItem.product.productId === productId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    updateQuantity(productId, newQuantity);
  };

  const shippingMessage = cart.subtotal >= 100 || cart.subtotal === 0
    ? 'You have qualified for free shipping!'
    : `Add $${(100 - cart.subtotal).toFixed(2)} more to unlock free shipping.`;

  return (
    <div className={`min-h-screen pt-24 pb-16 px-4 transition-colors duration-300 ${darkMode ? 'bg-dark' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-900'} transition-colors duration-300`}>
            Your Cart
          </h1>
          {!isEmpty && (
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-400 font-medium transition-colors duration-300"
            >
              Clear Cart
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className={`rounded-2xl p-12 text-center shadow-xl ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} transition-colors duration-300`}>
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="h-10 w-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13l-1.35 3.375A1 1 0 0 0 6.6 18h10.8m-8.4 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m8.4 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
              </svg>
            </div>
            <p className="text-lg font-medium mb-4">Your cart is empty right now.</p>
            <Link
              to="/products"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-white font-semibold shadow-lg hover:bg-accent transition-colors duration-300"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item, index) => {
                const { product } = item;
                const fullPrice = product.price.toFixed(2);
                const finalPrice = item.unitPrice.toFixed(2);
                const showDiscount = Number(fullPrice) !== Number(finalPrice);

                return (
                  <div
                    key={product.productId}
                    className={`flex flex-col md:flex-row gap-6 rounded-2xl p-6 shadow-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <div className="relative flex-shrink-0 self-center md:self-start">
                      <span className="absolute -top-3 -left-3 text-sm font-semibold text-gray-400">{index + 1}</span>
                      <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl p-4 w-36 h-36 flex items-center justify-center`}>
                        <img
                          src={`/${product.imgName}`}
                          alt={product.name}
                          className="max-h-28 w-auto object-contain"
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-900'}`}>{product.name}</h2>
                          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{product.description}</p>
                          <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} text-xs mt-2`}>SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm uppercase tracking-wide text-gray-400">Unit Price</p>
                          <div className="text-lg font-semibold text-primary">${finalPrice}</div>
                          {showDiscount && (
                            <div className="text-xs text-gray-500 line-through">${fullPrice}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center rounded-full px-2 py-1 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                            <button
                              onClick={() => handleAdjustQuantity(product.productId, -1)}
                              className="h-8 w-8 flex items-center justify-center text-xl text-gray-500 hover:text-primary transition-colors"
                              aria-label={`Decrease quantity of ${product.name}`}
                            >
                              −
                            </button>
                            <span className={`mx-4 min-w-[2rem] text-center font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleAdjustQuantity(product.productId, 1)}
                              className="h-8 w-8 flex items-center justify-center text-xl text-gray-500 hover:text-primary transition-colors"
                              aria-label={`Increase quantity of ${product.name}`}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(product.productId)}
                            className="flex items-center space-x-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12m-9 4v6m6-6v6M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12" />
                            </svg>
                            <span>Remove</span>
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm uppercase tracking-wide text-gray-400">Total</p>
                          <div className={`${darkMode ? 'text-light' : 'text-gray-900'} text-xl font-bold`}>
                            ${(item.total).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} transition-colors duration-300`}>
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Subtotal</dt>
                  <dd className="font-semibold">${cart.subtotal.toFixed(2)}</dd>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <dt>Savings</dt>
                    <dd>−${cart.discount.toFixed(2)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Shipping</dt>
                  <dd className="font-semibold">{cart.shipping === 0 ? 'Free' : `$${cart.shipping.toFixed(2)}`}</dd>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between text-lg font-bold">
                  <dt>Total</dt>
                  <dd>${cart.grandTotal.toFixed(2)}</dd>
                </div>
              </dl>

              <p className={`mt-4 text-sm font-medium ${cart.subtotal >= 100 || cart.subtotal === 0 ? 'text-green-500' : 'text-orange-500'}`}>
                {shippingMessage}
              </p>

              <button
                className="mt-6 w-full rounded-full bg-primary py-3 text-white font-semibold hover:bg-accent transition-colors duration-300 shadow-md"
              >
                Proceed to Checkout
              </button>

              <div className="mt-6 text-center">
                <Link
                  to="/products"
                  className={`${darkMode ? 'text-primary/80 hover:text-primary' : 'text-primary hover:text-accent'} text-sm font-medium transition-colors`}
                >
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}