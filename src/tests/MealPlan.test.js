import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MealPlan from "../pages/MealPlan";

// Mock API Data
const mockMealPlans = [
  {
    id: 1,
    day: "Monday",
    meals: [
      { type: "breakfast", recipeId: null },
      { type: "lunch", recipeId: null },
      { type: "dinner", recipeId: null },
    ],
  },
  {
    id: 2,
    day: "Tuesday",
    meals: [
      { type: "breakfast", recipeId: null },
      { type: "lunch", recipeId: null },
      { type: "dinner", recipeId: null },
    ],
  },
];

const mockRecipes = [
  { id: 1, name: "Pancakes", category: "Breakfast" },
  { id: 2, name: "Sandwich", category: "Lunch" },
  { id: 3, name: "Spaghetti", category: "Dinner" },
];

// Mock the API functions
jest.mock("../services/api", () => ({
  getMealPlans: jest.fn(() => Promise.resolve(mockMealPlans)),
  getRecipes: jest.fn(() => Promise.resolve(mockRecipes)),
  updateMealPlan: jest.fn(() => Promise.resolve()),
}));

// Test 1: Render meal plan with meals
test("renders meal plan with meals", async () => {
  render(
    <BrowserRouter>
      <MealPlan />
    </BrowserRouter>
  );

  // Verify that days render correctly
  const monday = await screen.findByText("Monday");
  const tuesday = await screen.findByText("Tuesday");
  expect(monday).toBeInTheDocument();
  expect(tuesday).toBeInTheDocument();
});

// Test 2: Add a new meal to the meal plan
test("updates a meal in the meal plan", 