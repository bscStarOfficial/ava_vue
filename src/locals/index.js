import { createI18n } from 'vue-i18n'
import zh from '@/locals/zh';
import en from '@/locals/en';
import ja from '@/locals/ja';
import ru from "@/locals/ru";
import ko from "@/locals/ko";

const messages = {
  zh,
  en,
  ja,
  ru,
  ko
}
const language = (navigator.language || 'zh').toLocaleLowerCase() // 这是获取浏览器的语言
const i18n = createI18n({
  locale: localStorage.getItem('lang') || language.split('-')[0] || 'zh', // 首先从缓存里拿，没有的话就用浏览器语言，
  // locale: "en",
  fallbackLocale: 'zh', // 设置备用语言
  messages,
  legacy: false
})

export default i18n
