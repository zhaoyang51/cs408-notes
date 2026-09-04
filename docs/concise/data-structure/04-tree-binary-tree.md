# 第4章 树、二叉树、线索树与并查集 · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P6~P9，涵盖树度数与节点数核心方程、二叉树形态卡特兰数、层序+中序唯一构树推导、线索二叉树空链域与前驱后继判定大横评、树/森林与二叉树遍历双向映射、哈夫曼树构造与 $m$ 叉哈夫曼树补虚段、以及并查集按秩合并与路径压缩优化。

---

## 🌲 树与二叉树核心数学性质

### ❓ 树的节点数与度数黄金方程

$$\mathbf{\text{树的总节点数 } n = \sum \text{所有节点的度数} + 1 = 0 \cdot n_0 + 1 \cdot n_1 + 2 \cdot n_2 + \dots + m \cdot n_m + 1}$$

* **二叉树特例推导（必考定理）**：
  * 总节点数：$n = n_0 + n_1 + n_2$
  * 总边数关系：$n = 0 \cdot n_0 + 1 \cdot n_1 + 2 \cdot n_2 + 1$
  * 两式联立相减得：
    $$\mathbf{n_0 = n_2 + 1 \quad (\text{叶子节点数恒等于度为 2 的节点数加 1})}$$

---

### ❓ 给定 $n$ 个节点，能构成多少种不同形态的二叉树？

$$\mathbf{N = \frac{1}{n+1} C_{2n}^n \quad (\text{卡特兰数})}$$

---

### ❓ 完全二叉树顺序存储父子节点下标对应

| 数组下标起始点 | 父节点下标 | 左孩子下标 | 右孩子下标 | 判定是否有左孩子 | 判定是否有右孩子 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **下标从 1 开始** | $\lfloor i / 2 \rfloor$ | $2i$ | $2i + 1$ | $2i \le n$ | $2i + 1 \le n$ |
| **下标从 0 开始** | $\lfloor (i - 1) / 2 \rfloor$ | $2i + 1$ | $2i + 2$ | $2i + 1 < n$ | $2i + 2 < n$ |

---

## 🔄 二叉树遍历与唯一还原

### ❓ 层序遍历算法实现（基于队列 BFS）

```c
void levelOrder(BiTree T) {
    Queue Q;
    initQueue(Q);
    inQueue(Q, T);

    while (!isEmpty(Q)) {
        BiTree p;
        deQueue(Q, p);
        visit(p);
        if (p->lchild != NULL) inQueue(Q, p->lchild);
        if (p->rchild != NULL) inQueue(Q, p->rchild);
    }
}
```

---

### ❓ 由层序遍历与中序遍历唯一确定二叉树

> **手写算例**：
> * 层序遍历：`D A B E F C G H I`
> * 中序遍历：`E A F D H C B G I`

* **递归推导切分过程**：
  1. 层序首元素为 **`D`** $\implies$ **`D` 为整棵树的根节点**；
  2. 在中序中找到 `D`，将序列切分为两半：
     * 左子树中序：`E A F`
     * 右子树中序：`H C B G I`
  3. 在层序中按相对先后顺序提取左右子树节点：
     * 左子树层序：`A E F`（首元素为 `A` $\implies$ `A` 为左子树根，在中序中 `E` 为其左孩子，`F` 为其右孩子）；
     * 右子树层序：`B C G H I`（首元素为 `B` $\implies$ `B` 为右子树根，中序切分为左边 `H C` 和右边 `G I`）；
  4. 递归恢复出整棵完整二叉树结构！

::: tip 💡 核心遍历定理
* **只有中序遍历存在时**，配合先序、后序或层序遍历之一，才能**唯一确定**一棵二叉树！
* **先序 + 后序绝对不能唯一确定二叉树**！但若两节点在先序中顺序与后序中相反（先序 $XY$，后序 $YX$），则必定存在**祖先后代关系**；若相同，则为**兄弟关系**。
:::

---

### 🎮 二叉树核心机理交互式演示系统

> 可以在下方切换「后序 + 中序还原」「先序 + 中序还原」以及「哈夫曼树贪心构建」，通过单步或自动播放直观理解如何通过序列找根切分子树以及哈夫曼树的构建与 WPL 计算全流程！

<TreePlayer />

---

## 🧵 线索二叉树空链域与前驱后继能力

### ❓ 线索二叉树空链域数量分析

* $n$ 个节点的二叉树共有 $2n$ 个指针链域，其中有 $n-1$ 个非空链域指向孩子，剩余 **$n+1$ 个空指针域** 用于线索化：
  * **中序线索二叉树**：首节点的 `lchild`（无前驱）与末节点的 `rchild`（无后继）为空，**空链域为 2 个**；
  * **先序线索二叉树**：仅最后一个节点 `rchild` 为空，**空链域为 1 个**；
  * **后序线索二叉树**：仅第一个节点 `lchild` 为空，**空链域为 1 个**。
::: warning ⚠️ 命题注意
二叉树空链域的某些结论在“只有根节点”的退化二叉树中可能存在边界特例，审题时需注意是否包含空树或单节点树。
:::

---

### ❓ 设立线索二叉树“头结点”的指针回环设计

为了方便如同双向循环链表一样进行双向遍历，可在二叉树线索化时引入一个**头结点**：
* **头结点的标志与指针**：
  * `ltag = 0`，`lchild` 指向二叉树的**根节点**；
  * `rtag = 1`，`rchild` 指向二叉树遍历的**最后一个节点**；
* **首尾节点的回环指向**：
  * 遍历序列的**第一个节点**的 `lchild`（前驱线索）指向该头结点；
  * 遍历序列的**最后一个节点**的 `rchild`（后继线索）同样指向该头结点；
  * 由此构成了一个完整的闭环双向线索结构！

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 带头结点的中序线索二叉树闭环回指架构</span>
    <span class="diagram-badge">P8 手记草图</span>
  </div>
  <svg viewBox="0 0 700 170" width="100%" height="170">
    <g transform="translate(20, 20)">
      <!-- 头结点 -->
      <g transform="translate(190, 0)">
        <rect x="0" y="0" width="180" height="34" fill="rgba(37,99,235,0.12)" stroke="#2563eb" stroke-width="1.8" rx="6"/>
        <text x="30" y="21" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">ltag=0</text>
        <line x1="60" y1="0" x2="60" y2="34" stroke="#2563eb" stroke-width="1.5"/>
        <text x="90" y="21" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="800">头结点</text>
        <line x1="120" y1="0" x2="120" y2="34" stroke="#2563eb" stroke-width="1.5"/>
        <text x="150" y="21" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">rtag=1</text>
      </g>
      <!-- 根节点 Root -->
      <g transform="translate(250, 60)">
        <circle cx="30" cy="18" r="16" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="2"/>
        <text x="30" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12" font-weight="700">Root</text>
      </g>
      <!-- 头结点 lchild 指向根 -->
      <path d="M 220 34 L 270 60" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
      <!-- 第一个节点 First (叶子) -->
      <g transform="translate(110, 100)">
        <circle cx="20" cy="18" r="16" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2"/>
        <text x="20" y="22" text-anchor="middle" fill="#10b981" font-size="11" font-weight="700">首节点</text>
      </g>
      <!-- 最后一个节点 Last (叶子) -->
      <g transform="translate(390, 100)">
        <circle cx="20" cy="18" r="16" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="2"/>
        <text x="20" y="22" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="700">末节点</text>
      </g>
      <!-- 树枝连线 -->
      <line x1="265" y1="74" x2="135" y2="105" stroke="var(--vp-c-text-3)" stroke-width="1.5"/>
      <line x1="295" y1="74" x2="395" y2="105" stroke="var(--vp-c-text-3)" stroke-width="1.5"/>
      <!-- 首节点 lchild 线索回指头结点 -->
      <path d="M 115 105 C 70 80, 80 20, 185 15" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#arrow-green)"/>
      <text x="75" y="45" fill="#10b981" font-size="10.5" font-weight="700">前驱线索回指</text>
      <!-- 头结点 rtag 指向末节点 -->
      <path d="M 340 34 C 365 45, 390 70, 405 95" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
      <text x="375" y="55" fill="#2563eb" font-size="10.5" font-weight="700">指向最后节点</text>
      <!-- 末节点 rchild 线索回指头结点 -->
      <path d="M 425 105 C 475 80, 465 20, 375 15" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#arrow-amber)"/>
      <text x="445" y="45" fill="#f59e0b" font-size="10.5" font-weight="700">后继线索回指</text>
    </g>
    <defs>
      <marker id="arrow-amber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b"/>
      </marker>
    </defs>
  </svg>
</div>

---

### ❓ 前、中、后序线索树找前驱与后继的能力全景

| 线索二叉树类型 | 能否直接利用线索找前驱？ | 能否直接利用线索找后继？ | 考研命题结论与原因 |
| :--- | :---: | :---: | :--- |
| **中序线索二叉树** | ✅ **能** | ✅ **能** | **最优设计**！左右线索完备，无需父节点指针即可实现双向完整中序遍历 |
| **先序线索二叉树** | ❌ **不能** | ✅ **能** | 若某节点是左孩子且其父节点有右孩子，其前驱是左兄弟的最右子树，无法单向寻根 |
| **后序线索二叉树** | ✅ **能** | ❌ **不能** | 若某节点是右孩子或根节点，其后继是父节点，在无三叉链表父指针时无法向上回溯 |

---

## 🌲 树、森林与二叉树转换及遍历映射

### ❓ 树的双亲表示法（顺序表）

```c
typedef struct {
    int data;
    int parent; // 双亲节点在数组中的下标，根节点 parent = -1
} PTNode;

typedef struct {
    PTNode nodes[MaxSize];
    int n;      // 节点数
} PTree;
```

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 树的双亲表示法顺序存储结构</span>
    <span class="diagram-badge">P9 手记草图</span>
  </div>
  <svg viewBox="0 0 700 130" width="100%" height="130">
    <g transform="translate(15, 15)">
      <!-- 树形逻辑结构 -->
      <g transform="translate(30, 10)">
        <circle cx="40" cy="18" r="16" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2"/>
        <text x="40" y="22" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="700">R</text>
        <circle cx="15" cy="65" r="14" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <text x="15" y="69" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="600">A</text>
        <circle cx="65" cy="65" r="14" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <text x="65" y="69" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="600">B</text>
        <line x1="33" y1="32" x2="20" y2="52" stroke="var(--vp-c-text-3)" stroke-width="1.5"/>
        <line x1="47" y1="32" x2="60" y2="52" stroke="var(--vp-c-text-3)" stroke-width="1.5"/>
        <text x="40" y="96" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="11">逻辑树形</text>
      </g>
      <!-- 映射箭头 -->
      <path d="M 140 50 L 190 50" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
      <text x="165" y="40" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="600">顺序表映射</text>
      <!-- 顺序存储表 -->
      <g transform="translate(220, 5)">
        <!-- 表头 -->
        <rect x="0" y="0" width="40" height="24" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="20" y="16" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="11">下标</text>
        <rect x="40" y="0" width="70" height="24" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="75" y="16" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="600">data</text>
        <rect x="110" y="0" width="80" height="24" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="150" y="16" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="600">parent</text>
        <!-- 行 0: R, -1 -->
        <rect x="0" y="24" width="40" height="24" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
        <text x="20" y="40" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="11">0</text>
        <rect x="40" y="24" width="70" height="24" fill="rgba(37,99,235,0.08)" stroke="var(--vp-c-divider)"/>
        <text x="75" y="40" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="700">R</text>
        <rect x="110" y="24" width="80" height="24" fill="rgba(239,68,68,0.08)" stroke="var(--vp-c-divider)"/>
        <text x="150" y="40" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="700">-1 (根)</text>
        <!-- 行 1: A, 0 -->
        <rect x="0" y="48" width="40" height="24" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
        <text x="20" y="64" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="11">1</text>
        <rect x="40" y="48" width="70" height="24" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
        <text x="75" y="64" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12">A</text>
        <rect x="110" y="48" width="80" height="24" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
        <text x="150" y="64" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="600">0</text>
        <!-- 行 2: B, 0 -->
        <rect x="0" y="72" width="40" height="24" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
        <text x="20" y="88" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="11">2</text>
        <rect x="40" y="72" width="70" height="24" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
        <text x="75" y="88" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12">B</text>
        <rect x="110" y="72" width="80" height="24" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
        <text x="150" y="88" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="600">0</text>
      </g>
    </g>
  </svg>
</div>

* **特性与考点**：
  * **找双亲极快**：时间复杂度为 $O(1)$；
  * **找孩子极其不便**：需要遍历整个数组，时间复杂度为 $O(n)$；
  * **节点删除操作耗时对比**：
    * **假删除（惰性标记）**：若将待删除节点的 `parent` 域直接置为 `-2` 标记为已删除，耗时仅需 $\mathbf{O(1)}$；
    * **真删除（物理紧凑）**：若将数组后续元素向前移位填补空缺，则必须同步修改所有节点的 `parent` 下标，时间复杂度为 $\mathbf{O(n)}$。


---

### ❓ 孩子兄弟表示法（二叉链表：左孩子右兄弟）

```c
typedef struct CSNode {
    int data;
    struct CSNode *firstchild; // 指向第一个孩子节点
    struct CSNode *nextsibling; // 指向下一个兄弟节点
} CSNode, *CSTree;
```


::: tip 💡 遍历一一对应黄金法则（408 必背）
* 树的 **先根遍历** $\iff$ 对应二叉树的 **先序遍历**
* 树的 **后根遍历** $\iff$ 对应二叉树的 **中序遍历**
* 森林的 **先序遍历** $\iff$ 对应二叉树的 **先序遍历**
* 森林的 **中序遍历** $\iff$ 对应二叉树的 **中序遍历**
:::

---

## 🗜️ 哈夫曼树与 $m$ 叉哈夫曼树补虚段

### ❓ 哈夫曼树构造法则与性质
* **构造过程**：每次在森林中选取权值最小的两棵二叉树合并，新二叉树根节点权值为两者之和，反复迭代直至剩下一棵树。
* **核心性质**：
  * 哈夫曼树中**不存在度为 1 的节点**（$n_1 = 0$）；
  * 包含 $n_0$ 个叶子节点的哈夫曼树，总节点数为：$$\mathbf{2n_0 - 1}$$
  * 💡 **哈夫曼树形态不唯一，但带权路径长度 (WPL) 绝对唯一**！

---

### ❓ $m$ 叉哈夫曼树补虚段判定公式

> 若严格构造一棵 $m$ 叉哈夫曼树，每次合并必须选 $m$ 个最小节点。

* **虚段判定准则**：
  $$\mathbf{(n_0 - 1) \pmod{m - 1} = 0}$$
* 若余数不为 0，说明最后一轮合并时可选节点不足 $m$ 个，必须**补充权值为 0 的虚叶子节点**，使得补足后的叶子数 $n_0'$ 满足该模方程！

---

## 🤝 并查集 (Union-Find) 结构与两大核心优化

### ❓ 存储结构与数组表示

* 采用双亲表示法（整数数组 `int parent[MaxSize]`）：
  * 普通节点存储其双亲节点的下标；
  * **根节点存储一个负数，其绝对值表示该集合中包含的节点总数**（如 `parent[root] = -5` 表示该树共有 5 个节点）。

---

### ❓ 优化 1：Union 按秩合并（小树挂大树）
* 合并两个集合时，比较两个根节点中记录的节点总数，**将节点数较少的小树作为子树挂接到节点数较多的大树根节点下**；
* 树的高度被严格限制在 $O(\log n)$ 内，防止极端情况下树退化为单链表。

---

### ❓ 优化 2：Find 路径压缩
* 在执行查找根节点的过程中，递归将从当前节点到根节点路径上的**所有祖先节点直接重新挂接在根节点之下**；
* 优化后，多次操作的平摊时间复杂度降低为阿克曼函数的反函数 $\mathbf{O(\alpha(n))}$（近似于常数级 $O(1)$）！


