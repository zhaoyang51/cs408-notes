# 第5章 传输层 (TCP / UDP)

<span class="badge badge-star">⭐️ TCP 拥塞控制与状态机必考</span>
<span class="badge badge-freq">📊 考频 ★★★★★</span>

---

## 1. TCP vs UDP 核心区别

| 特性维度 | TCP | UDP |
|:---|:---|:---|
| **连接状态** | **面向连接**（三次握手、四次挥手） | **无连接** |
| **可靠性** | **可靠交付**（确认重传、滑动窗口、保序去重） | **尽最大努力交付**（不可靠） |
| **传输形式** | **面向字节流** | **面向报文**（保留应用层边界） |
| **头部开销** | 最小 20 字节，最大 60 字节 | 固定 **8 字节** |

---

## 2. TCP 拥塞控制 4 大机制

1. **慢开始 (Slow Start)**：$cwnd$ 从 1 开始，每经过一个 RTT 指数翻倍 ($1, 2, 4, 8\dots$)，直到达到慢开始门限 $ssthresh$。
2. **拥塞避免 (Congestion Avoidance)**：$cwnd \ge ssthresh$ 后，每个 RTT 加法线性增加 ($+1$)。
3. **网络超时 (Timeout)**：$ssthresh$ 骤降为当前 $cwnd / 2$，$cwnd$ 重新重置为 1，重新进入慢开始。
4. **快重传与快恢复**：发送方连续收到 3 个冗余 ACK 时立即重传丢失报文，$ssthresh = cwnd/2$，$cwnd = ssthresh$ 并进入拥塞避免。
