# 第3章 存储器层次结构 (Cache / 主存 / 磁盘) · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P5~P7，涵盖主存低位交叉流水线、DRAM 三大刷新机制、字位同时扩展芯片设计、磁盘/SSD 物理特性与寻道计算、RAID 0~5 阵列、三级联动访存全流程图（TLB + Cache + 页表）、以及 Cache 替换与写一致性策略。

---

## ⚡ 主存组织与低位交叉编址

### ❓ 低位交叉编址与流水线连续存取时延

* **模块数与周期约束**：为保证连续读取无冲突，多体交叉存储模块数 $m$ 应满足：
  $$m \ge \frac{T_{\text{存}}}{T_{\text{总线}}}$$
* **流水线连续存取并传送 $W$ 个字的总时间**：
  $$T_W = t + T_m + (W-1) \cdot t + t$$
  * 第 1 个 $t$：送访存地址；
  * $T_m$：存储芯片内部读出延迟；
  * $(W-1) \cdot t$：后续 $W-1$ 个字在各体间流水线交替读出；
  * 最后一个 $t$：传送最后读出的字。

---

### ❓ DRAM 的三大刷新方式对比

> DRAM 存储元由电容电荷维持，电荷易漏电，通常必须在 **2ms 刷新周期** 内对所有行刷新一遍（按行刷新）。

| 刷新方式 | 具体工作机理 | 死区 (Dead Time) 表现 | 考研评价 |
| :--- | :--- | :--- | :--- |
| **集中刷新** | 在 2ms 刷新周期的最后集中安排一段时间只刷不读写 | **存在明显的集中“死时间”**，期间 CPU 无法访问主存 | 简单但严重影响 CPU 实时处理 |
| **分散刷新** | 把每个工作周期一分为二：前半段正常读写，后半段固定刷新某一行 | **完全没有集中死区** | 工作周期翻倍，严重拖慢整机速度 |
| **异步刷新** | 将所有行的刷新均匀分散到 2ms 期间。设共有 128 行，则每隔 $2\text{ms} / 128 = 15.625\ \mu\text{s}$ 刷新一行 | 仅在刷新单行时占用极短暂总线，几乎感知不到死区 | **最合理方案，408 重点考查** |

---

### ❓ 字位同时扩展法设计存储器 (1K×4bit $\to$ 4K×8bit)

* **芯片总数计算**：
  $$\text{芯片数} = \frac{4\text{K} \times 8\text{ bit}}{1\text{K} \times 4\text{ bit}} = 4 \times 2 = \mathbf{8\text{ 片}}$$
* **位扩展（4位 $\to$ 8位）**：
  * 每 2 片芯片组成一组，数据线 $D_0 \sim D_3$ 接芯片 1，$D_4 \sim D_7$ 接芯片 2，并联同一个片选信号。
* **字扩展（1K $\to$ 4K）**：
  * 共分为 4 组。芯片内部寻址 $1\text{K} = 2^{10}$ 需 $A_0 \sim A_9$（共 10 根地址线）；
  * 总地址空间 $4\text{K} = 2^{12}$ 需 $A_0 \sim A_{11}$（共 12 根地址线）；
  * 高位地址线 $A_{11}, A_{10}$ 接入 2-4 译码器，译码输出 4 组独立的片选信号 $\overline{CS}_0 \sim \overline{CS}_3$。
::: tip 💡 408 核心细节
若考题要求写出每组芯片的地址范围，必须严格写为十六进制区间（例如组0：`000H ~ 3FFH`，组1：`400H ~ 7FFH` 等）！
:::

---

## 💿 磁盘与固态硬盘 (SSD)

### ❓ 盘面、柱面、磁道与扇区的关系
* **盘面与磁头**：每个盘面对应一个专属读写磁头；
* **柱面与磁道**：盘片表面同心圆为磁道；所有盘面上半径相同的磁道在垂直方向构成一个“柱面”；
* **扇区**：磁道被等分为若干个扇区，**扇区是磁盘可寻址存取的最小物理单位**（通常为 512B 或 4KB）。

### ❓ 磁盘平均存取时间计算公式
$$\text{平均存取时间} = \text{寻道时间 (磁头移到指定磁道)} + \text{旋转延迟时间 (平均转动半周)} + \text{传输时间}$$

---

### ❓ SSD 读写单位 vs 擦除单位（必考易混点）

::: tip 💡 408 极易混淆命题陷阱
* **SSD 读写最小单位**：**页 (Page)**（通常 4KB）；
* **SSD 擦除最小单位**：**块 (Block)**（一个 Block 包含数十到数百个 Page，如 128 个页）；
* **原因**：闪存物理特性决定了“写之前必须先擦除”，且闪存只能以“块”为单位加高压擦除，因此写入存在写放大与磨损均衡 (Wear Leveling)。
:::

---

### ❓ 磁盘阵列 RAID 0 ~ RAID 5 核心对比

* **RAID 0 (条带化)**：数据分块并发写入多个磁盘，**无冗余、无校验**。读写速率最高，但任意坏一块整阵列数据尽失。
* **RAID 1 (镜像备份)**：每个数据盘各配一个完全一致的镜像盘，安全性最高，但磁盘利用率仅 **50%**。
* **RAID 2 (海明码纠错)**：采用海明码校验，位交叉存放。
* **RAID 3 / 4 (奇偶校验)**：配备一块独立的专用奇偶校验盘（3为位交叉，4为块交叉）。专用校验盘成为写入性能瓶颈。
* **RAID 5 (分布式奇偶校验)**：**将奇偶校验信息均匀分散在所有磁盘中**，无独立瓶颈盘，允许任意损坏一块磁盘而不丢失数据，磁盘利用率为 $(N-1)/N$。

---

## 🗺️ 访存全流程状态机 (TLB + Cache + 页表联动)

### ❓ 核心必背大题：TLB、页表与 Cache 协同访存全流程

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · TLB + 页表 + Cache 三级联动协同访存全流程状态机</span>
    <span class="diagram-badge">P27 手记草图</span>
  </div>
  <svg viewBox="0 0 720 320" width="100%" height="320">
    <g transform="translate(15, 12)">
      <!-- 1. 虚地址 VA 输入 -->
      <g transform="translate(140, 0)">
        <rect x="0" y="0" width="190" height="30" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="4"/>
        <text x="50" y="19" text-anchor="middle" fill="#2563eb" font-size="11.5" font-weight="700">虚拟页号 VPN</text>
        <line x1="100" y1="0" x2="100" y2="30" stroke="var(--vp-c-divider)"/>
        <text x="145" y="19" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="11.5">页内偏移</text>
        <text x="95" y="-6" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="800">CPU 虚拟地址 (VA)</text>
      </g>
      <line x1="190" y1="30" x2="190" y2="55" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
      <!-- 2. 查询快表 TLB -->
      <g transform="translate(110, 55)">
        <polygon points="80,0 160,20 80,40 0,20" fill="rgba(37,99,235,0.12)" stroke="#2563eb" stroke-width="2"/>
        <text x="80" y="24" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="800">查询 TLB 快表</text>
      </g>
      <!-- TLB 命中分支 (左直通) -->
      <path d="M 110 75 L 45 75 L 45 200 L 125 200" fill="none" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow-green)"/>
      <text x="35" y="135" text-anchor="middle" fill="#10b981" font-size="11" font-weight="800" transform="rotate(-90 35 135)">TLB 命中 (极速)</text>
      <!-- TLB 未命中 -> 查页表 (向下) -->
      <line x1="190" y1="95" x2="190" y2="120" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>
      <text x="210" y="112" fill="#ef4444" font-size="10.5" font-weight="700">TLB 缺失</text>
      <!-- 3. 查慢表 (页表) -->
      <g transform="translate(110, 120)">
        <polygon points="80,0 160,20 80,40 0,20" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" stroke-width="2"/>
        <text x="80" y="24" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="800">查询主存页表</text>
      </g>
      <!-- 页表命中 -> 更新 TLB 并到 PA -->
      <line x1="190" y1="160" x2="190" y2="185" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
      <text x="200" y="176" fill="#10b981" font-size="10.5" font-weight="700">在主存中(命中)</text>
      <!-- 页表缺页 -> 中断处理 -->
      <line x1="270" y1="140" x2="330" y2="140" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>
      <text x="300" y="132" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="700">缺页!</text>
      <g transform="translate(335, 125)">
        <rect x="0" y="0" width="130" height="32" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1.8" rx="4"/>
        <text x="65" y="20" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">🚨 触发缺页异常中断</text>
      </g>
      <!-- 缺页处理流程 -->
      <path d="M 400 157 L 400 178 L 310 178" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arrow-red)"/>
      <text x="405" y="172" fill="var(--vp-c-text-3)" font-size="9.5">调页换入并更新页表与TLB</text>
      <!-- 4. 转换出的物理地址 PA -->
      <g transform="translate(130, 185)">
        <rect x="0" y="0" width="180" height="28" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2" rx="4"/>
        <text x="45" y="18" text-anchor="middle" fill="#10b981" font-size="11" font-weight="800">物理块号 PFN</text>
        <line x1="90" y1="0" x2="90" y2="28" stroke="#10b981"/>
        <text x="135" y="18" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="11">块内偏移</text>
        <text x="90" y="-5" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="700">拼接得到物理地址 (PA)</text>
      </g>
      <line x1="220" y1="213" x2="220" y2="238" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
      <!-- 5. 查 Cache -->
      <g transform="translate(140, 238)">
        <polygon points="80,0 160,20 80,40 0,20" fill="rgba(37,99,235,0.12)" stroke="#2563eb" stroke-width="2"/>
        <text x="80" y="24" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="800">查询 Cache</text>
      </g>
      <!-- Cache 命中 -->
      <path d="M 140 258 L 80 258 L 80 290 L 140 290" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
      <text x="90" y="252" fill="#10b981" font-size="10.5" font-weight="700">命中</text>
      <!-- Cache 缺失 -->
      <path d="M 300 258 L 360 258 L 360 290 L 300 290" fill="none" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>
      <text x="310" y="252" fill="#ef4444" font-size="10.5" font-weight="700">缺失(调主存块)</text>
      <!-- 6. 最终交付 CPU -->
      <g transform="translate(145, 278)">
        <rect x="0" y="0" width="150" height="26" fill="rgba(37,99,235,0.2)" stroke="#2563eb" stroke-width="2" rx="4"/>
        <text x="75" y="17" text-anchor="middle" fill="#2563eb" font-size="11.5" font-weight="800">🎉 将数据交付 CPU 寄存器</text>
      </g>
      <!-- 右侧 408 核心命题必背定律 -->
      <g transform="translate(485, 10)">
        <rect x="0" y="0" width="205" height="280" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="102" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12" font-weight="800">408 核心真题推论定律</text>
        <line x1="10" y1="32" x2="195" y2="32" stroke="var(--vp-c-divider)"/>
        <text x="12" y="52" fill="#10b981" font-size="11" font-weight="700">① TLB 命中 ➔ 页表必命中</text>
        <text x="12" y="70" fill="var(--vp-c-text-2)" font-size="10">快表是慢表的子集缓存</text>
        <text x="12" y="96" fill="#10b981" font-size="11" font-weight="700">② Cache 命中 ➔ 页面必在主存</text>
        <text x="12" y="114" fill="var(--vp-c-text-2)" font-size="10">数据已在Cache中，绝不缺页</text>
        <text x="12" y="140" fill="#ef4444" font-size="11" font-weight="700">③ 页表缺页 ➔ TLB/Cache必脱靶</text>
        <text x="12" y="158" fill="var(--vp-c-text-2)" font-size="10">页面尚未调入内存，无从缓存</text>
        <text x="12" y="184" fill="#2563eb" font-size="11" font-weight="700">④ TLB 未命中 ➔ Cache仍可命中</text>
        <text x="12" y="202" fill="var(--vp-c-text-2)" font-size="10">二者各司其职，无包含关系</text>
        <line x1="10" y1="218" x2="195" y2="218" stroke="var(--vp-c-divider)"/>
        <text x="12" y="238" fill="#f59e0b" font-size="10.5" font-weight="700">硬件 vs 软件分工：</text>
        <text x="12" y="254" fill="var(--vp-c-text-2)" font-size="10">TLB/Cache查找：纯硬件极速</text>
        <text x="12" y="268" fill="var(--vp-c-text-2)" font-size="10">缺页异常中断：OS 软件内核接管</text>
      </g>
    </g>
  </svg>
</div>

### ❓ TLB、Cache、页表的表项字段对比

| 存储结构 | 核心表项字段组成 | 索引与计算机制 |
| :--- | :--- | :--- |
| **TLB (快表)** | 页号 (Tag)、页框号 (物理块号)、有效位、修改位 | 全相联或组相联高速硬件查找 |
| **Cache (高速缓存)** | 主存 Tag、有效位 (Valid)、脏位 (Dirty)、替换控制位 (LRU) | 直接/全相联/组相联映射 |
| **页表 (慢表)** | （页号隐含）、页框号、有效位/存在位、访问位、脏位、**外存磁盘地址** | **页表中不显式存储页号**，通过页号作为数组下标偏移直接定位物理基址！ |

::: tip 💡 页表基址寄存器 (PTBR)
存放当前进程**页表的物理起始地址**与**页表长度**。进程切换时更新 PTBR 内容。
:::

---

## 🔄 Cache 替换算法与写一致性策略

### ❓ 三大 Cache 替换算法

1. **FIFO (先进先出)**：优先淘汰最早调入 Cache 的块。未考虑局部性，可能出现 Belady 异常；
2. **LRU (近期最少使用)**：淘汰最长时间未被访问的块。基于时间局部性，**命中率最高，408 核心主流考查**；
3. **LFU (最不经常使用)**：淘汰历史访问频次计数最低的块。

---

### ❓ Cache 与主存写一致性策略全解

* **写命中时的更新策略**：
  * **全写法 (Write-through)**：命中时**同时写 Cache 和主存**。访存开销大，常用“写缓冲 (Write Buffer)”减少等待；
  * **回写法 (Write-back)**：命中时**只修改 Cache**，并将其脏位置 1；仅当该块被淘汰换出时才写回主存。
* **写未命中时的分配策略**：
  * **写分配法 (Write-allocate)**：写未命中时，先将主存块调入 Cache，再在 Cache 中修改写入（**通常与回写法配合**）；
  * **非写分配法 (No-write-allocate)**：写未命中时直接写入主存，不调入 Cache（**通常与全写法配合**）。


