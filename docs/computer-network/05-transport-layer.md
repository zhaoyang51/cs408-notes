# 五、传输层

> 本章包含考点小节：3 个

---

# （一）传输层提供的服务

## 传输层提供的服务

### 1. 传输层的功能

- 提供进程之间的端到端（End-to-End）逻辑通信（网络层提供主机到主机通信）。

- 复用（不同进程的数据由同一个传输层协议封装）与分用（接收端根据端口号交付给对应进程）。

### 2. 传输层寻址与端口

- **端口号（16 位，0~65535）**：熟知端口号（0~1023：FTP 21/20, SSH 22, Telnet 23, SMTP 25, DNS 53, DHCP 67/68, HTTP 80, HTTPS 443）、登记端口号（1024~49151）、客户端临时端口号（49152~65535）。

- **套接字（Socket）**：(IP 地址 : 端口号)，唯一标识网络中主机的一个通信进程。


---

# （二）用户数据报协议（UDP）

## 用户数据报协议（UDP）

### 1. UDP 的特点

- 无连接、不可靠、面向报文（不拆分也不合并，保留应用层报文边界）、无拥塞控制、首部开销小（仅 8 字节）。

### 2. UDP 报文格式

- 源端口号（2B） + 目的端口号（2B） + UDP 长度（2B） + UDP 检验和（2B）。

- **UDP 校验和计算**：伪首部（12 字节：源 IP, 目的 IP, 0, 协议号 17, UDP 长度） + UDP 首部 + 数据部分，二进制反码求和取反。


---

# （三）传输控制协议（TCP）

## 传输控制协议（TCP）

### 1. TCP 的特点

- 面向连接、点对点单播、可靠交付、全双工通信、面向字节流。

### 2. TCP 报文段格式

- 源端口与目的端口、序号（Sequence Number, 4B）、确认号（Acknowledgment Number, 4B）、数据偏移（首部长度，单位 4B）、控制位（URG, ACK, PSH, RST, SYN, FIN）、窗口（rwnd 接收窗口, 2B）、校验和（含伪首部）、紧急指针。

### 3. TCP 连接管理

- **三次握手建立连接**：

- 1) Client -> Server: SYN=1, seq=x (SYN_SENT)

- 2) Server -> Client: SYN=1, ACK=1, seq=y, ack=x+1 (SYN_RCVD)

- 3) Client -> Server: ACK=1, seq=x+1, ack=y+1 (ESTABLISHED)

- **四次挥手释放连接**：

- 1) Client -> Server: FIN=1, seq=u (FIN_WAIT_1)

- 2) Server -> Client: ACK=1, seq=v, ack=u+1 (CLOSE_WAIT)

- 3) Server -> Client: FIN=1, ACK=1, seq=w, ack=u+1 (LAST_ACK)

- 4) Client -> Server: ACK=1, seq=u+1, ack=w+1 (TIME_WAIT 等待 2MSL 后关闭)

### 4. TCP 可靠传输机制

- 序号与确认机制（累积确认）、重传机制（自适应超时重传 RTO、快速重传 3 个冗余 ACK）。

### 5. TCP 流量控制

- 滑动窗口机制；零窗口死锁与持续计时器（Probe 探测报文）。

### 6. TCP 拥塞控制

- 发送窗口 swnd = min(rwnd, cwnd)。

- **慢开始（Slow Start）**：cwnd 从 1 开始指数增长（1, 2, 4, 8...），直到到达 ssthresh（慢开始门限）。

- **拥塞避免（Congestion Avoidance）**：到达 ssthresh 后，cwnd 线性加法增大（每轮 +1）。

- **快重传与快恢复（Fast Recovery）**：收到 3 个冗余 ACK 时，ssthresh 减半，cwnd = ssthresh，执行拥塞避免（加法增大）。超时时 ssthresh 减半，cwnd 置 1，重新慢开始。


---
