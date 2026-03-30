import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ChatWidget } from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Supportive AI — AI Receptionist for Home Service Businesses",
  description:
    "AI receptionist built for plumbers, window cleaners, and HVAC businesses. Answers every call, books jobs into your live calendar, sends confirmations, and handles payments — 24/7. 7-day free trial.",
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
    canonical: 'https://supportive-ai.com',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Supportive AI",
              "applicationCategory": "BusinessApplication",
              "description": "AI receptionist for home service businesses. Answers calls, books jobs, sends confirmations, handles payments.",
              "url": "https://supportive-ai.com",
              "offers": {
                "@type": "Offer",
                "price": "89",
                "priceCurrency": "USD",
                "priceValidUntil": "2026-12-31",
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
