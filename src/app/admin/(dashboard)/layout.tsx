import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-28">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/admin" className="font-bold text-ink">
              Admin
            </Link>
            <Link href="/admin/products" className="text-muted hover:text-ink">
              Products
            </Link>
            <Link href="/admin/products/new" className="text-muted hover:text-ink">
              Import product
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}
