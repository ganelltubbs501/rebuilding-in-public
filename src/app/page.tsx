import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getAllPosts } from "@/lib/blog";
import { getPublishedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = getAllPosts().slice(0, 3);
  const products = (await getPublishedProducts()).slice(0, 4);

  return (
    <div>
      <section className="border-b border-border bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            The podcast
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">{siteConfig.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={siteConfig.links.apple}
              className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90"
            >
              Listen on Apple Podcasts
            </a>
            <a
              href={siteConfig.links.spotify}
              className="rounded-md border border-white/30 px-6 py-3 font-semibold text-white hover:border-white"
            >
              Listen on Spotify
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight">From the blog</h2>
          <Link href="/blog" className="text-sm font-semibold text-accent hover:underline">
            View all →
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="mt-6 text-muted">No posts yet — check back soon.</p>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug}>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <h3 className="mt-2 text-lg font-bold">
                  <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                    {post.frontmatter.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-muted">{post.frontmatter.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {products.length > 0 && (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight">From the store</h2>
              <Link href="/store" className="text-sm font-semibold text-accent hover:underline">
                Shop all →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
