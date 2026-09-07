import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Product } from "@/types/product";

export type CartItem = { product: Product; qty: number; size?: string; color?: string };

const itemKey = (id: string, color?: string, size?: string) => `${id}:${color || "default"}:${size || "default"}`;

type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number, size?: string, color?: string) => void;
  remove: (id: string, size?: string, color?: string) => void;
  setQty: (id: string, qty: number, size?: string, color?: string) => void;
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

  const add = (p: Product, qty = 1, size?: string, color?: string) =>
    setItems((cur) => {
      const key = itemKey(p.id, color, size);
      const ex = cur.find((i) => itemKey(i.product.id, i.color, i.size) === key);
      if (ex) return cur.map((i) => (itemKey(i.product.id, i.color, i.size) === key ? { ...i, qty: i.qty + qty } : i));
      return [...cur, { product: p, qty, size, color }];
    });
  const remove = (id: string, size?: string, color?: string) =>
    setItems((cur) => cur.filter((i) => itemKey(i.product.id, i.color, i.size) !== itemKey(id, color, size)));
  const setQty = (id: string, qty: number, size?: string, color?: string) =>
    setItems((cur) => cur.map((i) => (itemKey(i.product.id, i.color, i.size) === itemKey(id, color, size) ? { ...i, qty: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);

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
