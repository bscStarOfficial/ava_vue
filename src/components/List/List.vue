<script setup>
import { ref, watch } from 'vue';

// 表头配置项
const headers = [
  { key: 'index', label: '序号', flex: 1 },
  { key: 'date', label: '日期', flex: 3 },
  { key: 'principal', label: '本金', flex: 1 },
  { key: 'profit', label: '盈利', flex: 1 },
  { key: 'action', label: '赎回进展', flex: 2 }
];

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});

// 创建响应式副本，避免直接修改 props
const localData = ref([...props.data]);

const loading = ref(false);
const finished = ref(false);

// 监听 props.data 变化，同步到 localData
watch(() => props.data, (newVal) => {
  localData.value = [...newVal];
});

const onLoad = () => {
  setTimeout(() => {
    for (let i = 0; i < 10; i++) {
      localData.value.push({
        id: localData.value.length + 1,
        date: '25.11.08 10:38\n01:42',
        principal: 1,
        profit: '1.0033'
      });
    }
    loading.value = false;
    if (localData.value.length >= 40) {
      finished.value = true;
    }
  }, 1000);
};

const handleRedeem = (id) => {
  console.log('赎回操作:', id);
};
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
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in localData"
        :key="index"
        center
      >
        <template #title>
          <div class="table-row">
        <span v-for="header in headers" :key="header.key" class="cell-item" :style="{ flex: header.flex || 1 }">
          <!-- 动态渲染对应字段 -->
          <template v-if="header.key === 'index'">
            {{ index + 1 }}
          </template>
          <template v-else-if="header.key === 'date'">
            <div class="datetime-container">
              <div>{{ item.date }}</div>
              <div>{{ item.time }}</div>
            </div>
          </template>
          <template v-else-if="header.key === 'principal'">
            {{ item.principal }}
          </template>
          <template v-else-if="header.key === 'profit'">
            {{ item.profit }}
          </template>
          <template v-else-if="header.key === 'action'">
            <van-button size="small" type="primary" color="#05DAEB" @click="handleRedeem(item.id)">{{item.btnName}}</van-button>
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
