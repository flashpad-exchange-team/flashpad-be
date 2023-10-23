import cron from "node-cron";
import { JsonRpcProvider, Contract, EventLog, ethers } from "ethers";
import { createCronJob } from "./swap-event-jobs";
import * as lpPairRepo from "../repositories/lpPair.repository";
import { abi as PAIR_FACTORY_ABI } from "../resources/ArthurFactory.json";
import { PAIR_FACTORY_ADDRESS, RPC_URL } from "../configs/constants";
import storage from "../utils/storage";

const provider = new JsonRpcProvider(RPC_URL);

const pairFactoryContract = new Contract(
	PAIR_FACTORY_ADDRESS,
	PAIR_FACTORY_ABI,
	provider
);

const crawlPairCreatedEvents = async () => {
	const lastCrawledBlockNum = (await storage.getCurrentBlockNumber()) + 1;
	const { number: latestBlockNum } = await provider.getBlock("latest");
	if (lastCrawledBlockNum > latestBlockNum) {
		console.log(`crawlPairCreatedEvents: reached head block ${latestBlockNum}`);
		return;
	}

	let crawlToBlockNum = lastCrawledBlockNum + 499;
	crawlToBlockNum = (crawlToBlockNum < latestBlockNum) ? crawlToBlockNum : latestBlockNum;

	const eventName = "PairCreated";
	console.log(`Listening to event ${eventName} from contract Pair Factory at ${PAIR_FACTORY_ADDRESS} ...`);
	const events = (await pairFactoryContract.queryFilter(
		eventName,
		lastCrawledBlockNum,
		crawlToBlockNum,
	)) as EventLog[];

	for (const event of events) {
		const [token0, token1, pair, length] = event.args;
		console.log(
			`PairFactory contract ${PAIR_FACTORY_ADDRESS} - event PairCreated:`,
			{
				token0,
				token1,
				pair,
				length,
			},
			`- block: ${event.blockNumber}`,
		);

		const lpPairEntity = await lpPairRepo.createPair(
			pair + "",
			token0 + "",
			token1 + ""
		);

		if (!lpPairEntity) {
			console.log(
				`Error crawlPairCreatedEvents: [DB] Could not save new LP pair ${pair}`
			);
			continue;
		}

		await storage.processBlock(event.blockNumber);
		createCronJob("*/15 * * * * *", pair + "");
	}
	await storage.processBlock(crawlToBlockNum);
};

export const startCronJobs = async () => {
	try {
		cron.schedule("*/15 * * * * *", crawlPairCreatedEvents).start();

		const { data: lpPairs } = await lpPairRepo.getAllPairs(1, 1000);
		const listPairAddresses = lpPairs.map((p) => p.address);

		for (const addr of listPairAddresses) {
			createCronJob("*/15 * * * * *", addr + "");
		}
	} catch (error) {
		console.log("Error startCronJobs:", error);
	}
};
