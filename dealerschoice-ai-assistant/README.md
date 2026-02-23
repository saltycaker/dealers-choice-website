# 🎰 Dealer's Choice AI Assistant

AI-powered receptionist for Dealer's Choice Systems - Automated Recruitment Intelligence Platform.

![Dealer's Choice](https://img.shields.io/badge/Dealer's_Choice-AI_Assistant-6366f1?style=for-the-badge)
![Svelte](https://img.shields.io/badge/Svelte-4.2-ff3e00?style=for-the-badge&logo=svelte)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=for-the-badge&logo=typescript)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285f4?style=for-the-badge)

---

## ✨ Features

- 🤖 **AI-Powered Chat** - Intelligent assistant powered by Google Gemini AI
- 💬 **Real-time Conversations** - Instant responses to customer inquiries
- 📊 **Lead Capture** - Automatic collection of interested prospects
- 🎨 **Beautiful UI** - Modern dark theme with Dealer's Choice branding
- 📱 **Responsive Design** - Works perfectly on all devices
- 🚀 **Fast & Lightweight** - Built with Svelte for maximum performance

---

## 🏗️ Tech Stack

**Frontend:**
- Svelte 4.2
- TypeScript
- Vite
- Custom CSS (no framework needed)

**Backend:**
- Express.js
- Google Gemini AI (gemini-2.0-flash-exp)
- SQLite (better-sqlite3)
- TypeScript

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone or download this repository**

```bash
git clone <your-repo-url>
cd dealerschoice-ai-assistant
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
NODE_ENV=development
```

4. **Run the development server**

```bash
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

---

## 📦 Project Structure

```
dealerschoice-ai-assistant/
├── src/
│   ├── lib/
│   │   └── ChatWidget.svelte      # Chat widget component
│   ├── App.svelte                  # Main app component
│   ├── main.ts                     # Entry point
│   ├── app.css                     # Global styles
│   └── vite-env.d.ts              # Type definitions
├── server.ts                       # Express server + AI logic
├── index.html                      # HTML template
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript config (frontend)
├── tsconfig.server.json            # TypeScript config (server)
├── svelte.config.js                # Svelte configuration
├── package.json                    # Dependencies
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

---

## 🎨 Customization

### Branding

The app uses Dealer's Choice branding colors:
- Primary: `#6366f1` (Indigo)
- Secondary: `#a855f7` (Purple)
- Background: Dark gradient (`#0a0a0a` to `#1a1a2e`)

To customize, edit the CSS variables in:
- `src/App.svelte`
- `src/lib/ChatWidget.svelte`

### AI System Prompt

The AI assistant's personality and knowledge is defined in `server.ts`:

```typescript
const SYSTEM_INSTRUCTION = `You are the AI Receptionist...`
```

Edit this to:
- Change the assistant's tone
- Update product information
- Add new features
- Modify conversation flow

---

## 🗄️ Database

The app uses SQLite to store leads:

**Leads Table Schema:**
```sql
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  company TEXT,
  product_interest TEXT,
  inquiry TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**View leads:**
```bash
# Development
curl http://localhost:3000/api/leads

# Or use SQLite directly
sqlite3 leads.db "SELECT * FROM leads;"
```

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This creates:
- `dist/` - Frontend build
- `dist/server.js` - Compiled server

### Run Production Server

```bash
NODE_ENV=production GEMINI_API_KEY=your_key npm start
```

### Deploy to Railway

1. Push to GitHub
2. Connect Railway to your repo
3. Add environment variable: `GEMINI_API_KEY`
4. Railway will auto-deploy!

### Deploy to Vercel/Netlify

**Note:** These platforms are for static sites. For full-stack with backend:
1. Deploy frontend to Vercel/Netlify
2. Deploy backend to Railway/Render/Fly.io
3. Update API endpoints in frontend

---

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production server
npm run preview  # Preview production build
```

---

## 🌟 Features in Detail

### Chat Widget

- **Floating button** - Always accessible in bottom-right
- **Smooth animations** - Slide in/out transitions
- **Typing indicators** - Shows when AI is thinking
- **Message history** - Maintains conversation context
- **Auto-scroll** - Always shows latest messages
- **Responsive** - Works on mobile and desktop

### AI Assistant Capabilities

- Answers questions about products
- Provides pricing information
- Recommends The Croupier as flagship product
- Honest about beta products (Stack, House Edge)
- Collects lead information
- Directs to appropriate resources

### Lead Management

- Automatic capture of interested prospects
- Stores: Name, Email, Company, Product Interest
- Timestamped entries
- Simple SQLite database
- API endpoint for retrieval

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Your Google Gemini API key |
| `PORT` | ❌ No | Server port (default: 3000) |
| `NODE_ENV` | ❌ No | Environment (development/production) |

---

## 📝 API Endpoints

### POST `/api/chat`

Send a message to the AI assistant.

**Request:**
```json
{
  "message": "Tell me about The Croupier",
  "history": [
    { "role": "user", "text": "Hi" },
    { "role": "assistant", "text": "Hello! How can I help?" }
  ]
}
```

**Response:**
```json
{
  "text": "The Croupier is our flagship product..."
}
```

### POST `/api/leads`

Save a new lead.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "product_interest": "The Croupier",
  "inquiry": "Interested in a demo"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! We'll be in touch soon."
}
```

### GET `/api/leads`

Retrieve all leads.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "product_interest": "The Croupier",
    "inquiry": "Interested in a demo",
    "created_at": "2024-01-15 10:30:00"
  }
]
```

---

## 🤝 Contributing

This is a private project for Dealer's Choice Systems.

---

## 📄 License

Proprietary - Dealer's Choice Systems

---

## 🆘 Support

For questions or issues:
1. Check the documentation above
2. Review the code comments
3. Contact the development team

---

## 🎉 Acknowledgments

- **Google Gemini AI** - Powering the intelligent assistant
- **Svelte** - Beautiful, fast frontend framework
- **Express** - Reliable backend framework

---

**Built with ❤️ for Dealer's Choice Systems**

🎰 **Dealer's choicE** - Where talent meets opportunity
