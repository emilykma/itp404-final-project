import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SavedRecipes from "../pages/SavedRecipes";
import { getFavorites, removeFromFavorites } from "../services/api";

// mock the API functions
jest.mock("../services/api");

test("renders saved recipes with correct details", async () => {
  const mockSavedRecipes = [
    {
      id: "1",
      name: "Acai Bowl",
      category: "Breakfast",
      prepTime: 5,
      skillLevel: "Beginner",
      favoritedAt: "2024-12-09T10:00:00.000Z",
    },
    {
      id: "2",
      name: "Breakfast Quesadilla",
      category: "Breakfast",
      prepTime: 15,
      skillLevel: "Beginner",
      favoritedAt: "2024-12-09T11:00:00.000Z",
    },
  ];

  getFavorites.mockResolvedValueOnce(mockSavedRecipes);

  render(
    <BrowserRouter>
      <SavedRecipes />
    </BrowserRouter>
  );

  expect(await screen.findByText("Acai Bowl")).toBeInTheDocument();
  expect(screen.getByText("Breakfast Quesadilla")).toBeInTheDocument();

  expect(screen.getByText(/prep time: 5/i)).toBeInTheDocument();
  expect(screen.getByText(/prep time: 15/i)).toBeInTheDocument();
  expect(screen.getByText(/beginner/i)).toBeInTheDocument();
  expect(screen.getByText(/2024-12-09/i)).toBeInTheDocument();
});

test("removes a recipe from saved recipes", async () => {
  const mockSavedRecipes = [
    {
      id: "1",
      name: "Acai Bowl",
      category: "Breakfast",
      prepTime: 5,
      skillLevel: "Beginner",
      favoritedAt: "2024-12-09T10:00:00.000Z",
    },
  ];

  getFavorites.mockResolvedValueOnce(mockSavedRecipes);
  removeFromFavorites.mockResolvedValueOnce({});

  render(
    <BrowserRouter>
      <SavedRecipes />
    </BrowserRouter>
  );

  const recipeCard = await screen.findByText("Acai Bowl");
  expect(recipeCard).toBeInTheDocument();

  // click the remove button
  const removeButton = screen.getByText(/remove/i);
  fireEvent.click(removeButton);

  // assert that the recipe is removed
  expect(await screen.findByText(/no saved recipes found/i)).toBeInTheDocument();
});
