"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProductForm({
  id,
  title: initialTitle,
  description: initialDescription,
  priceCents: initialPriceCents,
  currency,
  images: initialImages,
  published: initialPublished,
  sourceUrl,
  sourceMarketplace,
}: {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  currency: string;
  images: string[];
  published: boolean;
  sourceUrl: string | null;
  sourceMarketplace: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priceDollars, setPriceDollars] = useState((initialPriceCents / 100).toFixed(2));
  const [images, setImages] = useState(initialImages);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [published, setPublished] = useState(initialPublished);
  const [saving, setSaving] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRewrite() {
    setRewriting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, marketplace: sourceMarketplace }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Rewrite failed.");
      setTitle(data.title);
      setDescription(data.description);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rewrite failed.");
    } finally {
      setRewriting(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const priceCents = Math.round(parseFloat(priceDollars || "0") * 100);
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priceCents, images, published }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed.");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this product? This can't be undone.")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  }

  return (
    <div className="mt-6 space-y-5">
      {sourceUrl && (
        <p className="text-xs text-muted">
          Imported from{" "}
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
            {sourceMarketplace}
          </a>
        </p>
      )}

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
      </div>

      <div>
        <label className="block text-sm font-semibold">Price ({currency.toUpperCase()})</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={priceDollars}
          onChange={(e) => setPriceDollars(e.target.value)}
          className="mt-1 w-full max-w-xs rounded-md border border-border px-3 py-2 text-sm"
        />
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

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Published
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          onClick={handleDelete}
          className="rounded-md border border-red-300 px-6 py-3 font-semibold text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
