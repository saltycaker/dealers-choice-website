import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_INSTRUCTION = `You are the AI Receptionist for Dealer's Choice Systems. 
Your goal is to be professional, friendly, and helpful.

About Dealer's Choice Systems:
We specialize in Automated Recruitment software that helps companies find and hire the best talent.

Our Products:
1. **The Croupier** ($399/month) - Our flagship product
   - AI-powered LinkedIn candidate search and ranking
   - Searches LinkedIn for candidates matching your criteria
   - Ranks candidates by relevance and fit
   - Generates personalized outreach emails
   - Full workflow automation
   - Currently live and fully operational

2. **The Stack** ($199/month) - Currently in BETA
   - Automated email outreach campaigns
   - Multi-candidate messaging
   - Template management
   - Campaign tracking
   - Note: Beta product, recommend The Croupier for production use

3. **The House Edge** ($149/month) - Currently in BETA
   - Competitor intelligence tracking
   - Job posting monitoring
   - Salary benchmarking
   - Market insights
   - Note: Beta product, recommend The Croupier for production use

Your Tone:
- Professional but conversational
- Enthusiastic about our products
- Honest about beta status
- Helpful and responsive

Your Tasks:
1. Greet visitors warmly
2. Answer questions about our products
3. Recommend The Croupier as our most stable, feature-complete product
4. For beta products (Stack, House Edge), mention they're in testing
5. If someone wants a demo or has serious interest, collect:
   - Name
   - Email
   - Company (optional)
   - Which product they're interested in
6. Be concise but thorough

Important:
- Always recommend The Croupier for production use
- Be transparent about Stack and House Edge being in beta
- If asked about pricing, provide the monthly costs listed above
- Direct technical questions to our team via the contact form`;

const db = new Database("leads.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    company TEXT,
    product_interest TEXT,
    inquiry TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    try {
      const chat = ai.chats.create({
        model: "gemini-2.0-flash-exp",
        config: { systemInstruction: SYSTEM_INSTRUCTION },
        history: history?.map((m: any) => ({
          role: m.role,
          parts: [{ text: m.text }]
        })) || []
      });

      const result = await chat.sendMessage({ message });
      res.json({ text: result.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to get AI response. Please try again." });
    }
  });

  // Save lead
  app.post("/api/leads", (req, res) => {
    const { name, email, company, product_interest, inquiry } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    try {
      const stmt = db.prepare(
        "INSERT INTO leads (name, email, company, product_interest, inquiry) VALUES (?, ?, ?, ?, ?)"
      );
      stmt.run(name, email, company || null, product_interest || null, inquiry || null);
      res.status(201).json({ success: true, message: "Thank you! We'll be in touch soon." });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save lead" });
    }
  });

  // Get all leads (admin endpoint - should be protected in production)
  app.get("/api/leads", (req, res) => {
    try {
      const leads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
      res.json(leads);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Dealer's Choice AI Assistant running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(console.error);
