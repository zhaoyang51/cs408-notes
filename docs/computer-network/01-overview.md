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

### 📋 全网协议中英文全称、端口与核心命题对照表

| 体系层级 | 协议英文缩写 | 官方中文名称 | 完整英文全称 (Full English Name) | 默认端口号 / 协议字段值 | 传输可靠性 / 关键机制 | 408 核心命题要点与避坑陷阱 |
|:---|:---|:---|:---|:---|:---|:---|
| **应用层** | **DNS** | 域名系统 | Domain Name System | **端口 53** (UDP为主，区域传送用TCP) | UDP 快速查询 | 递归查询（客户端到本地域名服务器） vs 迭代查询（本地域名服务器向外）。 |
| **应用层** | **DHCP** | 动态主机配置协议 | Dynamic Host Configuration Protocol | **服务器 67 / 客户端 68** | UDP 广播 | ⚠️ **应用层协议**（常考陷阱）。4 步交互：Discover → Offer → Request → ACK。 |
| **应用层** | **RIP** | 路由信息协议 | Routing Information Protocol | **端口 520** (封装入 UDP) | UDP | 内部网关协议 IGP，距离-向量算法。最大 15 跳，16 表示不可达，存在慢收敛环路。 |
| **应用层** | **BGP** | 边界网关协议 | Border Gateway Protocol (BGP-4) | **端口 179** (封装入 TCP) | TCP 可靠连接 | 外部网关协议 EGP，路径-向量算法。基于 TCP 建立会话交换路径信息。 |
| **应用层** | **HTTP** | 超文本传输协议 | HyperText Transfer Protocol | **端口 80** (HTTPS 为 443) | TCP 可靠连接 | 无状态。HTTP/1.0 非持续连接(2RTT/对象)；HTTP/1.1 持续连接+流水线。 |
| **应用层** | **FTP** | 文件传输协议 | File Transfer Protocol | **控制 21 / 数据 20 (主动模式)** | 双 TCP 连接 | 控制连接（21）会话全程保持；数据连接（20）用于传文件，传输结束即关闭。 |
| **应用层** | **SMTP** | 简单邮件传输协议 | Simple Mail Transfer Protocol | **端口 25** | TCP “推”协议 | 发送邮件及服务器间中继。仅支持 7 位 ASCII 传输，非 ASCII 需 MIME 编码。 |
| **应用层** | **POP3** | 邮局协议第3版 | Post Office Protocol version 3 | **端口 110** | TCP “拉”协议 | 客户端拉取接收邮件，拉取后服务器通常删除（离线模式）。对等协议为 IMAP(143)。 |
| **传输层** | **UDP** | 用户数据报协议 | User Datagram Protocol | **IP 协议号 17** | 无连接 · 不可靠交付 | 面向报文（不拆分不合并），首部 8 字节。校验和计算需加 12 字节伪首部。 |
| **传输层** | **TCP** | 传输控制协议 | Transmission Control Protocol | **IP 协议号 6** | 面向连接 · 可靠交付 | 面向字节流，首部 20~60 字节。滑动窗口流量控制 + 拥塞控制 4 大算法 + 三次握手/四次挥手。 |
| **网络层** | **ICMP** | 网际控制报文协议 | Internet Control Message Protocol | **IP 协议号 1** (装入 IP 数据报) | IP 封装 | 差错报文（终点不可达、时间超过等）与询问报文（Echo 请求/回答，Ping / Traceroute 底层）。 |
| **网络层** | **OSPF** | 开放最短路径优先协议 | Open Shortest Path First | **IP 协议号 89** (直接装入 IP) | IP 封装 (协议 89) | 内部网关协议 IGP，链路状态算法 + Dijkstra 最短路径，全网洪泛广播，收敛极快。 |
| **网络层** | **IGMP** | 网际组管理协议 | Internet Group Management Protocol | **IP 协议号 2** | IP 组播 | 本地组播成员管理，配合 D 类组播地址 (224.0.0.0~239.255.255.255)。 |
| **网络层** | **IPv4** | 网际协议第4版 | Internet Protocol version 4 | 核心网络层协议 (32 bit) | 无连接不可靠数据报 | 固定首部 20 字节。首部长度单位 4B，片偏移单位 8B，TTL 防环路，CIDR 子网划分。 |
| **网络层** | **IPv6** | 网际协议第6版 | Internet Protocol version 6 | 128 bit 地址 (16 字节) | 取消路由器分片与校验和 | 固定基础首部 40 字节。过渡技术：双协议栈技术 (Dual Stack) 与 隧道技术 (Tunneling)。 |
| **网络层** | **ARP** | 地址解析协议 | Address Resolution Protocol | 以太网帧类型 `0x0806` | 广播请求 · 单播应答 | 由 IP 地址解析获取 MAC 硬件物理地址，为 IP 数据报封装成帧提供地址支撑。 |
| **数据链路层** | **PPP** | 点对点协议 | Point-to-Point Protocol | 广域网链路协议 | 面向连接不可靠 (只检错不纠错) | 同步链路用**零比特填充法** (5个1填0)；异步链路用**字节填充法** (转义 0x7D)。无确认无重传。 |
| **数据链路层** | **IEEE 802.3** | 以太网有线局域网标准 | IEEE 802.3 Ethernet Standard | MAC 帧类型 `0x0800` | 无连接不可靠 | **CSMA/CD** (载波监听多路访问/碰撞检测)，争用期 $2\tau$，最小帧长 $64\text{ B}$，二进制指数退避。 |
| **数据链路层** | **IEEE 802.11** | 无线局域网标准 (Wi-Fi) | IEEE 802.11 Wireless LAN (WLAN) | 802.11 MAC 帧 (4 地址) | 无连接可靠 (带 ACK) | **CSMA/CA** (碰撞避免)，帧间间隔 IFS + 退避计时器 + 硬件 ACK 确认 + RTS/CTS 解决隐蔽站。 |
| **物理层之下** | **传输媒体** | 物理传输介质 | Transmission Media | 双绞线/光纤/同轴/无线 | 物理信号传输 | ⚠️ **传输媒体不属于计算机网络体系结构**（在物理层下方，物理层定义接口四大特性）。 |

::: tip 💡 408 综合应用大题跨层协议关联必背口诀
- **主机开机上网全过程**：`DHCP` (获取IP与网关) $\rightarrow$ `DNS` (解析目标域名) $\rightarrow$ `ARP` (查询网关MAC) $\rightarrow$ `TCP 握手` $\rightarrow$ `HTTP 请求` $\rightarrow$ `路由器 IP 转发`。
- **协议层级归属避坑**：
  - `RIP`、`BGP`、`DHCP`、`DNS` 属于 **应用层**；
  - `OSPF`、`ICMP`、`IGMP`、`ARP`、`IP` 属于 **网络层**；
  - 路由协议中：`RIP` 走 `UDP` (520)，`BGP` 走 `TCP` (179)，`OSPF` 走 `IP` (89)。
:::

</KP>
