import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Product } from "@/types/product";

export type CartItem = { product: Product; qty: number; size?: string };

const itemKey = (id: string, size?: string) => `${id}:${size || "default"}`;

type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number, size?: string) => void;
  remove: (id: string, size?: string) => void;
  setQty: (id: string, qty: number, size?: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "tandt_cart_v2";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = (p: Product, qty = 1, size?: string) =>
    setItems((cur) => {
      const key = itemKey(p.id, size);
      const ex = cur.find((i) => itemKey(i.product.id, i.size) === key);
      if (ex) return cur.map((i) => (itemKey(i.product.id, i.size) === key ? { ...i, qty: i.qty + qty } : i));
      return [...cur, { product: p, qty, size }];
    });
  const remove = (id: string, size?: string) =>
    setItems((cur) => cur.filter((i) => itemKey(i.product.id, i.size) !== itemKey(id, size)));
  const setQty = (id: string, qty: number, size?: string) =>
    setItems((cur) => cur.map((i) => (itemKey(i.product.id, i.size) === itemKey(id, size) ? { ...i, qty: Math.max(1, qty) } : i)));
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.product.price, 0);
    return { items, add, remove, setQty, clear, count, subtotal };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
};
