---
layout: home

hero:
  name: "408 考研简纲速查"
  text: "新一代 AI 原生极简应试知识库"
  tagline: "⚡ 历年真题真考频统计 · 最小集应试体系 · 高频考点 / 核心公式 / 避坑陷阱 / 斑马纹对比表"
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
    title: 历年真题考频驱动 (Data-Driven)
    details: 基于 408 历年统考真题考频与题型统计（选择 vs 简答），直击 150 分得分命脉。
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
        全科第一大题方向：时空复杂度(22次)、哈夫曼树(15次)、二叉树遍历(13次)、图概念/存储(25次)、链表算法(12次)。
      </div>
    </div>
    <div class="footer-tags">
      <span class="badge badge-star">⭐️ 时空复杂度必考 (22次)</span>
      <span class="badge badge-formula">💡 哈夫曼树 (15次)</span>
      <span class="badge badge-freq">📊 链表算法大题 (12次)</span>
    </div>
  </a>

  <a href="./computer-organization/" class="subject-card co">
    <div>
      <div class="header">
        <span class="subject-title">🔵 计算机组成原理</span>
        <span class="score-pill">45 分 (占比 30%)</span>
      </div>
      <div class="desc">
        硬核大题与计算高地：定点数编码运算(26次)、中断方式(24次)、虚存管理(19次)、Cache映射(16次)、指令流水线(16次)。
      </div>
    </div>
    <div class="footer-tags">
      <span class="badge badge-star">⭐️ 定点数运算第一 (26次)</span>
      <span class="badge badge-trap">⚠️ 中断方式 (24次)</span>
      <span class="badge badge-formula">💡 Cache/虚存映射 (35次)</span>
    </div>
  </a>

  <a href="./operating-system/" class="subject-card os">
    <div>
      <div class="header">
        <span class="subject-title">🟣 操作系统</span>
        <span class="score-pill">35 分 (占比 23.3%)</span>
      </div>
      <div class="desc">
        大题支柱与调度核心：虚拟内存管理(33次·全科之王)、PV信号量同步互斥(22次)、CPU调度(22次)、非连续分配(22次)。
      </div>
    </div>
    <div class="footer-tags">
      <span class="badge badge-star">⭐️ 虚存管理第一考点 (33次)</span>
      <span class="badge badge-formula">💡 PV 操作大题必考 (22次)</span>
      <span class="badge badge-freq">📊 进程调度 (22次)</span>
    </div>
  </a>

  <a href="./computer-network/" class="subject-card cn">
    <div>
      <div class="header">
        <span class="subject-title">🟠 计算机网络</span>
        <span class="score-pill">25 分 (占比 16.7%)</span>
      </div>
      <div class="desc">
        规律性极强抓分科目：CIDR子网划分(20次)、介质访问控制(15次)、TCP拥塞控制(12次)、体系结构(12次)、路由转发(12次)。
      </div>
    </div>
    <div class="footer-tags">
      <span class="badge badge-star">⭐️ CIDR 子网第一 (20次)</span>
      <span class="badge badge-formula">💡 TCP 拥塞控制 (12次)</span>
      <span class="badge badge-trap">⚠️ 介质访问 CSMA (15次)</span>
    </div>
  </a>
</div>

---

## 🎯 全科命题规律与备考关键线索

### 1. 综合大题三大骨干命题方向（必背主线）

::: info 👑 408 综合大题三大骨干命题方向
1. **算法与数据结构大题**：以「**线性表（单链表 / 顺序表）算法设计**」为绝对主体，兼顾「**二叉树 / 图的遍历与构建**」，且每道算法大题最后一问**必带时空复杂度阶数分析**。
2. **计组 + 操作系统跨学科综合大题**：几乎每年必考「**虚拟内存管理（TLB + 页表） + Cache 组相联映射与主存访问 + 指令寻址与汇编指令对应**」的全链路软硬件结合题。
3. **计算机网络全栈大贯通题**：以「**主机开机 (DHCP) $\rightarrow$ 域名解析 (DNS) $\rightarrow$ 建立连接 (ARP / TCP 握手) $\rightarrow$ 路由转发 (CIDR / 路由表) $\rightarrow$ 数据传输与拥塞控制 (HTTP / TCP)**」为完整通信全景大题。
:::

### 2. 纯选择题得分高地（零大题但每年必选）

::: tip 💡 纯选择题得分高地（0 简答但高频必考）
- **数据结构**：B 树与 B+ 树阶数性质（12 次）、排序算法时空稳定性全景分析（12 次）、平衡二叉树 AVL 旋转（8 次）、树转二叉树“左孩子右兄弟”（8 次）。
- **计算机组成原理**：IEEE 754 浮点数表示与精度范围（14 次）、总线性能指标与突发传输（12 次）、计算机系统层次结构 ISA（11 次）。
- **操作系统**：死锁 4 大必要条件与银行家算法（12 次）、经典同步问题模型初值辨析（10 次）。
- **计算机网络**：介质访问控制 CSMA/CD 与退避算法（15 次）、网络体系结构 OSI vs TCP/IP 各层定义（12 次）、奈氏准则与香农定理极限计算（7 次）。
:::

---

## 📋 408 试卷结构与题型时间分配

| 题型 | 题目数量 | 分值分布 | 推荐建议用时 | 核心应对策略 |
|:---|:---:|:---:|:---:|:---|
| **单项选择题** | 40 题 | 80 分（每题 2 分） | 60 ~ 70 分钟 | 概念清晰、快速排除、警惕概念偷换陷阱 |
| **数据结构综合题** | 2 题 | 约 23 分 | 25 ~ 30 分钟 | 1 题结构性质推导 + 1 题核心代码实现（注重边界条件） |
| **计组综合应用题** | 2 题 | 约 23 分 | 25 ~ 30 分钟 | 紧扣 Cache 地址切分、指令格式字段与数据通路流向 |
| **操作系统应用题** | 2 题 | 约 14 分 | 20 ~ 25 分钟 | PV 信号量定义明确、安全序列列表推导 |
| **计算机网络应用题** | 1 题 | 约 10 分 | 15 ~ 20 分钟 | 时延链路计算列出步骤、TCP 状态机与 IP 转发表 |
