import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="bg-ink text-on-ink">
      <div className="mx-auto max-w-6xl px-4 pt-20 sm:px-8">
        <p className="label text-pink">Listen wherever you get podcasts</p>
        <h2 className="headline mt-4 text-[14vw] text-on-ink sm:text-[8vw]">
          Rebuilding<span className="text-pink">.</span>
        </h2>

        <div className="mt-12 grid gap-10 border-t border-white/10 py-10 sm:grid-cols-3">
          <div>
            <p className="max-w-xs text-sm text-on-ink/70">{siteConfig.tagline}</p>
          </div>
          <div>
            <p className="label text-on-ink/50">Listen</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={siteConfig.links.apple} className="transition hover:text-pink">
                  Apple Podcasts
                </a>
              </li>
              <li>
                <a href={siteConfig.links.spotify} className="transition hover:text-pink">
                  Spotify
                </a>
              </li>
              <li>
                <a href={siteConfig.links.youtube} className="transition hover:text-pink">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="label text-on-ink/50">Site</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/blog" className="transition hover:text-pink">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/store" className="transition hover:text-pink">
                  Store
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-pink">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-on-ink/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Rebuilding in public, one episode at a time.</p>
        </div>
      </div>
    </footer>
  );
}
