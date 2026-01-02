<script setup>
import {inject, onMounted, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import {getUserRecords, redeemUnStake} from "@/js/contracts/staking";
import {countdownTime, nowTimestamp, timestampFormat} from "@/js/time";
import {div18} from "@/js/utils";
import BigNumber from "bignumber.js";
import {useStakingStore} from "@/stores/staking";

// 表头配置项
const {t, locale} = useI18n()
const store = useStakingStore();
const showError = inject("showError");
const showSuccess = inject("showSuccess");

const getHeaders = () => [
  {key: 'index', label: t('index'), flex: 1},
  {key: 'date', label: t('date'), flex: 2},
  {key: 'principal', label: 'AVA', flex: 1},
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

const doRedeemUnStake = async (item) => {
  if (item.buttonKey !== 'finished') return;
  if (item.loading) return
  item.loading = true;

  try {
    await redeemUnStake(item.id);
    item.loading = false;
    showSuccess(t('success'));

    // 刷新
    await Promise.all([
      store.setState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
      getList()
    ]);
  } catch (e) {
    console.log(e)
    showError(t('failed'));
    item.loading = false;
  }
};

function updateList() {
  let records = list.value;
  records.forEach((item) => {
    // 盈利数据
    item.buttonKey = getButtonKey(item);
  })
  list.value = records;
}

const it = ref(0);
const getList = async () => {
  if (it.value > 0) clearInterval(it.value);

  let records = await getUserRecords(0, 100, props.status, 1);
  records.forEach((item) => {
    // 盈利数据
    item.buttonKey = getButtonKey(item);
    item.end = new BigNumber(item.stakeTime).plus(store.unStakeDay);
    item.loading = false
  })
  console.log(records);
  list.value = records;

  it.value = setInterval(() => {
    updateList()
  }, 5000);
}

function getButtonKey(item) {
  if (item.status) return 'redeemed';

  let endTime = new BigNumber(item.stakeTime).plus(store.unStakeDay);
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
      :finished-text="list.length === 0? $t('noMore'):''"
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
<!--            {{ timestampFormat(item.stakeTime) }}-->
            <div class="datetime-container">
              <div>{{ timestampFormat(item.stakeTime) }}</div>
              <div>
                <van-count-down style="color:rgb(5, 218, 235);font-size: 13px;" :time="countdownTime(item.end)" format="DD天 HH:mm:ss"/>
              </div>
            </div>
          </template>
          <template v-else-if="header.key === 'principal'">
            {{ div18(item.amount, 2) }}
          </template>
          <template v-else-if="header.key === 'action'">
            <van-button
              size="small"
              type="primary"
              :color="item.status ? '#1087A1' : '#05DAEB'"
              :style="{ color: item.status ? '#015059' : '' }"
              @click="doRedeemUnStake(item)"
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
