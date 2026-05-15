---
title: git stash
icon: codicon:git-stash
---

**Stash the changes in a dirty working directory away**
[git-scm / gti-stash](https://git-scm.com/docs/git-stash)

---

`git stash` 是 Git 一个非常实用的小工具，它就像一个“代码临时箱”，让你在不提交不完整代码的情况下，临时保存工作进度，从而保持工作目录的整洁。

它的核心基础用法整理如下：

| 命令                              | 作用                                                                           | 示例                                       |
| :-------------------------------- | :----------------------------------------------------------------------------- | :----------------------------------------- |
| **`git stash`**                   | 暂存所有**已追踪文件**的修改，并恢复工作区到干净状态。                             | `git stash`                                |
| **`git stash push`**              | 同 `git stash`，功能更强大，推荐使用。                                 | `git stash push`                           |
| **`git stash push -m "message"`** | 在暂存时添加一个描述信息，方便以后识别。                                       | `git stash push -m "refactor login logic"` |
| **`git stash list`**              | 列出所有保存的暂存记录，最新的在最上面（栈结构），编号为 `stash@{0}`。                   | `git stash list`                           |
| **`git stash apply`**             | 应用指定的暂存到当前工作区，**但不会从暂存列表中删除**。                       | `git stash apply stash@{1}`                |
| **`git stash pop`**               | 应用指定的暂存到当前工作区，**并会从暂存列表中删除**。通常用于恢复最新的暂存。 | `git stash pop`                            |
| **`git stash drop`**              | 从暂存列表中删除指定的暂存。                                                   | `git stash drop stash@{0}`                 |
| **`git stash clear`**             | **危险！** 清空 **所有** 暂存记录，此操作不可逆，需谨慎使用。                  | `git stash clear`                          |

> **注意**：`git stash` 默认不会保存未跟踪的新文件。

### 🧑‍💻 进阶用法

除了基础命令，`git stash` 还提供了一些更精细化的操作：

- **选择性暂存 (--patch)**
  如果只对文件里的部分改动想暂存，可以用 `git stash push --patch`。命令会以交互式界面让你逐个决定每个代码块 (`hunk`) 的去留。

- **处理未跟踪或忽略的文件 (--include-untracked 或 --all)**
  为了更全面地暂存，可以使用 `-u` 或 `-a` 选项：
  - `git stash -u` ：暂存包括未跟踪的文件。
  - `git stash -a` ：暂存所有文件，包括被 `.gitignore` 忽略的文件。

- **查看暂存详情 (show)**
  在应用之前，可以先检查暂存的内容：
  - `git stash show` ：查看最新暂存的简要摘要。
  - `git stash show -p` ：查看最新暂存的完整代码差异 (`diff`)。

- **从暂存创建新分支 (stash branch)**
  如果当前分支与要应用的暂存产生冲突，可以尝试这条命令：

  ```bash
  git stash branch new-branch-name
  ```

  它会基于创建暂存时的提交 (`commit`) 创建一个新分支，并帮你把暂存的内容应用上去。

- **保留暂存区状态 (--keep-index)**
  `git stash push --keep-index` 会暂存你的工作区和暂存区的改动，但特别的是，它会在工作区**保留你已暂存 (`git add`) 后的内容**。这个选项在你想测试部分已暂存的代码，但又想暂存其他未暂存的改动时特别有用。

### 🤔 常见问题与恢复

1.  **`git stash pop` 和 `git stash apply` 的区别？**
    主要区别在于是否应用后自动删除暂存记录。如果想保留暂存以备用，或者不确定应用后是否顺利，用 `git stash apply`；确认不再需要此暂存时，用 `git stash pop`。

2.  **`git stash pop` 后代码丢失或冲突？**
    - **原因**：`git stash pop` 是 `apply` + `drop` 的组合命令。如果在 `apply` 时出现冲突（比如与当前分支最新代码冲突），pop 操作可能**失败**，但按照默认行为，它依然可能**直接删除了**暂存记录，导致恢复的内容不完整。
    - **建议**：养成习惯，**优先使用 `git stash apply`**，待手动确认恢复无误后，再用 `git stash drop` 手动删除暂存，这是最稳妥的习惯。

3.  **误操作 (`drop` / `clear`) 后如何恢复？**
    如果你不小心执行了 `git stash drop` 或 `git stash clear` 命令，不要慌张，只要没有执行过 `git gc` 垃圾回收，就有机会找回，请**立即按以下步骤尝试恢复**：
    1.  **查找所有“悬空”的提交对象**：
        ```bash
        git fsck --unreachable | grep commit
        ```
        这条命令会找出所有未被引用的提交记录，其中就可能包含了你的暂存。
    2.  **检查可疑的对象内容**：
        对于上面命令输出的每个提交哈希值 (commit hash, 如 `abc1234`)，用 `git show` 命令查看其内容，确认是否是你丢失的代码：
        ```bash
        git show abc1234
        ```
    3.  **恢复暂存**：
        找到正确的哈希值后，就可以把它作为一个新的暂存恢复了：
        ```bash
        git stash apply abc1234
        ```
        > **说明**：Git 默认会保留这些悬空对象约 **90 天**，为你提供了充足的“后悔药”时间。

### ✨ 最佳实践与建议

1.  **优先使用 `git stash push`**：作为现代替代命令，`git stash push` 功能更强大（例如支持选择性暂存），应逐渐替代旧式的 `git stash save`。
2.  **添加描述信息**：养成 `git stash push -m "清晰描述"` 的好习惯。当你有多个暂存时，清晰的描述会帮助你快速找到需要的版本。
3.  **不要滥用 `stash`**：如果你的工作可以随时提交，建议直接创建一个临时提交。`stash` 最适合用来处理需要立即中断的、不完整的、不方便提交的工作。
4.  **理解冲突**：应用暂存本质上是在尝试“合并”代码，所以和合并分支一样，可能会产生代码冲突。正确地解决冲突是使用 `stash` 的必备技能。
5.  **留意 `push` 时的参数位置**：当 `git stash push` 带有文件和 `-m` 消息时，需要用 `--` 分隔，例如 `git stash push -m "message" -- src/file.js`。

总而言之，`git stash` 是一个在复杂开发流程中非常实用的命令，帮你安全、高效地处理好紧急任务。
