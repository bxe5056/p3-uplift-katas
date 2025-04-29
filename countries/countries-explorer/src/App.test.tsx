import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";

// Mock the CountryList component
vi.mock("./pages/CountryList", () => {
  return {
    default: function MockCountryList() {
      return <div data-testid="country-list">Mock Country List</div>;
    },
  };
});

describe("App", () => {
  it("renders the header with correct title", () => {
    render(<App />);
    const header = screen.getByRole("heading", { level: 1 });
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Countries Explorer");
    expect(header).toHaveStyle({ textAlign: "center" });
  });

  it("renders the CountryList component", () => {
    render(<App />);
    const countryList = screen.getByTestId("country-list");
    expect(countryList).toBeInTheDocument();
  });
});
