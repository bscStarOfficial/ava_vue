<!-- src/components/PopupModal.vue -->
<script setup>
import {ref, computed, watch} from 'vue';
import {useStakingStore} from "@/stores/staking";

const store = useStakingStore();
import {useI18n} from "vue-i18n";
const {t} = useI18n();

const props = defineProps({
  // 是否显示弹窗
  show: {
    type: Boolean,
    default: false
  },
});

const emit = defineEmits(['cancel', 'confirm']);

// 输入框值
const uAmount = ref('');
const stakeIndex = ref(-1);
const showPopover = ref(false);
const showDropdown = ref(true);

const options = [
  {text: t('option1')},
  {text: t('option2')},
  {text: t('option3')}
];

// 点击遮罩或取消按钮关闭弹窗
const onCancel = () => {
  emit('cancel');
};

// 点击确定按钮
const onConfirm = () => {
  emit('confirm', {
    uAmount: uAmount.value,
    stakeIndex: stakeIndex.value
  });
  onCancel();
};

// 输入框变化
const onInputChange = (e) => {
  emit('input-change', e);
};

// 下拉选择变化
const onSelect = (action) => {
  console.log('onSelect', action);
  options.forEach((option, index) => {
    if (option.text === action.text) {
      stakeIndex.value = index;
    }
  })
};

</script>

<template>
  <div v-if="props.show" class="popup-overlay" @click.self="onCancel">
    <div class="popup-content">
      <!-- 标题 -->
      <div class="popup-title">{{ $t('addAsset') }}</div>

      <!-- 输入框 -->
      <van-field
        v-model="uAmount"
        :placeholder="$t('inputIncreaseAmount')"
        class="popup-input"
        :style="{marginBottom: '20px'}"
      />
      <div v-if="showDropdown" class="tip">
        <div class="tipMax">最大{{ store.maxStakeAmount }}</div>
        <van-popover
          v-model:show="showPopover"
          :actions="options"
          @select="onSelect"
        >
          <template #reference>
            <div v-if="stakeIndex > -1" class="drop-selected">
              {{ options[stakeIndex].text }}
              <img src="@/assets/svg/arrow_down.svg" alt="" class="arrow">
            </div>
            <div v-else class="drop-label">
              {{ $t('selectDays') }}
              <img src="@/assets/svg/arrow_down.svg" alt="" class="arrow">
            </div>
          </template>
        </van-popover>
      </div>

      <!-- 按钮组 -->
      <div class="button-group">
        <button class="btn-cancel" @click="onCancel">{{ $t('cancel') }}</button>
        <button class="btn-confirm" @click="onConfirm">{{ $t('confirm') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  box-sizing: border-box;
  background: #1D1F40;
  box-shadow: 0 4px 8px 1px #117F99 inset;
  border-radius: 16px;
  padding: 20px 22px;
  width: 279px;
  max-width: 360px;
  text-align: center;
}

.popup-title {
  height: 25px;
  line-height: 25px;
  font-size: 18px;
  color: #fff;
  //font-family: 'PingFang';
  font-weight: 600;
  margin-bottom: 24px;
}

.popup-input {
  flex: 1;
  height: 42px;
  padding: 0 19px;
  border-radius: 6px;
  background: #1A3C5A;
  outline: none;

  :deep(.van-field__body) {
    height: 100%;

    .van-field__control {
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      //font-family: 'PingFang';
    }
  }
}

:deep(.van-cell:after) {
  display: none;
}

.tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .tipMax {
    font-size: 14px;
    color: #fff;
    //font-family: 'PingFang';
    font-weight: 500;
  }

  .drop-selected {
    font-size: 14px;
    color: #025AD1;
    //font-family: 'PingFang';
    font-weight: 500;

    .arrow {
      width: 14px;
      height: 8px;
    }
  }

  .drop-label {
    font-size: 14px;
    color: #A5A5B3;
    //font-family: 'PingFang';
    font-weight: 500;

    .arrow {
      width: 14px;
      height: 8px;
    }
  }
}

.dropdown-group {
  margin-bottom: 16px;
}

.dropdown-label {
  font-size: 14px;
  color: #ccc;
  margin-bottom: 8px;
}

.dropdown-select {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
}

.arrow-down {
  width: 12px;
  height: 12px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.dropdown-item {
  padding: 10px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #3a3a3a;
  }
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel,
.btn-confirm {
  width: 112px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #fff;
  //font-family: 'PingFang';
  font-weight: 500;
}

.btn-cancel {
  background: #1A3C5A;
}

.btn-confirm {
  background: #04EBFF;
}
</style>
