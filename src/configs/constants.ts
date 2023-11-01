export const NODE_ENV = process.env.NODE_ENV || "production";

export const SERVER_PORT = process.env.SERVER_PORT || 4000;

/** Postgres DB */
export const DB_HOST = process.env.POSTGRES_DB_HOST || "localhost";
export const DB_PORT = process.env.POSTGRES_DB_PORT
	? parseInt(process.env.POSTGRES_DB_PORT)
	: 5432;
export const DB_DATABASE = process.env.POSTGRES_DB_DATABASE || "arthurdb";
export const DB_USERNAME = process.env.POSTGRES_DB_USERNAME || "postgres";
export const DB_PASSWORD = process.env.POSTGRES_DB_PASSWORD || "postgres";
export const DB_MAX_CONNECTION = process.env.POSTGRES_DB_MAX_CONNECTION_POLL
	? parseInt(process.env.POSTGRES_DB_MAX_CONNECTION_POLL)
	: 20;

export const RPC_URL = process.env.RPC_URL || "https://rpc.goerli.linea.build";

export const PAIR_FACTORY_ADDRESS =
	process.env.PAIR_FACTORY_ADDRESS ||
	"0x5e18b91bA65Dd227a15A44f9543a74511326BcdD";

export const NFT_POOL_FACTORY_ADDRESS =
	process.env.NFT_POOL_FACTORY_ADDRESS ||
	"0x1f530CB1D6EB608396C8427162F8Fd4715A70385";

export const REDIS_HOST = process.env.REDIS_HOST || "localhost";
export const REDIS_PORT = process.env.REDIS_PORT
	? parseInt(process.env.REDIS_PORT, 10)
	: 6379;

export const DEFAULT_JOBS_START_BLOCK_NUMBER = Number(process.env.DEFAULT_JOBS_START_BLOCK_NUMBER) || 1823490;
