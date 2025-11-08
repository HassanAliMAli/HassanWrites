import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const MAILERLITE_API_KEY = 'YOUR_MAILERLITE_API_KEY'; // <-- IMPORTANT: Replace with your API Key
  const MAILERLITE_GROUP_ID = '170465168294151221';

  if (MAILERLITE_API_KEY === 'YOUR_MAILERLITE_API_KEY') {
    console.error('MAILERLITE_API_KEY is not set');
    return NextResponse.json({ error: 'The server is not configured for subscriptions.' }, { status: 500 });
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        groups: [MAILERLITE_GROUP_ID],
      }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      const errorData = await response.json();
      console.error('MailerLite API Error:', errorData);
      return NextResponse.json({ error: 'Failed to subscribe.' }, { status: response.status });
    }
  } catch (error) {
    console.error('Subscription Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
