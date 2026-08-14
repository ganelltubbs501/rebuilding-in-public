import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.description,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        About {siteConfig.name}
      </h1>
      <div className="prose-podcast mt-8">
        <p>{siteConfig.description}</p>
        <p>
          Every episode we talk to someone mid-rebuild — a founder, an operator, someone
          starting over — about what&apos;s actually true this week, not the polished
          version they&apos;ll tell later.
        </p>
        <p>
          Want to come on the show, or have a rebuild story worth telling? Reach out
          through our social links in the footer.
        </p>
      </div>
    </div>
  );
}
