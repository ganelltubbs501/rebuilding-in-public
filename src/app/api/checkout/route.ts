import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { siteConfig } from "@/lib/site-config";

type CheckoutItem = { productId: string; quantity: number };

export async function POST(request: Request) {
  let body: { items?: CheckoutItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const items = body.items ?? [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, published: true },
  });

  if (products.length === 0) {
    return NextResponse.json({ error: "No valid products in cart" }, { status: 400 });
  }

  const lineItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const images: string[] = (() => {
        try {
          return JSON.parse(product.images);
        } catch {
          return [];
        }
      })();
      return {
        quantity: Math.max(1, item.quantity),
        price_data: {
          currency: product.currency,
          unit_amount: product.priceCents,
          product_data: {
            name: product.title,
            images: images[0] ? [images[0]] : undefined,
          },
        },
      };
    })
    .filter((li): li is NonNullable<typeof li> => li !== null);

  const totalCents = lineItems.reduce(
    (sum, li) => sum + li.price_data.unit_amount * li.quantity,
    0
  );

  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Stripe is not configured" },
      { status: 500 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${siteConfig.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteConfig.url}/cart`,
    metadata: {
      items: JSON.stringify(
        items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      ),
    },
  });

  await prisma.order.create({
    data: {
      stripeCheckoutId: session.id,
      status: "pending",
      totalCents,
      items: {
        create: items
          .map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            return {
              productId: product.id,
              quantity: Math.max(1, item.quantity),
              priceCents: product.priceCents,
            };
          })
          .filter((x): x is NonNullable<typeof x> => x !== null),
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
