import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchRecipesPage from "./pages/SearchRecipesPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import MealPlanPage from "./pages/MealPlanPage";
import GroceryListPage from "./pages/GroceryListPage";
import SavedRecipesPage from "./pages/SavedRecipesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchRecipesPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
        <Route path="/meal-plan" element={<MealPlanPage />} />
        <Route path="/grocery-list" element={<GroceryListPage />} />
        <Route path="/saved-recipes" element={<SavedRecipesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
