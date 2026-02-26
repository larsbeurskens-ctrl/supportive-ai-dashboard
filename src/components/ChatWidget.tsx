'use client';

import { useEffect } from 'react';

/**
 * Tawk.to live chat widget.
 * 
 * HOW TO SET UP:
 * 1. Go to https://tawk.to and create a free account
 * 2. Create a property for "Supportive AI"
 * 3. Copy your Property ID and Widget ID from:
 *    Dashboard → Administration → Channels → Chat Widget → Direct Chat Link
 *    The URL format is: https://tawk.to/chat/PROPERTY_ID/WIDGET_ID
 * 4. Replace the IDs below
 * 5. Download the Tawk.to mobile app to respond on the go
 */

// TODO: Replace with real Tawk.to IDs after signup
const TAWK_PROPERTY_ID = 'REPLACE_WITH_PROPERTY_ID';
const TAWK_WIDGET_ID = 'REPLACE_WITH_WIDGET_ID';

export function ChatWidget() {
  useEffect(() => {
    // Don't load if IDs aren't configured
    if (TAWK_PROPERTY_ID.includes('REPLACE')) return;

    // Load Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
