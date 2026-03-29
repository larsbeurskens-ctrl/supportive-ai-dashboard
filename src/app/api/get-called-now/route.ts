import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { firstName, phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    // Normalize phone: add +44 if not present
    let normalizedPhone = phone.replace(/\s+/g, '');
    if (normalizedPhone.startsWith('0')) {
      normalizedPhone = '+44' + normalizedPhone.slice(1);
    } else if (!normalizedPhone.startsWith('+')) {
      normalizedPhone = '+44' + normalizedPhone;
    }

    console.log(`[GET CALLED NOW] ${firstName || 'Unknown'} - ${normalizedPhone}`);

    // TODO: Trigger Retell outbound call to this number
    // For now, forward to the backend which can initiate the call
    const backendUrl = process.env.BACKEND_URL || 'https://supportive-ai-backend-production.up.railway.app';
    const res = await fetch(`${backendUrl}/api/outbound-demo-call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: normalizedPhone,
        firstName: firstName || 'there',
      }),
    });

    if (!res.ok) {
      console.log('[GET CALLED NOW] Backend response:', res.status);
      // Still return success to the user - we log the lead
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[GET CALLED NOW] Error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
