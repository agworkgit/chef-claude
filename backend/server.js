import 'dotenv/config';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Make sure to set your OpenAI API key in an environment variable
// Example in .env: OPENAI_API_KEY=sk-xxxxxx
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
