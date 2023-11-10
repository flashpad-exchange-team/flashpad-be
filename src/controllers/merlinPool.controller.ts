import { Contract, JsonRpcProvider, ethers } from "ethers";
import { Request, Response } from "express";
import { ONE_YEAR, RPC_URL } from "../configs/constants";
import { abi as ArthurPairABI } from "../resources/ArthurPair.json";
import { abi as MERLIN_POOL_ABI } from "../resources/MerlinPool.json";
import * as merlinPoolService from "../services/merlinPool.service";

export const getInfo = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    if (!ethers.isAddress(address)) {
      return res.status(400).json({
        message: "Merlin pool address is not valid!",
      });
    }

    const merlinPool = await merlinPoolService.getMerlinPoolByAddress(address);
    if (!merlinPool) {
      return res.status(404).json({
        message: "Merlin pool is not existed!",
      });
    }

    const provider = new JsonRpcProvider(RPC_URL);
    const merlinPoolContract = new Contract(address, MERLIN_POOL_ABI, provider);

    const pairContract = new Contract(
      merlinPool.nft_pool.lp_address,
      ArthurPairABI,
      provider
    );

    const [
      [reserves0, reserves1],
      lpTotalSuppy,
      totalDepositAmount,
      rewardsToken1PerSecond,
    ] = await Promise.all([
      pairContract.getReserves(),
      pairContract.totalSupply(),
      merlinPoolContract.totalDepositAmount(),
      merlinPoolContract.rewardsToken1PerSecond(),
    ]);

    // !TODO: Call api or do something to calculate price
    const reserveToken1Price = BigInt(1);
    const reserveToken2Price = BigInt(1);
    const lpTVL =
      reserves0 * reserveToken1Price + reserves1 * reserveToken2Price;

    // 1 parameter
    const merlinPoolTVP = (totalDepositAmount * lpTVL) / lpTotalSuppy;

    // !TODO: Call api or do something to calculate price
    const rewardsToken1Price = BigInt(1);
    const yearlyEmission =
      rewardsToken1PerSecond * rewardsToken1Price * BigInt(ONE_YEAR);

    /**
     * APR = (yearly emission / TVL MerlinPool) * 100
     */
    const apr =
      merlinPoolTVP === BigInt(0)
        ? BigInt(0)
        : (yearlyEmission * BigInt(100)) / merlinPoolTVP;

    const response: any = {
      message: "ok",
      data: {
        merlinPoolTVP: merlinPoolTVP.toString(),
        apr: apr.toString(),
        lpTotalSuppy: lpTotalSuppy.toString(),
        totalDepositAmount: totalDepositAmount.toString(),
      },
    };

    return res.status(200).json(response);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      message: err?.message || "Internal server error",
    });
  }
};
