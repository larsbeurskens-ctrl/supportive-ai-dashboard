import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const prisma = new PrismaClient();

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Read price IDs at request time (not module load) so env vars are always fresh
function getPriceId(plan: string, currency: string): string | undefined {
  const map: Record<string, string | undefined> = {
    starter_usd: process.env.STRIPE_PRICE_STARTER_USD,
    starter_gbp: process.env.STRIPE_PRICE_STARTER_GBP,
    standard_usd: process.env.STRIPE_PRICE_STANDARD_USD,
    standard_gbp: process.env.STRIPE_PRICE_STANDARD_GBP,
    business_usd: process.env.STRIPE_PRICE_BUSINESS_USD,
    business_gbp: process.env.STRIPE_PRICE_BUSINESS_GBP,
  };
  return map[`${plan}_${currency}`];
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const body = await req.json().catch(() => ({}));
    const plan = body.plan || business.subscriptionTier || "starter";
    const priceId = getPriceId(plan, currency);

    if (!priceId) {
      return NextResponse.json(
        { error: `Price not configured for ${plan} (${currency}). Check STRIPE_PRICE env vars.` },
        { status: 400 }
      );
    }

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

    const checkoutSession = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?subscription=success`,
      cancel_url: `${baseUrl}/dashboard?subscription=cancelled`,
      metadata: { businessId: business.id, plan, currency },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[STRIPE SUBSCRIBE]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
