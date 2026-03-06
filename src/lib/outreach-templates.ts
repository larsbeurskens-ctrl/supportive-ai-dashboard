// Outreach email templates — one per vertical + universal follow-up
// All emails send from: Lars from Supportive AI <lars@supportive-ai.com>

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://supportive-ai.com";

export const VERTICAL_DESTINATIONS: Record<string, string> = {
  plumbing: "/plumbing#hear-it",
  window_cleaning: "/window-cleaning#hear-it",
  hvac: "/hvac#hear-it",
};

const VERTICAL_LABELS: Record<string, string> = {
  plumbing: "plumbing",
  window_cleaning: "window cleaning",
  hvac: "HVAC",
};

const DEMO_PHONES: Record<string, string> = {
  plumbing: "(240) 301-1473",
  window_cleaning: "(845) 209-2401",
  hvac: "(845) 209-2401",
};

const PAIN_OPENERS: Record<string, string> = {
  plumbing: "When a customer calls and you're under a sink, driving, or on another job - you can't always pick up. And the calls you miss usually go to the next plumber.",
  window_cleaning: "When a customer calls and you're up on a ladder, driving between jobs, or quoting another property - you can't always pick up. And the calls you miss usually go to the next company.",
  hvac: "When a customer calls and you're in an attic, on a rooftop, or running between service calls - you can't always pick up. And the calls you miss usually go to the next HVAC company.",
};

const VERTICAL_TRADE: Record<string, string> = {
  plumbing: "plumbers",
  window_cleaning: "window cleaning businesses",
  hvac: "HVAC companies",
};

const STYLE = `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;color:#1a2e3b;font-size:15px;line-height:1.7;`;
const SIG_STYLE = `color:#5a7184;font-size:13px;`;
const LINK = `color:#1a6dca;`;

function greeting(name: string | null | undefined, businessName: string | null | undefined): string {
  if (name && name.trim() && !name.includes("@")) return `Hi ${name.split(" ")[0]},`;
  if (businessName && businessName.trim()) return `Hi ${businessName} Team,`;
  return "Hi there,";
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

interface Contact {
  name?: string | null;
  businessName?: string | null;
  vertical: string;
  painSignal?: string | null;
  score?: number;
}

export function buildEmail(
  contact: Contact, trackingUrl: string, template: string
): { subject: string; html: string } {
  const biz = contact.businessName || "your business";
  const vLabel = VERTICAL_LABELS[contact.vertical] || contact.vertical;
  const demoPhone = DEMO_PHONES[contact.vertical] || "(845) 209-2401";
  const trade = VERTICAL_TRADE[contact.vertical] || "home service businesses";
  const pain = PAIN_OPENERS[contact.vertical] || PAIN_OPENERS.plumbing;
  const greet = greeting(contact.name, contact.businessName);

  // === FOLLOW-UP ===
  if (template === "follow_up") {
    return {
      subject: `Re: 24/7 answering + booking for ${biz}`,
      html: `<div style="${STYLE}">
<p>${greet}</p>
<p>Just following up - I know ${vLabel} work keeps you busy (which is exactly why I built this).</p>
<p style="margin-top:16px;">If you're curious, the fastest way to see what Supportive AI does is to hear a real call recording:</p>

<p>👉 2-min demo call: <a href="${trackingUrl}" style="${LINK}">${trackingUrl}</a></p>

<p style="margin-top:16px;">Or call our demo agent yourself: <strong>${demoPhone}</strong> - takes 60 seconds.</p>

<p style="margin-top:16px;">If the timing's not right, no worries at all.</p>

<p style="margin-top:24px;">Lars<br/><span style="${SIG_STYLE}">(832) 346-6405</span></p>
</div>`,
    };
  }

  // === FIRST TOUCH ===
  return {
    subject: `24/7 answering + booking for ${biz}`,
    html: `<div style="${STYLE}">
<p>${greet}</p>

<p>${pain}</p>

<p style="margin-top:16px;">I founded Supportive AI, a 24/7 receptionist specifically built for ${trade} that:</p>

<p style="margin:12px 0 12px 8px;">
• answers every call - nights, weekends, holidays<br/>
• books jobs into your live Google Calendar<br/>
• flags emergencies and texts you immediately<br/>
• keeps your existing number (or creates a new one)<br/>
• sends payment links after the job
</p>
<p style="margin-top:16px;">Want to hear what it sounds like? 👉 2-min demo call: <a href="${trackingUrl}" style="${LINK}">${trackingUrl}</a></p>

<p style="margin-top:16px;">I'll give you a quick call in the next few days.</p>

<p style="margin-top:16px;">If you want to try it before I ring, set up a free trial - fully configured for ${biz}. Takes 2 minutes: <a href="${SITE_URL}/onboarding" style="${LINK}">supportive-ai.com/onboarding</a></p>

<p style="margin-top:24px;">Best,<br/>Lars Beurskens<br/><span style="${SIG_STYLE}">Founder, Supportive AI<br/>(832) 346-6405<br/><a href="${SITE_URL}" style="${LINK}">supportive-ai.com</a></span></p>

<p style="color:#94a7b8;font-size:13px;margin-top:16px;">P.S. Free 7-day trial, no card needed - hear how your AI receptionist sounds.</p>
</div>`,
  };
}
