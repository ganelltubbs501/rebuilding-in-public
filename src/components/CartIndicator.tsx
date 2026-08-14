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
      className="flex items-center gap-1.5"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      Cart
      {count > 0 && (
        <span className="rounded-full bg-pink px-1.5 py-0.5 text-xs font-bold text-ink">
          {count}
        </span>
      )}
    </Link>
  );
}
