# 第2章 线性表（顺序表与链表） · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P2~P4，涵盖顺序表结构定义与增删元素手写实现、单链表经典增删与头插法、单链表三指针原地逆置代码、以及循环单链表三种指针形态（特别是仅设尾指针 rear）操作耗时大横评。

---

## 🗃️ 顺序表结构与增删代码

### ❓ 顺序表定义与初始化

```c
#define MaxSize 100

typedef struct {
    int data[MaxSize];
    int length;
} SqList;

void initList(SqList &L) {
    L.length = 0; // 长度初始化为 0
}
```

---

### ❓ 顺序表插入与删除（下标为 $i$）

#### 1. 插入操作（在下标 $i$ 处插入元素 $x$）
```c
bool listInsert(SqList &L, int i, int x) {
    if (i < 0 || i > L.length) return false;     // 边界检查：只能插在 0 ~ length
    if (L.length >= MaxSize) return false;       // 存储溢出检查

    for (int j = L.length; j > i; j--) {        // 从最后一个元素往前，逐个后移
        L.data[j] = L.data[j - 1];
    }
    L.data[i] = x;                               // 填入新元素
    L.length++;                                  // 长度增 1
    return true;
}
```

#### 2. 删除操作（删除下标为 $i$ 的元素）
```c
bool listDelete(SqList &L, int i, int &e) {
    if (i < 0 || i >= L.length) return false;    // 边界异常检查：0 ~ length-1

    e = L.data[i];                               // 取出待删除元素
    for (int j = i; j < L.length - 1; j++) {     // 从 i 开始，后序元素逐个前移
        L.data[j] = L.data[j + 1];
    }
    L.length--;                                  // 长度减 1
    return true;
}
```

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 顺序表元素插入后移机制</span>
    <span class="diagram-badge">P2 手记草图</span>
  </div>
  <svg viewBox="0 0 720 120" width="100%" height="120">
    <g transform="translate(10, 20)">
      <g transform="translate(0, 25)">
        <rect x="0" y="0" width="60" height="36" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
        <text x="30" y="23" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="12">data[0]</text>
        <rect x="60" y="0" width="60" height="36" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
        <text x="90" y="23" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="12">···</text>
        <!-- 待插入槽位 i -->
        <rect x="120" y="0" width="80" height="36" fill="rgba(16, 185, 129, 0.18)" stroke="#10b981" stroke-width="2" rx="4"/>
        <text x="160" y="23" text-anchor="middle" fill="#10b981" font-size="12" font-weight="700">新元素 x</text>
        <text x="160" y="-8" text-anchor="middle" fill="#10b981" font-size="11" font-weight="700">下标 i (插入)</text>
        <!-- 后移的元素 -->
        <rect x="200" y="0" width="70" height="36" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
        <text x="235" y="23" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="12">data[i]</text>
        <rect x="270" y="0" width="70" height="36" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
        <text x="305" y="23" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="12">···</text>
        <rect x="340" y="0" width="80" height="36" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
        <text x="380" y="23" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="12">data[len-1]</text>
        <rect x="420" y="0" width="80" height="36" fill="rgba(59, 130, 246, 0.12)" stroke="#3b82f6" stroke-dasharray="3,3" rx="4"/>
        <text x="460" y="23" text-anchor="middle" fill="#3b82f6" font-size="11">新扩展位</text>
        <!-- 元素后移弯箭头 -->
        <path d="M 380 44 Q 420 62 455 44" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
        <path d="M 235 44 Q 270 62 300 44" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
        <text x="515" y="46" fill="#2563eb" font-size="11" font-weight="600">从 length-1 往前逐个后移 ➔</text>
      </g>
    </g>
    <defs>
      <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
      </marker>
    </defs>
  </svg>
</div>

::: tip 💡 复杂度速记
* 插入与删除的最好时间复杂度：$O(1)$（在表尾操作）；
* 最坏时间复杂度：$O(n)$（在表头操作）；
* 平均时间复杂度：$O(n)$。
:::

---

## 🔗 单链表基本操作与原地逆置

### ❓ 单链表结构定义与头插法

```c
typedef struct LNode {
    int info;
    struct LNode *next;
} LNode, *LinkList;

// 初始化带头结点的单链表
void init(LinkList &L) {
    L = (LinkList)malloc(sizeof(LNode));
    L->next = NULL;
}

// 头插法插入新节点（读入数据逆序生成链表）
void headInsert(LinkList &L, int x) {
    LinkList s = (LinkList)malloc(sizeof(LNode));
    s->info = x;
    s->next = L->next;
    L->next = s;
}

// 删除 pre 节点的后继节点 r
void deleteNode(LinkList pre) {
    LinkList r = pre->next;
    if (r == NULL) return;
    pre->next = r->next;
    free(r);
}
```

---

### ❓ 408 核心真题：单链表原地逆置（三指针法）

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 单链表三指针原地逆置反转机理</span>
    <span class="diagram-badge">P3 手记草图</span>
  </div>
  <svg viewBox="0 0 700 130" width="100%" height="130">
    <g transform="translate(10, 20)">
      <!-- pre 节点 -->
      <g transform="translate(30, 25)">
        <circle cx="20" cy="20" r="18" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="2"/>
        <text x="20" y="24" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="600">pre</text>
        <text x="20" y="-6" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="11">前驱</text>
      </g>
      <!-- 反向翻转指针 curr -> pre -->
      <path d="M 170 38 C 135 22, 95 22, 60 38" fill="none" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-red)"/>
      <text x="115" y="16" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">curr-&gt;next = pre</text>
      <!-- curr 节点 -->
      <g transform="translate(170, 25)">
        <circle cx="20" cy="20" r="18" fill="rgba(37, 99, 235, 0.15)" stroke="#2563eb" stroke-width="2.5"/>
        <text x="20" y="24" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">curr</text>
        <text x="20" y="-6" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">待翻转</text>
      </g>
      <!-- 原正向指针 next 暂存 -->
      <path d="M 215 45 L 285 45" fill="none" stroke="var(--vp-c-text-3)" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#arrow-gray)"/>
      <text x="250" y="38" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10.5">原链断开</text>
      <!-- next 节点 -->
      <g transform="translate(290, 25)">
        <circle cx="20" cy="20" r="18" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="2"/>
        <text x="20" y="24" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="600">next</text>
        <text x="20" y="-6" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="11">暂存后继</text>
      </g>
      <!-- 指针后移指示 -->
      <g transform="translate(400, 15)">
        <rect x="0" y="0" width="260" height="64" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" rx="8"/>
        <text x="12" y="22" fill="#10b981" font-size="11.5" font-weight="700">三指针整体步进规则：</text>
        <text x="12" y="40" fill="var(--vp-c-text-2)" font-size="11">1. pre = curr;   // 前驱指针推进</text>
        <text x="12" y="56" fill="var(--vp-c-text-2)" font-size="11">2. curr = next;  // 当前指针推进</text>
      </g>
    </g>
    <defs>
      <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444"/>
      </marker>
      <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/>
      </marker>
    </defs>
  </svg>
</div>

```
初始状态:  pre(NULL)    curr(L->next) ──> next(curr->next) ──> ...
循环迭代:  每次将 curr->next 指向 pre，三指针整体右移一步
```


```c
// 原地逆置带头结点的单链表 L，空间复杂度 O(1)
LinkList reverseList(LinkList L) {
    LinkList curr = L->next;
    LinkList pre = NULL;

    while (curr != NULL) {
        LinkList next = curr->next; // 1. 暂存后继节点，防止链条断裂
        curr->next = pre;          // 2. 核心翻转：指向前驱
        pre = curr;                // 3. 前驱指针前进一步
        curr = next;               // 4. 当前指针前进一步
    }

    L->next = pre;                 // 5. 将头结点指向新的首元节点
    return L;
}
```

---

## 🔄 循环单链表不同指针形态操作耗时大横评

> **对比场景**：针对包含 $n$ 个元素的循环单链表，在不同指针设计下，执行首尾元素的访问、插入与删除的时间复杂度对比。

| 指针设计形态 | 访问第 1 个 | 删除第 1 个 | 插入第 1 个 | 访问最后 1 个 | 删除最后 1 个 | 插入最后 1 个 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **带头结点，仅设头指针** | $\mathbf{O(1)}$ | $\mathbf{O(1)}$ | $\mathbf{O(1)}$ | $O(n)$ | $O(n)$ | $O(n)$ |
| **无头结点，仅设头指针** | $\mathbf{O(1)}$ | $O(n)$ (需修改尾节点 next) | $O(n)$ (需修改尾节点 next) | $O(n)$ | $O(n)$ | $O(n)$ |
| **带头结点，仅设尾指针 (rear)** | $\mathbf{O(1)}$ (`rear->next->next`) | $\mathbf{O(1)}$ | $\mathbf{O(1)}$ | $\mathbf{O(1)}$ (`rear`) | $O(n)$ (单链需从头找前驱) | $\mathbf{O(1)}$ (插在 rear 后并更新 rear) |

::: tip 💡 命题结论
若业务场景需要频繁在**链表首端和尾端**进行插入与访问操作（如实现队列 FIFO），**仅设立尾指针 (rear) 的循环单链表是最优设计**！
:::


