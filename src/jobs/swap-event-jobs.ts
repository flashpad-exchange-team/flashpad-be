import cron from "node-cron";
import { JsonRpcProvider, Contract, EventLog } from "ethers";
import { abi as PAIR_ABI } from "../resources/ArthurPair.json";

const RPC_URL = process.env.RPC_URL || "https://rpc.goerli.linea.build";

// Define an array to store your cron job objects
const cronJobs = [];

export const getCronJobs = () => cronJobs;

const provider = new JsonRpcProvider(RPC_URL);

const crawlSwapEvents = async (pairAddress) => {
	const latestBlock = await provider.getBlock("latest"); // Get the latest block number
	const latestBlockNum = latestBlock.number;
	const historicalBlockNum = latestBlockNum - 1000;

	const pairContract = new Contract(pairAddress, PAIR_ABI, provider);

	const eventName = "Swap";
	const events = (await pairContract.queryFilter(
		eventName,
		historicalBlockNum,
		"latest"
	)) as EventLog[];

	for (const event of events) {
		const [sender, amount0In, amount1In, amount0Out, amount1Out, to] =
			event.args;
		console.log(`Pair contract ${pairAddress} - event Swap:`, {
			sender,
			amount0In,
			amount1In,
			amount0Out,
			amount1Out,
			to,
		});
	}
};

// Function to create and manage a new cron job
export const createCronJob = (schedule, pairAddress) => {
	const job = cron.schedule(schedule, () => {
		// Perform the task here
		crawlSwapEvents(pairAddress);
	});

	// Store the job object in the array for future reference
	cronJobs.push(job);

	// Start the cron job
	job.start();
};
