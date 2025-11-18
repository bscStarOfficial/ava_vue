import defaultAbi from '@/abis/multiCall';
import {getAddress} from "@/js/config";
import {getContract, getSelectedAddress} from "@/js/web3";
import {allowanceEncode, balanceOfEncode} from "@/js/contracts/erc20s";
import {nowTimestamp} from "@/js/time";
import {referralFuncEncode} from "@/js/contracts/referral";
import {stakingFuncEncode} from "@/js/contracts/staking";

export async function getDefaultContract() {
  let defaultAddress = await getAddress("multiCall");
  return await getContract(defaultAbi, defaultAddress)
}

export async function aggregate(calls) {
  let contract = await getDefaultContract();

  const sendParam = {from: window.ethereum?.selectedAddress};
  return await contract?.methods?.aggregate(calls).call(sendParam);
}

export async function getCalls(callIds = [], user = '') {
  if (user === '') user = getSelectedAddress();
  let calls = [];
  for (let id of callIds) {
    switch (id) {
      case 0:
        calls.push(await referralFuncEncode('getReferral', [user]));
        break;
      case 1:
        calls.push(await stakingFuncEncode('maxStakeAmount'));
        break;
      case 2:
        calls.push(await stakingFuncEncode('balanceOf', [user]));
        break;
      case 3:
        calls.push(await stakingFuncEncode('getTeamKpi', [user]));
        break;
      case 4:
        calls.push(await balanceOfEncode('usdt', user));
        break;
      case 5:
        calls.push(await allowanceEncode('usdt', await getAddress('staking')));
        break;
    }
  }
  return calls;
}
