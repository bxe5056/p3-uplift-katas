import { act, render, screen, waitFor } from "@testing-library/react";
import CountryList from "../pages/CountryList";
import { server } from "../../setup-tests";
import { http } from "msw";
import { vi } from "vitest";

// Create a mock implementation of IntersectionObserver
// We need to mock this because IntersectionObserver isn't available in Jest-type testing environments
// See: https://aronschueler.de/blog/2022/12/14/mocking-intersectionobserver-in-jest/ for more details.
const observerMap = new Map<Element, IntersectionObserverCallback>();

// Mock IntersectionObserver before tests
beforeEach(() => {
  class MockIntersectionObserver implements IntersectionObserver {
    root: Element | Document | null = null;
    rootMargin: string = "";
    thresholds: ReadonlyArray<number> = [];

    constructor(private callback: IntersectionObserverCallback) {}

    observe(target: Element) {
      observerMap.set(target, this.callback);
    }

    unobserve(target: Element) {
      observerMap.delete(target);
    }

    disconnect() {
      observerMap.clear();
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  // Replace the native IntersectionObserver with our mock
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

// Helper function to trigger intersection for all observers
function triggerIntersection(isIntersecting: boolean) {
  observerMap.forEach((callback) => {
    const entries = [
      {
        isIntersecting,
        target: document.createElement("div"),
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: {} as DOMRectReadOnly,
        time: Date.now(),
      },
    ];
    callback(entries, {} as IntersectionObserver);
  });
}

// Clean up after tests
afterEach(() => {
  vi.restoreAllMocks();
  observerMap.clear();
});

describe("CountryList", () => {
  // Mock data for testing
  const mockCountries = [
    {
      name: { common: "Test Country" },
      flags: { png: "test-flag.png" },
      population: 1000000,
      region: "Test Region",
      capital: ["Test Capital"],
    },
  ];

  // Mock the API response
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

  // Test: displays loading state initially
  // Goal: Ensure that the loading state is displayed initially
  // Steps:
  // 1. Render the CountryList component
  // 2. Check that the loading state is displayed
  // Expected Outcome:
  // - The loading state is displayed
  it("displays loading state initially", () => {
    render(<CountryList />);
    expect(screen.getByText("Loading more countries...")).toBeInTheDocument();
  });

  // Test: renders country cards after loading
  // Goal: Ensure that the country cards are rendered after initial loading
  // Steps:
  // 1. Render the CountryList component
  // 2. Wait for the loading state to complete
  // 3. Check that the country cards are rendered
  // Expected Outcome:
  // - The country cards are rendered
  it("renders country cards after loading", async () => {
    render(<CountryList />);

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(
          screen.queryByText("Loading more countries...")
        ).not.toBeInTheDocument();
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

  // Test: displays error message when API request fails
  // Goal: Ensure that the error message is displayed when the API request fails
  // Steps:
  // 1. Render the CountryList component
  // 2. Wait for the loading state to complete
  // 3. Check that the error message is displayed
  // Expected Outcome:
  // - The error message is displayed
  // - The error message indicates that the API request failed
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
        expect(
          screen.queryByText("Loading more countries...")
        ).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const errorMessage = await screen.findByText("Failed to load countries");
    expect(errorMessage).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  // Test: displays error message when API returns invalid JSON
  // Goal: Ensure that the error message is displayed when the API returns invalid JSON
  // Steps:
  // 1. Render the CountryList component
  // 2. Wait for the loading state to complete
  // 3. Check that the error message is displayed
  // Expected Outcome:
  // - The error message is displayed
  // - The error message indicates that the JSON is invalid
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
        expect(
          screen.queryByText("Loading more countries...")
        ).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const errorMessage = await screen.findByText("Failed to load countries");
    expect(errorMessage).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  // Test: loads more countries when scrolling to the bottom
  // Goal: Ensure that more countries are loaded when scrolling to the bottom
  // Steps:
  // 1. Render the CountryList component with a large set of mock countries
  // 2. Wait for the loading state to complete
  // 3. Check that the country cards are rendered
  // 4. Simulate intersection
  // 5. Wait for the next batch to load
  // 6. Check that the next batch of country cards are rendered
  // Expected Outcome:
  // - The country cards are initially rendered with the first batch of countries
  // - The country cards are rendered with the next batch of countries after scrolling to the bottom
  it("loads more countries when scrolling to the bottom", async () => {
    // Create a larger set of mock countries (more than ITEMS_PER_PAGE which is 20)
    const largeCountrySet = Array.from({ length: 25 }, (_, index) => ({
      name: { common: `Country ${index + 1}` },
      flags: { png: `flag-${index + 1}.png` },
      population: 1000000 + index,
      region: "Test Region",
      capital: [`Capital ${index + 1}`],
    }));

    server.use(
      http.get(
        "https://restcountries.com/v3.1/all",
        () =>
          new Response(JSON.stringify(largeCountrySet), {
            headers: {
              "Content-Type": "application/json",
            },
          })
      )
    );

    await act(async () => {
      render(<CountryList />);
    });

    // Wait for initial countries to load
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Verify we have the first batch of countries (should be 20)
    expect(screen.getByText("Country 1")).toBeInTheDocument();
    expect(screen.getByText("Country 20")).toBeInTheDocument();

    // Initially we shouldn't see country 21 (next page)
    expect(screen.queryByText("Country 21")).not.toBeInTheDocument();

    // Simulate intersection
    // This will trigger the loading of the next batch of countries
    await act(async () => {
      triggerIntersection(true);
    });

    // Wait for the next batch to load
    await waitFor(() => {
      expect(screen.getByText("Country 21")).toBeInTheDocument();
    });

    // Verify we now have countries from the next batch
    expect(screen.getByText("Country 21")).toBeInTheDocument();
  });

  // Test: stops loading more countries when all are displayed
  // Goal: Ensure that the loading stops when all countries are displayed
  // Steps:
  // 1. Render the CountryList component with exactly 20 countries
  // 2. Wait for the loading state to complete
  // 3. Check that the country cards are rendered
  // 4. Simulate intersection
  // 5. Wait for the next batch to load
  // 6. Check that additional country cards are rendered
  // Expected Outcome:
  // - The country cards are initially rendered with the first batch of countries
  // - The country cards are not rendered with any additional countries after scrolling to the bottom
  // - The data is fetched from the API only once due to the API not supporting pagination
  it("stops loading more countries when all are displayed", async () => {
    // Create exactly 20 countries (equal to ITEMS_PER_PAGE)
    const exactCountrySet = Array.from({ length: 20 }, (_, index) => ({
      name: { common: `Country ${index + 1}` },
      flags: { png: `flag-${index + 1}.png` },
      population: 1000000 + index,
      region: "Test Region",
      capital: [`Capital ${index + 1}`],
    }));

    server.use(
      http.get(
        "https://restcountries.com/v3.1/all",
        () =>
          new Response(JSON.stringify(exactCountrySet), {
            headers: {
              "Content-Type": "application/json",
            },
          })
      )
    );

    // Mock fetch to track calls
    const fetchSpy = vi.spyOn(window, "fetch");

    await act(async () => {
      render(<CountryList />);
    });

    // Wait for initial countries to load
    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Verify we have all 20 countries
    expect(screen.getByText("Country 1")).toBeInTheDocument();
    expect(screen.getByText("Country 20")).toBeInTheDocument();

    // We expect 1 fetch call since for the initial render
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Reset fetch calls count after initial render
    fetchSpy.mockClear();

    // Simulate intersection
    await act(async () => {
      triggerIntersection(true);
    });

    // Wait a moment to ensure no new fetch calls happen
    await new Promise((resolve) => setTimeout(resolve, 100));

    // We expect no new fetch calls since hasMore should be false
    expect(fetchSpy).toHaveBeenCalledTimes(0);

    // The loading spinner should not be visible
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();

    // Clean up mocks
    fetchSpy.mockRestore();
  });
});
