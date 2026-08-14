import Link from "next/link";
import ClearCartOnLoad from "@/components/ClearCartOnLoad";

export default function CheckoutSuccessPage() {
  return (
    <div className="pt-40 pb-24 text-center sm:pt-52">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <ClearCartOnLoad />
        <p className="label text-teal">Order confirmed</p>
        <h1 className="headline mt-4 text-[13vw] text-ink sm:text-[5vw]">Thanks!</h1>
        <p className="mt-4 text-muted">
          Your payment went through. A receipt is on its way to your email from Stripe.
        </p>
        <Link href="/store" className="pill pill-accent mt-8 inline-flex">
          Keep browsing
        </Link>
      </div>
    </div>
  );
}
