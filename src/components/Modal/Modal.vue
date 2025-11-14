<!-- src/components/PopupModal.vue -->
<script setup>
import {ref, computed, watch} from 'vue';

const props = defineProps({
  // 弹窗标题
  title: {
    type: String,
    default: ''
  },
  // 是否显示弹窗
  show: {
    type: Boolean,
    default: false
  },
  // 是否显示输入框
  showInput: {
    type: Boolean,
    default: false
  },
  // 输入框提示文字
  inputPlaceholder: {
    type: String,
    default: '请输入内容'
  },
  // 是否显示下拉选择
  showDropdown: {
    type: Boolean,
    default: false
  },
  // 下拉选项列表
  dropdownOptions: {
    type: Array,
    default: () => []
  },
  // 当前选中的下拉项
  selectedOption: {
    type: String,
    default: ''
  },
  // 最大值限制（用于金额）
  maxAmount: {
    type: Number,
    default: null
  },
  // 输入框的值
  inputValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits([
  'update:show',
  'confirm',
  'input-change',
  'dropdown-change'
]);

// 控制弹窗是否显示
const localShow = ref(props.show);

// 输入框值
const inputVal = ref(props.inputValue);

// 下拉选择值
const showPopover = ref(false);
const selected = ref(props.selectedOption);

// 监听父组件传入的 show 变化
watch(() => props.show, (val) => {
  localShow.value = val;
});

// 点击遮罩或取消按钮关闭弹窗
const onCancel = () => {
  localShow.value = false;
  emit('update:show', false);
};

// 点击确定按钮
const onConfirm = () => {
  if (props.showInput && !inputVal.value.trim()) {
    return; // 防止空输入提交
  }
  emit('confirm', {
    inputValue: inputVal.value,
    selectedOption: selected.value
  });
  onCancel();
};

// 输入框变化
const onInputChange = (e) => {
  emit('input-change', e);
};

// 下拉选择变化
const onSelect = (action) => {
  selected.value = action.text;
  emit('dropdown-change', action.text);
};

// 计算最大值提示
const maxText = computed(() => {
  if (!props.maxAmount) return '';
  return `最大：${props.maxAmount}`;
});

</script>

<template>
  <div v-if="localShow" class="popup-overlay" @click.self="onCancel">
    <div class="popup-content">
      <!-- 标题 -->
      <div class="popup-title">{{ title }}</div>

      <!-- 输入框 -->
      <van-field
        v-if="showInput"
        v-model="inputVal"
        :placeholder="inputPlaceholder"
        class="popup-input"
        :style="{marginBottom: maxAmount ? '20px' : '14px'}"
        @update:model-value="onInputChange"
      />
      <div v-if="showDropdown" class="tip">
        <div class="tipMax">{{ maxText }}</div>
        <van-popover
          v-model:show="showPopover"
          :actions="dropdownOptions"
          @select="onSelect"
        >
          <template #reference>
            <div v-if="selected" class="drop-selected">
              {{selected}}
              <img src="@/assets/svg/arrow_down.svg" alt="" class="arrow">
            </div>
            <div v-else class="drop-label">
              {{$t('selectDays')}}
              <img src="@/assets/svg/arrow_down.svg" alt="" class="arrow">
            </div>
          </template>
        </van-popover>
      </div>

      <!-- 按钮组 -->
      <div class="button-group">
        <button class="btn-cancel" @click="onCancel">{{$t('cancel')}}</button>
        <button class="btn-confirm" @click="onConfirm">{{$t('confirm')}}</button>
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
