# 第1章 计算机网络体系结构

<span class="badge badge-freq">📊 考频 18 次（体系结构 12 / 时延计算 6）</span>
<span class="badge badge-formula">💡 时延 4 大公式</span>

---

## 1. 4 大网络时延核心计算公式

$$
\text{总时延 } D = \text{发送时延 } D_t + \text{传播时延 } D_p + \text{处理时延 } D_r + \text{排队时延 } D_q
$$

$$
\text{发送时延 (传输时延)} = \frac{\text{数据帧长度 (bit)}}{\text{数据传输速率 (b/s)}}
$$

$$
\text{传播时延} = \frac{\text{物理信道长度 (m)}}{\text{电磁波传播速率 (m/s)}} \quad (\text{光纤/铜线中速率 } v \approx 2 \times 10^8 \text{ m/s})
$$

$$
\text{时延带宽积} = \text{传播时延} \times \text{信道带宽 (单位: bit)}
$$

---

## 2. OSI 7 层体系 vs TCP/IP 4 层体系对比

| OSI 7 层体系 | TCP/IP 4 层体系 | 对等层数据单元 (PDU) | 典型网络协议 |
|:---|:---|:---:|:---|
| **应用层 / 表示层 / 会话层** | **应用层** | 报文 (Message) | HTTP, HTTPS, DNS, FTP, SMTP |
| **传输层** | **传输层** | 报文段 (Segment) / 数据报 | **TCP, UDP** |
| **网络层** | **网络层 (网际层)** | IP 数据报 / 分组 (Packet) | **IP, ICMP, ARP, OSPF, BGP** |
| **数据链路层** | **网络接口层** | 帧 (Frame) | 以太网 Ethernet, PPP |
| **物理层** | **网络接口层** | 比特 (Bit) | RJ45, 光纤 |

