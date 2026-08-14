import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin-auth";
import { slugify } from "@/lib/products";

const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  priceCents: z.number().int().positive(),
  currency: z.string().default("usd"),
  images: z.array(z.string().url()).min(1),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  sourceMarketplace: z.enum(["TEMU", "SHEIN", "ALIEXPRESS", "ALIBABA", "MANUAL"]).default("MANUAL"),
  originalTitle: z.string().optional().or(z.literal("")),
  originalDescription: z.string().optional().or(z.literal("")),
  published: z.boolean().default(true),
});

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product data." }, { status: 400 });
  }
  const data = parsed.data;

  let slug = slugify(data.title);
  let suffix = 0;
  while (await prisma.product.findUnique({ where: { slug: suffix ? `${slug}-${suffix}` : slug } })) {
    suffix += 1;
  }
  if (suffix) slug = `${slug}-${suffix}`;

  const product = await prisma.product.create({
    data: {
      slug,
      title: data.title,
      description: data.description,
      priceCents: data.priceCents,
      currency: data.currency,
      images: JSON.stringify(data.images),
      sourceUrl: data.sourceUrl || null,
      sourceMarketplace: data.sourceMarketplace,
      originalTitle: data.originalTitle || null,
      originalDescription: data.originalDescription || null,
      published: data.published,
    },
  });

  return NextResponse.json({ id: product.id, slug: product.slug });
}
