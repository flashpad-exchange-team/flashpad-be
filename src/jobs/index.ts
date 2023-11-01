import cron from "node-cron";
import * as lpPairRepo from "../repositories/lpPair.repository";
import { crawlPairCreatedEvents } from "./pair-created-event-job";
import { crawlPoolCreatedEvents } from "./pool-created-event-job";
import { createCronJob } from "./swap-event-jobs";

export const startCronJobs = async () => {
	try {
		cron.schedule("*/15 * * * * *", crawlPairCreatedEvents).start();
    cron.schedule("*/15 * * * * *", crawlPoolCreatedEvents).start();

		const { data: lpPairs } = await lpPairRepo.getAllPairs(1, 1000);
		const listPairAddresses = lpPairs.map((p) => p.address);

		for (const addr of listPairAddresses) {
			createCronJob("*/15 * * * * *", addr + "");
		}
	} catch (error) {
		console.log("Error startCronJobs:", error);
	}
};
