import { abi as ArthurPairABI } from "../resources/ArthurPair.json";
import { publicClient } from "./web3Clients";
import { Address } from "viem";

export const read = async (
  address: Address,
  functionName: string,
  args: any[]
) => {
  try {
    const result = await publicClient.readContract({
      address,
      abi: ArthurPairABI,
      functionName,
      args,
    });
    return result;
  } catch (err: any) {
    console.log(err);
    return undefined;
  }
};
