---
title: Git Branch 命名规范
index: false
---

在 Git 开发中，命名分支时遵循一定的规范可以帮助团队成员更容易理解分支的目的和功能。常见的分支命名约定通常会根据开发流程的不同而有所不同，但有一些通用的规则和推荐做法。以下是一些常见的分支命名约定：

## 主要分支（Main Branches）

- `main` 或 `master`：这是项目的主分支，通常包含可发布的代码。现代 Git 项目通常使用 `main` 作为默认主分支名称。
- `develop`：这是开发分支，用于集成所有开发者的工作，通常在这里进行多功能的开发，直到准备好合并到 `main` 分支。

## 功能分支（Feature Branches）

功能分支用于开发新特性或功能，通常从 `develop` 分支分出。命名规范：

- 格式：`feature/功能描述` 或 `feature/任务ID-功能描述`
- 示例：
  - feature/login-page
  - feature/1234-add-user-authentication

这有助于确保每个功能分支的名称都能简明扼要地描述所开发的功能或任务。

## 修复分支（Bugfix Branches）

用于修复 bug，通常也是从 `develop` 分支分出，修复完成后再合并回 `develop` 或 `main`。

- 格式：`bugfix/问题描述` 或 `bugfix/任务ID-问题描述`
- 示例：

  - bugfix/fix-login-error
  - bugfix/4321-crash-on-submit

## 发布分支（Release Branches）

发布分支用于准备新版本发布，通常是从 `develop` 分支创建，进行最终的 bug 修复、文档更新和其他准备工作。完成后合并到 main 和 `develop`。

- 格式：`release/版本号` 或 `release/目标版本`
- 示例：
  - release/1.0.0
  - release/2.1.0

## 热修复分支（Hotfix Branches）

热修复分支用于快速修复生产环境中的严重问题，通常是从 `main` 分支分出，修复完成后合并回 `main` 和 `develop`。

- 格式：`hotfix/问题描述` 或 `hotfix/任务ID-问题描述`
- 示例：
  - hotfix/fix-critical-login-bug
  - hotfix/3010-urgent-security-patch

## 实验性分支（Experimental Branches）

如果你在进行实验或尝试新的技术或特性，可以使用实验性分支：

- 格式：`experiment/实验描述`
- 示例：
  - experiment/graphql-integration
  - experiment/featureX-experiment

## 合并分支（Merge Branches）

合并分支通常由 Git 自动创建，例如从 feature 分支合并到 `develop` 或 `main`。这些分支不需要特别命名，通常是用 merge 或相关的合并工具来执行。

## 命名最佳实践总结

- 简洁：分支名称应简洁明了，能清晰表明分支的目的。
- 描述性：描述分支的功能、修复或目的，避免使用模糊的词汇。
- 任务/问题跟踪号：如果你使用任务管理系统（如 JIRA、Trello），可以在分支名称中包含任务编号，例如 feature/1234-add-search-functionality。
- 一致性：保持团队内部分支命名的统一性，遵循一致的规则。

## 例子

- feature/login-form
- bugfix/fix-header-layout
- release/2.0.0
- hotfix/security-patch
