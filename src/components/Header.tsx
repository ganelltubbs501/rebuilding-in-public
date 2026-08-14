import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import CartIndicator from "@/components/CartIndicator";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-center justify-between gap-2 sm:contents">
        <Link href="/" className="pill pill-dark">
          Rebuilding<span className="text-pink">.</span>
        </Link>
        <div className="pill pill-dark sm:order-3">
          <CartIndicator />
        </div>
      </div>
      <nav className="flex flex-wrap items-center gap-2">
        {siteConfig.nav
          .filter((item) => item.href !== "/")
          .map((item) => (
            <Link key={item.href} href={item.href} className="pill pill-dark">
              {item.label}
            </Link>
          ))}
      </nav>
    </header>
  );
}
