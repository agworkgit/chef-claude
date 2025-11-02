import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/getRecipe", async (req, res) => {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: "Ingredients must be an array." });
    }

    try {
        const prompt = `
You are a helpful chef.
Create a detailed recipe using only these ingredients: ${ingredients.join(", ")}.
Return the recipe in markdown format.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        res.json({ recipe: completion.choices[0].message.content });
    } catch (err) {
        console.error("Error generating recipe:", err);
        res.status(500).json({ error: "Failed to generate recipe" });
    }
});

export default app;
