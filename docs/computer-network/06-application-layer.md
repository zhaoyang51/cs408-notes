# 第6章 应用层 (HTTP / DNS / FTP / 邮件)

<span class="badge badge-star">⭐️ 协议综合大题</span>
<span class="badge badge-freq">📊 考频 24 次（HTTP 协议 9 / DNS 解析 5 / FTP 传输 5 / 电子邮件 5）</span>

---

## 1. 域名系统 DNS（迭代查询 vs 递归查询与 2016 题 40 全景拓扑） <AuthorTag author="Zhao" />

<KP author="Zhao" title="🌐 域名系统 DNS 迭代解析与查询次数推导（2016 题 40 经典真题）" tag="⭐️ 考研必背">
<DnsQuerySimulator />
</KP>

### 1.1 DNS 查询最少与最多次数判定法则
- **最少查询次数（0 次）**：
  - 若主机自身的 DNS 高速缓存命中，或本地域名服务器自身的高速缓存命中，均**无需向外部发出任何查询**，最少为 **0 次**。
- **最多查询次数（迭代解析逐级 4 次）**：
  - 根域名服务器 $\rightarrow$ 顶级域名服务器 (`.com`) $\rightarrow$ 权限域名服务器 (`xyz.com`) $\rightarrow$ 权限域名服务器 (`abc.xyz.com`)，共需发出 **4 次** 查询。

### 1.2 递归查询 vs 迭代查询核心区别
- **递归查询 (Recursive)**：一查到底，由被查询者代劳，根服务器压力大；
- **迭代查询 (Iterative)**：分步指路，由本地域名服务器逐级请求，互联网根服务器的标准解析方式。

---

## 2. FTP 文件传输协议（双 TCP 并行连接与主动 PORT vs 被动 PASV） <AuthorTag author="Zhao" />

<KP author="Zhao" title="📂 FTP 双连接模型与主动/被动传输模式全景对比" tag="⭐️ 考研必背">
<FtpConnectionModel />
</KP>

### 2.1 控制连接 vs 数据连接核心法则
- **控制连接（TCP 21）**：整个会话期间**持续开启**，专门传输控制命令（带外传输）；
- **数据连接（TCP 20 / 临时端口）**：每次传输数据或目录列表时**动态建立，传输完毕立即关闭**。

### 2.2 主动模式 (PORT) vs 被动模式 (PASV) 辨析
- **主动模式 (PORT)**：客户端发 `PORT` 告知临时端口，**服务端用 TCP 20 主动连接客户端**（NAT/防火墙下易受阻）；
- **被动模式 (PASV)**：客户端发 `PASV`，**客户端主动连接服务端的临时端口**（天然穿透 NAT，主流标准）。

---

## 3. 电子邮件系统（SMTP vs POP3 / IMAP 与 2012 / 2013 经典真题） <AuthorTag author="Zhao" />

<KP author="Zhao" title="✉️ 电子邮件三阶段传输拓扑与协议角色精解（给服务器送信全用 SMTP，从服务器取信才用 POP3/IMAP）" tag="⭐️ 考研必背">
<EmailProtocolSimulator />
</KP>

### 3.1 408 邮件传输黄金法则
> [!TIP] ⭐️ 考研秒杀口诀
> **给服务器送信（客户端 ➔ 服务器、服务器 ➔ 服务器）全用 SMTP (Push)**；  
> **从服务器取信（服务器 ➔ 客户端）才用 POP3 或 IMAP (Pull)**。

### 3.2 邮件 3 大阶段协议与角色对应
- **阶段 ①（用户 1 ➔ 发送方邮件服务器）**：客户端推信，使用 **SMTP**（TCP 25）；
- **阶段 ②（发送方邮件服务器 ➔ 接收方邮件服务器）**：服务器间中继推信，使用 **SMTP**（TCP 25）；
- **阶段 ③（接收方邮件服务器 ➔ 用户 2）**：客户端拉信读取，使用 **POP3**（TCP 110）或 **IMAP**（TCP 143）。

---

## 4. HTTP 超文本传输协议（报文格式、Cookie 与 RTT 耗时计算） <AuthorTag author="Zhao" />

<KP author="Zhao" title="🌐 HTTP 协议全景图解与 RTT 耗时推导（2011 题 47 / 2015 题 40 经典真题）" tag="⭐️ 考研必背">
<HttpProtocolSimulator />
</KP>

### 4.1 3 种 HTTP 连接工作方式耗时公式（408 必背大题）
1. **非持续连接 (Non-persistent)**：
   $$
   \text{总时间} = 2(1 + n) \text{ RTT}
   $$
2. **持续非流水线连接 (Persistent Non-pipelined)**：
   $$
   \text{总时间} = (2 + n) \text{ RTT}
   $$
3. **持续流水线连接 (Persistent Pipelined)**：
   $$
   \text{总时间} = 3 \text{ RTT} \quad (\text{与引用对象数 } n \text{ 无关})
   $$

### 4.2 HTTP 请求报文核心字段速查
- **`Connection: Close`**：指示服务端发送完文档后释放 TCP 连接（非持续连接）；
- **`Connection: keep-alive`**：指示服务端保持 TCP 持续连接；
- **`Cookie`**：客户端将服务端先前生成的 Cookie 识别码回传，用于无状态 HTTP 协议中的用户会话跟踪。
