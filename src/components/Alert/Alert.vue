<script setup>
import { inject, reactive} from 'vue'

let alertMsg = inject("alertMsg", {
  title: '',
  content: '',
  icon: '',
  show: false,
  callback: () => {}
});
let setAlertMsg = inject("setAlertMsg", p => {});

function cancel() {
  setAlertMsg({title: '', content: '', icon: '', show: false});
  alertMsg.callback()
}

</script>
<template>
  <van-dialog v-model:show="alertMsg.show" width="291px" :showConfirmButton="false" :overlay="false" closeOnClickOverlay class="dialog-content">
    <div class="dialog">
      <img src="@/assets/svg/close.svg" alt="" class="close-img" @click="cancel()">
      <img :src="alertMsg.icon" alt="" class="state-img">
      <div class="info-content">
        <div class="dialog-label">{{ alertMsg.title }}</div>
        <div class="dialog-info">{{ alertMsg.content }}</div>
      </div>
    </div>
  </van-dialog>
</template>

<style src="@/components/Alert/Alert.scss" scoped></style>
<style lang="scss">
.dialog-content {
  top: 19px !important;
  left: auto !important;
  right: 15px !important;
  margin: 0 !important;
  transform: translateY(0%) !important;
}
</style>
