"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartCount, getCart, onCartChange } from "@/lib/cart-store";

export default function CartIndicator() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(cartCount(getCart()));
    update();
    return onCartChange(update);
  }, []);

  return (
    <Link
      href="/cart"
      className="relative text-white/80 transition hover:text-white"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      Cart
      {count > 0 && (
        <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-xs font-bold text-accent-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
