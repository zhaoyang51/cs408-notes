# 第1章 计算机网络体系结构

<span class="badge badge-star">⭐️ 体系结构与协议栈全景</span>
<span class="badge badge-freq">📊 考频 18 次（体系结构 12 / 时延计算 6）</span>
<span class="badge badge-formula">💡 4 大时延计算公式</span>

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
| **应用层 / 表示层 / 会话层** | **应用层** | 报文 (Message) | HTTP, HTTPS, DNS, FTP, SMTP, POP3, DHCP, RIP, BGP |
| **传输层** | **传输层** | 报文段 (Segment) / 数据报 | **TCP, UDP** |
| **网络层** | **网络层 (网际层)** | IP 数据报 / 分组 (Packet) | **IPv4, IPv6, ICMP, IGMP, ARP, OSPF** |
| **数据链路层** | **网络接口层** | 帧 (Frame) | 以太网 (IEEE 802.3), Wi-Fi (IEEE 802.11), PPP |
| **物理层** | **网络接口层** | 比特 (Bit) | RJ45 双绞线, 光纤, 同轴电缆 |

---

## 3. TCP/IP 四层 vs 五层原理体系全协议栈全景拓扑图 <AuthorTag author="Zhao" />

<KP author="Zhao" title="🌐 全协议栈体系拓扑与中英文协议全景对照（408 核心考点）" tag="⭐️ 全科大贯通">

<ProtocolStackMap />

::: tip 💡 408 综合应用大题跨层协议关联必背口诀
- **主机开机上网全过程**：`DHCP` (获取IP与网关) $\rightarrow$ `DNS` (解析目标域名) $\rightarrow$ `ARP` (查询网关MAC) $\rightarrow$ `TCP 握手` $\rightarrow$ `HTTP 请求` $\rightarrow$ `路由器 IP 转发`。
- **协议层级归属避坑**：
  - `RIP`、`BGP`、`DHCP`、`DNS` 属于 **应用层**；
  - `OSPF`、`ICMP`、`IGMP`、`ARP`、`IP` 属于 **网络层**；
  - 路由协议中：`RIP` 走 `UDP` (520)，`BGP` 走 `TCP` (179)，`OSPF` 走 `IP` (89)。
:::

</KP>
