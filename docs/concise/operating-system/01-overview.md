# 第1章 操作系统概述与运行机制 · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P2~P4，涵盖操作系统五大发展阶段演进、特权指令与双模式运行（PSW）、中断与异常全景辨析（故障/自陷/终止）、系统调用全流程、32位进程内存映像、内核架构演进（宏内核/微内核/外核）、操作系统的引导加载（BIOS $\to$ MBR $\to$ PBR）、以及虚拟机架构分类。

---

## ⏳ 操作系统发展阶段与演变特征

### ❓ 操作系统的五大演进阶段特征速记

1. **手工操作阶段**：
   * **关键词**：**纸带**、人机矛盾严重、CPU 绝大部分时间处于空闲等待人工装卸纸带。
2. **单道批处理系统**：
   * **关键词**：**外围机**、**监督程序**、**磁带**（作业串行执行）。
   * 💡 **外围机的作用**：将慢速纸带输入转存到高速磁带上，实现 I/O 设备与 CPU 处理机的并行工作。
3. **多道批处理系统**：
   * **关键词**：**并发执行**、资源利用率高；**严重缺陷**：**无交互能力**。
4. **分时操作系统**：
   * **关键词**：**时间片**、人机交互、独立共享、完全公平；**缺点**：无法保证紧急任务的优先处理。
5. **实时操作系统**：
   * **关键词**：**及时性**、**高可靠性**。
   * 分类：**硬实时**（截止时间前必须完成，如航天、武器控制）与 **软实时**（允许适度延迟，如订票系统、流媒体）。

---

## 🛡️ 特权指令、双模式与内核态转化

### ❓ 什么样的指令是特权指令？

* **特权指令**：直接与系统底层状态、硬件资源、安全隔离强相关的指令（如 I/O 操作、清空内存、设置 PSW、关中断、修改页表基址寄存器等）。
* **硬件控制**：程序状态字寄存器 (**PSW**) 中有专门的状态位（如特权级位）标识当前运行在 **用户态 (目态)** 还是 **内核态 / 核心态 (管态)**。

---

### ❓ 什么情况下用户态会转化为内核态？

1. **系统调用 (System Call)**：用户程序主动请求操作系统内核提供服务；
2. **外中断 (Hardware Interrupt)**：外部硬件设备发出信号（如时钟中断、键盘输入、磁盘 I/O 完成）；
3. **内中断 / 异常 (Exception)**：指令执行过程中遇到错误或特殊条件（如非法执行特权指令、除以零、缺页故障）。

::: tip 💡 408 两大核心定律
1. **中断（广义中断：外中断 + 异常）是用户态进入内核态的“唯一途径”**！
2. 从内核态返回用户态，必须通过执行一条**特权指令**（如修改 PSW 特权级位）来实现。
:::

---

## ⚡ 中断与异常深度全景辨析

```
                 ┌── 故障 (Fault): 可恢复软错误，处理完重新执行引起故障的本条指令 (如缺页)
  ┌── 异常 ─────┼── 自陷 (Trap): 故意安排的陷入，处理完执行下一条指令 (如系统调用)
  │  (内中断)    └── 终止 (Abort): 致命硬件故障，不可恢复，直接终止进程 (如内存校验错)
  │  * 与当前指令强相关，不可屏蔽，无需等指令周期结束即可响应
──┤
  │  ┌── 可屏蔽中断 (INTR): 优先级较低的外设中断，可通过 IF 标志屏蔽
  └── 外中断 ───┤
     (狭义中断) └── 不可屏蔽中断 (NMI): 极为紧急的外部事件 (如掉电)，无法屏蔽
     * 来自 CPU 外部，与当前指令无关，必须在当前指令执行周期的末尾响应
```

---

### ❓ 系统调用的执行四步法

$$\text{传递参数} \longrightarrow \text{执行陷入指令 (Trap)} \longrightarrow \text{查表转入内核例程} \longrightarrow \text{返回用户态}$$

1. **传参**：用户程序将系统调用号及所需参数存入通用寄存器（或压入用户栈）；
2. **执行陷入指令 (Trap / Syscall / INT)**：由用户程序在**用户态**执行该指令（陷入指令是**非特权指令**！），触发软中断，硬件自动将 CPU 转入**内核态**；
3. **查表处理**：操作系统内核根据系统调用号在系统调用向量表中查找对应的服务例程入口并执行特权操作；
4. **结果返回**：将执行结果放回寄存器，通过中断返回特权指令降级回用户态，继续执行下一条指令。

---

## 🧠 进程虚拟内存映像结构

### ❓ 32 位系统进程虚拟内存布局图

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 32 位 Linux 进程虚拟地址空间映像结构</span>
    <span class="diagram-badge">P39 手记草图</span>
  </div>
  <svg viewBox="0 0 720 280" width="100%" height="280">
    <g transform="translate(15, 12)">
      <!-- 虚拟内存主地址塔柱 -->
      <g transform="translate(120, 0)">
        <!-- 1. 内核空间 (1GB: 0xC0000000 ~ 0xFFFFFFFF) -->
        <rect x="0" y="0" width="280" height="50" fill="rgba(239,68,68,0.18)" stroke="#ef4444" stroke-width="2" rx="4"/>
        <text x="140" y="22" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="800">内核虚拟内存空间 (1 GB)</text>
        <text x="140" y="38" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10">0xC0000000 ~ 0xFFFFFFFF (所有进程共享，内核态专享)</text>
        <text x="-10" y="10" text-anchor="end" fill="var(--vp-c-text-3)" font-size="10.5">0xFFFFFFFF (高位)</text>
        <text x="-10" y="52" text-anchor="end" fill="#ef4444" font-size="10.5" font-weight="700">0xC0000000</text>
        <!-- 2. 用户栈 (Stack) 向下增长 -->
        <rect x="0" y="55" width="280" height="36" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="1.8" rx="3"/>
        <text x="140" y="73" text-anchor="middle" fill="#2563eb" font-size="11.5" font-weight="700">用户栈 (Stack) 局部变量、函数调用</text>
        <path d="M 140 78 L 140 88" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
        <text x="290" y="73" fill="#2563eb" font-size="10" font-weight="600">由高到低 ↓ 动态增长</text>
        <!-- 3. 动态库共享映射区 (mmap) -->
        <rect x="0" y="94" width="280" height="28" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)" stroke-dasharray="3,3"/>
        <text x="140" y="112" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10.5">共享库映射区 (mmap / 动态链接库)</text>
        <!-- 4. 用户堆 (Heap) 向上增长 -->
        <rect x="0" y="125" width="280" height="36" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.8" rx="3"/>
        <path d="M 140 148 L 140 138" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
        <text x="140" y="152" text-anchor="middle" fill="#10b981" font-size="11.5" font-weight="700">用户堆 (Heap) malloc / new</text>
        <text x="290" y="146" fill="#10b981" font-size="10" font-weight="600">由低到高 ↑ 动态增长</text>
        <!-- 5. 未初始化数据段 .bss -->
        <rect x="0" y="164" width="280" height="25" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="140" y="181" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">未初始化数据段 (.bss) 运行时清零</text>
        <!-- 6. 已初始化数据段 .data -->
        <rect x="0" y="189" width="280" height="25" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="140" y="206" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">已初始化全局数据段 (.data)</text>
        <!-- 7. 代码段 .text -->
        <rect x="0" y="214" width="280" height="36" fill="rgba(37,99,235,0.08)" stroke="#2563eb" stroke-width="1.8" rx="3"/>
        <text x="140" y="234" text-anchor="middle" fill="#2563eb" font-size="11.5" font-weight="700">只读代码段 (.text) 机器指令</text>
        <text x="-10" y="246" text-anchor="end" fill="var(--vp-c-text-3)" font-size="10.5">0x00000000 (低位)</text>
      </g>
      <!-- 右侧：考点辨析卡片 -->
      <g transform="translate(480, 10)">
        <rect x="0" y="0" width="210" height="240" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="105" y="24" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12" font-weight="800">408 核心考点辨析</text>
        <line x1="10" y1="34" x2="200" y2="34" stroke="var(--vp-c-divider)"/>
        <text x="12" y="55" fill="#ef4444" font-size="11" font-weight="700">3:1 空间切分准则：</text>
        <text x="12" y="73" fill="var(--vp-c-text-2)" font-size="10.5">32 位系统共 4GB 空间：</text>
        <text x="12" y="90" fill="var(--vp-c-text-2)" font-size="10.5">低位 3GB 归用户独享；</text>
        <text x="12" y="107" fill="var(--vp-c-text-2)" font-size="10.5">高位 1GB 归内核统一映射。</text>
        <line x1="10" y1="120" x2="200" y2="120" stroke="var(--vp-c-divider)"/>
        <text x="12" y="140" fill="#2563eb" font-size="11" font-weight="700">栈与堆增长方向相对：</text>
        <text x="12" y="158" fill="var(--vp-c-text-2)" font-size="10">栈由高地址向低地址扩展；</text>
        <text x="12" y="174" fill="var(--vp-c-text-2)" font-size="10">堆由低地址向高地址扩展；</text>
        <text x="12" y="190" fill="var(--vp-c-text-2)" font-size="10">相向而生，中间空隙给共享库。</text>
        <line x1="10" y1="202" x2="200" y2="202" stroke="var(--vp-c-divider)"/>
        <text x="12" y="222" fill="#10b981" font-size="10" font-weight="700">段保护：只读代码段防篡改</text>
      </g>
    </g>
  </svg>
</div>

---

## 🏗️ 操作系统体系架构演进

### ❓ 分层、模块化、宏内核与微内核对比

| 架构类型 | 核心优势 | 致命缺陷 | 典型代表 |
| :--- | :--- | :--- | :--- |
| **分层结构** | 自底向上层层调用，接口清晰，易于调试验证 | 调用必须逐层穿透，运行开销大；难以严格定义各层边界 | THE 系统 |
| **模块化结构** | 支持动态加载驱动与模块，多模块可并行协同开发 | 接口繁杂缺乏统一控制，模块间依赖错综脆弱 | 现代 Linux/Windows 驱动 |
| **宏内核 (单内核)** | **高性能**！所有服务均在内核态通过直接函数调用交互 | 内核代码极其庞大，单一模块（如显卡驱动）崩溃可导致整机宕机 | Linux, Android |
| **微内核** | 内核极小，仅留核心机制；**高可靠性、高安全性、极佳可扩展性** | 各服务驻留用户态，**频繁进出内核态进行 IPC 消息传递，带来额外开销** | 鸿蒙 (HarmonyOS), Mach, QNX |

::: tip 💡 微内核到底保留了什么功能？
1. 进程管理最基础的原语（如进程创建、进程调度、IPC 消息传递通道）；
2. 最基础的内存地址映射转换机制；
3. 底层硬件中断处理与时钟管理。
* ⚠️ **页面置换算法、文件系统、设备驱动、网络协议栈等全部移入用户态**！
:::

* **外核 (Exokernel)**：不负责对物理硬件进行高级抽象与隐藏，而是**直接分配物理资源**并负责多用户保护隔离，让应用程序自定义管理硬件。

---

## 🚀 操作系统的引导过程 (Booting)

```
[开机加电] ──> [ROM 中 BIOS 执行 POST 自检] ──> [读磁盘 0 磁道 0 扇区 MBR] ──> [查找活动分区 PBR] ──> [加载 Bootloader] ──> [初始化内核]
```

1. **BIOS 自检 (POST)**：CPU 复位后 PC 指针指向主板 ROM 中的 BIOS 第一条指令，执行硬件自检；
2. **读取 MBR (主引导记录)**：BIOS 读取磁盘 0 号扇区（MBR，占 512B），包含磁盘分区表 (DPT)；
3. **读取 PBR (分区引导记录)**：MBR 找到标记为“活动分区 (Active)”的系统分区，读取该分区首部的 PBR；
4. **加载内核**：PBR 启动引导程序（如 GRUB / Windows Boot Manager），将操作系统内核镜像加载至内存并移交控制权。

---

## 💻 虚拟机架构分类对比

* **第 1 类虚拟机 (Type-1 Hypervisor，裸金属架构)**：
  * 直接运行在裸机硬件之上，类似外核直接调度物理资源，拥有最高硬件特权级；性能高（如 VMware ESXi, KVM）。
* **第 2 类虚拟机 (Type-2 Hypervisor，宿主架构)**：
  * 运行在普通操作系统之上，依靠宿主 OS 的系统调用来申请资源；部分模块在用户态，部分在内核态（如 VMware Workstation, VirtualBox）。


