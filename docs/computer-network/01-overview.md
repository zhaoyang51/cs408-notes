# 第1章 计算机网络体系结构

<span class="badge badge-star">⭐️ 体系结构与性能指标全景</span>
<span class="badge badge-freq">📊 考频 18 次（体系结构 12 / 性能指标与时延 6）</span>

---

## 1. 计算机网络 8 大性能指标全景 <AuthorTag author="Zhao" />

<KP author="Zhao" title="📊 计算机网络 8 大性能指标全景图解" tag="⭐️ 考研必背">

<NetworkMetrics />

</KP>

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

</KP>
