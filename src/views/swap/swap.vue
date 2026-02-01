<script setup>
import {ref, reactive, onMounted, inject} from 'vue';
import {useI18n} from 'vue-i18n';
import {useSwapStore} from '@/stores/swap';
import {swapFeeOn} from "@/js/contracts/pancakeV2Router";
import {getAddress, icons} from "@/js/config";
import BigNumber from "bignumber.js";
import {approve} from "@/js/contracts/erc20s";
import {toFixed} from "@/js/utils";
import Alert from "@/components/Alert/Alert.vue";

const showSuccess = inject("showSuccess");
const showError = inject("showError");

const {t} = useI18n();
const swapStore = useSwapStore();

// 模拟数据
const minReceive = ref('0.2637 USDT');
const priceImpact = ref('10%');
const fee = ref('10%');

const swap = reactive({
  from: 'usdt',
  to: 'ava',
  amount0: '',
  amount1: ''
})

const loading = reactive([false, false]);

onMounted(async () => {
  await init()
})

async function init() {
  await Promise.all([
    swapStore.setState(),
  ])
}

function swapReverse() {
  let temp = swap.from;
  swap.from = swap.to;
  swap.to = temp;
  swap.amount0 = '';
  swap.amount1 = '';
}

function getAmountOut() {
  let reserveIn, reserveOut;
  let amountIn = new BigNumber(swap.amount0);
  if (swap.from === 'usdt') {
    reserveIn = new BigNumber(swapStore.reserves.usdt);
    reserveOut = new BigNumber(swapStore.reserves.ava);
  } else {
    reserveIn = new BigNumber(swapStore.reserves.ava);
    reserveOut = new BigNumber(swapStore.reserves.usdt);
  }
  let amountInWithFee = amountIn.multipliedBy(997)
  let numerator = amountInWithFee.multipliedBy(reserveOut);
  let denominator = reserveIn.multipliedBy(1000).plus(amountInWithFee);
  let amountOut = numerator.dividedBy(denominator).toFixed(4, 1);
  swap.amount1 = Number(amountOut);
}

function getAmountIn() {
  let reserveIn, reserveOut;
  let amountOut = new BigNumber(swap.amount1);
  if (swap.from === 'usdt') {
    reserveIn = new BigNumber(swapStore.reserves.usdt);
    reserveOut = new BigNumber(swapStore.reserves.ava);
  } else {
    reserveIn = new BigNumber(swapStore.reserves.ava);
    reserveOut = new BigNumber(swapStore.reserves.usdt);
  }
  let numerator = reserveIn.multipliedBy(amountOut).multipliedBy(1000);
  let denominator = reserveOut.minus(amountOut).multipliedBy(997);
  let amountIn = numerator.dividedBy(denominator).toFixed(4);
  swap.amount0 = Number(amountIn);
}


async function doApprove() {
  if (loading[0]) return;
  loading[0] = true;
  try {
    let amount = new BigNumber('100000000000').multipliedBy(1e18).toFixed()
    await approve(swap.from, await getAddress("pancakeV2Router"), amount);
    await init()
  } catch (e) {
  }
  loading[0] = false;
}

async function doSwap() {
  if (swapStore.allowance[swap.from] < swap.amount0) {
    await doApprove();
  }

  if (loading[1]) return;
  loading[1] = true;
  try {
    let amountOutMin = swap.amount1 * 0.998;
    console.log(swap.from, swap.to)
    await swapFeeOn(swap.amount0, amountOutMin, [
      await getAddress(swap.from),
      await getAddress(swap.to)
    ]);
    await init()
    showSuccess(t('success'));
  } catch (e) {
    console.log(e)
    showError(t('failed'));
  }
  loading[1] = false;
}

</script>

<template>
  <div class="swap-page">
    <!-- 标题栏 -->
    <van-nav-bar :title="$t('avaSwap')" :border="false" @click-left="$router.back()" class="navbar"/>
    <!-- 内容 -->
    <div class="content">
      <!-- 发送区块 -->
      <div class="card">
        <div class="label-group">
          <div>{{ t('send') }}</div>
          <div class="value">
            <img src="@/assets/svg/wallet.svg" alt="" class="svg">
            <div>{{ swapStore.balance[swap.from] }}</div>
            <span>{{ t('all') }}</span>
          </div>
        </div>
        <div class="token-input">
          <div class="token-icon">
            <img :src='icons[swap.from]' alt="" class="token">
            <span>{{ swap.from.toUpperCase() }}</span>
          </div>
          <div class="token-amount">
            <van-field v-model="swap.amount0" class="amount-input" type="number" @keyup="getAmountOut()"/>
            <!--            <div class="price">$0.5456</div>-->
          </div>
        </div>
      </div>

      <!-- 交换箭头 -->
      <img src="@/assets/svg/change.svg" alt="" class="change-svg" @click="swapReverse()">

      <!-- 接收区块 -->
      <div class="card MB26">
        <div class="label-group">
          <div>{{ t('send') }}</div>
          <div class="value">
            <img src="@/assets/svg/wallet.svg" alt="" class="svg">
            <div>{{ swapStore.balance[swap.to] }}</div>
          </div>
        </div>
        <div class="token-input">
          <div class="token-icon">
            <img :src='icons[swap.to]' alt="" class="token">
            <span>{{ swap.to.toUpperCase() }}</span>
          </div>
          <div class="token-amount">
            <van-field v-model="swap.amount1" class="amount-input" type="number" @keyup="getAmountIn()"/>
            <!--            <div class="price">$0.5456</div>-->
          </div>
        </div>
      </div>

      <van-button v-if="loading[0] || loading[1]"
                  type="primary" block class="swap-btn">
        <van-loading style="width: 20px;" size="22" type="circular" color="#0f0f0f"/>
      </van-button>
      <!-- 确定按钮 -->
      <van-button v-else type="primary" block class="swap-btn" @click="doSwap()">
        {{ t('confirmSwap') }}
      </van-button>

      <!-- 详情信息 -->
      <div class="info-card">
        <div class="info-row">
          <div class="row-label">
            <div>{{ t('swapRate') }}</div>
          </div>
          <div class="row-value">
            <div>1{{ swap.from.toUpperCase() }}
              ≈{{ toFixed(swapStore.reserves[swap.to] / swapStore.reserves[swap.from], 4) }}{{ swap.to.toUpperCase() }}
            </div>
            <img src="@/assets/svg/trans.svg" alt="" class="tip-svg">
          </div>
        </div>
        <div class="info-row">
          <div class="row-label">
            <div>{{ t('minReceive') }}</div>
          </div>
          <div class="row-value">
            <div>{{ minReceive }}</div>
          </div>
        </div>
        <div class="info-row">
          <div class="row-label">
            <div>{{ t('priceImpact') }}</div>
          </div>
          <div class="row-value">
            <div>{{ priceImpact }}</div>
          </div>
        </div>
        <div class="info-row">
          <div class="row-label">
            <div>{{ t('fee') }}</div>
            <img src="@/assets/svg/tip.svg" alt="" class="tip-svg">
          </div>
          <div class="row-value">
            <div>{{ fee }}</div>
            <van-icon name="arrow" size="12px" color="#A3A3A5"/>
          </div>
        </div>
      </div>
    </div>

    <Alert/>
  </div>
</template>

<style scoped lang="scss">
@use "@/views/swap/swap";
</style>
