import React, { useState, useEffect } from 'react';

export default function LiveCRMDashboard() {
  const [activeTab, setActiveTab] = useState('leads');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    leads: [],
    deals: [],
    calls: [],
    tasks: [],
    sms: [],
    notes: []
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/all-data');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array = run once on mount

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatCurrency = (amt) => amt ? `$${amt.toLocaleString()}` : 'N/A';

  const getDateFilterValue = () => {
    const now = new Date();
    switch(dateFilter) {
      case 'today':
        return new Date(now.setHours(0,0,0,0));
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return new Date(yesterday.setHours(0,0,0,0));
      case '7days':
        const week = new Date(now);
        week.setDate(week.getDate() - 7);
        return week;
      case '30days':
        const month = new Date(now);
        month.setDate(month.getDate() - 30);
        return month;
      case '90days':
        const quarter = new Date(now);
        quarter.setDate(quarter.getDate() - 90);
        return quarter;
      case 'all':
      default:
        return new Date('2020-01-01');
    }
  };

  const filterByDate = (items) => {
    if (dateFilter === 'all' || !items) return items;
    
    const cutoffDate = getDateFilterValue();
    
    return items.filter(item => {
      let itemDate;
      
      if (item.Created_Time) {
        itemDate = new Date(item.Created_Time);
      } else if (item.Call_Start_Time) {
        itemDate = new Date(item.Call_Start_Time);
      } else if (item.Start_DateTime) {
        itemDate = new Date(item.Start_DateTime);
      } else if (item.Due_Date) {
        itemDate = new Date(item.Due_Date);
      } else {
        return true;
      }
      
      return itemDate >= cutoffDate;
    });
  };

  const totalValue = data.deals.reduce((sum, d) => sum + (d.Amount || 0), 0);
  const filteredTotalValue = filterByDate(data.deals).reduce((sum, d) => sum + (d.Amount || 0), 0);

  const tabs = [
    { key: 'leads', label: 'Leads', icon: '👤', count: data.leads.length, color: 'purple' },
    { key: 'deals', label: 'Deals', icon: '💰', count: data.deals.length, color: 'green' },
    { key: 'calls', label: 'Calls', icon: '📞', count: data.calls.length, color: 'blue' },
    { key: 'tasks', label: 'Tasks', icon: '✓', count: data.tasks.length, color: 'orange' },
    { key: 'sms', label: 'SMS', icon: '💬', count: data.sms.length, color: 'teal' },
    { key: 'notes', label: 'Notes', icon: '📝', count: data.notes.length, color: 'gray' }
  ];

  const getDisplayData = () => {
    let moduleData;
    switch(activeTab) {
      case 'leads': moduleData = data.leads; break;
      case 'deals': moduleData = data.deals; break;
      case 'calls': moduleData = data.calls; break;
      case 'tasks': moduleData = data.tasks; break;
      case 'sms': moduleData = data.sms; break;
      case 'notes': moduleData = data.notes; break;
      default: moduleData = [];
    }
    return filterByDate(moduleData || []);
  };

  const renderLead = (lead) => (
    <div key={lead.id} className="border-b border-gray-200 py-3 px-4 hover:bg-purple-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">👤</span>
        <span className="font-semibold text-gray-900">{lead.First_Name} {lead.Last_Name}</span>
        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">{lead.Lead_Status}</span>
      </div>
      <div className="ml-7 text-sm text-gray-600">
        <p>📧 {lead.Email || 'No email'} • 📱 {lead.Phone || 'No phone'}</p>
        {lead.Company && <p>🏢 {lead.Company}</p>}
        <p className="text-xs text-gray-500 mt-1">Source: {lead.Lead_Source} • {formatDate(lead.Created_Time)}</p>
      </div>
    </div>
  );

  const renderDeal = (deal) => (
    <div key={deal.id} className="border-b border-gray-200 py-3 px-4 hover:bg-green-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">💰</span>
        <span className="font-semibold text-gray-900">{deal.Deal_Name}</span>
        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">{deal.Stage}</span>
      </div>
      <div className="ml-7 text-sm text-gray-600">
        <p className="font-bold text-green-700">{formatCurrency(deal.Amount)}</p>
        {deal.Account_Name && <p>🏢 {deal.Account_Name.name || deal.Account_Name}</p>}
        <p className="text-xs text-gray-500">Close: {formatDate(deal.Closing_Date)} • Owner: {deal.Owner?.name}</p>
      </div>
    </div>
  );

  const renderCall = (call) => (
    <div key={call.id} className="border-b border-gray-200 py-3 px-4 hover:bg-blue-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">📞</span>
        <span className="font-semibold text-gray-900">{call.Subject}</span>
        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{call.Call_Type}</span>
      </div>
      <div className="ml-7 text-sm text-gray-600">
        <p>⏱️ {call.Call_Duration || 'N/A'} • {formatDate(call.Call_Start_Time)}</p>
        <p className="text-xs text-gray-500">Owner: {call.Owner?.name}</p>
      </div>
    </div>
  );

  const renderTask = (task) => (
    <div key={task.id} className="border-b border-gray-200 py-3 px-4 hover:bg-orange-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">✓</span>
        <span className="font-semibold text-gray-900">{task.Subject}</span>
        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">{task.Status}</span>
      </div>
      <div className="ml-7 text-sm text-gray-600">
        <p>📅 Due: {formatDate(task.Due_Date)} • Priority: {task.Priority}</p>
        <p className="text-xs text-gray-500">Owner: {task.Owner?.name}</p>
      </div>
    </div>
  );

  const renderSms = (sms) => (
    <div key={sms.id} className="border-b border-gray-200 py-3 px-4 hover:bg-teal-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">💬</span>
        <span className="text-xs px-2 py-0.5 bg-teal-100 text-teal-700 rounded">SMS</span>
      </div>
      <div className="ml-7 text-sm text-gray-700">
        <p className="mb-1 bg-teal-50 p-2 rounded">{sms.Message}</p>
        <div className="text-xs text-gray-500">
          <span>👤 {sms.Owner?.name}</span>
        </div>
      </div>
    </div>
  );

  const renderNote = (note) => (
    <div key={note.id} className="border-b border-gray-200 py-3 px-4 hover:bg-gray-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">📝</span>
        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">Note</span>
      </div>
      <div className="ml-7 text-sm text-gray-700">
        <p className="mb-1">{note.Note_Content}</p>
        <div className="text-xs text-gray-500">
          <span>👤 {note.Owner?.name}</span>
          <span className="ml-3">📅 {formatDate(note.Created_Time)}</span>
        </div>
      </div>
    </div>
  );

  const renderItem = (item) => {
    switch(activeTab) {
      case 'leads': return renderLead(item);
      case 'deals': return renderDeal(item);
      case 'calls': return renderCall(item);
      case 'tasks': return renderTask(item);
      case 'sms': return renderSms(item);
      case 'notes': return renderNote(item);
      default: return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading CRM Data...</h2>
          <p className="text-gray-600">Fetching live data from Zoho CRM</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <span className="text-6xl mb-4 block">⚠️</span>
          <h2 className="text-2xl font-bold text-red-900 mb-2">Error Loading Data</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Live CRM Dashboard</h1>
        <p className="text-gray-600">Pinky's Iron Doors - Real-time Zoho Data 🔄</p>
        <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <p className="text-sm font-semibold text-gray-900">✅ LIVE DATA CONNECTION!</p>
          <p className="text-xs text-gray-700 mt-1">
            {data.leads.length} Leads • {data.deals.length} Deals (${(totalValue/1000).toFixed(0)}K total) • {data.calls.length} Calls • {data.tasks.length} Tasks • {data.sms.length} SMS • {data.notes.length} Notes
          </p>
          <p className="text-xs text-blue-600 mt-1">
            🔄 Data updates in real-time from Zoho CRM
          </p>
          {dateFilter !== 'all' && (
            <p className="text-xs text-green-700 mt-1 font-medium">
              📊 Filtered View: ${(filteredTotalValue/1000).toFixed(0)}K in deals
            </p>
          )}
        </div>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700 flex items-center">📅 Filter:</span>
        {[
          { key: 'today', label: 'Today' },
          { key: 'yesterday', label: 'Yesterday' },
          { key: '7days', label: 'Last 7 Days' },
          { key: '30days', label: 'Last 30 Days' },
          { key: '90days', label: 'Last 90 Days' },
          { key: 'all', label: 'All Time' }
        ].map(filter => (
          <button
            key={filter.key}
            onClick={() => setDateFilter(filter.key)}
            className={`px-3 py-1 text-sm rounded ${
              dateFilter === filter.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
        <span className="text-xs text-gray-500 flex items-center ml-2">
          Showing {getDisplayData().length} of {
            activeTab === 'leads' ? data.leads.length :
            activeTab === 'deals' ? data.deals.length :
            activeTab === 'calls' ? data.calls.length :
            activeTab === 'tasks' ? data.tasks.length :
            activeTab === 'sms' ? data.sms.length :
            data.notes.length
          } records
        </span>
      </div>

      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.key 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-h-[600px] overflow-y-auto">
        {getDisplayData().length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <span className="text-4xl block mb-2">📭</span>
            No {activeTab} found for the selected date range
          </div>
        ) : (
          getDisplayData().map(renderItem)
        )}
      </div>
    </div>
  );
}