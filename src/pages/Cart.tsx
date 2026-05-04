import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatZAR } from "@/data/products";
import { Minus, Plus, X } from "lucide-react";

const Cart = () => {
  const { items, setQty, remove, subtotal } = useCart();

  return (
    <Layout>
      <section className="container-prose pt-36 pb-24">
        <p className="eyebrow">Your Bag</p>
        <h1 className="font-serif text-5xl md:text-6xl mt-4">Bag</h1>

        {items.length === 0 ? (
          <div className="mt-16 py-24 border-t border-b border-border text-center">
            <p className="font-serif text-2xl">Your bag is empty.</p>
            <p className="text-muted-foreground mt-2">A few quiet pieces are waiting.</p>
            <Button asChild variant="navy" size="lg" className="mt-8"><Link to="/shop">Visit the shop</Link></Button>
          </div>
        ) : (
          <div className="mt-12 grid lg:grid-cols-3 gap-12">
            <ul className="lg:col-span-2 divide-y divide-border border-y border-border">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="py-8 flex gap-6">
                  <Link to={`/shop/${product.slug}`} className="block w-28 md:w-36 flex-shrink-0">
                    <div className="aspect-[4/5] bg-muted overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-xl">{product.name}</h3>
                        <p className="text-sm italic text-muted-foreground mt-1">{product.tagline}</p>
                      </div>
                      <button onClick={() => remove(product.id)} aria-label="Remove" className="text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <div className="flex items-center border border-border">
                        <button onClick={() => setQty(product.id, qty - 1)} className="h-9 w-9 grid place-items-center hover:bg-secondary"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)} className="h-9 w-9 grid place-items-center hover:bg-secondary"><Plus className="h-3 w-3" /></button>
                      </div>
                      <p className="tabular-nums">{formatZAR(product.price * qty)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="lg:sticky lg:top-28 h-fit bg-secondary/60 p-8">
              <h3 className="font-serif text-2xl">Summary</h3>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{formatZAR(subtotal)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Confirmed at fulfilment</span></div>
              </div>
              <div className="border-t border-border my-6" />
              <div className="flex justify-between font-serif text-xl">
                <span>Total</span><span className="tabular-nums">{formatZAR(subtotal)}</span>
              </div>
              <Button asChild variant="navy" size="lg" className="w-full mt-8"><Link to="/checkout">Proceed to checkout</Link></Button>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Payments are processed securely via PaySharp.
              </p>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Cart;
