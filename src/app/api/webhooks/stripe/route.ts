import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const prisma = new PrismaClient();

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("[STRIPE WEBHOOK] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const businessId = session.metadata?.businessId;
        const plan = session.metadata?.plan || "starter";
        if (!businessId) break;

        await prisma.business.update({
          where: { id: businessId },
          data: {
            stripeSubscriptionId: session.subscription as string,
            stripeCustomerId: session.customer as string,
            subscriptionTier: plan,
            subscriptionStatus: "active",
          },
        });
        console.log(`[STRIPE] ✅ Subscription started: ${businessId} → ${plan}`);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        const subId = (invoice as unknown as Record<string, unknown>).subscription as string;
        if (!subId) break;

        // Keep subscription active on successful payment
        const business = await prisma.business.findFirst({
          where: { stripeSubscriptionId: subId },
        });
        if (business) {
          await prisma.business.update({
            where: { id: business.id },
            data: { subscriptionStatus: "active" },
          });
          console.log(`[STRIPE] ✅ Invoice paid: ${business.name}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const business = await prisma.business.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (business) {
          await prisma.business.update({
            where: { id: business.id },
            data: {
              subscriptionStatus: "cancelled",
              stripeSubscriptionId: null,
            },
          });
          console.log(`[STRIPE] ⚠️ Subscription cancelled: ${business.name}`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[STRIPE WEBHOOK] Processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
