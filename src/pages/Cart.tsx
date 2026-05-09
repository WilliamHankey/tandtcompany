import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatZAR } from "@/data/products";
import { Minus, Plus, X, ShieldCheck } from "lucide-react";

const Cart = () => {
  const { items, setQty, remove, subtotal } = useCart();

  return (
    <Layout>
      <section className="container-prose pt-32 pb-24">
        {items.length === 0 ? (
          <div className="py-24 border-t border-b border-border text-center">
            <h1 className="font-serif text-4xl text-navy">Your bag is empty.</h1>
            <p className="text-muted-foreground mt-3">A few quiet pieces are waiting.</p>
            <Button asChild variant="navy" size="lg" className="mt-8"><Link to="/shop">Visit the shop</Link></Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="border-l-2 border-gold pl-6 mb-10">
                <h1 className="font-serif text-4xl md:text-5xl text-navy">Review Your Selection</h1>
              </div>
              <ul className="divide-y divide-border border-y border-border">
                {items.map(({ product, qty }) => (
                  <li key={product.id} className="py-8 flex items-center gap-6">
                    <Link to={`/shop/${product.slug}`} className="block w-24 h-24 bg-muted overflow-hidden flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-xl text-navy leading-tight">{product.name}</h3>
                      <p className="mt-1 text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
                        {product.tagline}
                      </p>
                    </div>
                    <div className="flex items-center border border-border">
                      <button onClick={() => setQty(product.id, qty - 1)} className="h-9 w-9 grid place-items-center hover:bg-secondary"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm tabular-nums">{qty}</span>
                      <button onClick={() => setQty(product.id, qty + 1)} className="h-9 w-9 grid place-items-center hover:bg-secondary"><Plus className="h-3 w-3" /></button>
                    </div>
                    <p className="font-serif text-lg text-gold tabular-nums w-28 text-right">{formatZAR(product.price * qty)}</p>
                    <button onClick={() => remove(product.id)} aria-label="Remove" className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="space-y-8">
              <div className="bg-cream border border-border p-8 shadow-elegant">
                <p className="eyebrow !text-gold">Order Summary</p>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{formatZAR(subtotal)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Tax</span><span className="tabular-nums">{formatZAR(0)}</span></div>
                </div>
                <div className="border-t border-border my-6" />
                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-2xl text-navy">Total</span>
                  <span className="font-serif text-2xl text-gold tabular-nums">{formatZAR(subtotal)}</span>
                </div>
                <Button asChild variant="gold" size="lg" className="w-full mt-8"><Link to="/checkout">Proceed to Checkout</Link></Button>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Safe and secure checkout via encrypted gateway.
                </p>
              </div>

              <div className="border-l-2 border-gold pl-6">
                <p className="eyebrow !text-gold flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Our Commitment</p>
                <p className="mt-4 text-sm text-foreground/80 leading-relaxed">
                  Each T AND T creation is more than an object; it is a testament to purposeful design. We believe in crafting pieces that honor your faith and reflect a commitment to excellence.
                </p>
                <p className="mt-4 text-sm italic text-muted-foreground">"Rooted in faith, crafted for purpose."</p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Cart;
