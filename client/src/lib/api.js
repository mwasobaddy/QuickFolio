// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiUrl = (endpoint) => {
  // In development, use relative URLs (handled by Vite proxy)
  // In production, use full URL
  if (!API_BASE_URL) {
    return endpoint;
  }
  return `${API_BASE_URL}${endpoint}`;
};