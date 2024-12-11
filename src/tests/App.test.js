import { render, screen } from "@testing-library/react";
import App from "../App.js";

test("renders navbar with Home link", () => {
  render(<App />);
  const homeLink = screen.getByText(/home/i);
  expect(homeLink).toBeInTheDocument();
});
