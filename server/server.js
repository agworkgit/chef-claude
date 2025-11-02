import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from your frontend
app.use(cors({
    origin: "https://chef-claude-lyart.vercel.app"
}));

app.use(express.json());

app.post("/api/getRecipe", async (req, res) => {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: "Ingredients must be an array." });
    }

    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const prompt = `You are a chef. Create a recipe using only: ${ingredients.join(", ")}. Return in markdown.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        });

        res.json({ recipe: completion.choices[0].message.content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate recipe" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
