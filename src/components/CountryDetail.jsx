import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCountryByCode } from '../services/api';

/**
 * CountryDetail component
 * Displays full comprehensive information about the selected country.
 * Supports direct URL routing via /country/:code, state passing, and browser history.
 */
function CountryDetail({ country: propCountry, onBack, onSelectBorderCountry }) {
  const { code: routeCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Active code identifier from URL route or prop
  const activeCode = routeCode || (typeof propCountry === 'string' ? propCountry : propCountry?.codes?.alpha_2 || propCountry?.codes?.alpha_3);

  // Check if country data was already passed in location state or prop
  const passedCountry = propCountry && typeof propCountry === 'object' ? propCountry : location.state?.country;
  const isMatchingPassedCountry = passedCountry && activeCode && (
    passedCountry.codes?.alpha_2?.toUpperCase() === activeCode.toUpperCase() ||
    passedCountry.codes?.alpha_3?.toUpperCase() === activeCode.toUpperCase() ||
    passedCountry.uuid === activeCode
  );

  const [detailData, setDetailData] = useState(isMatchingPassedCountry ? passedCountry : null);
  const [loading, setLoading] = useState(!isMatchingPassedCountry);

  // Fetch full country details on-demand when code changes or if not pre-loaded
  useEffect(() => {
    let isMounted = true;

    async function loadCountryDetail() {
      // If we already have the matching data loaded, skip refetching
      if (isMatchingPassedCountry && detailData) {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (!activeCode) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getCountryByCode(activeCode);
        if (isMounted) {
          setDetailData(data);
        }
      } catch (err) {
        console.error('Failed to fetch country detail:', err);
        if (isMounted) {
          setDetailData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCountryDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [activeCode]);

  // Navigate back to Dashboard
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  // Navigate to bordering country detail route
  const handleSelectBorder = (borderCode) => {
    if (onSelectBorderCountry) {
      onSelectBorderCountry(borderCode);
    } else {
      navigate(`/country/${borderCode}`);
    }
  };

  if (loading) {
    return (
      <div className="detail-container loading-state">
        <div className="spinner"></div>
        <p>Loading country details...</p>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="detail-container empty-state">
        <h2>Country Not Found</h2>
        <p>Could not load information for destination {activeCode ? `"${activeCode}"` : ''}.</p>
        <button type="button" className="btn-primary" onClick={handleBack}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  // Safely extract properties according to REST Countries response structure
  const commonName = detailData.names?.common || 'Unknown Country';
  const officialName = detailData.names?.official || commonName;
  const flagUrl = detailData.flag?.url_png || detailData.flag?.url_svg;
  const flagEmoji = detailData.flag?.emoji || '🏳️';
  const flagDesc = detailData.flag?.description;
  const capitals = detailData.capitals || [];
  const capitalName = capitals[0]?.name || 'N/A';
  const capitalCoords = capitals[0]?.coordinates;
  const population = detailData.population ? detailData.population.toLocaleString() : 'N/A';
  const region = detailData.region || 'N/A';
  const subregion = detailData.subregion || 'N/A';
  const areaKm = detailData.area?.kilometers ? detailData.area.kilometers.toLocaleString() + ' km²' : 'N/A';
  const areaMi = detailData.area?.miles ? detailData.area.miles.toLocaleString() + ' mi²' : '';
  const currencies = detailData.currencies || [];
  const languages = detailData.languages || [];
  const borders = detailData.borders || [];
  const timezones = detailData.timezones || [];
  const callingCodes = detailData.calling_codes || [];
  const drivingSide = detailData.cars?.driving_side || 'N/A';
  const tlds = detailData.tlds || [];
  const continents = detailData.continents || [];
  const shortDesc = detailData.descriptions?.short;
  const longDesc = detailData.descriptions?.long;
  const googleMapsUrl = detailData.links?.google_maps;
  const wikiUrl = detailData.links?.wikipedia;
  const officialUrl = detailData.links?.official;
  const alpha2 = detailData.codes?.alpha_2;
  const alpha3 = detailData.codes?.alpha_3;

  return (
    <div className="detail-container">
      {/* Top Navigation Bar with Back Button and Breadcrumbs */}
      <div className="detail-nav-bar">
        <button type="button" className="btn-back" onClick={handleBack}>
          ← Back to Dashboard
        </button>
        <div className="detail-breadcrumbs">
          <span
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            title="Return to Dashboard"
          >
            Dashboard
          </span>
          {' '}/ <span
            onClick={() => navigate(`/dashboard#region-${region.toLowerCase()}`)}
            style={{ cursor: 'pointer' }}
            title={`Go to ${region} region`}
          >
            {region}
          </span>
          {' '}/ <span className="active">{commonName}</span>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="detail-hero-card">
        <div className="detail-flag-col">
          {flagUrl ? (
            <img
              src={flagUrl}
              alt={`Flag of ${commonName}`}
              className="detail-flag-large"
            />
          ) : (
            <span className="detail-flag-emoji">{flagEmoji}</span>
          )}
          {flagDesc && <p className="flag-description-note">💡 {flagDesc}</p>}
        </div>

        <div className="detail-header-info">
          <div className="country-title-row">
            <h1 className="detail-country-title">{commonName}</h1>
            <span className="code-pill">{alpha2 || alpha3}</span>
          </div>
          <p className="detail-official-name">{officialName}</p>

          {/* Quick Info Badges */}
          <div className="quick-badges">
            <span className="badge">🏛️ Capital: <strong>{capitalName}</strong></span>
            <span className="badge">🌍 Region: <strong>{region}</strong></span>
            <span className="badge">👥 Population: <strong>{population}</strong></span>
            {continents.length > 0 && (
              <span className="badge">🗺️ Continent: <strong>{continents.join(', ')}</strong></span>
            )}
          </div>

          {/* Short description */}
          {shortDesc && <p className="detail-short-summary">{shortDesc}</p>}

          {/* External Action Links */}
          <div className="external-links-row">
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ext-link-btn maps-btn"
              >
                🌍 View on Google Maps
              </a>
            )}
            {wikiUrl && (
              <a
                href={wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ext-link-btn wiki-btn"
              >
                📖 Read on Wikipedia
              </a>
            )}
            {officialUrl && (
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ext-link-btn govt-btn"
              >
                🏛️ Official Portal
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Long Description Card if available */}
      {longDesc && (
        <div className="detail-section-card description-card">
          <h2 className="section-title">📘 About {commonName}</h2>
          <p className="long-description-text">{longDesc}</p>
        </div>
      )}

      {/* Comprehensive Information Grid */}
      <div className="detail-grid">
        {/* Geography Card */}
        <div className="detail-section-card">
          <h2 className="section-title">📍 Geography & Location</h2>
          <ul className="info-list">
            <li>
              <span className="label">Capital City:</span>
              <span className="value">
                {capitalName}
                {capitalCoords ? ` (${capitalCoords.lat}°, ${capitalCoords.lng}°)` : ''}
              </span>
            </li>
            <li>
              <span className="label">Region:</span>
              <span className="value">{region}</span>
            </li>
            <li>
              <span className="label">Subregion:</span>
              <span className="value">{subregion}</span>
            </li>
            <li>
              <span className="label">Total Area:</span>
              <span className="value">{areaKm} {areaMi ? `(${areaMi})` : ''}</span>
            </li>
            <li>
              <span className="label">Landlocked:</span>
              <span className="value">{detailData.landlocked ? 'Yes' : 'No (Has Coastline)'}</span>
            </li>
          </ul>
        </div>

        {/* Demographics & Culture Card */}
        <div className="detail-section-card">
          <h2 className="section-title">🗣️ Culture & Languages</h2>
          <ul className="info-list">
            <li>
              <span className="label">Official Languages:</span>
              <span className="value">
                {languages.length > 0
                  ? languages.map((l) => `${l.name} (${l.native_name})`).join(', ')
                  : 'N/A'}
              </span>
            </li>
            <li>
              <span className="label">Demonyms:</span>
              <span className="value">
                {detailData.demonyms?.eng
                  ? `${detailData.demonyms.eng.m || detailData.demonyms.eng.f || 'N/A'}`
                  : 'N/A'}
              </span>
            </li>
            <li>
              <span className="label">Government:</span>
              <span className="value">{detailData.government_type || 'N/A'}</span>
            </li>
            <li>
              <span className="label">UN Member:</span>
              <span className="value">{detailData.classification?.un_member ? 'Yes' : 'No'}</span>
            </li>
          </ul>
        </div>

        {/* Economy & Currencies Card */}
        <div className="detail-section-card">
          <h2 className="section-title">💰 Economy & Currency</h2>
          <ul className="info-list">
            <li>
              <span className="label">Currencies:</span>
              <span className="value">
                {currencies.length > 0
                  ? currencies.map((c) => `${c.name} (${c.code} ${c.symbol || ''})`).join(', ')
                  : 'N/A'}
              </span>
            </li>
            <li>
              <span className="label">Population:</span>
              <span className="value">{population}</span>
            </li>
            <li>
              <span className="label">Start of Week:</span>
              <span className="value" style={{ textTransform: 'capitalize' }}>
                {detailData.date?.start_of_week || 'Monday'}
              </span>
            </li>
          </ul>
        </div>

        {/* Travel & Useful Facts Card */}
        <div className="detail-section-card">
          <h2 className="section-title">✈️ Travel & Practical Facts</h2>
          <ul className="info-list">
            <li>
              <span className="label">Calling Code:</span>
              <span className="value">
                {callingCodes.length > 0 ? callingCodes.map((c) => `+${c}`).join(', ') : 'N/A'}
              </span>
            </li>
            <li>
              <span className="label">Driving Side:</span>
              <span className="value" style={{ textTransform: 'capitalize' }}>
                {drivingSide}
              </span>
            </li>
            <li>
              <span className="label">Domain (TLD):</span>
              <span className="value">{tlds.join(', ') || 'N/A'}</span>
            </li>
            <li>
              <span className="label">Timezones:</span>
              <div className="timezone-tags">
                {timezones.slice(0, 5).map((tz, i) => (
                  <span key={i} className="mini-tag">{tz}</span>
                ))}
                {timezones.length > 5 && (
                  <span className="mini-tag">+{timezones.length - 5} more</span>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Neighboring / Border Countries */}
      <div className="detail-section-card borders-card">
        <h2 className="section-title">🧭 Bordering Countries</h2>
        {borders.length > 0 ? (
          <div className="borders-list">
            {borders.map((borderCode) => (
              <button
                key={borderCode}
                type="button"
                className="border-country-btn"
                onClick={() => handleSelectBorder(borderCode)}
                title={`Explore ${borderCode}`}
              >
                🌍 {borderCode} <span>→</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="no-borders-note">
            🏝️ This country has no land borders (island nation or single territory).
          </p>
        )}
      </div>

      {/* Bottom Back Button */}
      <div className="detail-bottom-nav">
        <button type="button" className="btn-back" onClick={handleBack}>
          ← Back to All Destinations
        </button>
      </div>
    </div>
  );
}

export default CountryDetail;


