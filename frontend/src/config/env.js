// Environment configuration and feature flags

// Toggle this flag to switch between mock data and real API calls.
export const USE_MOCKS = false;

// Define base URL for real API calls
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
