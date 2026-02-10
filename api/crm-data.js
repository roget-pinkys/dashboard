// Vercel Serverless Function - Fetch single module from Zoho CRM
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { module, page = 1, perPage = 200 } = req.query;

  if (!module) {
    return res.status(400).json({ error: 'Module parameter required' });
  }

  try {
    const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
    const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
    const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;

    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
      return res.status(500).json({ 
        error: 'Zoho credentials not configured'
      });
    }

    // Get access token
    const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: ZOHO_REFRESH_TOKEN,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token'
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token refresh failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Field mappings
    const fieldMappings = {
      'Leads': 'First_Name,Last_Name,Email,Phone,Company,Lead_Status,Lead_Source,Owner,Created_Time',
      'Deals': 'Deal_Name,Amount,Stage,Closing_Date,Owner,Created_Time,Account_Name',
      'Calls': 'Subject,Call_Type,Call_Duration,Call_Start_Time,Owner,Related_To',
      'Tasks': 'Subject,Status,Priority,Due_Date,Owner,Created_Time',
      'Events': 'Event_Title,Start_DateTime,End_DateTime,Venue,Owner,Participants',
      'SMS': 'Message,Owner',
      'Notes': 'Note_Content,Created_Time,Owner,Parent_Id'
    };

    const fields = fieldMappings[module] || '';
    const url = `https://www.zohoapis.com/crm/v2/${module}?fields=${fields}&page=${page}&per_page=${perPage}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status}`);
    }

    const data = await response.json();
    
    return res.status(200).json({
      success: true,
      module,
      page: parseInt(page),
      perPage: parseInt(perPage),
      data: data.data || [],
      info: data.info || {},
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch CRM data',
      message: error.message 
    });
  }
}
