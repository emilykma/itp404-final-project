import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RecipeDetails from "../pages/RecipeDetails";

console.log("Available exports from react-router-dom:", RouterDom);

// Test 1: Verify the loading state
test("displays loading spinner while fetching recipe details", () => {
  render(
    <BrowserRouter>
      <RecipeDetails />
    </BrowserRouter>
  );

  // assert that the loading message or spinner is displayed
  expect(screen.getByText(/loading recipe details/i)).toBeInTheDocument();
});

// Test 2: Display recipe details
test("renders recipe details", async () => {
  render(
    <BrowserRouter>
      <RecipeDetails />
    </BrowserRouter>
  );

  // mock data to simulate a recipe
  const mockRecipe = {
    name: "Acai Bowl",
    category: "Breakfast",
    prepTime: 5,
    ingredients: ["Acai", "Banana", "Strawberries"],
    instructions: ["Blend acai", "Add fruits", "Serve chilled"],
  };

  // simulate that the details are displayed
  expect(screen.queryByText(/acai bowl/i)).toBeInTheDocument();
  expect(screen.queryByText(/breakfast/i)).toBeInTheDocument();
  expect(screen.queryByText(/prep time: 5 minutes/i)).toBeInTheDocument();
});

// Test 3: Add a new comment
test("allows adding a comment", () => {
  render(
    <BrowserRouter>
      <RecipeDetails />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "Emily Ma" },
  });
  fireEvent.change(screen.getByLabelText(/comment/i), {
    target: { value: "This recipe is amazing!" },
  });

  fireEvent.click(screen.getByText(/add comment/i));

  // assert that the new comment is displayed
  expect(screen.getByText(/emily ma/i)).toBeInTheDocument();
  expect(screen.getByText(/this recipe is amazing!/i)).toBeInTheDocument();
});

// Test 4: Edit recipe details
test("allows editing recipe details", () => {
  render(
    <BrowserRouter>
      <RecipeDetails />
    </BrowserRouter>
  );

  fireEvent.click(screen.getByText(/edit recipe/i));

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "Updated Recipe Name" },
  });

  fireEvent.click(screen.getByText(/save changes/i));

  // assert that the updated name is displayed
  expect(screen.getByText(/updated recipe name/i)).toBeInTheDocument();
});

// Test 5: Display validation messages for incomplete form submission
test("displays validation messages for incomplete form submission", () => {
  render(
    <BrowserRouter>
      <RecipeDetails />
    </BrowserRouter>
  );

  fireEvent.click(screen.getByText(/edit recipe/i));

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "" },
  });

  fireEvent.click(screen.getByText(/save changes/i));

  // assert that the validation message is displayed
  expect(screen.getByText(/recipe name is required/i)).toBeInTheDocument();
});
