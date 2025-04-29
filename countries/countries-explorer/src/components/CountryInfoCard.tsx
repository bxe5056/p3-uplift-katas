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
  maps?: {
    googleMaps: string;
    openStreetMaps: string;
  };
}

interface CountryInfoCardProps {
  country: Country;
}

export default function CountryInfoCard({ country }: CountryInfoCardProps) {
  const flagAltText = country.flags.alt || `Flag of ${country.name.common}`;
  const googleMapsUrl =
    country.maps?.googleMaps ||
    `https://www.google.com/maps/search/${encodeURIComponent(
      country.name.common
    )}`;

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
        <div className="country-title">
          <h2>{country.name.common}</h2>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
            aria-label={`View ${country.name.common} on Google Maps`}
            data-testid="google-maps-link"
          >
            <svg
              className="map-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0ZM12 11C10.343 11 9 9.657 9 8C9 6.343 10.343 5 12 5C13.657 5 15 6.343 15 8C15 9.657 13.657 11 12 11Z" />
            </svg>
          </a>
        </div>
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
