import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SavedRecipes from "../pages/SavedRecipes";
import { getFavorites, removeFromFavorites } from "../services/api";

// mock the API functions
jest.mock("../services/api");

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

  // assert the recipe is initially displayed
  const recipeCard = await screen.findByText("Acai Bowl");
  expect(recipeCard).toBeInTheDocument();

  const removeButton = screen.getByText(/remove/i);
  fireEvent.click(removeButton);

  expect(await screen.findByText(/no saved recipes found/i)).toBeInTheDocument();
});
