# 第7章 内部排序与外部排序 · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P17~P20，涵盖 8 大内部排序算法全维度时空性能大横评、快速排序与冒泡排序手写代码、基数排序分配与收集推导、堆排序建堆与调堆机理、外部排序归并趟数与 I/O 算例、败者树原理、置换-选择排序、以及最佳归并树 (WPL $\times 2$) 核心考点。

---

## 📊 8 大内部排序算法全维度性能大横评

| 排序算法分类与名称 | 最好时间复杂度 | 最坏时间复杂度 | 平均时间复杂度 | 空间复杂度 | 算法稳定性 | 能否用于链表 | 核心算法思想与特征 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **直接插入排序** | $\mathbf{O(n)}$ | $O(n^2)$ | $O(n^2)$ | $\mathbf{O(1)}$ | ✅ **稳定** | ✅ **能** | 顺序比较寻找插入点，逐个后移；初始基本有序时极快 |
| **折半插入排序** | $O(n \log n)$ | $O(n^2)$ | $O(n^2)$ | $\mathbf{O(1)}$ | ✅ **稳定** | ❌ **不能** | 用二分折半查找插入位置；**比较次数大幅减少，但移动次数完全不变** |
| **希尔排序 (Shell)** | $O(n)$ | $O(n^2)$ | $O(n^{1.3})$ | $\mathbf{O(1)}$ | ❌ **不稳定** | ❌ **不能** | 缩小增量（步长 $d$）分组直接插入排序，最后一趟 $d=1$ |
| **简单选择排序** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $\mathbf{O(1)}$ | ❌ **不稳定** | ✅ **能** | 每趟从无序区选出最小元素与无序区首位交换；**移动次数极少** |
| **堆排序 (Heap)** | $O(n \log n)$ | $O(n \log n)$ | $\mathbf{O(n \log n)}$ | $\mathbf{O(1)}$ | ❌ **不稳定** | ❌ **不能** | 完全二叉树大/小顶堆，堆顶与末尾交换后下沉；**原地排序** |
| **冒泡排序** | $\mathbf{O(n)}$ | $O(n^2)$ | $O(n^2)$ | $\mathbf{O(1)}$ | ✅ **稳定** | ✅ **能** | 两两相邻比较逆序则交换；加 `flag` 标志未发生交换可提前终止 |
| **快速排序 (Quick)** | $O(n \log n)$ | $\mathbf{O(n^2)}$ | $\mathbf{O(n \log n)}$ | $\mathbf{O(\log n) \sim O(n)}$ | ❌ **不稳定** | ❌ **不能** | 选枢轴 Partition 分治；**内部排序中平均性能最优的算法** |
| **二路归并排序** | $O(n \log n)$ | $O(n \log n)$ | $\mathbf{O(n \log n)}$ | $\mathbf{O(n)}$ | ✅ **稳定** | ✅ **能** | 分治合并两有序序列；**必须借用大小为 $n$ 的辅助数组** |
| **基数排序 (Radix)** | $O(d(n+r))$ | $O(d(n+r))$ | $\mathbf{O(d(n+r))}$ | $O(r)$ | ✅ **稳定** | ✅ **能** | 基于关键字位桶分配与收集，无比较排序；适合 $n$ 大位少的场景 |

::: tip 💡 408 核心命题考点速记
* **关键字比较次数与初始序列状态“完全无关”的四大算法**：
  $$\mathbf{简单选择排序、折半插入排序、基数排序、二路归并排序}$$
* **排序趟数与原始状态有关的算法**：**快速排序**（递归树高度取决于划分平衡性）、**冒泡排序**（有序提前退场）。
* **每趟排序至少确定一个元素最终绝对位置的算法**：**简单选择排序、堆排序、冒泡排序、快速排序**。
:::

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

---

## 💻 经典排序算法规范手写实现

### ❓ 1. 快速排序（双向挖坑填数法）

```c
// 划分函数 Partition
int partition(int a[], int left, int right) {
    int pivot = a[left]; // 选左端点作为基准，挖出第一个坑
    while (left < right) {
        while (left < right && a[right] >= pivot) right--; // 从右向左找小于 pivot 的数
        a[left] = a[right];                                // 填入左边的坑

        while (left < right && a[left] <= pivot) left++;   // 从左向右找大于 pivot 的数
        a[right] = a[left];                                // 填入右边的坑
    }
    a[left] = pivot;                                       // 基准数填回相遇的坑位
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

---

### ❓ 2. 冒泡排序（带 flag 提前退场优化）

```c
void bubbleSort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int flag = 0; // 本趟是否发生交换标志
        for (int j = 1; j < n - i; j++) {
            if (a[j] < a[j - 1]) {
                int temp = a[j];
                a[j] = a[j - 1];
                a[j - 1] = temp;
                flag = 1;
            }
        }
        if (flag == 0) return; // 本趟未发生任何逆序交换，数组已有序，直接退出
    }
}
```

---

## 🏔️ 堆排序 (Heap Sort) 建堆与维护

1. **初始建堆（从下往上筛选，时间复杂度 $\mathbf{O(n)}$）**：
   * 顺序存储下，从最后一个非叶子节点 $\lfloor n/2 \rfloor$ 开始倒序遍历至根节点 1；
   * 对每个非叶节点执行**向下调整 (Sift Down)**，与左右较大孩子交换并递归下沉。
2. **插入元素（$\mathbf{O(\log n)}$）**：
   * 将新元素放在数组末尾，执行**向上调整 (Sift Up)**，不断与父节点比较上浮。
3. **删除堆顶元素（$\mathbf{O(\log n)}$）**：
   * 将堆底最后一个元素覆盖堆顶，堆大小减 1，对新堆顶执行**向下调整**。

---

## 🗄️ 外部排序、归并趟数与 I/O 计算

### ❓ 外部排序 I/O 次数大题推导

> **基本定理公式**：
> * 设初始归并段数为 **$m$**，采用 **$k$ 路归并**；
> * 归并趟数公式：$$\mathbf{S = \lceil \log_k m \rceil}$$
> * 每趟归并需要读入全部数据并写回外存（各 1 次 I/O）；
> * **总 I/O 读写次数** $= \text{生成初始归并段 I/O} + S \times (\text{每趟读写 I/O})$。

#### 408 手写算例：设初始段 $m = 10$，每趟读写各 50 次（共 100 次 I/O）
* **2 路归并**：$S = \lceil \log_2 10 \rceil = 4$ 趟 $\implies 100 + 4 \times 100 = \mathbf{500\text{ 次 I/O}}$；
* **3 路归并**：$S = \lceil \log_3 10 \rceil = 3$ 趟 $\implies 100 + 3 \times 100 = \mathbf{400\text{ 次 I/O}}$；
* **6 路归并**：$S = \lceil \log_6 10 \rceil = 2$ 趟 $\implies 100 + 2 \times 100 = \mathbf{300\text{ 次 I/O}}$。

---

### ❓ 败者树 (Loser Tree)

* **设计目的**：当路数 $k$ 增大时，普通 $k$ 个数选最小需要 $k - 1$ 次内部比较；引入败者树后，**每次选出最小元素仅需 $\lceil \log_2 k \rceil$ 次比较**，与 $k$ 呈对数级关系！
* **结构特点**：
  * 叶子节点存放各归并段当前的段首记录；
  * 非叶子节点存放**失败者（较大者）的段号**；
  * 树顶上方设立一个单独的节点记录**最终胜者（全局最小）**；
  * 胜者输出后，将对应段的下一个记录填入叶子，沿父节点向上与非叶节点的失败者比对，胜者继续向上挑战，败者留在该节点。

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

### ❓ 置换-选择排序与最佳归并树

* **置换-选择排序**：
  * 突破内存容量限制，**生成长度可变的超长初始归并段**，极大压缩初始归并段总数 $m$！
* **最佳归并树（$k$ 叉哈夫曼树）**：
  * 各初始归并段所含块数作为叶子节点权值，构造带权路径长度 WPL 最小的 $k$ 叉树；
  * **补虚段准则**：若 $(n_0 - 1) \pmod{k - 1} \ne 0$，必须补足权值为 0 的虚段；
  * ⚠️ **408 必背避坑点**：
    $$\mathbf{\text{总 I/O 读写次数} = 2 \times \text{WPL}}$$
    （因为每次归并合并，既要读入 1 次，又要写出 1 次，必须乘以 2！）


