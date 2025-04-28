import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App", () => {
  it("renders the heading", () => {
    render(<App />);
    const headingElement = screen.getByRole("heading", { level: 1 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent("Dev goes here");
  });

  it("has centered text alignment", () => {
    render(<App />);
    const headingElement = screen.getByRole("heading", { level: 1 });
    expect(headingElement).toHaveStyle({ textAlign: "center" });
  });
});
