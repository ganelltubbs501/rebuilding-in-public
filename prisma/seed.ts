import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      slug: "rebuilding-in-public-mug",
      title: "Rebuilding in Public Ceramic Mug",
      description:
        "Start the rebuild with coffee. A sturdy 11oz ceramic mug with the show's wordmark, dishwasher and microwave safe.",
      priceCents: 1800,
      currency: "usd",
      images: JSON.stringify([
        "https://picsum.photos/seed/rip-mug/800/800",
        "https://picsum.photos/seed/rip-mug-2/800/800",
      ]),
      sourceMarketplace: "MANUAL" as const,
      published: true,
    },
    {
      slug: "rebuilding-in-public-tee",
      title: "Rebuilding in Public T-Shirt",
      description:
        "Soft, mid-weight cotton tee with a minimal front print. Unisex fit, true to size.",
      priceCents: 2800,
      currency: "usd",
      images: JSON.stringify(["https://picsum.photos/seed/rip-tee/800/800"]),
      sourceMarketplace: "MANUAL" as const,
      published: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
