import { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
}

export interface CartContextValue {
  cart: CartState;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}