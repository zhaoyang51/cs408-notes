# 第6章 总线与输入输出 (I/O) 系统 · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P10~P11，涵盖总线分类与周期阶段、同步/异步通信握手机制、I/O 接口与端口本质、中断处理全流程（硬件隐指令 vs 软件服务程序）、中断向量与屏蔽字多重中断大题推导、以及 DMA 控制器传输机制。

---

## 🚌 系统总线结构与总线传输

### ❓ 系统总线三大分类与传输方向

1. **数据总线 (DB)**：
   * **双向传输**；
   * 数据总线宽度通常等于**机器字长**或**存储字长**，直接决定单次能传输的数据量。
2. **地址总线 (AB)**：
   * **单向传输**（由 CPU 或 DMA 控制器输出）；
   * 地址总线宽度决定了**最大可寻址物理空间**（如 32 位寻址 4GB）。
3. **控制总线 (CB)**：
   * 单根控制线是单向的（如读/写控制线由 CPU 发出，中断请求线由设备发出）；
   * 但整组控制总线**宏观上是双向的**。

---

### ❓ 一个总线周期的 4 个阶段

$$\text{申请分配（仲裁）阶段} \longrightarrow \text{寻址阶段} \longrightarrow \text{传输阶段} \longrightarrow \text{结束阶段}$$

---

### ❓ 同步通信 vs 异步通信互锁机制

* **同步通信**：通信双方由**统一的时钟信号**严格控制，每个时钟周期按固定时序传输，适合总线短、设备速度一致的系统。
* **异步通信**：采用**握手应答信号**（请求 Request 与应答 Acknowledge）：
  1. **不互锁**：主设备发出请求后等待固定时间即撤销，从设备收到请求发出应答后也自行撤销（最不可靠）；
  2. **半互锁**：主设备发出请求，必须等到从设备应答才撤销请求；但从设备应答发出后过一段时间自行撤销；
  3. **全互锁**：主设备等从设备应答才撤销请求；从设备等主设备撤销请求后才撤销应答（最可靠，408 核心）。

---

## 🔌 I/O 接口与端口架构

### ❓ I/O 接口中的信号线方向辨析

* **数据线**：**双向传输**。
* **地址线 / 读写命令线**：**单向传输**。
::: tip 💡 命题易错点
CPU 向外设发出的**控制字（命令字）**，在物理硬件上同样是**通过数据总线发送到 I/O 接口的控制寄存器中**的！
:::

---

### ❓ 什么是 I/O 端口？两大编址方式对比

* **I/O 端口定义**：I/O 接口中可以被 CPU 机器指令直接寻址访问的**硬件寄存器**（如数据端口、状态端口、控制端口）。
* **两种编址方式**：
  * **统一编址 (存储器映射 I/O)**：把 I/O 端口当成普通内存单元对待，占用内存地址空间，用访存指令（如 `MOV`, `LOAD`）直接访问端口；
  * **独立编址 (专门 I/O 编址)**：I/O 端口拥有独立的地址空间，不占用内存空间，必须采用专门的 I/O 指令（如 x86 的 `IN`, `OUT`）。

---

## ⚡ 中断系统全流程与多重中断大题

### ❓ 中断处理全过程（硬件隐指令 vs 软件中断服务程序）

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 中断响应与处理 7 步全流程（硬件隐指令 vs 软件服务）</span>
    <span class="diagram-badge">P35 手记草图</span>
  </div>
  <svg viewBox="0 0 720 230" width="100%" height="230">
    <g transform="translate(15, 12)">
      <!-- 硬件隐指令区域 (黄色卡片) -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="320" height="205" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="4,4" rx="8"/>
        <text x="160" y="22" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="800">⚡ 硬件阶段 (中断隐指令 · 纯硬件动作)</text>
        <!-- 硬件步骤 1 -->
        <g transform="translate(20, 38)">
          <rect x="0" y="0" width="280" height="36" fill="rgba(239,68,68,0.12)" stroke="#ef4444" rx="4"/>
          <text x="14" y="22" fill="#ef4444" font-size="11" font-weight="800">1. 关中断 (IF = 0)</text>
          <text x="150" y="22" fill="var(--vp-c-text-2)" font-size="10">禁止新的中断进入</text>
        </g>
        <path d="M 160 74 L 160 90" stroke="#f59e0b" stroke-width="1.8" marker-end="url(#arrow-amber)"/>
        <!-- 硬件步骤 2 -->
        <g transform="translate(20, 90)">
          <rect x="0" y="0" width="280" height="36" fill="rgba(37,99,235,0.12)" stroke="#2563eb" rx="4"/>
          <text x="14" y="22" fill="#2563eb" font-size="11" font-weight="800">2. 保存断点 (PC/PSW 压栈)</text>
          <text x="180" y="22" fill="var(--vp-c-text-2)" font-size="10">压入系统内核栈</text>
        </g>
        <path d="M 160 126 L 160 142" stroke="#f59e0b" stroke-width="1.8" marker-end="url(#arrow-amber)"/>
        <!-- 硬件步骤 3 -->
        <g transform="translate(20, 142)">
          <rect x="0" y="0" width="280" height="36" fill="rgba(16,185,129,0.12)" stroke="#10b981" rx="4"/>
          <text x="14" y="22" fill="#10b981" font-size="11" font-weight="800">3. 引出中断服务程序</text>
          <text x="155" y="22" fill="var(--vp-c-text-2)" font-size="10">向量寻址送入口PC</text>
        </g>
      </g>
      <!-- 硬件到软件交接箭头 -->
      <path d="M 320 160 L 365 160 L 365 56 L 380 56" fill="none" stroke="#2563eb" stroke-width="2.2" marker-end="url(#arrow-blue)"/>
      <text x="350" y="105" text-anchor="middle" fill="#2563eb" font-size="10.5" font-weight="700" transform="rotate(-90 350 105)">转软件服务</text>
      <!-- 软件中断服务程序 (蓝色卡片) -->
      <g transform="translate(370, 0)">
        <rect x="0" y="0" width="320" height="205" fill="rgba(37,99,235,0.06)" stroke="#2563eb" stroke-width="1.8" rx="8"/>
        <text x="160" y="22" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="800">💻 软件阶段 (中断服务程序 · 指令序列)</text>
        <!-- 软件步骤 4 & 5 -->
        <g transform="translate(20, 36)">
          <rect x="0" y="0" width="280" height="32" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
          <text x="12" y="20" fill="var(--vp-c-text-1)" font-size="10.5" font-weight="700">4. 保存现场(寄存器压栈) &amp; 5. 开中断</text>
        </g>
        <path d="M 160 68 L 160 82" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arrow-blue)"/>
        <!-- 软件步骤 6 主体 -->
        <g transform="translate(20, 82)">
          <rect x="0" y="0" width="280" height="36" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2" rx="4"/>
          <text x="140" y="22" text-anchor="middle" fill="#10b981" font-size="11.5" font-weight="800">6. 执行中断服务程序主体 (数据传输)</text>
        </g>
        <path d="M 160 118 L 160 132" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arrow-blue)"/>
        <!-- 软件步骤 7, 8, 9, 10 恢复与返回 -->
        <g transform="translate(20, 132)">
          <rect x="0" y="0" width="280" height="50" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="4"/>
          <text x="12" y="20" fill="var(--vp-c-text-1)" font-size="10.5">7. 关中断 ➔ 8. 恢复现场并还原屏蔽字</text>
          <text x="12" y="38" fill="#2563eb" font-size="10.5" font-weight="700">9. 开中断 ➔ 10. 中断返回指令 (IRET)</text>
        </g>
      </g>
    </g>
    <defs>
      <marker id="arrow-amber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b"/>
      </marker>
    </defs>
  </svg>
</div>

---

### ❓ 中断类型号、中断向量与中断向量地址

* **中断类型号**：外设硬件发给 CPU 的标识编号（如 8 位数）；
* **中断向量**：中断服务程序的**入口地址 (PC)**；
* **中断向量地址**：存放该中断服务程序入口地址的**主存物理地址（向量指针）**；
* **中断向量表**：在主存低端建立的数组，以中断向量地址为索引，存储所有中断向量。

---

### ❓ 408 经典大题：中断响应优先级 vs 处理优先级（屏蔽字表推导）

> **真题设定**：设 A、B、C、D 四个中断源同时到来：
> * **响应优先级（由硬件排队器决定，不可软件更改）**：$A > B > C > D$
> * **处理优先级（由软件屏蔽字动态设定）**：$A > D > C > B$

#### 1. 中断屏蔽字表推导（1 表示屏蔽，0 表示允许打断）
* **A（处理优先级最高）**：屏蔽自己和所有其他中断 $\to$ `1 1 1 1`
* **D（处理优先级第2）**：屏蔽自己及 C, B，仅允许更高优先级的 A 打断 $\to$ `0 1 1 1`
* **C（处理优先级第3）**：屏蔽自己及 B，允许 A, D 打断 $\to$ `0 1 1 0`
* **B（处理优先级最低）**：仅屏蔽自己，允许 A, D, C 打断 $\to$ `0 1 0 0`

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 多重中断嵌套阶梯时序图与屏蔽字映射推演</span>
    <span class="diagram-badge">P36 手记草图</span>
  </div>
  <svg viewBox="0 0 720 220" width="100%" height="220">
    <g transform="translate(15, 12)">
      <!-- 左侧：中断嵌套时序执行轨迹 (阶梯图) -->
      <g transform="translate(0, 0)">
        <!-- Y 轴层级标线 -->
        <text x="35" y="45" text-anchor="end" fill="#ef4444" font-size="11.5" font-weight="800">D 层</text>
        <line x1="45" y1="40" x2="430" y2="40" stroke="var(--vp-c-divider)" stroke-dasharray="2,2"/>
        <text x="35" y="80" text-anchor="end" fill="#f59e0b" font-size="11.5" font-weight="800">C 层</text>
        <line x1="45" y1="75" x2="430" y2="75" stroke="var(--vp-c-divider)" stroke-dasharray="2,2"/>
        <text x="35" y="115" text-anchor="end" fill="#2563eb" font-size="11.5" font-weight="800">B 层</text>
        <line x1="45" y1="110" x2="430" y2="110" stroke="var(--vp-c-divider)" stroke-dasharray="2,2"/>
        <text x="35" y="150" text-anchor="end" fill="#10b981" font-size="11.5" font-weight="800">A 层</text>
        <line x1="45" y1="145" x2="430" y2="145" stroke="var(--vp-c-divider)" stroke-dasharray="2,2"/>
        <text x="35" y="185" text-anchor="end" fill="var(--vp-c-text-3)" font-size="11">主程序</text>
        <line x1="45" y1="180" x2="430" y2="180" stroke="var(--vp-c-text-2)" stroke-width="1.8"/>
        <!-- 时间轴轨迹 Path -->
        <!-- 主程序 -> A -->
        <line x1="45" y1="180" x2="65" y2="180" stroke="var(--vp-c-text-1)" stroke-width="2.5"/>
        <line x1="65" y1="180" x2="65" y2="145" stroke="#10b981" stroke-width="2.5"/>
        <!-- A 执行 -->
        <rect x="65" y="132" width="60" height="24" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="2" rx="3"/>
        <text x="95" y="148" text-anchor="middle" fill="#10b981" font-size="11" font-weight="800">A 执行</text>
        <!-- A 结束 -> 返回主程序 -> B 响应 -->
        <line x1="125" y1="145" x2="125" y2="180" stroke="#10b981" stroke-width="2"/>
        <line x1="125" y1="180" x2="145" y2="180" stroke="var(--vp-c-text-1)" stroke-width="2"/>
        <line x1="145" y1="180" x2="145" y2="110" stroke="#2563eb" stroke-width="2.5"/>
        <!-- B 执行前半段 -->
        <rect x="145" y="98" width="50" height="24" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2" rx="3"/>
        <text x="170" y="114" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">B 响应</text>
        <!-- D 打断 B (阶梯上升到 D) -->
        <line x1="195" y1="110" x2="195" y2="40" stroke="#ef4444" stroke-width="2.5"/>
        <rect x="195" y="28" width="65" height="24" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="2" rx="3"/>
        <text x="227" y="44" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="800">D 抢占(高)</text>
        <!-- D 结束 -> 恢复 B -->
        <line x1="260" y1="40" x2="260" y2="110" stroke="#ef4444" stroke-width="2"/>
        <rect x="260" y="98" width="30" height="24" fill="rgba(37,99,235,0.15)" stroke="#2563eb" rx="3"/>
        <text x="275" y="114" text-anchor="middle" fill="#2563eb" font-size="10">B</text>
        <!-- C 再次打断 B (阶梯上升到 C) -->
        <line x1="290" y1="110" x2="290" y2="75" stroke="#f59e0b" stroke-width="2.5"/>
        <rect x="290" y="63" width="65" height="24" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="2" rx="3"/>
        <text x="322" y="79" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="800">C 抢占(中)</text>
        <!-- C 结束 -> 恢复 B -->
        <line x1="355" y1="75" x2="355" y2="110" stroke="#f59e0b" stroke-width="2"/>
        <rect x="355" y="98" width="45" height="24" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2" rx="3"/>
        <text x="377" y="114" text-anchor="middle" fill="#2563eb" font-size="10.5" font-weight="700">B 收尾</text>
        <!-- B 结束 -> 返回主程序 -->
        <line x1="400" y1="110" x2="400" y2="180" stroke="#2563eb" stroke-width="2"/>
        <line x1="400" y1="180" x2="435" y2="180" stroke="var(--vp-c-text-1)" stroke-width="2.5" marker-end="url(#arrow-blue)"/>
        <text x="435" y="195" fill="var(--vp-c-text-3)" font-size="10.5">时间 t ➔</text>
      </g>
      <!-- 右侧：屏蔽字映射与命题精要 -->
      <g transform="translate(460, 15)">
        <rect x="0" y="0" width="230" height="175" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="115" y="20" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">屏蔽字与优先级映射表</text>
        <line x1="10" y1="28" x2="220" y2="28" stroke="var(--vp-c-divider)"/>
        <text x="15" y="48" fill="#10b981" font-size="11" font-weight="700">A (最高处理): 1 1 1 1</text>
        <text x="15" y="68" fill="#ef4444" font-size="11" font-weight="700">D (次高处理): 0 1 1 1</text>
        <text x="15" y="88" fill="#f59e0b" font-size="11" font-weight="700">C (第3处理):  0 1 1 0</text>
        <text x="15" y="108" fill="#2563eb" font-size="11" font-weight="700">B (最低处理): 0 1 0 0</text>
        <line x1="10" y1="120" x2="220" y2="120" stroke="var(--vp-c-divider)"/>
        <text x="15" y="140" fill="var(--vp-c-text-1)" font-size="10.5" font-weight="700">💡 408 秒杀口诀：</text>
        <text x="15" y="156" fill="var(--vp-c-text-2)" font-size="10">处理优先级越高，屏蔽字中“1”越多！</text>
        <text x="15" y="168" fill="var(--vp-c-text-2)" font-size="10">响应排队看硬件，嵌套打断看屏蔽！</text>
      </g>
    </g>
  </svg>
</div>
1. 硬件首先响应优先级最高的 **A**，A 屏蔽所有，顺利执行完毕返回；
2. 硬件接着响应就绪队列中硬件优先级最高的 **B**；
3. B 保存现场开中断后，就绪的 **D** 因处理优先级高于 B，**立即打断 B 发生嵌套**；
4. D 执行完毕返回到 B，就绪的 **C** 处理优先级依然高于 B，**再次打断 B 发生嵌套**；
5. C 执行完毕返回 B，B 最终执行完毕恢复现场返回原主程序。

---

## 🚀 直接内存访问 (DMA) 传输机制

### ❓ DMA 与主机/外设的数据传输单位
* **DMA 控制器与主存之间**：以 **数据块 (Block)** 为单位进行批量传输；
* **DMA 控制器与 I/O 设备接口之间**：以 **字或字节** 为单位逐个读取缓冲。

---

### ❓ DMA 的三种总线控制方式

1. **停止 CPU 访存法（突发传送）**：DMA 传送整块期间完全剥夺总线控制权，CPU 暂停访存，DMA 效率最高，CPU 停顿大；
2. **周期挪用法（周期窃取法）**：当 I/O 设备准备好一个字时，DMA 控制器挪用/窃取一个总线存取周期，优先于 CPU 访存；
3. **交替访存法（分时复用）**：将每个总线周期划分为前半段给 CPU、后半段给 DMA，两者互不影响，无需总线申请释放。

---

### ❓ DMA 传送的三大阶段（必考考点）

$$\text{预处理（初始化阶段）} \longrightarrow \text{数据传送阶段} \longrightarrow \text{后处理（结束阶段）}$$

::: tip 💡 核心避坑点
* **预处理阶段**：由 CPU 执行几条 I/O 指令初始化 DMA 控制器的起始主存地址、传输字计数器；
* **数据传送阶段**：由 DMA 控制器与外设、主存硬件自动传输，**完全不需要 CPU 介入**；
* **后处理阶段**：**仅在整批数据块全部传送完毕时，DMA 控制器才向 CPU 发出中断请求**，通知 CPU 进行收尾检验！
:::


