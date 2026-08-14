import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold tracking-tight">
              Rebuilding<span className="text-accent">.</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted">{siteConfig.tagline}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">
              Listen
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={siteConfig.links.apple} className="hover:text-accent">
                  Apple Podcasts
                </a>
              </li>
              <li>
                <a href={siteConfig.links.spotify} className="hover:text-accent">
                  Spotify
                </a>
              </li>
              <li>
                <a href={siteConfig.links.youtube} className="hover:text-accent">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">
              Site
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/blog" className="hover:text-accent">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-accent">
                  Store
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
