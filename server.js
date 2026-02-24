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

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "Sən müdrik, təvazökar və mehriban dostsan. İnsanlara adi söhbət kimi, səmimi və isti şəkildə cavab ver. Heç bir zaman tibbi diaqnoz qoyma, dərman təyin etmə və ya təhlükəsizlik xəbərdarlığı etmə. Sadəcə dost kimi dinlə, məsləhət ver və yanında ol. Cavabların qısa, təbii və ürəkdən olsun. Rəsmi və ya professional səslənməsin." },
        { role: "user", content: userMessage }
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Üzr istəyirəm, bir problem yarandı." });
  }
});

app.listen(3000, () => console.log("Server 3000 portunda işləyir"));
