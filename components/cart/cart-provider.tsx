"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl?: string;
  price?: number;
  priceLabel?: string;
  quantity: number;
  colorName?: string;
  sizeLabel?: string;
}

interface AddCartItemInput {
  productId: string;
  slug: string;
  name: string;
  imageUrl?: string;
  price?: number;
  priceLabel?: string;
  quantity: number;
  colorName?: string;
  sizeLabel?: string;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalCount: number;
  totalAmount: number;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CART_STORAGE_KEY = "consi-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as CartItem[];
      setItems(parsed);
    } catch (error) {
      console.error("Failed to hydrate cart", error);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(item: AddCartItemInput) {
    setItems((current) => {
      const existingIndex = current.findIndex(
        (entry) =>
          entry.productId === item.productId &&
          entry.colorName === item.colorName &&
          entry.sizeLabel === item.sizeLabel
      );

      if (existingIndex === -1) {
        return [
          ...current,
          {
            ...item,
            id: `${item.productId}-${item.colorName ?? "sin-color"}-${item.sizeLabel ?? "sin-talle"}`
          }
        ];
      }

      return current.map((entry, index) =>
        index === existingIndex
          ? {
              ...entry,
              quantity: entry.quantity + item.quantity
            }
          : entry
      );
    });

    setIsOpen(true);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }

  const value = useMemo<CartContextValue>(() => {
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce(
      (sum, item) => sum + (typeof item.price === "number" ? item.price * item.quantity : 0),
      0
    );

    return {
      items,
      isOpen,
      totalCount,
      totalAmount,
      addItem,
      removeItem,
      updateQuantity,
      openDrawer: () => setIsOpen(true),
      closeDrawer: () => setIsOpen(false)
    };
  }, [isOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
