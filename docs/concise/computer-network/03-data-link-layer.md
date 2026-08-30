# 第3章 数据链路层与 MAC · 简洁速查

<span class="badge badge-freq">📊 考频 35 次（滑动窗口与利用率 12 / CSMA 15 / 交换机设备 11）</span>

---

## 1. 滑动窗口协议全景对比

| 协议名称 | 发送窗口 $W_T$ | 接收窗口 $W_R$ | 确认机制与重传策略 | 帧序号比特数 $n$ 限制 |
|:---|:---:|:---:|:---|:---:|
| **停止-等待 (Stop-and-Wait)** | 1 | 1 | 单帧逐一确认，超时重发当前帧 | $W_T + W_R \le 2^n \implies W_T = 1, n \ge 1$ |
| **后退 N 帧 (GBN)** | $> 1$ | 1 | **累计确认 (ACK $n$)**，超时**重传已发未确认全部帧** | $1 < W_T \le 2^n - 1 \implies n \ge \lceil \log_2(W_T + 1) \rceil$ |
| **选择重传 (SR)** | $> 1$ | $> 1$ | **单帧非累计逐一确认**，仅重传出错帧，接收方设缓存 | $W_T + W_R \le 2^n \implies W_T \le 2^{n-1}$ (通常 $W_T = W_R = 2^{n-1}$) |

---

## 2. 信道利用率与滑动窗口时延计算

::: info 💡 信道利用率与最高利用率判定公式
1. **单帧往返总周期 $T_{\text{cycle}}$**：
   $$T_{\text{cycle}} = t_{\text{tx}} + 2 \times t_{\text{prop}} + t_{\text{ack}}$$
   - $t_{\text{tx}} = \frac{L}{C}$（数据帧发送时延）
   - $t_{\text{prop}} = \frac{D}{V}$（单向传播时延）
   - $t_{\text{ack}} = \frac{L_{\text{ack}}}{C}$（确认帧发送时延，等长时 $t_{\text{ack}} = t_{\text{tx}}$，短帧忽略为 0）

2. **信道利用率 $U$**：
   - 停止-等待协议：$U = \frac{t_{\text{tx}}}{T_{\text{cycle}}}$
   - 流水线 / GBN 协议：$U = \min\left(1, \; \frac{W_T \times t_{\text{tx}}}{T_{\text{cycle}}}\right)$

3. **达到 $100\%$ 最高利用率所需窗口与序号比特**：
   $$W_T \ge \left\lceil \frac{T_{\text{cycle}}}{t_{\text{tx}}} \right\rceil$$
   - **GBN 协议**：$11 \le 2^n - 1 \implies 2^n \ge W_T + 1 \implies n \ge \lceil \log_2(W_T + 1) \rceil$
   - **SR 协议**：$W_T \le 2^{n-1} \implies n \ge \lceil \log_2 W_T \rceil + 1$
:::

### 📝 【2012 年 统考题 36】真题纯文本推导精解
- **题干**：两台主机采用 GBN，速率 16kbps，单向时延 270ms，帧长 128~512B，确认帧与数据帧等长。为使信道利用率达到最高，帧序号比特数至少为？
- **推导解析**：
  1. **极值陷阱**：为在任何情况下利用率最高，需按最不利情况取最短帧长 $L = 128\text{ B}$（发送时延最短、窗口需求最大）；
  2. 发送时延 $t_{\text{tx}} = \frac{128 \times 8}{16000} = 64\text{ ms}$；确认帧 $t_{\text{ack}} = 64\text{ ms}$；
  3. 单帧往返周期 $T_{\text{cycle}} = 64 + 270 \times 2 + 64 = 668\text{ ms}$；
  4. 周期内需连续发帧数 $N = \frac{668}{64} = 10.4375 \implies W_T \ge 11$；
  5. GBN 窗口约束 $11 \le 2^n - 1 \implies 2^n \ge 12 \implies n \ge 4$（**正确答案：4 位**）。

---

## 3. CSMA/CD 协议 (先听后发，边发边听)

::: info 💡 CSMA/CD 争用期与最短帧长
- **争用期 (冲突窗口)**：$2\tau$（$\tau$ 为单程传播时延）；
- **最短帧长公式**：$L_{\min} = 2\tau \times \text{数据传输速率 } C$（传统以太网最短帧长为 64 字节）；
- **二进制指数类型退避算法**：
  1. 基本退避时间为争用期 $2\tau$；
  2. 重传次数 $k = \min(\text{重传次数}, 10)$；
  3. 从 $[0, 1, 2, \dots, 2^k - 1]$ 中随机抽取整数 $r$，退避等待时间 $= r \times 2\tau$；
  4. 重传 16 次仍不成功则报错。
:::
---

## 4. CSMA/CA 协议与 IEEE 802.11 无线局域网

### 1. CSMA/CD vs CSMA/CA 核心机制对比
| 对比维度 | CSMA/CD (有线 802.3) | CSMA/CA (无线 802.11) |
|:---|:---|:---|
| **工作原理** | 先听后发，**边发边听，碰撞检测** | 先听后发，**碰撞避免，必须 ACK 确认** |
| **不能用 CD 的原因** | 信号衰减小，可检测碰撞电压 | 无线发射功率远大于接收功率无法边发边听；存在隐蔽站/暴露站 |
| **信道预约** | 无预约机制 | 可选 **RTS / CTS (短帧握手预约)** + **NAV (网络分配向量)** 虚拟监听 |
| **帧间间隔 (IFS)** | 96 bit 帧间最小间隔 | **SIFS (最短) < PIFS < DIFS (最长)** |

---

### 2. 帧间隙 (IFS) 体系与 RTS/CTS 握手时序
- **SIFS (短帧间隙)**：用于 CTS、DATA (收到 CTS 后)、ACK 等连续高优先级应答；
- **PIFS (点协调帧间隙)**：用于 AP 集中式轮询控制；
- **DIFS (分布式协调帧间隙)**：**最长帧间隙**，用于站点发起新的数据传输或 RTS 前争用监听信道；
- **传输过程**：
  $$\text{DIFS} \rightarrow \text{RTS} \rightarrow \text{SIFS} \rightarrow \text{CTS} \rightarrow \text{SIFS} \rightarrow \text{DATA} \rightarrow \text{SIFS} \rightarrow \text{ACK}$$

---

### 3. 408 核心真题纯文本精解

#### 📝 【真题 1】CSMA/CA 传输时延计算
- **题干**：采用 CSMA/CA 的 IEEE 802.11，速率 300 Mbps，DIFS = 128 μs，SIFS = 28 μs。忽略其他帧传输与传播时延，发送 1500 B 数据帧，从**开始发送数据帧**至**确认接收方收到**所需时间至少为？
- **解析**：
  1. 数据帧发送时延 $t_{\text{data}} = \frac{1500 \times 8\text{ bit}}{300\text{ b}/\mu\text{s}} = 40\ \mu\text{s}$；
  2. 接收方等待 $\text{SIFS} = 28\ \mu\text{s}$ 发送 ACK；
  3. DIFS 发生在发送数据帧之前，不计入发送至确认的时间；
  4. 最少时间 $= t_{\text{data}} + \text{SIFS} = 40 + 28 = \mathbf{68\ \mu\text{s}}$（选 B）。

#### 📝 【真题 2 (2018 题 37)】IFS 帧间隔长度辨析
- **题干**：主机 H 发送 RTS 前等 IFS1；AP 收到 RTS 后等 IFS2 发送 CTS；H 收到 CTS 后等 IFS3 发送 DATA；AP 收到 DATA 后等 IFS4 发送 ACK。所等待的 IFS 中最长的是？
- **解析**：
  1. IFS1 为发起新对话的 **DIFS**；IFS2、IFS3、IFS4 均为同一对话的连续响应 **SIFS**；
  2. 根据 IEEE 802.11 优先级规范：$\text{SIFS} < \text{PIFS} < \text{DIFS}$，故 **IFS1 (DIFS) 最长**（选 A）。
