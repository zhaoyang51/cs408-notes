# 第6章 应用层 (HTTP / DNS / FTP / 邮件) · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P17，直击 DNS 层次域名与递归/迭代解析过程、FTP 双连接架构与主动/被动模式、电子邮件系统（SMTP / POP3 / IMAP / MIME 协作模型）、以及 HTTP/1.0 与 HTTP/1.1 持续/非持续连接时延分析。

---

## 🌐 DNS 域名解析系统

### ❓ DNS 协议特征与层次域名结构

* **传输层支持**：运行在 **UDP 协议** 之上，使用熟知端口 **53**（主备服务器间区域传送走 TCP）。
* **层次域名体系**（级别越高的域名越靠右）：
  ```
  www.cskaoyan.com
   │      │     │
  三级   二级  顶级域名 (.com)
  ```
* **域名服务器四级架构**：根域名服务器 $\to$ 顶级域名服务器 $\to$ 权限域名服务器 $\to$ 本地域名服务器（直接面对客户端）。

---

### ❓ 递归查询 (Recursive) vs 迭代查询 (Iterative)

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · DNS 递归查询 (主机-本地) 与 迭代查询 (本地-根/顶级/权限) 拓扑</span>
    <span class="diagram-badge">P61 手记草图</span>
  </div>
  <svg viewBox="0 0 720 210" width="100%" height="210">
    <g transform="translate(15, 12)">
      <!-- 客户端主机 (最左侧) -->
      <g transform="translate(10, 60)">
        <rect x="0" y="0" width="75" height="50" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2" rx="6"/>
        <text x="37" y="24" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="800">客户端主机</text>
        <text x="37" y="40" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="9.5">(Client)</text>
      </g>
      <!-- 主机 -> 本地 DNS: 递归查询 (双向带箭头线) -->
      <path d="M 85 75 L 155 75" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
      <path d="M 155 95 L 85 95" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
      <text x="120" y="65" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="700">递归代查 ➔</text>
      <text x="120" y="112" text-anchor="middle" fill="#10b981" font-size="9.5">原路返回 IP</text>
      <!-- 本地域名服务器 Local DNS (中枢) -->
      <g transform="translate(160, 45)">
        <rect x="0" y="0" width="115" height="80" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2.2" rx="8"/>
        <text x="57" y="28" text-anchor="middle" fill="#10b981" font-size="12" font-weight="900">本地域名服务器</text>
        <text x="57" y="48" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10.5">(Local DNS)</text>
        <text x="57" y="68" text-anchor="middle" fill="#10b981" font-size="9.5" font-weight="700">【四处问询跑腿】</text>
      </g>
      <!-- 迭代查询三级服务器 (右侧阶梯分布) -->
      <!-- 1. 根域名服务器 Root DNS -->
      <g transform="translate(390, 10)">
        <rect x="0" y="0" width="130" height="36" fill="rgba(239,68,68,0.12)" stroke="#ef4444" rx="4"/>
        <text x="65" y="22" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="800">1. 根域名服务器 (.)</text>
      </g>
      <!-- 本地 -> 根 -->
      <path d="M 275 60 L 385 28" stroke="#ef4444" stroke-width="1.8" marker-end="url(#arrow-red)"/>
      <path d="M 385 36 L 275 68" stroke="var(--vp-c-text-3)" stroke-width="1.5" stroke-dasharray="2,2"/>
      <text x="335" y="42" fill="#ef4444" font-size="9">查根 ➔ 返.com</text>
      <!-- 2. 顶级域名服务器 TLD DNS -->
      <g transform="translate(390, 70)">
        <rect x="0" y="0" width="130" height="36" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" rx="4"/>
        <text x="65" y="22" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="800">2. 顶级服务器 (.com)</text>
      </g>
      <!-- 本地 -> 顶级 -->
      <path d="M 275 85 L 385 85" stroke="#f59e0b" stroke-width="1.8" marker-end="url(#arrow-amber)"/>
      <text x="330" y="80" text-anchor="middle" fill="#f59e0b" font-size="9">查顶级 ➔ 返权限</text>
      <!-- 3. 权限域名服务器 Authoritative DNS -->
      <g transform="translate(390, 130)">
        <rect x="0" y="0" width="130" height="36" fill="rgba(37,99,235,0.12)" stroke="#2563eb" rx="4"/>
        <text x="65" y="22" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="800">3. 权限服务器 (cs.com)</text>
      </g>
      <!-- 本地 -> 权限 -->
      <path d="M 275 110 L 385 142" stroke="#2563eb" stroke-width="1.8" marker-end="url(#arrow-blue)"/>
      <text x="335" y="132" fill="#2563eb" font-size="9">查权限 ➔ 返IP!</text>
      <!-- 右侧：考点秒杀卡 -->
      <g transform="translate(540, 10)">
        <rect x="0" y="0" width="150" height="165" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="75" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">DNS 解析真题考点</text>
        <line x1="8" y1="30" x2="142" y2="30" stroke="var(--vp-c-divider)"/>
        <text x="10" y="52" fill="#2563eb" font-size="10.5" font-weight="700">主机 ➔ 本地：</text>
        <text x="10" y="68" fill="var(--vp-c-text-2)" font-size="10">默认采用【递归查询】</text>
        <text x="10" y="82" fill="var(--vp-c-text-3)" font-size="9.5">委托本地 DNS 全权代办</text>
        <line x1="8" y1="92" x2="142" y2="92" stroke="var(--vp-c-divider)"/>
        <text x="10" y="112" fill="#10b981" font-size="10.5" font-weight="700">本地 ➔ 外部：</text>
        <text x="10" y="128" fill="var(--vp-c-text-2)" font-size="10">默认采用【迭代查询】</text>
        <text x="10" y="142" fill="var(--vp-c-text-3)" font-size="9.5">减轻根服务器负担！</text>
        <line x1="8" y1="150" x2="142" y2="150" stroke="var(--vp-c-divider)"/>
      </g>
    </g>
  </svg>
</div>

::: tip 💡 核心考点辨析
* **主机向本地域名服务器**的查询通常采用**递归查询**（由本地 DNS 代劳跑腿）；
* **本地域名服务器向外部根/顶级/权限服务器**的查询通常采用**迭代查询**（避免上级根服务器负荷过重）。
:::

---

## 📁 FTP 文件传输协议

### ❓ FTP 的双连接架构与工作模式

* **传输层支持**：运行在 **TCP 协议** 之上。
* **双端口与双连接机制**：
  * **控制连接 (端口 21)**：传输认证、路径切换与传输指令，**在整个 FTP 会话期间始终保持打开**；
  * **数据连接 (端口 20 / 随机端口)**：专门传输文件内容或目录列表，**数据传输完毕后立刻关闭**。

---

### ❓ 主动模式 (PORT) vs 被动模式 (PASV)

| 模式 | 数据连接发起方 | 端口使用规则 | 防火墙穿透表现 |
| :--- | :--- | :--- | :--- |
| **主动模式 (PORT)** | **FTP 服务器** 主动发起 | 客户端通过控制连接告知自身临时端口 $N$，服务器从 **20 端口** 主动连接客户端的 $N$ 端口 | 客户端若开启防火墙可能拦截外部主动连入 |
| **被动模式 (PASV)** | **客户端** 主动发起 | 服务器在控制连接中回复一个随机非特权端口 $P$，客户端主动发起连接到服务器的 $P$ 端口 | 穿透客户端本地防火墙与 NAT 表现更佳 |

---

## ✉️ 电子邮件系统 (SMTP / POP3 / IMAP)

### ❓ 电子邮件系统的协议分工

```
发信客户端 ──[SMTP (TCP 25)]──> 发信服务器 ──[SMTP (TCP 25)]──> 收信服务器 ──[POP3 / IMAP]──> 收信客户端
```

1. **SMTP (简单邮件传输协议)**：
   * **推式协议 (Push)**：用于用户代理向邮件服务器推信、以及邮件服务器之间转送邮件；
   * 基于 TCP，端口 **25**；
   * **缺陷**：原生只支持传输 **7 位 ASCII 码文本**，无法直接传输中文字符、图片、音频及可执行附件。
2. **MIME (多用途互联网邮件扩展)**：
   * **核心功能**：作为 SMTP 的功能增强插件，**将任意非 ASCII 码二进制数据编码转换成 7 位 ASCII 码**，从而兼容传统 SMTP 发送。
3. **POP3 (邮局协议第3版)**：
   * **拉式协议 (Pull)**：客户端从服务器下载邮件；
   * 基于 TCP，端口 **110**；
   * 下载后默认从服务器删除（或配置保留），客户端本地操作（如标已读、建文件夹）**无法同步**到服务器端。
4. **IMAP (网际报文存取协议)**：
   * 基于 TCP，端口 **143**；
   * 相比 POP3 更加强大复杂：支持在服务端直接创建、移动、重命名文件夹，支持**只下载邮件首部或局部附件**，**全平台多设备状态实时双向同步**。

---

## 🌐 HTTP 超文本传输协议与时延分析

### ❓ HTTP 协议核心特征速记

1. **传输层支撑**：基于 **TCP 协议**，默认端口 **80**（HTTPS 为 443）；
2. **无连接、无状态**：每个请求独立处理，服务器不保留客户端访问历史上下文（实际工程中借助 **Cookie / Session / Token** 机制维持用户会话）。

---

### ❓ 非持续连接 (HTTP/1.0) vs 持续连接 (HTTP/1.1)

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · Web 访问端到端时延推演（TCP握手 + HTTP请求 RTT 往返时序）</span>
    <span class="diagram-badge">P61 手记草图</span>
  </div>
  <svg viewBox="0 0 720 230" width="100%" height="230">
    <g transform="translate(15, 12)">
      <!-- 时序推演时间轴 (左侧) -->
      <g transform="translate(0, 0)">
        <!-- 客户端轴 & 服务端轴 -->
        <text x="60" y="20" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">客户端 (Browser)</text>
        <text x="360" y="20" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">Web 服务器</text>
        <line x1="60" y1="28" x2="60" y2="195" stroke="var(--vp-c-divider)" stroke-width="2"/>
        <line x1="360" y1="28" x2="360" y2="195" stroke="var(--vp-c-divider)" stroke-width="2"/>
        <!-- 第 1 个 RTT: TCP 握手 -->
        <line x1="60" y1="40" x2="360" y2="65" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
        <line x1="360" y1="65" x2="60" y2="90" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
        <text x="210" y="50" text-anchor="middle" fill="#2563eb" font-size="10">SYN ➔</text>
        <text x="210" y="85" text-anchor="middle" fill="#10b981" font-size="10">SYN + ACK ➔</text>
        <!-- RTT 1 标尺 -->
        <line x1="375" y1="40" x2="375" y2="90" stroke="#2563eb" stroke-width="1.8"/>
        <text x="385" y="70" fill="#2563eb" font-size="11" font-weight="800">1 RTT (TCP 连接)</text>
        <!-- 第 2 个 RTT: HTTP 请求与数据返回 -->
        <line x1="60" y1="95" x2="360" y2="120" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow-amber)"/>
        <line x1="360" y1="120" x2="60" y2="155" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>
        <text x="210" y="105" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="700">HTTP 请求 (GET /index.html) ➔</text>
        <text x="210" y="145" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="700">服务器回传 HTML 数据文件 ➔</text>
        <!-- RTT 2 标尺 -->
        <line x1="375" y1="95" x2="375" y2="155" stroke="#ef4444" stroke-width="1.8"/>
        <text x="385" y="130" fill="#ef4444" font-size="11" font-weight="800">1 RTT (文档传输)</text>
        <!-- 传输耗时说明 -->
        <text x="210" y="180" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10.5">基础 HTML 页面总时延 = 2 RTT + 传输时延</text>
      </g>
      <!-- 右侧：408 核心算例总结卡 -->
      <g transform="translate(500, 10)">
        <rect x="0" y="0" width="190" height="185" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="95" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">408 时延真题大题定律</text>
        <line x1="8" y1="30" x2="182" y2="30" stroke="var(--vp-c-divider)"/>
        <text x="10" y="50" fill="#ef4444" font-size="10.5" font-weight="700">非持续连接 (HTTP/1.0)：</text>
        <text x="10" y="66" fill="var(--vp-c-text-2)" font-size="10">每个对象独立握手：</text>
        <text x="10" y="80" fill="#ef4444" font-size="10.5" font-weight="700">总时延 = 2(n + 1) RTT</text>
        <line x1="8" y1="92" x2="182" y2="92" stroke="var(--vp-c-divider)"/>
        <text x="10" y="112" fill="#10b981" font-size="10.5" font-weight="700">持续流水线 (HTTP/1.1)：</text>
        <text x="10" y="128" fill="var(--vp-c-text-2)" font-size="10">复用连接，所有对象打包：</text>
        <text x="10" y="144" fill="#10b981" font-size="12" font-weight="900">总时延仅需 3 RTT！</text>
        <line x1="8" y1="156" x2="182" y2="156" stroke="var(--vp-c-divider)"/>
        <text x="10" y="172" fill="#2563eb" font-size="9.5" font-weight="700">节省 2n - 1 个往返往来！</text>
      </g>
    </g>
  </svg>
</div>

* **非持续连接 (HTTP/1.0)**：
  * 每次请求一个网页内的元素（HTML、图片、JS、CSS），都必须重新建立一次完整的 TCP 三次握手；
  * 每个 Web 对象传输总时延 $= 1\text{ RTT (建立TCP)} + 1\text{ RTT (HTTP请求与响应)} + \text{数据传输时延} = \mathbf{2\text{ RTT} + T_{\text{传输}}}$。
* **持续连接 (HTTP/1.1)**：
  * 服务器发完响应后保持连接打开，供后续连续请求复用。
  * **非流水线方式 (Non-pipelined)**：客户端在收到前一个响应后，才能发出下一个请求（每个新对象需 $1\text{ RTT}$）；
  * **流水线方式 (Pipelined)**：客户端连续发出多个请求，无需等待前序响应到达，所有对象请求可打包在一个 RTT 内并行传输。

