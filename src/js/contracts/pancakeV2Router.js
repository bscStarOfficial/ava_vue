import defaultAbi from '@/abis/pancakeV2Router.js';
import {getAddress} from "@/js/config";
import {getContract, getSelectedAddress, getSendPram} from "@/js/web3";
import BigNumber from "bignumber.js";

export async function getDefaultContract() {
  let defaultAddress = await getAddress("pancakeV2Router");
  return await getContract(defaultAbi, defaultAddress)
}

export async function swapFeeOn(amountIn, amountOutMin, path = []) {
  let contract = await getDefaultContract();
  amountIn = new BigNumber(amountIn).multipliedBy(1e18).toFixed(0)
  amountOutMin = new BigNumber(amountOutMin).multipliedBy(1e18).toFixed(0)
  const selectedAddress = getSelectedAddress();
  await contract?.methods?.swapExactTokensForTokensSupportingFeeOnTransferTokens(
    amountIn, amountOutMin, path, selectedAddress, 9999999999
  ).send(await getSendPram());
}
