import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import CartIndicator from "@/components/CartIndicator";

export default function Header() {
  return (
    <header className="border-b border-border bg-ink text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold tracking-tight">
            Rebuilding<span className="text-accent">.</span>
          </span>
          <span className="hidden text-xs uppercase tracking-widest text-white/50 sm:inline">
            in public
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          {siteConfig.nav
            .filter((item) => item.href !== "/")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/80 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          <CartIndicator />
        </nav>
      </div>
    </header>
  );
}
