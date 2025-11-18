import {defineStore} from 'pinia'
import {aggregate, getCalls} from "@/js/contracts/multiCall";
import {referralFuncDecode} from "@/js/contracts/referral";
import {balanceOfDecode} from "@/js/contracts/erc20s";
import {stakingFuncDecode} from "@/js/contracts/staking";

export const useStakingStore = defineStore('staking', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => ({
    usdt: {
      balance: 0,
      allowance: 0
    },
    stakeDays: [
      86400,
      86400 * 15,
      86400 * 30,
    ],
    referrer: '0x0000000000000000000000000000000000000000',
    maxStakeAmount: 0,
    balance: 0,
    teamKpi: 0,
    isBuyUnStake: false
  }),
  getters: {
    registered(state) {
      return state.referrer !== '0x0000000000000000000000000000000000000000'
    },
  },
  actions: {
    async setState(callIds = []) {
      let res = await aggregate(await getCalls(callIds));
      res.forEach((data, index) => {
        switch (callIds[index]) {
          case 0:
            this.referrer = referralFuncDecode('getReferral', data);
            break;
          case 1:
            this.maxStakeAmount = stakingFuncDecode('maxStakeAmount', data, 2)
            break
          case 2:
            this.balance = stakingFuncDecode('balanceOf', data, 12);
            break;
          case 3:
            this.teamKpi = stakingFuncDecode('getTeamKpi', data, 4);
            break;
          case 4:
            this.usdt.balance = balanceOfDecode(data);
            break;
          case 5:
            this.usdt.allowance = balanceOfDecode(data);
            break;
          case 6:
            this.stakeDays[0] = stakingFuncDecode('stakeDays', data);
            break;
          case 7:
            this.stakeDays[1] = stakingFuncDecode('stakeDays', data);
            break;
          case 8:
            this.stakeDays[2] = stakingFuncDecode('stakeDays', data);
            break;
          case 9:
            this.isBuyUnStake = stakingFuncDecode('isBuyUnStake', data);
            break;
          case 10:
            this.unStakeDay = stakingFuncDecode('unStakeDay', data);
            break;
        }
      })
    },
  },
})
