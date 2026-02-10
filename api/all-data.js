// Vercel Serverless Function - Fetch all CRM modules from Zoho directly
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
    const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
    const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;

    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
      return res.status(500).json({ 
        error: 'Zoho credentials not configured',
        message: 'Please add ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN to Vercel environment variables'
      });
    }

    // Step 1: Get access token from refresh token
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

    // Step 2: Fetch all modules in parallel
    const modules = ['Leads', 'Deals', 'Calls', 'Tasks', 'Notes'];
    
    const fieldMappings = {
      'Leads': 'First_Name,Last_Name,Email,Phone,Company,Lead_Status,Lead_Source,Owner,Created_Time',
      'Deals': 'Deal_Name,Amount,Stage,Closing_Date,Owner,Created_Time,Account_Name',
      'Calls': 'Subject,Call_Type,Call_Duration,Call_Start_Time,Owner,Related_To',
      'Tasks': 'Subject,Status,Priority,Due_Date,Owner,Created_Time',
      'Notes': 'Note_Content,Created_Time,Owner,Parent_Id'
    };

    const fetchModule = async (module) => {
      const fields = fieldMappings[module];
      const url = `https://www.zohoapis.com/crm/v2/${module}?fields=${fields}&per_page=200`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      });
      
      if (!response.ok) {
        console.error(`Failed to fetch ${module}:`, response.status);
        return { module, data: [], error: response.status };
      }
      
      const result = await response.json();
      return { 
        module, 
        data: result.data || [], 
        info: result.info || {} 
      };
    };

    // Fetch SMS separately (different endpoint)
    const fetchSMS = async () => {
      const url = 'https://www.zohoapis.com/crm/v2/SMS?per_page=200';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch SMS:', response.status);
        return { module: 'SMS', data: [], error: response.status };
      }
      
      const result = await response.json();
      return { 
        module: 'SMS', 
        data: result.data || [], 
        info: result.info || {} 
      };
    };

    // Fetch all modules
    const results = await Promise.all([
      ...modules.map(fetchModule),
      fetchSMS()
    ]);
    
    // Format response
    const formattedData = {};
    results.forEach(({ module, data }) => {
      formattedData[module.toLowerCase()] = data;
    });

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: formattedData,
      summary: {
        leads: formattedData.leads?.length || 0,
        deals: formattedData.deals?.length || 0,
        calls: formattedData.calls?.length || 0,
        tasks: formattedData.tasks?.length || 0,
        sms: formattedData.sms?.length || 0,
        notes: formattedData.notes?.length || 0
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch CRM data',
      message: error.message,
      details: error.toString()
    });
  }
}