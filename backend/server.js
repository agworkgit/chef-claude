import 'dotenv/config';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Add environment variable on Vercel
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/getRecipe", async (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: "Ingredients must be an array." });
    }

    const prompt = `
You are a helpful chef.
Create a detailed recipe using only these ingredients: ${ingredients.join(", ")}.
Return the recipe in markdown format.
`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        const recipe = completion.choices[0].message.content;
        res.json({ recipe });
    } catch (err) {
        console.error("Error generating recipe:", err);
        res.status(500).json({ error: err.message });
    }
});

// No need to call app.listen() anymore — Vercel handles this
export default app;
