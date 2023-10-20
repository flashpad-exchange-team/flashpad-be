const fs = require("fs");
const cron = require("node-cron");
const ethers = require("ethers");
const { createCronJob } = require("./swap-event-jobs.js");
const { abi: PAIR_FACTORY_ABI } = require("./ArthurFactory.json");

const RPC_URL = process.env.RPC_URL || "https://rpc.goerli.linea.build";

const PAIR_FACTORY_ADDRESS =
	process.env.PAIR_FACTORY_ADDRESS ||
	"0xc65a8b166c2b6C386ee0B6CD7dFd3e502793B2c4";

const provider = new ethers.JsonRpcProvider(RPC_URL);

const pairFactoryContract = new ethers.Contract(
	PAIR_FACTORY_ADDRESS,
	PAIR_FACTORY_ABI,
	provider
);

const listPairAddresses = [
	"0x76323F63B0acB5cefb0C1DE7984A40389494F393",
	"0xbfc90E1aBc5820268F41ca5E2fEf8357D4486cEc",
	"0xf8E6cE462bc1b3b9C65c3832A3bDA1Ba4726A5D9",
	"0x71F1785Eb7839F3D3175f84bE458cd126a5e6346",
	"0xE77bA493b264451dAe9A1454B96041121664e8a6",
	"0x5c00DdA7A4FAd34bBFBA407d38B53A372Ba25f39",
	"0xea810450b27Ea164B14Bf12A3EC1AeB9E56DB260",
	"0xfB611A904Cff1179674F8c0E87096984A672375F",
	"0xC07EF79a0b2d79AeC2b2768e1a733F287CD5e222",
];

const crawlPairCreatedEvents = async () => {
	const latestBlock = await provider.getBlock("latest"); // Get the latest block number
	const latestBlockNum = latestBlock.number;
	const historicalBlockNum = latestBlockNum - 1000;

	const eventName = "PairCreated";
	const events = await pairFactoryContract.queryFilter(
		eventName,
		historicalBlockNum,
		"latest"
	);

	for (const event of events) {
		const [token0, token1, pair, length] = event.args;
		console.log(
			`PairFactory contract ${PAIR_FACTORY_ADDRESS} - event PairCreated:`,
			{
				token0,
				token1,
				pair,
				length,
			}
		);
		listPairAddresses.push(pair + "");
		fs.writeFileSync(
			"list-pair-addresses.json",
			JSON.stringify(listPairAddresses)
		);
		createCronJob("*/5 * * * * *", pair + "");
	}
};

const startCronJobs = () => {
	try {
		cron.schedule("*/5 * * * * *", crawlPairCreatedEvents).start();

		for (const addr of listPairAddresses) {
			createCronJob("*/5 * * * * *", addr + "");
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	startCronJobs,
};
