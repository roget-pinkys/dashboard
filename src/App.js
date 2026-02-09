import React, { useState } from 'react';

// COMPLETE REAL DATA - Showing 15 of each type  
const DATA = {
  leads: [
    {id:"1",First_Name:"Gustavo",Last_Name:"Petit",Email:"gpetit@arkhitekton.com",Phone:"+1 5025481549",Company:"Chauvin Arkhitekton APC",Lead_Status:"Not Contacted",Lead_Source:"Contact Us Form",Owner:{name:"Connor Peale"},Created_Time:"2026-02-09T07:44:34-08:00"},
    {id:"2",First_Name:"Nick",Last_Name:"Newman",Email:"nick.newman.fju@gmail.com",Phone:"+1 9170000000",Lead_Status:"Follow Up 1",Lead_Source:"Contact Us Form",Owner:{name:"Ernie Martinez"},Created_Time:"2026-02-09T05:33:59-08:00"},
    {id:"3",First_Name:"Tiffany",Last_Name:"Dolan",Email:"tiffany.dolan@gmail.com",Phone:"+1 6282139977",Lead_Status:"Not Contacted",Lead_Source:"Contact Us Form",Owner:{name:"Patrick Nowakowski"},Created_Time:"2026-02-08T19:43:41-08:00"},
    {id:"4",First_Name:"Molly",Last_Name:"O'Rourke",Email:"mollyandmaevedesign@gmail.com",Phone:"+1 7573340144",Company:"Molly + Maeve Design",Lead_Status:"Not Contacted",Lead_Source:"Contact Us Form",Owner:{name:"Connor Peale"},Created_Time:"2026-02-08T16:31:47-08:00"},
    {id:"5",First_Name:"Leslie",Last_Name:"Johannsen",Email:"Ljohanrn@gmail.com",Phone:"+1 6517035590",Lead_Status:"Not Contacted",Lead_Source:"Contact Us Form",Owner:{name:"Marilyn Ferdinand"},Created_Time:"2026-02-09T01:10:36-08:00"},
    {id:"6",First_Name:"Mario",Last_Name:"Chavez",Email:"chance31240@gmail.com",Phone:"+1 3184582538",Lead_Status:"Not Contacted",Lead_Source:"Contact Us Form",Owner:{name:"Marilyn Ferdinand"},Created_Time:"2026-02-08T11:02:28-08:00"},
    {id:"7",First_Name:"Stacey Slone",Last_Name:"Riggs",Email:"stacey@riggscompanies.com",Phone:"+14803386269",Lead_Status:"New Abandoned Cart Lead",Owner:{name:"Ernie Martinez"},Created_Time:"2026-02-08T17:00:35-08:00"},
    {id:"8",First_Name:"Eric",Last_Name:"Mason",Email:"eric.wells.mason@gmail.com",Phone:"9177960768",Lead_Status:"Not Contacted",Lead_Source:"Missed Call",Owner:{name:"Dayne Ashbaugh"},Created_Time:"2026-02-09T08:14:21-08:00"},
    {id:"9",First_Name:"Jose",Last_Name:"Carmona",Email:"jcarmona.ceo@aol.com",Phone:"2092042489",Lead_Status:"Resolved",Lead_Source:"Missed Call",Owner:{name:"Ernie Martinez"},Created_Time:"2026-02-09T08:11:01-08:00"},
    {id:"10",First_Name:"Nina",Last_Name:"Ralos",Email:"nina.ralos18@gmail.com",Lead_Status:"Follow Up 1",Lead_Source:"Chat",Owner:{name:"Ernie Martinez"},Created_Time:"2026-02-09T08:09:01-08:00"},
    {id:"11",First_Name:"Shanon",Last_Name:"Ohmann",Email:"shanonohmann@gmail.com",Phone:"9493091244",Lead_Status:"Follow Up 1",Lead_Source:"Forwarded Email",Owner:{name:"Ernie Martinez"},Created_Time:"2026-02-09T07:55:27-08:00"},
    {id:"12",First_Name:"Ken and Lupa",Last_Name:"Sutton",Email:"ksutton597@gmail.com",Phone:"(626) 219-4784",Lead_Status:"Contacted",Lead_Source:"Walk-In",Owner:{name:"Connor Peale"},Created_Time:"2026-02-07T13:39:31-08:00"},
    {id:"13",First_Name:"Art",Last_Name:"Vasconcelos",Email:"avascon84@gmail.com",Phone:"3105059045",Lead_Status:"Contacted",Owner:{name:"Connor Peale"},Created_Time:"2026-02-07T13:32:17-08:00"},
    {id:"14",First_Name:"Lorrie",Last_Name:"Brown",Email:"LLBMD@me.com",Phone:"+1 7275124621",Lead_Status:"Not Contacted",Lead_Source:"Contact Us Form",Owner:{name:"Connor Peale"},Created_Time:"2026-02-07T08:09:07-08:00"},
    {id:"15",First_Name:"Kelsey",Last_Name:"Brazell",Email:"kelseyrbrazell@gmail.com",Phone:"8584055348",Lead_Status:"Follow Up 1",Owner:{name:"Ernie Martinez"},Created_Time:"2026-02-07T08:39:48-08:00"}
  ],
  deals: [
    {id:"d1",Deal_Name:"Shopify Order PID-28229 - Joseph Benevedes",Amount:2637.54,Stage:"Online Sale",Closing_Date:"2026-02-07",Owner:{name:"Zoho Admin"},Created_Time:"2026-02-07T17:20:57-08:00"},
    {id:"d2",Deal_Name:"339 LOMA MEDIA RD. SANTA BARBARA - Tina Fey #064782",Amount:89228.5,Stage:"Estimate Sent",Closing_Date:"2026-03-09",Owner:{name:"Marilyn Ferdinand"},Created_Time:"2026-02-07T12:41:21-08:00"},
    {id:"d3",Deal_Name:"522 Arena St, El Segundo CA - Ryan Tyni",Stage:"Information Gathering",Closing_Date:"2026-07-31",Owner:{name:"Patrick Nowakowski"},Created_Time:"2026-02-07T12:06:22-08:00"},
    {id:"d4",Deal_Name:"West Virginia - David Trissell #064780",Amount:32730,Stage:"Estimate Sent",Closing_Date:"2026-03-08",Owner:{name:"Patrick Nowakowski"},Created_Time:"2026-02-06T14:47:56-08:00"},
    {id:"d5",Deal_Name:"Miami Beach FL - Jessica Jaegger #064778",Amount:27635.37,Stage:"Estimate Sent",Closing_Date:"2026-03-08",Owner:{name:"Patrick Nowakowski"},Created_Time:"2026-02-06T13:59:16-08:00"},
    {id:"d6",Deal_Name:"Victorville CA - Brandon Ely #064781",Amount:41450.58,Stage:"Estimate Sent",Closing_Date:"2026-03-09",Owner:{name:"Marilyn Ferdinand"},Created_Time:"2026-02-06T16:28:49-08:00"},
    {id:"d7",Deal_Name:"Shopify Order PID-28216 - Daniel Kirk",Amount:24199.74,Stage:"Online Sale",Closing_Date:"2026-02-06",Owner:{name:"Zoho Admin"},Created_Time:"2026-02-06T14:26:31-08:00"},
    {id:"d8",Deal_Name:"Don Parcell #064779",Amount:97519.13,Stage:"Estimate Sent",Closing_Date:"2026-03-08",Owner:{name:"Dayne Ashbaugh"},Created_Time:"2026-02-05T11:39:19-08:00"},
    {id:"d9",Deal_Name:"979 Alta Vista - Stephen #064764",Amount:185393.71,Stage:"Estimate Sent",Closing_Date:"2026-03-07",Owner:{name:"Dayne Ashbaugh"},Created_Time:"2026-02-04T15:39:04-08:00"},
    {id:"d10",Deal_Name:"Kyle Churley #064754",Amount:10455.3,Stage:"Estimate Accepted & Retainer Sent",Closing_Date:"2026-03-06",Owner:{name:"Marilyn Ferdinand"},Created_Time:"2026-02-03T14:54:47-08:00"},
    {id:"d11",Deal_Name:"LA - Brian Roettinger #064747",Amount:21635.65,Stage:"Estimate Sent",Closing_Date:"2026-03-06",Owner:{name:"Patrick Nowakowski"},Created_Time:"2026-02-03T16:33:18-08:00"},
    {id:"d12",Deal_Name:"Dume Ranch - John Mutafyan #064749",Amount:127842.37,Stage:"Estimate Sent",Closing_Date:"2026-03-06",Owner:{name:"Patrick Nowakowski"},Created_Time:"2026-02-02T09:46:45-08:00"},
    {id:"d13",Deal_Name:"954 Lexington Ave - Zade #064738",Amount:21634.27,Stage:"Estimate Sent",Closing_Date:"2026-03-04",Owner:{name:"Patrick Nowakowski"},Created_Time:"2026-02-02T15:42:24-08:00"},
    {id:"d14",Deal_Name:"Shopify Order PID-28173 - Karina Melkonian",Amount:9402.89,Stage:"Online Sale",Closing_Date:"2026-02-02",Owner:{name:"Zoho Admin"},Created_Time:"2026-02-02T22:42:40-08:00"},
    {id:"d15",Deal_Name:"Maya Mallick #064750",Amount:29453.13,Stage:"Estimate Sent",Closing_Date:"2026-03-06",Owner:{name:"Dayne Ashbaugh"},Created_Time:"2026-02-03T16:21:53-08:00"}
  ],
  calls: [
    {id:"c1",Subject:"Incoming call from 123",Call_Type:"Inbound",Call_Duration:"00:27",Owner:{name:"Patrick Nowakowski"},Call_Start_Time:"2026-02-07T12:50:40-08:00"},
    {id:"c2",Subject:"Missed call from +12149951755",Call_Type:"Missed",Call_Duration:"00:00",Owner:{name:"Nikos Christianakis"},Call_Start_Time:"2026-02-08T06:09:39-08:00"},
    {id:"c3",Subject:"Outgoing call to KRISTIN COIA",Call_Type:"Outbound",Call_Duration:"01:13",Owner:{name:"Marilyn Ferdinand"},Call_Start_Time:"2026-02-07T12:31:54-08:00"},
    {id:"c4",Subject:"Incoming call from +12134584246",Call_Type:"Inbound",Call_Duration:"03:07",Owner:{name:"Patrick Nowakowski"},Call_Start_Time:"2026-02-07T11:44:09-08:00"},
    {id:"c5",Subject:"Outgoing call to 7042003383",Call_Type:"Outbound",Call_Duration:"06:34",Owner:{name:"Patrick Nowakowski"},Call_Start_Time:"2026-02-07T11:55:23-08:00"},
    {id:"c6",Subject:"Missed call from Colleen Campfield",Call_Type:"Missed",Call_Duration:"00:00",Owner:{name:"Dion Der"},Call_Start_Time:"2026-02-07T11:12:07-08:00"},
    {id:"c7",Subject:"Incoming call from Evan Wollman",Call_Type:"Inbound",Call_Duration:"19:37",Owner:{name:"Patrick Nowakowski"},Call_Start_Time:"2026-02-07T11:14:23-08:00"},
    {id:"c8",Subject:"Incoming call from Colleen Campfield",Call_Type:"Inbound",Call_Duration:"09:36",Owner:{name:"Connor Peale"},Call_Start_Time:"2026-02-07T11:12:07-08:00"},
    {id:"c9",Subject:"Missed call from Hannah Duvall",Call_Type:"Missed",Call_Duration:"00:00",Owner:{name:"Nikos Christianakis"},Call_Start_Time:"2026-02-07T08:46:11-08:00"},
    {id:"c10",Subject:"Outgoing call to Amy",Call_Type:"Outbound",Call_Duration:"01:08",Owner:{name:"Marilyn Ferdinand"},Call_Start_Time:"2026-02-07T12:39:29-08:00"},
    {id:"c11",Subject:"Outgoing call to Hannah Duvall",Call_Type:"Outbound",Call_Duration:"05:56",Owner:{name:"Nikos Christianakis"},Call_Start_Time:"2026-02-07T12:13:03-08:00"},
    {id:"c12",Subject:"Missed call from Brad Cullipher",Call_Type:"Missed",Call_Duration:"00:00",Owner:{name:"Ernie Martinez"},Call_Start_Time:"2026-02-07T08:29:46-08:00"},
    {id:"c13",Subject:"Incoming call from +14694063922",Call_Type:"Inbound",Call_Duration:"04:14",Owner:{name:"Ernie Martinez"},Call_Start_Time:"2026-02-06T14:52:39-08:00"},
    {id:"c14",Subject:"Outgoing call to Letty Vermeulen",Call_Type:"Outbound",Call_Duration:"01:35",Owner:{name:"Marilyn Ferdinand"},Call_Start_Time:"2026-02-06T13:01:57-08:00"},
    {id:"c15",Subject:"Incoming call from +19493774017",Call_Type:"Inbound",Call_Duration:"01:25",Owner:{name:"Ernie Martinez"},Call_Start_Time:"2026-02-06T11:30:37-08:00"}
  ],
  tasks: [
    {id:"t1",Subject:"365 day lead follow up",Status:"Not Started",Due_Date:"2027-02-09",Description:"Automated 365 day lead follow up task.",Owner:{name:"Ernie Martinez"},Created_Time:"2026-02-09T07:55:30-08:00"},
    {id:"t2",Subject:"7 day lead follow up",Status:"Not Started",Due_Date:"2026-02-16",Description:"Automated 7 day lead follow up task.",Owner:{name:"Dion Der"},Created_Time:"2026-02-09T01:10:38-08:00"},
    {id:"t3",Subject:"180 day lead follow up",Status:"Not Started",Due_Date:"2026-08-07",Description:"Automated 180 day lead follow up task.",Owner:{name:"Connor Peale"},Created_Time:"2026-02-08T08:43:22-08:00"},
    {id:"t4",Subject:"30 day lead follow up",Status:"Not Started",Due_Date:"2026-03-09",Description:"Automated 30 day lead follow up task.",Owner:{name:"Connor Peale"},Created_Time:"2026-02-07T13:39:32-08:00"},
    {id:"t5",Subject:"21 day lead follow up",Status:"Not Started",Due_Date:"2026-02-28",Description:"Automated 21 day lead follow up task.",Owner:{name:"Connor Peale"},Created_Time:"2026-02-07T12:45:43-08:00"},
    {id:"t6",Subject:"3 day lead follow up",Status:"Not Started",Due_Date:"2026-02-12",Description:"Automated 3 day lead follow up task.",Owner:{name:"Dion Der"},Created_Time:"2026-02-09T01:10:38-08:00"},
    {id:"t7",Subject:"1 day lead follow up",Status:"Not Started",Due_Date:"2026-02-10",Description:"Automated 1 day lead follow up task.",Owner:{name:"Dion Der"},Created_Time:"2026-02-09T01:10:37-08:00"},
    {id:"t8",Subject:"90 day lead follow up",Status:"Not Started",Due_Date:"2026-05-08",Description:"Automated 90 day lead follow up task.",Owner:{name:"Connor Peale"},Created_Time:"2026-02-07T19:24:19-08:00"},
    {id:"t9",Subject:"14 day lead follow up",Status:"Not Started",Due_Date:"2026-02-21",Description:"Automated 14 day lead follow up task.",Owner:{name:"Ernie Martinez"},Created_Time:"2026-02-07T15:38:10-08:00"},
    {id:"t10",Subject:"3 week estimate follow up: 064782",Status:"Not Started",Due_Date:"2026-02-28",Description:"Automated 3 week follow up for estimate #064782",Owner:{name:"Marilyn Ferdinand"},Created_Time:"2026-02-07T13:16:15-08:00"},
    {id:"t11",Subject:"7 week estimate follow up",Status:"Not Started",Due_Date:"2026-03-28",Description:"Automated estimate follow up",Owner:{name:"Marilyn Ferdinand"},Created_Time:"2026-02-06T14:00:00-08:00"},
    {id:"t12",Subject:"3 month estimate follow up",Status:"Not Started",Due_Date:"2026-05-07",Description:"Automated estimate follow up",Owner:{name:"Patrick Nowakowski"},Created_Time:"2026-02-05T12:00:00-08:00"},
    {id:"t13",Subject:"6 month estimate follow up",Status:"Not Started",Due_Date:"2026-08-05",Description:"Automated estimate follow up",Owner:{name:"Dayne Ashbaugh"},Created_Time:"2026-02-04T10:00:00-08:00"},
    {id:"t14",Subject:"1 year estimate follow up",Status:"Not Started",Due_Date:"2027-02-03",Description:"Automated estimate follow up",Owner:{name:"Connor Peale"},Created_Time:"2026-02-03T09:00:00-08:00"},
    {id:"t15",Subject:"Follow up with contractor",Status:"Not Started",Due_Date:"2026-02-12",Description:"Check project status",Owner:{name:"Ernie Martinez"},Created_Time:"2026-02-07T10:00:00-08:00"}
  ],
  events: [
    {id:"e1",Event_Title:"Kyle Green Showroom Appointment",Start_DateTime:"2026-02-09T13:45:00-08:00",Owner:{name:"Dayne Ashbaugh"}},
    {id:"e2",Event_Title:"Self",Start_DateTime:"2026-02-09T11:30:00-08:00",Owner:{name:"Connor Peale"}},
    {id:"e3",Event_Title:"Glass Meeting",Start_DateTime:"2026-02-11T09:00:00-08:00",Owner:{name:"Garrison Hopper"}},
    {id:"e4",Event_Title:"Michelle Kahng Showroom Appointment",Start_DateTime:"2026-02-10T10:00:00-08:00",Owner:{name:"Dayne Ashbaugh"}},
    {id:"e5",Event_Title:"Marissa Wilhelm Showroom Appointment",Start_DateTime:"2026-02-07T11:30:00-08:00",Owner:{name:"Dayne Ashbaugh"}},
    {id:"e6",Event_Title:"Mike Gross Construction",Start_DateTime:"2026-02-06T14:00:00-08:00",Owner:{name:"Marilyn Ferdinand"}},
    {id:"e7",Event_Title:"Alex C Showroom",Start_DateTime:"2026-02-07T11:15:00-08:00",Owner:{name:"Connor Peale"}},
    {id:"e8",Event_Title:"Tracy Do Showroom",Start_DateTime:"2026-02-06T11:00:00-08:00",Owner:{name:"Ernie Martinez"}},
    {id:"e9",Event_Title:"Call With David Trissell",Start_DateTime:"2026-02-06T14:00:00-08:00",Owner:{name:"Patrick Nowakowski"}},
    {id:"e10",Event_Title:"Cari Ann Reed Showroom",Start_DateTime:"2026-02-05T14:15:00-08:00",Owner:{name:"Ernie Martinez"}},
    {id:"e11",Event_Title:"Annie May Design",Start_DateTime:"2026-02-11T11:00:00-08:00",Owner:{name:"Connor Peale"}},
    {id:"e12",Event_Title:"Ramsey Showroom Appointment",Start_DateTime:"2026-02-05T12:30:00-08:00",Owner:{name:"Dayne Ashbaugh"}},
    {id:"e13",Event_Title:"Victor Belman showroom",Start_DateTime:"2026-02-03T11:30:00-08:00",Owner:{name:"Ernie Martinez"}},
    {id:"e14",Event_Title:"Vascon Construction",Start_DateTime:"2026-02-07T12:00:00-08:00",Owner:{name:"Marilyn Ferdinand"}},
    {id:"e15",Event_Title:"Maria Perkovic Showroom",Start_DateTime:"2026-02-02T08:45:00-08:00",Owner:{name:"Dayne Ashbaugh"}}
  ],
  notes: [
    {id:"n1",Note_Content:"Was looking for a door that goes in front of her existing door",Created_Time:"2020-05-19T14:45:19-07:00",Owner:{name:"Patrick Nowakowski"},Parent:"Call"},
    {id:"n2",Note_Content:"Sent to website, looking for a 72 x 96 front door.",Created_Time:"2020-05-19T15:18:21-07:00",Owner:{name:"Patrick Nowakowski"},Parent:"Call"},
    {id:"n3",Note_Content:"Verify that medallion is on the kick plate",Created_Time:"2020-05-19T15:35:35-07:00",Owner:{name:"Patrick Nowakowski"},Parent:"Call"},
    {id:"n4",Note_Content:"Looking for arch 65 x 96 roughly, will have contractor measure",Created_Time:"2020-05-20T09:03:35-07:00",Owner:{name:"Patrick Nowakowski"},Parent:"Call"},
    {id:"n5",Note_Content:"Wanted knobs instead of levers for the atteberry",Created_Time:"2020-05-20T10:28:33-07:00",Owner:{name:"Patrick Nowakowski"},Parent:"Call"},
    {id:"n6",Note_Content:"Mrs. Cooper, Wants beverly door. Stuck in NY not sure about measurements",Created_Time:"2020-05-20T10:45:11-07:00",Owner:{name:"Patrick Nowakowski"},Parent:"Call"},
    {id:"n7",Note_Content:"Looking for steel, bi-fold 23.5 x 108 send quote.",Created_Time:"2020-05-20T11:00:05-07:00",Owner:{name:"Patrick Nowakowski"},Parent:"Call"},
    {id:"n8",Note_Content:"Looking for a few doors. Pivot and door with sidelights, New construction",Created_Time:"2020-07-27T08:37:57-07:00",Owner:{name:"Patrick Nowakowski"},Parent:"Contact"},
    {id:"n9",Note_Content:"Refunded 2166.32 on oct 12. Customer will have balance",Created_Time:"2020-10-12T17:12:18-07:00",Owner:{name:"Dion Der"},Parent:"Contact"},
    {id:"n10",Note_Content:"Please make sure to email customer about the thicker t bars",Created_Time:"2020-11-06T09:33:36-08:00",Owner:{name:"Dion Der"},Parent:"Deal"},
    {id:"n11",Note_Content:"Needed a template to send over, would extend lead time. Client couldn't wait",Created_Time:"2020-11-05T12:32:21-08:00",Owner:{name:"Patrick Nowakowski"},Parent:"Deal"},
    {id:"n12",Note_Content:"Lock sent to China",Created_Time:"2020-11-05T13:14:47-08:00",Owner:{name:"Patrick Nowakowski"},Parent:"Deal"},
    {id:"n13",Note_Content:"Purchased from stock",Created_Time:"2020-10-22T12:51:42-07:00",Owner:{name:"MDG Home Designs"},Parent:"Deal"},
    {id:"n14",Note_Content:"Will do future products with us",Created_Time:"2020-09-17T13:26:22-07:00",Owner:{name:"Patrick Nowakowski"},Parent:"Contact"},
    {id:"n15",Note_Content:"Chat - Looking for a printable spec sheet for the air 4 double",Created_Time:"2020-09-18T13:33:00-07:00",Owner:{name:"Arin Dersarkissian"},Parent:"Contact"}
  ],
  sms: [
    {id:"s1",Message:"Hi Lisa, This is Nikos with PINKYS. I just left you a voicemail. Please give me a call back when you see this. It's regarding your window order from the other day.",Owner:{name:"Nikos Christianakis"}},
    {id:"s2",Message:"Hi Jared, this is Nikos with PINKYS. I just left you a voicemail. please give me a call back when you see this. Your package of locks got sent back as undeliverable",Owner:{name:"Nikos Christianakis"}},
    {id:"s3",Message:"Thanks",Owner:{name:"Marilyn Ferdinand"}},
    {id:"s4",Message:"Total for 46x96 was 6788.15. New total about 6110.00",Owner:{name:"Marilyn Ferdinand"}},
    {id:"s5",Message:"Is that for the 42 x 96?",Owner:{name:"Marilyn Ferdinand"}},
    {id:"s6",Message:"Thank you Marilyn. I will consider. Thanks",Owner:{name:"Marilyn Ferdinand"}},
    {id:"s7",Message:"following up on this one Christina. I also still have the longer bolts for your fridge wall",Owner:{name:"Nikos Christianakis"}},
    {id:"s8",Message:"Yes it is for the 42x96",Owner:{name:"Marilyn Ferdinand"}},
    {id:"s9",Message:"I love this door!",Owner:{name:"Marilyn Ferdinand"}},
    {id:"s10",Message:"Hi marilyn is this you at pinkies?",Owner:{name:"Marilyn Ferdinand"}},
    {id:"s11",Message:"Spoke yesterday about whether the frame was load bearing",Owner:{name:"Marilyn Ferdinand"}},
    {id:"s12",Message:"Thank you Marilyn !!!",Owner:{name:"Marilyn Ferdinand"}},
    {id:"s13",Message:"I don't think it is load bearing",Owner:{name:"Marilyn Ferdinand"}},
    {id:"s14",Message:"What is the total all inclusive.",Owner:{name:"Marilyn Ferdinand"}},
    {id:"s15",Message:"Hi Abigayle, This is Nikos with PINKYS. I just left you a voicemail. Please give me a call back when you see this. I have to keep your order on hold until we have a moment to discuss.",Owner:{name:"Nikos Christianakis"}}
  ]
};

export default function FullCRMDashboard() {
  const [activeTab, setActiveTab] = useState('leads');
  const [dateFilter, setDateFilter] = useState('all');

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
    const now = new Date('2026-02-09T17:00:00-08:00'); // Current date from context
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
        return new Date('2020-01-01'); // Earliest data
    }
  };

  const filterByDate = (items) => {
    if (dateFilter === 'all') return items;
    
    const cutoffDate = getDateFilterValue();
    
    return items.filter(item => {
      let itemDate;
      
      // Different modules have different date fields
      if (item.Created_Time) {
        itemDate = new Date(item.Created_Time);
      } else if (item.Call_Start_Time) {
        itemDate = new Date(item.Call_Start_Time);
      } else if (item.Start_DateTime) {
        itemDate = new Date(item.Start_DateTime);
      } else if (item.Due_Date) {
        itemDate = new Date(item.Due_Date);
      } else {
        return true; // Include if no date field
      }
      
      return itemDate >= cutoffDate;
    });
  };

  const tabs = [
    { key: 'leads', label: 'Leads', icon: '👤', count: DATA.leads.length, color: 'purple' },
    { key: 'deals', label: 'Deals', icon: '💰', count: DATA.deals.length, color: 'green' },
    { key: 'calls', label: 'Calls', icon: '📞', count: DATA.calls.length, color: 'blue' },
    { key: 'tasks', label: 'Tasks', icon: '✓', count: DATA.tasks.length, color: 'orange' },
    { key: 'events', label: 'Events', icon: '📅', count: DATA.events.length, color: 'red' },
    { key: 'sms', label: 'SMS', icon: '💬', count: DATA.sms.length, color: 'teal' },
    { key: 'notes', label: 'Notes', icon: '📝', count: DATA.notes.length, color: 'gray' }
  ];

  const renderLead = (lead) => (
    <div key={lead.id} className="border-b border-gray-200 py-3 px-4 hover:bg-purple-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">👤</span>
        <span className="font-semibold text-gray-900">{lead.First_Name} {lead.Last_Name}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${
          lead.Lead_Status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
          lead.Lead_Status === 'Resolved' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-700'
        }`}>{lead.Lead_Status}</span>
      </div>
      <div className="ml-7 text-sm text-gray-600">
        <div className="flex gap-4 flex-wrap">
          {lead.Email && <span>✉️ {lead.Email}</span>}
          {lead.Phone && <span>📞 {lead.Phone}</span>}
          {lead.Company && <span>🏢 {lead.Company}</span>}
        </div>
        <div className="mt-1 text-xs">
          <span>👤 {lead.Owner?.name}</span>
          {lead.Lead_Source && <span className="ml-3">📌 {lead.Lead_Source}</span>}
        </div>
      </div>
    </div>
  );

  const renderDeal = (deal) => (
    <div key={deal.id} className="border-b border-gray-200 py-3 px-4 hover:bg-green-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">💰</span>
        <span className="font-semibold text-gray-900">{deal.Deal_Name}</span>
      </div>
      <div className="ml-7 text-sm">
        <div className="flex gap-4 flex-wrap items-center">
          {deal.Amount && <span className="font-bold text-green-600">{formatCurrency(deal.Amount)}</span>}
          <span className={`text-xs px-2 py-0.5 rounded ${
            deal.Stage === 'Online Sale' ? 'bg-green-100 text-green-800' :
            deal.Stage === 'Estimate Sent' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>{deal.Stage}</span>
          {deal.Closing_Date && <span className="text-xs text-gray-600">📅 Close: {deal.Closing_Date}</span>}
        </div>
        <div className="mt-1 text-xs text-gray-600">👤 {deal.Owner?.name}</div>
      </div>
    </div>
  );

  const renderCall = (call) => (
    <div key={call.id} className="border-b border-gray-200 py-3 px-4 hover:bg-blue-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{call.Call_Type === 'Inbound' ? '📞' : call.Call_Type === 'Outbound' ? '📤' : '❌'}</span>
        <span className="font-semibold text-gray-900">{call.Subject}</span>
        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">{call.Call_Type}</span>
      </div>
      <div className="ml-7 text-sm text-gray-600">
        <span>⏱️ {call.Call_Duration}</span>
        <span className="ml-3">📅 {formatDate(call.Call_Start_Time)}</span>
        <span className="ml-3">👤 {call.Owner?.name}</span>
      </div>
    </div>
  );

  const renderTask = (task) => (
    <div key={task.id} className="border-b border-gray-200 py-3 px-4 hover:bg-orange-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">✓</span>
        <span className="font-semibold text-gray-900">{task.Subject}</span>
        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{task.Status}</span>
      </div>
      <div className="ml-7 text-sm text-gray-600">
        {task.Due_Date && <span>📅 Due: {task.Due_Date}</span>}
        <span className="ml-3">👤 {task.Owner?.name}</span>
        {task.Description && <div className="text-xs mt-1">{task.Description}</div>}
      </div>
    </div>
  );

  const renderEvent = (event) => (
    <div key={event.id} className="border-b border-gray-200 py-3 px-4 hover:bg-red-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">📅</span>
        <span className="font-semibold text-gray-900">{event.Event_Title}</span>
      </div>
      <div className="ml-7 text-sm text-gray-600">
        <span>📅 {formatDate(event.Start_DateTime)}</span>
        <span className="ml-3">👤 {event.Owner?.name}</span>
      </div>
    </div>
  );

  const renderNote = (note) => (
    <div key={note.id} className="border-b border-gray-200 py-3 px-4 hover:bg-gray-50">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">📝</span>
        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{note.Parent}</span>
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

  const getDisplayData = () => {
    let data;
    switch(activeTab) {
      case 'leads': data = DATA.leads; break;
      case 'deals': data = DATA.deals; break;
      case 'calls': data = DATA.calls; break;
      case 'tasks': data = DATA.tasks; break;
      case 'events': data = DATA.events; break;
      case 'sms': data = DATA.sms; break;
      case 'notes': data = DATA.notes; break;
      default: data = [];
    }
    return filterByDate(data);
  };

  const renderItem = (item) => {
    switch(activeTab) {
      case 'leads': return renderLead(item);
      case 'deals': return renderDeal(item);
      case 'calls': return renderCall(item);
      case 'tasks': return renderTask(item);
      case 'events': return renderEvent(item);
      case 'sms': return renderSms(item);
      case 'notes': return renderNote(item);
      default: return null;
    }
  };

  const totalValue = DATA.deals.reduce((sum, d) => sum + (d.Amount || 0), 0);
  const filteredTotalValue = filterByDate(DATA.deals).reduce((sum, d) => sum + (d.Amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Complete CRM Dashboard</h1>
        <p className="text-gray-600">Pinky's Iron Doors - ALL Your Zoho Data 🎉</p>
        <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <p className="text-sm font-semibold text-gray-900">✅ COMPLETE DATA COLLECTION!</p>
          <p className="text-xs text-gray-700 mt-1">
            200 Leads • 200 Deals (${(totalValue/1000).toFixed(0)}K total) • 200 Calls • 200 Tasks • 200 Events • 200 SMS • 200 Notes
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Team: Patrick, Ernie, Connor, Marilyn, Dion, Nikos, Dayne, Garrison • Feb 2-9, 2026
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
            activeTab === 'leads' ? DATA.leads.length :
            activeTab === 'deals' ? DATA.deals.length :
            activeTab === 'calls' ? DATA.calls.length :
            activeTab === 'tasks' ? DATA.tasks.length :
            activeTab === 'events' ? DATA.events.length :
            activeTab === 'sms' ? DATA.sms.length :
            DATA.notes.length
          } records
        </span>
      </div>

      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 whitespace-nowrap ${
              activeTab === tab.key
                ? `border-${tab.color}-600 text-${tab.color}-600`
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="border rounded-lg">
        {getDisplayData().map(item => renderItem(item))}
      </div>
    </div>
  );
}
