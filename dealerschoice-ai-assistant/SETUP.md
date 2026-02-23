# ⚡ QUICK SETUP GUIDE

Get your AI Assistant running in 5 minutes!

---

## 🚀 **Step 1: Get the Code**

```bash
# If you're cloning from GitHub
git clone <your-repo-url>
cd dealerschoice-ai-assistant

# Or just extract the folder if you downloaded it
```

---

## 🔑 **Step 2: Get Gemini API Key**

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy your key

---

## ⚙️ **Step 3: Install & Configure**

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your API key
# GEMINI_API_KEY=paste_your_key_here
```

---

## 🎯 **Step 4: Run It!**

```bash
npm run dev
```

**That's it!** Open http://localhost:5173

---

## 🎨 **What You'll See:**

1. **Landing page** with your 3 products
2. **Chat button** in bottom-right corner
3. **AI assistant** ready to answer questions

---

## 🔧 **Customize It:**

### Change Products Info

Edit `server.ts` around line 12:

```typescript
const SYSTEM_INSTRUCTION = `You are the AI Receptionist...
```

### Change Colors/Branding

Edit `src/App.svelte` and `src/lib/ChatWidget.svelte`

Look for color values like:
- `#6366f1` (primary indigo)
- `#a855f7` (purple)

---

## 🚢 **Deploy to Railway:**

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. Go to https://railway.app
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repo
6. Add environment variable: `GEMINI_API_KEY=your_key`
7. Click "Deploy"

**Done!** Your app is live!

---

## 📱 **Test the Chat:**

1. Click the chat button (💬)
2. Try asking:
   - "Tell me about The Croupier"
   - "What's the difference between your products?"
   - "I'm interested in a demo"
   - "How much does The Stack cost?"

The AI knows all about your products!

---

## 🗄️ **View Leads:**

```bash
# While app is running, open new terminal:
curl http://localhost:3000/api/leads

# Or directly query the database:
sqlite3 leads.db "SELECT * FROM leads;"
```

---

## ⚠️ **Common Issues:**

### "Cannot find module '@google/genai'"
```bash
npm install
```

### "GEMINI_API_KEY is undefined"
- Make sure `.env` file exists
- Make sure key is correct
- Restart the server

### "Port 3000 already in use"
Edit `.env`:
```
PORT=3001
```

---

## ✅ **Checklist:**

- [ ] Node.js 18+ installed
- [ ] npm install completed
- [ ] .env file created
- [ ] GEMINI_API_KEY added to .env
- [ ] npm run dev works
- [ ] Can see website at localhost:5173
- [ ] Chat button appears
- [ ] AI responds to messages

---

## 🎉 **You're Done!**

Your AI assistant is ready to help customers learn about Dealer's Choice!

**Next Steps:**
- Customize the branding
- Deploy to Railway
- Share the link with customers

---

**Questions?** Check the full README.md
