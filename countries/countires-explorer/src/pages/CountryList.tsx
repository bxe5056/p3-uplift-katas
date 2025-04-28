import { useEffect, useState } from "react";

interface Country {
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
  population: number;
  region: string;
  capital: string[];
}

export default function CountryList() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="country-list" data-testid="country-list">
      {countries.map((country) => (
        <div key={country.name.common} className="country-card">
          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            className="country-flag"
          />
          <h2>{country.name.common}</h2>
          <p>Population: {country.population.toLocaleString()}</p>
          <p>Region: {country.region}</p>
          <p>Capital: {country.capital?.[0] || "N/A"}</p>
        </div>
      ))}
    </div>
  );
}
