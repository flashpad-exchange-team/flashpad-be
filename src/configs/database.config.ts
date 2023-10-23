import { createConnection, Connection } from "typeorm";
import config from "./orm.config";
import * as constants from "./constants";

let connection: Connection;

export const getDBConnection = async () => {
	if (connection) {
		return connection;
	}

	try {
		connection = await createConnection(config);

		console.log(
			`Connected to wax-notifications DB ${constants.DB_DATABASE}@${constants.DB_HOST}:${constants.DB_PORT}`
		);

		return connection;
	} catch (err) {
		console.log(`createConnection ERROR: ${err}`);
		throw err;
	}
};
