import Link from "next/link";
import { useEffect, useState } from "react";

const RecipeCard = ({ recipe }) => {
  const [recipeData, setRecipeData] = useState("");

  useEffect(() => {
    // Serialize the recipe object
    const serializedRecipe = encodeURIComponent(JSON.stringify(recipe));
    setRecipeData(serializedRecipe);
  }, [recipe]);

  return (
    <Link href={`/recipes/${recipe.id}?data=${recipeData}`}>
      <div className="p-5 bg-white shadow-md rounded-md cursor-pointer">
        <p className="text-xl font-semibold mb-2">{recipe.title}</p>
        <p className="text-sm">{recipe.ingredients.join(", ")}</p>
      </div>
    </Link>
  );
};

export default RecipeCard;
