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
---

## 4. CSMA/CA 协议与 IEEE 802.11 无线局域网

### 1. CSMA/CD vs CSMA/CA 核心机制对比
| 对比维度 | CSMA/CD (有线以太网 802.3) | CSMA/CA (无线局域网 802.11) |
|:---|:---|:---|
| **工作原理** | 先听后发，**边发边听，碰撞检测** | 先听后发，**碰撞避免，必须链路层 ACK 确认** |
| **不能用 CD 的原因** | 信号衰减小，可检测微弱碰撞电压 | 无线发射功率远大于接收功率无法边发边听；存在隐蔽站/暴露站 |
| **信道预约** | 无预约机制 | 可选 **RTS / CTS (短帧握手预约)** + **NAV (网络分配向量)** 虚拟载波监听 |
| **帧间间隔 (IFS)** | 96 bit 帧间最小间隔 | **SIFS (最短) < PIFS < DIFS (最长)** |

---

### 2. IEEE 802.11 数据帧 4 种地址字段速查（408 核心大题）

| 传输场景 | To DS | From DS | 地址 1 (RA 接收端) | 地址 2 (TA 发送端) | 地址 3 (DA 目的 / SA 源) | 考点映射 |
|:---|:---:|:---:|:---|:---|:---|:---|
| **工作站 ➔ AP ➔ 路由器 (发往外网)** | **1** | **0** | **AP 的 MAC** (直接接收) | **源工作站 MAC** (直接发送) | **路由器端口 MAC** (最终目的 DA) | **👑 2017 题 35** |
| **路由器 ➔ AP ➔ 工作站 (来自外网)** | 0 | 1 | **目的工作站 MAC** (直接接收) | **AP 的 MAC** (直接发送) | **路由器端口 MAC** (原始源 SA) | 下行接收模型 |
| **工作站 ➔ 工作站 (自组织网络)** | 0 | 0 | 目的工作站 MAC (DA) | 源工作站 MAC (SA) | BSSID (网络标识) | IBSS 直连 |

> 💡 **秒杀口诀**：**地址 1 永远是无线直接接收方 RA**，**地址 2 永远是无线直接发送方 TA**！发往外网时，地址 3 是最终目的路由器接口 MAC (DA)！

---

### 3. 帧间隙 (IFS) 体系与 RTS/CTS 握手时序
- **SIFS (短帧间隙)**：用于 CTS、DATA (收到 CTS 后)、ACK 等连续高优先级应答；
- **PIFS (点协调帧间隙)**：用于 AP 集中式轮询控制；
- **DIFS (分布式协调帧间隙)**：**最长帧间隙**，用于站点发起新的数据传输或 RTS 前争用监听信道；
- **传输时序**：
  $$\text{DIFS (最长)} \rightarrow \text{RTS} \rightarrow \text{SIFS} \rightarrow \text{CTS} \rightarrow \text{SIFS} \rightarrow \text{DATA} \rightarrow \text{SIFS} \rightarrow \text{ACK}$$
- **NAV (网络分配向量) 计算公式**：
  $$\text{NAV} = \text{SIFS} + t_{\text{DATA}} + \text{SIFS} + t_{\text{ACK}}$$

---

### 4. 408 统考真题纯文本精解 (5 题全解)

#### 📝 【2011 年 题 36】MAC 确认机制
- **题干**：对正确接收到的数据帧进行**确认**的 MAC 协议是？
- **解析**：CSMA/CD 无确认机制；CSMA/CA 误码率高且无法检测冲突，**必须由接收方返回 ACK 确认**（**选 D**）。

#### 📝 【2017 年 题 35】802.11 MAC 帧地址 1、2、3 判定
- **题干**：主机 H ($9a$) 发送访问外网的 802.11 帧 F 给 AP ($9b$)，AP 转给路由器 R ($9c$)。帧 F 的地址 1、2、3 分别是？
- **解析**：
  - 地址 1 (RA 直接接收) = AP 的 MAC ($9b$)；
  - 地址 2 (TA 直接发送) = H 的 MAC ($9a$)；
  - 地址 3 (DA 最终目的) = 路由器 R 的 MAC ($9c$)；
  - 答案：**9b, 9a, 9c**（**选 B**）。

#### 📝 【2018 年 题 35】CSMA/CA 信道预约方法
- **题干**：IEEE 802.11 无线局域网进行**信道预约**的方法是？
- **解析**：通过**交换 RTS 和 CTS 短控制帧**进行信道预约（**选 D**）。

#### 📝 【2020 年 题 37】IFS 帧间隔最长判定
- **题干**：发送 RTS 前等 IFS1，AP 收到 RTS 后等 IFS2 发 CTS，收到 CTS 后等 IFS3 发 DATA，收到 DATA 后等 IFS4 发 ACK。最长的是？
- **解析**：IFS1 为发起新传输的 **DIFS**，其余均为连续响应的 **SIFS**。根据 $\text{SIFS} < \text{PIFS} < \text{DIFS}$，**IFS1 最长**（**选 A**）。

#### 📝 【经典大题 题 36】隐藏站 NAV 网络分配向量计算
- **题干**：DIFS=128μs, SIFS=28μs, RTS=3μs, CTS=2μs, ACK=2μs。主机向 AP 发 1998 B 数据帧（带宽 54 Mb/s）。隐藏站 B 收到 CTS 时设置的 NAV 是？
- **解析**：
  1. 数据帧发送时延 $t_{\text{data}} = \frac{1998 \times 8\text{ bit}}{54\text{ Mb/s}} = \frac{15984}{54} = 296\ \mu\text{s}$；
  2. $\text{NAV} = \text{SIFS} + t_{\text{data}} + \text{SIFS} + t_{\text{ACK}} = 28 + 296 + 28 + 2 = \mathbf{354\ \mu\text{s}}$（**选 B**）。
