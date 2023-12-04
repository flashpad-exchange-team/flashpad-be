import { JsonRpcProvider, Contract, EventLog } from "ethers";
import * as merlinPoolRepo from "../repositories/merlinPool.repository";
import * as cronjobInfoRepo from "../repositories/cronJobInfo.repository";
import { abi as MERLIN_POOL_FACTORY_ABI } from "../resources/MerlinPoolFactory.json";
import { abi as MERLIN_POOL_ABI } from "../resources/MerlinPool.json";
import { MERLIN_POOL_FACTORY_ADDRESS, RPC_URL } from "../configs/constants";

const provider = new JsonRpcProvider(RPC_URL);

const merlinPoolFactoryContract = new Contract(
	MERLIN_POOL_FACTORY_ADDRESS,
	MERLIN_POOL_FACTORY_ABI,
	provider
);

export const crawlCreateMerlinPoolEvents = async () => {
	const lastCrawledBlockNum = (await cronjobInfoRepo.getCurrentBlockNum()) + 1;
	const { number: latestBlockNum } = await provider.getBlock("latest");
	if (lastCrawledBlockNum > latestBlockNum) {
		console.log(`crawlCreateMerlinPoolEvents: reached head block ${latestBlockNum}`);
		return;
	}

	let crawlToBlockNum = lastCrawledBlockNum + 499;
	crawlToBlockNum =
		crawlToBlockNum < latestBlockNum ? crawlToBlockNum : latestBlockNum;

	const eventName = "CreateMerlinPool";
	console.log(
		`Listening to event ${eventName} from contract MerlinPoolFactory at ${MERLIN_POOL_FACTORY_ADDRESS} ...`
	);

	let events: EventLog[];
	try {
		events = (await merlinPoolFactoryContract.queryFilter(
			eventName,
			lastCrawledBlockNum,
			crawlToBlockNum
		)) as EventLog[];
	} catch (err: any) {
		console.log(`Error crawlCreateMerlinPoolEvents: ${err}`);
		return;
	}

	for (const event of events) {
		try {
			const [merlinPool] = event.args;
			console.log(
				`MerlinPoolFactory contract ${MERLIN_POOL_FACTORY_ADDRESS} - event CreateMerlinPool:`,
				{
					merlinPoolAddress: merlinPool,
				},
				`- block: ${event.blockNumber}`
			);

      const merlinPoolContract = new Contract(
        merlinPool,
        MERLIN_POOL_ABI,
        provider
      );

      const nftPoolAddr = await merlinPoolContract.nftPool();

			const merlinPoolEntity = await merlinPoolRepo.createMerlinPool(
				merlinPool,
        nftPoolAddr,
			);

			if (!merlinPoolEntity) {
				console.log(
					`Error crawlCreateMerlinPoolEvents: [DB] Could not save new Merlin pool ${merlinPool}`
				);
				return;
			}

			await cronjobInfoRepo.updateCurrentBlockNum(event.blockNumber);
		} catch (err: any) {
			if (err?.message?.includes("UNIQUE_MERLIN_POOL_ADDRESS")) {
				console.info("crawlCreateMerlinPoolEvents:", err.toString());
				continue;
			}
			console.log(`Error crawlCreateMerlinPoolEvents: ${err}`);
			return;
		}
	}
	await cronjobInfoRepo.updateCurrentBlockNum(crawlToBlockNum);
};
