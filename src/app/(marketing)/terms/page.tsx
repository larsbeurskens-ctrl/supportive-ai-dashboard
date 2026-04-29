import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Supportive AI',
  description: 'Terms and conditions for using Supportive AI.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-[32px] font-extrabold text-[#1a2e3b] mb-2">Terms of Service</h1>
      <p className="text-[13px] text-[#94a7b8] mb-10">Last updated: March 9, 2026</p>

      <div className="prose-custom space-y-8 text-[15px] text-[#3a5568] leading-relaxed">
        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Agreement</h2>
          <p>By using Supportive AI, you agree to these terms. If you do not agree, do not use the service. &quot;You&quot; refers to the business owner creating an account. &quot;We&quot; refers to Supportive AI LLC.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">The service</h2>
          <p>Supportive AI provides an AI-powered phone answering and booking service for home service businesses. We answer calls on your behalf, book appointments into your calendar, send SMS confirmations, and handle basic customer inquiries. The AI is not a human — it is an automated system that uses artificial intelligence to handle conversations.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Free trial</h2>
          <p>New accounts receive a 14-day free trial with up to 50 calls. No credit card is required for the trial. After the trial, you must subscribe to a paid plan to continue using the service. If you do not subscribe, your AI phone number will be deactivated.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Billing and cancellation</h2>
          <p>Paid plans are billed monthly via Stripe. You can cancel at any time — there are no long-term contracts. When you cancel, your service continues until the end of the current billing period. Refunds are handled on a case-by-case basis.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Your responsibilities</h2>
          <p>You are responsible for the accuracy of your business information, calendar availability, and pricing provided to the AI. You are responsible for informing your customers that calls may be handled by an AI system where required by applicable law.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Limitations</h2>
          <p>The AI handles calls to the best of its ability, but it is not perfect. It may occasionally misunderstand callers, book incorrect times, or fail to handle complex requests. For urgent or safety-critical situations, the AI is configured to escalate to a human. We are not liable for missed bookings, miscommunications, or lost revenue resulting from AI interactions.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Intellectual property</h2>
          <p>The Supportive AI platform, including all software, design, and content, is owned by Supportive AI LLC. Your business data, customer data, and call recordings remain yours.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Changes to terms</h2>
          <p>We may update these terms. We will notify you of significant changes by email. Continued use of the service after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="text-[20px] font-bold text-[#1a2e3b] mb-3">Contact</h2>
          <p>Questions about these terms? Email <a href="mailto:lars@supportive-ai.com" className="text-[#e8930c] no-underline hover:underline">lars@supportive-ai.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
