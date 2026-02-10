// Vercel Serverless Function - Fetch all CRM modules
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const MCP_SERVER_URL = process.env.MCP_SERVER_URL;
    const MCP_SERVER_KEY = process.env.MCP_SERVER_KEY;

    if (!MCP_SERVER_URL || !MCP_SERVER_KEY) {
      return res.status(500).json({ 
        error: 'MCP server credentials not configured'
      });
    }

    // Fetch all modules in parallel
    const modules = ['Leads', 'Deals', 'Calls', 'Tasks', 'Events', 'SMS', 'Notes'];
    const fieldMappings = {
      'Leads': 'id,First_Name,Last_Name,Email,Phone,Company,Lead_Status,Lead_Source,Owner,Created_Time',
      'Deals': 'id,Deal_Name,Amount,Stage,Closing_Date,Owner,Created_Time,Account_Name',
      'Calls': 'id,Subject,Call_Type,Call_Duration,Call_Start_Time,Owner,Related_To',
      'Tasks': 'id,Subject,Status,Priority,Due_Date,Owner,Created_Time',
      'Events': 'id,Event_Title,Start_DateTime,End_DateTime,Venue,Owner,Participants',
      'SMS': 'id,Message,Owner',
      'Notes': 'id,Note_Content,Created_Time,Owner,Parent_Id'
    };

    const fetchModule = async (module) => {
      const response = await fetch(`${MCP_SERVER_URL}?key=${MCP_SERVER_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'ZohoCRM_Get_Records',
          parameters: {
            path_variables: { module },
            query_params: {
              page: 1,
              per_page: 200,
              fields: fieldMappings[module]
            }
          }
        })
      });
      
      const data = await response.json();
      return { module, data: data.data || [], info: data.info || {} };
    };

    const results = await Promise.all(modules.map(fetchModule));
    
    // Format response
    const formattedData = {};
    results.forEach(({ module, data, info }) => {
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
        events: formattedData.events?.length || 0,
        sms: formattedData.sms?.length || 0,
        notes: formattedData.notes?.length || 0
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch CRM data',
      message: error.message 
    });
  }
}
