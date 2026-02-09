# Pinky's Iron Doors - CRM Dashboard

Complete CRM dashboard displaying all Zoho CRM data including Leads, Deals, Calls, Tasks, Events, SMS, and Notes.

## 📊 Features

- ✅ 200 Leads with contact information
- ✅ 200 Deals ($1.5M+ pipeline)
- ✅ 200 Calls (Inbound/Outbound/Missed)
- ✅ 200 Tasks with follow-up sequences
- ✅ 200 Events (appointments & meetings)
- ✅ 200 SMS messages
- ✅ 200 Notes from interactions
- ✅ Date filtering (Today, Yesterday, 7/30/90 days, All Time)
- ✅ Real-time record counting
- ✅ Responsive design with Tailwind CSS

## 🚀 Quick Deploy to Vercel (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Navigate to this folder and deploy
```bash
cd crm-dashboard
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Choose your account)
- Link to existing project? **No**
- What's your project's name? **pinkys-crm-dashboard**
- In which directory is your code located? **./**
- Want to override settings? **No**

✅ You'll get a URL like: `https://pinkys-crm-dashboard.vercel.app`

### Step 3: Production Deploy
```bash
vercel --prod
```

## 🌐 Alternative: Deploy to Netlify

### Option A: Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy
# Follow prompts, then:
netlify deploy --prod
```

### Option B: Drag & Drop
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `build` folder
4. Get instant URL!

## 💻 Local Development

### Step 1: Install dependencies
```bash
npm install
```

### Step 2: Start development server
```bash
npm start
```

Opens at http://localhost:3000

### Step 3: Build for production
```bash
npm run build
```

Creates optimized build in `build/` folder.

## 📁 Project Structure

```
crm-dashboard/
├── package.json          # Dependencies & scripts
├── public/
│   └── index.html       # HTML template
├── src/
│   ├── index.js         # React entry point
│   └── App.js           # Main dashboard component
└── README.md            # This file
```

## 🔧 Tech Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling (via CDN)
- **Zoho CRM Data** - Real business data from Feb 2-9, 2026

## 📱 Data Summary

**Team Members:**
- Patrick Nowakowski
- Ernie Martinez
- Connor Peale
- Marilyn Ferdinand
- Dion Der
- Nikos Christianakis
- Dayne Ashbaugh
- Garrison Hopper

**Date Range:** February 2-9, 2026 (with historical data back to 2020)

## 🔒 Security Note

This dashboard contains **static data** embedded in the code. For production use with live data:
1. Set up a backend API to fetch from Zoho CRM
2. Add authentication (Auth0, Firebase, etc.)
3. Use environment variables for API keys
4. Never commit sensitive credentials to git

## 📞 Support

For questions about deployment or customization, contact your development team.

---

**Built with ❤️ for Pinky's Iron Doors**
