# 可优化方向

以下基于当前仓库配置（VuePress 2、`vuepress-theme-hope`、GitHub Actions 等）整理的改进建议。

## 1. 依赖与版本

- 当前使用 **VuePress 2 / vuepress-theme-hope 的 beta** 版本，后续可关注稳定版发布与迁移说明，降低长期维护成本。

## 2. 包管理器与工作流一致

- ✅ 已统一为 **pnpm**：仓库根目录提交 `pnpm-lock.yaml`，`package.json` 含 `packageManager` 字段；CI 使用 `pnpm/action-setup`、`pnpm install --frozen-lockfile` 与 `pnpm run docs:build`。
- 本地开发与 CI 请均使用 **pnpm**，避免混用 Yarn / npm 导致依赖树不一致。

## 3. GitHub Actions：清理 `deno.yml`

- `.github/workflows/deno.yml` 内容与当前项目不匹配（分支、`docs/.vuepress/dist`、`npm run build`、远端仓库等更像是其他项目的拷贝）。
- 建议**删除、禁用或改写**为与本仓库 `main` 分支、`pnpm run docs:build`、`src/.vuepress/dist` 一致，避免误导或误触发。

## 4. 构建体积与内存

- `theme.ts` 中 **mdEnhance** 功能开启较全，会增大依赖与构建开销；CI 中已通过 `NODE_OPTIONS=--max_old_space_size=8192` 提高内存上限。
- 可按实际用到的能力**关闭不用的扩展**（例如长期不用的 echarts、presentation、vuePlayground 等），缩短构建时间并减小产物体积。

## 5. 站点元信息（hostname）

- `theme.ts` 中 `hostname` 若为模板默认值（如主题作者演示站），与实际部署域名不一致时，可能影响 SEO、canonical、分享链接等。
- 建议改为**实际站点根 URL**（若部署在子路径 `/camp/`，以 vuepress-theme-hope 文档为准配置）。

## 6. 加密页面密码

- `encrypt.config` 若以**明文口令**写在配置里且仓库公开，目录加密仅能对「不知情用户」起效。
- 更稳妥可考虑环境变量或 CI 注入（若主题支持），或明确其「防爬不等同于安全保密」的定位。

## 7. `.gitignore` 与缓存目录

- 已忽略 `.vuepress/.cache`、`.temp`、`dist`。若仍能误提交缓存产物，检查路径是否与 `.gitignore` 规则一致，必要时收紧规则。

## 8. CI Action 版本（维护性）

- `deploy-docs.yml` 已使用 `actions/checkout@v4`、`actions/setup-node@v4`；其他工作流可按需对齐版本。

---

*说明：若需落地修改配置或工作流，可在 Agent 模式下逐项实施。*
