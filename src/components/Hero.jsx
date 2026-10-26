import React from 'react';
import travelImg from '../assets/travelimage.jpg';

/**
 * Hero component
 * Compact, modern header with travel photography and sleek typography.
 */
function Hero() {
  return (
    <div className="hero-banner-compact">
      <div className="hero-compact-content">
        {/* Left Column: Heading & Subtitle */}
        <div className="hero-compact-text">
          <div className="hero-tag-pill">
            <span className="hero-dot"></span>
            <span>Worldwide Directory</span>
          </div>

          <h2 className="hero-compact-title">
            Discover Countries <span className="hero-gradient-text">Around the World</span>
          </h2>

          <p className="hero-compact-desc">
            Explore 5 global continents categorized by region and sorted by population.
          </p>
        </div>

        {/* Right Column: Sleek Travel Photo Card */}
        <div className="hero-compact-visual">
          <div className="hero-visual-frame">
            <img
              src={travelImg}
              alt="Travel Destinations"
              className="hero-compact-img"
            />
            <div className="hero-floating-badge">
              <span>✈️ 5 Continents</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
