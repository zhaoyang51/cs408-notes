# 第3章 数据链路层与 MAC

<span class="badge badge-trap">🎯 经典计算大题与选择题</span>
<span class="badge badge-freq">📊 考频 35 次（滑动窗口与利用率 12 / CSMA 15 / 交换机设备 11）</span>

---

## 1. 滑动窗口协议全景对比 (停止-等待 vs GBN vs SR)

| 协议名称 | 发送窗口 $W_T$ | 接收窗口 $W_R$ | 确认机制与重传策略 | 帧序号比特数 $n$ 窗口约束 |
|:---|:---:|:---:|:---|:---:|
| **停止-等待 (Stop-and-Wait)** | 1 | 1 | 单帧逐一确认，超时重发当前帧 | $W_T + W_R \le 2^n \implies W_T = 1, n \ge 1$ |
| **后退 N 帧 (GBN)** | $> 1$ | 1 | **累计确认 (ACK $n$)**，超时**重传已发未确认全部帧** | $1 < W_T \le 2^n - 1 \implies n \ge \lceil \log_2(W_T + 1) \rceil$ |
| **选择重传 (SR)** | $> 1$ | $> 1$ | **单帧非累计确认**，仅重传出错帧，接收方设缓存区 | $W_T + W_R \le 2^n \implies W_T \le 2^{n-1}$ (通常 $W_T = W_R = 2^{n-1}$) |

---

## 2. 滑动窗口信道利用率与时延计算 (2012 题 36 连续发送模型)

<KP author="Zhao" title="📡 GBN 信道利用率与帧序号推导模型（2012 题 36）" tag="核心计算">
<GbnUtilizationSimulator />
</KP>

### 2.1 信道利用率与往返周期核心公式

::: info 💡 信道利用率与达到最高利用率的黄金判据
1. **单帧往返总周期 $T_{\text{cycle}}$**：
   $$T_{\text{cycle}} = t_{\text{tx}} + t_{\text{prop}} + t_{\text{ack}} + t_{\text{prop}} = t_{\text{tx}} + 2 \times t_{\text{prop}} + t_{\text{ack}}$$
   - $t_{\text{tx}} = \frac{\text{数据帧长 } L}{\text{传输速率 } C}$（数据帧发送时延）
   - $t_{\text{prop}} = \frac{\text{距离}}{\text{电磁波传播速度}}$（单向传播时延）
   - $t_{\text{ack}} = \frac{\text{确认帧长 } L_{\text{ack}}}{\text{传输速率 } C}$（确认帧发送时延，若确认帧很短可忽略为 0）

2. **信道利用率 $U$**：
   - **停止-等待协议**：$U = \frac{t_{\text{tx}}}{T_{\text{cycle}}} = \frac{t_{\text{tx}}}{t_{\text{tx}} + 2 \times t_{\text{prop}} + t_{\text{ack}}}$
   - **流水线 / GBN 协议**：$U = \min\left(1, \frac{W_T \times t_{\text{tx}}}{T_{\text{cycle}}}\right)$

3. **达到 $100\%$ 最高利用率的发送窗口与序号比特约束**：
   - 为使发送方在等待 ACK 的周期内无需停顿空闲，发送窗口满足：
     $$W_T \ge \left\lceil \frac{T_{\text{cycle}}}{t_{\text{tx}}} \right\rceil$$
   - **GBN 协议**：$W_T \le 2^n - 1 \implies 2^n \ge W_T + 1 \implies n \ge \lceil \log_2(W_T + 1) \rceil$
   - **SR 协议**：$W_T \le 2^{n-1} \implies 2^{n-1} \ge W_T \implies n \ge \lceil \log_2 W_T \rceil + 1$
:::

### 2.2 408 常见命题陷阱与极值分析法

::: warning ⚠️ 408 命题陷阱注意项
- **帧长范围极值陷阱**：若题目给定数据帧长为一个范围（如 $128 \sim 512$ 字节），为使信道利用率在**任何情况下均能达到最高**，必须按**最不利情况（即帧长最短 $L = 128$ 字节、发送时延最短、周期内需要连续发送的帧数最多、所需发送窗口最大）**进行计算！
- **确认帧长度陷阱**：仔细审题确认帧是否与数据帧等长。若题目明确说明“接收方以与数据帧等长的帧进行确认”，则必须计算确认帧发送时延 $t_{\text{ack}} = t_{\text{tx}}$；若未提及或说明“确认帧长忽略不计”，则 $t_{\text{ack}} \approx 0$。
:::

---

## 3. CSMA/CD 协议 (先听后发，边发边听)

::: info 💡 CSMA/CD 最短帧长与争用期公式

$$
\text{争用期 (冲突窗口)} = 2\tau \quad (\tau \text{ 为单程传播时延})
$$

$$
\text{最短帧长} = 2\tau \times \text{数据传输速率 } C \quad (\text{传统以太网最短帧长为 } 64 \text{ 字节})
$$

- 若发送的数据帧小于最短帧长，则在发生碰撞前该帧就已经发送完毕，发送方无法通过“边发边听”检测到该冲突，导致无效帧无法被识别重发。
- **二进制指数类型退避算法**：
  1. 确定基本退避时间为争用期 $2\tau$；
  2. 设重传次数 $k = \min(\text{重传次数}, 10)$；
  3. 从整数集合 $[0, 1, 2, \dots, 2^k - 1]$ 中随机选择一个整数 $r$，重传退避等待时间为 $r \times 2\tau$；
  4. 重传达到 16 次仍不成功，报错并向高层报告。
:::
## 4. CSMA/CA 协议与 IEEE 802.11 无线局域网

### 4.1 CSMA/CD vs CSMA/CA 核心差异对比

| 特性维度 | CSMA/CD (载波监听多路访问/碰撞检测) | CSMA/CA (载波监听多路访问/碰撞避免) |
|:---|:---|:---|
| **应用场景** | 有线以太网 (IEEE 802.3) | **无线局域网 (IEEE 802.11 / Wi-Fi)** |
| **核心机制** | **先听后发，边发边听，冲突停发** | **先听后发，碰撞避免 (CA)，必须确认 (ACK)** |
| **为什么无线局域网不能用 CD？** | 信号衰减小，可同时接收并检测信道微弱碰撞电压 | ① 无线信号衰减大（发射功率远大于接收功率），硬件无法边发边听；<br>② 存在**隐蔽站 (Hidden Terminal)** 与暴露站问题 |
| **信道预约与冲突解决** | 发生冲突后立即停发，执行二进制指数退避 | 采用 **RTS / CTS (请求发送/允许发送)** 机制预约信道，利用 **NAV (网络分配向量)** 进行虚拟载波监听 |
| **确认机制** | 无需链路层确认 (MAC 层无 ACK) | **必须有 ACK** (无线误码率高，每个单播数据帧均需显式确认) |

---

### 4.2 IEEE 802.11 帧间间隔 (IFS) 优先级体系与时序模型

<KP author="Zhao" title="📡 CSMA/CA 碰撞避免机制、帧间间隔 (IFS) 与 408 核心真题演练" tag="核心考点">

> 📺 **推荐视频精讲**：[【2024年 题36】802.11 RTS和CTS NAV_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1mTziYHERi/?p=4&vd_source=82d10a6ac42fc540b554068775f4bb8d)（深入剖析 RTS/CTS 信道预约与 NAV 向量计算细节）

<CsmaCaSimulator />

</KP>
