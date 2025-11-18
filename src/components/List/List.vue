<script setup>
import {onMounted, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import {getUserRecords} from "@/js/contracts/staking";
import {nowTimestamp, timestampFormat, timestampFormat2} from "@/js/time";
import {div18, toFixed} from "@/js/utils";
import BigNumber from "bignumber.js";
import {useStakingStore} from "@/stores/staking";

// 表头配置项
const {t, locale} = useI18n()
const store = useStakingStore();

const getHeaders = () => [
  {key: 'index', label: t('index'), flex: 1},
  {key: 'date', label: t('date'), flex: 2},
  {key: 'principal', label: t('principal'), flex: 1},
  {key: 'profit', label: t('profit'), flex: 1},
  {key: 'action', label: t('action'), flex: 2}
];
const headers = ref(getHeaders());
watch(locale, () => {
  headers.value = getHeaders();
});

const props = defineProps({
  status: {
    type: Number,
    default: 0
  },
  listType: {
    type: Number,
    default: 0
  }
});

const list = ref([]);
const loading = ref(false);
const finished = ref(true);

const onLoad = () => {
};

const handleRedeem = (item) => {
  if (item.buttonKey !== 'finished') return;

  item.loading = true;
};

onMounted(async () => {
  await getList();
});

async function getList() {
  let records = await getUserRecords(0, 100, props.status, props.listType);
  records.forEach((item) => {
    // 盈利数据
    item.profit = getProfit(item);
    item.buttonKey = getButtonKey(item);
    item.loading = false;
  })
  console.log(records);
  list.value = records;
}

function getProfit(item) {
  // 购买赎回没有利息
  if (props.listType === 1) return 0;

  let time = !item.status ? nowTimestamp() : item.unStakeTime;
  time = new BigNumber(time);

  let maxTime = new BigNumber(item.stakeTime).plus(86400 * 30);
  if (time.gt(maxTime)) time = maxTime;

  let rate = [0.003, 0.006, 0.012][item.stakeIndex];
  return time.minus(item.stakeTime)
    .multipliedBy(item.amount)
    .dividedBy(1e18)
    .dividedBy(86400)
    .multipliedBy(rate)
    .toFixed(4);
}

function getButtonKey(item) {
  if (item.status) return 'redeemed';

  let endTime;
  if (props.listType === 1) {
    endTime = new BigNumber(item.stakeTme).plus(86400);
  } else {
    endTime = new BigNumber(item.stakeTme).plus(store.stakeDays[item.stakeIndex]);
  }
  if (endTime.gt(nowTimestamp())) return 'finished';
  else return 'pending'
}

</script>

<template>
  <div class="table-header">
      <span v-for="header in headers" :key="header.key" class="header-cell" :style="{ flex: header.flex || 1 }">
        {{ header.label }}
      </span>
  </div>
  <div class="table-content">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      :finished-text="list.length === 0? '没有更多了':''"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        center
      >
        <template #title>
          <div class="table-row">
        <span v-for="header in headers" :key="header.key" class="cell-item" :style="{ flex: header.flex || 1 }">
          <!-- 动态渲染对应字段 -->
          <template v-if="header.key === 'index'">
            {{ item.id }}
          </template>
          <template v-else-if="header.key === 'date'">
<!--            <div class="datetime-container">-->
            <!--              <div>{{ timestampFormat(item.stakeTime) }}</div>-->
            <!--              <div>1111</div>-->
            <!--            </div>-->
            {{ timestampFormat(item.stakeTime) }}
          </template>
          <template v-else-if="header.key === 'principal'">
            {{ div18(item.amount, 2) }}
          </template>
          <template v-else-if="header.key === 'profit'">
            {{ item.profit }}
          </template>
          <template v-else-if="header.key === 'action'">
            <van-button
              size="small"
              type="primary"
              :color="item.status ? '#1087A1' : '#05DAEB'"
              :style="{ color: item.status ? '#015059' : '' }"
              @click="handleRedeem(item)"
            >
              <template v-if="item.loading">
                <van-loading size="20" color="#1989fa"/>
              </template>
              <template v-else>{{ $t(item.buttonKey) }}</template>
            </van-button>
          </template>
        </span>
          </div>
        </template>

      </van-cell>
    </van-list>
  </div>
</template>
<style scoped lang="scss">
@use "@/components/List/List";
</style>
