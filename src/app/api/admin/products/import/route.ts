import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { scrapeProductPage } from "@/lib/scrape";
import { rewriteProductCopy } from "@/lib/ai-rewrite";

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await request.json().catch(() => ({ url: "" }));
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "A product URL is required." }, { status: 400 });
  }
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
  }

  let scraped;
  try {
    scraped = await scrapeProductPage(url);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch that page." },
      { status: 502 }
    );
  }

  let rewritten: { title: string; description: string } | null = null;
  let rewriteError: string | null = null;
  if (scraped.title && scraped.description) {
    try {
      rewritten = await rewriteProductCopy({
        title: scraped.title,
        description: scraped.description,
        marketplace: scraped.marketplace,
      });
    } catch (err) {
      rewriteError =
        err instanceof Error ? err.message : "AI rewrite failed — using the original copy.";
    }
  } else {
    rewriteError = "Not enough scraped text to rewrite yet — fill in the fields and use “Rewrite with AI” below.";
  }

  return NextResponse.json({
    sourceUrl: url,
    marketplace: scraped.marketplace,
    originalTitle: scraped.title,
    originalDescription: scraped.description,
    images: scraped.images,
    priceCents: scraped.priceCents,
    currency: scraped.currency,
    title: rewritten?.title ?? scraped.title ?? "",
    description: rewritten?.description ?? scraped.description ?? "",
    warnings: scraped.warnings,
    rewriteError,
  });
}
