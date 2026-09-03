# 第4章 文件管理与磁盘组织 · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P10~P11 与 P13，涵盖四大文件逻辑结构（索引顺序文件最佳分组推导）、三大物理分配方式（连续/链接/索引）、目录项 FCB 瘦身至索引节点 (i-node)、混合索引大题容量推导 (1057KB 经典真题)、软硬链接底层机理、四大磁盘空闲存储管理（位示图与成组链接）、以及磁盘格式化与物理寻址结构。

---

## 📂 文件的逻辑结构

### ❓ 顺序、索引、索引顺序与直接文件辨析

1. **顺序文件**：
   * 记录在逻辑上按一定顺序连续排列（串结构或按关键字顺序排列）；
   * 💡 **定长记录特性**：若每个记录长度固定为 $L$，则可以直接通过起始物理地址和记录号 $i$ 计算物理偏移：
     $$\text{Address} = \text{Base} + i \times L \quad \implies \text{支持高效随机直接存取}$$
2. **索引文件**：
   * 专门为变长记录建立索引表，索引表项包含 `[ 关键字 | 记录长度 | 指向记录的物理指针 ]`；
   * 方便变长记录的随机存取与动态增删。
3. **索引顺序文件（分组索引）**：
   * 将全部记录分组，每个组的第一个记录建立一个索引表项；
   * 💡 **最佳分组方案（408 核心算例）**：
     * 设文件共有 $N$ 条记录，将其分为 $\sqrt{N}$ 组，每组包含 $\sqrt{N}$ 条记录；
     * 顺序检索索引表平均需 $\frac{\sqrt{N}}{2}$ 次，组内顺序检索平均需 $\frac{\sqrt{N}}{2}$ 次；
     * **平均查找记录次数仅需 $\sqrt{N}$ 次**（远优于全表顺序检索的 $\frac{N}{2}$ 次）！
4. **直接文件（散列文件）**：
   * 通过 Hash 函数直接将关键字映射为物理存储块号，存取极快。

---

## 💾 文件的物理分配方式

### ❓ 连续分配、链接分配与索引分配

* **连续分配**：
  * 每个文件在磁盘上占用一组连续的物理盘块；
  * **优点**：支持顺序访问和快速随机存取，读写磁头移动距离最短；
  * **缺点**：产生严重的**外部磁盘碎片**，且文件难以动态追加增长。
* **链接分配**：
  * **隐式链接**：每个盘块中预留少量字节存放指向下一盘块的物理指针。**缺点：只能顺序访问，若中间盘块指针损坏则后续数据全失**；
  * **显式链接 (FAT 文件分配表)**：将所有物理块的链接指针集中存放在一张常驻内存的 **FAT 表** 中。目录项仅记录起始块号。**优点：支持随机访问（查内存表即可定位任意块），无外部碎片**；缺点：FAT 表占用内存空间。
* **索引分配**：
  * 系统为每个文件分配一个专用的**索引块**，存放该文件所有数据块的物理块号指针。

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 显式链接 FAT (文件分配表) 目录与内存指针链检索全景</span>
    <span class="diagram-badge">P46 手记草图</span>
  </div>
  <svg viewBox="0 0 720 200" width="100%" height="200">
    <g transform="translate(15, 12)">
      <!-- 1. 目录项 FCB (左侧) -->
      <g transform="translate(10, 30)">
        <rect x="0" y="0" width="140" height="90" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="6"/>
        <text x="70" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">文件目录项 (FCB)</text>
        <line x1="8" y1="30" x2="132" y2="30" stroke="var(--vp-c-divider)"/>
        <text x="14" y="52" fill="var(--vp-c-text-2)" font-size="11">文件名: </text>
        <text x="62" y="52" fill="#2563eb" font-size="11" font-weight="700">file.txt</text>
        <text x="14" y="75" fill="var(--vp-c-text-2)" font-size="11">起始块号: </text>
        <text x="70" y="75" fill="#10b981" font-size="12" font-weight="800">2</text>
      </g>
      <!-- 指针从目录项指向 FAT 表块 2 -->
      <path d="M 150 105 C 190 105, 190 65, 230 65" fill="none" stroke="#10b981" stroke-width="2.2" marker-end="url(#arrow-green)"/>
      <!-- 2. 内存 FAT 表 (中间) -->
      <g transform="translate(230, 10)">
        <rect x="0" y="0" width="180" height="165" fill="rgba(37,99,235,0.06)" stroke="#2563eb" stroke-width="2" rx="6"/>
        <text x="90" y="20" text-anchor="middle" fill="#2563eb" font-size="11.5" font-weight="800">常驻内存 FAT 表</text>
        <!-- 表头 -->
        <rect x="10" y="28" width="80" height="22" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
        <text x="50" y="43" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10" font-weight="700">物理盘块号</text>
        <rect x="90" y="28" width="80" height="22" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
        <text x="130" y="43" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10" font-weight="700">下一块指针</text>
        <!-- 行 0 -->
        <rect x="10" y="50" width="80" height="22" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="50" y="65" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10">0</text>
        <rect x="90" y="50" width="80" height="22" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
        <text x="130" y="65" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10">-</text>
        <!-- 行 2 (起始) -->
        <rect x="10" y="72" width="80" height="22" fill="rgba(16,185,129,0.15)" stroke="#10b981"/>
        <text x="50" y="87" text-anchor="middle" fill="#10b981" font-size="11" font-weight="800">2 (首块)</text>
        <rect x="90" y="72" width="80" height="22" fill="rgba(16,185,129,0.15)" stroke="#10b981"/>
        <text x="130" y="87" text-anchor="middle" fill="#10b981" font-size="11" font-weight="800">5 ➔</text>
        <!-- 行 5 (次块) -->
        <rect x="10" y="94" width="80" height="22" fill="rgba(37,99,235,0.15)" stroke="#2563eb"/>
        <text x="50" y="109" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">5</text>
        <rect x="90" y="94" width="80" height="22" fill="rgba(37,99,235,0.15)" stroke="#2563eb"/>
        <text x="130" y="109" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">9 ➔</text>
        <!-- 行 9 (尾块) -->
        <rect x="10" y="116" width="80" height="22" fill="rgba(239,68,68,0.15)" stroke="#ef4444"/>
        <text x="50" y="131" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">9</text>
        <rect x="90" y="116" width="80" height="22" fill="rgba(239,68,68,0.15)" stroke="#ef4444"/>
        <text x="130" y="131" text-anchor="middle" fill="#ef4444" font-size="10.5" font-weight="800">-1 (EOF)</text>
      </g>
      <!-- 3. 外存实际物理盘块 (右侧) -->
      <g transform="translate(450, 20)">
        <text x="80" y="15" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="11" font-weight="700">外存对应物理盘块</text>
        <rect x="10" y="30" width="140" height="26" fill="rgba(16,185,129,0.15)" stroke="#10b981" rx="4"/>
        <text x="80" y="47" text-anchor="middle" fill="#10b981" font-size="11" font-weight="700">磁盘块 2 [数据 1]</text>
        <rect x="10" y="65" width="140" height="26" fill="rgba(37,99,235,0.15)" stroke="#2563eb" rx="4"/>
        <text x="80" y="82" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">磁盘块 5 [数据 2]</text>
        <rect x="10" y="100" width="140" height="26" fill="rgba(239,68,68,0.15)" stroke="#ef4444" rx="4"/>
        <text x="80" y="117" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">磁盘块 9 [数据 3·完]</text>
      </g>
      <!-- 408 核心速记总结卡 -->
      <g transform="translate(615, 15)">
        <rect x="0" y="0" width="90" height="155" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="6"/>
        <text x="45" y="18" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10" font-weight="700">FAT 考点</text>
        <line x1="5" y1="26" x2="85" y2="26" stroke="var(--vp-c-divider)"/>
        <text x="5" y="44" fill="#10b981" font-size="9.5" font-weight="700">常驻内存</text>
        <text x="5" y="60" fill="var(--vp-c-text-2)" font-size="9">极速查表</text>
        <text x="5" y="82" fill="#2563eb" font-size="9.5" font-weight="700">随机存取</text>
        <text x="5" y="98" fill="var(--vp-c-text-2)" font-size="9">无需读盘</text>
        <text x="5" y="120" fill="#ef4444" font-size="9.5" font-weight="700">无外部碎片</text>
        <text x="5" y="136" fill="var(--vp-c-text-2)" font-size="9">离散成链</text>
      </g>
    </g>
  </svg>
</div>

---

## 🧮 经典综合大题：多级混合索引容量推导

### ❓ 408 经典手写算例（1057 KB 推导）

> **真题设定**：
> * 某操作系统文件索引节点 (i-node) 包含 **7 个地址项**：
>   * **4 个直接索引项**
>   * **2 个一级间接索引项**
>   * **1 个二级间接索引项**
> * 每个地址项指针占 **4 字节 (4B)**；
> * 磁盘索引块与数据块大小均为 **256 字节 (256B)**。
> * ❓ **求该系统单个文件所能支持的最大文件长度？**

#### 解题严密推导过程：
1. **计算单个索引块能容纳的地址指针数**：
   $$N_{\text{ptr}} = \frac{256\text{ B}}{4\text{ B}} = 64 = 2^6 \text{ 个}$$
2. **计算各级索引所能寻址的数据块数**：
   * **4 个直接索引**：直接指向数据块 $\implies \mathbf{4\text{ 块}}$；
   * **2 个一级间接索引**：每个一级间接块包含 64 个指针 $\implies 2 \times 64 = \mathbf{128\text{ 块}}$；
   * **1 个二级间接索引**：二级索引块指向 64 个一级索引块，每个一级块指向 64 个数据块 $\implies 1 \times 64 \times 64 = 2^6 \times 2^6 = 2^{12} = \mathbf{4096\text{ 块}}$；
3. **计算总数据块数**：
   $$N_{\text{total}} = 4 + 128 + 4096 = \mathbf{4228\text{ 块}}$$
4. **计算最大文件长度**：
   $$\text{Max Size} = (4 + 128 + 2^{12}) \times 256\text{ B} = (4 + 128 + 2^{12}) \times 2^8\text{ B}$$
   $$= (1 + 32 + 2^{10}) \times 2^{10}\text{ B} = (1024 + 33)\text{ KB} = \mathbf{1057\text{ KB}}$$

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · Unix 经典多级混合索引结构与 1057KB 容量展开树</span>
    <span class="diagram-badge">P47 手记草图</span>
  </div>
  <svg viewBox="0 0 720 220" width="100%" height="220">
    <g transform="translate(15, 12)">
      <!-- 1. i-node 索引节点 (左侧) -->
      <g transform="translate(10, 0)">
        <rect x="0" y="0" width="130" height="195" fill="rgba(37,99,235,0.06)" stroke="#2563eb" stroke-width="2" rx="6"/>
        <text x="65" y="20" text-anchor="middle" fill="#2563eb" font-size="11.5" font-weight="800">i-node (7个地址项)</text>
        <!-- 直接索引项 0~3 -->
        <rect x="10" y="30" width="110" height="42" fill="rgba(16,185,129,0.15)" stroke="#10b981" rx="4"/>
        <text x="65" y="47" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="700">4项 直接索引</text>
        <text x="65" y="62" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="9.5">[0] ~ [3]</text>
        <!-- 一级间接项 4, 5 -->
        <rect x="10" y="80" width="110" height="42" fill="rgba(37,99,235,0.15)" stroke="#2563eb" rx="4"/>
        <text x="65" y="97" text-anchor="middle" fill="#2563eb" font-size="10.5" font-weight="700">2项 一级间接</text>
        <text x="65" y="112" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="9.5">[4], [5]</text>
        <!-- 二级间接项 6 -->
        <rect x="10" y="130" width="110" height="42" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" rx="4"/>
        <text x="65" y="147" text-anchor="middle" fill="#f59e0b" font-size="10.5" font-weight="700">1项 二级间接</text>
        <text x="65" y="162" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="9.5">[6]</text>
      </g>
      <!-- 2. 中间树形展开与间接块 -->
      <g transform="translate(150, 0)">
        <!-- 直接索引直连数据块 (绿色) -->
        <path d="M 0 50 L 150 50" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
        <!-- 一级间址指向 2 个一级索引块 -->
        <path d="M 0 100 L 40 100" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
        <rect x="45" y="85" width="80" height="30" fill="var(--vp-c-bg-alt)" stroke="#2563eb" rx="4"/>
        <text x="85" y="104" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="700">2个一级块</text>
        <path d="M 125 100 L 150 100" stroke="#2563eb" stroke-width="1.8" marker-end="url(#arrow-blue)"/>
        <!-- 二级间址指向 1 个二级块 -> 64个一级块 -->
        <path d="M 0 150 L 25 150" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow-amber)"/>
        <rect x="30" y="135" width="45" height="30" fill="var(--vp-c-bg-alt)" stroke="#f59e0b" rx="3"/>
        <text x="52" y="154" text-anchor="middle" fill="#f59e0b" font-size="9.5" font-weight="700">二级块</text>
        <path d="M 75 150 L 95 150" stroke="#f59e0b" stroke-width="1.5" marker-end="url(#arrow-amber)"/>
        <rect x="100" y="135" width="60" height="30" fill="var(--vp-c-bg-alt)" stroke="#f59e0b" rx="3"/>
        <text x="130" y="154" text-anchor="middle" fill="#f59e0b" font-size="9.5">64一级块</text>
        <path d="M 160 150 L 180 150" stroke="#f59e0b" stroke-width="1.5" marker-end="url(#arrow-amber)"/>
      </g>
      <!-- 3. 数据块分布汇总 (右中) -->
      <g transform="translate(340, 10)">
        <rect x="0" y="25" width="160" height="30" fill="rgba(16,185,129,0.15)" stroke="#10b981" rx="4"/>
        <text x="80" y="44" text-anchor="middle" fill="#10b981" font-size="11" font-weight="700">4 块 = 1 KB (1次访盘)</text>
        <rect x="0" y="75" width="160" height="30" fill="rgba(37,99,235,0.15)" stroke="#2563eb" rx="4"/>
        <text x="80" y="94" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">128 块 = 32 KB (2次访盘)</text>
        <rect x="0" y="125" width="160" height="30" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" rx="4"/>
        <text x="80" y="144" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="700">4096 块 = 1024 KB (3次访盘)</text>
      </g>
      <!-- 4. 汇总大题推论卡 (极右侧) -->
      <g transform="translate(520, 10)">
        <rect x="0" y="0" width="170" height="175" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="85" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">408 容量推导极值</text>
        <line x1="8" y1="30" x2="162" y2="30" stroke="var(--vp-c-divider)"/>
        <text x="10" y="52" fill="var(--vp-c-text-2)" font-size="10.5">总数据块数：</text>
        <text x="10" y="70" fill="#2563eb" font-size="11" font-weight="700">4 + 128 + 4096 = 4228 块</text>
        <line x1="8" y1="85" x2="162" y2="85" stroke="var(--vp-c-divider)"/>
        <text x="10" y="105" fill="var(--vp-c-text-2)" font-size="10.5">最大文件总容量：</text>
        <text x="10" y="126" fill="#10b981" font-size="13" font-weight="900">1057 KB</text>
        <text x="10" y="144" fill="var(--vp-c-text-3)" font-size="10">(1 + 32 + 1024 KB)</text>
        <text x="10" y="162" fill="#ef4444" font-size="10" font-weight="700">小文件快 / 大文件巨！</text>
      </g>
    </g>
  </svg>
</div>

---

## 🔗 文件目录演进与软硬链接

### ❓ 目录项 FCB 瘦身至索引节点 (i-node)

* **传统 FCB 弊端**：早期目录项完整包含 FCB（几十到上百字节），导致一个目录文件需占用大量磁盘块，检索目录时引发大量磁盘 I/O。
* **索引节点解耦**：将目录项精简为仅包含 **`[ 文件名 | 索引节点编号 (i-node) ]`**（仅十余字节）；
  * 所有文件元数据（大小、权限、物理地址项）存入外存的索引节点表中，大幅提升目录检索速度。

---

### ❓ 软链接 (符号链接) vs 硬链接 (Hard Link)

| 对比维度 | 软链接 (Symbolic Link，类似 Windows 快捷方式) | 硬链接 (Hard Link，多指针共享) |
| :--- | :--- | :--- |
| **底层实现** | 创建一个新文件，**其数据块中仅存放目标文件的路径字符串** | 在目录中创建新目录项，**直接指向同一个物理索引节点 (i-node)** |
| **I/O 访问开销** | 需经过**两次或多次访盘**（先读路径，再根据路径解析访问） | 访问速度等同于原文件（**直接定位同一个 i-node**） |
| **链接计数器** | 不会增加原文件的链接计数 | **原 i-node 的 `count` 计数器加 1** |
| **原文件删除时** | 软链接仍然存在，但成为**失效的死链接 / 悬空指针** | **仅将 `count` 减 1**，只有当 `count == 0` 且无打开进程时才释放磁盘数据块 |
| **跨文件系统** | **支持跨文件系统/跨分区链接** | **绝对不能跨文件系统/分区链接** |

---

## 🗄️ 磁盘存储空间四大管理方式

1. **空闲表法**：连续分配技术，建立一张空闲盘块表，记录空闲区起始块号和块数；
2. **空闲链表法**：
   * **空闲盘块链**：所有空闲块串联成单链表，分配回收极其简单，但分配多个块时耗时；
   * **空闲盘区链**：以连续盘区为节点串联，分配效率高。
3. **位示图法 (BitMap)**：
   * 用二进制位 0（空闲）和 1（已分配）标识全盘每个磁盘块的状态；
   * 设行号为 $i$、列号为 $j$、系统字长为 $n$ 位（从 0 开始编号）：
     $$\text{盘块号 } b = i \times n + j$$
     $$i = \lfloor b / n \rfloor, \quad j = b \pmod n$$
4. **成组链接法 (UNIX)**：
   * 将空闲块按组划分（如每 100 块为一组）；
   * 内存专用管理块中存放：当前可用空闲块数 $N$ 以及这 $N$ 个盘块号的栈指针；
   * 最后一个盘块存放下一组空闲盘块的块号链接，实现超大容量文件系统的极速分配与级联回收。

---

## 💽 磁盘格式化与物理寻址

### ❓ 磁盘格式化三大步骤

$$\text{低级格式化（物理格式化）} \longrightarrow \text{磁盘物理分区} \longrightarrow \text{高级格式化（逻辑格式化）}$$

1. **低级格式化**：在磁表面划分物理磁道与扇区，写入扇区头部和尾部控制码，**检测并永久标记损坏扇区**；
2. **磁盘分区**：将物理磁盘划分成独立的分区（如 C 盘、D 盘），每个分区由若干连续**柱面 (Cylinder)** 组成；
3. **高级格式化**：在分区内创建特定文件系统（建立引导块、超级块、根目录、空闲空间管理结构如位示图）。

---

### ❓ 扇区、块、簇与物理地址结构

* **扇区 (Sector)**：磁盘控制器的**最小物理硬件读写单位**（通常为 512B 或 4KB）；
* **块 (Block) / 簇 (Cluster)**：**操作系统进行文件读写与空间分配的最小逻辑单位**（通常等于 1 个或多个物理扇区，如 4KB）；
* **页 (Page)**：虚拟内存与物理内存页框的最小划分单位。
* 💡 **磁盘物理地址设计**：
  $$\mathbf{[ \text{柱面号 (Cylinder)} \mid \text{盘面号 / 磁头号 (Head)} \mid \text{扇区号 (Sector)} ]}$$
  * 为什么柱面号在最高位？为了让磁头在读写大量连续数据时**无需频繁径向移动机械臂进行机械寻道**，充分利用各盘面同心柱面的磁头并行切换！

---

## 🎯 磁盘调度算法与磁头移动轨迹

### ❓ 四大磁头寻道调度轨迹对比 (SCAN / C-SCAN / LOOK / C-LOOK)

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · 四大磁头寻道算法移动轨迹与边界折返辨析</span>
    <span class="diagram-badge">P48 手记草图</span>
  </div>
  <svg viewBox="0 0 720 250" width="100%" height="250">
    <g transform="translate(15, 12)">
      <!-- 磁道刻度横轴 (0 ~ 200) -->
      <g transform="translate(80, 0)">
        <line x1="0" y1="20" x2="420" y2="20" stroke="var(--vp-c-divider)" stroke-width="2"/>
        <!-- 刻度点 -->
        <text x="0" y="14" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10">0(最内)</text>
        <line x1="0" y1="18" x2="0" y2="24" stroke="var(--vp-c-divider)"/>
        <text x="75" y="14" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10">36</text>
        <line x1="75" y1="18" x2="75" y2="24" stroke="var(--vp-c-divider)"/>
        <text x="210" y="14" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="700">100(当前)</text>
        <line x1="210" y1="18" x2="210" y2="24" stroke="#2563eb" stroke-width="2"/>
        <text x="360" y="14" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10">170</text>
        <line x1="360" y1="18" x2="360" y2="24" stroke="var(--vp-c-divider)"/>
        <text x="420" y="14" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10">200(最外)</text>
        <line x1="420" y1="18" x2="420" y2="24" stroke="var(--vp-c-divider)"/>
      </g>
      <!-- 轨迹 1: SCAN (电梯算法: 扫到最外边界 200 才折返) -->
      <g transform="translate(0, 35)">
        <text x="70" y="20" text-anchor="end" fill="#2563eb" font-size="11" font-weight="800">SCAN (电梯)</text>
        <g transform="translate(80, 0)">
          <!-- 100 -> 200 -> 36 -->
          <polyline points="210,12 420,12 75,26" fill="none" stroke="#2563eb" stroke-width="2.2"/>
          <circle cx="210" cy="12" r="3.5" fill="#2563eb"/>
          <circle cx="420" cy="12" r="4" fill="#ef4444"/>
          <circle cx="75" cy="26" r="3.5" fill="#2563eb"/>
          <text x="425" y="15" fill="#ef4444" font-size="9.5" font-weight="700">触及物理端点 200</text>
        </g>
      </g>
      <!-- 轨迹 2: LOOK (只扫到最大请求 170 即刻掉头) -->
      <g transform="translate(0, 80)">
        <text x="70" y="20" text-anchor="end" fill="#10b981" font-size="11" font-weight="800">LOOK (看路)</text>
        <g transform="translate(80, 0)">
          <!-- 100 -> 170 -> 36 -->
          <polyline points="210,12 360,12 75,26" fill="none" stroke="#10b981" stroke-width="2.2"/>
          <circle cx="210" cy="12" r="3.5" fill="#10b981"/>
          <circle cx="360" cy="12" r="4" fill="#10b981"/>
          <circle cx="75" cy="26" r="3.5" fill="#10b981"/>
          <text x="368" y="15" fill="#10b981" font-size="9.5" font-weight="700">最大请求 170 即掉头(不碰边界)</text>
        </g>
      </g>
      <!-- 轨迹 3: C-SCAN (单向循环: 到 200 极速返回 0，返回不服务) -->
      <g transform="translate(0, 125)">
        <text x="70" y="20" text-anchor="end" fill="#f59e0b" font-size="11" font-weight="800">C-SCAN (单向)</text>
        <g transform="translate(80, 0)">
          <!-- 100 -> 200 ... 0 -> 75 -->
          <polyline points="210,12 420,12" fill="none" stroke="#f59e0b" stroke-width="2.2"/>
          <line x1="420" y1="12" x2="0" y2="24" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="3,3"/>
          <polyline points="0,24 75,24" fill="none" stroke="#f59e0b" stroke-width="2.2"/>
          <circle cx="420" cy="12" r="4" fill="#ef4444"/>
          <circle cx="0" cy="24" r="4" fill="#ef4444"/>
          <text x="210" y="32" text-anchor="middle" fill="#f59e0b" font-size="9.5">虚线极速返回(途中不服务)</text>
        </g>
      </g>
      <!-- 轨迹 4: C-LOOK (单向循环看路: 170 直接跳回 36) -->
      <g transform="translate(0, 170)">
        <text x="70" y="20" text-anchor="end" fill="#7c3aed" font-size="11" font-weight="800">C-LOOK (优选)</text>
        <g transform="translate(80, 0)">
          <!-- 100 -> 170 ... 36 -->
          <polyline points="210,12 360,12" fill="none" stroke="#7c3aed" stroke-width="2.2"/>
          <line x1="360" y1="12" x2="75" y2="24" stroke="#7c3aed" stroke-width="1.8" stroke-dasharray="3,3"/>
          <circle cx="360" cy="12" r="3.5" fill="#7c3aed"/>
          <circle cx="75" cy="24" r="3.5" fill="#7c3aed"/>
          <text x="210" y="32" text-anchor="middle" fill="#7c3aed" font-size="9.5">从最大请求直接回跳最小请求</text>
        </g>
      </g>
      <!-- 右侧对比总结卡 -->
      <g transform="translate(540, 20)">
        <rect x="0" y="0" width="150" height="195" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="75" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">408 核心命题辨析</text>
        <line x1="8" y1="30" x2="142" y2="30" stroke="var(--vp-c-divider)"/>
        <text x="10" y="50" fill="#2563eb" font-size="10.5" font-weight="700">SCAN vs LOOK：</text>
        <text x="10" y="67" fill="var(--vp-c-text-2)" font-size="10">SCAN 必达终点端点；</text>
        <text x="10" y="82" fill="var(--vp-c-text-2)" font-size="10">LOOK 只到最远请求。</text>
        <line x1="8" y1="95" x2="142" y2="95" stroke="var(--vp-c-divider)"/>
        <text x="10" y="115" fill="#f59e0b" font-size="10.5" font-weight="700">C- 前缀含义：</text>
        <text x="10" y="132" fill="var(--vp-c-text-2)" font-size="10">单向扫（Circular），</text>
        <text x="10" y="147" fill="var(--vp-c-text-2)" font-size="10">返回途上一律不服务，</text>
        <text x="10" y="162" fill="var(--vp-c-text-2)" font-size="10">各磁道响应极度均匀！</text>
      </g>
    </g>
  </svg>
</div>


