import Link from "next/link";
import ClearCartOnLoad from "@/components/ClearCartOnLoad";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <ClearCartOnLoad />
      <h1 className="text-3xl font-extrabold tracking-tight">Thanks for your order 🎉</h1>
      <p className="mt-4 text-muted">
        Your payment went through. A receipt is on its way to your email from Stripe.
      </p>
      <Link
        href="/store"
        className="mt-8 inline-block rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90"
      >
        Keep browsing
      </Link>
    </div>
  );
}
