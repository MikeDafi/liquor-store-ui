import type { VercelRequest, VercelResponse } from '@vercel/node';

// Store spreadsheet mappings
const STORE_SPREADSHEETS: Record<string, string> = {
  'home-service-market': '1NH20t073dWNihFY49p5WYxiGTf0_ui1GBVN9UxPklh4',
  'town-country-market': '1__JWmXYb_2fbtMp1Fk7DSCXq6DNQGrFfsLQ4Pdj3emg',
  'mmc-wine-spirit': '17lpkOLWIIeXz17sjTuGrAyQMNz3wcRsUCleuirLc2Bw',
};

const DEFAULT_GID = '2011133176';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get store ID from query or environment
  const storeId = (req.query.store as string) || process.env.VITE_STORE_ID || 'home-service-market';
  
  const spreadsheetId = STORE_SPREADSHEETS[storeId];
  
  if (!spreadsheetId) {
    return res.status(400).json({ error: 'Invalid store ID' });
  }

  const gid = (req.query.gid as string) || DEFAULT_GID;
  const googleSheetsUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;

  try {
    const response = await fetch(googleSheetsUrl);
    
    if (!response.ok) {
      throw new Error(`Google Sheets returned ${response.status}`);
    }

    const csvData = await response.text();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    
    return res.status(200).send(csvData);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return res.status(500).json({ error: 'Failed to fetch inventory' });
  }
}

