import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({});

import { startCronJobs } from "./jobs/pairCreated-event-job";

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

startCronJobs();

const PORT = process.env.PORT || 4000;
// Start the express server and listen on the specified port
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
