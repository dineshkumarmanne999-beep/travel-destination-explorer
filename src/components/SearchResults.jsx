import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CountryCard from './CountryCard';
import { searchCountriesByName } from '../services/api';
import { POPULAR_SEARCH_SUGGESTIONS } from '../constants';

/**
 * SearchResults Component
 * Independently fetches and displays search results for a given query keyword.
 * Reads search query from URL parameter ?q=... or prop `query`.
 */
function SearchResults({ query: propQuery, onSelectCountry, onBack, onSearchNewQuery }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = propQuery !== undefined ? propQuery : (searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hit the Search API directly when query changes
  useEffect(() => {
    async function performSearch() {
      if (!query || !query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchCountriesByName(query);
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [query]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  const handleSuggestionClick = (item) => {
    if (onSearchNewQuery) {
      onSearchNewQuery(item);
    } else {
      setSearchParams({ q: item });
    }
  };

  return (
    <div className="search-results-container">
      {/* Header */}
      <div className="search-results-header">
        <div>
          <button type="button" className="btn-back" onClick={handleBack}>
            ← Back to All Regions
          </button>
          <h2 className="search-results-title">
            Search Results for <span className="highlight-query">"{query}"</span>
          </h2>
          <p className="search-results-subtitle">
            {loading ? 'Searching countries...' : `Found ${results.length} destination${results.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {results.length > 0 && (
          <button type="button" className="clear-search-pill" onClick={handleBack}>
            ✕ Clear Search
          </button>
        )}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="search-loading">
          <div className="spinner"></div>
          <p>Searching countries across the globe...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && (
        <div className="empty-search-card">
          <span className="empty-icon">🔍</span>
          <h3>No Destinations Found</h3>
          <p>We couldn't find any countries matching "{query}". Try another search term.</p>
          <div className="popular-suggestions">
            <span>Popular suggestions:</span>
            {POPULAR_SEARCH_SUGGESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                className="suggestion-tag"
                onClick={() => handleSuggestionClick(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <button type="button" className="btn-primary" onClick={handleBack}>
            Return to Dashboard
          </button>
        </div>
      )}

      {/* Results Grid */}
      {!loading && results.length > 0 && (
        <div className="search-results-grid">
          {results.map((country, index) => (
            <CountryCard
              key={country.uuid || country.codes?.alpha_2 || index}
              country={country}
              onSelect={onSelectCountry}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
