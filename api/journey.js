// Vercel Serverless Function - Fetch complete journey for a Lead or Deal
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { module, recordId } = req.query;

  if (!module || !recordId) {
    return res.status(400).json({ 
      error: 'Missing required parameters',
      message: 'Please provide both module (Leads/Deals) and recordId'
    });
  }

  try {
    const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
    const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
    const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;

    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
      return res.status(500).json({ error: 'Zoho credentials not configured' });
    }

    // Get access token
    const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

    // Fetch the main record (Lead or Deal)
    const recordUrl = `https://www.zohoapis.com/crm/v2/${module}/${recordId}`;
    const recordResponse = await fetch(recordUrl, {
      headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
    });

    if (!recordResponse.ok) {
      throw new Error(`Failed to fetch ${module} record: ${recordResponse.status}`);
    }

    const recordData = await recordResponse.json();
    const mainRecord = recordData.data?.[0];

    if (!mainRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Fetch all related activities in parallel
    const relatedModules = [
      { name: 'Calls', endpoint: 'Calls' },
      { name: 'Tasks', endpoint: 'Tasks' },
      { name: 'Events', endpoint: 'Events' },
      { name: 'Notes', endpoint: 'Notes' },
      { name: 'SMS', endpoint: 'SMS' }
    ];

    const fetchRelated = async (moduleName, endpoint) => {
      // Search for records related to this lead/deal
      const searchUrl = `https://www.zohoapis.com/crm/v2/${endpoint}/search?criteria=(Related_To:equals:${recordId})`;
      
      try {
        const response = await fetch(searchUrl, {
          headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
        });

        if (!response.ok) {
          console.log(`No ${moduleName} found for record ${recordId}`);
          return { module: moduleName, data: [] };
        }

        const result = await response.json();
        return { 
          module: moduleName, 
          data: result.data || []
        };
      } catch (error) {
        console.error(`Error fetching ${moduleName}:`, error);
        return { module: moduleName, data: [] };
      }
    };

    const relatedData = await Promise.all(
      relatedModules.map(({ name, endpoint }) => fetchRelated(name, endpoint))
    );

    // Format the journey
    const journey = {
      record: {
        id: mainRecord.id,
        module: module,
        name: module === 'Leads' 
          ? `${mainRecord.First_Name || ''} ${mainRecord.Last_Name || ''}`.trim()
          : mainRecord.Deal_Name,
        status: module === 'Leads' ? mainRecord.Lead_Status : mainRecord.Stage,
        owner: mainRecord.Owner?.name,
        email: mainRecord.Email,
        phone: mainRecord.Phone || mainRecord.Mobile,
        company: mainRecord.Company || mainRecord.Account_Name?.name,
        created: mainRecord.Created_Time,
        modified: mainRecord.Modified_Time
      },
      activities: {}
    };

    // Add all related activities
    relatedData.forEach(({ module, data }) => {
      journey.activities[module.toLowerCase()] = data;
    });

    // Create chronological timeline
    const timeline = [];

    // Add record creation
    timeline.push({
      type: 'created',
      date: mainRecord.Created_Time,
      title: `${module.slice(0, -1)} Created`,
      description: `${journey.record.name} entered the system`,
      icon: '🎯',
      owner: mainRecord.Owner?.name
    });

    // Add calls
    journey.activities.calls?.forEach(call => {
      timeline.push({
        type: 'call',
        date: call.Call_Start_Time || call.Created_Time,
        title: call.Subject || 'Call',
        description: `${call.Call_Type || 'Call'} - ${call.Call_Duration || 'N/A'}`,
        icon: '📞',
        owner: call.Owner?.name,
        details: call
      });
    });

    // Add tasks
    journey.activities.tasks?.forEach(task => {
      timeline.push({
        type: 'task',
        date: task.Created_Time,
        title: task.Subject || 'Task',
        description: `${task.Status} - Due: ${task.Due_Date || 'N/A'}`,
        icon: '✓',
        priority: task.Priority,
        owner: task.Owner?.name,
        details: task
      });
    });

    // Add SMS
    journey.activities.sms?.forEach(sms => {
      timeline.push({
        type: 'sms',
        date: sms.Created_Time,
        title: 'SMS Message',
        description: sms.Message?.substring(0, 100) + (sms.Message?.length > 100 ? '...' : ''),
        icon: '💬',
        owner: sms.Owner?.name,
        details: sms
      });
    });

    // Add notes
    journey.activities.notes?.forEach(note => {
      timeline.push({
        type: 'note',
        date: note.Created_Time,
        title: 'Note Added',
        description: note.Note_Content?.substring(0, 100) + (note.Note_Content?.length > 100 ? '...' : ''),
        icon: '📝',
        owner: note.Owner?.name,
        details: note
      });
    });

    // Sort timeline by date (most recent first)
    timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate journey metrics
    const metrics = {
      totalActivities: timeline.length - 1, // Exclude creation event
      calls: journey.activities.calls?.length || 0,
      tasks: journey.activities.tasks?.length || 0,
      sms: journey.activities.sms?.length || 0,
      notes: journey.activities.notes?.length || 0,
      daysSinceCreated: Math.floor((new Date() - new Date(mainRecord.Created_Time)) / (1000 * 60 * 60 * 24)),
      lastActivity: timeline[0]?.date
    };

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      journey,
      timeline,
      metrics
    });

  } catch (error) {
    console.error('Journey API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch journey data',
      message: error.message 
    });
  }
}
