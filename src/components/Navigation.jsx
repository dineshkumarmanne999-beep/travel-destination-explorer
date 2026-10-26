import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { REGIONS } from '../constants';

/**
 * Navigation Component
 * Provides top navbar with app branding, region quick links, and search input.
 * Fully integrated with react-router-dom for seamless client-side routing.
 */
function Navigation({ onGoHome, onSearch, onSelectRegion }) {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Clear search field
  const handleClear = () => {
    setSearchInput('');
  };

  // Return to Dashboard route
  const handleBrandClick = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      navigate('/dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll to region section or route to dashboard with region hash
  const handleRegionClick = (region) => {
    if (onSelectRegion) {
      onSelectRegion(region);
      return;
    }

    const regionTargetId = `region-${region.toLowerCase()}`;
    const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';

    if (isDashboard) {
      const element = document.getElementById(regionTargetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/dashboard#${regionTargetId}`);
    }
  };

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        {/* 1. App Brand Logo & Title (Navigates to Dashboard) */}
        <div
          className="navbar-brand"
          onClick={handleBrandClick}
          title="Go to Dashboard"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleBrandClick()}
        >
          <span className="brand-icon">✈️</span>
          <div className="brand-text">
            <h1 className="brand-name">Travel Destination Explorer</h1>
          </div>
        </div>

        {/* 2. Region Quick Links */}
        <nav className="navbar-links" aria-label="Region navigation">
          {/* <button
            type="button"
            className="nav-link-btn"
            onClick={handleBrandClick}
            title="Dashboard Home"
          >
            🏠 Dashboard
          </button> */}
          {REGIONS.map((region) => (
            <button
              key={region}
              type="button"
              className="nav-link-btn"
              onClick={() => handleRegionClick(region)}
            >
              {region}
            </button>
          ))}
        </nav>

        {/* 3. Global Search Bar */}
        <form className="navbar-search" onSubmit={handleSearchSubmit} role="search">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search destination..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search destination"
            />
            {searchInput && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClear}
                title="Clear input"
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="search-submit-btn">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

export default Navigation;
