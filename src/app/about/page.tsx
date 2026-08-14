import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.description,
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-background pt-40 pb-20 sm:pt-52">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <p className="label text-teal">About the show</p>
          <h1 className="accent-text mt-6 text-[11vw] leading-[1.05] text-ink sm:text-[4.5vw]">
            Business, told before anyone knows how it ends.
          </h1>

          <div className="mt-16 grid gap-10 sm:grid-cols-[minmax(0,280px)_1fr_1fr]">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-black/5 bg-blush sm:row-span-2">
              <Image
                src="/images/host/portrait-closeup.jpg"
                alt="Host of Rebuilding in Public"
                fill
                sizes="(min-width: 640px) 280px, 60vw"
                className="object-cover"
              />
              {/* Warm brand-tinted wash so the photo reads as part of the site,
                  not a raw drop-in snapshot */}
              <div className="absolute inset-0 bg-mauve/10 mix-blend-multiply" />
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-ink/80 sm:text-base">
              <p>{siteConfig.description}</p>
              <p>
                Every episode we sit down with someone mid-rebuild — a founder pivoting a
                business, an operator turning around a struggling team, someone starting
                over after something didn&apos;t work.
              </p>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-ink/80 sm:text-base">
              <p>
                We ask what&apos;s true <em>this week</em>, not the polished version they&apos;ll
                tell later. That means numbers that aren&apos;t flattering yet, decisions
                that might be wrong, and plans that will probably change by the next
                episode.
              </p>
              <p>
                Want to come on the show, or have a rebuild story worth telling? Reach out
                through our social links in the footer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-on-ink sm:py-28">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-16 px-4 sm:flex-row sm:px-8">
          <h2 className="headline text-[20vw] leading-[0.85] text-mauve sm:text-[9vw]">
            Before
          </h2>
          <h2 className="headline text-[20vw] leading-[0.85] text-pink sm:text-[9vw] sm:self-end">
            After
          </h2>
        </div>
        <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-widest text-on-ink/50">
            <p>Every episode, in public</p>
            <span className="hidden h-px flex-1 max-w-xs bg-white/15 sm:block" />
            <p>New episodes weekly</p>
          </div>
        </div>
      </section>
    </div>
  );
}
