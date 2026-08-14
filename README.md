# Rebuilding in Public

Website for the *Rebuilding in Public* podcast — blog, merch store, and an
AI-assisted product importer for the store.

Built with Next.js (App Router), Prisma, Stripe, and the Claude API.

## What's here

- **Blog** — MDX files in `content/blog/`, rendered at `/blog`.
- **Store** — Products live in a database (Prisma). Checkout goes through
  Stripe Checkout.
- **Admin** (`/admin`, password-protected) — paste a product link from Temu,
  SHEIN, AliExpress, or Alibaba and the app will:
  1. Fetch the page's public preview metadata (title, description, images,
     price — whatever Open Graph tags the page exposes).
  2. Send that text to Claude to rewrite it into an SEO-dense title and
     description for your store.
  3. Let you review, edit, or fill in anything that didn't come through
     before publishing.

  **Important:** Temu, SHEIN, AliExpress, and Alibaba don't offer a public
  product API, and their terms of service prohibit automated scraping. This
  importer only reads the same public preview metadata a link-unfurl bot
  would see (Open Graph tags) — it does not log in, bypass anti-bot
  measures, or scrape full page content. It's best-effort: some listings
  return incomplete data (especially price), and you should expect to fill
  in gaps by hand. Review each import for accuracy before publishing.

## Local setup

```bash
npm install
cp .env.example .env   # then fill in the values below
npx prisma migrate dev # creates the local SQLite database
npm run db:seed        # optional: adds two sample products
npm run dev
```

Visit `http://localhost:3000`. Admin tools are at `/admin` (log in with the
`ADMIN_PASSWORD` you set in `.env`).

### Environment variables

| Variable | Required for | Notes |
|---|---|---|
| `DATABASE_URL` | Everything | `file:./dev.db` locally. Use a Postgres URL in production (see below). |
| `ADMIN_PASSWORD` | `/admin` | The password for the admin area. Pick something you don't reuse elsewhere. |
| `ADMIN_SESSION_SECRET` | `/admin` | Any long random string — signs the admin login session. Generate one with `openssl rand -hex 32`. |
| `ANTHROPIC_API_KEY` | AI copy rewrite | From [console.anthropic.com](https://console.anthropic.com). Without it, product import still fetches title/images/price — it just skips the rewrite step. |
| `ANTHROPIC_MODEL` | optional | Defaults to `claude-opus-5`. |
| `STRIPE_SECRET_KEY` | Checkout | From your [Stripe dashboard](https://dashboard.stripe.com/apikeys). |
| `STRIPE_WEBHOOK_SECRET` | Order status updates | From the Stripe CLI (`stripe listen`) locally, or your webhook endpoint's settings in production. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Checkout | Currently unused by the client but reserved for future use (e.g. Stripe Elements). |
| `NEXT_PUBLIC_SITE_URL` | Checkout redirects, metadata | `http://localhost:3000` locally; your real domain in production. |

## Adding a blog post

Add a new `.mdx` file to `content/blog/`:

```mdx
---
title: "Your Post Title"
description: "One or two sentences for the blog index and SEO."
date: "2026-03-01"
author: "Your Name"
---

Your post content here, in Markdown.
```

Commit and deploy — no database or admin action needed for blog posts.

## Deploying (Vercel + Postgres + Stripe)

1. **Database.** Switch `prisma/schema.prisma`'s `datasource` provider from
   `sqlite` to `postgresql`, point `DATABASE_URL` at a hosted Postgres
   instance (Vercel Postgres, Neon, Supabase, etc.), then run
   `npx prisma migrate deploy`.
2. **Environment variables.** Set everything from the table above in your
   hosting provider's dashboard. Use a fresh, strong `ADMIN_SESSION_SECRET`
   and `ADMIN_PASSWORD` in production — don't reuse the local dev values.
3. **Stripe webhook.** Point a webhook at
   `https://yourdomain.com/api/webhooks/stripe` listening for
   `checkout.session.completed`, and set `STRIPE_WEBHOOK_SECRET` to the
   signing secret Stripe gives you for that endpoint.
4. **Deploy.** Push to GitHub and import the repo in Vercel (or your host of
   choice). Set the environment variables there before the first deploy.

## Notes on the product importer

- Marketplace detection (`Temu` / `SHEIN` / `AliExpress` / `Alibaba` /
  `Manual`) is based on the URL's hostname and is only used for labeling —
  it doesn't change how the page is fetched.
- The AI rewrite step never invents specs, materials, or claims beyond what
  the original scraped text supports — it's instructed to rewrite, not
  embellish.
- If a marketplace changes its page markup or blocks the request, the
  importer will report what it could and couldn't find and let you fill in
  the rest manually — it's designed to degrade gracefully, not to fail
  silently.
