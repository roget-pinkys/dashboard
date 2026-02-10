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

    // Fetch module with pagination to get ALL records
    const fetchModule = async (module) => {
      const fields = fieldMappings[module];
      let allData = [];
      let page = 1;
      let hasMoreRecords = true;
      
      while (hasMoreRecords) {
        const url = `https://www.zohoapis.com/crm/v2/${module}?fields=${fields}&page=${page}&per_page=200`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`
          }
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch ${module} page ${page}:`, response.status);
          break;
        }
        
        const result = await response.json();
        const pageData = result.data || [];
        
        allData = allData.concat(pageData);
        
        // Check if there are more records
        hasMoreRecords = result.info?.more_records === true;
        page++;
        
        console.log(`Fetched ${module} page ${page - 1}: ${pageData.length} records, total: ${allData.length}`);
      }
      
      return { 
        module, 
        data: allData,
        totalPages: page - 1,
        totalRecords: allData.length
      };
    };

    // Fetch SMS separately with pagination
    const fetchSMS = async () => {
      let allData = [];
      let page = 1;
      let hasMoreRecords = true;
      
      while (hasMoreRecords) {
        const url = `https://www.zohoapis.com/crm/v2/SMS?per_page=200&page=${page}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`
          }
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch SMS page ${page}:`, response.status);
          break;
        }
        
        const result = await response.json();
        const pageData = result.data || [];
        
        allData = allData.concat(pageData);
        
        hasMoreRecords = result.info?.more_records === true;
        page++;
        
        console.log(`Fetched SMS page ${page - 1}: ${pageData.length} records, total: ${allData.length}`);
      }
      
      return { 
        module: 'SMS', 
        data: allData,
        totalPages: page - 1,
        totalRecords: allData.length
      };
    };

    // Fetch all modules
    const results = await Promise.all([
      ...modules.map(fetchModule),
      fetchSMS()
    ]);
    
    // Format response with pagination info
    const formattedData = {};
    const paginationInfo = {};
    
    results.forEach(({ module, data, totalPages, totalRecords }) => {
      const moduleKey = module.toLowerCase();
      formattedData[moduleKey] = data;
      paginationInfo[moduleKey] = {
        pages: totalPages,
        records: totalRecords
      };
    });

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: formattedData,
      pagination: paginationInfo,
      summary: {
        leads: formattedData.leads?.length || 0,
        deals: formattedData.deals?.length || 0,
        calls: formattedData.calls?.length || 0,
        tasks: formattedData.tasks?.length || 0,
        sms: formattedData.sms?.length || 0,
        notes: formattedData.notes?.length || 0,
        total: Object.values(formattedData).reduce((sum, arr) => sum + (arr?.length || 0), 0)
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
