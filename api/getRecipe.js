// backend/api

import OpenAI from "openai";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: "Ingredients must be an array." });
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

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
        res.status(200).json({ recipe });
    } catch (err) {
        console.error("Error generating recipe:", err);
        res.status(500).json({ error: err.message });
    }
}
