import { useState } from 'react';
import '../style/list.css';
import { Recipe } from './Recipe';
import { getRecipeFromChat } from './AI';

export const List = () => {
    const [ingredientList, setIngredientList] = useState([]);
    const [recipe, setRecipe] = useState(''); // store fetched recipe
    const [recipeShown, setRecipeShown] = useState(false);

    // Add ingredient handler
    const addIngredient = (e) => {
        e.preventDefault(); // prevent page refresh
        const form = e.target;
        const value = form.ingredient.value.trim();
        if (value) {
            setIngredientList([...ingredientList, value]);
            form.reset();
        }
    };

    // Fetch recipe from backend
    const getRecipe = async () => {
        if (ingredientList.length === 0) return;

        const recipeMarkdown = await getRecipeFromChat(ingredientList);
        console.log('Recipe markdown:', recipeMarkdown);

        setRecipe(recipeMarkdown); // store recipe
        setRecipeShown(true);      // show recipe
    };

    return (
        <>
            <form onSubmit={addIngredient}>
                <input
                    name="ingredient"
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                />
                <button type="submit">+ Add Ingredient</button>
            </form>

            {ingredientList.length > 0 && (
                <article className="list">
                    <h2>Ingredients on hand:</h2>
                    <ul>
                        {ingredientList.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>

                    {ingredientList.length > 3 && (
                        <div className="get-recipe-container">
                            <div className="get-recipe-details">
                                <h3>Ready for a recipe?</h3>
                                <p>Get a recipe from your list of ingredients.</p>
                            </div>
                            <button className="get-recipe-btn" onClick={getRecipe}>
                                Get a recipe
                            </button>
                        </div>
                    )}
                </article>
            )}

            {/* Render dynamic recipe */}
            {recipeShown && <Recipe recipe={recipe} />}
        </>
    );
};
