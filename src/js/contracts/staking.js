import defaultAbi from '@/abis/staking';
import {getAddress} from "@/js/config";
import {getContract} from "@/js/web3";
import {Interface} from "ethers";
import BigNumber from "bignumber.js";

export async function getDefaultContract() {
  let defaultAddress = await getAddress('staking');
  return await getContract(defaultAbi, defaultAddress)
}

export async function stakeWithInviter(uAmount, stakeIndex, referrer) {
  let staking = await getDefaultContract();
  uAmount = new BigNumber(uAmount).multipliedBy(1e18).toFixed();
  const selectedAddress = window.ethereum?.selectedAddress;

  const sendParam = {from: selectedAddress};
  await staking?.methods?.stakeWithInviter(
    uAmount, 0, stakeIndex, referrer
  ).send(sendParam);
}

export async function unStake(index) {
  let staking = await getDefaultContract();
  const selectedAddress = window.ethereum?.selectedAddress;

  const sendParam = {from: selectedAddress};
  await staking?.methods?.unStake(index).send(sendParam);
}

export async function redeemUnStake(index) {
  let staking = await getDefaultContract();
  const selectedAddress = window.ethereum?.selectedAddress;

  const sendParam = {from: selectedAddress};
  await staking?.methods?.redeemUnStake(index).send(sendParam);
}

export async function stakingFuncEncode(func, args = []) {
  let imp = new Interface(defaultAbi);
  return [
    await getAddress('staking'),
    args.length === 0 ?
      imp.encodeFunctionData(func) : imp.encodeFunctionData(func, args),
  ]
}

export function stakingFuncDecode(func, result) {
  let imp = new Interface(defaultAbi);
  let res = imp.decodeFunctionResult(func, result);
  if (
    func === 'maxStakeAmount' ||
    func === 'balanceOf' ||
    func === 'caclItem' ||
    func === 'getTeamKpi'
  ) {
    return new BigNumber(res[0]).dividedBy(1e18).toFixed(2)
  } else if (func === 'stakeDays') {
    return new BigNumber(res[0]).toNumber();
  }
  return res[0];
}
