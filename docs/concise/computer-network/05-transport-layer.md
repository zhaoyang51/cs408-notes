# 第5章 传输层 (TCP / UDP) · 考研手写笔记

> [!TIP]
> **本章核心脉络**：本章提炼自手写笔记 P14~P16，直击端口号体系、UDP 伪首部与校验和、TCP 首部 6 大控制位、三次握手与四次挥手状态转移（含 2MSL 考点）、滑动窗口与零窗口探测、慢开始/拥塞避免/快重传/快恢复算法、以及历年经典数据量与总时延计算大题。

---

## 🚪 端口号体系与套接字 (Socket)

### ❓ 端口号长度与常见熟知端口速查

* **端口号长度**：占 **16 bit**，取值范围为 $0 \sim 2^{16}-1$（即 $0 \sim 65535$）。
  * 熟知端口号（系统端口）：$0 \sim 1023$
  * 登记端口号：$1024 \sim 49151$
  * 客户端临时端口号：$49152 \sim 65535$

| 服务 / 协议名称 | 默认端口号 | 传输层支撑协议 | 典型应用场景 |
| :--- | :---: | :---: | :--- |
| **FTP (控制连接)** | **21** | TCP | 传输控制指令与认证信息 |
| **FTP (数据连接)** | **20** | TCP | 主动模式 (PORT) 下传输文件数据 |
| **SSH** | **22** | TCP | 安全加密远程登录与命令执行 |
| **TELNET** | **23** | TCP | 明文远程终端登录 |
| **SMTP** | **25** | TCP | 邮件发送与服务器间转送 |
| **DNS** | **53** | **UDP** (主) / TCP | 域名解析（区域传输走 TCP） |
| **HTTP** | **80** | TCP | 超文本传输服务 |
| **POP3** | **110** | TCP | 邮件拉取客户端协议 |
| **HTTPS** | **443** | TCP | SSL/TLS 加密网页安全传输 |

::: tip 💡 套接字 (Socket) 唯一性定义
$$\text{Socket} = (\text{IP 地址} : \text{端口号})$$
套接字可以在全网中**唯一标识一台主机上的某一个网络应用进程**。
:::

---

## ⚡ UDP 协议与 8 字节首部

### ❓ UDP 协议核心特点

1. **无连接、不可靠**：发送前无需建立连接，不保证可靠交付，无滑动窗口与重传；
2. **面向报文**：应用层交给 UDP 多长的报文，UDP 照样发送，**既不合并也不拆分**，保留报文边界；
3. **首部极小（仅 8 字节）**：开销远低于 TCP，无拥塞控制，传输时延低，适合实时语音/视频流与小请求（DNS/DHCP）；
4. **支持多样化通信**：支持单播（1对1）、多播（1对多）、广播（全网泛洪）。

---

### ❓ UDP 首部 4 大字段与伪首部校验和计算

```
 0                   15 16                  31
+----------------------+----------------------+
|    16 位源端口号     |    16 位目的端口号   |
+----------------------+----------------------+
|     16 位 UDP 长度   |     16 位 UDP 校验和 |
+----------------------+----------------------+
|<------------------- 8 字节 ----------------->|
```

* **UDP 长度**：首部 + 数据的总字节数（最小为 8B）。
* **校验和计算机制（带 12 字节伪首部）**：
  * 计算校验和时，临时在 UDP 报文前追加 **12 字节的伪首部**（源 IP 4B、目的 IP 4B、全0 1B、协议号17 1B、UDP长度 2B）；
  * 将“伪首部 + UDP首部 + 数据”按 16 位（2 字节）切分；
  * **按二进制反码求和，求和结果取反填入校验和字段**；
  * 接收方同样连同伪首部按 16 位反码求和，**若全为 1（或结果为 0）则校验成功无差错**。
::: tip 💡 408 细节点拨
* UDP 校验和是**可选的**（若不计算则全填 0）；
* 但若计算校验和后**结果恰好为全 0，必须反转存为全 1**，以与“不校验(全0)”严格区分！
:::

---

## 🛡️ TCP 协议特性与 20 字节首部

### ❓ TCP 首部核心字段与 6 大标志位

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · TCP 报文段 20 字节标准首部结构与六大控制标志位</span>
    <span class="diagram-badge">P58 手记草图</span>
  </div>
  <svg viewBox="0 0 720 230" width="100%" height="230">
    <g transform="translate(15, 12)">
      <!-- TCP 报头 32 位网格 (左侧) -->
      <g transform="translate(0, 0)">
        <text x="0" y="12" fill="var(--vp-c-text-3)" font-size="9.5">0 bit</text>
        <text x="240" y="12" fill="var(--vp-c-text-3)" font-size="9.5">16</text>
        <text x="480" y="12" text-anchor="end" fill="var(--vp-c-text-3)" font-size="9.5">31 bit</text>
        <!-- 行 1: 源端口(16) | 目的端口(16) -->
        <g transform="translate(0, 18)">
          <rect x="0" y="0" width="240" height="28" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
          <text x="120" y="18" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11">16 位源端口号 (Source Port)</text>
          <rect x="240" y="0" width="240" height="28" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
          <text x="360" y="18" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11">16 位目的端口号 (Dest Port)</text>
        </g>
        <!-- 行 2: 序号 (32) -->
        <g transform="translate(0, 48)">
          <rect x="0" y="0" width="480" height="28" fill="rgba(37,99,235,0.15)" stroke="#2563eb" stroke-width="2"/>
          <text x="240" y="18" text-anchor="middle" fill="#2563eb" font-size="11.5" font-weight="800">32 位序号 (Sequence Number · 发送数据首字节编号)</text>
        </g>
        <!-- 行 3: 确认号 (32) -->
        <g transform="translate(0, 78)">
          <rect x="0" y="0" width="480" height="28" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2"/>
          <text x="240" y="18" text-anchor="middle" fill="#10b981" font-size="11.5" font-weight="800">32 位确认号 (Acknowledgment Number · 期望收到下个字节)</text>
        </g>
        <!-- 行 4: 首长(4) | 保留(6) | 六大标志位(6) | 窗口(16) -->
        <g transform="translate(0, 108)">
          <rect x="0" y="0" width="60" height="28" fill="rgba(245,158,11,0.18)" stroke="#f59e0b" stroke-width="1.8"/>
          <text x="30" y="18" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="800">首长(4B)</text>
          <rect x="60" y="0" width="50" height="28" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
          <text x="85" y="18" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10">保留</text>
          <!-- 6 大标志 -->
          <rect x="110" y="0" width="130" height="28" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1.8"/>
          <text x="175" y="18" text-anchor="middle" fill="#ef4444" font-size="9.5" font-weight="800">U A P R S F</text>
          <!-- 接收窗口 rwnd -->
          <rect x="240" y="0" width="240" height="28" fill="rgba(37,99,235,0.12)" stroke="#2563eb"/>
          <text x="360" y="18" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="700">16 位接收窗口 rwnd (流量控制)</text>
        </g>
        <!-- 行 5: 校验和(16) | 紧急指针(16) -->
        <g transform="translate(0, 138)">
          <rect x="0" y="0" width="240" height="28" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
          <text x="120" y="18" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10.5">16 位校验和 (首部 + 数据)</text>
          <rect x="240" y="0" width="240" height="28" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)"/>
          <text x="360" y="18" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="10.5">16 位紧急指针 (配合 URG 标志)</text>
        </g>
        <text x="240" y="186" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="10">固定 20 字节基本首部（可含 0~40 字节选项扩展）</text>
      </g>
      <!-- 右侧：六大标志位速记卡 -->
      <g transform="translate(500, 10)">
        <rect x="0" y="0" width="190" height="195" fill="var(--vp-c-bg-alt)" stroke="var(--vp-c-divider)" stroke-width="1.8" rx="8"/>
        <text x="95" y="22" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11.5" font-weight="800">TCP 六大控制标志位</text>
        <line x1="8" y1="30" x2="182" y2="30" stroke="var(--vp-c-divider)"/>
        <text x="10" y="50" fill="#ef4444" font-size="10.5" font-weight="700">URG：紧急数据优先插队</text>
        <text x="10" y="72" fill="#10b981" font-size="10.5" font-weight="700">ACK：确认号有效(握手后恒1)</text>
        <text x="10" y="94" fill="#2563eb" font-size="10.5" font-weight="700">PSH：尽快上送不滞留缓存</text>
        <text x="10" y="116" fill="#ef4444" font-size="10.5" font-weight="700">RST：连接故障强制复位</text>
        <text x="10" y="138" fill="#2563eb" font-size="10.5" font-weight="700">SYN：同步建立连接(消耗1序)</text>
        <text x="10" y="160" fill="#f59e0b" font-size="10.5" font-weight="700">FIN：单向释放连接(消耗1序)</text>
        <line x1="8" y1="172" x2="182" y2="172" stroke="var(--vp-c-divider)"/>
        <text x="10" y="186" fill="var(--vp-c-text-3)" font-size="9.5">首部长度单位：4 字节</text>
      </g>
    </g>
  </svg>
</div>

* **4 位首部长度**：以 **4 字节** 为单位（最小值 5 即 $20\text{ B}$，最大值 15 即 $60\text{ B}$）。
* **32 位序号 (seq)**：本报文段所发送数据的**第一个字节的序号**。
* **32 位确认号 (ack)**：**期望收到的对方下一个报文段的第一个数据字节的序号**。
  * 💡 **例**：若接收方已成功收到 $400 \sim 403$ 和 $408 \sim 410$ 字节，其回送的 ACK 确认号依然为 **404**（累积确认：404 之前均已按序到达）！
* **6 大标志位 (Flags)**：
  1. **URG (Urgent)**：紧急指针有效，高优先级插队数据；
  2. **ACK (Acknowledgment)**：确认号有效。**连接建立后所有报文段 ACK 恒为 1**；
  3. **PSH (Push)**：推送操作，接收端尽快交付应用进程，无需等缓存满；
  4. **RST (Reset)**：复位重置连接；
  5. **SYN (Synchronize)**：同步序号，连接建立标志。
     * $SYN=1, ACK=0$：连接请求报文；
     * $SYN=1, ACK=1$：同意连接响应报文；
  6. **FIN (Finish)**：释放连接标志，表示发送方数据已全数发毕。

---

## 🤝 三次握手与四次挥手状态机全解

### ❓ TCP 建立连接（三次握手）

<div class="handdrawn-diagram-card">
  <div class="diagram-header">
    <span class="diagram-icon">🎨</span>
    <span class="diagram-title">原稿手绘图解 · TCP 三次握手与四次挥手状态跃迁时序全景图</span>
    <span class="diagram-badge">P59 手记草图</span>
  </div>
  <svg viewBox="0 0 720 290" width="100%" height="290">
    <g transform="translate(15, 12)">
      <!-- 左半区：三次握手 (Three-Way Handshake) -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="340" height="265" fill="rgba(37,99,235,0.04)" stroke="#2563eb" stroke-width="1.8" rx="8"/>
        <text x="170" y="20" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="800">🤝 TCP 三次握手 (连接建立)</text>
        <!-- Client 轴 & Server 轴 -->
        <text x="50" y="42" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="700">客户端</text>
        <text x="290" y="42" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="700">服务端</text>
        <line x1="50" y1="48" x2="50" y2="245" stroke="var(--vp-c-divider)" stroke-width="2"/>
        <line x1="290" y1="48" x2="290" y2="245" stroke="var(--vp-c-divider)" stroke-width="2"/>
        <!-- 初始状态 -->
        <text x="45" y="65" text-anchor="end" fill="var(--vp-c-text-3)" font-size="9.5">CLOSED</text>
        <text x="295" y="65" fill="#10b981" font-size="9.5" font-weight="700">LISTEN</text>
        <!-- 握手 1: SYN=1, seq=x -->
        <line x1="50" y1="80" x2="290" y2="110" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
        <text x="170" y="90" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="700">① SYN=1, seq=x</text>
        <text x="45" y="95" text-anchor="end" fill="#2563eb" font-size="9.5">SYN-SENT</text>
        <text x="295" y="115" fill="#f59e0b" font-size="9.5">SYN-RCVD</text>
        <!-- 握手 2: SYN=1, ACK=1, seq=y, ack=x+1 -->
        <line x1="290" y1="130" x2="50" y2="160" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-green)"/>
        <text x="170" y="140" text-anchor="middle" fill="#10b981" font-size="10" font-weight="700">② SYN=1, ACK=1, seq=y, ack=x+1</text>
        <text x="45" y="175" text-anchor="end" fill="#10b981" font-size="9.5" font-weight="800">ESTABLISHED</text>
        <!-- 握手 3: ACK=1, seq=x+1, ack=y+1 -->
        <line x1="50" y1="180" x2="290" y2="210" stroke="#2563eb" stroke-width="2" marker-end="url(#arrow-blue)"/>
        <text x="170" y="192" text-anchor="middle" fill="#2563eb" font-size="10" font-weight="700">③ ACK=1, seq=x+1, ack=y+1</text>
        <text x="295" y="215" fill="#10b981" font-size="9.5" font-weight="800">ESTABLISHED</text>
        <text x="170" y="248" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="9.5">★ 前两次握手 SYN 消耗 1 序号，第3次可载数</text>
      </g>
      <!-- 右半区：四次挥手 (Four-Way Wavehand) -->
      <g transform="translate(360, 0)">
        <rect x="0" y="0" width="340" height="265" fill="rgba(239,68,68,0.04)" stroke="#ef4444" stroke-width="1.8" rx="8"/>
        <text x="170" y="20" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="800">👋 TCP 四次挥手 (连接释放)</text>
        <!-- Client 轴 & Server 轴 -->
        <text x="50" y="42" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="700">客户端</text>
        <text x="290" y="42" text-anchor="middle" fill="var(--vp-c-text-1)" font-size="11" font-weight="700">服务端</text>
        <line x1="50" y1="48" x2="50" y2="245" stroke="var(--vp-c-divider)" stroke-width="2"/>
        <line x1="290" y1="48" x2="290" y2="245" stroke="var(--vp-c-divider)" stroke-width="2"/>
        <!-- 挥手 1: FIN=1, seq=u -->
        <line x1="50" y1="65" x2="290" y2="90" stroke="#ef4444" stroke-width="1.8" marker-end="url(#arrow-red)"/>
        <text x="170" y="74" text-anchor="middle" fill="#ef4444" font-size="9.5" font-weight="700">① FIN=1, seq=u</text>
        <text x="45" y="80" text-anchor="end" fill="#ef4444" font-size="9">FIN-WAIT-1</text>
        <text x="295" y="95" fill="#f59e0b" font-size="9">CLOSE-WAIT</text>
        <!-- 挥手 2: ACK=1, seq=v, ack=u+1 -->
        <line x1="290" y1="105" x2="50" y2="130" stroke="var(--vp-c-text-2)" stroke-width="1.8" marker-end="url(#arrow-gray)"/>
        <text x="170" y="114" text-anchor="middle" fill="var(--vp-c-text-2)" font-size="9.5">② ACK=1, seq=v, ack=u+1</text>
        <text x="45" y="135" text-anchor="end" fill="#f59e0b" font-size="9">FIN-WAIT-2</text>
        <text x="170" y="145" text-anchor="middle" fill="var(--vp-c-text-3)" font-size="9">(半关闭: Server可继续发数据)</text>
        <!-- 挥手 3: FIN=1, ACK=1, seq=w, ack=u+1 -->
        <line x1="290" y1="155" x2="50" y2="180" stroke="#ef4444" stroke-width="1.8" marker-end="url(#arrow-red)"/>
        <text x="170" y="164" text-anchor="middle" fill="#ef4444" font-size="9.5" font-weight="700">③ FIN=1, ACK=1, seq=w</text>
        <text x="295" y="165" fill="#ef4444" font-size="9">LAST-ACK</text>
        <text x="45" y="185" text-anchor="end" fill="#2563eb" font-size="9" font-weight="800">TIME-WAIT</text>
        <!-- 挥手 4: ACK=1, seq=u+1, ack=w+1 -->
        <line x1="50" y1="195" x2="290" y2="220" stroke="#10b981" stroke-width="1.8" marker-end="url(#arrow-green)"/>
        <text x="170" y="204" text-anchor="middle" fill="#10b981" font-size="9.5" font-weight="700">④ ACK=1, seq=u+1, ack=w+1</text>
        <text x="295" y="225" fill="var(--vp-c-text-3)" font-size="9">CLOSED</text>
        <!-- 2MSL 倒计时 -->
        <rect x="15" y="222" width="70" height="20" fill="rgba(37,99,235,0.15)" stroke="#2563eb" rx="2"/>
        <text x="50" y="236" text-anchor="middle" fill="#2563eb" font-size="9" font-weight="800">等 2MSL ➔ CLOSED</text>
      </g>
    </g>
  </svg>
</div>

### ❓ 为什么客户端在 TIME-WAIT 必须等待 2MSL？
1. **确保最后一个确认报文能到达服务端**：若客户端发的第 4 次 ACK 丢失，服务端会重传第 3 次 FIN，客户端在 $2\text{MSL}$ 内能再次收到该 FIN 并重发 ACK，避免服务端无法正常关闭；
2. **防止“已失效的旧连接请求报文段”出现在新连接中**：等待 $2\text{MSL}$ 可以让本连接持续时间内所产生的所有报文段从网络中彻底消失。

---

## 📈 拥塞控制四大算法与 2024 真题

### ❓ 慢开始、拥塞避免、快重传与快恢复

$$\text{有效发送窗口} = \min\{\text{接收窗口 rwnd}, \text{拥塞窗口 cwnd}\}$$

1. **慢开始 (Slow Start)**：
   * 初始 $\text{cwnd} = 1\text{ MSS}$；
   * 每收到一个 ACK，$\text{cwnd}$ 加 1（即每个 RTT **指数倍增**：$1 \to 2 \to 4 \to 8 \dots$）；
2. **拥塞避免 (Congestion Avoidance)**：
   * 当 $\text{cwnd} \ge \text{ssthresh}$（门限值）时，改为**加法增大**，每个 RTT 只增加 $1\text{ MSS}$（线性上升）；
3. **超时 (Timeout) 惩罚**：
   * 新门限 $\text{ssthresh} = \text{cwnd} / 2$；
   * 拥塞窗口猛降为 $\text{cwnd} = 1\text{ MSS}$，重新慢开始；
4. **快重传与快恢复 (Fast Retransmit & Recovery)**：
   * **触发条件**：接收方收到失序段，立即发送冗余 ACK；发送方**连续收到 3 个冗余 ACK（共 4 个相同 ACK）**；
   * **快重传**：立即重传该缺失报文，无需等超时；
   * **快恢复**：新门限 $\text{ssthresh} = \text{cwnd} / 2$，拥塞窗口直接置为 $\text{cwnd} = \text{ssthresh}$，直接进入拥塞避免。

---

### ❓ 408 历年经典大题：连接时延与数据量计算

#### 题型 1：有效载荷字节数推导
> **题目**：甲与乙建立 TCP 连接，SYN 报文段中 `seq = 1000`；释放连接时甲发的 FIN 报文段中 `seq = 5001`。求甲向乙发送的应用层数据字节数是多少？
> 
> **解答推导**：
> * SYN 消耗 1 个序号，故数据从 `seq = 1001` 开始编号；
> * FIN 消耗 1 个序号，其 `seq = 5001` 紧跟在最后一个数据字节之后；
> * 数据区间为 $[1001, 5000]$，总字节数 $= 5000 - 1001 + 1 = \mathbf{4000\text{ 字节}}$。

#### 题型 2：全流程通信总时延计算
> **题目**：主机 H 发送 3000B 数据，$RTT = 10\text{ ms}, MSL = 30\text{ s}, MSS = 1000\text{ B}$。从 H 请求建立连接开始，到进入 CLOSED 状态为止，求所需总时间。
> 
> **解答推导**：
> 1. **连接建立**：$1\text{ RTT}$（客户端收到第二次握手即确认连接，并在第三次握手捎带第 1 批数据）$= 10\text{ ms}$；
> 2. **数据传输**（慢开始 $1 \to 2$）：
>    * 第 1 批发 $1000\text{ B}$，耗时 $1\text{ RTT} = 10\text{ ms}$；
>    * 收到 ACK 后 cwnd 增至 2，第 2 批发 $2000\text{ B}$，耗时 $1\text{ RTT} = 10\text{ ms}$；
> 3. **连接释放**：
>    * H 发送 FIN，收到响应与服务端 FIN，耗时 $1.5\text{ RTT} = 15\text{ ms}$；
>    * H 发出最后一个 ACK 后进入 TIME_WAIT，需等待 $2\text{MSL} = 2 \times 30\text{ s} = 60\text{ s}$；
> 4. **总耗时**：
>    $$T = 10\text{ ms} + 10\text{ ms} + 10\text{ ms} + 15\text{ ms} + 60\text{ s} = \mathbf{60.045\text{ 秒}}$$

