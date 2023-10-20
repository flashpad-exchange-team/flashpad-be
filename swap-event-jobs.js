const cron = require("node-cron");
const ethers = require("ethers");
const { abi: PAIR_ABI } = require("./ArthurPair.json");

const RPC_URL = process.env.RPC_URL || "https://rpc.goerli.linea.build";

// Define an array to store your cron job objects
const cronJobs = [];

const getCronJobs = () => cronJobs;

const provider = new ethers.JsonRpcProvider(RPC_URL);

const crawlSwapEvents = async (pairAddress) => {
	const latestBlock = await provider.getBlock("latest"); // Get the latest block number
	const latestBlockNum = latestBlock.number;
	const historicalBlockNum = latestBlockNum - 1000;

	const pairContract = new ethers.Contract(pairAddress, PAIR_ABI, provider);

	const eventName = "Swap";
	const events = await pairContract.queryFilter(
		eventName,
		historicalBlockNum,
		"latest"
	);

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
const createCronJob = (schedule, pairAddress) => {
	const job = cron.schedule(schedule, () => {
		// Perform the task here
		crawlSwapEvents(pairAddress);
	});

	// Store the job object in the array for future reference
	cronJobs.push(job);

	// Start the cron job
	job.start();
};

module.exports = {
	createCronJob,
	getCronJobs,
};
