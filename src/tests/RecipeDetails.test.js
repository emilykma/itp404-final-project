import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RecipeDetails from "../pages/RecipeDetails";

/// Test 1: Verify the loading state
test("displays loading spinner while fetching recipe details", () => {
  render(
    <BrowserRouter>
      <RecipeDetails />
    </BrowserRouter>
  );

  expect(screen.getByText(/loading recipe details/i)).toBeInTheDocument();
});

// Test 2: Display recipe details
test("renders recipe details", async () => {
  const mockRecipe = {
    name: "Acai Bowl",
    category: "Breakfast",
    prepTime: 5,
    ingredients: ["Acai", "Banana", "Strawberries"],
    instructions: ["Blend acai", "Add fruits", "Serve chilled"],
  };

  // Mock the RecipeDetails API
  jest.mock("../services/api", () => ({
    getRecipeById: jest.fn(() => Promise.resolve(mockRecipe)),
  }));

  render(
    <BrowserRouter>
      <RecipeDetails />
    </BrowserRouter>
  );

  // Wait for recipe data to load
  const recipeName = await screen.findByText(/acai bowl/i);
  expect(recipeName).toBeInTheDocument();
  expect(screen.getByText(/breakfast/i)).toBeInTheDocument();
  expect(screen.getByText(/prep time: 5/i)).toBeInTheDocument();
});

// Test 3: Add a new comment
test("allows adding a comment", async () => {
  render(
    <BrowserRouter>
      <RecipeDetails />
    </BrowserRouter>
  );

  // Simulate filling out the form
  fireEvent.change(screen.getByTestId("input-name"), {
    target: { value: "Emily Ma" },
  });
  fireEvent.change(screen.getByTestId("input-comment"), {
    target: { value: "This recipe is amazing!" },
  });
  fireEvent.click(screen.getByText(/add comment/i));

  // Assert that the new comment is displayed
  const comment = await screen.findByText(/this recipe is amazing!/i);
  expect(comment).toBeInTheDocument();
});

// Test 4: Edit recipe details
test("allows editing recipe details", () => {
  const mockRecipe = {
    name: "Acai Bowl",
    category: "Breakfast",
    prepTime: 5,
    instructions: ["Blend acai", "Add fruits"],
  };

  // Render the RecipeDetails component with mocked recipe data
  render(
    <BrowserRouter>
      <RecipeDetails recipe={mockRecipe} />
    </BrowserRouter>
  );

  // Simulate clicking the edit button
  fireEvent.click(screen.getByText(/edit recipe/i));

  // Simulate updating the recipe name
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "Updated Recipe Name" },
  });

  // Simulate saving the changes
  fireEvent.click(screen.getByText(/save changes/i));

  // Assert that the updated name is displayed
  expect(screen.getByText(/updated recipe name/i)).toBeInTheDocument();
});

// Test 5: Display validation messages for incomplete form submission
test("displays validation messages for incomplete form submission", () => {
  const mockRecipe = {
    name: "Acai Bowl",
    category: "Breakfast",
    prepTime: 5,
    instructions: ["Blend acai", "Add fruits"],
  };

  // Render the RecipeDetails component with mocked recipe data
  render(
    <BrowserRouter>
      <RecipeDetails recipe={mockRecipe} />
    </BrowserRouter>
  );

  // Simulate clicking the edit button
  fireEvent.click(screen.getByText(/edit recipe/i));

  // Simulate clearing the name field and attempting to save
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "" },
  });
  fireEvent.click(screen.getByText(/save changes/i));

  // Assert that the validation message is displayed
  expect(screen.getByText(/recipe name is required/i)).toBeInTheDocument();
});