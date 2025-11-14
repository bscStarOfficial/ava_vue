<script setup>
import {inject, ref} from "vue";
import List from '@/components/List/List.vue';
import Modal from '@/components/Modal/Modal.vue';
import Alert from '@/components/Alert/Alert.vue';
import NumberFlow from '@number-flow/vue'

const active = ref('投资列表')

// 投资列表数据
const investmentData = ref([
  { id: 1, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '赎回' },
  { id: 2, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '赎回' },
  { id: 3, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '赎回' },
  { id: 4, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '赎回' },
  { id: 5, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '赎回' },
  { id: 6, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '赎回' }
]);

// 赎回列表数据
const redeemList = ref([
  { id: 1, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '已结束' },
  { id: 2, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '已结束' },
  { id: 3, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '已结束' },
  { id: 4, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '已结束' },
  { id: 5, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '已结束' },
  { id: 6, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '已结束' },
  { id: 7, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '已结束' },
]);

const inviteModalShow = ref(false);

const handleInviteConfirm = (data) => {
  console.log('确认邀请人:', data.inputValue);
  handleErrorClick()
};

// 新增的数据和方法
const addAssetModalShow = ref(false);
const selectedDays = ref('');


const handleAddAsset = (data) => {
  console.log('增加资产金额:', data.inputValue);
  console.log('选择的投资期限:', selectedDays.value);
  handleSuccessClick()
};

// 语言切换
const i18n = useI18n()
const languageOptions =  [
  { text: 'English', value: 'en' },
  { text: '简体中文', value: 'zh' },
  { text: '日本語', value: 'ja' },
  { text: '한국어', value: 'ko' },
  { text: 'РОССИЯ', value: 'ru' }
]
const showLanguage = ref(false);
const currentLanguage = ref('简体中文')
const onSelectLanguage = (action) => {
  console.log('选择了语言', action);
  i18n.locale.value = action.value;
};

// 显示警告框
import errorIcon from '@/assets/svg/error.svg'
import successIcon from '@/assets/svg/success.svg'
import {useI18n} from "vue-i18n";

const setAlertMsg = inject("setAlertMsg")

function showError(content, callback) {
  setAlertMsg({
    title: 'error',
    content: content,
    icon: errorIcon,
    show: true,
    callback: callback || (() => {})
  })
}

function showSuccess(content, callback) {
  setAlertMsg({
    title: 'success',
    content: content,
    icon: successIcon,
    show: true,
    callback: callback || (() => {})
  })
}

// 使用
function handleErrorClick() {
  showError('操作失败', () => {
    console.log('用户点击了错误按钮')
  })
}

function handleSuccessClick() {
  showSuccess('操作成功', () => {
    console.log('用户点击了成功按钮')
  })
}

// 将原来的常量定义改为响应式引用
const assetValue = ref(1.2524243)

setInterval(() => {
  // 生成 1.xxxxxxxx 格式的数值（1后面跟9位小数）
  const randomDecimal = Math.floor(Math.random() * 1000000000);
  assetValue.value = 1 + randomDecimal / 1000000000;
}, 5000);


</script>
<template>
  <div class="content">
    <div class="top">
      <img src="@/assets/svg/logo.svg" alt="" class="logoImg">
      <div class="topRight">
        <van-popover
          v-model:show="showLanguage"
          :actions="languageOptions"
          @select="onSelectLanguage"
          :show-arrow="false"
          :close-on-click-action="false"
          placement="bottom-start"
          class="custom-language-popover"
        >
          <template #reference>
            <img src="@/assets/svg/earth.svg" alt="" class="earthImg">
          </template>
        </van-popover>
        <div class="token" @click="inviteModalShow = true">0x49b2****85f2</div>
      </div>
    </div>
    <!--我的当前资产-->
    <div class="asset">
      <div class="asset-top">
        <img src="@/assets/svg/vector_left.svg" alt="" style="width: 104px; height: 17px;">
        <div class="asset-title" @click="addAssetModalShow = true">{{ $t('asset') }}</div>
        <img src="@/assets/svg/vector_right.svg" alt="" style="width: 104px; height: 17px;">
      </div>
      <div class="asset-token">
        <NumberFlow :value="assetValue" :format="{  maximumFractionDigits: 20}"  />
        <span>Token</span>
      </div>
      <div class="asset-btn" @updateAsset="updateAsset(2424244)">
        <img src="@/assets/imgs/add.png" alt="" style="width: 16px; height: 16px;">
        {{ $t('title') }}
      </div>
      <div class="asset-info">
        <div class="row">
          <div class="row-label">{{ $t('performance') }}</div>
          <div class="row-value">0 Token</div>
        </div>
        <div class="row">
          <div class="row-label">{{ $t('link') }}</div>
          <div class="row-value">
            0x49b2****85F2
            <img src="@/assets/svg/copy.svg" alt="" style="width: 16px; height: 16px;">
          </div>
        </div>
      </div>
    </div>
    <!-- I LAF做市商投资规则-->
    <div class="rule">
      <div class="rule-left">
        <div class="left-title">{{ $t('rule') }}</div>
        <div class="left-tip">{{ $t('tip') }}</div>
      </div>
      <img src="@/assets/svg/icon_01.svg" alt="" style="width: 122px; height: 87px;">
    </div>
    <div class="list">
      <van-tabs v-model:active="active"
                animated color="#0E9AB2"
                background="transparent"
                line-width="32px"
                line-height="4px"
                title-inactive-color="#fff"
                title-active-color="#03EDFF"
      >
        <van-tab :title="$t('tab1')">
          <List :data="investmentData" class="tab-content" />
        </van-tab>
        <van-tab :title="$t('tab2')">
          <List :data="redeemList" class="tab-content" />
        </van-tab>
      </van-tabs>
    </div>
    <Modal
      v-model:show="inviteModalShow"
      :title="$t('confirmInviter')"
      :show-input="true"
      :input-placeholder="$t('address')"
      :max-amount="null"
      :show-dropdown="false"
      @confirm="handleInviteConfirm"
    />
    <Modal
      v-model:show="addAssetModalShow"
      :title="$t('addAsset')"
      :show-input="true"
      :input-placeholder="$t('inputIncreaseAmount')"
      :max-amount="1000"
      :show-dropdown="true"
      :dropdown-options="[{ text: $t('option1') }, { text: $t('option1') }, { text: $t('option1') },]"
      :selected-option="selectedDays"
      @confirm="handleAddAsset"
      @dropdown-change="selectedDays = $event"
    />
    <Alert />

  </div>
</template>
<style scoped lang="scss">
@use "@/views/asset/index";
</style>
