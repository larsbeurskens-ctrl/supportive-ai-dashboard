import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
    starterUsd: process.env.STRIPE_PRICE_STARTER_USD ? "set" : "missing",
    starterGbp: process.env.STRIPE_PRICE_STARTER_GBP ? "set" : "missing",
    standardUsd: process.env.STRIPE_PRICE_STANDARD_USD ? "set" : "missing",
    standardGbp: process.env.STRIPE_PRICE_STANDARD_GBP ? "set" : "missing",
    businessUsd: process.env.STRIPE_PRICE_BUSINESS_USD ? "set" : "missing",
    businessGbp: process.env.STRIPE_PRICE_BUSINESS_GBP ? "set" : "missing",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? "set" : "missing",
  });
}
