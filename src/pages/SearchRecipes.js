import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecipes, saveRecipe } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * SearchRecipes Component
 * This page allows users to search for & save recipes, as well as filter by cooking skill level & dietary restrictions.
 */

export default function SearchRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [dietPreferences, setDietPreferences] = useState({
    vegan: false,
    vegetarian: false,
    glutenFree: false,
  });
  const [skillLevelFilter, setSkillLevelFilter] = useState("");

  const navigate = useNavigate();

  // fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
  
        // set document title
        document.title = searchTerm
          ? `Search Results for "${searchTerm}"`
          : "Search Recipes";
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes.");
        document.title = "Error Loading Recipes";
      }
    };
  
    fetchRecipes();
  }, [searchTerm]);  

  // handle saving a recipe
  const handleSaveRecipe = async (recipe) => {
    try {
      await saveRecipe(recipe);
      toast.success("Recipe saved successfully!"); // success notification
      setError("");
    } catch (err) {
      console.error("Error saving recipe:", err);
      toast.error("Failed to save recipe. It might already be saved."); // error notification
    }
  };

  // handle dietary preference - checkbox toggle
  const handleDietPreferenceChange = (preference) => {
    setDietPreferences({
      ...dietPreferences,
      [preference]: !dietPreferences[preference],
    });
  };

  // handle cooking skill level - radio button change
  const handleSkillLevelChange = (value) => {
    setSkillLevelFilter(value);
  };

  // filter recipes based on search term, dietary preferences, and cooking skill level
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPreferences =
      (!dietPreferences.vegan || recipe.isVegan) &&
      (!dietPreferences.vegetarian || recipe.isVegetarian) &&
      (!dietPreferences.glutenFree || recipe.isGlutenFree);
    const matchesSkillLevel =
      skillLevelFilter === "" || recipe.skillLevel === skillLevelFilter;

    return matchesSearch && matchesPreferences && matchesSkillLevel;
  });

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />{" "}
      <h1 className="text-center mb-4">Search Recipes</h1>
      {/* Search Input */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {error && <p className="text-danger text-center">{error}</p>}
      {/* Dietary Preferences */}
      <div className="mb-4">
        <h5>Dietary Preferences:</h5>
        <div className="form-check">
          <input
            type="checkbox"
            id="vegan"
            className="form-check-input"
            checked={dietPreferences.vegan}
            onChange={() => handleDietPreferenceChange("vegan")}
          />
          <label className="form-check-label" htmlFor="vegan">
            Vegan
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            id="vegetarian"
            className="form-check-input"
            checked={dietPreferences.vegetarian}
            onChange={() => handleDietPreferenceChange("vegetarian")}
          />
          <label className="form-check-label" htmlFor="vegetarian">
            Vegetarian
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            id="glutenFree"
            className="form-check-input"
            checked={dietPreferences.glutenFree}
            onChange={() => handleDietPreferenceChange("glutenFree")}
          />
          <label className="form-check-label" htmlFor="glutenFree">
            Gluten-Free
          </label>
        </div>
      </div>
      {/* Cooking Skill Level Filter */}
      <div className="mb-4">
        <h5>Cooking Skill Level:</h5>
        <div className="form-check">
          <input
            type="radio"
            id="any"
            name="skillLevel"
            className="form-check-input"
            value=""
            checked={skillLevelFilter === ""}
            onChange={() => handleSkillLevelChange("")}
          />
          <label className="form-check-label" htmlFor="any">
            Any
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            id="beginner"
            name="skillLevel"
            className="form-check-input"
            value="Beginner"
            checked={skillLevelFilter === "Beginner"}
            onChange={() => handleSkillLevelChange("Beginner")}
          />
          <label className="form-check-label" htmlFor="beginner">
            Beginner
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            id="intermediate"
            name="skillLevel"
            className="form-check-input"
            value="Intermediate"
            checked={skillLevelFilter === "Intermediate"}
            onChange={() => handleSkillLevelChange("Intermediate")}
          />
          <label className="form-check-label" htmlFor="intermediate">
            Intermediate
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            id="advanced"
            name="skillLevel"
            className="form-check-input"
            value="Advanced"
            checked={skillLevelFilter === "Advanced"}
            onChange={() => handleSkillLevelChange("Advanced")}
          />
          <label className="form-check-label" htmlFor="advanced">
            Advanced
          </label>
        </div>
      </div>
      {/* Recipe Grid */}
      <div className="row">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="col-md-6 mb-4">
            <RecipeCard
              name={recipe.name}
              category={recipe.category}
              prepTime={recipe.prepTime}
              skillLevel={recipe.skillLevel}
              actionLabel="View Details"
              actionClass="btn-primary"
              onAction={() => navigate(`/recipes/${recipe.id}`)}
              showSkillLevel={true} // Show skill level for search results
            >
              <button
                className="btn btn-success mt-2"
                onClick={() => handleSaveRecipe(recipe)}
              >
                Save Recipe
              </button>
            </RecipeCard>
          </div>
        ))}
      </div>
    </div>
  );
}
