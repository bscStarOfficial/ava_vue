<script setup>
import {inject, onMounted, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import {getUserRecords, unStake} from "@/js/contracts/staking";
import {nowTimestamp, timestampFormat, timestampFormat2} from "@/js/time";
import {div18, toFixed} from "@/js/utils";
import BigNumber from "bignumber.js";
import {useStakingStore} from "@/stores/staking";
import {getAddress} from "@/js/config";
import {approve} from "@/js/contracts/erc20s";

// 表头配置项
const {t, locale} = useI18n()
const store = useStakingStore();
const showError = inject("showError");
const showSuccess = inject("showSuccess");

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
});

const list = ref([]);
const finished = ref(true);

onMounted(async () => {
  await getList();
});

const doUnStake = async (item) => {
  if (item.buttonKey !== 'finished') return;
  if (item.loading) return
  item.loading = true;

  try {
    if (
      new BigNumber(item.profit).multipliedBy(1.1).gt(store.usdt.allowance) &&
      store.isBuyUnStake
    ) {
      let stakingAddr = await getAddress('staking');
      await approve('usdt', stakingAddr, '1000000000000000000000000');
    }

    await unStake(item.id);
    item.loading = false;
    showSuccess('操作成功');

    // 刷新
    await Promise.all([
      store.setState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
      getList()
    ]);
  } catch (e) {
    console.log(e)
    showError('操作失败');
    item.loading = false;
  }
};

function updateList() {
  let records = list.value;
  records.forEach((item) => {
    // 盈利数据
    item.profit = getProfit(item);
    item.buttonKey = getButtonKey(item);
  })
  list.value = records;
}

const it = ref(0);
const getList = async () => {
  if (it.value > 0) clearInterval(it.value);

  let records = await getUserRecords(0, 100, props.status, 0);
  records.forEach((item) => {
    // 盈利数据
    item.profit = getProfit(item);
    item.buttonKey = getButtonKey(item);
    item.loading = false
  })
  console.log(records);
  list.value = records;

  it.value = setInterval(() => {
    updateList()
  }, 5000);
}

function getProfit(item) {
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

  let endTime = new BigNumber(item.stakeTime).plus(store.stakeDays[item.stakeIndex]);
  if (endTime.lt(nowTimestamp())) return 'finished';
  else return 'pending'
}


defineExpose({
  getList,
});

</script>

<template>
  <div class="table-header">
      <span v-for="header in headers" :key="header.key" class="header-cell" :style="{ flex: header.flex || 1 }">
        {{ header.label }}
      </span>
  </div>
  <div class="table-content">
    <van-list
      :finished="finished"
      :finished-text="list.length === 0? '没有更多了':''"
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
              @click="doUnStake(item)"
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
