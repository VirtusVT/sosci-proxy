import express from "express";
import cors from "cors";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();

app.use(cors({
  origin: "*",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "1mb" }));

app.use((req,res,next)=>{
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const fixedMessages = (messages || [])
      .filter(m => m && typeof m.content === "string" && m.content.trim() !== "")
      .map(m => ({
        role: m.role === "ai" ? "assistant" : m.role,
        content: m.content
      }));

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: fixedMessages,
      temperature: 0.2
    });

    const answer = completion.choices?.[0]?.message?.content || "";

    res.json({ answer });

  } catch (err) {
    console.error("OPENAI ERROR:", err);
    res.status(500).json({ error: String(err?.message || err) });
  }
});

const PORT = process.env.PORT || 8787;

app.listen(PORT, () => {
  console.log("Proxy läuft auf Port " + PORT + " /chat");
});
