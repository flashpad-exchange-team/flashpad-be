import { abi as MerlinPoolFactoryABI } from "../resources/MerlinPoolFactory.json";
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
      abi: MerlinPoolFactoryABI,
      functionName,
      args,
    });
    return result;
  } catch (err: any) {
    console.log(err);
    return undefined;
  }
};
