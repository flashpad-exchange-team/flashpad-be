import { Request, Response } from "express";
import * as lpPairService from "../services/lpPair.service";
import * as pairContract from "../utils/pairContract";
import * as arthurMasterContract from "../utils/arthurMasterContract";
import * as web3Helpers from "../utils/web3Helpers";
import BigNumber from "bignumber.js";
import { formatUnits } from "ethers";
import {
  ARTHUR_MASTER_ADDRESS,
  CHAINS_TOKENS_LIST,
  USD_PRICE,
} from "../configs/constants";
import { toObject } from "../utils/misc";
import { zeroAddress } from "viem";
export const getLpPairs = async (req: Request, res: Response) => {
  try {
    const address = req.query.address as string;
    if (!!address) {
      return getOneLpPair(res, address);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await lpPairService.getAllPairs(page, limit);

    const { total, data } = result;
    const response: any = {
      data,
      message: "ok",
      total,
      page,
      limit,
    };

    return res.status(200).json(response);
  } catch (err: any) {
    console.error(`getAllLpPairs error: ${err?.message || err}`);
    return res.status(500).json({
      message: err?.message || "Internal server error",
    });
  }
};

const getOneLpPair = async (res: Response, address: string) => {
  try {
    const data = await lpPairService.getOnePair(address);

    const response: any = {
      message: "ok",
      data,
    };

    return res.status(200).json(response);
  } catch (err: any) {
    console.error(`getOneLpPair error: ${err?.message || err}`);
    return res.status(500).json({
      message: err?.message || "Internal server error",
    });
  }
};

// useAllPairsDataForAllPool
export const getAllPairsDataForAllPool = async (
  req: Request,
  res: Response
) => {
  try {
    const address = req.query.address as string;
    if (!!address) {
      return getOneLpPair(res, address);
    }

    const userAddress = req.query.userAddress as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await lpPairService.getAllPairs(page, limit);

    const allPairsData = result.data;

    const userLpBalancesPromises: Promise<any>[] = userAddress
      ? allPairsData.map((pairData) =>
          pairContract.read(pairData.address, "balanceOf", [userAddress])
        )
      : Array(allPairsData.length).fill(0);
    const [userLpBalances, totalSupplies, reserves] = await Promise.all([
      Promise.all(userLpBalancesPromises),
      Promise.all(
        allPairsData.map((pairData) =>
          pairContract.read(pairData.address, "totalSupply", [])
        )
      ),
      Promise.all(
        allPairsData.map((pairData) =>
          pairContract.read(pairData.address, "getReserves", [])
        )
      ) as any,
    ]);

    const tokenDataMap: Map<string, any> = new Map();
    for (const token of CHAINS_TOKENS_LIST) {
      tokenDataMap.set(token.address, {
        symbol:
          token.symbol == "WFTM" || token.symbol == "WETH"
            ? "ETH"
            : token.symbol,
        logoURI: token.logoURI,
        decimals: token.decimals || 8,
      });
    }

    const listPairs: Array<any> = [];
    for (let i = 0; i < allPairsData.length; i++) {
      const pairData: any = allPairsData[i];
      const pairAddress: string = pairData.address;
      const token1Data: any = tokenDataMap.get(pairData.token1_address);
      const token2Data: any = tokenDataMap.get(pairData.token2_address);

      const userBalance: any = userLpBalances[i];
      const totalSupply: any = totalSupplies[i];
      const [reserve1, reserve2]: any = (reserves as any)[i];

      const token1Reserve: any = formatUnits(reserve1, token1Data.decimals);
      const token2Reserve: any = formatUnits(reserve2, token2Data.decimals);
      const TVL: any = new BigNumber(token1Reserve)
        .times(USD_PRICE)
        .plus(new BigNumber(token2Reserve).times(USD_PRICE))
        .toFixed(2);

      const poolAddress: any = pairData?.nft_pool?.address || "";
      const feeShare: any = new BigNumber(pairData.vol24h).times(0.3).div(100);
      const feeAPR: any = feeShare.times(365).div(TVL).times(100);

      let dailyART: BigNumber = BigNumber(0);
      if (poolAddress) {
        const masterPoolInfo: any = await arthurMasterContract.read(
          ARTHUR_MASTER_ADDRESS as any,
          "getPoolInfo",
          [poolAddress]
        );

        dailyART = new BigNumber(masterPoolInfo?.poolEmissionRate || 0)
          .times(86400)
          .div("1000000000000000000");
      }

      const farmBaseAPR: any = dailyART.times(365).div(TVL).times(100);

      const poolShare: any = new BigNumber(userBalance)
        .div(totalSupply)
        .times(100)
        .toFixed(2);

      listPairs.push({
        token1: token1Data.symbol,
        token2: token2Data.symbol,
        token1Address: pairData.token1_address,
        token2Address: pairData.token2_address,
        token1Logo: token1Data.logoURI,
        token2Logo: token2Data.logoURI,
        myPoolShare: poolShare,
        pairAddress,
        TVL,
        feeAPR,
        farmBaseAPR,
        userLpBalance: new BigNumber(userBalance)
          .div(new BigNumber(10).pow(18))
          .toFixed(),
      });
    }
    return res.status(200).json(listPairs);
  } catch (err: any) {
    console.error(`getAllLpPairs error: ${err?.message || err}`);
    return res.status(500).json({
      message: err?.message || "Internal server error",
    });
  }
};

// useAllPairsData
export const getAllPairsDataForPosition = async (
  req: Request,
  res: Response
) => {
  try {
    const address = req.query.address as string;
    if (!!address) {
      return getOneLpPair(res, address);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await lpPairService.getAllPairs(page, limit);

    const userAddress = req.query.userAddress as string;
    const { timestamp } = await web3Helpers.getBlock();
    const allPairsData = result.data;

    const listPairs = await Promise.all(
      allPairsData.map(async (pairData: any) => {
        const {
          address: pairAddress,
          token1_address,
          token2_address,
        } = pairData;

        const [
          lockRemoveUntil,
          lpTokenDecimals,
          userLpBalance,
          totalSupply,
          [reserves0, reserves1],
        ] = await Promise.all([
          pairContract.read(pairAddress, "getTimeCanRemoveLiquidity", []),
          pairContract.read(pairAddress, "decimals", []),
          userAddress
            ? pairContract.read(pairAddress, "balanceOf", [userAddress])
            : 0,
          pairContract.read(pairAddress, "totalSupply", []),
          pairContract.read(pairAddress, "getReserves", []),
        ]);

        const token1 = CHAINS_TOKENS_LIST.find(
          (e) => e.address === token1_address
        );
        const token2 = CHAINS_TOKENS_LIST.find(
          (e) => e.address === token2_address
        );

        const token1Symbol =
          token1?.symbol === "WFTM" || token1?.symbol === "WETH"
            ? "ETH"
            : token1?.symbol || "UNKNOWN";

        const token2Symbol =
          token2?.symbol === "WFTM" || token2?.symbol === "WETH"
            ? "ETH"
            : token2?.symbol || "UNKNOWN";

        const token1Logo = token1?.logoURI;
        const token2Logo = token2?.logoURI;

        const token1Reserve = formatUnits(reserves0, token1?.decimals || 8);
        const token2Reserve = formatUnits(reserves1, token2?.decimals || 8);

        const TVL = new BigNumber(token1Reserve)
          .times(USD_PRICE)
          .plus(new BigNumber(token2Reserve).times(USD_PRICE))
          .toFixed(2);

        const poolShare = BigNumber(userLpBalance)
          .div(totalSupply)
          .times(100)
          .toFixed(2);

        const locked = timestamp < lockRemoveUntil;

        return {
          timeLock: web3Helpers.getDateFormat(lockRemoveUntil),
          locked,
          token1: token1Symbol,
          token2: token2Symbol,
          token1Address: token1_address,
          token2Address: token2_address,
          lpTokenDecimals: Number(lpTokenDecimals),
          token1Logo,
          token2Logo,
          myPoolShare: poolShare,
          pairAddress,
          TVL,
          userLpBalance:
            userLpBalance == 0
              ? "0.00"
              : new BigNumber(userLpBalance)
                  .div(new BigNumber(10).pow(18))
                  .toFixed(),
        };
      })
    );

    return res.status(200).json(toObject(listPairs));
  } catch (err: any) {
    console.error(`getAllLpPairs error: ${err?.message || err}`);
    return res.status(500).json({
      message: err?.message || "Internal server error",
    });
  }
};

export const getInfoOfAllPool = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await lpPairService.getAllPairs(page, limit);

    const allPairsData = result.data;
    const [reserves] = await Promise.all([
      Promise.all(
        allPairsData.map((pairData) =>
          pairContract.read(pairData.address, "getReserves", [])
        )
      ) as any,
    ]);

    const tokenDataMap: Map<string, any> = new Map();
    for (const token of CHAINS_TOKENS_LIST) {
      tokenDataMap.set(token.address, {
        symbol:
          token.symbol == "WFTM" || token.symbol == "WETH"
            ? "ETH"
            : token.symbol,
        logoURI: token.logoURI,
        decimals: token.decimals || 8,
      });
    }

    let totalTVL = new BigNumber(0)
    for (let i = 0; i < allPairsData.length; i++) {
      const pairData: any = allPairsData[i];
      const token1Data: any = tokenDataMap.get(pairData.token1_address);
      const token2Data: any = tokenDataMap.get(pairData.token2_address);

      const [reserve1, reserve2]: any = (reserves as any)[i];

      const token1Reserve: any = formatUnits(reserve1, token1Data.decimals);
      const token2Reserve: any = formatUnits(reserve2, token2Data.decimals);
      const TVL: any = new BigNumber(token1Reserve)
        .times(USD_PRICE)
        .plus(new BigNumber(token2Reserve).times(USD_PRICE))
        .toFixed(2);
      
      totalTVL = totalTVL.plus(TVL);
    }

    return res.status(200).json({
      totalTVL: totalTVL.toString()
    });
  } catch (err: any) {
    console.error(`getAllLpPairs error: ${err?.message || err}`);
    return res.status(500).json({
      message: err?.message || "Internal server error",
    });
  }
}
