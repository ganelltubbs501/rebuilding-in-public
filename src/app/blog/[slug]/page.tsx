import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="pt-40 pb-24 sm:pt-52">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="label text-mauve">
          {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {post.readingMinutes} min read
        </p>
        <h1 className="headline mt-4 text-[11vw] leading-[0.9] text-ink sm:text-[4.5vw]">
          {post.frontmatter.title}
        </h1>
        {post.frontmatter.author && (
          <p className="mt-4 text-sm text-muted">By {post.frontmatter.author}</p>
        )}

        <div className="prose-podcast mt-12">
          <MDXRemote source={post.content} />
        </div>
      </div>
    </article>
  );
}
