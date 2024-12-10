import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipes } from "../services/api";
import RecipeCard from "../components/RecipeCard";

export default function RecipesByCategory() {
  const { category } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // fetch all recipes & filter by category
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const allRecipes = await getRecipes();
        setRecipes(allRecipes);
  
        // filter recipes by category
        const filtered = allRecipes.filter(
          (recipe) => recipe.category.toLowerCase() === category.toLowerCase()
        );
        setFilteredRecipes(filtered);
  
        // set document title
        document.title = `Recipes for ${category}`;
      } catch (err) {
        setError("Failed to load recipes.");
        console.error(err);
        document.title = "Error Loading Recipes";
      }
    };
  
    fetchRecipes();
  }, [category]);

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center">Recipes for {category}</h1>
      <div className="row">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="col-md-6 mb-4">
            <RecipeCard
              name={recipe.name}
              category={recipe.category}
              prepTime={recipe.prepTime}
              actionLabel="View Details"
              actionClass="btn-primary"
              onAction={() => navigate(`/recipes/${recipe.id}`)} // nav to recipe details
              showSkillLevel={true}
              skillLevel={recipe.skillLevel}
            />
          </div>
        ))}
        {filteredRecipes.length === 0 && (
          <p className="text-center">
            No recipes found for this category. Try another one!
          </p>
        )}
      </div>
    </div>
  );
}
