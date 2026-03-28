import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@workspace/api-client-react';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, quantity = 1) => set((state) => {
        const existing = state.items.find(i => i.product.id === product.id);
        if (existing) {
          return {
            items: state.items.map(i => 
              i.product.id === product.id 
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
            isOpen: true
          };
        }
        return { items: [...state.items, { product, quantity }], isOpen: true };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i.product.id !== productId)
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: quantity <= 0 
          ? state.items.filter(i => i.product.id !== productId)
          : state.items.map(i => i.product.id === productId ? { ...i, quantity } : i)
      })),

      clearCart: () => set({ items: [] }),
      
      setIsOpen: (isOpen) => set({ isOpen }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (Number(item.product.price) * item.quantity), 0);
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    { 
      name: 'quickdz-cart',
      partialize: (state) => ({ items: state.items }) 
    }
  )
);
