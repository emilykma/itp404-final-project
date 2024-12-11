import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import GroceryList from "../pages/GroceryList";

// Mock the API functions
jest.mock("../services/api", () => ({
  getGroceryItems: jest.fn(() =>
    Promise.resolve([
      { id: 1, name: "Apples", quantity: 2, unit: "bag", purchased: false },
      { id: 2, name: "Bananas", quantity: 5, unit: "bunch", purchased: false },
      { id: 3, name: "Carrots", quantity: 1, unit: "bag", purchased: false },
    ])
  ),
  addGroceryItem: jest.fn((item) =>
    Promise.resolve({ ...item, id: Math.random() })
  ),
}));

// Test 1: Verify basic rendering of the component
test("renders GroceryList component with form and list container", async () => {
  await act(async () => {
    render(
      <BrowserRouter>
        <GroceryList />
      </BrowserRouter>
    );
  });

  console.log(screen.debug()); // Check the DOM structure after rendering

  // Check that the form fields and list are rendered
  expect(screen.getByLabelText(/item name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/quantity/i)).toBeInTheD