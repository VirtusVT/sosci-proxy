import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors({
  origin: "*",
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await client.responses.create({
  model: "gpt-4o-mini",
  input: messages.map(m => ({
    role: m.role,
    content: m.content
  })),
});

res.json({ answer: completion.output[0].content[0].text });

  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
});

const PORT = process.env.PORT || 8787;

app.listen(PORT, () => {
  console.log("Proxy läuft auf Port " + PORT + " /chat");
});

