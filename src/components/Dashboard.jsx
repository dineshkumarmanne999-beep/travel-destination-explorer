import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import RegionSection from './RegionSection';
import { REGIONS } from '../constants';

/**
 * Dashboard Component
 * Serves as the primary landing route (/ and /dashboard).
 * Displays the Hero search banner and 5 continental region rows.
 */
function Dashboard() {
  const location = useLocation();

  // Smoothly scroll to target region section if hash is present in URL
  useEffect(() => {
    if (location.hash) {
      const targetElement = document.querySelector(location.hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 50);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.hash]);

  return (
    <div className="dashboard-view">
      {/* Hero Welcome Banner with integrated search */}
      <Hero />

      {/* 5 Continents / Regions Horizontal Rows */}
      <div className="regions-container">
        {REGIONS.map((region) => (
          <RegionSection key={region} region={region} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
