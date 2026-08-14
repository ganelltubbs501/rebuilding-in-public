import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditProductForm from "@/components/admin/EditProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {}

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight">Edit product</h1>
      <EditProductForm
        id={product.id}
        title={product.title}
        description={product.description}
        priceCents={product.priceCents}
        currency={product.currency}
        images={images}
        published={product.published}
        sourceUrl={product.sourceUrl}
        sourceMarketplace={product.sourceMarketplace}
      />
    </div>
  );
}
