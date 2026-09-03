# 第4章 网络层与 IP 协议 · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P11~P13，涵盖三大路由协议（RIP / OSPF / BGP）多维对比、IPv4 首部字段与分片算例（首4总1片8）、IP分类与特殊/私有地址、CIDR 变长子网划分二叉树法、路由转发流程、ARP/DHCP/ICMP 运行机理、以及 IPv6 核心变革。

---

## 🧭 三大路由协议深度横评 (RIP / OSPF / BGP)

### ❓ 距离向量算法 vs 链路状态算法

* **距离向量算法 (Distance Vector)**：仅与相邻邻居交换信息，交换的是**自己的整张路由表**（“我所知道的一切”）。慢收敛，容易出现环路与“坏消息传得慢”问题。
* **链路状态算法 (Link State)**：向网络内所有路由器发送广播信息，发送的是**与本路由器相邻的链路状态**（“我知道的邻居”）。全网拓扑一致，收敛快，无路由环路。

---

### ❓ RIP、OSPF、BGP 核心参数对比全景表

| 维度 | RIP (Routing Information Protocol) | OSPF (Open Shortest Path First) | BGP (Border Gateway Protocol) |
| :--- | :--- | :--- | :--- |
| **协议分类** | 内部网关协议 (IGP) | 内部网关协议 (IGP) | 外部网关协议 (EGP) |
| **底层核心算法** | 距离-向量算法 (Bellman-Ford) | 链路状态算法 (Dijkstra SPF) | 路径-向量算法 (Path Vector) |
| **所在层次** | **应用层** | **网络层** | **应用层** |
| **传输层协议** | **UDP (端口 520)** | 直接封装在 **IP 数据报** (协议号 89) | **TCP (端口 179)** |
| **交换对象** | 仅与**相邻路由器**交换 | 向全网所有路由器**洪泛 (Flooding)** | 与相邻 AS 的 BGP 发言人建立 TCP 连接 |
| **交换内容** | 交换**整张路由表** | 交换与本路由器**相邻的所有链路状态** | 交换可达性信息及完整的 **AS-PATH 路径** |
| **更新周期** | 定期 30 秒广播一次；距离最大 15，**16 表示不可达** | 仅当链路状态**发生变化时才洪泛**；定期 30s 发保活报文 | 发生变化时触发更新，周期性发送 Keepalive 维持连接 |
| **主要报文类型** | Request 请求、Response 响应 | Hello、DBD、LSR、LSU、LSAck | Open、Update、Keepalive、Notification |

::: tip 💡 BGP 路由选择策略核心优先级
1. 本地偏好值 (Local-Preference) 最高优先；
2. AS-PATH 经过的自治系统数量最少优先；
3. 热土豆路由选择（内部距离最近优先）；
4. BGP 路由器标识符 (Router ID) 最小者优先。
:::

---

## 📦 IPv4 首部格式与分片计算大题

### ❓ IPv4 首部关键字段速记口诀

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · IPv4 报头 32 位标准字段布局与“首4总1片8”法则</span>
    <span class="diagram-badge">P55 手记草图</span>
  </div>
  <svg viewBox="0 0 720 220" width="100%" height="220">
    <g transform="translate(15, 12)">
      <!-- 报头 32-bit 表格结构 (左侧) -->
      <g transform="translate(0, 0)">
        <!-- 表头标尺 0 ~ 31 位 -->
        <text x="0" y="12" fill="var(--vp-c-text-3)" font-size="9.5">0 bit</text>
        <text x="60" y="12" fill="var(--vp-c-text-3)" font-size="9.5">4</text>
        <text x="120" y="12" fill="var(--vp-c-text-3)" font-size="9.5">8</text>
        <text x="240" y="12" fill="var(--vp-c-text-3)" font-size="9.5">16</text>
        <text x="480" y="12" text-anchor="end" fill="var(--vp-c-text-3)" font-size="9.5">31 bit</text>
        <!-- 行 1: 版本(4) | 首部长度(4) | 区分服务(8) | 总长度(16) -->
        <g transform="translate(0, 18)">
          <rect x="0" y="0" width="60" height="28" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
          <text x="30" y="18" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">版本(4)</text>
          <rect x="60" y="0" width="70" height="28" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="2"/>
          <text x="95" y="18" text-anchor="middle" fill="#10b981" font-size="10.5" font-weight="800">首部长(4B)</text>
          <rect x="130" y="0" width="110" height="28" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
          <text x="185" y="18" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10.5">区分服务(8)</text>
          <rect x="240" y="0" width="240" height="28" fill="rgba(37,99,235,0.18)" stroke="#2563eb" stroke-width="2"/>
          <text x="360" y="18" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="800">总长度 (16位 · 单位 1B)</text>
        </g>
        <!-- 行 2: 标识(16) | 标志(3) | 片偏移(13) -->
        <g transform="translate(0, 48)">
          <rect x="0" y="0" width="240" height="28" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
          <text x="120" y="18" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">标识 (Identification · 16位)</text>
          <rect x="240" y="0" width="60" height="28" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1.8"/>
          <text x="270" y="18" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="700">标志(3)</text>
          <rect x="300" y="0" width="180" height="28" fill="rgba(245,158,11,0.18)" stroke="#f59e0b" stroke-width="2"/>
          <text x="390" y="18" text-anchor="middle" fill="#f59e0b" font-size="10.5" font-weight="800">片偏移 (13位 · 单位 8B)</text>
        </g>
        <!-- 行 3: TTL(8) | 协议(8) | 首部校验和(16) -->
        <g transform="translate(0, 78)">
          <rect x="0" y="0" width="120" height="28" fill="rgba(239,68,68,0.12)" stroke="#ef4444"/>
          <text x="60" y="18" text-anchor="middle" fill="#ef4444" font-size="10.5" font-weight="700">TTL 生存时间(8)</text>
          <rect x="120" y="0" width="120" height="28" fill="rgba(37,99,235,0.12)" stroke="#2563eb"/>
          <text x="180" y="18" text-anchor="middle" fill="#2563eb" font-size="10.5" font-weight="700">协议 (TCP:6/UDP:17)</text>
          <rect x="240" y="0" width="240" height="28" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
          <text x="360" y="18" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10.5">首部校验和 (仅检首部)</text>
        </g>
        <!-- 行 4: 源 IP 地址 (32) -->
        <g transform="translate(0, 108)">
          <rect x="0" y="0" width="480" height="28" fill="rgba(37,99,235,0.08)" stroke="#2563eb"/>
          <text x="240" y="18" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">源 IP 地址 (Source IP Address · 32位)</text>
        </g>
        <!-- 行 5: 目的 IP 地址 (32) -->
        <g transform="translate(0, 138)">
          <rect x="0" y="0" width="480" height="28" fill="rgba(16,185,129,0.08)" stroke="#10b981"/>
          <text x="240" y="18" text-anchor="middle" fill="#10b981" font-size="11" font-weight="700">目的 IP 地址 (Destination IP Address · 32位)</text>
        </g>
        <text x="240" y="182" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10.5">固定 20 字节基本首部（无选项字段时）</text>
      </g>
      <!-- 右侧：考点秒杀卡 -->
      <g transform="translate(500, 10)">
        <rect x="0" y="0" width="190" height="180" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="95" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">408 分片命题三剑客</text>
        <line x1="8" y1="30" x2="182" y2="30" stroke="var(--vp-c-divider)"/>
        <text x="10" y="52" fill="#10b981" font-size="11" font-weight="800">1. 首 4：单位 4 字节</text>
        <text x="10" y="68" fill="var(--vp-c-text-2)" font-size="10">取值 5~15 ➔ 20B ~ 60B</text>
        <text x="10" y="92" fill="#2563eb" font-size="11" font-weight="800">2. 总 1：单位 1 字节</text>
        <text x="10" y="108" fill="var(--vp-c-text-2)" font-size="10">数据报最大 65535 B</text>
        <text x="10" y="132" fill="#f59e0b" font-size="11" font-weight="800">3. 片 8：单位 8 字节</text>
        <text x="10" y="148" fill="var(--vp-c-text-2)" font-size="10">除末片外载荷必是 8 的倍数</text>
        <line x1="8" y1="158" x2="182" y2="158" stroke="var(--vp-c-divider)"/>
        <text x="10" y="172" fill="#ef4444" font-size="9.5" font-weight="700">DF=0 允许分片 | MF=1 还有分片</text>
      </g>
    </g>
  </svg>
</div>

* **标志字段 (Flag, 3 bit)**：
  * 保留位（第 1 位恒为 0）；
  * **DF (Don't Fragment)**：$DF=1$ 禁止分片；$DF=0$ 允许分片；
  * **MF (More Fragment)**：$MF=1$ 后面还有分片；$MF=0$ 已经是最后一个分片。
* **生存时间 (TTL)**：分组经过每个路由器转发前先减 1，**减至 0 时直接丢弃**并向源主机回送 ICMP 超时报文，防止分组在环路中死循环。
* **首部校验和**：**只检验 IP 首部**，不检验数据载荷部分（数据部分差错由传输层 UDP/TCP 或链路层 CRC 保障）。

---

### ❓ IP 分片真题大题经典算例

> **题目**：某网络路径的 MTU $= 800\text{ B}$，现发送总长为 $1580\text{ B}$ 的 IPv4 数据报（固定首部长 $20\text{ B}$）。求各个分片的数据长、总长、DF、MF 标志以及片偏移量。
> 
> **解题标准步骤**：
> 1. 原数据报载荷为 $1580 - 20 = 1560\text{ B}$；
> 2. 每个分片的最大数据空间为 $800 - 20 = 780\text{ B}$；
> 3. 由于片偏移以 8 字节为单位，分片数据载荷必须是 8 的倍数：
>    $$780 \div 8 = 97 \dots 4 \implies 780 - 4 = \mathbf{776\text{ B}}$$
> 4. 分片详细分配：
>    * **分片 1**：数据区间 $[0, 775]$，数据长 $776\text{ B}$，总长 $796\text{ B}$，$DF=0, MF=1$，片偏移 $= 0 \div 8 = \mathbf{0}$；
>    * **分片 2**：数据区间 $[776, 1551]$，数据长 $776\text{ B}$，总长 $796\text{ B}$，$DF=0, MF=1$，片偏移 $= 776 \div 8 = \mathbf{97}$；
>    * **分片 3**：剩余数据 $1560 - 776 \times 2 = 8\text{ B}$，数据长 $8\text{ B}$，总长 $28\text{ B}$，$DF=0, MF=0$，片偏移 $= 1552 \div 8 = \mathbf{194}$。

---

## 🏷️ IP 地址分类、特殊地址与私有地址

### ❓ A / B / C / D / E 类地址范围

* **A 类 (0开头)**：$1.0.0.0 \sim 126.255.255.255$（8位网络号，24位主机号）
* **B 类 (10开头)**：$128.0.0.0 \sim 191.255.255.255$（16位网络号，16位主机号）
* **C 类 (110开头)**：$192.0.0.0 \sim 223.255.255.255$（24位网络号，8位主机号）
* **D 类 (1110开头)**：$224.0.0.0 \sim 239.255.255.255$（多播 / 组播地址）
* **E 类 (1111开头)**：$240.0.0.0 \sim 255.255.255.255$（保留科研实验）

---

### ❓ 特殊 IP 地址速查表（必考考点）

| IP 地址特征 | 源地址是否可用 | 目的地址是否可用 | 含义与功能 |
| :--- | :---: | :---: | :--- |
| **主机号全 1**（如 `192.168.1.255`） | ❌ 否 | ✅ 是 | **直接广播地址**（针对特定子网内所有主机广播） |
| **全 1** (`255.255.255.255`) | ❌ 否 | ✅ 是 | **受限广播地址 / 本地广播**（不被路由器转发） |
| **全 0** (`0.0.0.0`) | ✅ 是 | ❌ 否 | 本网络上的本主机（如 DHCP 发现阶段源地址）；路由表中作**默认路由** |
| **网络号全 0，主机号特定** | ✅ 是 | ✅ 是 | 本网络内的指定主机 |
| **127.X.Y.Z** (`127.0.0.1`) | ✅ 是 | ✅ 是 | **环回地址 (Loopback)**，用于本机软件测试与本地 IPC 通信 |

---

### ❓ 三大专用私有 IP 网段 (RFC 1918)

* **1 个 A 类私网**：`10.0.0.0 ~ 10.255.255.255`（掩码 `/8`）
* **16 个 B 类私网**：`172.16.0.0 ~ 172.31.255.255`（掩码 `/12`）
* **256 个 C 类私网**：`192.168.0.0 ~ 192.168.255.255`（掩码 `/16`）

---

## 🌲 CIDR 变长子网划分（二叉树分配法）

### ❓ 给定申请网段分配子网的原则

> **典型案例**：申请到 `218.75.230.0/24`，需为 5 个不同规模的网络分配 IP：
> * 网络 1：6 台主机 $\to$ 算上网关与广播需 $\ge 6+2 = 8$，块大小取 **16**（掩码 `/28`）；
> * 网络 2：25 台主机 $\to$ 算上网关与广播需 $\ge 25+2 = 27$，块大小取 **32**（掩码 `/27`）；
> * 网络 3：10 台主机 $\to$ 需 $\ge 12$，块大小取 **16**（掩码 `/28`）；
> * 网络 4：12 台主机 $\to$ 需 $\ge 14$，块大小取 **16**（掩码 `/28`）；
> * 网络 5：路由器间点对点链路 $\to$ 需 2 接口+2 = 4，块大小取 **4**（掩码 `/30`）。
>
> **二叉树分配原则**：按块大小**从大到小依次在二叉树叶子节点截取分配**，分配过的节点其祖先与子孙均不能再用，彻底避免前缀地址重叠。

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · CIDR 变长子网划分二叉前缀树分配与路由聚合模型</span>
    <span class="diagram-badge">P56 手记草图</span>
  </div>
  <svg viewBox="0 0 720 220" width="100%" height="220">
    <g transform="translate(15, 12)">
      <!-- 根节点 /24 (顶层) -->
      <g transform="translate(170, 0)">
        <rect x="0" y="0" width="160" height="26" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2" rx="4"/>
        <text x="80" y="17" text-anchor="middle" fill="#2563eb" font-size="11.5" font-weight="800">根网段: .0/24 (256点)</text>
      </g>
      <!-- 第一层分裂 (/25) -->
      <path d="M 210 26 L 120 50" stroke="#2563eb" stroke-width="1.8"/>
      <path d="M 290 26 L 380 50" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
      <!-- 左 /25 -->
      <g transform="translate(50, 50)">
        <rect x="0" y="0" width="140" height="25" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="3"/>
        <text x="70" y="17" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10.5">.0/25 (128点, 0~127)</text>
      </g>
      <!-- 右 /25 (预留) -->
      <g transform="translate(310, 50)">
        <rect x="0" y="0" width="140" height="25" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)" stroke-dasharray="3,3" rx="3"/>
        <text x="70" y="17" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10.5">.128/25 (预留空闲)</text>
      </g>
      <!-- 第二层分裂 (/26) -->
      <path d="M 90 75 L 50 100" stroke="#2563eb" stroke-width="1.8"/>
      <path d="M 150 75 L 190 100" stroke="var(--vp-c-divider)" stroke-width="1.8"/>
      <!-- 左 /26 -->
      <g transform="translate(0, 100)">
        <rect x="0" y="0" width="115" height="25" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" rx="3"/>
        <text x="57" y="17" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="10">.0/26 (64点, 0~63)</text>
      </g>
      <!-- 第三层分裂 (/27) -> 产生网络 2 (32点) -->
      <path d="M 35 125 L 20 150" stroke="#10b981" stroke-width="2"/>
      <path d="M 80 125 L 110 150" stroke="#2563eb" stroke-width="1.8"/>
      <!-- 命中分配：网络 2 (/27) -->
      <g transform="translate(0, 150)">
        <rect x="0" y="0" width="105" height="36" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="2" rx="4"/>
        <text x="52" y="16" text-anchor="middle" fill="#10b981" font-size="11" font-weight="800">网络2: .0/27</text>
        <text x="52" y="30" text-anchor="middle" fill="#10b981" font-size="9.5">32点 (需25主机)</text>
      </g>
      <!-- 第四层分裂 (/28) -> 产生网络 1 & 网络 3 -->
      <g transform="translate(110, 140)">
        <path d="M 15 15 L 0 35" stroke="#2563eb" stroke-width="1.8"/>
        <path d="M 35 15 L 60 35" stroke="#f59e0b" stroke-width="1.8"/>
        <!-- 网络 1 (/28) -->
        <g transform="translate(-25, 35)">
          <rect x="0" y="0" width="80" height="32" fill="rgba(37,99,235,0.15)" stroke="#2563eb" rx="3"/>
          <text x="40" y="15" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="700">网络1: .32/28</text>
          <text x="40" y="27" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="9">16点(需6)</text>
        </g>
        <!-- 网络 3 (/28) -->
        <g transform="translate(60, 35)">
          <rect x="0" y="0" width="80" height="32" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" rx="3"/>
          <text x="40" y="15" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="700">网络3: .48/28</text>
          <text x="40" y="27" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="9">16点(需10)</text>
        </g>
      </g>
      <!-- 右侧：408 核心法则与路由聚合卡片 -->
      <g transform="translate(480, 10)">
        <rect x="0" y="0" width="210" height="185" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="105" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="12" font-weight="800">408 二叉树分配黄金准则</text>
        <line x1="10" y1="30" x2="200" y2="30" stroke="var(--vp-c-divider)"/>
        <text x="12" y="52" fill="#10b981" font-size="11" font-weight="700">① 先大后小原则：</text>
        <text x="12" y="70" fill="var(--vp-c-text-2)" font-size="10">优先分配大块网络（如 /27），</text>
        <text x="12" y="85" fill="var(--vp-c-text-2)" font-size="10">再在剩余分支细分小块（/28,/30）。</text>
        <line x1="10" y1="96" x2="200" y2="96" stroke="var(--vp-c-divider)"/>
        <text x="12" y="116" fill="#ef4444" font-size="11" font-weight="700">② 互斥锁定原则：</text>
        <text x="12" y="134" fill="var(--vp-c-text-2)" font-size="10">一旦某节点被分配，其所有祖先与</text>
        <text x="12" y="149" fill="var(--vp-c-text-2)" font-size="10">子孙节点全部锁定作废，彻底防重叠！</text>
        <line x1="10" y1="160" x2="200" y2="160" stroke="var(--vp-c-divider)"/>
        <text x="12" y="176" fill="#2563eb" font-size="10" font-weight="700">最长前缀匹配 (LPM)：掩码越长越精准</text>
      </g>
    </g>
  </svg>
</div>

---

## 🔄 路由转发与辅助协议 (ARP / DHCP / ICMP)

### ❓ 路由表查询与分组转发流程

1. 提取 IP 数据报中的目的 IP 地址 $D$；
2. 采用**最长前缀匹配 (Longest Prefix Match)** 原则，在路由表中寻找子网掩码最长、最匹配的路由条目；
3. 得到下一跳 IP 地址和出接口；
4. 通过 **ARP 协议** 查询下一跳 IP 的物理 MAC 地址，重构数据链路层帧后由对应接口发出。

---

### ❓ ARP、DHCP 与 ICMP 协议核心机理

1. **ARP (地址解析协议)**：
   * 在本局域网内广播发送请求帧（目的 MAC 为全 `FF`），目标主机单播回复响应帧；
   * 💡 **跨网段通信避坑**：若目的主机在外部不同网络，主机通过 ARP 解析出的是**默认网关（本地路由器接口）的 MAC 地址**，而不是目的主机的 MAC！
2. **DHCP (动态主机配置协议)**：
   * 基于 **UDP** 的应用层协议（服务端端口 67，客户端端口 68）；
   * 交互四部曲：**Discover (发现) $\to$ Offer (提供) $\to$ Request (请求) $\to$ ACK (确认)**，在局域网广播进行。
3. **ICMP (网际控制报文协议)**：
   * 直接封装在 **IP 数据报** 中（协议字段为 1）；
   * 💡 **两大死循环防护法则**：
     * 对 ICMP 差错报告报文，**绝对不能再发送 ICMP 差错报文**；
     * 对分片数据报的后续非首个分片，不再发送差错报告报文。

---

## 🌐 IPv6 核心变革与表示规则

### ❓ IPv4 vs IPv6 关键差异

| 特性对比 | IPv4 | IPv6 |
| :--- | :--- | :--- |
| **地址空间** | 32 位（约 43 亿） | **128 位**（彻底解决地址枯竭） |
| **首部长度** | 20 ~ 60 字节（首部长度可变） | **固定 40 字节**（取消首部校验和，转发极快） |
| **分片控制** | 中间路由器和源主机均可分片 | **只能由源主机分片**（中间路由器超出 MTU 直接丢弃并回送 ICMPv6） |

### ❓ IPv6 零压缩表示法
* 冒号十六进制表示中，连续的 0 块可用双冒号 `::` 替代；
* ⚠️ **`::` 在一个 IPv6 地址中只能出现一次**！
* **示例**：`8::D0:123:CDEF:89A` 完整展开为 128 位地址：
  $$\mathbf{0008:0000:0000:0000:00D0:0123:CDEF:089A}$$

