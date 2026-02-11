import React, { useState, useEffect } from 'react';

export default function JourneyView() {
  const [activeTab, setActiveTab] = useState('leads');
  const [records, setRecords] = useState({ leads: [], deals: [] });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all leads and deals
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/all-data');
        const result = await response.json();
        
        if (result.success) {
          setRecords({
            leads: result.data.leads || [],
            deals: result.data.deals || []
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Fetch journey for selected record
  const fetchJourney = async (module, recordId) => {
    try {
      setJourneyLoading(true);
      setSelectedRecord({ module, recordId });
      
      const response = await fetch(`/api/journey?module=${module}&recordId=${recordId}`);
      const result = await response.json();
      
      if (result.success) {
        setJourney(result);
      } else {
        throw new Error(result.error || 'Failed to fetch journey');
      }
    } catch (err) {
      console.error('Journey fetch error:', err);
      setError(err.message);
    } finally {
      setJourneyLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Render list of leads/deals
  const renderRecordList = () => {
    const currentRecords = activeTab === 'leads' ? records.leads : records.deals;
    const module = activeTab === 'leads' ? 'Leads' : 'Deals';

    return (
      <div className="space-y-2">
        {currentRecords.slice(0, 50).map((record) => {
          const name = activeTab === 'leads'
            ? `${record.First_Name || ''} ${record.Last_Name || ''}`.trim()
            : record.Deal_Name;
          
          const status = activeTab === 'leads' ? record.Lead_Status : record.Stage;
          const owner = record.Owner?.name;

          return (
            <div
              key={record.id}
              onClick={() => fetchJourney(module, record.id)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-600">
                    {status} • {owner}
                  </p>
                  {activeTab === 'leads' && record.Email && (
                    <p className="text-xs text-gray-500 mt-1">📧 {record.Email}</p>
                  )}
                </div>
                <div className="text-right">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    View Journey →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render journey timeline
  const renderJourney = () => {
    if (!journey) return null;

    const { record, timeline, metrics } = journey;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setJourney(null);
              setSelectedRecord(null);
            }}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Back
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{record.name}</h2>
            <p className="text-gray-600">
              {record.company && `${record.company} • `}
              {record.status} • Owned by {record.owner}
            </p>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-700">{metrics.totalActivities}</div>
            <div className="text-sm text-blue-600 mt-1">Total Activities</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-700">{metrics.calls}</div>
            <div className="text-sm text-green-600 mt-1">Calls Made</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-700">{metrics.tasks}</div>
            <div className="text-sm text-purple-600 mt-1">Tasks Created</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="text-3xl font-bold text-orange-700">{metrics.daysSinceCreated}</div>
            <div className="text-sm text-orange-600 mt-1">Days in System</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            Complete Journey Timeline
          </h3>
          
          <div className="space-y-4">
            {timeline.map((event, index) => (
              <div key={index} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl border-2 border-blue-300">
                    {event.icon}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 pb-6">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-blue-600">
                          {formatRelativeTime(event.date)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(event.date)}
                        </div>
                      </div>
                    </div>
                    
                    {event.owner && (
                      <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <span>👤</span>
                        <span>{event.owner}</span>
                      </div>
                    )}

                    {event.priority && (
                      <div className="text-xs mt-2">
                        <span className={`px-2 py-1 rounded ${
                          event.priority === 'High' ? 'bg-red-100 text-red-700' :
                          event.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {event.priority} Priority
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {record.email && (
              <div className="flex items-center gap-2">
                <span className="text-xl">📧</span>
                <div>
                  <div className="text-xs text-gray-600">Email</div>
                  <div className="font-medium">{record.email}</div>
                </div>
              </div>
            )}
            {record.phone && (
              <div className="flex items-center gap-2">
                <span className="text-xl">📱</span>
                <div>
                  <div className="text-xs text-gray-600">Phone</div>
                  <div className="font-medium">{record.phone}</div>
                </div>
              </div>
            )}
            {record.company && (
              <div className="flex items-center gap-2">
                <span className="text-xl">🏢</span>
                <div>
                  <div className="text-xs text-gray-600">Company</div>
                  <div className="font-medium">{record.company}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <div>
                <div className="text-xs text-gray-600">Created</div>
                <div className="font-medium">{formatDate(record.created)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Loading Records...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
      {!journey ? (
        <>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Customer Journey View</h1>
            <p className="text-gray-600">
              Click on any lead or deal to see their complete journey with all interactions
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'leads'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👤 Leads ({records.leads.length})
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'deals'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💰 Deals ({records.deals.length})
            </button>
          </div>

          {/* Records List */}
          {renderRecordList()}
        </>
      ) : journeyLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900">Loading Journey...</h2>
        </div>
      ) : (
        renderJourney()
      )}
    </div>
  );
}
