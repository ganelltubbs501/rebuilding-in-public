import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatPrice, getProductBySlug } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.published) notFound();

  const mainImage = product.images[0] ?? null;

  return (
    <div className="pt-40 pb-24 sm:pt-52">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-black/5 bg-blush">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  No image
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((img) => (
                  <div
                    key={img}
                    className="relative aspect-square overflow-hidden rounded-lg border border-black/5 bg-blush"
                  >
                    <Image src={img} alt={product.title} fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="label text-teal">Rebuilding in Public store</p>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {product.title}
            </h1>
            <p className="mt-3 text-2xl font-bold text-mauve">
              {formatPrice(product.priceCents, product.currency)}
            </p>

            <div className="mt-6">
              <AddToCartButton
                productId={product.id}
                slug={product.slug}
                title={product.title}
                priceCents={product.priceCents}
                image={mainImage}
              />
            </div>

            <div className="prose-podcast mt-8 whitespace-pre-line text-sm text-ink/80">
              {product.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
