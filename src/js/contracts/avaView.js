import defaultAbi from '@/abis/avaView';
import {getAddress} from "@/js/config";
import {getContract} from "@/js/web3";
import {Interface} from "ethers";
import BigNumber from "bignumber.js";

export async function getDefaultContract() {
  let defaultAddress = await getAddress('avaView');
  return await getContract(defaultAbi, defaultAddress)
}

export async function avaViewFuncEncode(func, args = []) {
  let imp = new Interface(defaultAbi);
  return [
    await getAddress('avaView'),
    args.length === 0 ?
      imp.encodeFunctionData(func) : imp.encodeFunctionData(func, args),
  ]
}

export function avaViewFuncDecode(func, result, decimal = 18) {
  let imp = new Interface(defaultAbi);
  let res = imp.decodeFunctionResult(func, result);
  if (
    func === 'maxStakeAmount' ||
    func === 'balanceOf' ||
    func === 'caclItem' ||
    func === 'rewardOfSlot' ||
    func === 'getTeamKpi'
  ) {
    return new BigNumber(res[0]).dividedBy(1e18).toFixed(decimal, 1)
  } else if (
    func === 'stakeDays' ||
    func === 'unStakeDay')
  {
    return new BigNumber(res[0]).toNumber();
  }
  return res[0];
}
