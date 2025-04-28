import { render, screen } from "@testing-library/react";
import CountryInfoCard from "./CountryInfoCard";

const mockCountry = {
  name: { common: "Test Country" },
  flags: { png: "test-flag.png" },
  population: 1000000,
  region: "Test Region",
  capital: ["Test Capital"],
};

describe("CountryInfoCard", () => {
  it("displays country information correctly", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<CountryInfoCard country={mockCountry} />);

    const countryName = screen.getByText("Test Country");
    expect(countryName).toBeInTheDocument();

    const flag = screen.getByRole("img", { name: /flag of test country/i });
    expect(flag).toHaveAttribute("src", "test-flag.png");

    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === "Population: 1,000,000";
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === "Region: Test Region";
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === "Capital: Test Capital";
      })
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("handles missing capital gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const countryWithoutCapital = {
      ...mockCountry,
      capital: [],
    };

    render(<CountryInfoCard country={countryWithoutCapital} />);

    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === "Capital: N/A";
      })
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
