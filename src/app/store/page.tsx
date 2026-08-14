import type { Metadata } from "next";
import { getPublishedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Store",
  description: "Merch and picks from the Rebuilding in Public podcast.",
};

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const products = await getPublishedProducts();

  return (
    <div className="pt-40 pb-24 sm:pt-52">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <p className="label text-teal">Merch & picks</p>
        <h1 className="headline mt-4 text-[14vw] text-ink sm:text-[6vw]">Store</h1>
        <p className="mt-6 max-w-2xl text-muted">
          Merch, gear, and finds we like — hand-picked and edited to match the show.
        </p>

        {products.length === 0 ? (
          <p className="mt-16 text-muted">
            The store is empty right now — check back soon.
          </p>
        ) : (
          <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
