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
    <div className="pt-40 pb-24 sm:pt-52">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <p className="label text-teal">Notes from the show</p>
        <h1 className="headline mt-4 text-[14vw] text-ink sm:text-[6vw]">Blog</h1>
        <p className="mt-6 max-w-2xl text-muted">
          Extended notes, guest follow-ups, and the stuff that didn&apos;t fit in the
          episode.
        </p>

        <div className="mt-16 space-y-12">
          {posts.length === 0 && (
            <p className="text-muted">No posts yet — check back soon.</p>
          )}
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-border pb-12">
              <p className="label text-mauve">
                {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                · {post.readingMinutes} min read
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">
                <Link href={`/blog/${post.slug}`} className="hover:text-pink">
                  {post.frontmatter.title}
                </Link>
              </h2>
              <p className="mt-3 text-muted">{post.frontmatter.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-5 inline-block text-sm font-semibold text-teal hover:underline"
              >
                Read the post →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
