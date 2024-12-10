import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MealPlan from "../pages/MealPlan";

test("Debug react-router-dom", () => {
  console.log("RouterDom exports:", RouterDom);
  expect(RouterDom).toBeDefined();
});

// Test 1: Render meal plan with meals
test("renders meal plan with meals", () => {
  const mockMeals = [
    { day: "Monday", meal: "Spaghetti" },
    { day: "Tuesday", meal: "Salad" },
  ];
  render(
    <BrowserRouter>
      <MealPlan meals={mockMeals} />
    </BrowserRouter>
  );

  // assert each meal is displayed under the correct day
  mockMeals.forEach(({ day, meal }) => {
    expect(screen.getByText(day)).toBeInTheDocument();
    expect(screen.getByText(meal)).toBeInTheDocument();
  });
});

// Test 2: Add a new meal to the meal plan
test("adds a new meal to the meal plan", () => {
  render(
    <BrowserRouter>
      <MealPlan meals={[]} />
    </BrowserRouter>
  );

  // input a new meal and assign to a day
  const inputField = screen.getByPlaceholderText("Add meal");
  fireEvent.change(inputField, { target: { value: "Tacos" } });

  const daySelect = screen.getByLabelText("Select Day");
  fireEvent.change(daySelect, { target: { value: "Friday" } });

  fireEvent.click(screen.getByText("Add"));

  // assert the new meal appears under the correct day
  expect(screen.getByText("Friday")).toBeInTheDocument();
  expect(screen.getByText("Tacos")).toBeInTheDocument();
});
