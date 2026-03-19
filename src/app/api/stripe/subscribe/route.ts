import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const prisma = new PrismaClient();

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Price IDs from stripe-setup.js — set as env vars on Railway
const PRICE_MAP: Record<string, string | undefined> = {
  starter_usd: process.env.STRIPE_PRICE_STARTER_USD,
  starter_gbp: process.env.STRIPE_PRICE_STARTER_GBP,
  standard_usd: process.env.STRIPE_PRICE_STANDARD_USD,
  standard_gbp: process.env.STRIPE_PRICE_STANDARD_GBP,
  business_usd: process.env.STRIPE_PRICE_BUSINESS_USD,
  business_gbp: process.env.STRIPE_PRICE_BUSINESS_GBP,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the user's business
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { business: true },
  });
  if (!user?.business) {
    return NextResponse.json({ error: "No business found" }, { status: 404 });
  }

  const business = user.business;
  const overrides = (business.agentCustomOverrides as Record<string, string>) || {};
  const isUK = overrides.country === "UK" || business.timezone === "Europe/London";
  const currency = isUK ? "gbp" : "usd";

  // Determine plan from request body or default
  const body = await req.json().catch(() => ({}));
  const plan = body.plan || business.subscriptionTier || "starter";
  const priceKey = `${plan}_${currency}`;
  const priceId = PRICE_MAP[priceKey];

  if (!priceId) {
    return NextResponse.json(
      { error: `Price not configured for ${plan} (${currency}). Contact support.` },
      { status: 400 }
    );
  }

  // Create or reuse Stripe Customer
  let customerId = business.stripeCustomerId;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: business.email,
      name: business.name,
      metadata: { businessId: business.id },
    });
    customerId = customer.id;
    await prisma.business.update({
      where: { id: business.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://supportive-ai.com";

  // Create Checkout Session — subscription, no trial (they already had 7 free days)
  const checkoutSession = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?subscription=success`,
    cancel_url: `${baseUrl}/dashboard?subscription=cancelled`,
    metadata: {
      businessId: business.id,
      plan,
      currency,
    },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
