import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CountryDetail from './components/CountryDetail';
import SearchResults from './components/SearchResults';
import { ROUTES } from './constants';
import './App.css';

/**
 * Travel Destination Explorer - Main Application
 * 
 * Clean Routing Architecture:
 * - /             : Redirects to /dashboard
 * - /dashboard    : Basic initial route showcasing Hero & 5 Region rows
 * - /country/:code: Comprehensive country detail screen with deep-linking & history
 * - /search       : Search results screen with URL query (?q=...) support
 * - *             : Catch-all fallback redirecting to /dashboard
 */
function App() {
  return (
    <BrowserRouter>
      <div className="travel-app">
        {/* Persistent Top Navigation Bar */}
        <Navigation />

        {/* Routed Main View */}
        <main className="main-content">
          <Routes>
            {/* 1. Initial Basic Route: Dashboard */}
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

            {/* 2. Country Detail Route with dynamic parameter :code */}
            <Route path={ROUTES.COUNTRY_DETAIL} element={<CountryDetail />} />

            {/* 3. Search Results Route */}
            <Route path={ROUTES.SEARCH} element={<SearchResults />} />

            {/* 4. Catch-all fallback */}
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <p className="footer-title">✈️ Travel Destination Explorer</p>
            <p className="footer-text">
              Powered by REST Countries API • Developed with React & Vite
            </p>
            <p className="footer-credits">
              Categorizing Europe, Asia, Africa, Americas & Oceania • Sorted by population
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
