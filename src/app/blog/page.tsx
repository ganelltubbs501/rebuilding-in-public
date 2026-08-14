import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes, transcripts, and follow-ups from the Rebuilding in Public podcast.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Blog</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Extended notes, guest follow-ups, and the stuff that didn&apos;t fit in the
        episode.
      </p>

      <div className="mt-12 space-y-10">
        {posts.length === 0 && (
          <p className="text-muted">No posts yet — check back soon.</p>
        )}
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-border pb-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              · {post.readingMinutes} min read
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                {post.frontmatter.title}
              </Link>
            </h2>
            <p className="mt-2 text-muted">{post.frontmatter.description}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
            >
              Read the post →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
