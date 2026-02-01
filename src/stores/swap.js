import {defineStore} from 'pinia'
import {getAddress} from "@/js/config";

import {balanceOfEncode, balanceOfDecode, allowanceEncode, allowanceDecode,} from "@/js/contracts/erc20s";
import {aggregate} from "@/js/contracts/multiCall";
import {getReservesEncode, tokenReservesDecode} from "@/js/contracts/pair";
import {getSelectedAddress} from "@/js/web3";

export const useSwapStore = defineStore('swap', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => ({
    balance: {
      usdt: 0,
      ava: 0,
    },
    usdtAva: {
      token0: '0x55d398326f99059fF775485246999027B3197955',
      token1: '0x894ccAAf338B29ab3A87788a072955594AAF6F0C',
      usdtReserve: 0,
      avaReserve: 0,
    },
    allowance: {
      usdt: 0,
      ava: 999999999,
    },
  }),

  actions: {
    async setState() {
      let user = getSelectedAddress();
      this.address = user;
      console.log(await getReservesEncode('usdtAva'),)
      let encodeData = [
        await balanceOfEncode('usdt', user),
        await allowanceEncode('usdt', await getAddress('pancakeV2Router')),
        await getReservesEncode('usdtAva'),
        await balanceOfEncode('ava', user),
        await allowanceEncode('ava', await getAddress('pancakeV2Router')),
      ];
      let res = await aggregate(encodeData);
      this.balance.usdt = balanceOfDecode(res[0]);
      this.allowance.usdt = allowanceDecode(res[1]);
      [this.usdtAva.usdtReserve, this.usdtAva.avaReserve] = await tokenReservesDecode(res[2]);
      this.balance.ava = balanceOfDecode(res[3]);
      this.allowance.ava = allowanceDecode(res[4]);
    },
  },
})
