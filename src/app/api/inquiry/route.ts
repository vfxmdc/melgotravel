import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      wilaya,
      destination,
      departureDate,
      returnDate,
      travelers,
    } = body;

    // Validate required fields
    if (
      !fullName ||
      !phone ||
      !wilaya ||
      !destination ||
      !departureDate ||
      !returnDate ||
      !travelers
    ) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || botToken === 'YOUR_TELEGRAM_BOT_TOKEN') {
      console.error('Telegram Integration Error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables are not set or contain placeholder values.');
      return NextResponse.json(
        { error: 'Telegram credentials are not configured. Please replace YOUR_TELEGRAM_BOT_TOKEN in .env.local with a real token and restart your development server.' },
        { status: 500 }
      );
    }

    // Format the Telegram message according to the requirements
    const message = `🚀 New Travel Request

👤 Full Name: ${fullName}

📞 Phone: ${phone}

📍 Wilaya: ${wilaya}

✈️ Destination: ${destination}

📅 Departure Date: ${departureDate}

📅 Return Date: ${returnDate}

👥 Travelers: ${travelers}

⏰ Submitted From Melgo Travel Website`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Telegram API returned an error status: ${response.status}. Details:`, errorText);
      
      let clientError = 'Failed to send notification via Telegram.';
      if (response.status === 401 || response.status === 404) {
        clientError = 'Failed to send notification: The TELEGRAM_BOT_TOKEN in .env.local is invalid or incorrect.';
      } else if (response.status === 400) {
        clientError = 'Failed to send notification: Telegram rejected the request. Please check if your TELEGRAM_CHAT_ID is correct and make sure you have started a conversation with your bot (send /start).';
      }

      return NextResponse.json(
        { error: clientError },
        { status: 502 }
      );
    }

    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram response data was not ok:', data);
      return NextResponse.json(
        { error: 'Telegram API execution failed.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Inquiry Submission Server Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
