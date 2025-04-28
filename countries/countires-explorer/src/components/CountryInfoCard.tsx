import "./CountryInfoCard.css";

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

interface CountryInfoCardProps {
  country: Country;
}

export default function CountryInfoCard({ country }: CountryInfoCardProps) {
  return (
    <div className="country-card">
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        className="country-flag"
      />
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
