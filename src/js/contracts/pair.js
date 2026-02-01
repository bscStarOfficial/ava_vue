import defaultAbi from '@/abis/pair';
import {getAddress} from "@/js/config";
import BigNumber from "bignumber.js";
import {Interface} from "ethers";
import {getContract} from "@/js/web3";

export async function getDefaultContract(name) {
  let defaultAddress = await getAddress(name);
  return await getContract(defaultAbi, defaultAddress)
}

export async function token0Encode(name = 'usdtAva') {
  let imp = new Interface(defaultAbi);
  return [
    await getAddress(name),
    imp.encodeFunctionData("token0"),
  ]
}

export async function token1Encode(name = 'usdtAva') {
  let imp = new Interface(defaultAbi);
  return [
    await getAddress(name),
    imp.encodeFunctionData("token1"),
  ]
}

export async function tokenReservesDecode(reserves) {
  let imp = new Interface(defaultAbi);
  let reserveResult = imp.decodeFunctionResult("getReserves", reserves)

  return [numDiv18(reserveResult[0]), numDiv18(reserveResult[1])]
}

export async function getReservesEncode(name = 'usdtAva') {
  let imp = new Interface(defaultAbi);
  return [
    await getAddress(name),
    imp.encodeFunctionData("getReserves"),
  ]
}

function numDiv18(number) {
  number = number.toString()
  return new BigNumber(number).dividedBy(1e18).toNumber()
}
