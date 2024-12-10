import React, { useState, useEffect } from "react";
import { getFavorites, removeFromFavorites } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

/**
 * SavedRecipes Component
 * This page displays all recipes that the user has saved to their favorites list, with a timestamp of when recipes were saved.
 * Users can view saved recipes and remove them as needed.
 */

export default function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([]); // Saved recipes

  // fetch saved recipes
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const favoriteData = await getFavorites();
        const uniqueFavorites = favoriteData.filter(
          (value, index, self) =>
            self.findIndex((v) => v.id === value.id) === index
        );
        setSavedRecipes(uniqueFavorites);
  
        // set document title
        document.title = "Saved Recipes";
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
        document.title = "Error Loading Saved Recipes";
      }
    };
  
    fetchSavedRecipes();
  }, []);
  
  // remove a saved recipe
  const handleRemoveRecipe = async (recipeId) => {
    try {
      await removeFromFavorites(recipeId);
      setSavedRecipes(savedRecipes.filter((recipe) => recipe.id !== recipeId));
      toast.success("Recipe successfully removed from saved recipes!"); // Show success notification
    } catch (error) {
      console.error("Error removing recipe:", error);
      toast.error("Failed to remove the recipe. Please try again."); // Show error notification
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      <h1>Saved Recipes</h1>
      {savedRecipes.length === 0 ? (
        <p>No saved recipes found. Start adding your favorites!</p>
      ) : (
        <div className="row">
          {savedRecipes.map((recipe) => (
            <div key={recipe.id} className="col-md-6 mb-4">
              <RecipeCard
                name={recipe.name}
                category={recipe.category}
                prepTime={recipe.prepTime}
                skillLevel={recipe.skillLevel}
                favoritedAt={
                  recipe.favoritedAt
                    ? new Date(recipe.favoritedAt).toLocaleString()
                    : "Not Available"
                } // pass the favoritedAt timestamp
                onRemove={() => handleRemoveRecipe(recipe.id)}
                isRemovable // prop to conditionally show the remove button
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
