import { render, screen, waitFor } from "@testing-library/react";
import CountryList from "../pages/CountryList";
import { server } from "../../setup-tests";
import { http } from "msw";
import { vi } from "vitest";

describe("CountryList", () => {
  const mockCountries = [
    {
      name: { common: "Test Country" },
      flags: { png: "test-flag.png" },
      population: 1000000,
      region: "Test Region",
      capital: ["Test Capital"],
    },
  ];

  beforeEach(() => {
    server.use(
      http.get(
        "https://restcountries.com/v3.1/all",
        () =>
          new Response(JSON.stringify(mockCountries), {
            headers: {
              "Content-Type": "application/json",
            },
          })
      )
    );
  });

  it("displays loading state initially", () => {
    render(<CountryList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders country cards after loading", async () => {
    render(<CountryList />);

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify the country card is rendered
    const countryCard = await screen.findByText(
      "Test Country",
      {},
      { timeout: 3000 }
    );
    expect(countryCard).toBeInTheDocument();

    // Verify the grid container is present
    const countryList = screen.getByTestId("country-list");
    expect(countryList).toBeInTheDocument();
  });

  it("displays error message when API request fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Override the mock for this test to simulate an error
    server.use(
      http.get(
        "https://restcountries.com/v3.1/all",
        () => new Response(null, { status: 500 })
      )
    );

    render(<CountryList />);

    await waitFor(
      () => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const errorMessage = await screen.findByText("Failed to load countries");
    expect(errorMessage).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("displays error message when API returns invalid JSON", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Override the mock for this test to return invalid JSON
    server.use(
      http.get(
        "https://restcountries.com/v3.1/all",
        () =>
          new Response("invalid json", {
            headers: {
              "Content-Type": "application/json",
            },
          })
      )
    );

    render(<CountryList />);

    await waitFor(
      () => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const errorMessage = await screen.findByText("Failed to load countries");
    expect(errorMessage).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
