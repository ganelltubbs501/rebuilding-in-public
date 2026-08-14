"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart-store";

export default function AddToCartButton({
  productId,
  slug,
  title,
  priceCents,
  image,
}: {
  productId: string;
  slug: string;
  title: string;
  priceCents: number;
  image: string | null;
}) {
  const router = useRouter();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addToCart({ productId, slug, title, priceCents, image });
        setAdded(true);
        router.refresh();
        setTimeout(() => setAdded(false), 1500);
      }}
      className="w-full rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:opacity-90"
    >
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
