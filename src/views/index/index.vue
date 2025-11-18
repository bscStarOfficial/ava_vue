<script setup>
import {inject, onMounted, ref} from "vue";
import List from '@/components/List/List.vue';
import InviteModal from '@/components/Modal/InviteModal.vue';
import StakeModal from '@/components/Modal/StakeModal.vue';
import Alert from '@/components/Alert/Alert.vue';
import NumberFlow from '@number-flow/vue'
// 显示警告框
import errorIcon from '@/assets/svg/error.svg'
import successIcon from '@/assets/svg/success.svg'
import {useI18n} from "vue-i18n";
import {useStakingStore} from "@/stores/staking";
import {replaceMiddleWithAsterisks} from "@/js/utils";
import {getSelectedAddress} from "@/js/web3";
import {copyText} from 'vue3-clipboard'
import {getHost} from "@/js/url";

const active = ref('投资列表')
const store = useStakingStore();

// 投资列表数据
const investmentData = ref([
  {id: 1, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '赎回'},
]);

// 赎回列表数据
const redeemList = ref([
  {id: 1, date: '25.11.08 10:38', time: '01:42', principal: 1, profit: '1.0033', btnName: '已结束'},
]);

const inviteModalShow = ref(false);
const stakingModalShow = ref(false);

// 语言切换
const i18n = useI18n()
let languageOptions = [
  {text: 'English', value: 'en', disabled: i18n.locale.value === 'en'},
  {text: '简体中文', value: 'zh', disabled: i18n.locale.value === 'zh'},
  {text: '日本語', value: 'ja', disabled: i18n.locale.value === 'ja'},
  {text: '한국어', value: 'ko', disabled: i18n.locale.value === 'ko'},
  {text: 'РОССИЯ', value: 'ru', disabled: i18n.locale.value === 'ru'}
]
const showLanguage = ref(false);
const onSelectLanguage = (action) => {
  console.log('选择了语言', action);
  localStorage.setItem('lang', action.value);
  i18n.locale.value = action.value;

  languageOptions.forEach((item) => {
    item.disabled = i18n.locale.value === item.value;
  })

  showLanguage.value = !showLanguage.value;
};
const setAlertMsg = inject("setAlertMsg")

// 推荐人
const referrer = ref();

// 复制推荐人链接
async function copyLink() {
  let text = getHost();
  text += '?ref=' + getSelectedAddress();
  copyText(text, undefined, (error, event) => {
    if (error) {
      console.log(error)
      showError('复制失败')
    } else {
      showSuccess('复制成功')
    }
  })
}

onMounted(async () => {
  await init();
})

async function init() {
  let res = await Promise.all([
    store.setState([0, 1, 2, 3, 4, 5, 6, 7, 8]),
  ]);
}

function showError(content, callback) {
  setAlertMsg({
    title: 'error',
    content: content,
    icon: errorIcon,
    show: true,
    callback: callback || (() => {
    })
  })
}

function showSuccess(content, callback) {
  setAlertMsg({
    title: 'success',
    content: content,
    icon: successIcon,
    show: true,
    callback: callback || (() => {
    })
  })
}

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
        <div class="token">{{ replaceMiddleWithAsterisks(getSelectedAddress()) }}</div>
      </div>
    </div>
    <!--我的当前资产-->
    <div class="asset">
      <div class="asset-top">
        <img src="@/assets/svg/vector_left.svg" alt="" style="width: 104px; height: 17px;">
        <div class="asset-title">{{ $t('asset') }}</div>
        <img src="@/assets/svg/vector_right.svg" alt="" style="width: 104px; height: 17px;">
      </div>
      <div class="asset-token">
        <NumberFlow :value="store.balance" :format="{maximumFractionDigits: 20}"/>
        <span>Token</span>
      </div>
      <div class="asset-btn" @click="inviteModalShow = true">
        <img src="@/assets/imgs/add.png" alt="" style="width: 16px; height: 16px;">
        {{ $t('title') }}
      </div>
      <div class="asset-info">
        <div class="row">
          <div class="row-label">{{ $t('performance') }}</div>
          <div class="row-value">{{ store.teamKpi }} Token</div>
        </div>
        <div class="row">
          <div class="row-label">{{ $t('link') }}</div>
          <div class="row-value" v-if="!store.registered">--&nbsp;</div>
          <div class="row-value" v-else @click="copyLink()">
            {{ replaceMiddleWithAsterisks(getSelectedAddress()) }}
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
          <List :data="investmentData"/>
        </van-tab>
        <van-tab :title="$t('tab2')">
          <List :data="redeemList"/>
        </van-tab>
      </van-tabs>
    </div>
    <InviteModal
      v-model:show="inviteModalShow"
      :input-value="referrer"
      @confirm="v => {
        referrer = v.referrer;
        stakingModalShow = true;
      }"
      @cancel="() => {
        inviteModalShow = false
      }"
    />
    <StakeModal
      v-model:show="stakingModalShow"
      @confirm="(v) => {
        console.log('StakeModal', v);
      }"
      @cancel="() => {
        stakingModalShow = false;
      }"
    />
    <Alert/>

  </div>
</template>
<style scoped lang="scss">
@use "@/views/index/index";
</style>
