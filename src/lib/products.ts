import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";

export type ProductWithImages = Omit<Product, "images"> & { images: string[] };

function withImages(product: Product): ProductWithImages {
  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {
    images = [];
  }
  return { ...product, images };
}

export async function getPublishedProducts(): Promise<ProductWithImages[]> {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(withImages);
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  const product = await prisma.product.findUnique({ where: { slug } });
  return product ? withImages(product) : null;
}

export async function getProductById(id: string): Promise<ProductWithImages | null> {
  const product = await prisma.product.findUnique({ where: { id } });
  return product ? withImages(product) : null;
}

export function formatPrice(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}
