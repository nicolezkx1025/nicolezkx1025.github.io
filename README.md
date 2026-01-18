# Nicole's Blog - 管理指南

这是一个基于 Hexo NexT 主题生成的静态博客。目前直接通过 Git 维护部署在 GitHub Pages 上的 HTML 文件。

## 如何发布新文章

为了保持一致性和专业性，请按照以下步骤添加新文章：

### 1. 创建文章文件夹
在根目录下按照 `年/月/日/文章标题/` 的格式创建目录。
例如：`2026/01/18/my-new-post/`

### 2. 准备 index.html
建议直接复制现有文章的 `index.html` 作为模板进行修改。
**核心修改点：**
- `<title>`: 文章标题。
- `CONFIG.page`: 更新 `title`。
- `<h2 class="post-title">`: 页面显示的标题。
- `<time>`: 发布时间。
- `<div class="post-body">`: 文章正文内容。
- **Gitalk 评论配置**（见下文）。

### 3. 配置 Gitalk 评论（最专业方式）
为了保持 Issue 列表整洁，每篇文章的 `id` 和 `title` 必须保持一致且使用 MD5 加密。
1. **生成 ID**: 
   在 PowerShell 中运行以下命令生成文章路径的 MD5（例如：`2026/01/18/my-new-post/index.html`）：
   ```powershell
   [System.BitConverter]::ToString((new-object System.Security.Cryptography.MD5CryptoServiceProvider).ComputeHash([System.Text.Encoding]::UTF8.GetBytes('2026/01/18/my-new-post/index.html'))).Replace('-', '').ToLower()
   ```
2. **更新代码**: 
   在 `index.html` 结尾处的 Gitalk 配置中，替换 `id` 和 `title`：
   ```javascript
   var gitalk = new Gitalk({
     // ... 其他配置保持不变 ...
     id: '你的MD5值',
     title: 'Comment ID: 你的MD5值',
     distractionFreeMode: true
   });
   ```

### 4. 更新索引与归档（重要）
目前博客是静态 HTML，新增文章后需要**手动**更新以下页面以显示新链接：
- 首页 `index.html`: 在文章列表中添加新文章的预览。
- 归档页 `archives/index.html`: 添加新文章条目。
- 搜索索引 `search.json`: 将新文章的标题、路径和内容加入 JSON 数组中（用于本地搜索）。

### 5. 提交并推送
```powershell
git add .
git commit -m "feat: add new post [文章标题]"
git push origin gh-pages
```

---
**提示**: 如果您之后切换回 Hexo 源码管理模式，请务必保留 `.git` 历史记录。
