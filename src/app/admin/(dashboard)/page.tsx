import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [productCount, publishedCount, orderCount] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { published: true } }),
    prisma.order.count({ where: { status: "paid" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-6">
          <p className="text-sm text-muted">Products</p>
          <p className="mt-1 text-3xl font-bold">{productCount}</p>
        </div>
        <div className="rounded-lg border border-border p-6">
          <p className="text-sm text-muted">Published</p>
          <p className="mt-1 text-3xl font-bold">{publishedCount}</p>
        </div>
        <div className="rounded-lg border border-border p-6">
          <p className="text-sm text-muted">Paid orders</p>
          <p className="mt-1 text-3xl font-bold">{orderCount}</p>
        </div>
      </div>
      <Link
        href="/admin/products/new"
        className="mt-8 inline-block rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:opacity-90"
      >
        Import a new product
      </Link>
    </div>
  );
}
