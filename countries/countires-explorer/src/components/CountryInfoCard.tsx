import "./CountryInfoCard.css";

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

interface CountryInfoCardProps {
  country: Country;
}

export default function CountryInfoCard({ country }: CountryInfoCardProps) {
  const flagAltText = country.flags.alt || `Flag of ${country.name.common}`;

  return (
    <div className="country-card" data-testid="country-card">
      <div className="flag-container">
        <img
          src={country.flags.png}
          alt={flagAltText}
          className="country-flag"
        />
        <div className="flag-tooltip">{flagAltText}</div>
      </div>
      <div className="country-info">
        <h2>{country.name.common}</h2>
        <p>
          <strong>Population:</strong> {country.population.toLocaleString()}
        </p>
        <p>
          <strong>Region:</strong> {country.region}
        </p>
        <p>
          <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
        </p>
      </div>
    </div>
  );
}
