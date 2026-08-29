<template>
  <div class="protocol-stack-card">
    <div class="stack-header">
      <div class="header-left">
        <span class="stack-badge">🌐 408 核心考点全景图</span>
        <h3 class="stack-title">TCP/IP 四层 vs 五层原理 vs OSI 七层全协议栈架构拓扑</h3>
      </div>
      <div class="header-right">
        <span class="tip-pill">💡 点击/悬停任意协议查看中英文全称与考点</span>
      </div>
    </div>

    <!-- 交互式架构图容器 -->
    <div class="stack-canvas-wrapper">
      <div class="stack-canvas">
        
        <!-- ════════ 1. 应用层 (Application Layer) ════════ -->
        <div class="layer-section layer-app">
          <div class="col-left-label tcp-layer">
            <span class="l-name">应用层</span>
            <span class="l-pdu">PDU: 报文</span>
          </div>
          
          <div class="col-main-content">
            <!-- 左右两大部分排列：左侧对应 UDP，右侧对应 TCP -->
            <div class="app-split-columns">
              
              <!-- 左半部分：UDP 承载簇 -->
              <div class="app-col-box udp-col">
                <div class="col-badge-row">
                  <span class="col-sub-badge udp-badge">UDP 承载协议簇 (无连接)</span>
                </div>
                <div class="col-proto-cards">
                  <div class="proto-box app-box udp-border" @click="selectProto('DNS')">
                    <span class="p-name">DNS</span>
                    <span class="p-port">端口 53</span>
                  </div>
                  <div class="proto-box app-box udp-border" @click="selectProto('DHCP')">
                    <span class="p-name">DHCP</span>
                    <span class="p-port">端口 67/68</span>
                  </div>
                  <div class="proto-box app-box udp-border" @click="selectProto('RIP')">
                    <span class="p-name">RIP</span>
                    <span class="p-port">端口 520</span>
                  </div>
                </div>
                <div class="col-down-arrow">
                  <span>▼ 端口 53 / 67 / 68 / 520 ➔ 封装入 UDP</span>
                </div>
              </div>

              <!-- 右半部分：TCP 承载簇 -->
              <div class="app-col-box tcp-col">
                <div class="col-badge-row">
                  <span class="col-sub-badge tcp-badge">TCP 承载协议簇 (面向连接可靠)</span>
                </div>
                <div class="col-proto-cards">
                  <div class="proto-box app-box tcp-border" @click="selectProto('BGP')">
                    <span class="p-name">BGP</span>
                    <span class="p-port">端口 179</span>
                  </div>
                  <div class="proto-box app-box tcp-border" @click="selectProto('HTTP')">
                    <span class="p-name">HTTP</span>
                    <span class="p-port">端口 80</span>
                  </div>
                  <div class="proto-box app-box tcp-border" @click="selectProto('FTP')">
                    <span class="p-name">FTP</span>
                    <span class="p-port">端口 21/20</span>
                  </div>
                  <div class="proto-box app-box tcp-border" @click="selectProto('SMTP')">
                    <span class="p-name">SMTP</span>
                    <span class="p-port">端口 25</span>
                  </div>
                  <div class="proto-box app-box tcp-border" @click="selectProto('POP3')">
                    <span class="p-name">POP3</span>
                    <span class="p-port">端口 110</span>
                  </div>
                </div>
                <div class="col-down-arrow">
                  <span>▼ 端口 179 / 80 / 21 / 20 / 25 / 110 ➔ 封装入 TCP</span>
                </div>
              </div>

            </div>
          </div>

          <div class="col-right-label osi-layer">
            <div class="right-badge-box app-osi">
              <span class="osi-title">应用层 (五层体系)</span>
              <span class="osi-pdu-pill">PDU: 报文 (Message)</span>
              <span class="osi-note">OSI 还包含表示层与会话层</span>
            </div>
          </div>
        </div>

        <!-- ════════ 2. 传输层 (Transport Layer) ════════ -->
        <div class="layer-section layer-trans">
          <div class="col-left-label tcp-layer">
            <span class="l-name">传输层</span>
            <span class="l-pdu">PDU: 报文段/数据报</span>
          </div>

          <div class="col-main-content">
            <div class="trans-split-grid">
              <!-- 左侧对齐 UDP -->
              <div class="proto-box trans-box udp-box" @click="selectProto('UDP')">
                <div class="t-top">
                  <span class="p-name">UDP (用户数据报协议)</span>
                  <span class="proto-id-pill">IP协议号 17</span>
                </div>
                <span class="p-desc">无连接 · 不可靠交付 · 面向报文 · 首部 8B</span>
              </div>

              <!-- 右侧对齐 TCP -->
              <div class="proto-box trans-box tcp-box" @click="selectProto('TCP')">
                <div class="t-top">
                  <span class="p-name">TCP (传输控制协议)</span>
                  <span class="proto-id-pill">IP协议号 6</span>
                </div>
                <span class="p-desc">面向连接 · 可靠交付 · 面向字节流 · 全双工</span>
              </div>
            </div>
          </div>

          <div class="col-right-label osi-layer">
            <div class="right-badge-box">
              <span class="osi-title">传输层</span>
              <span class="osi-pdu-pill">PDU: 报文段 (Segment)</span>
            </div>
          </div>
        </div>

        <!-- ════════ 3. 网络层 / 网际层 (Network Layer) ════════ -->
        <div class="layer-section layer-net">
          <div class="col-left-label tcp-layer">
            <span class="l-name">网络层</span>
            <span class="sub-txt">(网际层)</span>
            <span class="l-pdu">PDU: IP 数据报</span>
          </div>

          <div class="col-main-content">
            <!-- 封装在 IP 中的控制/路由协议 -->
            <div class="net-upper-row">
              <div class="proto-box net-sub-box" @click="selectProto('ICMP')">
                <span class="p-name">ICMP</span>
                <span class="p-sub">协议号 1</span>
              </div>
              <div class="proto-box net-sub-box" @click="selectProto('OSPF')">
                <span class="p-name">OSPF</span>
                <span class="p-sub">协议号 89</span>
              </div>
              <div class="proto-box net-sub-box" @click="selectProto('IGMP')">
                <span class="p-name">IGMP</span>
                <span class="p-sub">协议号 2</span>
              </div>
            </div>

            <!-- 核心网际层协议 IP + ARP -->
            <div class="net-core-row">
              <div class="proto-box arp-box" @click="selectProto('ARP')">
                <span class="p-name">ARP</span>
                <span class="p-sub">地址解析 (IP→MAC)</span>
              </div>
              <div class="proto-box ip-box" @click="selectProto('IPv4')">
                <span class="p-name">IPv4 (网际协议核心)</span>
                <span class="p-desc">无连接不可靠的数据报服务</span>
              </div>
              <div class="proto-box ipv6-box" @click="selectProto('IPv6')">
                <span class="p-name">IPv6</span>
                <span class="p-sub">双协议栈 / 隧道技术</span>
              </div>
            </div>
          </div>

          <div class="col-right-label osi-layer">
            <div class="right-badge-box net-device">
              <span class="osi-title">网络层</span>
              <span class="osi-pdu-pill">PDU: 分组 / IP数据报</span>
              <span class="device-tag">🖧 核心设备: 路由器</span>
            </div>
          </div>
        </div>

        <!-- ════════ 4. 网络接口层 / 数据链路层 + 物理层 ════════ -->
        <div class="layer-section layer-link">
          <div class="col-left-label tcp-layer link-layer-label">
            <span class="l-name">网络接口层</span>
            <span class="sub-txt">(TCP/IP 4层合并)</span>
            <span class="l-pdu">PDU: 帧 / 比特</span>
          </div>

          <div class="col-main-content link-main">
            <div class="link-sub-section">
              <div class="link-protocols-grid">
                <div class="proto-box link-box ppp-box" @click="selectProto('PPP')">
                  <span class="p-name">PPP 协议</span>
                  <span class="p-sub">点对点链路 (面向连接不可靠)</span>
                  <span class="p-detail">零比特填充 (同步) / 字节填充 (异步)</span>
                </div>
                <div class="proto-box link-box eth-box" @click="selectProto('802.3')">
                  <span class="p-name">IEEE 802.3 (以太网)</span>
                  <span class="p-sub">有线局域网 · CSMA/CD</span>
                  <span class="p-detail">无连接不可靠 · 最小帧长 64B</span>
                </div>
                <div class="proto-box link-box wifi-box" @click="selectProto('802.11')">
                  <span class="p-name">IEEE 802.11 (Wi-Fi)</span>
                  <span class="p-sub">无线局域网 · CSMA/CA</span>
                  <span class="p-detail">无连接可靠 (带ACK确认)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-right-label osi-layer dual-right">
            <div class="right-badge-box link-device">
              <span class="osi-title">数据链路层</span>
              <span class="osi-pdu-pill">PDU: 帧 (Frame)</span>
              <span class="device-tag">🔄 二层交换机 / 网桥</span>
            </div>
            <div class="right-badge-box phy-device">
              <span class="osi-title">物理层</span>
              <span class="osi-pdu-pill">PDU: 比特 (Bit)</span>
              <span class="device-tag">🔌 集线器 / 中继器</span>
            </div>
          </div>
        </div>

        <!-- ════════ 5. 传输媒体 (物理层之下) ════════ -->
        <div class="layer-section layer-media">
          <div class="col-left-label media-label">
            <span class="l-name">传输媒体</span>
            <span class="l-pdu">物理介质</span>
          </div>

          <div class="col-main-content">
            <div class="media-grid">
              <div class="media-item"><span>📻 同轴电缆</span></div>
              <div class="media-item"><span>➿ 双绞线 (网线)</span></div>
              <div class="media-item"><span>💡 光纤 (单模/多模)</span></div>
              <div class="media-item"><span>📡 无线电波 / 微波</span></div>
            </div>
          </div>

          <div class="col-right-label media-note-label">
            <span class="media-warning">⚠️ 传输媒体不属于网络体系结构（在物理层下方）</span>
          </div>
        </div>

      </div>
    </div>

    <!-- 协议详情弹窗/卡片 -->
    <transition name="modal-fade">
      <div class="proto-detail-drawer" v-if="selected">
        <div class="drawer-header">
          <div class="drawer-title-row">
            <span class="drawer-badge">{{ selected.layer }}</span>
            <span class="drawer-acronym">{{ selected.acronym }}</span>
            <span class="drawer-cname">{{ selected.chineseName }}</span>
          </div>
          <button class="drawer-close-btn" @click="selected = null">✕ 关闭</button>
        </div>
        
        <div class="drawer-body">
          <div class="drawer-meta-grid">
            <div class="meta-item">
              <span class="m-label">英文全称</span>
              <span class="m-val en-val">{{ selected.englishFullName }}</span>
            </div>
            <div class="meta-item" v-if="selected.port">
              <span class="m-label">默认端口号</span>
              <span class="m-val port-val">{{ selected.port }}</span>
            </div>
            <div class="meta-item" v-if="selected.protocolId">
              <span class="m-label">IP 协议字段值</span>
              <span class="m-val proto-val">{{ selected.protocolId }}</span>
            </div>
            <div class="meta-item">
              <span class="m-label">传输可靠性</span>
              <span class="m-val">{{ selected.reliability }}</span>
            </div>
          </div>

          <div class="drawer-exam-point">
            <span class="exam-icon">🎯 408 核心命题要点：</span>
            <p class="exam-text">{{ selected.examPoint }}</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selected = ref(null)

const PROTOCOL_DATA = {
  'DNS': {
    acronym: 'DNS',
    chineseName: '域名系统',
    englishFullName: 'Domain Name System',
    layer: '应用层 (Application Layer)',
    port: '53 (主用 UDP，主从同步/区域传送用 TCP)',
    protocolId: '17 (UDP)',
    reliability: 'UDP 快速解析',
    examPoint: '将主机域名映射为 IP 地址。分为根域名服务器、顶级域名服务器、权限域名服务器和本地域名服务器。客户端与本地域名服务器多为递归查询，本地域名服务器向外多为迭代查询。'
  },
  'DHCP': {
    acronym: 'DHCP',
    chineseName: '动态主机配置协议',
    englishFullName: 'Dynamic Host Configuration Protocol',
    layer: '应用层 (Application Layer)',
    port: '服务器 67，客户端 68',
    protocolId: '17 (UDP)',
    reliability: '基于 UDP 广播',
    examPoint: '应用层协议（常考选择题陷阱）。客户端即插即用自动获取 IP、子网掩码、默认网关与 DNS 服务器 IP。交互 4 步：DHCP Discover (广播) → DHCP Offer (广播) → DHCP Request (广播) → DHCP ACK (广播)。'
  },
  'RIP': {
    acronym: 'RIP',
    chineseName: '路由信息协议',
    englishFullName: 'Routing Information Protocol',
    layer: '应用层 (Application Layer)',
    port: '520 (封装在 UDP 中)',
    protocolId: '17 (UDP)',
    reliability: 'UDP 广播/组播',
    examPoint: '内部网关协议 (IGP)，基于距离-向量算法。以“跳数 (Hop Count)”为唯一度量，最大有效跳数为 15，16 表示不可达（仅适合小型网络）。缺点：“好消息传得快，坏消息传得慢”（慢收敛导致路由环路）。'
  },
  'BGP': {
    acronym: 'BGP',
    chineseName: '边界网关协议',
    englishFullName: 'Border Gateway Protocol (BGP-4)',
    layer: '应用层 (Application Layer)',
    port: '179 (封装在 TCP 报文中)',
    protocolId: '6 (TCP)',
    reliability: 'TCP 可靠连接',
    examPoint: '外部网关协议 (EGP)，基于路径-向量算法。BGP 路由器之间首先建立 TCP 连接（端口 179），然后交换 BGP 报文以寻找到达各 AS 的较好（而非最优）路径。'
  },
  'HTTP': {
    acronym: 'HTTP',
    chineseName: '超文本传输协议',
    englishFullName: 'HyperText Transfer Protocol',
    layer: '应用层 (Application Layer)',
    port: '80 (HTTPS 为 443)',
    protocolId: '6 (TCP)',
    reliability: 'TCP 可靠连接',
    examPoint: '无状态、面向事务。HTTP/1.0 默认非持续连接（每个对象耗费 2RTT）；HTTP/1.1 默认持续连接并支持流水线方式。常见状态码：200(成功)、301/302(重定向)、400(请求语法错误)、403(禁止访问)、404(未找到)、500(服务器内部错误)。'
  },
  'FTP': {
    acronym: 'FTP',
    chineseName: '文件传输协议',
    englishFullName: 'File Transfer Protocol',
    layer: '应用层 (Application Layer)',
    port: '控制连接 21，数据连接 20 (主动模式 PORT)',
    protocolId: '6 (TCP)',
    reliability: '双 TCP 连接',
    examPoint: '控制连接（端口 21）用于传送命令，在整个会话期间一直保持打开；数据连接（主动模式服务器用 20 端口主动连接客户端）用于传输文件数据，用完即关闭。'
  },
  'SMTP': {
    acronym: 'SMTP',
    chineseName: '简单邮件传输协议',
    englishFullName: 'Simple Mail Transfer Protocol',
    layer: '应用层 (Application Layer)',
    port: '25',
    protocolId: '6 (TCP)',
    reliability: 'TCP “推 (Push)” 协议',
    examPoint: '用于发件人客户端向邮件服务器发送邮件，或在两个邮件服务器之间转发邮件（采用“推”模式）。仅支持 7 位 ASCII 码传输，非 ASCII 内容需经 MIME 编码转换。'
  },
  'POP3': {
    acronym: 'POP3',
    chineseName: '邮局协议第3版',
    englishFullName: 'Post Office Protocol version 3',
    layer: '应用层 (Application Layer)',
    port: '110',
    protocolId: '6 (TCP)',
    reliability: 'TCP “拉 (Pull)” 协议',
    examPoint: '用于收件人客户端从邮件服务器读取拉取邮件。用户拉取后服务器通常删除邮件（离线工作模式）。更强大的对等协议为 IMAP（端口 143，支持服务端状态同步与多端同步）。'
  },
  'UDP': {
    acronym: 'UDP',
    chineseName: '用户数据报协议',
    englishFullName: 'User Datagram Protocol',
    layer: '传输层 (Transport Layer)',
    port: '源端口 (2B) + 目的端口 (2B)',
    protocolId: '17',
    reliability: '无连接 · 不可靠交付',
    examPoint: '面向报文（不拆分不合并，保留应用层报文边界）。无拥塞控制、首部开销仅 8 字节（源端口、目的端口、长度、校验和）。UDP 校验和计算时必须添加 12 字节伪首部（含 IP 地址与协议号 17）。'
  },
  'TCP': {
    acronym: 'TCP',
    chineseName: '传输控制协议',
    englishFullName: 'Transmission Control Protocol',
    layer: '传输层 (Transport Layer)',
    port: '源端口 (2B) + 目的端口 (2B)',
    protocolId: '6',
    reliability: '面向连接 · 可靠交付',
    examPoint: '全双工面向字节流通信。首部 20~60 字节。可靠保障核心机制：序号确认与重传（累积确认 ACK）、滑动窗口流量控制（根据接收端 rwnd 控制发送窗口）、拥塞控制 4 大算法（慢开始、拥塞避免、快重传、快恢复）。三次握手与四次挥手。'
  },
  'ICMP': {
    acronym: 'ICMP',
    chineseName: '网际控制报文协议',
    englishFullName: 'Internet Control Message Protocol',
    layer: '网络层 (Network Layer)',
    port: '无端口 (装入 IP 数据报数据部分)',
    protocolId: '1',
    reliability: 'IP 数据报封装',
    examPoint: '网络层协议（不是高层协议）。分为差错报告报文（终点不可达、源点抑制、时间超过、参数问题、改变路由重定向）和询问报文（回送请求/回答）。Ping 程序使用 ICMP 回送报文（无传输层）；Traceroute/Tracert 利用 TTL 递增和 ICMP 时间超过报文。'
  },
  'OSPF': {
    acronym: 'OSPF',
    chineseName: '开放最短路径优先协议',
    englishFullName: 'Open Shortest Path First',
    layer: '网络层 (Network Layer)',
    port: '无端口 (直接封装在 IP 数据报中)',
    protocolId: '89',
    reliability: 'IP 数据报封装 (协议号 89)',
    examPoint: '内部网关协议 (IGP)，基于链路状态算法 (Link-State) 与 Dijkstra 最短路径算法。使用洪泛法向全网所有路由器发送与本路由器相邻的所有链路状态。直接使用 IP 数据报发送（协议字段值为 89），收敛速度极快。'
  },
  'IGMP': {
    acronym: 'IGMP',
    chineseName: '网际组管理协议',
    englishFullName: 'Internet Group Management Protocol',
    layer: '网络层 (Network Layer)',
    port: '无端口 (封装在 IP 中)',
    protocolId: '2',
    reliability: 'IP 组播传输',
    examPoint: '用于让连接在本地局域网上的组播路由器知道本局域网上是否有主机（进程）参加或退出了某个组播组。与 IP 组播地址（D 类地址 224.0.0.0~239.255.255.255）紧密配合。'
  },
  'IPv4': {
    acronym: 'IPv4',
    chineseName: '网际协议第4版',
    englishFullName: 'Internet Protocol version 4',
    layer: '网络层 (Network Layer)',
    port: '网际层核心 (32 bit 地址)',
    protocolId: '核心网络协议',
    reliability: '无连接不可靠 · 尽最大努力交付',
    examPoint: '408 全科大题第一核心。首部固定 20 字节（总长 20~60B）。核心字段：首部长度 (单位 4B)、总长度 (单位 1B)、标识、标志 (DF/MF)、片偏移 (单位 8B)、TTL (防路由环路)、协议号 (1-ICMP, 6-TCP, 17-UDP, 89-OSPF)、首部校验和 (仅检验首部)。CIDR 无分类编址与子网划分。'
  },
  'IPv6': {
    acronym: 'IPv6',
    chineseName: '网际协议第6版',
    englishFullName: 'Internet Protocol version 6',
    layer: '网络层 (Network Layer)',
    port: '128 bit 地址 (16 字节)',
    protocolId: '41 (IPv6 in IPv4 隧道)',
    reliability: '取消路由器分片 · 移除首部校验和',
    examPoint: '地址长度 128 位（16 字节）。固定基础首部 40 字节。取消了首部校验和以加速路由器处理；取消了中间路由器分片（必须由源主机分片）。过渡技术：双协议栈技术 (同时运行 IPv4 和 IPv6) 与 隧道技术 (将 IPv6 数据报封装入 IPv4 数据报作为载荷)。'
  },
  'ARP': {
    acronym: 'ARP',
    chineseName: '地址解析协议',
    englishFullName: 'Address Resolution Protocol',
    layer: '网络层 (为 IP 提供解析服务)',
    port: '直接封装在以太网帧中 (类型 0x0806)',
    protocolId: '以太网帧类型 0x0806',
    reliability: '广播请求 · 单播应答',
    examPoint: '根据目标 IP 地址解析获取其对应的 MAC 物理硬件地址。工作过程：主机查询本地 ARP 高速缓存；若无则发送广播 ARP 请求帧；目标主机收到后发送单播 ARP 响应帧；源主机将映射存入 ARP 表（动态映射有老化生存时间）。'
  },
  'PPP': {
    acronym: 'PPP',
    chineseName: '点对点协议',
    englishFullName: 'Point-to-Point Protocol',
    layer: '数据链路层 (Data Link Layer)',
    port: '广域网点对点链路',
    protocolId: '广域网数据链路层协议',
    reliability: '面向连接 · 不可靠交付 (只检错不纠错)',
    examPoint: '点对点链路标准协议。由 3 部分组成：成帧方法、链路控制协议 LCP、网络控制协议 NCP。透明传输实现：同步光纤传输用零比特填充法（5个连续1填0）；异步传输用字节/字符填充法（转义字节 0x7D）。PPP 仅保证无差错接收（CRC 校验不合格直接丢弃），无确认无重传。'
  },
  '802.3': {
    acronym: 'IEEE 802.3',
    chineseName: '以太网有线局域网标准',
    englishFullName: 'IEEE 802.3 Ethernet Standard',
    layer: '数据链路层 + 物理层',
    port: 'MAC 帧格式 (以太网 V2)',
    protocolId: 'Type 字段 (0x0800-IP, 0x0806-ARP)',
    reliability: '无连接 · 不可靠交付',
    examPoint: '介质访问控制：CSMA/CD (先听后发、边听边发、冲突停发、随机重发)。争用期 2τ 与最小帧长公式：最小帧长 = 2τ × 数据传输速率 (以太网标准最小帧长为 64 字节)。二进制指数退避算法确定重传时间。'
  },
  '802.11': {
    acronym: 'IEEE 802.11',
    chineseName: '无线局域网标准 (Wi-Fi)',
    englishFullName: 'IEEE 802.11 Wireless LAN (WLAN)',
    layer: '数据链路层 + 物理层',
    port: '802.11 MAC 帧 (4 个地址字段)',
    protocolId: '无线电波传输',
    reliability: '无连接 · 可靠交付 (带硬件 ACK 确认)',
    examPoint: '介质访问控制：CSMA/CA (碰撞避免，采用帧间间隔 IFS、退避计时器与 ACK 确认机制)。解决无线信道“隐蔽站”问题：使用 RTS/CTS 请求发送/清除发送握手预留信道。802.11 帧中 4 个地址字段的判断（去往 AP、来自 AP）。'
  }
}

function selectProto(name) {
  if (PROTOCOL_DATA[name]) {
    selected.value = PROTOCOL_DATA[name]
  }
}
</script>

<style scoped>
.protocol-stack-card {
  margin: 28px 0;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: all 0.25s ease;
}

.stack-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--vp-c-bg-soft);
  border-bottom: 2px solid var(--vp-c-divider);
  flex-wrap: wrap;
  gap: 10px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stack-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  width: fit-content;
}

.dark .stack-badge {
  color: #fbbf24;
}

.stack-title {
  font-size: 16.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0;
}

.tip-pill {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-alt);
  padding: 3px 10px;
  border-radius: 9999px;
  border: 1px solid var(--vp-c-divider);
}

/* 画布主结构 */
.stack-canvas-wrapper {
  overflow-x: auto;
  padding: 18px 20px;
  -webkit-overflow-scrolling: touch;
}

.stack-canvas {
  min-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 分层通栏行 */
.layer-section {
  display: grid;
  grid-template-columns: 120px 1fr 200px;
  gap: 14px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  transition: all 0.2s ease;
}

.layer-section:hover {
  box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.06);
  border-color: var(--vp-c-brand-1);
}

.layer-app {
  border-left: 4px solid #ef4444;
  background: rgba(239, 68, 68, 0.02);
}

.layer-trans {
  border-left: 4px solid #3b82f6;
  background: rgba(59, 130, 246, 0.02);
}

.layer-net {
  border-left: 4px solid #f59e0b;
  background: rgba(245, 158, 11, 0.02);
}

.layer-link {
  border-left: 4px solid #10b981;
  background: rgba(16, 185, 129, 0.02);
}

.layer-media {
  border-left: 4px solid #8b5cf6;
  background: rgba(139, 92, 246, 0.02);
  grid-template-columns: 120px 1fr 200px;
}

/* 左侧层级标题 (含名称 + PDU) */
.col-left-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-right: 1px solid var(--vp-c-divider);
  padding-right: 10px;
  height: 100%;
  gap: 2px;
}

.l-name {
  font-size: 14px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.l-pdu {
  font-size: 10px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  padding: 1px 5px;
  background: var(--vp-c-brand-soft);
  border-radius: 4px;
}

.sub-txt {
  font-size: 10.5px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

/* 右侧 OSI / 五层 与 网络设备标签 (含 PDU) */
.col-right-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 10px;
  height: 100%;
  gap: 6px;
}

.right-badge-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  width: 100%;
}

.osi-title {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.osi-pdu-pill {
  font-size: 10px;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 1px 6px;
  border-radius: 4px;
}

.osi-note {
  font-size: 10px;
  color: #ef4444;
  font-weight: 600;
  text-align: right;
}

.device-tag {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-divider);
  margin-top: 2px;
}

/* ════════ 应用层中间二分列布局 (左 UDP 簇 vs 右 TCP 簇) ════════ */
.app-split-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.app-col-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.udp-col {
  border-top: 2px solid #0284c7;
}

.tcp-col {
  border-top: 2px solid #3b82f6;
}

.col-badge-row {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.col-sub-badge {
  font-size: 10.5px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
}

.udp-badge {
  color: #0284c7;
  background: rgba(2, 132, 199, 0.1);
}

.tcp-badge {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.col-proto-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.col-down-arrow {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--vp-c-text-3);
  margin-top: 2px;
}

.udp-col .col-down-arrow {
  color: #0284c7;
}

.tcp-col .col-down-arrow {
  color: #3b82f6;
}

/* 单个协议卡片微按钮 */
.proto-box {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 9px;
  border-radius: 8px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.proto-box:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.proto-box .p-name {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.proto-box .p-port,
.proto-box .p-sub {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.app-box {
  flex: 1;
  min-width: 48px;
}

.udp-border { border-left: 2px solid #0284c7; }
.tcp-border { border-left: 2px solid #3b82f6; }

/* 传输层二分列 */
.trans-split-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.trans-box {
  padding: 8px 12px;
  align-items: flex-start;
}

.udp-box {
  border-left: 3px solid #0284c7;
  border-top: 2px solid #0284c7;
}

.tcp-box {
  border-left: 3px solid #3b82f6;
  border-top: 2px solid #3b82f6;
}

.t-top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: 2px;
}

.proto-id-pill {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 9999px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-brand-1);
}

.p-desc {
  font-size: 10.5px;
  color: var(--vp-c-text-2);
}

/* 网络层 */
.net-upper-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 6px;
}

.net-sub-box {
  min-width: 70px;
  border-top: 2px solid #f59e0b;
}

.net-core-row {
  display: grid;
  grid-template-columns: 120px 1fr 130px;
  gap: 8px;
}

.ip-box {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.4);
}

.arp-box {
  border-top: 2px solid #10b981;
}

/* 数据链路层 */
.link-protocols-grid {
  display: grid;
  grid-template-columns: 1.1fr 1.2fr 1.2fr;
  gap: 8px;
}

.link-box {
  align-items: flex-start;
  padding: 8px 10px;
}

.p-detail {
  font-size: 9.5px;
  color: var(--vp-c-text-3);
  margin-top: 2px;
}

.ppp-box { border-top: 2px solid #06b6d4; }
.eth-box { border-top: 2px solid #10b981; }
.wifi-box { border-top: 2px solid #8b5cf6; }

/* 传输媒体 */
.media-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.media-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-border);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.media-warning {
  font-size: 10.5px;
  color: #f59e0b;
  font-weight: 700;
  line-height: 1.3;
  text-align: right;
}

/* ════════ 协议详情弹出卡片 (Drawer/Modal) ════════ */
.proto-detail-drawer {
  background: var(--vp-c-bg-soft);
  border-top: 2px solid var(--vp-c-brand-1);
  padding: 16px 20px;
  animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.drawer-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.drawer-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.drawer-acronym {
  font-size: 17px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.drawer-cname {
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-2);
}

.drawer-close-btn {
  border: none;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.drawer-close-btn:hover {
  background: var(--vp-c-brand-1);
  color: #ffffff;
}

.drawer-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  padding: 6px 10px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}

.m-label {
  font-size: 10.5px;
  color: var(--vp-c-text-3);
  font-weight: 600;
}

.m-val {
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-top: 2px;
}

.en-val {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
}

.port-val {
  color: #10b981;
}

.proto-val {
  color: #f59e0b;
}

.drawer-exam-point {
  padding: 10px 14px;
  background: var(--vp-c-bg-elv);
  border-left: 3px solid #f59e0b;
  border-radius: 0 8px 8px 0;
  border-top: 1px solid var(--vp-c-divider);
  border-right: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.exam-icon {
  font-size: 12px;
  font-weight: 800;
  color: #d97706;
  margin-bottom: 4px;
  display: block;
}

.exam-text {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
