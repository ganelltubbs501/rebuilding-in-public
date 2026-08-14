"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ImportResult = {
  sourceUrl: string;
  marketplace: string;
  originalTitle: string | null;
  originalDescription: string | null;
  images: string[];
  priceCents: number | null;
  currency: string;
  title: string;
  description: string;
  warnings: string[];
  rewriteError: string | null;
};

const MARKETPLACES = ["TEMU", "SHEIN", "ALIEXPRESS", "ALIBABA", "MANUAL"] as const;

export default function NewProductPage() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const [sourceUrl, setSourceUrl] = useState("");
  const [marketplace, setMarketplace] = useState<(typeof MARKETPLACES)[number]>("MANUAL");
  const [originalTitle, setOriginalTitle] = useState<string | null>(null);
  const [originalDescription, setOriginalDescription] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceDollars, setPriceDollars] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [rewriting, setRewriting] = useState(false);
  const [rewriteError, setRewriteError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleImport() {
    if (!url) return;
    setImporting(true);
    setImportError(null);
    setWarnings([]);
    try {
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed.");
      const result = data as ImportResult;

      setSourceUrl(result.sourceUrl);
      setMarketplace(result.marketplace as (typeof MARKETPLACES)[number]);
      setOriginalTitle(result.originalTitle);
      setOriginalDescription(result.originalDescription);
      setTitle(result.title);
      setDescription(result.description);
      setImages(result.images);
      if (result.priceCents !== null) setPriceDollars((result.priceCents / 100).toFixed(2));
      setCurrency(result.currency);
      setWarnings(result.warnings);
      setRewriteError(result.rewriteError);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setImporting(false);
    }
  }

  async function handleRewrite() {
    if (!title || !description) {
      setRewriteError("Add a title and description first.");
      return;
    }
    setRewriting(true);
    setRewriteError(null);
    try {
      const res = await fetch("/api/admin/products/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, marketplace }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Rewrite failed.");
      setTitle(data.title);
      setDescription(data.description);
    } catch (err) {
      setRewriteError(err instanceof Error ? err.message : "Rewrite failed.");
    } finally {
      setRewriting(false);
    }
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setSaveError(null);
    try {
      const priceCents = Math.round(parseFloat(priceDollars || "0") * 100);
      if (!title || !description || !priceCents || images.length === 0) {
        throw new Error("Title, description, price, and at least one image are required.");
      }
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priceCents,
          currency,
          images,
          sourceUrl: sourceUrl || undefined,
          sourceMarketplace: marketplace,
          originalTitle: originalTitle || undefined,
          originalDescription: originalDescription || undefined,
          published: publish,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed.");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight">Import a product</h1>
      <p className="mt-2 text-sm text-muted">
        Paste a product link from Temu, SHEIN, AliExpress, or Alibaba. We&apos;ll try to
        pull the title, images, and price from the page and rewrite the copy to be
        SEO-friendly. These marketplaces don&apos;t offer a product API, so this is a
        best-effort read of the page&apos;s public preview data — some listings won&apos;t
        have everything, and you can always fill in or fix fields by hand below.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          type="url"
          placeholder="https://www.temu.com/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
        />
        <button
          onClick={handleImport}
          disabled={importing || !url}
          className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-50"
        >
          {importing ? "Fetching…" : "Import from URL"}
        </button>
      </div>
      {importError && <p className="mt-2 text-sm text-red-600">{importError}</p>}
      {warnings.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm text-amber-600">
          {warnings.map((w) => (
            <li key={w}>⚠ {w}</li>
          ))}
        </ul>
      )}

      <hr className="my-8 border-border" />

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold">Description</label>
            <button
              onClick={handleRewrite}
              disabled={rewriting}
              className="text-xs font-semibold text-accent hover:underline disabled:opacity-50"
            >
              {rewriting ? "Rewriting…" : "✨ Rewrite with AI"}
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          />
          {rewriteError && <p className="mt-1 text-sm text-red-600">{rewriteError}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Price (USD)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={priceDollars}
              onChange={(e) => setPriceDollars(e.target.value)}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Source marketplace</label>
            <select
              value={marketplace}
              onChange={(e) => setMarketplace(e.target.value as (typeof MARKETPLACES)[number])}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              {MARKETPLACES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold">Images</label>
          <div className="mt-2 grid grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={img + i} className="group relative aspect-square overflow-hidden rounded-md border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external CDN, admin-only thumbnail */}
                <img src={img} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 rounded bg-black/70 px-1.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="url"
              placeholder="Paste an image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
            />
            <button
              onClick={() => {
                if (!newImageUrl) return;
                setImages([...images, newImageUrl]);
                setNewImageUrl("");
              }}
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-surface"
            >
              Add
            </button>
          </div>
        </div>

        {(originalTitle || originalDescription) && (
          <details className="rounded-md border border-border p-4 text-sm">
            <summary className="cursor-pointer font-semibold text-muted">
              Original scraped copy (for reference)
            </summary>
            <p className="mt-2 font-semibold">{originalTitle}</p>
            <p className="mt-1 whitespace-pre-line text-muted">{originalDescription}</p>
          </details>
        )}

        {saveError && <p className="text-sm text-red-600">{saveError}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Publish product"}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="rounded-md border border-border px-6 py-3 font-semibold hover:bg-surface disabled:opacity-50"
          >
            Save as draft
          </button>
        </div>
      </div>
    </div>
  );
}
