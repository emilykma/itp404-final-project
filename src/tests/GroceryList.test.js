import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import GroceryList from "../pages/GroceryList";

console.log("Available react-router-dom exports:", RouterDom);

// Test 1: Render Grocery List with items
test("renders grocery list with items", () => {
  const mockGroceryItems = ["Apples", "Bananas", "Carrots"];
  render(
    <BrowserRouter>
      <GroceryList items={mockGroceryItems} />
    </BrowserRouter>
  );

  // assert each grocery item is displayed
  mockGroceryItems.forEach((item) => {
    expect(screen.getByText(item)).toBeInTheDocument();
  });
});

// Test 2: Add a new item to the grocery list
test("adds a new item to the grocery list", () => {
  render(
    <BrowserRouter>
      <GroceryList items={[]} />
    </BrowserRouter>
  );

  // input a new item and submit
  const inputField = screen.getByPlaceholderText("Add new item");
  fireEvent.change(inputField, { target: { value: "Oranges" } });
  fireEvent.click(screen.getByText("Add"));

  // assert the new item appears in the list
  expect(screen.getByText("Oranges")).toBeInTheDocument();
});
