import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ChatWidget } from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Supportive AI — AI Receptionist for Home Service Businesses",
  description:
    "AI receptionist built for plumbers, window cleaners, and HVAC businesses. Answers every call, books jobs into your live calendar, sends confirmations, and handles payments — 24/7. 14-day free trial.",
  keywords: [
    "AI receptionist", "AI phone answering", "home services AI",
    "plumber answering service", "window cleaning answering service",
    "HVAC answering service", "AI booking agent", "virtual receptionist",
    "trade business phone", "missed call solution", "24/7 answering service",
    "AI appointment booking", "small business AI phone",
  ],
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  metadataBase: new URL('https://supportive-ai.com'),
  openGraph: {
    title: "Supportive AI — AI Receptionist for Home Service Businesses",
    description: "Never miss a call again. AI receptionist that knows your trade, books jobs, and handles payments — 24/7.",
    url: 'https://supportive-ai.com',
    siteName: 'Supportive AI',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Supportive AI — AI Receptionist for Home Service Businesses",
    description: "Never miss a call again. AI receptionist that knows your trade, books jobs, and handles payments — 24/7.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#1a2e3b" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-23LG6MMPKT" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-23LG6MMPKT');
              gtag('config', 'AW-18050481727');
            `,
          }}
        />
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2092804878165237');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.net/tr?id=2092804878165237&ev=PageView&noscript=1"
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Supportive AI",
              "url": "https://supportive-ai.com",
              "description": "AI receptionist for UK trade businesses. Answers calls 24/7, books jobs into your calendar, handles pricing and emergencies.",
              "foundingDate": "2026",
              "founder": { "@type": "Person", "name": "Lars Beurskens" },
              "contactPoint": { "@type": "ContactPoint", "telephone": "+447414153843", "contactType": "sales", "areaServed": "GB" },
              "sameAs": ["https://www.linkedin.com/in/lars-beurskens-19642a8/"],
              "offers": {
                "@type": "AggregateOffer",
                "lowPrice": "69",
                "highPrice": "299",
                "priceCurrency": "GBP",
                "offerCount": "3",
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <ChatWidget />
      </body>
    </html>
  );
}
