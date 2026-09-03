# 第2章 进程线程、同步互斥与死锁 · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P4~P8，涵盖 PCB 结构、进程五状态转移与挂起态、线程模型、三级调度体系、六大调度算法特性（周转时间推导）、多级反馈队列升降级玄机、临界区互斥软硬件实现（Peterson / TSL）、PV 大题四步解题法（水果盘 / 读写公平 / 哲学家）、死锁四大预防、银行家算法大题、以及资源分配图化简与死锁解除。

---

## 🧵 进程、线程与进程控制块 (PCB)

### ❓ 进程控制块 (PCB) 包含哪些核心信息？

1. **进程描述信息**：**PID (进程标识符)**、**UID (用户标识符)**；
2. **进程控制与管理信息**：进程当前状态、CPU 累计运行时间、进程调度优先级；
3. **资源分配清单**：已打开的文件描述符表、已分配内存物理块/页表基址指针、所占用的 I/O 外设；
4. **CPU 现场保护信息**：**PC (程序计数器)**、**PSW (状态字)**、通用寄存器组、SP 堆栈指针。

---

### ❓ 进程五状态转换与挂起状态全景

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 进程七状态转换与挂起/激活模型拓扑</span>
    <span class="diagram-badge">P40 手记草图</span>
  </div>
  <svg viewBox="0 0 720 250" width="100%" height="250">
    <g transform="translate(15, 12)">
      <!-- 内存活动状态层 (虚线框) -->
      <rect x="0" y="0" width="460" height="150" fill="rgba(37,99,235,0.04)" stroke="var(--vp-c-divider)" stroke-dasharray="4,4" rx="8"/>
      <text x="12" y="20" fill="var(--vp-c-text-3)" font-size="10.5" font-weight="700">内存活动状态 (Active In-Memory)</text>
      <!-- 创建态 (New) -->
      <g transform="translate(25, 45)">
        <rect x="0" y="0" width="70" height="30" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
        <text x="35" y="19" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="11" font-weight="600">创建态</text>
      </g>
      <line x1="95" y1="60" x2="135" y2="60" stroke="var(--vp-c-divider)" stroke-width="1.8" marker-end="url(#arrow-blue)"/>
      <!-- 就绪态 (Ready) -->
      <g transform="translate(140, 45)">
        <rect x="0" y="0" width="85" height="34" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2" rx="4"/>
        <text x="42" y="21" text-anchor="middle" fill="#10b981" font-size="12" font-weight="800">就绪态 (Ready)</text>
      </g>
      <!-- 运行态 (Running) -->
      <g transform="translate(300, 45)">
        <rect x="0" y="0" width="90" height="34" fill="rgba(37,99,235,0.18)" stroke="#2563eb" stroke-width="2.2" rx="4"/>
        <text x="45" y="21" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="900">运行态 (Running)</text>
      </g>
      <!-- 就绪 -> 运行 (调度) -->
      <path d="M 225 54 L 295 54" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
      <text x="260" y="47" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="700">获得CPU</text>
      <!-- 运行 -> 就绪 (时间片用完) -->
      <path d="M 295 70 L 225 70" stroke="var(--vp-c-text-2)" stroke-width="1.8" marker-end="url(#arrow-gray)"/>
      <text x="260" y="82" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10">时间片到</text>
      <!-- 终止态 (Terminated) -->
      <g transform="translate(360, 100)">
        <rect x="0" y="0" width="70" height="30" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
        <text x="35" y="19" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="11" font-weight="600">终止态</text>
      </g>
      <line x1="365" y1="79" x2="385" y2="100" stroke="var(--vp-c-divider)" stroke-width="1.8" marker-end="url(#arrow-gray)"/>
      <!-- 运行 -> 阻塞 (等待事件) -->
      <path d="M 320 79 C 320 110, 240 115, 225 115" fill="none" stroke="#ef4444" stroke-width="1.8" marker-end="url(#arrow-red)"/>
      <text x="270" y="112" fill="#ef4444" font-size="10">等待 I/O</text>
      <!-- 阻塞态 (Blocked) -->
      <g transform="translate(140, 100)">
        <rect x="0" y="0" width="85" height="34" fill="rgba(239,68,68,0.12)" stroke="#ef4444" stroke-width="1.8" rx="4"/>
        <text x="42" y="21" text-anchor="middle" fill="#ef4444" font-size="11.5" font-weight="700">阻塞态 (Wait)</text>
      </g>
      <!-- 阻塞 -> 就绪 (事件发生) -->
      <path d="M 160 100 L 160 85" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
      <text x="120" y="94" fill="#10b981" font-size="10" font-weight="700">I/O 完成</text>
      <!-- 外存对换挂起层 (下方) -->
      <rect x="0" y="165" width="460" height="75" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="4,4" rx="8"/>
      <text x="12" y="185" fill="#f59e0b" font-size="10.5" font-weight="700">外存对换区挂起层 (Suspended on Disk)</text>
      <!-- 就绪挂起 -->
      <g transform="translate(140, 195)">
        <rect x="0" y="0" width="85" height="32" fill="var(--vp-c-bg-alt)" stroke="#10b981" rx="4"/>
        <text x="42" y="20" text-anchor="middle" fill="#10b981" font-size="11" font-weight="700">就绪挂起</text>
      </g>
      <!-- 阻塞挂起 -->
      <g transform="translate(300, 195)">
        <rect x="0" y="0" width="85" height="32" fill="var(--vp-c-bg-alt)" stroke="#ef4444" rx="4"/>
        <text x="42" y="20" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">阻塞挂起</text>
      </g>
      <!-- 挂起与激活连线 -->
      <path d="M 195 79 L 195 190" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="3,3" marker-end="url(#arrow-amber)"/>
      <text x="200" y="155" fill="#f59e0b" font-size="9.5">挂起/激活</text>
      <path d="M 300 211 L 230 211" stroke="#10b981" stroke-width="1.8" marker-end="url(#arrow-green)"/>
      <text x="265" y="206" text-anchor="middle" fill="#10b981" font-size="9.5">事件发生</text>
      <!-- 右侧：考点辨析卡片 -->
      <g transform="translate(480, 10)">
        <rect x="0" y="0" width="210" height="230" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="105" y="24" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12" font-weight="800">408 核心命题必背准则</text>
        <line x1="10" y1="34" x2="200" y2="34" stroke="var(--vp-c-divider)"/>
        <text x="12" y="55" fill="#ef4444" font-size="11" font-weight="700">⚠️ 阻塞态无法直达运行态！</text>
        <text x="12" y="73" fill="var(--vp-c-text-2)" font-size="10.5">必须先唤醒进就绪队列；</text>
        <text x="12" y="90" fill="var(--vp-c-text-2)" font-size="10.5">只有就绪态能被调度执行！</text>
        <line x1="10" y1="105" x2="200" y2="105" stroke="var(--vp-c-divider)"/>
        <text x="12" y="125" fill="#2563eb" font-size="11" font-weight="700">进程状态流转主动 vs 被动：</text>
        <text x="12" y="143" fill="var(--vp-c-text-2)" font-size="10">运行 ➔ 阻塞：进程自身【主动】发起</text>
        <text x="12" y="160" fill="var(--vp-c-text-2)" font-size="10">阻塞 ➔ 就绪：操作系统【被动】唤醒</text>
        <line x1="10" y1="175" x2="200" y2="175" stroke="var(--vp-c-divider)"/>
        <text x="12" y="195" fill="#f59e0b" font-size="10.5" font-weight="700">挂起态本质：进程PCB仍在内存，</text>
        <text x="12" y="210" fill="var(--vp-c-text-2)" font-size="10">但其用户数据/代码被换出到磁盘！</text>
      </g>
    </g>
  </svg>
</div>

* **核心区别**：
  * **线程是 CPU 调度与独立执行的最小单位**；
  * **进程是操作系统资源分配与保护的最小单位**。

---

### ❓ 一对一、多对一与多对多线程模型对比

| 模型 | 用户级与内核级线程映射 | 核心优点 | 致命缺陷 |
| :--- | :--- | :--- | :--- |
| **多对一** | 一个进程中多个用户线程映射到 1 个内核级线程 | 线程切换与管理在**用户空间**完成，无需陷入内核，**开销极小** | 若一个用户线程被系统调用阻塞，**整个进程的所有线程全部阻塞**；无法利用多核 |
| **一对一** | 每个用户线程严格对应 1 个内核线程 (Linux/Windows) | **并发度最高**！多线程可在多核 CPU 上实现真正物理并行；一个阻塞不影响其他 | 线程创建、销毁和调度全部陷入内核，**内核资源开销大** |
| **多对多** | $M$ 个用户线程映射到 $N$ 个内核线程 ($M > N$) | 结合了前两者的并发度与轻量级优势 | 内核与用户库双重调度，**系统实现极其复杂** |

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 三大线程实现模型结构映射全景（多对一 / 一对一 / 多对多）</span>
    <span class="diagram-badge">P41 手记草图</span>
  </div>
  <svg viewBox="0 0 720 200" width="100%" height="200">
    <g transform="translate(15, 12)">
      <!-- 模型 1: 多对一 (M:1) -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="220" height="175" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="110" y="20" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="800">① 多对一 (M:1) ULT</text>
        <!-- 用户空间 -->
        <rect x="15" y="32" width="190" height="50" fill="rgba(37,99,235,0.08)" stroke="#2563eb" stroke-dasharray="2,2" rx="4"/>
        <text x="25" y="46" fill="var(--vp-c-text-3)" font-size="9.5">用户空间 (用户线程库)</text>
        <circle cx="55" cy="65" r="10" fill="#2563eb"/>
        <text x="55" y="69" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">T1</text>
        <circle cx="110" cy="65" r="10" fill="#2563eb"/>
        <text x="110" y="69" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">T2</text>
        <circle cx="165" cy="65" r="10" fill="#2563eb"/>
        <text x="165" y="69" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">T3</text>
        <!-- 映射连线汇聚到1 -->
        <path d="M 55 75 L 110 102" stroke="#2563eb" stroke-width="1.5"/>
        <path d="M 110 75 L 110 102" stroke="#2563eb" stroke-width="1.5"/>
        <path d="M 165 75 L 110 102" stroke="#2563eb" stroke-width="1.5"/>
        <!-- 内核空间 -->
        <rect x="15" y="105" width="190" height="36" fill="rgba(239,68,68,0.08)" stroke="#ef4444" stroke-dasharray="2,2" rx="4"/>
        <circle cx="110" cy="123" r="10" fill="#ef4444"/>
        <text x="110" y="127" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="700">K1</text>
        <text x="130" y="127" fill="var(--vp-c-text-2)" font-size="9.5">单一内核线程</text>
        <text x="110" y="162" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="700">⚠️ 一阻全阻，无法多核</text>
      </g>
      <!-- 模型 2: 一对一 (1:1) -->
      <g transform="translate(240, 0)">
        <rect x="0" y="0" width="220" height="175" fill="var(--vp-c-bg-alt)" stroke="#10b981" stroke-width="2" rx="8"/>
        <text x="110" y="20" text-anchor="middle" fill="#10b981" font-size="12" font-weight="800">② 一对一 (1:1) KLT ★主流</text>
        <!-- 用户空间 -->
        <rect x="15" y="32" width="190" height="50" fill="rgba(16,185,129,0.08)" stroke="#10b981" stroke-dasharray="2,2" rx="4"/>
        <text x="25" y="46" fill="var(--vp-c-text-3)" font-size="9.5">用户空间</text>
        <circle cx="55" cy="65" r="10" fill="#10b981"/>
        <text x="55" y="69" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">T1</text>
        <circle cx="110" cy="65" r="10" fill="#10b981"/>
        <text x="110" y="69" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">T2</text>
        <circle cx="165" cy="65" r="10" fill="#10b981"/>
        <text x="165" y="69" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">T3</text>
        <!-- 严格 1 对 1 垂直映射 -->
        <line x1="55" y1="75" x2="55" y2="105" stroke="#10b981" stroke-width="2"/>
        <line x1="110" y1="75" x2="110" y2="105" stroke="#10b981" stroke-width="2"/>
        <line x1="165" y1="75" x2="165" y2="105" stroke="#10b981" stroke-width="2"/>
        <!-- 内核空间 -->
        <rect x="15" y="105" width="190" height="36" fill="rgba(16,185,129,0.08)" stroke="#10b981" stroke-dasharray="2,2" rx="4"/>
        <circle cx="55" cy="123" r="10" fill="#10b981"/>
        <text x="55" y="127" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="700">K1</text>
        <circle cx="110" cy="123" r="10" fill="#10b981"/>
        <text x="110" y="127" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="700">K2</text>
        <circle cx="165" cy="123" r="10" fill="#10b981"/>
        <text x="165" y="127" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="700">K3</text>
        <text x="110" y="162" text-anchor="middle" fill="#10b981" font-size="10" font-weight="700">✅ 真并发、多核物理并行</text>
      </g>
      <!-- 模型 3: 多对多 (M:N) -->
      <g transform="translate(480, 0)">
        <rect x="0" y="0" width="220" height="175" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="110" y="20" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="800">③ 多对多 (M:N) 混合</text>
        <!-- 用户空间 -->
        <rect x="15" y="32" width="190" height="50" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" stroke-dasharray="2,2" rx="4"/>
        <text x="25" y="46" fill="var(--vp-c-text-3)" font-size="9.5">用户空间 (M 个线程)</text>
        <circle cx="55" cy="65" r="10" fill="#f59e0b"/>
        <text x="55" y="69" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">T1</text>
        <circle cx="110" cy="65" r="10" fill="#f59e0b"/>
        <text x="110" y="69" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">T2</text>
        <circle cx="165" cy="65" r="10" fill="#f59e0b"/>
        <text x="165" y="69" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">T3</text>
        <!-- 复用交叉连线 -->
        <path d="M 55 75 L 80 105" stroke="#f59e0b" stroke-width="1.5"/>
        <path d="M 110 75 L 80 105" stroke="#f59e0b" stroke-width="1.5"/>
        <path d="M 110 75 L 140 105" stroke="#f59e0b" stroke-width="1.5"/>
        <path d="M 165 75 L 140 105" stroke="#f59e0b" stroke-width="1.5"/>
        <!-- 内核空间 -->
        <rect x="15" y="105" width="190" height="36" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" stroke-dasharray="2,2" rx="4"/>
        <circle cx="80" cy="123" r="10" fill="#f59e0b"/>
        <text x="80" y="127" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="700">K1</text>
        <circle cx="140" cy="123" r="10" fill="#f59e0b"/>
        <text x="140" y="127" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="700">K2</text>
        <text x="110" y="162" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="700">⚖️ 兼顾性能，但实现极复杂</text>
      </g>
    </g>
  </svg>
</div>

---

## ⏱️ CPU 调度层次与六大调度算法

### ❓ CPU 调度的三大层次

1. **高级调度（作业调度）**：从外存后备作业队列中挑选作业调入内存，分配资源创建 PCB，使其进入就绪态；
2. **中级调度（内存调度）**：将暂时不能运行的阻塞进程调至外存对换区（变为挂起态），当内存空闲再调回；
3. **低级调度（进程调度）**：从内存就绪队列中选取一个进程，分配 CPU 让其立即投入运行（频率极高，每几十毫秒一次）。

---

### ❓ 六大调度算法核心特征速查表

::: tip 💡 核心指标公式
$$\text{周转时间} = \text{完成时刻} - \text{提交时刻}$$
$$\text{带权周转时间} = \frac{\text{周转时间}}{\text{实际运行时间}} \quad (\ge 1)$$
:::

| 调度算法 | 抢占性 | 是否饥饿 | 算法特点与评价 |
| :--- | :---: | :---: | :--- |
| **FCFS (先来先服务)** | 非抢占 | **不饥饿** | 公平简单，有利于长作业，**极其不利于短作业和 I/O 频繁型作业** |
| **SJF / SPF (短作业优先)** | 默认非抢占 | **会饥饿** | 长作业若源源不断到达可能被活活饿死；无法支持人机交互 |
| **SRTN (最短剩余时间优先)** | **抢占式** | **会饥饿** | 新到达作业若剩余时间更短则立即抢占；**理论上平均周转时间最短** |
| **RR (时间片轮转)** | **抢占式** | **不饥饿** | 分时系统核心基石。时间片过大退化为 FCFS，过小则频繁上下文切换开销大 |
| **优先级调度** | 抢占 / 非抢占均有 | **会饥饿** | 适用于实时系统。低优先级进程可能饥饿，可通过动态提升优先级（老化）解决 |
| **HRRN (高响应比优先)** | 非抢占 | **不饥饿** | 响应比 $R_p = 1 + \frac{\text{等待时间}}{\text{服务时间}}$。等待越久优先级越高，兼顾短作业与长作业 |

---

### ❓ 多级反馈队列 (FB) 抢占与降级考点细节（必考！）

* ❓ **进程被更高优先级队列抢占、或执行 I/O 操作主动放弃 CPU 后，回到本级队尾还是降到下一级？**
  * 💡 **408 核心判据**：
    1. **被高优先级抢占**：回到**原原本本当前级别的队列尾部**继续等待；
    2. **主动执行 I/O 阻塞**：等待 I/O 完成后，唤醒**回到原级别队列**（甚至有系统会适当提升其级别以支持交互）；
    3. **只有当进程把分配给它的完整时间片全部用光而未完成时**，才会被**惩罚降入下一级优先级更低、时间片翻倍的队列**！

---

## 🔒 进程同步互斥与软硬件实现

### ❓ 临界区互斥访问的四大准则

1. **空闲让进**：临界区空闲时，应允许一个请求进入的进程立即进入；
2. **忙则等待**：临界区已有进程访问时，其他试图进入的进程必须等待；
3. **有限等待**：等待进入的进程必须在有限时间内进入，保证不被饿死；
4. **让权等待**：当进程无法进入临界区时，应立即释放 CPU 处理机，**避免忙等（Busy Waiting）**。

---

### ❓ 软件互斥算法与硬件 TSL 指令

* **单标志法**：`while(turn != 0); 临界区; turn = 1;`
  * `turn` 表示进入权限。**缺点：违背“空闲让进”**（必须轮流进入，若一方退出后不再进入，另一方将永远无法进入）。
* **双标志先检查法**：`while(flag[1]); flag[0] = true; 临界区; flag[0] = false;`
  * `flag` 表示进示意愿。**缺点：违背“忙则等待”**（并发时两人同时检查通过，同时冲入临界区）。
* **Peterson 算法（双标志 + 单标志）**：
  ```c
  flag[0] = true;  // 1. 表达意愿：我想进
  turn = 1;        // 2. 谦让：你先请
  while (flag[1] && turn == 1); // 3. 对方想进且轮到对方，则等待
  // 临界区
  flag[0] = false; // 4. 退出
  ```
  * 优点：完美解决空闲让进、忙则等待、有限等待；
  * **缺点：依然不能做到“让权等待”**（进程卡在 while 循环持续空转消耗 CPU）。
* **TSL (Test and Set Lock) 硬件原子指令**：
  * 在一个不可中断的硬件指令周期内，**读出 lock 的旧值并同时将 lock 置为 TRUE**；
  * 实现互斥：`while(TSL(&lock)); 临界区; lock = FALSE;`

---

## 💡 经典 PV 操作大题解题模型

### ❓ PV 大题解题四步法
1. **明确并发进程数**；
2. **理清互斥关系**（临界资源、缓冲区槽位互斥，设 `mutex = 1`）；
3. **理清同步因果链**（前操作先完成，后操作才能执行 $\to$ **前操作 $V(S)$，后操作 $P(S)$**）；
4. **规范定义信号量并声明初值**。

---

### ❓ 模型 1：爸爸妈妈放水果问题（多生产者-多消费者）

* **信号量定义**：
  ```c
  semaphore plate = 1;  // 盘子互斥信号量（容量为 1）
  semaphore apple = 0;  // 盘中苹果数
  semaphore orange = 0; // 盘中橘子数
  ```
* **进程伪代码**：
  ```c
  void Dad() {
      while(1) {
          prepare_apple();
          P(plate);
          put_apple();
          V(apple); // 唤醒儿子
      }
  }
  void Son() {
      while(1) {
          P(apple);
          take_apple();
          V(plate); // 释放盘子
          eat();
      }
  }
  ```

---

### ❓ 模型 2：读者-写者问题（读写公平 / 防写者饥饿）

```c
semaphore rw = 1;     // 读写互斥锁
semaphore mutex = 1;  // 保护 count 计数器的互斥锁
semaphore w = 1;      // 门闩锁：写者到来时挡住后续新读者，实现读写公平
int count = 0;        // 当前正在读的读者数量

void Writer() {
    while(1) {
        P(w);          // 请求写入门闩
        P(rw);         // 独占写互斥
        write();
        V(rw);
        V(w);
    }
}

void Reader() {
    while(1) {
        P(w);          // 检查是否有写者等候门闩
        P(mutex);
        if (count == 0) P(rw); // 第一个读者锁住写者
        count++;
        V(mutex);
        V(w);          // 释放门闩，允许后续读者进入

        read();

        P(mutex);
        count--;
        if (count == 0) V(rw); // 最后一个读者释放写互斥
        V(mutex);
    }
}
```

---

### ❓ 模型 3：哲学家进餐问题防死锁三大招
1. **招式 ①（限制人数）**：至多只允许 4 位哲学家同时拿筷子进餐（`semaphore count = 4;`）；
2. **招式 ②（奇偶编号策略）**：奇数号哲学家先拿左筷再拿右筷，偶数号哲学家先拿右筷再拿左筷；
3. **招式 ③（原子强夺）**：加互斥量 `semaphore mutex = 1;`，每次仅允许一名哲学家检查并同时拿起左右两根筷子。

---

## 🛑 死锁检测、避免与银行家算法

### ❓ 死锁、饥饿与死循环的区别

* **死锁**：**至少两个或两个以上进程**互相等待对方释放资源，全部处于**阻塞态**，不借助外力无法推进；
* **饥饿**：可以只有**一个进程**，长期处于**就绪态**得不到调度；
* **死循环**：进程处于**运行态**，一直消耗 CPU 在循环空转。

---

### ❓ 死锁预防（破坏四个必要条件）

1. **破坏互斥条件**：将独占设备改造为共享设备（如引入 SPOOLing 假脱机打印技术）；
2. **破坏不剥夺条件**：当申请新资源被阻塞时，主动释放已占有的全部资源；
3. **破坏请求和保持条件**：采用**静态预分配策略**，进程运行前必须一次性申请所有资源；
4. **破坏循环等待条件**：采用**顺序资源分配法**，将系统资源赋予全局唯一线性编号，必须按编号从小到大递增申请，严禁逆序申请。

---

### ❓ 银行家算法大题解题核心技巧

::: tip 💡 解题切入点：以“释放进程”的角度推进
1. 计算需求矩阵：$$\text{Need} = \text{Max} - \text{Allocation}$$
2. 在尚未完成的进程中，寻找满足条件：$$\text{Need}_i \le \text{Available}$$
3. 假设让进程 $P_i$ 运行完成，**其持有的已分配资源立即全数回收**：
   $$\text{Available} \gets \text{Available} + \text{Allocation}_i$$
4. 递归寻找下一个可满足进程，若能把所有进程加入队列，则该排列即为一个**安全序列**，系统处于**安全状态**！
:::

---

### ❓ 资源分配图化简（死锁检测）与解除

* **图节点与边**：
  * 方框代表资源（框内圆点代表可用实例数）；圆圈代表进程；
  * **资源 $\to$ 进程**：表示已分配给该进程；
  * **进程 $\to$ 资源**：表示进程正在请求该资源。
* **化简法则（消边法）**：
  * 找到一个既不阻塞又非孤立的进程节点，若其请求资源可被满足，则将该节点的所有相连边全数擦除（回收资源）；
  * **若能擦除图中的所有边（完全化简），则系统无死锁；若残余边无法消除，则对应进程陷入死锁**！

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 死锁检测资源分配图 (RAG) 结构与消边化简过程</span>
    <span class="diagram-badge">P43 手记草图</span>
  </div>
  <svg viewBox="0 0 720 210" width="100%" height="210">
    <g transform="translate(15, 12)">
      <!-- 左侧：死锁状态图 (不可完全化简) -->
      <g transform="translate(10, 0)">
        <text x="100" y="16" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="800">❌ 典型死锁环路 (无法消边)</text>
        <!-- 进程 P1 -->
        <circle cx="45" cy="65" r="18" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2"/>
        <text x="45" y="70" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="700">P1</text>
        <!-- 进程 P2 -->
        <circle cx="155" cy="65" r="18" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2"/>
        <text x="155" y="70" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="700">P2</text>
        <!-- 资源 R1 (2实例) -->
        <rect x="25" y="120" width="40" height="40" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="4"/>
        <text x="45" y="112" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10.5">R1(2点)</text>
        <circle cx="35" cy="140" r="3.5" fill="#ef4444"/>
        <circle cx="55" cy="140" r="3.5" fill="#ef4444"/>
        <!-- 资源 R2 (1实例) -->
        <rect x="135" y="120" width="40" height="40" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="4"/>
        <text x="155" y="112" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10.5">R2(1点)</text>
        <circle cx="155" cy="140" r="3.5" fill="#ef4444"/>
        <!-- 分配边 R1->P1, R2->P2 -->
        <line x1="38" y1="120" x2="42" y2="85" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
        <line x1="150" y1="120" x2="152" y2="85" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
        <!-- 请求边 P1->R2, P2->R1 (交叉等待闭环) -->
        <path d="M 60 75 L 135 125" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>
        <path d="M 140 75 L 65 125" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>
        <text x="100" y="182" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">R2无空闲，P1/P2互相索求阻塞！</text>
      </g>
      <!-- 中间化简消边示意 -->
      <g transform="translate(245, 25)">
        <path d="M 0 65 L 45 65" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arrow-blue)"/>
        <text x="22" y="55" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">消边化简</text>
        <text x="22" y="82" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="9.5">满足 ➔ 擦除</text>
      </g>
      <!-- 右侧：可完全化简图 (无死锁) -->
      <g transform="translate(320, 0)">
        <text x="100" y="16" text-anchor="middle" fill="#10b981" font-size="12" font-weight="800">✅ 可完全化简图 (安全无死锁)</text>
        <!-- 孤立进程 P1 & P2 成功释放 -->
        <circle cx="45" cy="65" r="18" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2"/>
        <text x="45" y="70" text-anchor="middle" fill="#10b981" font-size="12" font-weight="700">P1</text>
        <circle cx="155" cy="65" r="18" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2"/>
        <text x="155" y="70" text-anchor="middle" fill="#10b981" font-size="12" font-weight="700">P2</text>
        <rect x="25" y="120" width="40" height="40" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
        <text x="45" y="145" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10">R1</text>
        <rect x="135" y="120" width="40" height="40" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
        <text x="155" y="145" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10">R2</text>
        <!-- 虚线消去的边 -->
        <line x1="38" y1="120" x2="42" y2="85" stroke="var(--vp-c-divider)" stroke-dasharray="3,3"/>
        <line x1="150" y1="120" x2="152" y2="85" stroke="var(--vp-c-divider)" stroke-dasharray="3,3"/>
        <text x="100" y="182" text-anchor="middle" fill="#10b981" font-size="11" font-weight="700">边全部擦除 ➔ 形成孤立节点</text>
      </g>
      <!-- 右侧：死锁定理法则卡片 -->
      <g transform="translate(540, 10)">
        <rect x="0" y="0" width="150" height="175" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="75" y="20" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">死锁定理判定</text>
        <line x1="10" y1="28" x2="140" y2="28" stroke="var(--vp-c-divider)"/>
        <text x="10" y="48" fill="#10b981" font-size="10.5" font-weight="700">完全化简：</text>
        <text x="10" y="65" fill="var(--vp-c-text-2)" font-size="10">所有边皆可消除</text>
        <text x="10" y="80" fill="#10b981" font-size="10" font-weight="700">➔ 系统无死锁！</text>
        <line x1="10" y1="95" x2="140" y2="95" stroke="var(--vp-c-divider)"/>
        <text x="10" y="115" fill="#ef4444" font-size="10.5" font-weight="700">不可完全化简：</text>
        <text x="10" y="132" fill="var(--vp-c-text-2)" font-size="10">残余环路死锁边</text>
        <text x="10" y="148" fill="#ef4444" font-size="10" font-weight="700">➔ 对应进程必死锁！</text>
      </g>
    </g>
  </svg>
</div>
* **死锁解除三大招**：
  1. **资源剥夺法**：挂起某些死锁进程，剥夺其资源分配给其他死锁进程；
  2. **撤销进程法**：按优先级强制终止部分死锁进程，代价较大；
  3. **进程回退法**：基于检查点 (Checkpoint) 将进程回退至死锁前的安全状态重新执行。


