# 第3章 栈、队列、数组与 KMP · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P3~P6，涵盖顺序栈/循环队列规范手写实现、出栈序列卡特兰数公式、二维数组行优先地址映射大题、稀疏矩阵三元组与十字链表、中缀转后缀与前后缀表达式求值、以及 KMP 匹配比较次数与 nextval 数组推导。

---

## 🥞 栈与卡特兰数

### ❓ 顺序栈定义与出入栈手写代码

```c
#define MaxSize 100

typedef struct {
    int data[MaxSize];
    int top; // 栈顶指针，初始化为 -1
} SqStack;

void initStack(SqStack &S) {
    S.top = -1;
}

bool push(SqStack &S, int x) {
    if (S.top == MaxSize - 1) return false; // 栈满上溢
    S.data[++S.top] = x;                    // 指针先加 1，再填入元素
    return true;
}

bool pop(SqStack &S, int &x) {
    if (S.top == -1) return false;          // 栈空下溢
    x = S.data[S.top--];                    // 先取元素，指针再减 1
    return true;
}
```

---

### ❓ $n$ 个不同元素进栈，合法出栈序列种数

$$\mathbf{\text{不同出栈序列种数} = \frac{1}{n+1} C_{2n}^n \quad (\text{卡特兰数 Catalan Number})}$$

* 经典数值速记：
  * $n = 3 \implies \frac{1}{4} C_6^3 = \frac{20}{4} = \mathbf{5}$ 种；
  * $n = 4 \implies \frac{1}{5} C_8^4 = \frac{70}{5} = \mathbf{14}$ 种；
  * $n = 5 \implies \frac{1}{6} C_{10}^5 = \frac{252}{6} = \mathbf{42}$ 种。

---

## 🚶 循环队列操作与判空判满

### ❓ 循环队列核心机制（牺牲一个存储单元）

```c
#define MaxSize 100

typedef struct {
    int data[MaxSize];
    int front, rear; // front 指向队头元素，rear 指向队尾元素的下一个位置
} Queue;

void initQueue(Queue &Q) {
    Q.front = Q.rear = 0;
}

// 判空：首尾重合即为空
bool isEmpty(Queue Q) {
    return Q.front == Q.rear;
}

// 判满：rear 的下一个位置是 front
bool isFull(Queue Q) {
    return (Q.rear + 1) % MaxSize == Q.front;
}

// 队列有效元素个数
int queueLength(Queue Q) {
    return (Q.rear - Q.front + MaxSize) % MaxSize;
}

// 入队
bool inQueue(Queue &Q, int x) {
    if ((Q.rear + 1) % MaxSize == Q.front) return false; // 队满
    Q.data[Q.rear] = x;
    Q.rear = (Q.rear + 1) % MaxSize;
    return true;
}

// 出队
bool deQueue(Queue &Q, int &x) {
    if (Q.front == Q.rear) return false;                 // 队空
    x = Q.data[Q.front];
    Q.front = (Q.front + 1) % MaxSize;
    return true;
}
```

---

## 🧮 二维数组存储地址推导大题

### ❓ 408 经典手写算例（行优先地址计算）

> **题目设定**：
> * 二维数组 $A$ 按**行优先**顺序存储，每个元素占 1 个存储单元；
> * $A[0][0]$ 的存储地址为 **100**；
> * $A[3][3]$ 的存储地址为 **220**；
> * ❓ **求 $A[5][5]$ 的存储地址？**

#### 解题严密推导过程：
1. **设每行包含 $X$ 个元素**；
2. **列出已知条件方程**：
   $$\text{Loc}(A[3][3]) = \text{Loc}(A[0][0]) + (3 \times X + 3) \times 1$$
   $$100 + 3X + 3 = 220 \implies 3X = 117 \implies \mathbf{X = 39}$$
3. **计算目标元素 $A[5][5]$ 的物理地址**：
   $$\text{Loc}(A[5][5]) = 100 + (5 \times X + 5) \times 1 = 100 + 5 \times 39 + 5 = 100 + 195 + 5 = \mathbf{300}$$

---

## 🧱 稀疏矩阵压缩存储

* **三元组表示法**：
  * 仅存储非零元素，每个三元组格式：`[ val (数值) | row (行号) | col (列号) ]`；
  * 加上总行数、总列数、非零元个数：`int row, col, number; Node data[MaxSize];`；
  * 优点：极大压缩空间；缺点：**失去了随机存取特性**。
* **十字链表表示法**：
  * 每个非零元节点包含：`[ val | row | col | right (同行下一非零元) | down (同列下一非零元) ]`；
  * 设行指针数组 `rhead[]` 与列指针数组 `chead[]`；适合稀疏矩阵的动态加减乘运算。

---

## 🔄 表达式转换与求值（栈应用）

### ❓ 中缀转后缀表达式（逆波兰式）四大规则

> **算例**：将 `a / b + (c * d - e * f) / g` 转换为后缀表达式。

1. **碰见操作数**：直接输出追加到后缀表达式末尾；
2. **碰见运算符**：
   * 将栈中**所有优先级高于或等于（不低于）**当前运算符的符号全部弹出输出；
   * 然后将当前运算符压入栈中；
3. **碰见左括号 `(`**：直接压入符号栈；
4. **碰见右括号 `)`**：依次弹出栈顶运算符输出，直到遇到与之匹配的左括号并将其弹出（括号不输出）；
5. **扫描完毕**：将栈中残余的所有运算符全部弹出输出。
* **最终转换结果**：
  $$\mathbf{a \ b \ / \ c \ d \ * \ e \ f \ * \ - \ g \ / \ +}$$

::: tip 💡 方法 2：手算快速提取法（括号法）
先按运算优先级为所有运算子表达式加括号：`(((a / b) + (((c * d) - (e * f)) / g)))`，然后将每个运算符直接移到对应闭括号外侧并去掉所有括号，即可秒出后缀表达式！
:::

---

### ❓ 后缀表达式逆向还原为中缀表达式

> **算例**：将后缀表达式 `a b / c d * e f * - g / +` 还原为中缀表达式。

* **核心思路（与后缀求值完全类似）**：
  1. 从左向右逐个扫描后缀表达式中的元素；
  2. **碰见操作数**：直接压入表达式暂存栈中；
  3. **碰见运算符**：
     * 连续弹出两个栈顶表达式（先弹出的是**右操作数** $R$，后弹出的是**左操作数** $L$）；
     * 将它们组合并**外加一对括号**：`"(" + L + op + R + ")"`；
     * 将组装后的新表达式再次压入栈中；
  4. **最终出栈结果**：去掉最外层多余括号，即得到标准中缀表达式：
     $$\mathbf{a / b + (c * d - e * f) / g}$$

---

### ❓ 前缀与后缀表达式求值算例

* **后缀表达式求值**：`5 1 2 + 4 * + 3 -`
  * 从左向右扫描，遇到数字压栈；遇到运算符弹出两个操作数（先出右，后出左），计算后再压栈：
    $$1 + 2 = 3 \implies 3 \times 4 = 12 \implies 5 + 12 = 17 \implies 17 - 3 = \mathbf{14}$$
* **前缀表达式求值**：`- + 5 * + 1 2 4 3`
  * 从右向左扫描，遇到数字压栈；遇到运算符弹出两个操作数（先出左，后出右），计算后再压栈：
    $$1 + 2 = 3 \implies 3 \times 4 = 12 \implies 5 + 12 = 17 \implies 17 - 3 = \mathbf{14}$$

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 后缀表达式与前缀表达式栈演化流</span>
    <span class="diagram-badge">P6 手记草图</span>
  </div>
  <svg viewBox="0 0 700 130" width="100%" height="130">
    <!-- 后缀运算栈 -->
    <g transform="translate(10, 15)">
      <text x="0" y="16" fill="var(--vp-c-text-1)" font-size="12" font-weight="700">后缀运算（从左至右）：弹出 3 与 17</text>
      <!-- 栈简图 -->
      <g transform="translate(30, 28)">
        <path d="M 0 0 L 0 55 L 45 55 L 45 0" fill="none" stroke="var(--vp-c-text-2)" stroke-width="2"/>
        <rect x="5" y="32" width="35" height="20" fill="rgba(37,99,235,0.15)" stroke="#2563eb" rx="3"/>
        <text x="22" y="46" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">17</text>
        <rect x="5" y="8" width="35" height="20" fill="rgba(239,68,68,0.15)" stroke="#ef4444" rx="3"/>
        <text x="22" y="22" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">3</text>
      </g>
      <!-- 箭头与计算结果 -->
      <path d="M 85 55 L 125 55" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
      <g transform="translate(135, 38)">
        <rect x="0" y="0" width="140" height="34" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="6"/>
        <text x="70" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="13" font-weight="700">17 - 3 = 14</text>
      </g>
    </g>
    <!-- 前缀运算栈 -->
    <g transform="translate(350, 15)">
      <text x="0" y="16" fill="var(--vp-c-text-1)" font-size="12" font-weight="700">前缀运算（从右至左）：逆向扫描入栈</text>
      <!-- 栈简图 -->
      <g transform="translate(30, 28)">
        <path d="M 0 0 L 0 55 L 45 55 L 45 0" fill="none" stroke="var(--vp-c-text-2)" stroke-width="2"/>
        <rect x="5" y="32" width="35" height="20" fill="rgba(239,68,68,0.15)" stroke="#ef4444" rx="3"/>
        <text x="22" y="46" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">3</text>
        <rect x="5" y="8" width="35" height="20" fill="rgba(37,99,235,0.15)" stroke="#2563eb" rx="3"/>
        <text x="22" y="22" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">17</text>
      </g>
      <!-- 箭头与计算结果 -->
      <path d="M 85 55 L 125 55" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
      <g transform="translate(135, 38)">
        <rect x="0" y="0" width="140" height="34" fill="rgba(16,185,129,0.1)" stroke="#10b981" rx="6"/>
        <text x="70" y="22" text-anchor="middle" fill="#10b981" font-size="13" font-weight="700">17 - 3 = 14</text>
      </g>
    </g>
    <defs>
      <marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981"/>
      </marker>
    </defs>
  </svg>
</div>

---

## 🔍 KMP 模式匹配与 nextval 数组优化

### ❓ KMP 比较次数真题算例

> **设主串 $T =$ `'abaabaabcabaabc'`，模式串 $S =$ `'abaabc'`，使用 KMP 算法求字符比较次数。

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · KMP 模式串对齐与字符比较次数（6 + 4 = 10 次）</span>
    <span class="diagram-badge">P6 手记草图</span>
  </div>
  <svg viewBox="0 0 700 135" width="100%" height="135">
    <g transform="translate(15, 15)">
      <!-- 主串 T -->
      <text x="0" y="16" fill="var(--vp-c-text-3)" font-size="12" font-weight="600">主串 T：</text>
      <text x="65" y="16" fill="var(--vp-c-text-1)" font-family="monospace" font-size="14" font-weight="700" letter-spacing="4">a b a a b a a b c a b a a b c</text>
      <!-- 第一次匹配 -->
      <g transform="translate(0, 32)">
        <text x="0" y="16" fill="#2563eb" font-size="11.5" font-weight="700">第 1 趟：</text>
        <text x="65" y="16" fill="#2563eb" font-family="monospace" font-size="14" font-weight="700" letter-spacing="4">a b a a b</text>
        <text x="145" y="16" fill="#ef4444" font-family="monospace" font-size="14" font-weight="700" letter-spacing="4">c</text>
        <text x="175" y="16" fill="#ef4444" font-size="11" font-weight="700">❌ 失配 (比对 6 次)</text>
      </g>
      <!-- 第二次滑动匹配 -->
      <g transform="translate(0, 68)">
        <text x="0" y="16" fill="#10b981" font-size="11.5" font-weight="700">第 2 趟：</text>
        <!-- 滑动对齐位置 -->
        <text x="113" y="16" fill="var(--vp-c-text-3)" font-family="monospace" font-size="14" letter-spacing="4">(a b)</text>
        <text x="145" y="16" fill="#10b981" font-family="monospace" font-size="14" font-weight="700" letter-spacing="4">a a b c</text>
        <text x="215" y="16" fill="#10b981" font-size="11" font-weight="700">✅ 成功 (再比对 4 次)</text>
      </g>
      <!-- 结果徽章 -->
      <g transform="translate(430, 28)">
        <rect x="0" y="0" width="220" height="52" fill="rgba(37,99,235,0.08)" stroke="#2563eb" rx="8"/>
        <text x="110" y="24" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="700">总字符比较次数判定</text>
        <text x="110" y="42" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="13" font-weight="800">6次 + 4次 = 10 次！</text>
      </g>
    </g>
  </svg>
</div>

* **手写分析过程**：

  * 模式串 `abaabc` 的 `next` 数组为：`0, 1, 1, 2, 2, 3`（或 `-1, 0, 0, 1, 1, 2`）；
  * 第 1 次匹配：比较到 $S$ 的第 6 个字符 `'c'` 失配（已比较 **6 次**）；
  * 模式串滑动，下次从 $S$ 的对应 `next` 位置继续比对，比对 **4 次** 匹配成功；
  * **总字符比较次数** $= 6 + 4 = \mathbf{10\text{ 次}}$！

---

### ❓ `nextval` 数组优化推导口诀

* 核心逻辑：若求出的 `next[j]` 所指向的字符 `S[next[j]]` 与当前字符 `S[j]` 相同，由于当前字符已经失配，滑过去比对必定再次失配，因此进行**压缩递归赋值**：
  $$\text{if } (S[j] == S[\text{next}[j]]) \implies \text{nextval}[j] = \text{nextval}[\text{next}[j]]$$
  $$\text{else} \implies \text{nextval}[j] = \text{next}[j]$$


