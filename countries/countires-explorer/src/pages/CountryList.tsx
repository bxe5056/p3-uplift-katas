import { useEffect, useState, useRef, useCallback } from "react";
import CountryInfoCard from "../components/CountryInfoCard";
import "./CountryList.css";

interface Country {
  name: {
    common: string;
  };
  flags: {
    png: string;
    alt?: string;
  };
  population: number;
  region: string;
  capital: string[];
}

const ITEMS_PER_PAGE = 20;

export default function CountryList() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCountryElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://restcountries.com/v3.1/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Simulate pagination by slicing the data
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const newCountries = data.slice(startIndex, endIndex);

        setCountries((prev) => [...prev, ...newCountries]);
        setHasMore(endIndex < data.length);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError("Failed to load countries");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [page]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="country-list" data-testid="country-list">
      {countries.map((country, index) => {
        if (countries.length === index + 1) {
          return (
            <div
              key={`${country.name.common}-${index}`}
              ref={lastCountryElementRef}
            >
              <CountryInfoCard country={country} data-testid="country-card" />
            </div>
          );
        } else {
          return (
            <CountryInfoCard
              key={`${country.name.common}-${index}`}
              country={country}
              data-testid="country-card"
            />
          );
        }
      })}
      {loading && (
        <div className="loading">
          <div className="loading-spinner" data-testid="loading-spinner" />
          <div className="loading-text">Loading more countries...</div>
        </div>
      )}
    </div>
  );
}
