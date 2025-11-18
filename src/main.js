import { createApp } from 'vue'
import { createPinia } from 'pinia'
import QrReader from 'vue3-qr-reader';
import App from './App.vue'
import router from './router'
// vant 按需引用
import vant from './ui/vant'
//适配
import "amfe-flexible";
import i18n from './locals/index.js'

const app = createApp(App)

app.use(createPinia())
app.use(QrReader);
app.use(router)
app.use(vant);
app.use(i18n);

app.mount('#app')
