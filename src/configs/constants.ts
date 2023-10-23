
export const NODE_ENV = process.env.NODE_ENV ?? 'production';
/** Postgres DB */
export const DB_HOST = process.env.POSTGRES_DB_HOST ?? 'localhost';
export const DB_PORT = process.env.POSTGRES_DB_PORT ? parseInt(process.env.POSTGRES_DB_PORT) : 5432;
export const DB_DATABASE = process.env.POSTGRES_DB_DATABASE ?? 'arthur-db';
export const DB_USERNAME = process.env.POSTGRES_DB_USERNAME ?? 'postgres';
export const DB_PASSWORD = process.env.POSTGRES_DB_PASSWORD ?? 'postgres';
export const DB_MAX_CONNECTION = process.env.POSTGRES_DB_MAX_CONNECTION_POLL
    ? parseInt(process.env.POSTGRES_DB_MAX_CONNECTION_POLL)
    : 20;