/**
 * API Service for REST Countries API
 * All API calls are centralized here for clean separation of concerns.
 * 
 * Token and endpoints used as specified in App.js and sampleApiresponse.jsx
 */

import { BASE_URL, AUTH_TOKEN, REGIONS } from '../constants';

// Re-export REGIONS for backwards compatibility
export { REGIONS };

// Helper to make authenticated requests
async function apiRequest(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error(`Error requesting ${endpoint}:`, error);
    throw error;
  }
}

/**
 * 1. Fetch countries by region and sort them by population (descending)
 * Endpoint: /countries/v5?region={regionName}
 */
export async function getCountriesByRegion(region) {
  const data = await apiRequest(`?region=${encodeURIComponent(region)}`);
  const countries = data?.objects || [];

  // Sort countries according to their population (highest first)
  countries.sort((a, b) => {
    const popA = a.population || 0;
    const popB = b.population || 0;
    return popB - popA;
  });

  return countries;
}

/**
 * 2. Search countries by name or query
 * Endpoint: /countries/v5?q={query}
 */
export async function searchCountriesByName(query) {
  if (!query || !query.trim()) {
    return [];
  }

  const data = await apiRequest(`?q=${encodeURIComponent(query.trim())}`);
  const countries = data?.objects || [];

  // Sort search results by population
  countries.sort((a, b) => (b.population || 0) - (a.population || 0));

  return countries;
}

/**
 * 3. Fetch country details by Alpha-2 or Alpha-3 code
 * Endpoint: /countries/v5/codes.alpha_2/{code}?pretty=1
 */
export async function getCountryByCode(code) {
  if (!code) return null;

  // If 2 letters, use alpha_2 endpoint
  if (code.length === 2) {
    const data = await apiRequest(`/codes.alpha_2/${code.toUpperCase()}?pretty=1`);
    return data?.objects?.[0] || null;
  }

  // Fallback search by code/query if 3 letters (alpha-3)
  const data = await apiRequest(`?q=${encodeURIComponent(code)}`);
  return data?.objects?.[0] || null;
}
