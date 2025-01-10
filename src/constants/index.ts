export const APP_CONSTANTS = {
  APP_NAME: 'Migration Hub',
  ROUTES: {
    DASHBOARD: '/',
    ACTIVE_MIGRATIONS: '/active',
    HISTORY: '/history',
    CONNECTIONS: '/connections',
  },
  CONNECTION_TYPES: {
    SALESFORCE: 'salesforce',
    SHAREPOINT: 'sharepoint',
  },
  TOAST_DURATION: 5000,
};

export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MIGRATION_START: 'migration_start',
  MIGRATION_PROGRESS: 'migration_progress',
  MIGRATION_COMPLETE: 'migration_complete',
  MIGRATION_ERROR: 'migration_error',
};