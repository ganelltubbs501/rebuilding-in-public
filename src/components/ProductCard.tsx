import Link from "next/link";
import Image from "next/image";
import { formatPrice, type ProductWithImages } from "@/lib/products";

export default function ProductCard({ product }: { product: ProductWithImages }) {
  const image = product.images[0];
  return (
    <Link
      href={`/store/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-surface transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-blush">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-ink">{product.title}</h3>
        <p className="mt-2 font-bold text-mauve">
          {formatPrice(product.priceCents, product.currency)}
        </p>
      </div>
    </Link>
  );
}
