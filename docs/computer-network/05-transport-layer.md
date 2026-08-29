# 第5章 传输层 (TCP / UDP)

<span class="badge badge-star">⭐️ 协议综合大题 (10分)</span>
<span class="badge badge-freq">📊 考频 33 次（TCP 拥塞控制 12 / 握手挥手 9 / 报文段 8 / 流量控制 4）</span>

---

## 1. TCP vs UDP 核心区别

### 1.1 核心特性对比表

| 特性维度 | TCP | UDP |
|:---|:---|:---|
| **连接状态** | **面向连接**（三次握手、四次挥手） | **无连接** |
| **可靠性** | **可靠交付**（确认重传、滑动窗口、保序去重） | **尽最大努力交付**（不可靠） |
| **传输形式** | **面向字节流** | **面向报文**（保留应用层边界） |
| **头部开销** | 最小 20 字节，最大 60 字节 | 固定 **8 字节** |

---

## 2. TCP 报文段首部格式与字段全景剖析 <AuthorTag author="Zhao" />

<KP author="Zhao" title="📦 TCP 报文段首部格式与 6 大控制标志位速查" tag="⭐️ 考研必背">

<TcpHeaderFormat />

### 2.1 数据偏移与首部长度计算准则
$$
\text{TCP 首部长度} = \text{数据偏移字段值} \times 4 \text{ 字节}
$$
- **固定首部**：20 字节（数据偏移二进制为 `0101`，即 $5 \times 4\text{B} = 20\text{B}$）；
- **首部最大长度**：60 字节（数据偏移二进制为 `1111`，即 $15 \times 4\text{B} = 60\text{B}$，包含最大 40 字节选项）。

</KP>

---

## 3. TCP 拥塞控制 4 大机制全景 <AuthorTag author="Zhao" />

<KP author="Zhao" title="📈 TCP 拥塞控制 4 大机制全景演化图（2009 题 39 经典模型剖析）" tag="⭐️ 考研必背">

<TcpCongestionControl />

</KP>

---

## 4. TCP 滑动窗口与流量控制（rwnd vs cwnd 动态计算） <AuthorTag author="Zhao" />

<KP author="Zhao" title="🌊 TCP 滑动窗口与流量控制全景图解（真题经典模型推导）" tag="⭐️ 考研必背">

<TcpFlowControl />

### 4.1 408 流量控制核心计算法则

#### 1. 发送窗口决定公式
$$
\text{实际发送窗口 } W = \min(\text{cwnd}, \text{rwnd})
$$
- **$\text{cwnd}$（拥塞窗口）**：发送方根据网络拥塞程度估计的窗口大小；
- **$\text{rwnd}$（接收窗口）**：接收方在 TCP 报文段首部通告的接收缓存剩余空间。

#### 2. 滑动窗口左右边界移动原则
- **左沿推进（收缩/前移）**：当收到确认号 $\text{ACK} = k$ 时，表示序号 $< k$ 的所有字节已全部被接收方累计确认，左沿向前推进到序号 $k$；
- **右沿位置确定**：$\text{右沿} = \text{左沿} + W = k + \min(\text{cwnd}, \text{rwnd}) - 1$；
- **还可发送字节数计算**：
  $$
  \text{还可发送字节数} = \text{当前发送窗口大小 } W - \text{已发送但未收到确认的字节数}
  $$

</KP>

---

## 5. TCP 可靠传输实现与累计确认（序号与确认号推导） <AuthorTag author="Zhao" />

<KP author="Zhao" title="🛡️ TCP 可靠传输与累计确认模型（2011 题 40 经典真题推导）" tag="⭐️ 考研必背">

<TcpReliableTransfer />

### 5.1 序号 (seq) 与 确认号 (ack) 核心计算准则

#### 1. 报文段包含的字节区间
对于起始序号为 $\text{seq}$、有效载荷大小为 $L$ 字节的 TCP 报文段，其所携带的数据字节序号范围为：
$$
[\text{seq}, \; \text{seq} + L - 1]
$$

#### 2. 累计确认号 (ACK) 计算法则
$$
\text{确认号 ACK} = \text{已连续按序正确接收的最后一个字节序号} + 1
$$
- **语义**：期望收到对方发送的下一个报文段的第 1 个数据字节的序号；
- **失序报文处理**：失序到达的报文段会被放入接收缓存暂存，但确认号**绝不会跨越缺失的报文段**，依然只能确认连续到达的最后一个字节。

</KP>

---

## 6. TCP 运输连接管理（三次握手与四次挥手全景） <AuthorTag author="Zhao" />

<KP author="Zhao" title="🤝 TCP 三次握手建立连接与四次挥手释放连接全景（2011 题 39 经典真题推导）" tag="⭐️ 考研必背">

<TcpConnectionManagement />

### 6.1 三次握手控制位与序号演进铁律

| 握手轮次 | 方向 | 报文段特征与控制位 | 序号与确认号规则 | 客户端状态 | 服务端状态 |
|:---|:---|:---|:---|:---|:---|
| **第 1 次** | 客户 $\rightarrow$ 服务 | **SYN = 1**, ACK = 0 | $\text{seq} = x$（随机初始序号） | CLOSED $\rightarrow$ **SYN-SENT** | LISTEN |
| **第 2 次** | 服务 $\rightarrow$ 客户 | **SYN = 1**, **ACK = 1** | $\text{seq} = y$（随机初始序号）, **$\text{ack} = x + 1$** | SYN-SENT | LISTEN $\rightarrow$ **SYN-RCVD** |
| **第 3 次** | 客户 $\rightarrow$ 服务 | SYN = 0, **ACK = 1** | $\text{seq} = x + 1$, **$\text{ack} = y + 1$** | SYN-SENT $\rightarrow$ **ESTABLISHED** | SYN-RCVD $\rightarrow$ **ESTABLISHED** |

> [!TIP] ⭐️ 408 核心规律总结
> 1. **SYN 报文段虽然不携带数据，但必须消耗 1 个序号**（因此确认号 $\text{ack} = \text{对方序号} + 1$）；
> 2. **前两次握手必须将 $\text{SYN} = 1$**，第三次握手连接建立后 $\text{SYN} = 0$；
> 3. **除第一次握手外，之后的所有 TCP 报文段都必须将 $\text{ACK} = 1$**。

</KP>
