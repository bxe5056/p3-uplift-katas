import { render, screen } from "@testing-library/react";
import CountryInfoCard from "./CountryInfoCard";

const mockCountry = {
  name: { common: "Test Country" },
  flags: { png: "test-flag.png", alt: "Official flag of Test Country" },
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

    const flag = screen.getByRole("img", {
      name: "Official flag of Test Country",
    });
    expect(flag).toHaveAttribute("src", "test-flag.png");

    const tooltip = screen.getByText("Official flag of Test Country");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveClass("flag-tooltip");

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

  it("uses fallback alt text when flag alt text is not provided", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const countryWithoutFlagAlt = {
      ...mockCountry,
      flags: { png: "test-flag.png" },
    };

    render(<CountryInfoCard country={countryWithoutFlagAlt} />);

    const flag = screen.getByRole("img", { name: "Flag of Test Country" });
    expect(flag).toHaveAttribute("src", "test-flag.png");

    const tooltip = screen.getByText("Flag of Test Country");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveClass("flag-tooltip");

    consoleSpy.mockRestore();
  });
});
