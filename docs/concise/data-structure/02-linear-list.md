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


