import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  "/basis/",
  "/interview/",
  {
    text: "专题◾武研堂",
    icon: "book",
    children: [
      { text: "客户端脚本安全", link: "/special/security/" },
      { text: "数据结构与算法", link: "/special/algorithm/" },
    ],
  },
  "/private/",
]);
