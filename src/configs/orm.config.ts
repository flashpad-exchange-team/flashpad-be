import "dotenv/config";
import { ConnectionOptions } from "typeorm";
import * as constants from "./constants";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const config: ConnectionOptions = {
	type: "postgres",
	host: constants.DB_HOST,
	port: constants.DB_PORT,
	username: constants.DB_USERNAME,
	password: constants.DB_PASSWORD,
	database: constants.DB_DATABASE,
	entities: ["src/entities/**/*.ts"],
	synchronize: false,
	logging: false,
	extra: {
		connectionLimit: constants.DB_MAX_CONNECTION,
	},
	namingStrategy: new SnakeNamingStrategy(),
	migrations: ["src/database/migrations/**/*.ts"],
	migrationsRun: false,
	cli: {
		migrationsDir: "src/database/migrations",
	},
};

export default config;
