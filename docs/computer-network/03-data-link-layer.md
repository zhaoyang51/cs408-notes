# 第3章 数据链路层与 MAC

<span class="badge badge-star">⭐️ 滑动窗口与 CSMA/CD 计算重点</span>
<span class="badge badge-freq">📊 考频 ★★★★★</span>

---

## 1. 滑动窗口协议全景对比

| 协议名称 | 发送窗口 $W_T$ | 接收窗口 $W_R$ | 确认机制 | $n$ 位帧序号窗口限制 |
|:---|:---:|:---:|:---|:---:|
| **停止-等待** | 1 | 1 | 单帧确认 | $W_T + W_R \le 2^n \Rightarrow W_T = 1$ |
| **后退 N 帧 (GBN)** | $> 1$ | 1 | **累计确认** (丢一重传全部) | $W_T \le 2^n - 1$ |
| **选择重传 (SR)** | $> 1$ | $> 1$ | **单帧逐一确认** | $W_T + W_R \le 2^n \Rightarrow W_T \le 2^{n-1}$ |

---

## 2. CSMA/CD 协议（先听后发，边发边听）

::: info 💡 CSMA/CD 最短帧长与争用期公式


$$
\text{争用期 (冲突窗口)} = 2\tau \quad (\tau \text{ 为单程传播时延})
$$


  


$$
\text{最短帧长} = 2\tau \times \text{数据传输速率} \quad (\text{传统以太网最短帧长为 } 64 \text{ 字节})
$$


:::

