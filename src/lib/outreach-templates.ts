// Outreach email templates — one per vertical + universal follow-up
// All emails send from: Lars Beurskens <lars@supportive-ai.com>

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://supportive-ai.com";

export const VERTICAL_DESTINATIONS: Record<string, string> = {
  plumbing: "/plumbing#hear-it",
  window_cleaning: "/window-cleaning#hear-it",
  hvac: "/hvac#hear-it",
  plumbing_uk: "/#hear-it",
  window_cleaning_uk: "/window-cleaning#hear-it",
  electrical: "/ai-receptionist-for-electricians",
  electrical_uk: "/ai-receptionist-for-electricians",
  locksmith: "/ai-receptionist-for-locksmiths",
  locksmith_uk: "/ai-receptionist-for-locksmiths",
  landscaping: "/ai-receptionist-for-landscapers",
  landscaping_uk: "/ai-receptionist-for-landscapers",
};

const VERTICAL_LABELS: Record<string, string> = {
  plumbing: "plumbing",
  window_cleaning: "window cleaning",
  hvac: "HVAC",
  plumbing_uk: "plumbing",
  window_cleaning_uk: "window cleaning",
  electrical: "electrical",
  electrical_uk: "electrical",
  locksmith: "locksmith",
  locksmith_uk: "locksmith",
  landscaping: "landscaping",
  landscaping_uk: "landscaping",
};

const DEMO_PHONES: Record<string, string> = {
  plumbing: "(240) 301-1473",
  window_cleaning: "(845) 209-2401",
  hvac: "(845) 209-2401",
  plumbing_uk: "+44 7427 846243",
  window_cleaning_uk: "+44 7427 846243",
  electrical: "+44 7886 080139",
  electrical_uk: "+44 7886 080139",
  locksmith: "+44 7700 174894",
  locksmith_uk: "+44 7700 174894",
  landscaping: "+44 7862 130941",
  landscaping_uk: "+44 7862 130941",
};

const SALES_PHONES: Record<string, string> = {
  plumbing: "(832) 346-6405",
  window_cleaning: "(832) 346-6405",
  hvac: "(832) 346-6405",
  plumbing_uk: "+44 7414 153843",
  window_cleaning_uk: "+44 7414 153843",
  electrical: "+44 7414 153843",
  electrical_uk: "+44 7414 153843",
  locksmith: "+44 7414 153843",
  locksmith_uk: "+44 7414 153843",
  landscaping: "+44 7414 153843",
  landscaping_uk: "+44 7414 153843",
};

const PAIN_OPENERS: Record<string, string> = {
  plumbing: "When a customer calls and you're under a sink, driving, or on another job - you can't always pick up. And the calls you miss usually go to the next plumber.",
  window_cleaning: "When a customer calls and you're up on a ladder, driving between jobs, or quoting another property - you can't always pick up. And the calls you miss usually go to the next company.",
  hvac: "When a customer calls and you're in an attic, on a rooftop, or running between service calls - you can't always pick up. And the calls you miss usually go to the next HVAC company.",
  plumbing_uk: "When a customer rings and you're under a sink, driving between jobs, or on a call-out — you can't always pick up. And the calls you miss usually go to the next plumber on the list.",
  window_cleaning_uk: "When a customer rings and you're up a ladder, driving between jobs, or quoting another property — you can't always pick up. And the calls you miss usually go to the next window cleaner.",
  electrical: "When a customer rings and you're up a ladder, in a loft, or mid-rewire — you can't always pick up. And the calls you miss usually go to the next electrician on Google.",
  electrical_uk: "When a customer rings and you're up a ladder, in a loft, or mid-rewire — you can't always pick up. And the calls you miss usually go to the next electrician on Google.",
  locksmith: "When a customer calls and you're picking a lock, driving to a call-out, or hands deep in a door mechanism — you can't always pick up. And someone locked out isn't leaving a voicemail — they're calling the next locksmith.",
  locksmith_uk: "When a customer rings and you're on a job, driving to a call-out, or mid-way through a lock change — you can't always pick up. And someone locked out isn't leaving a voicemail — they're ringing the next locksmith on Google.",
  landscaping: "When a customer calls and you're on a mower, up a tree, or knee-deep in a garden clearance — you can't always pick up. And the calls you miss usually go to the next landscaper on the list.",
  landscaping_uk: "When a customer rings and you're on a mower, trimming a hedge, or mid-way through a clearance — you can't always pick up. And the calls you miss usually go to the next gardener on Google.",
};

const VERTICAL_TRADE: Record<string, string> = {
  plumbing: "plumbers",
  window_cleaning: "window cleaning businesses",
  hvac: "HVAC companies",
  plumbing_uk: "plumbers",
  window_cleaning_uk: "window cleaning businesses",
  electrical: "electricians",
  electrical_uk: "electricians",
  locksmith: "locksmiths",
  locksmith_uk: "locksmiths",
  landscaping: "landscapers",
  landscaping_uk: "landscapers",
};

const STYLE = `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;color:#1a2e3b;font-size:15px;line-height:1.7;`;
const SIG_STYLE = `color:#5a7184;font-size:13px;`;
const LINK = `color:#1a6dca;`;

function greeting(): string {
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
  const salesPhone = SALES_PHONES[contact.vertical] || "(832) 346-6405";
  const trade = VERTICAL_TRADE[contact.vertical] || "home service businesses";
  const pain = PAIN_OPENERS[contact.vertical] || PAIN_OPENERS.plumbing;
  const greet = greeting();

  // === FOLLOW-UP ===
  if (template === "follow_up") {
    return {
      subject: `Re: 24/7 phone answering + booking for ${vLabel}`,
      html: `<div style="${STYLE}">
<p>${greet}</p>
<p>Just following up on the voicemail I just left - I know ${vLabel} work keeps you busy (which is exactly why I built this).</p>
<p style="margin-top:16px;">I created a human-like AI receptionist that picks up the phone when you can't, answers customer questions, and books appointments straight into your live calendar.</p>
<p style="margin-top:16px;">If you're curious, the fastest way to see what it does is to hear a real call recording:</p>

<p>👉 2-min demo call: <a href="${trackingUrl}" style="${LINK}">${trackingUrl}</a></p>

<p style="margin-top:8px;">You can also try it yourself by calling the demo number: <strong>${demoPhone}</strong></p>

<p style="margin-top:16px;">If it feels like a fit, you can create a free account and hear a version set up for your own business before switching anything live: <a href="${SITE_URL}/onboarding" style="${LINK}">supportive-ai.com/onboarding</a></p>

<p style="margin-top:16px;">If the timing's not right, no worries at all.</p>

<p style="margin-top:24px;">Lars<br/><span style="${SIG_STYLE}">Founder, Supportive AI <a href="https://www.linkedin.com/in/lars-beurskens-19642a8/" style="text-decoration:none;"><img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" width="14" height="14" alt="LinkedIn" style="vertical-align:middle;margin-left:4px;" /></a><br/>${salesPhone}</span></p>
</div>`,
    };
  }

  // === FIRST TOUCH ===
  return {
    subject: `24/7 phone answering + booking for ${vLabel}`,
    html: `<div style="${STYLE}">
<p>${greet}</p>

<p>${pain}</p>

<p style="margin-top:16px;">I founded Supportive AI, a 24/7 receptionist specifically built for ${trade} that:</p>

<p style="margin:12px 0 12px 8px;">
• picks up when you can't - nights, weekends, or when you're on a job<br/>
• or have it answer every call - completely up to you<br/>
• answers customer questions just like a real receptionist<br/>
• books jobs straight into your calendar<br/>
• flags emergencies and texts you immediately<br/>
• keeps your existing number (just forwards to the AI)
</p>
<p style="margin-top:16px;">Want to hear what it sounds like? 👉 2-min demo call: <a href="${trackingUrl}" style="${LINK}">${trackingUrl}</a></p>

<p style="margin-top:8px;">You can also try it yourself by calling the demo number: <strong>${demoPhone}</strong></p>

<p style="margin-top:16px;">I'll give you a quick call in the next few days.</p>

<p style="margin-top:16px;">If it feels like a fit, you can create a free account and hear a version set up for your own business before switching anything live: <a href="${SITE_URL}/onboarding" style="${LINK}">supportive-ai.com/onboarding</a></p>

<p style="margin-top:24px;">Best,<br/>Lars Beurskens<br/><span style="${SIG_STYLE}">Founder, Supportive AI <a href="https://www.linkedin.com/in/lars-beurskens-19642a8/" style="text-decoration:none;"><img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" width="14" height="14" alt="LinkedIn" style="vertical-align:middle;margin-left:4px;" /></a><br/>${salesPhone}<br/><a href="${SITE_URL}" style="${LINK}">supportive-ai.com</a></span></p>

<p style="color:#94a7b8;font-size:13px;margin-top:16px;">P.S. Free 7-day trial, no card needed.</p>
</div>`,
  };
}
