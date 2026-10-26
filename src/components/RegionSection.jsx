import React, { useState, useEffect, useRef } from 'react';
import CountryCard from './CountryCard';
import { getCountriesByRegion } from '../services/api';

/**
 * RegionSection Component
 * Independently fetches and displays a horizontal list of countries for its region.
 * Countries are sorted by population (highest first).
 */
function RegionSection({ region, onSelectCountry }) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  // 1. Fetch countries directly for this specific region
  useEffect(() => {
    async function fetchRegionCountries() {
      setLoading(true);
      try {
        const data = await getCountriesByRegion(region);
        setCountries(data);
      } catch (error) {
        console.error(`Failed to load countries for region ${region}:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchRegionCountries();
  }, [region]);

  // 2. Horizontal scroll navigation controls (‹ / ›)
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="region-section" id={`region-${region.toLowerCase()}`}>
      {/* Section Header */}
      <div className="region-header">
        <div className="region-header-left">
          <h2 className="region-title">{region}</h2>
          <p className="region-subtitle">
            {countries.length > 0
              ? `${countries.length} destinations • Sorted by population`
              : loading ? 'Loading destinations...' : 'Discover destinations'}
          </p>
        </div>

        {/* Scroll Buttons */}
        <div className="scroll-controls">
          <button
            type="button"
            className="scroll-btn"
            onClick={() => handleScroll('left')}
            aria-label={`Scroll ${region} left`}
            title="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            className="scroll-btn"
            onClick={() => handleScroll('right')}
            aria-label={`Scroll ${region} right`}
            title="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row */}
      <div className="horizontal-scroll-container" ref={scrollContainerRef}>
        {loading ? (
          // Skeleton loading cards
          <div className="skeleton-row">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-line" style={{ width: '70%' }}></div>
                <div className="skeleton-line" style={{ width: '50%' }}></div>
                <div className="skeleton-line" style={{ width: '40%' }}></div>
              </div>
            ))}
          </div>
        ) : countries.length === 0 ? (
          <div className="empty-state">
            <p>No countries found for {region}.</p>
          </div>
        ) : (
          countries.map((country, index) => (
            <CountryCard
              key={country.uuid || country.codes?.alpha_2 || index}
              country={country}
              onSelect={onSelectCountry}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default RegionSection;
