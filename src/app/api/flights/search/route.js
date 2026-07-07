import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  
  if (!origin || !destination) {
    return NextResponse.json({ error: 'Origin and destination are required' }, { status: 400 });
  }

  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 
    
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // Map and filter results. Output ONLY Column H (Final_Price) and Column B (Airline).
    // Original_Price (F) and Markup (G) must remain hidden.
    const results = rows.map(row => ({
      Origin: row.get('Origin'),
      Destination: row.get('Destination'),
      DepartureDate: row.get('Departure_Date'),
      Airline: row.get('Airline'),          // Column B
      FinalPrice: row.get('Final_Price')    // Column H
    })).filter(flight => 
      flight.Origin && flight.Destination &&
      flight.Origin.toUpperCase() === origin.toUpperCase() && 
      flight.Destination.toUpperCase() === destination.toUpperCase()
    );

    return NextResponse.json({ flights: results });
  } catch (error) {
    console.error('Search flights error:', error);
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}
