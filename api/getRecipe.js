import OpenAI from "openai";

export default async function handler(req, res) {
    // CORS headers
    const FRONTEND_URL = 'https://chef-claude-lyart.vercel.app';
    res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Only POST allowed' });
        return;
    }

    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients)) {
        res.status(400).json({ error: 'Ingredients must be an array.' });
        return;
    }

    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const prompt = `
You are a helpful chef.
Create a detailed recipe using only these ingredients: ${ingredients.join(", ")}.
Return the recipe in markdown format.
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        });

        res.status(200).json({ recipe: completion.choices[0].message.content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate recipe' });
    }
}
