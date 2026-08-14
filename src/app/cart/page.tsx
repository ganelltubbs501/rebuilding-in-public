"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  cartTotalCents,
  getCart,
  onCartChange,
  removeFromCart,
  updateQuantity,
  type CartItem,
} from "@/lib/cart-store";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setItems(getCart());
    update();
    return onCartChange(update);
  }, []);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div className="pt-40 pb-24 sm:pt-52">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="headline text-[13vw] text-ink sm:text-[5vw]">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-10">
            <p className="text-muted">Your cart is empty.</p>
            <Link href="/store" className="mt-4 inline-block text-teal hover:underline">
              Browse the store →
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 divide-y divide-border border-y border-border">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 py-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-black/5 bg-blush">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/store/${item.slug}`}
                      className="line-clamp-1 text-sm font-semibold text-ink hover:text-mauve"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {formatPrice(item.priceCents)}
                    </p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, Number(e.target.value) || 1)
                    }
                    className="w-16 rounded-md border border-border px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-sm text-muted hover:text-mauve"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-lg font-semibold text-ink">Total</span>
              <span className="text-lg font-bold text-mauve">
                {formatPrice(cartTotalCents(items))}
              </span>
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <button
              onClick={checkout}
              disabled={loading}
              className="mt-6 w-full rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Redirecting to checkout…" : "Checkout"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
