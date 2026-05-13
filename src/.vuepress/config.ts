import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/camp/",
  lang: "zh-CN",
  title: "杜同学日记",
  description: "路漫漫其修远兮，吾将上下而求索",
  bundler: viteBundler({
    viteOptions: {
      resolve: {
        // cytoscape 子路径仅在 exports 中声明了 require，Vite 走 import 条件时会失败（pnpm 下常见）
        alias: {
          "cytoscape/dist/cytoscape.umd.js": "cytoscape/dist/cytoscape.esm.mjs",
        },
      },
    },
  }),
  theme,
  // Enable it with pwa
  shouldPrefetch: false,
});
