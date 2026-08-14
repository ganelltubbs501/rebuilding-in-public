import Link from "next/link";
import Image from "next/image";
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
      {/* Hero */}
      <section className="relative isolate min-h-[640px] overflow-hidden bg-ink pt-40 pb-24 text-on-ink sm:pt-52 sm:pb-32">
        {/* Photo — full-bleed on mobile, right-anchored column on larger screens.
            The photo's own backdrop is composited in the brand ink/teal palette,
            so it sits on the section background almost seamlessly. */}
        <div className="absolute inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[58%]">
          <Image
            src="/images/host/hero-portrait.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 640px) 58vw, 100vw"
            className="object-cover object-top"
          />
          {/* Mobile: light scrim so overlaid text keeps contrast against pale clothing */}
          <div className="absolute inset-0 bg-ink/35 sm:hidden" />
          {/* Desktop: soft fade at the seam between the section background and the photo */}
          <div className="hidden bg-gradient-to-r from-ink via-ink/25 via-15% to-transparent sm:absolute sm:inset-y-0 sm:left-0 sm:block sm:w-1/3" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
          <p className="label text-pink">The podcast</p>
          <h1 className="headline mt-6 text-[15vw] leading-[0.85] sm:text-[8.5vw]">
            Rebuilding
            <br />
            in Public
          </h1>
          <p className="accent-text mt-10 max-w-lg text-2xl text-blush sm:text-3xl">
            {siteConfig.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={siteConfig.links.apple} className="pill pill-accent">
              Listen on Apple Podcasts
            </a>
            <a
              href={siteConfig.links.spotify}
              className="pill border border-white/25 text-on-ink hover:bg-white/10"
            >
              Listen on Spotify
            </a>
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="bg-blush">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
          <p className="accent-text text-[9vw] leading-[1.05] text-ink sm:text-[4vw]">
            Real numbers, live decisions, and endings nobody has written yet.
          </p>
        </div>
      </section>

      {/* Blog preview */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="headline text-[10vw] text-ink sm:text-[4vw]">From the blog</h2>
            <Link href="/blog" className="pill pill-dark">
              View all →
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="mt-10 text-muted">No posts yet — check back soon.</p>
          ) : (
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              {posts.map((post) => (
                <article key={post.slug}>
                  <p className="label text-teal">
                    {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-ink">
                    <Link href={`/blog/${post.slug}`} className="hover:text-mauve">
                      {post.frontmatter.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted">{post.frontmatter.description}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Store preview */}
      {products.length > 0 && (
        <section className="bg-teal text-on-ink">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="headline text-[10vw] sm:text-[4vw]">From the store</h2>
              <Link href="/store" className="pill pill-accent">
                Shop all →
              </Link>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
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
