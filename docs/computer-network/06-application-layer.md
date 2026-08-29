# 第6章 应用层 (HTTP / DNS / 邮件)

<span class="badge badge-freq">📊 考频 19 次（HTTP 协议 9 / DNS 解析 5 / 电子邮件 5）</span>

---

<MindMapCard 
  title="第6章 应用层 (HTTP / DNS / 邮件) 思维导图" 
  imgSrc="/cs408-notes/mindmaps/network-ch6-application.png" 
  downloadSrc="/cs408-notes/mindmaps/files/network-ch6-application.xmind" 
  tag="🧠 章节思维导图" 
  caption="系统梳理 DNS 递归/迭代解析流程、HTTP 请求/响应报文与状态码、FTP 控制与数据双连接、电子邮件 (SMTP/POP3/IMAP) 协议" 
  fileName="第6章 应用层.xmind" 
  fileSize="16.9 MB" 
/>

## 1. 域名系统 (DNS) 查询方式

- **递归查询**：本地域名服务器代为向根、顶级、权限域名服务器递归请求（一查到底）。
- **迭代查询**：根域名服务器向本地域名服务器返回下一级服务器 IP，由本地域名服务器依次发出后续请求。

---

## 2. HTTP 常见状态码速查

| 状态码 | 类别 | 含义 |
|:---|:---|:---|
| `200 OK` | 成功 | 请求成功，正常返回资源 |
| `301 Moved Permanently` | 重定向 | 资源已永久移动到新 URL |
| `302 Found` | 重定向 | 临时重定向 |
| `400 Bad Request` | 客户端错误 | 客户端请求语法错误 |
| `403 Forbidden` | 客户端错误 | 服务器拒绝服务 |
| `404 Not Found` | 客户端错误 | 请求的资源不存在 |
| `500 Internal Server Error` | 服务器错误 | 服务器内部故障 |
