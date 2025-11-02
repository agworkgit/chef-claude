export async function getRecipeFromChat(ingredientsArr) {
  try {
    console.log("Sending ingredients to backend:", ingredientsArr);

    const response = await fetch("/api/getRecipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: ingredientsArr }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Backend responded with error:", errText);
      return `Error from backend: ${errText}`;
    }

    const data = await response.json();
    console.log("Backend returned:", data);

    // Return the recipe as markdown string
    return data.recipe || "No recipe returned";
  } catch (err) {
    console.error("Failed to fetch recipe:", err);
    return "Failed to fetch recipe due to network error";
  }
}
