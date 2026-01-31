<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 模拟数据
const amount1 = ref('0.3176');
const amount2 = ref('0.3176');
const swapRate = ref('1 AVA ≈ 0.317 USDT');
const minReceive = ref('0.2637 USDT');
const priceImpact = ref('10%');
const fee = ref('10%');

const handleSwap = () => {
  console.log('执行兑换');
};
</script>

<template>
  <div class="swap-page">
    <!-- 标题栏 -->
    <van-nav-bar :title="$t('avaSwap')" :border="false" @click-left="$router.back()" class="navbar" />
    <!-- 内容 -->
    <div class="content">
      <!-- 发送区块 -->
      <div class="card">
        <div class="label-group">
          <div>{{ t('send') }}</div>
          <div class="value">
            <img src="@/assets/svg/wallet.svg" alt="" class="svg">
            <div>1.4256</div>
            <span>{{ t('all') }}</span>
          </div>
        </div>
        <div class="token-input">
          <div class="token-icon">
            <img src="@/assets/imgs/token.png" alt="" class="token">
            <span>AVA</span>
          </div>
          <div class="token-amount">
            <van-field v-model="amount1" class="amount-input" type="number"/>
            <div class="price">$0.5456</div>
          </div>
        </div>
      </div>

      <!-- 交换箭头 -->
      <img src="@/assets/svg/change.svg" alt="" class="change-svg">

      <!-- 接收区块 -->
      <div class="card MB26">
        <div class="label-group">
          <div>{{ t('send') }}</div>
          <div class="value">
            <img src="@/assets/svg/wallet.svg" alt="" class="svg">
            <div>1.4256</div>
          </div>
        </div>
        <div class="token-input">
          <div class="token-icon">
            <img src="@/assets/imgs/token.png" alt="" class="token">
            <span>AVA</span>
          </div>
          <div class="token-amount">
            <van-field v-model="amount2" class="amount-input" type="number"/>
            <div class="price">$0.5456</div>
          </div>
        </div>
      </div>

      <!-- 确定按钮 -->
      <van-button
          type="primary"
          block
          class="swap-btn"
          @click="handleSwap"
      >
        {{ t('confirmSwap') }}
      </van-button>

      <!-- 详情信息 -->
      <div class="info-card">
        <div class="info-row">
          <div class="row-label">
            <div>{{ t('swapRate') }}</div>
          </div>
          <div class="row-value">
            <div>{{ swapRate }}</div>
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
            <van-icon name="arrow" size="12px" color="#A3A3A5" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/views/swap/swap";
</style>
