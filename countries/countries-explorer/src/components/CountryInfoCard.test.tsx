import { render, screen } from "@testing-library/react";
import CountryInfoCard from "./CountryInfoCard";

const mockCountry = {
  name: { common: "Test Country" },
  flags: { png: "test-flag.png", alt: "Official flag of Test Country" },
  population: 1000000,
  region: "Test Region",
  capital: ["Test Capital"],
  maps: {
    googleMaps: "https://goo.gl/maps/TestCountryLink",
    openStreetMaps: "https://www.openstreetmap.org/relation/TestCountry",
  },
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

  it("uses Google Maps URL from API when available", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<CountryInfoCard country={mockCountry} />);

    const mapsLink = screen.getByTestId("google-maps-link");
    expect(mapsLink).toBeInTheDocument();
    expect(mapsLink).toHaveAttribute(
      "href",
      "https://goo.gl/maps/TestCountryLink"
    );
    expect(mapsLink).toHaveAttribute("target", "_blank");
    expect(mapsLink).toHaveAttribute("rel", "noopener noreferrer");

    const mapIcon = mapsLink.querySelector("svg");
    expect(mapIcon).toBeInTheDocument();
    expect(mapIcon).toHaveClass("map-icon");

    consoleSpy.mockRestore();
  });

  it("falls back to constructed Google Maps URL when API URL is not available", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const countryWithoutMaps = {
      ...mockCountry,
      maps: undefined,
    };

    render(<CountryInfoCard country={countryWithoutMaps} />);

    const mapsLink = screen.getByTestId("google-maps-link");
    expect(mapsLink).toBeInTheDocument();
    expect(mapsLink).toHaveAttribute(
      "href",
      "https://www.google.com/maps/search/Test%20Country"
    );

    consoleSpy.mockRestore();
  });
});
