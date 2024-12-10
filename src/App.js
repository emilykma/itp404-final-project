import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import HomePage from "./components/HomePage";
import GroceryList from "./pages/GroceryList";
import MealPlan from "./pages/MealPlan";
import SavedRecipes from "./pages/SavedRecipes";
import RecipeDetails from "./pages/RecipeDetails";
import SearchRecipes from "./pages/SearchRecipes";
import RecipesByCategory from "./pages/RecipesByCategory";
import Navbar from "./components/Navbar";

function Recipes() {
  return (
    <div>
      <h1>Recipes</h1>
      <Outlet /> {/* renders child routes */}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/grocery-list" element={<GroceryList />} />
          <Route path="/meal-plan" element={<MealPlan />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
          <Route path="/search-recipes" element={<SearchRecipes />} />
          <Route path="/recipes" element={<Recipes />}>
            <Route path=":recipeId" element={<RecipeDetails />} />
            <Route path="category/:category" element={<RecipesByCategory />} />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      </div>
    </Router>
  );
}
