export const ENV = {
  NODE_ENV: import.meta.env.MODE || 'development',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:5447',
  IS_PROD: import.meta.env.PROD || false,
  IS_DEV: import.meta.env.DEV || true,
};
