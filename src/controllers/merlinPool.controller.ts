import { ethers, JsonRpcProvider, Contract } from "ethers";
import { Request, Response } from "express";
import * as merlinPoolService from "../services/merlinPool.service";
import { abi as MERLIN_POOL_ABI } from "../resources/MerlinPool.json";
import { abi as NFT_POOL_ABI } from "../resources/NFTPool.json";
import { RPC_URL } from "../configs/constants";

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

    const nftPoolAddress = await merlinPoolContract.nftPool();

    const nftPoolContract = new Contract(nftPoolAddress, NFT_POOL_ABI, provider);

    const [totalDepositAmount, rewardToken1, rewardToken2, nftPoolInfo] = await Promise.all([
      merlinPoolContract.totalDepositAmount(),
      merlinPoolContract.rewardsToken1(),
      merlinPoolContract.rewardsToken2(),
      nftPoolContract.getPoolInfo()
    ]);

    console.log('nftPoolInfo', nftPoolInfo[0])

    const response: any = {
      message: "ok",
      address,
      totalDepositAmount: totalDepositAmount.toString(),
      rewardToken1: rewardToken1.token,
      rewardToken2: rewardToken2.token,
      nftPoolAddress,
    };

    return res.status(200).json(response);
  } catch (err: any) {
    return res.status(500).json({
      message: err?.message || "Internal server error",
    });
  }
};
