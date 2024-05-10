"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const RecipeDetails = ({}) => {
  const searchParams = useSearchParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      // Deserialize the recipe object
      const deserializedRecipe = JSON.parse(decodeURIComponent(data));
      setRecipe(deserializedRecipe);
    }
  }, [searchParams]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto my-8 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      <div>
        <h2 className="text-xl font-semibold mb-2">Ingredients:</h2>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="ml-4">
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold my-4">Instructions:</h2>
        <ol>
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="ml-4">
              {instruction}
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-8">
        <p className="text-lg font-semibold">Time: {recipe.time}</p>
        <p className="text-lg font-semibold mt-4">Nutritional Facts:</p>
        <ul>
          <li className="ml-4">Calories: {recipe.nutritionalFacts.calories}</li>
          <li className="ml-4">Fat: {recipe.nutritionalFacts.fat}</li>
          <li className="ml-4">Protein: {recipe.nutritionalFacts.protein}</li>
          <li className="ml-4">
            Carbohydrates: {recipe.nutritionalFacts.carbohydrates}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RecipeDetails;
