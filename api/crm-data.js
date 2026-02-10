// Vercel Serverless Function - Fetch data from Zoho CRM via MCP
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
    // MCP Server configuration from environment variables
    const MCP_SERVER_URL = process.env.MCP_SERVER_URL;
    const MCP_SERVER_KEY = process.env.MCP_SERVER_KEY;

    if (!MCP_SERVER_URL || !MCP_SERVER_KEY) {
      return res.status(500).json({ 
        error: 'MCP server credentials not configured',
        message: 'Please add MCP_SERVER_URL and MCP_SERVER_KEY to Vercel environment variables'
      });
    }

    // Field mappings for each module
    const fieldMappings = {
      'Leads': 'id,First_Name,Last_Name,Email,Phone,Company,Lead_Status,Lead_Source,Owner,Created_Time',
      'Deals': 'id,Deal_Name,Amount,Stage,Closing_Date,Owner,Created_Time,Account_Name',
      'Calls': 'id,Subject,Call_Type,Call_Duration,Call_Start_Time,Owner,Related_To',
      'Tasks': 'id,Subject,Status,Priority,Due_Date,Owner,Created_Time',
      'Events': 'id,Event_Title,Start_DateTime,End_DateTime,Venue,Owner,Participants',
      'SMS': 'id,Message,Owner',
      'Notes': 'id,Note_Content,Created_Time,Owner,Parent_Id'
    };

    const fields = fieldMappings[module] || 'id';

    // Call MCP server
    const mcpResponse = await fetch(`${MCP_SERVER_URL}?key=${MCP_SERVER_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'ZohoCRM_Get_Records',
        parameters: {
          path_variables: { module },
          query_params: {
            page: parseInt(page),
            per_page: parseInt(perPage),
            fields
          }
        }
      })
    });

    if (!mcpResponse.ok) {
      throw new Error(`MCP server error: ${mcpResponse.status}`);
    }

    const data = await mcpResponse.json();
    
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
