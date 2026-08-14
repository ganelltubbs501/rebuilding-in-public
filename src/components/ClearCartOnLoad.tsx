"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart-store";

export default function ClearCartOnLoad() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
