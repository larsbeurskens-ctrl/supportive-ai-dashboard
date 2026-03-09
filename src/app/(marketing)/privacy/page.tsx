import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Supportive AI',
  description: 'How Supportive AI handles your data, call recordings, and customer information.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-[32px] font-extrabold text-[#1a2e3b] mb-2">Privacy Policy</h1>
      <p className="text-[13px] text-[#94a7b8] mb-10">Last updated: March 9, 2026</p>

      <div className="prose-custom space-y-8 text-[15px] text-[#3a5568] leading-relaxed">
        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Who we are</h2>
          <p>Supportive AI LLC is an AI-powered phone answering and booking service for home service businesses. We are based in the United States. If you have questions about this policy, contact us at <a href="mailto:lars@supportive-ai.com" className="text-[#e8930c] no-underline hover:underline">lars@supportive-ai.com</a>.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">What we collect</h2>
          <p className="mb-3"><strong className="text-[#1a2e3b]">From business owners (our customers):</strong> name, email, phone number, business name, business address, Google Calendar data (when connected), and payment information via Stripe.</p>
          <p><strong className="text-[#1a2e3b]">From callers (your customers):</strong> phone number, name, address, and information shared during the call. Call recordings and transcripts are stored to provide the service and for quality purposes.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">How we use your data</h2>
          <p>We use data to provide the service: answering calls, booking appointments, sending SMS confirmations, connecting to your calendar, and processing payments. We do not sell your data to third parties. We do not use your data for advertising.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Third-party services</h2>
          <p>We use the following services to operate: Retell AI (voice agent), Twilio (phone and SMS), Google Calendar (scheduling), Stripe (payments), Resend (email), Railway (hosting), and Vercel (frontend hosting). Each has their own privacy policy governing how they handle data.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Call recordings and transcripts</h2>
          <p>Calls handled by the AI are recorded and transcribed. These recordings are used to provide the service (booking details, follow-ups) and to improve call quality. Business owners can access their own call recordings and transcripts through the dashboard. Recordings are stored securely and not shared publicly.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Data security</h2>
          <p>We use encryption in transit (TLS) and at rest. Database access is restricted to authorized systems only. We do not store credit card numbers directly — all payment processing is handled by Stripe.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Data retention and deletion</h2>
          <p>We retain your data for as long as your account is active. If you cancel your account, you can request deletion of all your data by emailing <a href="mailto:lars@supportive-ai.com" className="text-[#e8930c] no-underline hover:underline">lars@supportive-ai.com</a>. We will delete your data within 30 days of the request.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Changes to this policy</h2>
          <p>We may update this policy from time to time. We will notify you of significant changes by email.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Contact</h2>
          <p>Questions? Email us at <a href="mailto:lars@supportive-ai.com" className="text-[#e8930c] no-underline hover:underline">lars@supportive-ai.com</a> or call <a href="tel:+18323466405" className="text-[#e8930c] no-underline hover:underline">(832) 346-6405</a>.</p>
        </section>
      </div>
    </div>
  );
}
