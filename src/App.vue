<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {provide, reactive, ref} from "vue";
import Alert from '@/components/Alert/Alert.vue';
import errorIcon from "@/assets/svg/error.svg";
import successIcon from "@/assets/svg/success.svg";
// 弹框信息
let alertMsg = reactive({
  show: false, title: '', content: '', callback: () => {}
});
provide("alertMsg", alertMsg);

const setAlertMsg = ({show, title, icon, content, callback}) => {
  alertMsg.show = show;
  alertMsg.title = title;
  alertMsg.icon = icon
  alertMsg.content = content;
  if (callback) {
    alertMsg.callback = callback;
  }
  setTimeout(() => {
    alertMsg.show = false;
  }, 2000)
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

provide("setAlertMsg", setAlertMsg);
provide("showSuccess", showSuccess);
provide("showError", showError);

</script>

<template>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
