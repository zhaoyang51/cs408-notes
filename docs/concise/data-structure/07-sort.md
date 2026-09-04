# 第7章 内部排序与外部排序 · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自 408 核心手写笔记 P17~P20，结合《408 简纲 · AI 原生教材》全景深度知识库，涵盖 9 大内部排序算法时空性能大横评、动态多步骤可视化演算、快速排序与冒泡手写实现、堆排序 $O(n)$ 建堆严密证明与 Top-$K$ 选型、外部排序归并趟数与磁盘 I/O 算例、败者树锦标赛单支重赛机制、置换-选择工作区动态冻结流水线、以及最佳归并树 ($2 \times \text{WPL}$) 与虚段补齐定理。

---

## 📊 8 大内部排序算法全维度性能大横评

| 排序算法分类与名称 | 最好时间复杂度 | 最坏时间复杂度 | 平均时间复杂度 | 空间复杂度 | 算法稳定性 | 能否用于链表 | 核心算法思想与特征 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **直接插入排序** | $\mathbf{O(n)}$ | $O(n^2)$ | $O(n^2)$ | $\mathbf{O(1)}$ | ✅ **稳定** | ✅ **能** | 顺序比较寻找插入点，逐个后移；初始基本有序或 $n$ 很小时极快 |
| **折半插入排序** | $O(n \log n)$ | $O(n^2)$ | $O(n^2)$ | $\mathbf{O(1)}$ | ✅ **稳定** | ❌ **不能** | 用二分折半查找插入位置；**比较次数大幅减少，但移动次数完全不变** |
| **希尔排序 (Shell)** | $O(n)$ | $O(n^2)$ | $O(n^{1.3})$ | $\mathbf{O(1)}$ | ❌ **不稳定** | ❌ **不能** | 缩小增量（步长 $d$）分组直接插入排序，最后一趟 $d=1$；跳跃移动导致不稳定 |
| **简单选择排序** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $\mathbf{O(1)}$ | ❌ **不稳定** | ✅ **能** | 每趟从无序区选出最小元素与首位交换；**移动次数极少（$\le 3(n-1)$）** |
| **堆排序 (Heap)** | $O(n \log n)$ | $O(n \log n)$ | $\mathbf{O(n \log n)}$ | $\mathbf{O(1)}$ | ❌ **不稳定** | ❌ **不能** | 完全二叉树大/小顶堆，建堆时间 $O(n)$，堆顶下沉 $O(\log n)$；**原地排序** |
| **冒泡排序** | $\mathbf{O(n)}$ | $O(n^2)$ | $O(n^2)$ | $\mathbf{O(1)}$ | ✅ **稳定** | ✅ **能** | 两两相邻比较逆序则交换；加 `flag` 标志未发生交换可提前终止 |
| **快速排序 (Quick)** | $O(n \log n)$ | $\mathbf{O(n^2)}$ | $\mathbf{O(n \log n)}$ | $\mathbf{O(\log n) \sim O(n)}$ | ❌ **不稳定** | ❌ **不能** | 选枢轴 Partition 分治；**内部排序中平均性能最优的原地划分算法** |
| **二路归并排序** | $O(n \log n)$ | $O(n \log n)$ | $\mathbf{O(n \log n)}$ | $\mathbf{O(n)}$ | ✅ **稳定** | ✅ **能** | 分治合并两有序序列；**必须借用大小为 $n$ 的辅助数组**，非原地排序 |
| **基数排序 (Radix)** | $O(d(n+r))$ | $O(d(n+r))$ | $\mathbf{O(d(n+r))}$ | $O(r)$ | ✅ **稳定** | ✅ **能** | 基于多关键字/数字位的分配与收集，无比较排序；适合 $n$ 大位少（如学号/身份证） |

::: tip 💡 408 核心命题考点速记口诀
* **关键字比较次数与初始序列状态“完全无关”的四大算法**：
  $$\mathbf{简单选择排序、折半插入排序、基数排序、二路归并排序}$$
* **排序趟数与原始状态有关的算法**：
  * **快速排序**：递归树高度取决于划分平衡性（有序或逆序退化为单支树，递归 $n$ 层）。
  * **冒泡排序**：加入 `flag` 标志后，基本有序可提前退场。
* **每趟排序后至少能确定一个元素最终绝对位置的算法**：
  $$\mathbf{简单选择排序（每趟确定极值）、堆排序（每趟堆顶沉底）、冒泡排序（每趟极值冒泡）、快速排序（每趟枢轴落定）}$$
* **空间复杂度高危项**：
  * 二路归并排序：严格占用 $\mathbf{O(n)}$ 辅助数组；
  * 快速排序：递归调用栈空间，最好/平均为 $\mathbf{O(\log_2 n)}$，最坏单支退化为 $\mathbf{O(n)}$。
:::

---

## 🎮 内部排序 9 大算法全流程动态交互演示

> 可以在下方选择任意一种内部排序算法，通过「上一步」「下一步」或「自动播放」观察其指针游走、元素对比、卡片位移、二叉堆树形调整以及基数排序桶分配全流程！

<InternalSortPlayer />

---

## 💻 内部排序经典算法规范手写实现与深度剖析

### 1. 插入排序家族深入剖析

#### (1) 直接插入排序（哨兵机制）
* **哨兵（`A[0]`）的双重作用**：
  1. 作为临时变量暂存待插入的元素；
  2. 作为防止数组下标越界的“警戒哨兵”，避免了在内层 `for` 循环中每次都判断 `j >= 1`，大幅加快底层微指令执行速度。

```c
void insertSort(int a[], int n) {
    int i, j;
    // a[0] 用作哨兵，数组下标 1 ~ n 为实际数据
    for (i = 2; i <= n; i++) {
        if (a[i] < a[i - 1]) {
            a[0] = a[i]; // 放入哨兵
            for (j = i - 1; a[0] < a[j]; j--) {
                a[j + 1] = a[j]; // 元素后移
            }
            a[j + 1] = a[0]; // 插入到合适位置
        }
    }
}
```

#### (2) 折半插入排序（比较与移动解耦）
* **核心机理**：因为前 $i-1$ 个元素已经严格单调有序，因此寻找插入位置无需顺序比对，改用**二分折半查找**（二分判定树）。
* **考研高频陷阱**：
  * **比较次数**：降为 $O(n \log_2 n)$，且与初始状态无关；
  * **移动次数**：并没有减少！找到位置后依然需要将后面的元素整体逐个后移，最坏与平均移动次数依然是 $O(n^2)$。

#### (3) 希尔排序（Shell Sort - 缩小增量排序）
* **算法思想**：取初始步长 $d_1 < n$，将序列分割为 $d_1$ 个子序列分别进行直接插入排序；随后逐步缩小增量（如 $d_{k+1} = \lfloor d_k / 2 \rfloor$），直到最后一趟 $d=1$。
* **为什么快？**：前期 $d$ 较大时每个子序列元素极少，速度极快；后期 $d$ 较小时序列已**基本有序**，直接插入排序在基本有序序列上复杂度逼近 $O(n)$。
* **不稳定性原因**：相同关键字的元素若被分配到不同的增量分组中，跨组跳跃移动会打乱先后的相对位置。

---

### 2. 交换排序家族深度剖析

#### (1) 快速排序（双向挖坑填数法手写模板）

```c
// 划分函数 Partition（双向相向指针挖坑填数）
int partition(int a[], int left, int right) {
    int pivot = a[left]; // 选左端点作为基准，挖出第一个坑
    while (left < right) {
        while (left < right && a[right] >= pivot) right--; // 从右向左找小于 pivot 的数
        a[left] = a[right];                                // 填入左边的坑

        while (left < right && a[left] <= pivot) left++;   // 从左向右找大于 pivot 的数
        a[right] = a[left];                                // 填入右边的坑
    }
    a[left] = pivot;                                       // 基准数填回相遇的最终坑位
    return left;                                           // 返回基准最终绝对位置
}

// 快排递归主体
void quickSort(int a[], int left, int right) {
    if (left < right) {
        int mid = partition(a, left, right);
        quickSort(a, left, mid - 1);
        quickSort(a, mid + 1, right);
    }
}
```

::: warning ⚠️ 快排退化成 $O(n^2)$ 的极坏情形与优化
* **最坏情况诱因**：当原序列**已经正序有序或完全逆序**，且每次固定选取首端点（或末端点）作为基准时，每次划分离基准左右极其不平衡（一边 0 个，一边 $n-1$ 个）。
* **退化结果**：递归树变成一根高度为 $n$ 的单支树，递归栈深度达 $O(n)$，总比较次数达 $n(n-1)/2 \approx O(n^2)$。
* **工程/命题优化手段**：
  1. **三数取中法 (Median-of-Three)**：取 `left`、`right`、`mid` 三者的中位数作为枢轴，避免极值；
  2. **随机选择基准 (Randomized Partition)**；
  3. **小区间阈值切换**：当子序列区间长度 $< 16$ 时，停止快排递归，切换为直接插入排序。
:::

#### (2) 冒泡排序（带 flag 提前退场优化）

```c
void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int flag = 0; // 本趟是否发生逆序交换标志
        for (int j = 1; j < n - i; j++) {
            if (a[j] < a[j - 1]) {
                int temp = a[j];
                a[j] = a[j - 1];
                a[j - 1] = temp;
                flag = 1; // 发生了交换
            }
        }
        if (flag == 0) return; // 本趟扫描未发生任何逆序交换，全数组已有序，直接提前退出！
    }
}
```

---

### 3. 选择排序与堆排序 (Heap Sort) 核心机理

#### (1) 堆排序的数学本质
* 堆是一棵**完全二叉树**的顺序存储结构：
  * 大顶堆：任一节点的值大于等于左右孩子（$L(i) \ge L(2i)$ 且 $L(i) \ge L(2i+1)$），用于**递增升序**排序；
  * 小顶堆：任一节点的值小于等于左右孩子（$L(i) \le L(2i)$ 且 $L(i) \le L(2i+1)$），用于**递减降序**排序。

#### (2) 初始建堆为何是 $O(n)$？（严密级数推导）
很多考生误以为建堆需要插入 $n$ 个节点，每次调整 $\log n$，从而认为是 $O(n \log n)$。**408 严密推导如下**：
* 初始建堆是从最后一个非叶子节点 $\lfloor n/2 \rfloor$ 开始向根节点 1 **自底向上筛选（向下调整）**；
* 深度为 $h$ 的完全二叉树中，第 $i$ 层节点最多有 $2^{i-1}$ 个，这些节点向下调整最多下沉 $h - i$ 层：
  $$T(n) = \sum_{i=1}^{h-1} 2^{i-1} \cdot (h - i) = \sum_{j=1}^{h-1} j \cdot 2^{h - 1 - j} = 2^{h-1} \sum_{j=1}^{h-1} \frac{j}{2^j} < 2^{h-1} \cdot 2 = 2^h = \mathbf{O(n)}$$
* 因此：**建堆时间复杂度严格为 $O(n)$**；只有随后的 $n-1$ 次堆顶元素下沉调整才是每次 $O(\log n)$，因此堆排序总时间为 $\mathbf{O(n \log n)}$。

#### (3) 408 经典应用题：海量数据 Top-$K$ 选型原则
* **题型一：从海量数据（$N \ge 10^8$）中找出最小的前 $K$ 个数**：
  * **选型**：建立容量为 $K$ 的**大顶堆**！
  * **原理**：堆顶存放的是当前这 $K$ 个数中的“最大门槛”。新来一个数，若比堆顶大直接抛弃；若比堆顶小，替换堆顶并向下调整。内存空间极小（只需 $O(K)$），时间只需 $O(N \log K)$。
* **题型二：从海量数据中找出最大的前 $K$ 个数**：
  * **选型**：建立容量为 $K$ 的**小顶堆**！

---

### 4. 基数排序 (Radix Sort) 分配与收集流程

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 基数排序 (LSD) 链式桶分配与收集流水线</span>
    <span class="diagram-badge">P18 手记草图</span>
  </div>
  <svg viewBox="0 0 720 140" width="100%" height="140">
    <g transform="translate(15, 15)">
      <!-- 原始序列 -->
      <text x="0" y="16" fill="var(--vp-c-text-1)" font-size="12" font-weight="700">待排序列 (3位数)：</text>
      <text x="120" y="16" fill="var(--vp-c-brand-1)" font-family="monospace" font-size="12.5" font-weight="700">278, 109, 063, 930, 589, 184, 505, 269, 008, 083</text>
      <!-- 分配到桶 -->
      <g transform="translate(0, 32)">
        <path d="M 60 15 L 105 15" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
        <text x="82" y="8" text-anchor="middle" fill="#2563eb" font-size="10.5" font-weight="600">按个位分配</text>
        <!-- 10个桶的示意 -->
        <g transform="translate(120, 0)">
          <!-- 桶 0 -->
          <rect x="0" y="0" width="45" height="26" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="3"/>
          <text x="22" y="13" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="9.5">桶0</text>
          <text x="22" y="23" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10" font-weight="600">930</text>
          <!-- 桶 3 -->
          <rect x="55" y="0" width="65" height="26" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="3"/>
          <text x="87" y="13" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="9.5">桶3</text>
          <text x="87" y="23" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10" font-weight="600">063➔083</text>
          <!-- 桶 4 -->
          <rect x="130" y="0" width="45" height="26" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="3"/>
          <text x="152" y="13" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="9.5">桶4</text>
          <text x="152" y="23" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10" font-weight="600">184</text>
          <!-- 桶 5 -->
          <rect x="185" y="0" width="45" height="26" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="3"/>
          <text x="207" y="13" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="9.5">桶5</text>
          <text x="207" y="23" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10" font-weight="600">505</text>
          <!-- 桶 8 -->
          <rect x="240" y="0" width="65" height="26" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="3"/>
          <text x="272" y="13" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="9.5">桶8</text>
          <text x="272" y="23" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10" font-weight="600">278➔008</text>
          <!-- 桶 9 -->
          <rect x="315" y="0" width="85" height="26" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="3"/>
          <text x="357" y="13" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="9.5">桶9</text>
          <text x="357" y="23" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10" font-weight="600">109➔589➔269</text>
        </g>
      </g>
      <!-- 收集成链 -->
      <g transform="translate(0, 75)">
        <path d="M 60 15 L 105 15" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
        <text x="82" y="8" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="600">首尾收集</text>
        <rect x="120" y="0" width="460" height="28" fill="rgba(16,185,129,0.08)" stroke="#10b981" rx="4"/>
        <text x="350" y="18" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="11.5" font-weight="700">930 ➔ 063 ➔ 083 ➔ 184 ➔ 505 ➔ 278 ➔ 008 ➔ 109 ➔ 589 ➔ 269</text>
      </g>
    </g>
  </svg>
</div>

* **关键流程**：采用最低位优先 (LSD)，依次根据个位、十位、百位进行 $d$ 趟“分配入 10 个链队列”与“按队列先后次序收集”；
* **为什么基数排序必须保持稳定性？**：若低位分配收集后不稳定，下一趟按高位排序时就会彻底摧毁低位好不容易建立的先后序！

---

## 🗄️ 外部排序核心机理与磁盘 I/O 计算

### 1. 外部排序核心瓶颈分析
在海量文件排序时，整个待排文件远超内存容量，必须放在外存（磁盘）中。
* **时间开销三巨头**：
  $$\text{外部排序总时间} = \text{内部内存排序时间} + \mathbf{外存信息读写 I/O 时间} + \text{内部归并时间}$$
* 其中**磁盘 I/O 耗时占据了 90% 以上**，因此外部排序优化的首要目标就是**极力压缩读写磁盘的次数**！

---

### 2. 归并趟数与 I/O 次数大题推导公式

> [!IMPORTANT]
> **外部排序基本定理公式**：
> * 设待排文件总块数为 **$N$**；
> * 生成的初始归并段数为 **$m$**，采用 **$k$ 路平衡归并**；
> * **归并趟数公式**：
>   $$\mathbf{S = \lceil \log_k m \rceil}$$
> * 在初始归并段生成阶段，整个文件读入 1 遍、排好序写出 1 遍，共需 **$2N$ 次 I/O**；
> * 在归并阶段，每趟归并都需要把全部 $N$ 块数据读入内存并在合并后写回磁盘，每趟共 **$2N$ 次 I/O**；
> * **总读写 I/O 次数公式**：
>   $$\mathbf{\text{总 I/O 读写次数} = 2N + 2N \cdot S = 2N \cdot (1 + \lceil \log_k m \rceil)}$$

#### 408 典型算例对比：设初始段 $m = 10$，文件总块数 $N = 50$ 块（每趟读写各 50 次，共 100 次 I/O）
* **2 路归并**：$S = \lceil \log_2 10 \rceil = 4$ 趟 $\implies 100 + 4 \times 100 = \mathbf{500\text{ 次 I/O}}$；
* **3 路归并**：$S = \lceil \log_3 10 \rceil = 3$ 趟 $\implies 100 + 3 \times 100 = \mathbf{400\text{ 次 I/O}}$；
* **6 路归并**：$S = \lceil \log_6 10 \rceil = 2$ 趟 $\implies 100 + 2 \times 100 = \mathbf{300\text{ 次 I/O}}$。

**结论**：想要减少归并趟数 $S$，要么**增大归并路数 $k$**（由此催生了**败者树**），要么**减少初始归并段数 $m$**（由此催生了**置换-选择排序**）！

---

## 🌲 外部排序核心机理交互式演示系统

> 点击切换体验「败者树沿单一向上分支重赛」与「置换-选择排序工作区动态冻结流水线」，直观掌握 408 外部排序最常考的两个核心机理！

<ExternalSortPlayer />

---

## 🏆 败者树 (Loser Tree) 锦标赛淘汰机理

### 1. 为什么用败者树而不是胜者树？
* **传统 $k$ 路归并选最小**：每输出一个元素，在 $k$ 个数中选最小需要 $k - 1$ 次内部比较。当路数 $k$ 增大到 16、32 时，CPU 内部比较开销急剧攀升；
* **败者树与胜者树对比**：
  * **胜者树**：非叶子节点记录“胜者”。当新元素填入叶子重赛时，必须同时访问**双亲节点**和**兄弟节点**，重赛指针寻址复杂；
  * **败者树**：非叶子节点记录**“败者”（较大者）的段号**，树顶上方独立设立一个 $ls[0]$ 记录**全局最终胜者**。
  * **单支向上重赛**：新元素填入叶子后，沿单一父节点路径向上走，只需直接与父节点里记录的败者进行比对！
    $$\mathbf{每次决出新胜者仅需 \lceil \log_2 k \rceil 次比较！}$$

### 2. 5 路平衡归并败者树拓扑手绘图

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 5 路平衡归并败者树拓扑结构</span>
    <span class="diagram-badge">P19 手记草图</span>
  </div>
  <svg viewBox="0 0 700 200" width="100%" height="200">
    <g transform="translate(15, 15)">
      <!-- 根上方冠军 ls[0] -->
      <g transform="translate(320, 10)">
        <rect x="0" y="0" width="70" height="26" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="2" rx="4"/>
        <text x="35" y="17" text-anchor="middle" fill="#10b981" font-size="11" font-weight="800">ls[0]=3 (胜)</text>
        <text x="120" y="17" fill="#10b981" font-size="11" font-weight="700">🏆 最终全局胜者 (段3: 值为6)</text>
      </g>
      <line x1="355" y1="36" x2="355" y2="55" stroke="#10b981" stroke-width="2"/>
      <!-- 内部败者节点第 1 层 ls[1] -->
      <g transform="translate(330, 55)">
        <circle cx="25" cy="12" r="13" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <text x="25" y="16" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">ls[1]: 1</text>
      </g>
      <!-- 内部败者节点第 2 层 ls[2], ls[3] -->
      <g transform="translate(200, 95)">
        <circle cx="25" cy="12" r="13" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <text x="25" y="16" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">ls[2]: 0</text>
      </g>
      <g transform="translate(460, 95)">
        <circle cx="25" cy="12" r="13" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <text x="25" y="16" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">ls[3]: 4</text>
      </g>
      <line x1="345" y1="72" x2="235" y2="95" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
      <line x1="365" y1="72" x2="475" y2="95" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
      <!-- 内部败者节点第 3 层 ls[4] -->
      <g transform="translate(390, 130)">
        <circle cx="25" cy="12" r="13" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
        <text x="25" y="16" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">ls[4]: 2</text>
      </g>
      <line x1="475" y1="112" x2="425" y2="130" stroke="var(--vp-c-divider)" stroke-width="1.5"/>
      <!-- 叶子节点：5 个归并段首元素 -->
      <g transform="translate(100, 155)">
        <!-- b[0] -->
        <rect x="30" y="0" width="60" height="24" fill="rgba(37,99,235,0.08)" stroke="#2563eb" rx="3"/>
        <text x="60" y="16" text-anchor="middle" fill="#2563eb" font-size="10.5" font-weight="600">b[0]=10</text>
        <!-- b[1] -->
        <rect x="110" y="0" width="60" height="24" fill="rgba(37,99,235,0.08)" stroke="#2563eb" rx="3"/>
        <text x="140" y="16" text-anchor="middle" fill="#2563eb" font-size="10.5" font-weight="600">b[1]=9</text>
        <!-- b[2] -->
        <rect x="220" y="0" width="60" height="24" fill="rgba(37,99,235,0.08)" stroke="#2563eb" rx="3"/>
        <text x="250" y="16" text-anchor="middle" fill="#2563eb" font-size="10.5" font-weight="600">b[2]=20</text>
        <!-- b[3] -->
        <rect x="300" y="0" width="60" height="24" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="2" rx="3"/>
        <text x="330" y="16" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="800">b[3]=6 ★</text>
        <!-- b[4] -->
        <rect x="380" y="0" width="60" height="24" fill="rgba(37,99,235,0.08)" stroke="#2563eb" rx="3"/>
        <text x="410" y="16" text-anchor="middle" fill="#2563eb" font-size="10.5" font-weight="600">b[4]=12</text>
      </g>
    </g>
  </svg>
</div>

---

## ❄️ 置换-选择排序 (Replacement-Selection Sort)

### 1. 突破内存限制的核心机制
如果仅在内存中用普通内部排序产生初始归并段，归并段的长度受限于内存工作区容量 $w$（段长只能固定为 $w$）。
* **置换-选择排序**利用流水线思想：
  1. 选出工作区未冻结的最小值 $\text{MIN}$，输出到当前初始归并段；
  2. 从输入流读入下一个记录填入该槽位；
  3. **冻结判定**：若新读入的值 $< \text{MIN}$，无法保持当前段单调递增，给该槽位打上**冻结标记 ❄️**（归入下一段），不参与本段后续竞争；若新读入值 $\ge \text{MIN}$，则继续参与本段竞争；
  4. 当**工作区所有槽位全部被冻结**时，宣告当前归并段结束；全部解除冻结，开启下一归并段！

### 2. 408 经典结论与真题题型
* **段长统计特性**：生成的各归并段长度不等，但在随机分布输入下，**初始归并段的平均长度约为 $2w$**！
* **带来的收益**：相比传统固定段长，初始归并段总数 $m$ 直接砍半，大大缩减归并趟数与磁盘读写总量！

---

## 🌳 最佳归并树 (Best Merge Tree) 与虚段补齐定理

### 1. $k$ 叉哈夫曼树模型
在多路平衡归并中，每个初始归并段所包含的**物理块数（或记录数）往往是不相等的**。
* 如果随意选择归并次序，每次合并大段都会产生巨量 I/O；
* **最佳归并策略**：将每个初始归并段的块数作为**叶子节点的权值**，构造一棵**带权路径长度 WPL 最小的 $k$ 叉哈夫曼树**！

### 2. ⚠️ 408 最易失分点：I/O 读写必乘 2
在最佳归并树中：
* 叶子节点表示初始归并段；
* 非叶子节点表示一次归并操作；
* 结点的带权路径长度 $\text{WPL} = \sum w_i \cdot l_i$；
* ⚠️ **重要考点**：
  $$\mathbf{\text{归并过程的总 I/O 读写次数} = 2 \times \text{WPL}}$$
  *(因为每一次两两或三三归并，既要把各段数据读入内存（1 次 I/O），又要把合并后的结果写回磁盘（1 次 I/O），每段必须读写各 1 次，因此是 $2 \times \text{WPL}$！)*

---

### 3. 严格虚段补齐判定法则
对于严格的 $k$ 叉树，若只有度为 0 的叶子节点（设为 $n_0$ 个）和度为 $k$ 的内部节点（设为 $n_k$ 个），由树的度数定理：
$$n_0 = (k - 1) n_k + 1 \implies \mathbf{(n_0 - 1) \pmod{k - 1} = 0}$$

* **若 $(n_0 - 1) \pmod{k - 1} \ne 0$**：
  说明现有的初始归并段无法刚好拼成一棵满 $k$ 叉树，必须**添加权值为 0 的“虚段”**！
* **补虚段个数计算公式**：
  $$\mathbf{u = (k - 1) - [(n_0 - 1) \pmod{k - 1}]}$$

#### 408 经典例题：
现有 8 个初始归并段，块数分别为 `[9, 30, 12, 18, 3, 17, 2, 6]`，拟采用 **3 路平衡归并**：
* 这里 $n_0 = 8, k = 3$；
* 检查：$(8 - 1) \pmod{(3 - 1)} = 7 \pmod 2 = 1 \ne 0$！
* 需要补虚段数：$u = (3 - 1) - 1 = \mathbf{1\text{ 个虚段}}$（权值为 0）；
* 补入 0 后叶子集合为 `[0, 2, 3, 6, 9, 12, 17, 18, 30]`，每次贪心选取权值最小的 3 个节点合并，最终得出唯一且最优的 3 叉哈夫曼归并树！
