import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/favicon.svg', express.static('favicon.svg'));
app.use(express.static('.'));

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "Sən mənim ən yaxşı dostum və yaxşı dostumsan! Adi söhbət kimi, çox səlis və təbii cavab ver. Bir az zarafat et, lakin ağıllı və zərif zarafat. Azərbaycan dilində yaz, amma rəsmi deyil - elə bil küçədə dostunla danışırsan. Qısa və səmimi ol. Heç vaxt tibbi və ya professional məsləhət vermə, sadəcə dost kimi söhbət et və əyləş. Cavabların insana oxşasın, robot kimi yox!" },
        { role: "user", content: userMessage }
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Üzr istəyirəm, bir problem yarandı." });
v  }
});

// Vercel serverless handler
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return app(req, res);
}
