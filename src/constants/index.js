/**
 * Application Constants
 * Centralized constant values across the Travel Destination Explorer application.
 */

// 1. Target continental regions
export const REGIONS = ['Europe', 'Asia', 'Africa', 'Americas', 'Oceania'];

// 2. REST Countries API Configuration
export const BASE_URL = 'https://api.restcountries.com/countries/v5';
export const AUTH_TOKEN = 'rc_live_5e142dab54ff418fb33cefeeed7697c8';

// Aliases for API configuration
export const API_BASE_URL = BASE_URL;
export const API_AUTH_TOKEN = AUTH_TOKEN;

// 3. Popular destination suggestions for search empty state
export const POPULAR_SEARCH_SUGGESTIONS = [
  'India',
  'Italy',
  'Canada',
  'Japan',
  'France',
  'Brazil'
];

// 4. Application Route Paths
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  COUNTRY_DETAIL: '/country/:code',
  SEARCH: '/search',
};
