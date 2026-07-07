import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Duffel } from '@duffel/api';

const DUFFEL_ACCESS_TOKEN = process.env.DUFFEL_ACCESS_TOKEN;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const routesToUpdate = [
  // --- EUROPE (FRANCE, SPAIN, UK, ITALY, GERMANY) ---
  { origin: 'ALG', destination: 'CDG' }, { origin: 'CDG', destination: 'ALG' }, // Paris CDG
  { origin: 'ALG', destination: 'ORY' }, { origin: 'ORY', destination: 'ALG' }, // Paris Orly
  { origin: 'ALG', destination: 'MRS' }, { origin: 'MRS', destination: 'ALG' }, // Marseille
  { origin: 'ALG', destination: 'LYS' }, { origin: 'LYS', destination: 'ALG' }, // Lyon
  { origin: 'ORN', destination: 'CDG' }, { origin: 'CDG', destination: 'ORN' }, // Oran - Paris
  { origin: 'ORN', destination: 'MRS' }, { origin: 'MRS', destination: 'ORN' }, // Oran - Marseille
  { origin: 'CZL', destination: 'CDG' }, { origin: 'CDG', destination: 'CZL' }, // Constantine - Paris
  { origin: 'ALG', destination: 'BCN' }, { origin: 'BCN', destination: 'ALG' }, // Barcelona
  { origin: 'ALG', destination: 'MAD' }, { origin: 'MAD', destination: 'ALG' }, // Madrid
  { origin: 'ORN', destination: 'ALC' }, { origin: 'ALC', destination: 'ORN' }, // Alicante
  { origin: 'ALG', destination: 'LHR' }, { origin: 'LHR', destination: 'ALG' }, // London Heathrow
  { origin: 'ALG', destination: 'FCO' }, { origin: 'FCO', destination: 'ALG' }, // Rome
  { origin: 'ALG', destination: 'FRA' }, { origin: 'FRA', destination: 'ALG' }, // Frankfurt
  { origin: 'ALG', destination: 'GVA' }, { origin: 'GVA', destination: 'ALG' }, // Geneva

  // --- NORTH AMERICA (CANADA & USA) ---
  { origin: 'ALG', destination: 'YUL' }, { origin: 'YUL', destination: 'ALG' }, // Montreal (Crucial for Diaspora)
  { origin: 'ALG', destination: 'JFK' }, { origin: 'JFK', destination: 'ALG' }, // New York
  { origin: 'ALG', destination: 'IAD' }, { origin: 'IAD', destination: 'ALG' }, // Washington DC

  // --- TURKEY & RUSSIA ---
  { origin: 'ALG', destination: 'IST' }, { origin: 'IST', destination: 'ALG' }, // Istanbul
  { origin: 'ORN', destination: 'IST' }, { origin: 'IST', destination: 'ORN' }, // Oran - Istanbul
  { origin: 'CZL', destination: 'IST' }, { origin: 'IST', destination: 'CZL' }, // Constantine - Istanbul
  { origin: 'ALG', destination: 'SVO' }, { origin: 'SVO', destination: 'ALG' }, // Moscow Sheremetyevo

  // --- ARAB COUNTRIES (GULF, UMRAH, LEVANT, NORTH AFRICA) ---
  { origin: 'ALG', destination: 'JED' }, { origin: 'JED', destination: 'ALG' }, // Jeddah
  { origin: 'ALG', destination: 'MED' }, { origin: 'MED', destination: 'ALG' }, // Medina
  { origin: 'ORN', destination: 'JED' }, { origin: 'JED', destination: 'ORN' }, // Oran - Jeddah
  { origin: 'CZL', destination: 'JED' }, { origin: 'JED', destination: 'CZL' }, // Constantine - Jeddah
  { origin: 'ALG', destination: 'DXB' }, { origin: 'DXB', destination: 'ALG' }, // Dubai
  { origin: 'ALG', destination: 'DOH' }, { origin: 'DOH', destination: 'ALG' }, // Doha
  { origin: 'ALG', destination: 'AUH' }, { origin: 'AUH', destination: 'ALG' }, // Abu Dhabi
  { origin: 'ALG', destination: 'KWI' }, { origin: 'KWI', destination: 'ALG' }, // Kuwait
  { origin: 'ALG', destination: 'CAI' }, { origin: 'CAI', destination: 'ALG' }, // Cairo
  { origin: 'ALG', destination: 'TUN' }, { origin: 'TUN', destination: 'ALG' }, // Tunis
  { origin: 'ALG', destination: 'CMN' }, { origin: 'CMN', destination: 'ALG' }, // Casablanca
  { origin: 'ALG', destination: 'AMM' }, { origin: 'AMM', destination: 'ALG' }, // Amman
  { origin: 'ALG', destination: 'BEY' }, { origin: 'BEY', destination: 'ALG' }, // Beirut
  { origin: 'ALG', destination: 'MCT' }, { origin: 'MCT', destination: 'ALG' }, // Muscat

  // --- ASIA (CHINA, MALAYSIA, VIETNAM) ---
  { origin: 'ALG', destination: 'PEK' }, { origin: 'PEK', destination: 'ALG' }, // Beijing
  { origin: 'ALG', destination: 'CAN' }, { origin: 'CAN', destination: 'ALG' }, // Guangzhou (Trading Hub)
  { origin: 'ALG', destination: 'PVG' }, { origin: 'PVG', destination: 'ALG' }, // Shanghai
  { origin: 'ALG', destination: 'KUL' }, { origin: 'KUL', destination: 'ALG' }, // Kuala Lumpur
  { origin: 'ALG', destination: 'HAN' }, { origin: 'HAN', destination: 'ALG' }, // Hanoi
  { origin: 'ALG', destination: 'SGN' }, { origin: 'SGN', destination: 'ALG' }, // Ho Chi Minh City

  // --- TOURISM & EXOTIC ISLANDS (MALDIVES, INDONESIA, ZANZIBAR) ---
  { origin: 'ALG', destination: 'MLE' }, { origin: 'MLE', destination: 'ALG' }, // Maldives
  { origin: 'ALG', destination: 'CGK' }, { origin: 'CGK', destination: 'ALG' }, // Jakarta
  { origin: 'ALG', destination: 'DPS' }, { origin: 'DPS', destination: 'ALG' }, // Bali (Top Tourist Hub)
  { origin: 'ALG', destination: 'ZNZ' }  , { origin: 'ZNZ', destination: 'ALG' }  // Zanzibar
];

export async function GET(request) {
  // Validate Vercel Cron Secret if configured
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);
    const departureDate = targetDate.toISOString().split('T')[0];

    const allFlightOffers = [];
    const duffel = new Duffel({ token: DUFFEL_ACCESS_TOKEN });

    for (const route of routesToUpdate) {
      try {
        const offerRequestResponse = await duffel.offerRequests.create({
          slices: [
            {
              origin: route.origin,
              destination: route.destination,
              departure_date: departureDate,
            },
          ],
          passengers: [{ type: 'adult' }],
          return_offers: true,
        });

        if (offerRequestResponse.data && offerRequestResponse.data.offers && offerRequestResponse.data.offers.length > 0) {
          // Sort to get the cheapest
          const sortedOffers = offerRequestResponse.data.offers.sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount));
          const bestOffer = sortedOffers[0];

          if (bestOffer && bestOffer.slices && bestOffer.slices.length > 0) {
            const slice = bestOffer.slices[0];
            const segment = slice.segments[0];
            
            allFlightOffers.push({
              Flight_Number: `${segment.operating_carrier.iata_code}${segment.operating_carrier_flight_number}`,
              Airline: bestOffer.owner.name,
              Origin: route.origin,
              Destination: route.destination,
              Departure_Date: segment.departing_at,
              Original_Price: bestOffer.total_amount,
            });
          }
        }
      } catch (err) {
        console.error(`Error fetching Duffel for ${route.origin}-${route.destination}:`, err.message || err);
      }

      // STRICT 1.5 seconds delay between each loop request to handle rate limit
      await sleep(1500);
    }

    // 2. Authenticate with Google Sheets
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo(); 
    
    const sheet = doc.sheetsByIndex[0];

    // Load cells so we can update specific columns A to F without clearing G (Markup) and H (Final_Price)
    // We load enough rows to cover our data plus some buffer (e.g., 200 rows)
    await sheet.loadCells('A2:F200');

    // Update existing rows or insert values for columns A-F
    for (let i = 0; i < allFlightOffers.length; i++) {
      const rowIndex = i + 1; // row 0 is header, so row 1 in cells corresponds to row 2 in Excel
      const offer = allFlightOffers[i];
      
      sheet.getCell(rowIndex, 0).value = offer.Flight_Number;
      sheet.getCell(rowIndex, 1).value = offer.Airline;
      sheet.getCell(rowIndex, 2).value = offer.Origin;
      sheet.getCell(rowIndex, 3).value = offer.Destination;
      sheet.getCell(rowIndex, 4).value = offer.Departure_Date;
      sheet.getCell(rowIndex, 5).value = offer.Original_Price;
    }

    // Clear remaining rows in A-F if any (up to 200) to remove old data
    for (let i = allFlightOffers.length; i < 199; i++) {
      const rowIndex = i + 1;
      sheet.getCell(rowIndex, 0).value = '';
      sheet.getCell(rowIndex, 1).value = '';
      sheet.getCell(rowIndex, 2).value = '';
      sheet.getCell(rowIndex, 3).value = '';
      sheet.getCell(rowIndex, 4).value = '';
      sheet.getCell(rowIndex, 5).value = '';
    }

    await sheet.saveUpdatedCells();

    return NextResponse.json({ success: true, updatedRows: allFlightOffers.length });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
