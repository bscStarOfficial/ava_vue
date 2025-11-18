import defaultAbi from '@/abis/referral';
import {getAddress} from "@/js/config";
import {getContract} from "@/js/web3";
import {Interface} from "ethers";

export async function getDefaultContract() {
  let defaultAddress = await getAddress('referral');
  return await getContract(defaultAbi, defaultAddress)
}

export async function referralFuncEncode(func, args = []) {
  let imp = new Interface(defaultAbi);
  return [
    await getAddress('referral'),
    args.length === 0 ?
      imp.encodeFunctionData(func) : imp.encodeFunctionData(func, args),
  ]
}

export function referralFuncDecode(func, result) {
  let imp = new Interface(defaultAbi);
  let res = imp.decodeFunctionResult(func, result);
  return res[0];
}
