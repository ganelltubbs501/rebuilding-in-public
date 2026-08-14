import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
        >
          Import product
        </Link>
      </div>

      <div className="mt-8 divide-y divide-border border-y border-border">
        {products.length === 0 && (
          <p className="py-6 text-muted">No products yet.</p>
        )}
        {products.map((product) => {
          let images: string[] = [];
          try {
            images = JSON.parse(product.images);
          } catch {}
          return (
            <div key={product.id} className="flex items-center gap-4 py-4">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-border bg-border">
                {images[0] && (
                  <Image src={images[0]} alt={product.title} fill className="object-cover" unoptimized />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{product.title}</p>
                <p className="text-xs text-muted">
                  {formatPrice(product.priceCents, product.currency)} ·{" "}
                  {product.sourceMarketplace} ·{" "}
                  {product.published ? "Published" : "Draft"}
                </p>
              </div>
              <Link
                href={`/admin/products/${product.id}`}
                className="text-sm font-semibold text-accent hover:underline"
              >
                Edit
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
