import { render, screen } from "@testing-library/react";
import CountryList from "../pages/CountryList";
import { server } from "../../setup-tests";
import { http } from "msw";

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

  beforeAll(() => {
    server.use(
      http.get(
        "https://restcountries.com/v3.1/all",
        () => new Response(JSON.stringify(mockCountries))
      )
    );
  });

  it("displays country information", async () => {
    render(<CountryList />);

    // Wait for the country data to load
    const countryName = await screen.findByText("Test Country");
    expect(countryName).toBeInTheDocument();

    const flag = screen.getByRole("img", { name: /flag of test country/i });
    expect(flag).toHaveAttribute("src", "test-flag.png");

    expect(screen.getByText(/Population: 1,000,000/)).toBeInTheDocument();
    expect(screen.getByText(/Region: Test Region/)).toBeInTheDocument();
    expect(screen.getByText(/Capital: Test Capital/)).toBeInTheDocument();
  });
});
