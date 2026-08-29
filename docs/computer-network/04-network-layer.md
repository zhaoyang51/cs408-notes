# 第4章 网络层与 IP 协议

<span class="badge badge-star">⭐️ 计网第一大题考点 (10~15分)</span>
<span class="badge badge-freq">📊 考频 55 次（CIDR 子网 20 / 路由转发 12 / IPv4 NAT 10 / ARP DHCP 10 / 路由协议 9）</span>

---

<MindMapCard 
  title="第4章 网络层与 IP 协议思维导图" 
  imgSrc="/cs408-notes/mindmaps/network-ch4-network.png" 
  downloadSrc="/cs408-notes/mindmaps/files/network-ch4-network.xmind" 
  tag="🧠 章节思维导图" 
  caption="系统梳理 IPv4/IPv6 首部结构、CIDR 变长子网划分、路由表最长前缀匹配转发、NAT/DHCP/ARP/ICMP 与 RIP/OSPF/BGP 路由算法" 
  fileName="第4章 网络层.xmind" 
  fileSize="38.9 MB" 
/>

## 1. IPv4 首部 3 大长度字段单位辨析

| 字段名称 | 占用位数 | 计算单位 (乘数) | 极值与说明 |
|:---|:---:|:---:|:---|
| **首部长度** | 4 位 | **4 字节** | 最小 20 字节（值为 5），最大 60 字节（值为 15） |
| **总长度** | 16 位 | **1 字节** | 最大长度 65535 字节 |
| **片偏移** | 13 位 | **8 字节** | 每个分片数据载荷必须是 8 字节的整数倍（除最后一个分片外） |

---

## 2. 常见路由协议对比全景表

| 路由协议 | 类型 | 核心算法 | 路由开销度量 | 传输层封装 |
|:---|:---|:---|:---|:---:|
| **RIP** | 内部网关 (IGP) | 距离向量 (Bellman-Ford) | 跳数 (Hop $\le 15$) | **UDP** (端口 520) |
| **OSPF** | 内部网关 (IGP) | 链路状态 (Dijkstra) | 链路费用 (Cost) | **IP** (协议号 89) |
| **BGP-4** | 外部网关 (EGP) | 路径向量 | 自治系统 AS 路径 | **TCP** (端口 179) |
