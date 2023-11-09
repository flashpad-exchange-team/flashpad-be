import { ethers } from "ethers";
import { Request, Response } from "express";
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

    const response: any = {
      message: "ok",
      address,
    };

    return res.status(200).json(response);
  } catch (err: any) {
    return res.status(500).json({
      message: err?.message || "Internal server error",
    });
  }
};
