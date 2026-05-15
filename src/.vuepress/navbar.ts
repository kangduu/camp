import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "AI Engineer",
    icon: "creative",
    children: [
      { text: "总览", link: "/ai/" },
      { text: "编程工作流", link: "/ai/coding-workflow.md" },
      { text: "提示词模式", link: "/ai/prompt-patterns.md" },
      { text: "Cursor", link: "/ai/cursor.md" },
    ],
  },
  {
    text: "前端基础",
    icon: "code",
    children: [
      { text: "JavaScript", link: "/js/" },
      { text: "TypeScript", link: "/ts/" },
    ],
  },
  {
    text: "工程化",
    icon: "config",
    children: [
      { text: "Webpack", link: "/webpack/" },
      { text: "Git", link: "/git/" },
      { text: "Node.js", link: "/node/" },
    ],
  },
  {
    text: "性能优化",
    icon: "activity",
    link: "/performance/",
  },
  "/interview/",
]);
