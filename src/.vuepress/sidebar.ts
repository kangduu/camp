import { sidebar } from "vuepress-theme-hope";

const js = [
  "/js/",
  "/js/web-worker.md",
  "/js/precompile.md",
  "/js/async.md",
  "/js/currying.md",
  "/js/memory.leak.md",
  "/js/deep.clone.md",
  "/js/prototype.md",
  "/js/debounce.throttle.md",
  "/js/running.md",
  "/js/event.loop.md",
  "/js/module.md",
  "/js/call.apply.bind.md",
  "/js/new.md",
  "/js/this.md",
  "/js/oop.md",
  "/js/parseInt.parseFloat.md",
  "/js/reg-exp.md",
  "/js/es6.md",
  "/js/deweight.array.md",
  "/js/questions.md",
];

const ts = ["/ts/cmd.md", "/ts/infer.md", "/ts/satisfies-as.md"];

const performance = [
  "/performance/开篇.md",
  "/performance/webpack性能调优与Gzip原理.md",
  "/performance/图片优化之质量与性能的博弈.md",
  "/performance/览器缓存机制介绍与缓存策略剖析.md",
  "/performance/从Cookie到WebStorage、IndexDB.md",
  "/performance/服务端渲染的探索与实践.md",
  "/performance/解锁浏览器背后的运行机制.md",
  "/performance/DOM优化原理与基本实践.md",
  "/performance/EventLoop与异步更新策略.md",
  "/performance/回流（Reflow）与重绘（Repaint）.md",
  "/performance/优化首屏体验Lazy-Load初探.md",
  "/performance/事件的节流（throttle）与防抖（debounce）.md",
  "/performance/Performance、LightHouse与性能API.md",
  "/performance/CDN的缓存与回源机制解析.md",
];

const webpack = ["/webpack/asset.management.md", "/webpack/output.management.md", "/webpack/development.md", "/webpack/code.splitting.md", "/webpack/hmr.md", "/webpack/tree.shaking.md"];

const nodejs = ["/node/jwt.md", "/node/json.md"];

const git = ["/git/git-reset.md"];

export default sidebar({
  "/js/": js,
  "/ts/": ts,
  "/node/": nodejs,
  "/performance": performance,
  "/webpack/": webpack,
  "/git/": git,
});
