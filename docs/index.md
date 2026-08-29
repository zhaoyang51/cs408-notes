---
layout: home

hero:
  name: "408 考研简纲速查"
  text: "新一代 AI 原生极简应试知识库"
  tagline: "⚡ 最小集应试体系 · 高频考点 / 核心公式 / 避坑陷阱 / 斑马纹全景对比表"
  actions:
    - theme: brand
      text: 🟢 数据结构 (45分)
      link: /data-structure/
    - theme: alt
      text: 🔵 计组 (45分)
      link: /computer-organization/
    - theme: alt
      text: 🟣 操作系统 (35分)
      link: /operating-system/
    - theme: alt
      text: 🟠 计网 (25分)
      link: /computer-network/

features:
  - icon: 🎯
    title: 最小集原则 (Less is More)
    details: 紧扣 2026 考纲与历年真题命题规律，砍掉一切非考点废话，直击 150 分得分要害。
  - icon: ⚡
    title: 毫秒级即时速查 (Ctrl + K)
    details: 支持全中文核心术语、算法时空复杂度、网络协议帧格式与硬件公式秒级模糊过滤。
  - icon: 📜
    title: 三态护眼阅读系统
    details: 独创「浅白 / 羊皮纸护眼 / 极客暗黑」无缝切换，手机平板自适应沉浸式背诵自测。
---

## 🧭 四门科目核心模块速查

<div class="home-card-grid">
  <a href="./data-structure/" class="subject-card ds">
    <div>
      <div class="header">
        <span class="subject-title">🟢 数据结构</span>
        <span class="score-pill">45 分 (占比 30%)</span>
      </div>
      <div class="desc">
        涵盖线性表、栈队列、二叉树与森林遍历、图论最短路/生成树、查找与 Hash、8大内部排序时空对比。
      </div>
    </div>
    <div class="footer-tags">
      <span class="badge badge-star">⭐️ 必考算法题</span>
      <span class="badge badge-formula">💡 复杂度推导</span>
      <span class="badge badge-freq">📊 考频 ★★★★★</span>
    </div>
  </a>

  <a href="./computer-organization/" class="subject-card co">
    <div>
      <div class="header">
        <span class="subject-title">🔵 计算机组成原理</span>
        <span class="score-pill">45 分 (占比 30%)</span>
      </div>
      <div class="desc">
        聚焦 CPU 性能指标、IEEE 754 浮点、Cache 组相联映射、指令寻址、数据通路微操作、中断与 DMA。
      </div>
    </div>
    <div class="footer-tags">
      <span class="badge badge-star">⭐️ 硬件大题</span>
      <span class="badge badge-trap">⚠️ 计算重灾区</span>
      <span class="badge badge-formula">💡 Cache 映射公式</span>
    </div>
  </a>

  <a href="./operating-system/" class="subject-card os">
    <div>
      <div class="header">
        <span class="subject-title">🟣 操作系统</span>
        <span class="score-pill">35 分 (占比 23.3%)</span>
      </div>
      <div class="desc">
        掌握进程 5 状态机、PV 信号量同步互斥、银行家算法、基本分页分段与虚拟内存、UNIX inode 与磁盘调度。
      </div>
    </div>
    <div class="footer-tags">
      <span class="badge badge-star">⭐️ PV 大题必考</span>
      <span class="badge badge-formula">💡 页面置换算法</span>
      <span class="badge badge-freq">📊 考频 ★★★★★</span>
    </div>
  </a>

  <a href="./computer-network/" class="subject-card cn">
    <div>
      <div class="header">
        <span class="subject-title">🟠 计算机网络</span>
        <span class="score-pill">25 分 (占比 16.7%)</span>
      </div>
      <div class="desc">
        主攻网络时延 4 大公式、奈氏/香农定理、滑动窗口与 CSMA/CD、CIDR 划分子网、TCP 握手与拥塞控制、HTTP 协议。
      </div>
    </div>
    <div class="footer-tags">
      <span class="badge badge-star">⭐️ 协议综合大题</span>
      <span class="badge badge-formula">💡 时延计算</span>
      <span class="badge badge-trap">⚠️ 子网划分陷阱</span>
    </div>
  </a>
</div>

---

## 📋 408 试卷结构与题型时间分配

| 题型 | 题目数量 | 分值分布 | 推荐建议用时 | 核心应对策略 |
|:---|:---:|:---:|:---:|:---|
| **单项选择题** | 40 题 | 80 分（每题 2 分） | 60 ~ 70 分钟 | 概念清晰、快速排除、警惕概念偷换陷阱 |
| **数据结构综合题** | 2 题 | 约 23 分 | 25 ~ 30 分钟 | 1 题结构性质推导 + 1 题核心代码实现（注重边界条件） |
| **计组综合应用题** | 2 题 | 约 23 分 | 25 ~ 30 分钟 | 紧扣 Cache 地址切分、指令格式字段与数据通路流向 |
| **操作系统应用题** | 2 题 | 约 14 分 | 20 ~ 25 分钟 | PV 信号量定义明确、安全序列列表推导 |
| **计算机网络应用题** | 1 题 | 约 10 分 | 15 ~ 20 分钟 | 时延链路计算列出步骤、TCP 状态机与 IP 转发表 |

---

## 🎯 408 考点秒杀与自查示例

<details class="self-test">
  <summary>
    <span class="badge badge-star">⭐️ 重点自测</span>
    <span>快速排序在什么情况下性能最差？如何优化？</span>
  </summary>
  <div class="answer-content">
    <p><strong>【最坏情况】</strong>：当初始序列已经<strong>基本有序</strong>或<strong>逆序</strong>时，每次划分只能减少 1 个元素，递归树退化为单支树，时间复杂度升至 $O(n^2)$，递归栈空间复杂度升至 $O(n)$。</p>
    <p><strong>【优化方案】</strong>：</p>
    <ul>
      <li><strong>三数取中法</strong>（取首、尾、中三者的中间值作为基准枢轴）。</li>
      <li><strong>随机选取枢轴法</strong>。</li>
      <li>当子序列长度较小时（如 $n \le 10$）直接切换为<strong>直接插入排序</strong>。</li>
    </ul>
  </div>
</details>

<details class="self-test">
  <summary>
    <span class="badge badge-trap">⚠️ 经典避坑</span>
    <span>为什么单精度 IEEE 754 阶码偏移量是 127 而不是 128？</span>
  </summary>
  <div class="answer-content">
    <p>8 位无符号数的范围是 $0 \sim 255$。标准中保留全 0（表示 $\pm 0$ 或非规格化数）和全 1（表示 $\pm \infty$ 或 NaN），有效阶码范围为 $1 \sim 254$。减去 Bias $= 127$ 后，实际真值指数范围为 $-126 \sim +127$，保持对称平衡。</p>
  </div>
</details>
