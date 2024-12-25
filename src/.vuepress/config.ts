import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/camps/",
  lang: "zh-CN",
  title: "杜同学日记",
  description: "路漫漫其修远兮，吾将上下而求索",
  theme,
  // Enable it with pwa
  shouldPrefetch: false,
});
