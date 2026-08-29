# 📚 408 计算机考研全科目知识库

> 依据 **2026 版全国硕士研究生招生考试 408 计算机学科专业基础综合考试大纲** 整理。
> 包含四大科目：**数据结构 (45分)**、**计算机组成原理 (45分)**、**操作系统 (35分)**、**计算机网络 (25分)**。

## 🌟 在线阅读

- **GitHub Pages 站点**: [https://zhaoyang51.github.io/cs408-notes/](https://zhaoyang51.github.io/cs408-notes/)

## 🚀 本地开发与预览

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务
npm run docs:dev

# 3. 本地编译构建
npm run docs:build
```

## 📖 知识库架构

| 科目 | 满分分值 | 章节数 | 小节数 |
|:---|:---:|:---:|:---:|
| 📘 **数据结构** | 45分 | 7 章 | 40 节 |
| 💻 **计算机组成原理** | 45分 | 6 章 | 33 节 |
| ⚙️ **操作系统** | 35分 | 5 章 | 20 节 |
| 🌐 **计算机网络** | 25分 | 6 章 | 28 节 |
| **合计** | **150分** | **24 章** | **121 节** |

---

## 👥 知识点贡献者标记与分组筛选

站点顶部导航栏内置**用户筛选控制器**，支持在「全部用户」、「Zhao」、「Chen」之间一键切换，并自动记忆筛选偏好。

### 如何标记知识点归属用户：

1. **使用 `<KP>` 知识点卡片容器（推荐）**：
   ```html
   <KP author="Zhao" title="核心口诀：阶数大小比较" tag="💡 必背">
     知识点内容...
   </KP>

   <KP author="Chen" title="主定理秒杀公式" tag="⭐️ 技巧">
     知识点内容...
   </KP>
   ```

2. **使用 `<AuthorTag>` 徽章组件**：
   ```html
   <AuthorTag user="Zhao" />
   <AuthorTag user="Chen" />
   ```

3. **使用 HTML 属性 / CSS 类名**：
   ```html
   <div class="kp-block" data-author="Zhao">...</div>
   <details class="self-test author-chen" data-author="Chen">...</details>
   <span class="badge badge-zhao">Zhao</span>
   <span class="badge badge-chen">Chen</span>
   ```

