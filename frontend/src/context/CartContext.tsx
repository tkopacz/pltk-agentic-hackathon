import { createContext } from 'react';
import { CartContextValue } from './cartTypes';

export const CartContext = createContext<CartContextValue | undefined>(undefined);