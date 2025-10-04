import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { CartContextValue } from '../context/cartTypes';

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}