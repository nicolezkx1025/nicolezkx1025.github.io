# Nicole's Blog - 管理指南 🚀

这是一个基于 **Hexo NexT** 主题构建的高审美、极简主义博客。

---

## 💡 核心管理哲学：两种模式

| 模式 | 适用场景 | 优点 | 缺点 |
| :--- | :--- | :--- | :--- |
| **模式一：纯静态手动** | 偶尔微调、无环境依赖 | 无需安装 Node/Hexo，直接改 HTML | 维护索引麻烦，易出错 |
| **模式二：Hexo 源码** | **推荐**、长期写作 | Markdown 纯净写作，全自动生成索引 | 需要 Node.js 环境 |

---

## 🎨 极简高效：模式二（Hexo 模式）

### 1. 环境准备
如果您本地还没有源码环境，请按以下步骤快速重建：
1. **安装 Hexo**: `npm install -g hexo-cli`
2. **初始化**: `hexo init blog && cd blog && npm install`
3. **找回文章**: 我已为您从 HTML 中还原了 3 篇核心文章，见本地 `hexo_source/_posts/`。
   - 将这些 `.md` 文件复制到您的 `source/_posts/` 目录下。

### 2. 添加新文章的“三部曲”
1. **新建文章**: 
   ```powershell
   hexo new "文章标题"
   ```
2. **高审美写作**:
   - 在 `source/_posts/` 下编辑 .md 文件。
   - **必做：** 在摘要后加入 `<!-- more -->`。这样首页只会显示摘要，保持视觉上的整洁极简。
3. **一键发布**:
   ```powershell
   hexo clean; hexo g; hexo d
   ```

---

## 🛠️ 备选方案：模式一（手动模式）

如果您只需要紧急发布一篇短文，且不想动用 Hexo：

### 1. 目录结构规范
始终保持：`年/月/日/文章标题/index.html`

### 2. 发布步骤
1. **复制模板**: 复制最近一篇文章的文件夹。
2. **修改内容**: 编辑 `index.html`。
3. **专业 ID 管理 (Gitalk)**:
   - 计算路径 MD5 (PowerShell):
     ```powershell
     [System.BitConverter]::ToString((new-object System.Security.Cryptography.MD5CryptoServiceProvider).ComputeHash([System.Text.Encoding]::UTF8.GetBytes('2026/01/18/my-title/'))).Replace('-', '').ToLower()
     ```
   - 将生成的哈希值更新到 Gitalk 配置中的 `id` 和 `title` (格式: `Comment ID: [Hash]`)。
4. **手动更新索引**: 
   - 同步修改根目录 `index.html` 的列表。
   - 同步修改 `search.json`。

---

## 🚀 提交与部署命令
```powershell
# 统一提交规范
git add .
git commit -m "feat: 🚀 新增文章 [标题] / 细节优化"
git push origin gh-pages
```

---

> **Tip:** 为了保持首页的高级感，请务必在 Hexo 模式下使用 `<!-- more -->` 截断正文。
