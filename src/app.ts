import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({});

import { startCronJobs } from "./jobs/pair-created-event-job";
import { SERVER_PORT } from "./configs/constants";
import storage from "./utils/storage";
import { initDBConnection } from "./configs/database.config";

storage.init("db.json");
initDBConnection().then((_) => {
	startCronJobs();
});

const app = express();

app.use(
	cors({
		origin: true,
		credentials: true,
	})
);

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.get("/health-check", (req: Request, res: Response) => {
	res.send("OK");
});


// Start the express server and listen on the specified port
app.listen(SERVER_PORT, () =>
	console.log(`Server is running on port ${SERVER_PORT}`)
);
