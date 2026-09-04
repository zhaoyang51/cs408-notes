# 第6章 树形查找与散列表 · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P13~P16 与 P20，涵盖折半查找判定树与 ASL 计算、平衡二叉树 (AVL) 旋转与最少节点递推、红黑树四大性质（“左根右/根叶黑/不红红/黑路同”）与插入变色旋转图解、$m$ 阶 B 树（插入分裂与借位合并）、B+ 树核心区别、以及散列表构造、冲突探测与装填因子。

---

## 🔍 折半查找与判定树

### ❓ 折半查找 (二分查找) 规范手写代码

```c
int binarySearch(int a[], int n, int key) {
    int left = 0, right = n - 1, mid;
    while (left <= right) {
        mid = left + (right - left) / 2; // 防溢出
        if (a[mid] == key) return mid;   // 查找成功
        else if (a[mid] > key) right = mid - 1;
        else left = mid + 1;
    }
    return -1; // 查找失败
}
```

::: tip 💡 核心考研定理
* **折半查找的判定树必是一棵平衡二叉树 (AVL)**！
* **平均查找长度 (ASL)** 计算公式：
  $$\text{ASL}_{\text{成功}} = \frac{1}{n} \sum_{i=1}^n (\text{第 } i \text{ 个节点的层数})$$
  $$\text{ASL}_{\text{失败}} = \frac{1}{n+1} \sum (\text{虚叶子节点的父节点比较次数})$$
:::

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 折半查找 11 节点判定树与 ASL 层级分析</span>
    <span class="diagram-badge">P13 手记草图</span>
  </div>
  <svg viewBox="0 0 700 210" width="100%" height="210">
    <g transform="translate(20, 15)">
      <!-- 第1层: 根 6 -->
      <g transform="translate(330, 15)">
        <circle cx="0" cy="0" r="15" fill="rgba(37,99,235,0.18)" stroke="#2563eb" stroke-width="2"/>
        <text x="0" y="4" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="800">6</text>
        <text x="35" y="4" fill="var(--vp-c-text-3)" font-size="10.5">第1层 (1次)</text>
      </g>
      <!-- 第2层: 3 和 9 -->
      <g transform="translate(180, 60)">
        <circle cx="0" cy="0" r="14" fill="rgba(37,99,235,0.12)" stroke="#2563eb" stroke-width="1.8"/>
        <text x="0" y="4" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">3</text>
      </g>
      <g transform="translate(480, 60)">
        <circle cx="0" cy="0" r="14" fill="rgba(37,99,235,0.12)" stroke="#2563eb" stroke-width="1.8"/>
        <text x="0" y="4" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">9</text>
      </g>
      <line x1="320" y1="24" x2="192" y2="52" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
      <line x1="340" y1="24" x2="468" y2="52" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
      <!-- 第3层: 1, 4, 7, 10 -->
      <g transform="translate(100, 110)">
        <circle cx="0" cy="0" r="13" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <text x="0" y="4" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="600">1</text>
      </g>
      <g transform="translate(240, 110)">
        <circle cx="0" cy="0" r="13" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <text x="0" y="4" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="600">4</text>
      </g>
      <g transform="translate(420, 110)">
        <circle cx="0" cy="0" r="13" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <text x="0" y="4" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="600">7</text>
      </g>
      <g transform="translate(540, 110)">
        <circle cx="0" cy="0" r="13" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <text x="0" y="4" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="600">10</text>
      </g>
      <line x1="170" y1="69" x2="110" y2="100" stroke="var(--vp-c-divider)" stroke-width="1.2"/>
      <line x1="190" y1="69" x2="230" y2="100" stroke="var(--vp-c-divider)" stroke-width="1.2"/>
      <line x1="470" y1="69" x2="430" y2="100" stroke="var(--vp-c-divider)" stroke-width="1.2"/>
      <line x1="490" y1="69" x2="530" y2="100" stroke="var(--vp-c-divider)" stroke-width="1.2"/>
      <!-- 第4层: 2, 5, 8, 11 -->
      <g transform="translate(130, 160)">
        <circle cx="0" cy="0" r="12" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
        <text x="0" y="4" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">2</text>
      </g>
      <g transform="translate(260, 160)">
        <circle cx="0" cy="0" r="12" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
        <text x="0" y="4" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">5</text>
      </g>
      <g transform="translate(440, 160)">
        <circle cx="0" cy="0" r="12" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
        <text x="0" y="4" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">8</text>
      </g>
      <g transform="translate(560, 160)">
        <circle cx="0" cy="0" r="12" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
        <text x="0" y="4" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">11</text>
      </g>
      <line x1="108" y1="120" x2="124" y2="150" stroke="var(--vp-c-divider)" stroke-width="1.2"/>
      <line x1="245" y1="120" x2="255" y2="150" stroke="var(--vp-c-divider)" stroke-width="1.2"/>
      <line x1="425" y1="120" x2="435" y2="150" stroke="var(--vp-c-divider)" stroke-width="1.2"/>
      <line x1="545" y1="120" x2="555" y2="150" stroke="var(--vp-c-divider)" stroke-width="1.2"/>
      <!-- ASL 结论框 -->
      <g transform="translate(590, 40)">
        <rect x="0" y="0" width="100" height="90" fill="rgba(16,185,129,0.08)" stroke="#10b981" rx="6"/>
        <text x="50" y="20" text-anchor="middle" fill="#10b981" font-size="11" font-weight="700">ASL 测算</text>
        <text x="10" y="42" fill="var(--vp-c-text-1)" font-size="10.5">1×1 = 1</text>
        <text x="10" y="58" fill="var(--vp-c-text-1)" font-size="10.5">2×2 = 4</text>
        <text x="10" y="74" fill="var(--vp-c-text-1)" font-size="10.5">3×4 = 12</text>
        <text x="10" y="90" fill="var(--vp-c-text-1)" font-size="10.5">4×4 = 16</text>
      </g>
    </g>
  </svg>
</div>

---

## 🎮 查找算法与数据结构全景动态演示系统

> 可以在下方切换「折半查找区间收缩与判定树」「AVL 平衡旋转 (LL / LR)」「5 阶 B-树分裂」以及「散列表线性探测与 ASL 统计」，通过分步直观探索 408 查找大题核心计算与旋转机理！

<SearchPlayer />

---

## ⚖️ 平衡二叉树 (AVL)

### ❓ 平衡因子与深度为 $h$ 的最少节点数递推

* **平衡因子**：$$\text{Balance Factor} = \text{左子树高度} - \text{右子树高度} \in \{-1, 0, 1\}$$
* **深度为 $h$ 的 AVL 树所含最少节点数递推公式**：
  $$\mathbf{N_h = N_{h-1} + N_{h-2} + 1}$$
  * $N_0 = 0$
  * $N_1 = 1$
  * $N_2 = 2$
  * $N_3 = 4$
  * $N_4 = 7$
  * $N_5 = 12$
  * $N_6 = 20$

---

### ❓ 四大旋转调整核心口诀

* **LL 型（右单旋）**：失衡节点的左孩子的右子树作为失衡节点的左子树，左孩子升为新根；
* **RR 型（左单旋）**：失衡节点的右孩子的左子树作为失衡节点的右子树，右孩子升为新根；
* **LR 型（先左后右双旋）**：左孩子的右孩子先左旋后右旋升为新根；
* **RL 型（先右后左双旋）**：右孩子的左孩子先右旋后左旋升为新根。

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · AVL 树单旋转 (RR) 与双旋转 (RL) 调整对比</span>
    <span class="diagram-badge">P15 手记草图</span>
  </div>
  <svg viewBox="0 0 700 170" width="100%" height="170">
    <!-- RR 型左单旋 -->
    <g transform="translate(10, 15)">
      <text x="0" y="16" fill="#2563eb" font-size="12" font-weight="700">① RR 型（右右失衡 ➔ 逆时针左单旋）</text>
      <g transform="translate(30, 25)">
        <!-- 旋转前 -->
        <circle cx="20" cy="20" r="14" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="2"/>
        <text x="20" y="24" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">A</text>
        <circle cx="50" cy="55" r="14" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2"/>
        <text x="50" y="59" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">B</text>
        <circle cx="80" cy="90" r="14" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <text x="80" y="94" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11">C</text>
        <line x1="30" y1="30" x2="40" y2="45" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
        <line x1="60" y1="65" x2="70" y2="80" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
        <!-- 转换箭头 -->
        <path d="M 110 55 L 145 55" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
        <text x="128" y="45" text-anchor="middle" fill="#2563eb" font-size="10.5" font-weight="600">左单旋</text>
        <!-- 旋转后 -->
        <g transform="translate(170, 15)">
          <circle cx="40" cy="20" r="14" fill="rgba(37,99,235,0.18)" stroke="#2563eb" stroke-width="2"/>
          <text x="40" y="24" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="800">B (新根)</text>
          <circle cx="15" cy="60" r="14" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
          <text x="15" y="64" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11">A</text>
          <circle cx="65" cy="60" r="14" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
          <text x="65" y="64" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11">C</text>
          <line x1="32" y1="30" x2="22" y2="48" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
          <line x1="48" y1="30" x2="58" y2="48" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
        </g>
      </g>
    </g>
    <!-- RL 型双旋 -->
    <g transform="translate(370, 15)">
      <text x="0" y="16" fill="#10b981" font-size="12" font-weight="700">② RL 型（右左失衡 ➔ 先右后左双旋）</text>
      <g transform="translate(20, 25)">
        <!-- 旋转前折线形 -->
        <circle cx="20" cy="20" r="14" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="2"/>
        <text x="20" y="24" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">A</text>
        <circle cx="70" cy="45" r="14" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2"/>
        <text x="70" y="49" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">B</text>
        <circle cx="45" cy="85" r="14" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="2"/>
        <text x="45" y="89" text-anchor="middle" fill="#10b981" font-size="11" font-weight="700">C</text>
        <line x1="32" y1="26" x2="58" y2="39" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
        <line x1="64" y1="55" x2="52" y2="75" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
        <!-- 转换箭头 -->
        <path d="M 100 55 L 135 55" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
        <text x="118" y="45" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="600">先右后左</text>
        <!-- 旋转后平衡 -->
        <g transform="translate(160, 15)">
          <circle cx="40" cy="20" r="14" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="2.2"/>
          <text x="40" y="24" text-anchor="middle" fill="#10b981" font-size="11" font-weight="800">C (新根)</text>
          <circle cx="15" cy="60" r="14" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
          <text x="15" y="64" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11">A</text>
          <circle cx="65" cy="60" r="14" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
          <text x="65" y="64" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11">B</text>
          <line x1="32" y1="30" x2="22" y2="48" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
          <line x1="48" y1="30" x2="58" y2="48" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
        </g>
      </g>
    </g>
  </svg>
</div>

---

## 🔴⚫ 红黑树 (Red-Black Tree)

### ❓ 红黑树四大核心性质（必背口诀）

> 💡 **红黑树黄金口诀：左根右、根叶黑、不红红、黑路同**

1. **左根右**：满足二叉排序树 (BST) 的基本性质（左子树 < 根 < 右子树）；
2. **根叶黑**：**根节点必须是黑色**；**所有外部叶子节点（NULL 哨兵节点）必须是黑色**；
3. **不红红**：**不存在两个相邻的红色节点**（即红色节点的父子节点必定全为黑色）；
4. **黑路同**：从树中**任意节点**出发，到其所有可达叶子节点的简单路径上，包含**相同数量的黑色节点（黑高 $bh$）**。

::: tip 💡 核心深度推论
* **根到叶子的最长路径长度不超过最短路径长度的 2 倍**！
  * 最短路径：全为黑色节点；
  * 最长路径：红黑交替相间；
  * 由于黑高严格相同，最长路径长度必然 $\le 2 \times$ 最短路径。
:::

---

### ❓ 红黑树插入新节点调整规则

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 红黑树插入红红冲突判断决策流图</span>
    <span class="diagram-badge">P16 手记草图</span>
  </div>
  <svg viewBox="0 0 700 130" width="100%" height="130">
    <g transform="translate(10, 15)">
      <!-- 插入红色 -->
      <rect x="0" y="25" width="90" height="34" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="2" rx="6"/>
      <text x="45" y="46" text-anchor="middle" fill="#ef4444" font-size="11.5" font-weight="700">插新节点 (红)</text>
      <path d="M 90 42 L 130 42" stroke="var(--vp-c-divider)" stroke-width="2" marker-end="url(#arrow-blue)"/>
      <!-- 父节点判定 -->
      <rect x="135" y="25" width="100" height="34" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="6"/>
      <text x="185" y="46" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="700">父节点颜色?</text>
      <!-- 父黑分支 -->
      <path d="M 185 25 L 185 5 L 280 5" fill="none" stroke="#10b981" stroke-width="1.8" marker-end="url(#arrow-green)"/>
      <text x="210" y="0" fill="#10b981" font-size="10.5" font-weight="700">父为黑 ➔ 结束(合法)</text>
      <!-- 父红分支 -->
      <path d="M 235 42 L 280 42" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>
      <text x="255" y="36" text-anchor="middle" fill="#ef4444" font-size="10.5" font-weight="700">父为红</text>
      <!-- 叔叔颜色判定 -->
      <rect x="285" y="25" width="110" height="34" fill="rgba(239,68,68,0.1)" stroke="#ef4444" rx="6"/>
      <text x="340" y="46" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">看叔叔节点颜色</text>
      <!-- 叔红分支 -->
      <path d="M 395 32 L 440 18" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>
      <g transform="translate(445, 0)">
        <rect x="0" y="0" width="230" height="32" fill="rgba(239,68,68,0.08)" stroke="#ef4444" rx="6"/>
        <text x="115" y="20" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">叔红: 叔父变黑，爷变红 (向上递归)</text>
      </g>
      <!-- 叔黑分支 -->
      <path d="M 395 50 L 440 68" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
      <g transform="translate(445, 52)">
        <rect x="0" y="0" width="230" height="32" fill="rgba(37,99,235,0.08)" stroke="#2563eb" rx="6"/>
        <text x="115" y="20" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">叔黑: 旋转(LL/RR/LR/RL) + 染色</text>
      </g>
    </g>
  </svg>
</div>

```
插入新节点 ──> 默认染成【红色】
                 │
                 ├── 若为根节点 ──> 直接染成【黑色】（结束）
                 │
                 ├── 若父节点为黑色 ──> 无冲突，直接结束
                 │
                 └── 若父节点为红色 (触发红红冲突)
                          │
                          ├── [情况 1: 叔叔为红色]
                          │       └── 叔、父变黑，爷变红；
                          │           以爷节点作为新节点向上递归调整
                          │
                          └── [情况 2: 叔叔为黑色 (包括 NULL 哨兵)]
                                  ├── LL 型: 右单旋，父变黑、爷变红
                                  └── LR 型: 先左后右双旋，儿变黑、爷变红
```

---

## 🌳 B 树与 B+ 树

### ❓ $m$ 阶 B 树核心性质与关键字上下限

| 节点类型 | 包含子树数量范围 | 包含关键字数量范围 | 节点内部结构 |
| :--- | :---: | :---: | :--- |
| **根节点 (非叶)** | $[2, \ m]$ | $[1, \ m - 1]$ | $[P_0, K_1, P_1, \dots, K_n, P_n]$ |
| **其他非根非叶节点** | $[\lceil m/2 \rceil, \ m]$ | $[\lceil m/2 \rceil - 1, \ m - 1]$ | 关键字升序有序 |
| **叶子节点 (终端)** | $0$ | $[\lceil m/2 \rceil - 1, \ m - 1]$ | 处于同一物理层，不含实际数据 |

::: tip 💡 B 树磁盘 I/O 次数
* 读写 B 树的磁盘 I/O 次数直接等于 **B 树的高度 $h$**；
* 若树高为 6，最坏情况下需 6 次 I/O 读到数据，或需 6 次 I/O 确认关键字不在树中。
:::

---

### ❓ 5 阶 B 树插入与分裂（以手写算例为例）

* **插入位置**：新关键字总是插入到**最底层的非叶终端节点**中；
* **溢出分裂条件**：5 阶 B 树节点关键字上限为 $5 - 1 = 4$ 个。若插入后达到 5 个关键字，触发**分裂**：
  * 取第 $\lceil 5/2 \rceil = 3$ 个（中间位置）关键字**上提到父节点**中；
  * 左边 2 个关键字留在原节点，右边 2 个关键字移入新建的右兄弟节点；
  * 若父节点也溢出，级联向上分裂直至根节点。

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 5 阶 B 树插入分裂与中间关键字（第 3 位）上提</span>
    <span class="diagram-badge">P14 手记草图</span>
  </div>
  <svg viewBox="0 0 700 160" width="100%" height="160">
    <g transform="translate(15, 15)">
      <!-- 插入前溢出态 -->
      <g transform="translate(10, 45)">
        <rect x="0" y="0" width="200" height="36" fill="rgba(239,68,68,0.1)" stroke="#ef4444" stroke-width="2" rx="4"/>
        <text x="20" y="23" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12">5</text>
        <line x1="40" y1="0" x2="40" y2="36" stroke="#ef4444"/>
        <text x="60" y="23" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12">10</text>
        <line x1="80" y1="0" x2="80" y2="36" stroke="#ef4444"/>
        <!-- 重点上提关键字 15 -->
        <rect x="80" y="0" width="40" height="36" fill="#ef4444"/>
        <text x="100" y="23" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="800">15</text>
        <line x1="120" y1="0" x2="120" y2="36" stroke="#ef4444"/>
        <text x="140" y="23" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12">20</text>
        <line x1="160" y1="0" x2="160" y2="36" stroke="#ef4444"/>
        <text x="180" y="23" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12">25</text>
        <text x="100" y="-8" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">满 5 个溢出 (⌈5/2⌉=3)</text>
      </g>
      <!-- 分裂箭头 -->
      <path d="M 230 63 L 285 63" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arrow-blue)"/>
      <text x="257" y="52" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">分裂上提</text>
      <!-- 分裂后结构 -->
      <g transform="translate(320, 10)">
        <!-- 上提父节点 15 -->
        <g transform="translate(110, 0)">
          <rect x="0" y="0" width="50" height="32" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2" rx="4"/>
          <text x="25" y="21" text-anchor="middle" fill="#2563eb" font-size="13" font-weight="800">15</text>
          <text x="25" y="-6" text-anchor="middle" fill="#2563eb" font-size="10.5" font-weight="700">上提新父</text>
        </g>
        <!-- 左子树 [5, 10] -->
        <g transform="translate(20, 65)">
          <rect x="0" y="0" width="90" height="32" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="4"/>
          <text x="22" y="21" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12">5</text>
          <line x1="45" y1="0" x2="45" y2="32" stroke="var(--vp-c-divider)"/>
          <text x="68" y="21" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12">10</text>
        </g>
        <!-- 右子树 [20, 25] -->
        <g transform="translate(160, 65)">
          <rect x="0" y="0" width="90" height="32" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="4"/>
          <text x="22" y="21" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12">20</text>
          <line x1="45" y1="0" x2="45" y2="32" stroke="var(--vp-c-divider)"/>
          <text x="68" y="21" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12">25</text>
        </g>
        <line x1="120" y1="32" x2="70" y2="65" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
        <line x1="150" y1="32" x2="200" y2="65" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
      </g>
    </g>
  </svg>
</div>

---

### ❓ 5 阶 B 树删除与合并

* **非终端节点删除**：用该关键字的**直接前驱**（左子树最大值）或**直接后继**（右子树最小值）顶替，转化为删除底层终端节点；
* **终端节点不足借位与合并**：若删除后关键字少于 $\lceil 5/2 \rceil - 1 = 2$ 个：
  * **兄弟够借（父子兄弟旋转）**：向左或右邻近兄弟借一个关键字（通过父节点中转顶替）；
  * **兄弟不够借（合并）**：将该节点、相关父节点关键字、以及左/右兄弟节点**三者合并为一个新节点**。


---

### ❓ B+ 树与 B 树四大本质区别

| 对比维度 | B 树 (多路平衡搜索树) | B+ 树 (数据库与文件系统索引基石) |
| :--- | :--- | :--- |
| **子树与关键字对应** | $n$ 个关键字对应 $n+1$ 棵子树 | **$n$ 个关键字对应 $n$ 棵子树** |
| **叶子节点数据覆盖** | 关键字分散在各个层级的非叶与叶节点中 | **所有叶子节点包含全部关键字及记录指针** |
| **叶子节点链接方式** | 叶节点彼此相互独立 | **所有叶子节点按顺序串联成双向链表**，支持极速范围查询 |
| **非叶节点作用** | 存放关键字和实际数据记录 | **仅作为索引目录**，关键字为子树中的最值，不存实际数据 |

---

## 🎯 散列表 (Hash Table)

### ❓ 散列函数构造方法
1. **直接定址法**：$H(key) = a \cdot key + b$（计算最快，无冲突，但要求关键字连续分布）；
2. **除留余数法**：$H(key) = key \pmod p$（$p \le m$，**通常取不大于表长的最大质数**）；
3. **平方取中法**：取关键字平方后的中间若干位作为地址；
4. **数字分析法**：分析关键字各数位分布，抽取分布均匀的数位组合。

---

### ❓ 冲突解决策略与缺陷辨析

* **开放定址法**：$H_i = (H(key) + d_i) \pmod m$
  * **线性探测法**（$d_i = 1, 2, 3, \dots$）：**缺点是极易产生“一次聚集 / 堆积”现象**；
  * **平方探测法 / 二次探测法**（$d_i = 1^2, -1^2, 2^2, -2^2, \dots$）：可避免聚集，**但缺点是不能探测到散列表的所有单元**；
  * **双散列法**：$d_i = i \times \text{Hash}_2(key)$；
* **拉链法 (Chaining)**：冲突元素挂入同一个单链表，无堆积，平均查找效率最高。

---

### ❓ 装填因子 $\alpha$ 的决定性意义

$$\mathbf{\alpha = \frac{\text{表中记录数 } n}{\text{散列表物理长度 } m}}$$

::: tip 💡 命题易错点
散列表的平均查找长度 (ASL) **只直接取决于装填因子 $\alpha$ 和冲突处理方法**，而**与表中记录总数 $n$ 无直接依赖关系**！$\alpha$ 越大，冲突概率越高，ASL 越大。
:::


