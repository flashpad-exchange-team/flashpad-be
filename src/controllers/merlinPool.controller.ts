import { toObject } from "./../utils/misc";
import { Contract, JsonRpcProvider, ethers } from "ethers";
import { Request, Response } from "express";
import { Address } from "viem";
import {
  CHAINS_TOKENS_LIST,
  MERLIN_POOL_FACTORY_ADDRESS,
  ONE_YEAR,
  RPC_URL,
  ADDRESS_ZERO,
} from "../configs/constants";
import { abi as ArthurPairABI } from "../resources/ArthurPair.json";
import { abi as MERLIN_POOL_ABI } from "../resources/MerlinPool.json";
import * as merlinPoolService from "../services/merlinPool.service";
import * as merlinPoolContract from "../utils/merlinPoolContract";
import * as merlinPoolFactoryContract from "../utils/merlinPoolFactoryContract";
import * as nftPoolContract from "../utils/nftPoolContract";
import * as pairContract from "../utils/pairContract";
import * as erc20Contract from "../utils/erc20TokenContract";

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

// useAllMerlinPoolsData
export const getAllMerlinPoolsData = async (req: Request, res: Response) => {
  try {
    const userAddress = req.query.userAddress as string;
    if (!userAddress) {
      res.status(400).send("Invalid user address");
      return;
    }
    const listMerlinPools = [];

    console.log("listMerlinPools", listMerlinPools);

    const nPools = await merlinPoolFactoryContract.read(
      MERLIN_POOL_FACTORY_ADDRESS as Address,
      "merlinPoolsLength",
      []
    );

    for (let i = 0; i < nPools; i++) {
      const merlinPoolAddress = await merlinPoolFactoryContract.read(
        MERLIN_POOL_FACTORY_ADDRESS as Address,
        "getMerlinPool",
        [i]
      );

      const isPublished = await merlinPoolContract.read(
        merlinPoolAddress as Address,
        "published",
        []
      );

      if (!isPublished) {
        continue;
      }

      const [
        rewardsToken1,
        rewardsToken2,
        settings,
        totalDepositAmount,
        pendingRewards,
        nftPoolAddress,
      ] = await Promise.all([
        merlinPoolContract.read(merlinPoolAddress, "rewardsToken1", []),
        merlinPoolContract.read(merlinPoolAddress, "rewardsToken2", []),
        merlinPoolContract.read(merlinPoolAddress, "settings", []),
        merlinPoolContract.read(merlinPoolAddress, "totalDepositAmount", []),
        merlinPoolContract.read(merlinPoolAddress, "pendingRewards", [
          userAddress,
        ]),
        merlinPoolContract.read(merlinPoolAddress, "nftPool", []),
      ]);

      const [rewardsToken1Symbol, poolInfoObj] = await Promise.all([
        erc20Contract.erc20Read(rewardsToken1?.token, "symbol", []),
        nftPoolContract.read(nftPoolAddress, "getPoolInfo", []),
      ]);

      let rewardsToken2Symbol = "";
      if (
        rewardsToken2 &&
        rewardsToken2.token &&
        rewardsToken2.token !== ADDRESS_ZERO
      ) {
        rewardsToken2Symbol = await erc20Contract.erc20Read(
          rewardsToken2?.token,
          "symbol",
          []
        );
      }

      const rewardsToken1Logo = CHAINS_TOKENS_LIST.find((e) => {
        return e.symbol == rewardsToken1Symbol;
      })?.logoURI;

      const rewardsToken2Logo = CHAINS_TOKENS_LIST.find((e) => {
        return e.symbol == rewardsToken2Symbol;
      })?.logoURI;

      const lpToken = poolInfoObj?.lpToken;

      let [lpTokenDecimals, token1Address, token2Address] = await Promise.all([
        pairContract.read(lpToken, "decimals", []),
        pairContract.read(lpToken, "token0", []),
        pairContract.read(lpToken, "token1", []),
      ]);

      let token1Symbol = "TOKEN1",
        token2Symbol = "TOKEN2";
      if (token1Address) {
        [token1Symbol, token2Symbol] = await Promise.all([
          erc20Contract.erc20Read(token1Address, "symbol", []),
          erc20Contract.erc20Read(token2Address, "symbol", []),
        ]);
      } else if (lpTokenDecimals) {
        token1Symbol = await erc20Contract.erc20Read(lpToken, "symbol", []);
        token2Symbol = token1Symbol;
      }

      token1Symbol =
        token1Symbol == "WFTM" || token1Symbol == "WETH" ? "ETH" : token1Symbol;
      token2Symbol =
        token2Symbol == "WFTM" || token2Symbol == "WETH" ? "ETH" : token2Symbol;

      const token1Logo = CHAINS_TOKENS_LIST.find((e) => {
        return e.symbol === token1Symbol;
      })?.logoURI;

      const token2Logo = CHAINS_TOKENS_LIST.find((e) => {
        return e.symbol === token2Symbol;
      })?.logoURI;

      listMerlinPools.push({
        token1: token1Symbol,
        token2: token2Symbol,
        token1Logo,
        token2Logo,
        token1Address,
        token2Address,
        rewardsToken1Info: rewardsToken1,
        rewardsToken2Info: rewardsToken2,
        rewardsToken1Symbol,
        rewardsToken2Symbol,
        rewardsToken1Logo,
        rewardsToken2Logo,
        settings,
        totalDeposit: totalDepositAmount,
        pendingRewards,
        lpTokenAddress: lpToken,
        lpTokenDecimals: Number(lpTokenDecimals),
        nftPoolAddress,
        poolAddress: merlinPoolAddress,
      });
    }

    res.json(toObject(listMerlinPools));
  } catch (err: any) {
    return res.status(500).json({
      message: err?.message || "Internal server error",
    });
  }
};
