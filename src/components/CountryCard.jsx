import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CountryCard component
 * Displays a single country preview card with key information
 */
function CountryCard({ country, onSelect }) {
  const navigate = useNavigate();

  // Extract key information safely from the country object
  const commonName = country.names?.common || 'Unknown Country';
  const capitalName = country.capitals?.[0]?.name || 'N/A';
  const population = country.population ? country.population.toLocaleString() : 'N/A';
  const flagUrl = country.flag?.url_png || country.flag?.url_svg;
  const flagEmoji = country.flag?.emoji || '🏳️';
  const region = country.region || '';
  const currency = country.currencies?.[0];

  // Route identifier (alpha-2 preferred, fallback to alpha-3 or uuid)
  const countryCode = country.codes?.alpha_2 || country.codes?.alpha_3 || country.uuid;

  const handleClick = () => {
    if (onSelect) {
      onSelect(country);
    } else if (countryCode) {
      navigate(`/country/${countryCode}`, { state: { country } });
    }
  };

  return (
    <div 
      className="country-card" 
      onClick={handleClick}
      title={`Click to view full details of ${commonName}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Flag Image Container */}
      <div className="card-flag-wrapper">
        {flagUrl ? (
          <img 
            src={flagUrl} 
            alt={`Flag of ${commonName}`} 
            className="card-flag-img" 
            loading="lazy"
            onError={(e) => {
              // Hide broken image if any and show emoji fallback
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <span 
          className="card-flag-fallback" 
          style={{ display: flagUrl ? 'none' : 'flex' }}
        >
          {flagEmoji}
        </span>
        <span className="card-region-badge">{region}</span>
      </div>

      {/* Country Details Content */}
      <div className="card-content">
        <h3 className="card-title">{commonName}</h3>

        <div className="card-info-row">
          <span className="info-label">🏛️ Capital:</span>
          <span className="info-value">{capitalName}</span>
        </div>

        <div className="card-info-row">
          <span className="info-label">👥 Population:</span>
          <span className="info-value">{population}</span>
        </div>

        {currency && (
          <div className="card-info-row">
            <span className="info-label">💰 Currency:</span>
            <span className="info-value">
              {currency.code} ({currency.symbol || ''})
            </span>
          </div>
        )}

        <div className="card-footer">
          <span className="explore-btn">
            Explore Details <span>→</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default CountryCard;
