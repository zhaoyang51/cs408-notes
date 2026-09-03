# 第5章 图论算法与应用 · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P10~P13，涵盖四大图存储结构全景性能横评（邻接矩阵/邻接表/十字链表/邻接多重表）、DFS 递归手写实现、最小生成树双算法（Prim 选点 vs Kruskal 选边并查集）、三大最短路径算法适用性判定矩阵（BFS / Dijkstra / Floyd）、拓扑排序有向环检测、以及 AOE 关键路径（$ve, vl, e, l$）推导。

---

## 🗺️ 图的四大存储结构全景大横评

### ❓ 四大图存储结构定义与适用场景

1. **邻接矩阵 (Adjacency Matrix)**：
   * 二维数组 `edge[MaxSize][MaxSize]`，无向图对称，有向网中 `INF` 表示不连通，`0` 表示自身。
2. **邻接表 (Adjacency List)**：
   * 顶点表数组包含 `[ data | firstArc ]`，边表单链表包含 `[ destNode | val | nextArc ]`。
3. **十字链表 (Orthogonal List，面向有向图)**：
# 第5章 图论算法与应用 · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P10~P13，涵盖四大图存储结构全景性能横评（邻接矩阵/邻接表/十字链表/邻接多重表）、DFS 递归手写实现、最小生成树双算法（Prim 选点 vs Kruskal 选边并查集）、三大最短路径算法适用性判定矩阵（BFS / Dijkstra / Floyd）、拓扑排序有向环检测、以及 AOE 关键路径（$ve, vl, e, l$）推导。

---

## 🗺️ 图的四大存储结构全景大横评

### ❓ 四大图存储结构定义与适用场景

1. **邻接矩阵 (Adjacency Matrix)**：
   * 二维数组 `edge[MaxSize][MaxSize]`，无向图对称，有向网中 `INF` 表示不连通，`0` 表示自身。
2. **邻接表 (Adjacency List)**：
   * 顶点表数组包含 `[ data | firstArc ]`，边表单链表包含 `[ destNode | val | nextArc ]`。
3. **十字链表 (Orthogonal List，面向有向图)**：
   * 弧节点包含：`[ tailvex (弧尾) | headvex (弧头) | hlink (同弧头入边) | tlink (同弧尾出边) | info ]`；
   * 极易同时求出顶点的入度和出度。
4. **邻接多重表 (Adjacency Multilist，面向无向图)**：
   * 边节点包含：`[ ivex | ilink | jvex | jlink | info ]`；
   * 一条无向边只用一个节点表示，删除边和顶点极其简便。

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 十字链表（有向图）与邻接多重表（无向图）节点架构</span>
    <span class="diagram-badge">P10 手记草图</span>
  </div>
  <svg viewBox="0 0 720 160" width="100%" height="160">
    <!-- 十字链表节点架构 -->
    <g transform="translate(15, 15)">
      <text x="0" y="16" fill="#2563eb" font-size="12" font-weight="700">① 十字链表 (有向图 · 双向链域)</text>
      <!-- 顶点表结点 -->
      <g transform="translate(0, 28)">
        <rect x="0" y="0" width="50" height="24" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="25" y="16" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">data</text>
        <rect x="50" y="0" width="60" height="24" fill="rgba(16,185,129,0.12)" stroke="#10b981"/>
        <text x="80" y="16" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="700">firstin 入</text>
        <rect x="110" y="0" width="60" height="24" fill="rgba(37,99,235,0.12)" stroke="#2563eb"/>
        <text x="140" y="16" text-anchor="middle" fill="#2563eb" font-size="10.5" font-weight="700">firstout 出</text>
        <text x="180" y="16" fill="var(--vp-c-text-3)" font-size="10.5">顶点结点</text>
      </g>
      <!-- 弧结点 -->
      <g transform="translate(0, 68)">
        <rect x="0" y="0" width="60" height="26" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="30" y="17" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10">tailvex(尾)</text>
        <rect x="60" y="0" width="60" height="26" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="90" y="17" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10">headvex(头)</text>
        <rect x="120" y="0" width="70" height="26" fill="rgba(16,185,129,0.12)" stroke="#10b981"/>
        <text x="155" y="17" text-anchor="middle" fill="#10b981" font-size="10" font-weight="700">hlink (同头)</text>
        <rect x="190" y="0" width="70" height="26" fill="rgba(37,99,235,0.12)" stroke="#2563eb"/>
        <text x="225" y="17" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="700">tlink (同尾)</text>
        <text x="270" y="18" fill="var(--vp-c-text-3)" font-size="10.5">弧结点</text>
      </g>
    </g>
    <!-- 邻接多重表节点架构 -->
    <g transform="translate(380, 15)">
      <text x="0" y="16" fill="#10b981" font-size="12" font-weight="700">② 邻接多重表 (无向图 · 边只存一次)</text>
      <!-- 顶点表结点 -->
      <g transform="translate(0, 28)">
        <rect x="0" y="0" width="60" height="24" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="30" y="16" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">data</text>
        <rect x="60" y="0" width="80" height="24" fill="rgba(16,185,129,0.12)" stroke="#10b981"/>
        <text x="100" y="16" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="700">firstedge 边</text>
        <text x="150" y="16" fill="var(--vp-c-text-3)" font-size="10.5">顶点结点</text>
      </g>
      <!-- 边结点 -->
      <g transform="translate(0, 68)">
        <rect x="0" y="0" width="45" height="26" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="22" y="17" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10">mark</text>
        <rect x="45" y="0" width="55" height="26" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="72" y="17" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">ivex</text>
        <rect x="100" y="0" width="65" height="26" fill="rgba(37,99,235,0.1)" stroke="#2563eb"/>
        <text x="132" y="17" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="700">ilink</text>
        <rect x="165" y="0" width="55" height="26" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="192" y="17" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">jvex</text>
        <rect x="220" y="0" width="65" height="26" fill="rgba(16,185,129,0.1)" stroke="#10b981"/>
        <text x="252" y="17" text-anchor="middle" fill="#10b981" font-size="10" font-weight="700">jlink</text>
        <text x="295" y="18" fill="var(--vp-c-text-3)" font-size="10.5">边结点</text>
      </g>
    </g>
  </svg>
</div>

---

### ❓ 性能与适用场景横向对比表

| 对比维度 | 邻接矩阵 | 邻接表 | 十字链表 | 邻接多重表 |
| :--- | :---: | :---: | :---: | :---: |
| **空间复杂度** | $\mathbf{O(n^2)}$ | $O(n + e)$ 或 $O(n + 2e)$ | $O(n + e)$ | $O(n + e)$ |
| **找某顶点的相邻边** | $O(n)$ | $O(n)$ (平均为度数) | $O(n)$ | $O(n)$ |
| **判定两点间边是否存在** | $\mathbf{O(1)}$ | $O(n)$ | $O(n)$ | $O(n)$ |
| **删除一条边或顶点** | 困难（需移位或清零） | 困难（需遍历删除对应边节点） | **容易** | **容易** |
| **最适用图类型** | **稠密图** | **稀疏图** | **有向图** | **无向图** |

---

## 🚶 图的深度优先遍历 (DFS) 递归代码

```c
int visited[MaxSize]; // 访问标记数组

void DFS(AGraph &G, int v) {
    visited[v] = 1;   // 1. 标记当前顶点已访问
    visit(v);         // 2. 访问当前顶点

    // 3. 遍历当前顶点的所有邻接边
    for (Arc *p = G.nodes[v].firstArc; p != NULL; p = p->nextArc) {
        int w = p->destNode;
        if (!visited[w]) {
            DFS(G, w); // 递归访问未曾探索的邻接顶点
        }
    }
}
```

---

## 🌳 最小生成树 (MST)：Prim vs Kruskal

| 对比维度 | 普里姆算法 (Prim) | 克鲁斯卡尔算法 (Kruskal) |
| :--- | :--- | :--- |
| **核心策略** | **“选点法”**（从一个顶点出发，贪心向外扩张） | **“选边法”**（将所有边排序，贪心挑选最短边） |
| **算法执行** | 维护未并入顶点的最短距离数组 `dist[]`，每轮挑最小值并入，更新其他点距离 | 每次取权值最小的边，利用 **并查集 (Union-Find)** 判断两端点是否在同一连通分量 |
| **时间复杂度** | $\mathbf{O(n^2)}$（适合**稠密图**） | $\mathbf{O(e \log e)}$（适合**稀疏图**） |
| **环路检测机制** | 天然基于树生成，无需显式判环 | 必须借助**并查集的 Find 操作判环** |

---

## 🛣️ 三大最短路径算法适用性判定矩阵

| 算法名称 | 算法思想与复杂度 | 适用图类型 | 带权正边 | 允许带负权边 | 允许负权回路 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **广度优先搜索 (BFS)** | 队列层序遍历，$O(n + e)$ | 单源无权图 | ❌ | ❌ | ❌ |
| **迪杰斯特拉 (Dijkstra)** | 贪心扩展单源最短路，$\mathbf{O(n^2)}$ | 单源有权图 | ✅ | ❌ **绝对禁止！** | ❌ |
| **弗洛伊德 (Floyd)** | 动态规划三重循环，$\mathbf{O(n^3)}$ | 多源任意图 | ✅ | ✅ **允许（无负环）** | ❌ |

::: tip 💡 Floyd 算法核心状态转移
```c
for (int k = 0; k < n; k++)           // 外层枚举中转顶点 k
    for (int i = 0; i < n; i++)       // 内层枚举起点 i
        for (int j = 0; j < n; j++)   // 内层枚举终点 j
            if (dist[i][j] > dist[i][k] + dist[k][j]) {
                dist[i][j] = dist[i][k] + dist[k][j];
                path[i][j] = k;
            }
```
:::

---

## 🔀 拓扑排序 (AOV 网) 判环算法

1. **统计入度**：遍历整张图，计算每个顶点的入度并记录于 `inDegree[]`；
2. **入度为 0 进栈/队列**：将所有 `inDegree[i] == 0` 的顶点压入暂存栈或队列中；
3. **循环输出与消边**：
   * 弹出栈顶顶点 $u$ 并输出计数；
   * 遍历 $u$ 的所有出边 $(u, v)$，将终点入度减 1（`inDegree[v]--`）；
   * 若 `inDegree[v] == 0`，将 $v$ 压入栈中；
4. **环路判定**：
   * **若输出顶点总数等于 $n$，则拓扑排序成功，图中无环（DAG）**；
   * **若输出顶点总数小于 $n$，说明图中存在有向回路（环）**！

---

## ⏱️ 关键路径 (AOE 网) 求解全流程

> **基本概念**：事件为顶点（代表阶段完成），活动为带权弧（代表具体耗时工作）。

1. **事件最早发生时间 $ve(k)$（顺推取最大值）**：
   * 从源点开始顺推，$ve(\text{源点}) = 0$；
   * $$ve(j) = \max_{i} \{ ve(i) + \text{weight}(i, j) \}$$
2. **事件最迟发生时间 $vl(k)$（逆推取最小值）**：
   * 从汇点开始逆推，$vl(\text{汇点}) = ve(\text{汇点})$；
   * $$vl(i) = \min_{j} \{ vl(j) - \text{weight}(i, j) \}$$
3. **活动最早开始时间 $e(i)$ 与最晚开始时间 $l(i)$**：
   * 设活动 $a_k$ 对应弧 $\langle u, v \rangle$，耗时为 $W$：
   * $$e(k) = ve(u)$$
   * $$l(k) = vl(v) - W$$
4. **时间余量与关键活动判定**：
   * 时间余量：$$d(k) = l(k) - e(k)$$
   * **凡是 $d(k) == 0$（最早开始时间等于最晚开始时间）的活动即为关键活动**！
   * 从源点到汇点由关键活动连接而成的路径即为 **关键路径（耗时最长路径）**。

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · AOE 关键路径工程网络与 ve/vl 动态推导</span>
    <span class="diagram-badge">P13 手记草图</span>
  </div>
  <svg viewBox="0 0 720 230" width="100%" height="230">
    <g transform="translate(20, 20)">
      <!-- 节点 V1 (源点) -->
      <g transform="translate(30, 95)">
        <circle cx="0" cy="0" r="18" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2"/>
        <text x="0" y="4" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="700">V1</text>
        <text x="0" y="-24" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10.5">ve=0 | vl=0</text>
      </g>
      <!-- 节点 V2 (上) -->
      <g transform="translate(180, 35)">
        <circle cx="0" cy="0" r="18" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="2.5"/>
        <text x="0" y="4" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="800">V2</text>
        <text x="0" y="-24" text-anchor="middle" fill="#ef4444" font-size="10.5" font-weight="700">ve=3 | vl=3</text>
      </g>
      <!-- 节点 V3 (下) -->
      <g transform="translate(180, 155)">
        <circle cx="0" cy="0" r="18" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="2.5"/>
        <text x="0" y="4" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="800">V3</text>
        <text x="0" y="30" text-anchor="middle" fill="#ef4444" font-size="10.5" font-weight="700">ve=2 | vl=2</text>
      </g>
      <!-- 节点 V4 (中下) -->
      <g transform="translate(360, 155)">
        <circle cx="0" cy="0" r="18" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="2.5"/>
        <text x="0" y="4" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="800">V4</text>
        <text x="0" y="30" text-anchor="middle" fill="#ef4444" font-size="10.5" font-weight="700">ve=6 | vl=6</text>
      </g>
      <!-- 节点 V5 (中上) -->
      <g transform="translate(360, 35)">
        <circle cx="0" cy="0" r="18" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="2.5"/>
        <text x="0" y="4" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="800">V5</text>
        <text x="0" y="-24" text-anchor="middle" fill="#ef4444" font-size="10.5" font-weight="700">ve=6 | vl=6</text>
      </g>
      <!-- 节点 V6 (汇点) -->
      <g transform="translate(510, 95)">
        <circle cx="0" cy="0" r="18" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2.5"/>
        <text x="0" y="4" text-anchor="middle" fill="#10b981" font-size="12" font-weight="800">V6</text>
        <text x="0" y="-24" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="700">ve=8 | vl=8</text>
      </g>
      <!-- 连线与权值 -->
      <!-- V1 -> V2: 3 (关键) -->
      <line x1="45" y1="83" x2="165" y2="43" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red)"/>
      <text x="95" y="55" fill="#ef4444" font-size="11" font-weight="700">a1: 3 ★</text>
      <!-- V1 -> V3: 2 (关键) -->
      <line x1="45" y1="107" x2="165" y2="147" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red)"/>
      <text x="95" y="142" fill="#ef4444" font-size="11" font-weight="700">a2: 2 ★</text>
      <!-- V2 -> V4: 2 -->
      <line x1="195" y1="45" x2="345" y2="145" stroke="var(--vp-c-text-3)" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arrow-gray)"/>
      <text x="260" y="85" fill="var(--vp-c-text-3)" font-size="10.5">a3: 2</text>
      <!-- V2 -> V5: 3 (关键) -->
      <line x1="198" y1="35" x2="342" y2="35" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red)"/>
      <text x="270" y="27" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">a4: 3 ★</text>
      <!-- V3 -> V4: 4 (关键) -->
      <line x1="198" y1="155" x2="342" y2="155" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red)"/>
      <text x="270" y="147" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">a5: 4 ★</text>
      <!-- V3 -> V6: 3 -->
      <path d="M 195 165 C 320 210, 430 170, 495 107" fill="none" stroke="var(--vp-c-text-3)" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arrow-gray)"/>
      <text x="350" y="195" fill="var(--vp-c-text-3)" font-size="10.5">a6: 3</text>
      <!-- V4 -> V6: 2 (关键) -->
      <line x1="375" y1="147" x2="495" y2="107" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red)"/>
      <text x="445" y="142" fill="#ef4444" font-size="11" font-weight="700">a7: 2 ★</text>
      <!-- V5 -> V6: 2 (关键) -->
      <line x1="375" y1="43" x2="495" y2="83" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red)"/>
      <text x="445" y="55" fill="#ef4444" font-size="11" font-weight="700">a8: 2 ★</text>
      <!-- 右侧图例卡片 -->
      <g transform="translate(560, 25)">
        <rect x="0" y="0" width="120" height="150" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="8"/>
        <text x="60" y="20" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="700">关键路径结论</text>
        <line x1="10" y1="28" x2="110" y2="28" stroke="var(--vp-c-divider)"/>
        <text x="10" y="48" fill="#ef4444" font-size="10.5" font-weight="700">路径 1 (长=8):</text>
        <text x="10" y="66" fill="var(--vp-c-text-2)" font-size="10">V1➔V2➔V5➔V6</text>
        <text x="10" y="90" fill="#ef4444" font-size="10.5" font-weight="700">路径 2 (长=8):</text>
        <text x="10" y="108" fill="var(--vp-c-text-2)" font-size="10">V1➔V3➔V4➔V6</text>
        <text x="10" y="132" fill="#10b981" font-size="10" font-weight="600">双关键路径并存!</text>
      </g>
    </g>
  </svg>
</div>
