import React, { useState, useEffect } from "react";
import { getMealPlans, updateMealPlan, getRecipes } from "../services/api";

/**
 * MealPlan Component
 * This page allows users to dynamically customize their meal plans for the week.
 * Users can select meals for breakfast, lunch, and dinner from a dropdown menu.
 */

export default function MealPlan() {
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(""); 

  // fetch meal plans and recipes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const plans = await getMealPlans();
        const allRecipes = await getRecipes();
        setMealPlans(plans);
        setRecipes(allRecipes);
  
        // set document title
        document.title = "Weekly Meal Plan by Day";
      } catch (error) {
        console.error("Error fetching meal plan data:", error);
        document.title = "Error Loading Meal Plan";
      }
    };
  
    fetchData();
  }, []);  

  // update a specific meal slot for a day
  const handleUpdateMeal = async (dayId, mealType, recipeId) => {
    if (!recipeId) {
      setError("Please select a valid recipe.");
      return;
    }

    try {
      const updatedPlans = mealPlans.map((plan) =>
        plan.id === dayId
          ? {
              ...plan,
              meals: plan.meals.map((meal) =>
                meal.type === mealType ? { ...meal, recipeId } : meal
              ),
            }
          : plan
      );

      // find the updated meals for the specific day
      const updatedDayMeals = updatedPlans.find(
        (plan) => plan.id === dayId
      ).meals;

      // PATCH request w updated meal per day
      await updateMealPlan(dayId, updatedDayMeals);

      setMealPlans(updatedPlans);
      setError("");
    } catch (error) {
      console.error("Error updating meal plan:", error);
      setError("Failed to update meal plan.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Weekly Meal Plan</h1>
      {error && <p className="text-danger">{error}</p>}

      <div className="row">
        {mealPlans.map((plan) => (
          <div key={plan.id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header text-center">
                <h5>{plan.day}</h5>
              </div>
              <div className="card-body">
                {plan.meals.map((meal) => (
                  <div key={meal.type} className="mb-3">
                    <h6>
                      {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                    </h6>
                    <select
                      className="form-select"
                      value={meal.recipeId || ""}
                      onChange={(e) =>
                        handleUpdateMeal(plan.id, meal.type, e.target.value)
                      }
                    >
                      <option value="">Select a recipe</option>
                      {recipes
                        .filter((recipe) =>
                          meal.type === "breakfast"
                            ? recipe.category === "Breakfast"
                            : meal.type === "lunch"
                            ? recipe.category === "Lunch"
                            : recipe.category === "Dinner"
                        )
                        .map((recipe) => (
                          <option key={recipe.id} value={recipe.id}>
                            {recipe.name}
                          </option>
                        ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
