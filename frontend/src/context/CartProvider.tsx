import { ReactNode, useEffect, useReducer } from 'react';
import { CartContext } from './CartContext';
import { CartContextValue, CartItem, CartState } from './cartTypes';
import { Product, getDisplayPrice } from '../types/product';

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_SHIPPING_RATE = 25;

const initialState: CartState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  shipping: 0,
  grandTotal: 0,
};

const calculateTotals = (items: CartItem[]): Omit<CartState, 'items'> => {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.total, 0);
  const discount = items.reduce(
    (total, item) => total + Math.max(0, item.product.price - item.unitPrice) * item.quantity,
    0
  );
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
  const grandTotal = subtotal - discount + shipping;

  return {
    itemCount,
    subtotal,
    discount,
    shipping,
    grandTotal,
  };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.productId === product.productId
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                total: (item.quantity + quantity) * item.unitPrice,
              }
            : item
        );
      } else {
        const unitPrice = getDisplayPrice(product);
        newItems = [
          ...state.items,
          {
            product,
            quantity,
            unitPrice,
            total: quantity * unitPrice,
          },
        ];
      }

      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(
        item => item.product.productId !== action.payload.productId
      );
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { productId } });
      }

      const newItems = state.items.map(item =>
        item.product.productId === productId
          ? {
              ...item,
              quantity,
              total: quantity * item.unitPrice,
            }
          : item
      );

      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'LOAD_CART':
      return {
        ...action.payload,
        ...calculateTotals(action.payload.items),
      };

    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem('octocat-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartState;
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('octocat-cart', JSON.stringify(cart));
  }, [cart]);

  const contextValue: CartContextValue = {
    cart,
    addToCart: (product, quantity) => {
      dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    },
    removeFromCart: productId => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
    },
    updateQuantity: (productId, quantity) => {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    },
    clearCart: () => {
      dispatch({ type: 'CLEAR_CART' });
    },
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

