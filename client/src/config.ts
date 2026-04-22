const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const API_URL = rawApiUrl.replace(/\/+$/, '');
export const API_DOCS_URL = `${API_URL}/docs`;
