export const BACKEND_URL = import.meta.env.VITE_API_URL  || 'http://localhost:5000/api';
export const AUTH_SALESFORCE_URL = `${BACKEND_URL}/auth/salesforce`;
export const AUTH_SHAREPOINT_URL = `${BACKEND_URL}/auth/sharepoint`;
export const GET_SALESFORCE_OBJECTS_URL = `${BACKEND_URL}/salesforce/objects`;
export const MIGRATE_START_URL = `${BACKEND_URL}/migration/start`;
export const MIGRATE_PROGRESS_URL = `${BACKEND_URL}/migration/progress`;
export const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL  || 'ws://localhost:5000';