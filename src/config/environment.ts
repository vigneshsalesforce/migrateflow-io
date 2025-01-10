export const ENV = {
  NODE_ENV: import.meta.env.MODE || 'development',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  IS_PROD: import.meta.env.PROD,
  IS_DEV: import.meta.env.DEV,
};