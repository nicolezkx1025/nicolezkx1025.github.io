# Nicole's Blog - 管理指南

这是一个基于 Hexo NexT 主题生成的博客。目前您可以选择 **"纯静态手动维护"** 或 **"Hexo 源码自动化维护"** 两种模式。

---

## 模式一：纯静态手动维护（当前状态）

如果您不想安装 Node.js 和 Hexo 环境，可以直接修改 HTML 文件。

### 1. 发布新文章
1. **创建目录**：按 `年/月/日/文章标题/` 格式创建文件夹（如 `2026/01/18/my-post/`）。
2. **准备内容**：复制现有文章的 `index.html` 作为模板，修改标题、时间和正文内容。
3. **配置 Gitalk**：
   - 生成路径 MD5：`[System.BitConverter]::ToString((new-object System.Security.Cryptography.MD5CryptoServiceProvider).ComputeHash([System.Text.Encoding]::UTF8.GetBytes('路径'))).Replace('-', '').ToLower()`
   - 更新代码中的 `id` 和 `title` 为该 MD5 值。
4. **手动更新索引**：必须同步更新 `index.html` (首页列表)、`archives/index.html` (归档) 和 `search.json` (搜索)。

---

## 模式二：Hexo 源码管理模式（推荐，更高效）

如果您希望更简单地管理文章、自动生成索引和归档，建议切换回 Hexo 模式。

### 🚀 源码找回与迁移指南（NEW）
我已经为您从现有的静态 HTML 中提取并还原了 **3 篇核心文章** 的 Markdown 源码。

**操作步骤：**
1. **获取源码**：源码文件位于本地目录 `hexo_source/_posts/` 下。
2. **准备 Hexo 环境**：
   - 找回您包含 `_config.yml` 的原始 Hexo 文件夹。
   - 如果找不到了，可以新建一个：`hexo init my-blog`。
3. **放置文章**：将 `hexo_source/_posts/` 里的 `.md` 文件全部复制到 Hexo 项目的 `source/_posts/` 目录下。
4. **生成与部署**：
   ```bash
   hexo clean
   hexo g
   hexo d
   ```

### 为什么 Hexo 模式管理更简单？
*   **Markdown 编写**：只需写简单的 `.md` 文件，无需处理复杂的 HTML 标签。
*   **自动化生成**：Hexo 会自动帮您更新首页列表、归档页面、分类页面和搜索索引，完全消除手动维护 `search.json` 的痛苦。
*   **配置统一**：Gitalk 等插件只需在 `_config.yml` 中配置一次，所有新文章自动生效。

### 如何使用 Hexo 模式添加文章？
1.  **创建文章**：
    ```bash
    hexo new "文章标题"
    ```
    这会在 `source/_posts/` 下生成一个 Markdown 文件。
2.  **编写内容**：使用 Markdown 语法在生成的 `.md` 文件中写作。
3.  **本地预览**：
    ```bash
    hexo server
    ```
4.  **生成并发布**：
    ```bash
    hexo clean && hexo generate && hexo deploy
    ```
    *注意：`hexo deploy` 会自动将生成的 HTML 推送到 `gh-pages` 分支。*

### 注意事项（切换指南）
*   **源码备份**：目前该仓库仅包含生成的静态 HTML。如果您要切换回源码模式，您需要找回包含 `source/`, `scaffolds/`, `themes/` 和 `_config.yml` 的 **Hexo 源码仓库**。
*   **Gitalk 适配**：在 Hexo 的主题配置文件中设置 Gitalk 时，可以使用插件自动生成 MD5 作为 ID，保持与目前的“专业模式”一致。

---

## 总结：我该选哪种？

*   **如果您只是偶尔发一篇短文**：继续使用 **模式一**，复制 HTML 即可，无需安装环境。
*   **如果您追求效率和排版**：强烈建议使用 **模式二**。Markdown 的写作体验远超 HTML，且 Hexo 处理索引的能力能节省大量时间。

---
**提交与推送（手动模式）**:
```powershell
git add .
git commit -m "feat: add new post [文章标题]"
git push origin gh-pages
```
