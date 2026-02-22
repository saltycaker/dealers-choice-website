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
We specialize in Automated Recruitment software.
Our key products are:
1. The Stack: Automates outreach and email campaigns.
2. The Croupier: AI-powered candidate search and ranking tool.
3. The House Edge: Competitor intelligence software.

Your Tasks:
- Greet visitors warmly.
- Explain what our products do.
- Help with navigation.
- If a user is interested in a demo, ask for their Name and Email.
- Be concise but informative.`;

const db = new Database("leads.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    inquiry TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
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
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  app.post("/api/leads", (req, res) => {
    const { name, email, inquiry } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    try {
      const stmt = db.prepare("INSERT INTO leads (name, email, inquiry) VALUES (?, ?, ?)");
      stmt.run(name, email, inquiry);
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to save lead" });
    }
  });

  app.get("/api/leads", (req, res) => {
    const leads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
    res.json(leads);
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
