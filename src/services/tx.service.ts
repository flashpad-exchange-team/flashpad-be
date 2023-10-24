import * as txRepository from "../repositories/tx.repository";
import { Contract, JsonRpcProvider } from "ethers";
import { abi as PAIR_ABI } from "../resources/ArthurPair.json";
import { RPC_URL } from "../configs/constants";
import BigNumber from "bignumber.js";

const getTxsByPairAddress = async (address: string) => {
	return await txRepository.getTxsByPairAddress(address);
};

const getLast24hTotalVolumeByLPAddress = async (address: string) => {
	const transactions = await txRepository.getTxsByPairAddress(address, true);

	const provider = new JsonRpcProvider(RPC_URL);

	let totalVolume24h = BigNumber(0);
	for (const tx of transactions) {
		const token1Contract = new Contract(tx.lp_pair.token1_address, PAIR_ABI, provider);
		const token2Contract = new Contract(tx.lp_pair.token2_address, PAIR_ABI, provider);
		const [token1Decimals, token2Decimals] = await Promise.all([
			token1Contract.decimals(),
			token2Contract.decimals(),
		]);

		const tokenValueUSD = 2.5;
		totalVolume24h = totalVolume24h.plus(
			BigNumber(tx.token1_amount).div(BigNumber(10).pow(token1Decimals)).times(tokenValueUSD)
			.plus(
				BigNumber(tx.token2_amount).div(BigNumber(10).pow(token2Decimals)).times(tokenValueUSD)
			)
		);
	}
	return totalVolume24h.toString();
}

export default {
	getTxsByPairAddress,
	getLast24hTotalVolumeByLPAddress,
};
