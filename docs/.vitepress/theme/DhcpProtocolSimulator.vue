<template>
  <div class="dhcp-sim-container">
    <!-- 顶部标题横幅 -->
    <div class="dhcp-header">
      <div class="header-left">
        <span class="badge-blue">📡 DHCP 动态主机配置协议</span>
        <h4 class="header-title">DHCP 交互时序全景 · 两次 ARP 探活 · 租期续约生命周期</h4>
      </div>
      <div class="rule-tag">
        💡 核心口诀：OFFER前服务器ARP探活，ACK后客户机免费ARP测冲突；0.5倍单播续约，0.875倍广播求援
      </div>
    </div>

    <!-- 1. 板书原版全景图 (默认展开，支持矢量重绘 vs 原画截图切换) -->
    <!-- 1. 板书 1:1 矢量精绘全景时序图 (纯矢量高保真) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('topo')">
        <div class="header-title-box">
          <span class="card-icon">🗺️</span>
          <strong>一、DHCP 交互时序全景时序图（4步广播握手 · 两次ARP探活 · 续约生命周期）</strong>
          <span class="badge-blue">矢量重绘</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.topo ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.topo" class="card-body">
        
        <!-- 1:1 矢量精绘版 -->
        <div class="svg-board-wrapper">
          <svg viewBox="0 0 1080 620" class="board-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- 箭头标头 -->
              <marker id="arrow-black" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#111827" />
              </marker>
              <marker id="dim-arrow-up" viewBox="0 0 10 10" refX="5" refY="2" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M 1 8 L 5 2 L 9 8 z" fill="#b91c1c" />
              </marker>
              <marker id="dim-arrow-down" viewBox="0 0 10 10" refX="5" refY="8" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M 1 2 L 5 8 L 9 2 z" fill="#b91c1c" />
              </marker>
            </defs>

            <!-- 顶部背景板 -->
            <rect x="0" y="0" width="1080" height="620" fill="var(--vp-c-bg)" rx="8" />

            <!-- ═════════════════════════════════════════════════ -->
            <!-- 1. 顶部三大实体设备图标与标注 -->
            <!-- ═════════════════════════════════════════════════ -->

            <!-- 实体 1：DHCP 服务器 1 (左: x=160) -->
            <g transform="translate(160, 45)">
              <!-- 服务器主机图标 -->
              <rect x="-24" y="0" width="48" height="52" rx="4" fill="#334155" stroke="#1e293b" stroke-width="1.5" />
              <line x1="-16" y1="12" x2="16" y2="12" stroke="#64748b" stroke-width="2" />
              <line x1="-16" y1="24" x2="16" y2="24" stroke="#64748b" stroke-width="2" />
              <line x1="-16" y1="36" x2="16" y2="36" stroke="#64748b" stroke-width="2" />
              <circle cx="14" cy="44" r="2.5" fill="#22c55e" />
              <!-- 文字 -->
              <text x="0" y="72" font-size="14" font-weight="900" text-anchor="middle" fill="var(--vp-c-text-1)">DHCP服务器1</text>
              <text x="0" y="90" font-size="13" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">(UDP 67)</text>
            </g>

            <!-- 实体 2：DHCP 客户 (中: x=570) -->
            <g transform="translate(570, 45)">
              <!-- 笔记本电脑图标 -->
              <polygon points="-24,30 24,30 18,10 -18,10" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" />
              <rect x="-14" y="14" width="28" height="13" rx="1" fill="#93c5fd" />
              <polygon points="-30,42 30,42 24,30 -24,30" fill="#64748b" stroke="#334155" stroke-width="1.2" />
              <!-- 文字 -->
              <text x="0" y="72" font-size="14" font-weight="900" text-anchor="middle" fill="var(--vp-c-text-1)">DHCP客户</text>
              <text x="0" y="90" font-size="13" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">(UDP 68)</text>
            </g>

            <!-- 实体 3：DHCP 服务器 2 (右: x=980) -->
            <g transform="translate(980, 45)">
              <!-- 服务器主机图标 -->
              <rect x="-24" y="0" width="48" height="52" rx="4" fill="#334155" stroke="#1e293b" stroke-width="1.5" />
              <line x1="-16" y1="12" x2="16" y2="12" stroke="#64748b" stroke-width="2" />
              <line x1="-16" y1="24" x2="16" y2="24" stroke="#64748b" stroke-width="2" />
              <line x1="-16" y1="36" x2="16" y2="36" stroke="#64748b" stroke-width="2" />
              <circle cx="14" cy="44" r="2.5" fill="#22c55e" />
              <!-- 文字 -->
              <text x="0" y="72" font-size="14" font-weight="900" text-anchor="middle" fill="var(--vp-c-text-1)">DHCP服务器2</text>
              <text x="0" y="90" font-size="13" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">(UDP 67)</text>
            </g>

            <!-- ═════════════════════════════════════════════════ -->
            <!-- 2. 气泡提示框 (两次 ARP 探测机制) -->
            <!-- ═════════════════════════════════════════════════ -->

            <!-- 左侧气泡：服务器在发 OFFER 前用 ARP 探活 -->
            <g transform="translate(230, 85)">
              <rect x="0" y="0" width="220" height="50" rx="14" fill="var(--vp-c-bg-elv)" stroke="#111827" stroke-width="1.5" />
              <text x="110" y="21" font-size="12" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">使用ARP确保所选IP地址未</text>
              <text x="110" y="39" font-size="12" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">被网络中其他主机占用</text>
              <!-- 虚线指向服务器 1 的发 OFFER 之前位置 -->
              <path d="M 180,50 L 180,128 L 163,128" fill="none" stroke="#111827" stroke-width="1.2" stroke-dasharray="4,3" />
            </g>

            <!-- 右侧气泡：客户机在收 ACK 后用免费 ARP 测冲突 -->
            <g transform="translate(635, 10)">
              <rect x="0" y="0" width="270" height="142" rx="18" fill="var(--vp-c-bg-elv)" stroke="#111827" stroke-width="1.5" />
              <text x="135" y="24" font-size="12" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">使用ARP检测所分配到的IP地址</text>
              <text x="135" y="44" font-size="12" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">是否已被网络中其他主机占用：</text>
              <text x="135" y="64" font-size="12" font-weight="bold" text-anchor="middle" fill="#dc2626">若是，则发送DHCP谢绝报文，</text>
              <text x="135" y="84" font-size="12" font-weight="bold" text-anchor="middle" fill="#dc2626">并重新发送DHCP发现报文；</text>
              <text x="135" y="104" font-size="12" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">否则可以使用租约中的IP地址</text>
              <text x="135" y="124" font-size="12" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">与网络中其他主机通信了。</text>
              <!-- 弯折引线指向客户端 ACK 后位置 -->
              <path d="M 60,142 C 30,170 -40,200 -62,280" fill="none" stroke="#111827" stroke-width="1.2" stroke-dasharray="4,3" />
            </g>

            <!-- ═════════════════════════════════════════════════ -->
            <!-- 3. 三条主垂直时间轴 -->
            <!-- ═════════════════════════════════════════════════ -->
            <line x1="160" y1="150" x2="160" y2="595" stroke="#111827" stroke-width="2" marker-end="url(#arrow-black)" />
            <line x1="570" y1="150" x2="570" y2="595" stroke="#111827" stroke-width="2" marker-end="url(#arrow-black)" />
            <line x1="980" y1="150" x2="980" y2="595" stroke="#111827" stroke-width="2" marker-end="url(#arrow-black)" />

            <!-- ═════════════════════════════════════════════════ -->
            <!-- 4. 最左侧红色考点阶段标题 -->
            <!-- ═════════════════════════════════════════════════ -->
            <text x="145" y="185" font-size="13.5" font-weight="900" text-anchor="end" fill="#dc2626">寻址DHCP服务器</text>
            <text x="145" y="217" font-size="13.5" font-weight="900" text-anchor="end" fill="#dc2626">提供IP地址租用</text>
            <text x="145" y="249" font-size="13.5" font-weight="900" text-anchor="end" fill="#dc2626">接收IP地址租约</text>
            <text x="145" y="281" font-size="13.5" font-weight="900" text-anchor="end" fill="#dc2626">确认IP地址租约</text>

            <!-- 分割横线 -->
            <line x1="20" y1="325" x2="160" y2="325" stroke="#111827" stroke-width="1.5" />

            <!-- 垂直排列：IP 地址 续约 -->
            <g transform="translate(45, 345)">
              <text x="0" y="15" font-size="13.5" font-weight="900" text-anchor="middle" fill="#dc2626">IP</text>
              <text x="0" y="35" font-size="13.5" font-weight="900" text-anchor="middle" fill="#dc2626">地</text>
              <text x="0" y="55" font-size="13.5" font-weight="900" text-anchor="middle" fill="#dc2626">址</text>
              <text x="0" y="75" font-size="13.5" font-weight="900" text-anchor="middle" fill="#dc2626">续</text>
              <text x="0" y="95" font-size="13.5" font-weight="900" text-anchor="middle" fill="#dc2626">约</text>
            </g>

            <!-- 底部：随时解除地址租约 -->
            <text x="145" y="565" font-size="13.5" font-weight="900" text-anchor="end" fill="#dc2626">随时解除地址租约</text>

            <!-- ═════════════════════════════════════════════════ -->
            <!-- 5. 四步租约获取（四报文广播握手） -->
            <!-- ═════════════════════════════════════════════════ -->

            <!-- ① DISCOVER 广播 (y=180) -->
            <!-- 向左：客户机 -> 服务器1 -->
            <line x1="570" y1="180" x2="166" y2="180" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="325" y="169" width="92" height="22" rx="2" fill="#00a2e8" stroke="#111827" stroke-width="1" />
            <text x="371" y="185" font-size="11.5" font-weight="900" text-anchor="middle" fill="#ffffff">DISCOVER</text>
            <text x="245" y="174" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:255.255.255.255</text>
            <text x="455" y="174" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:0.0.0.0</text>

            <!-- 向右：客户机 -> 服务器2 -->
            <line x1="570" y1="180" x2="974" y2="180" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="735" y="169" width="92" height="22" rx="2" fill="#00a2e8" stroke="#111827" stroke-width="1" />
            <text x="781" y="185" font-size="11.5" font-weight="900" text-anchor="middle" fill="#ffffff">DISCOVER</text>
            <text x="655" y="174" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:0.0.0.0</text>
            <text x="865" y="174" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:255.255.255.255</text>

            <!-- ② OFFER 广播 (y=212) -->
            <!-- 从左：服务器1 -> 客户机 -->
            <line x1="160" y1="212" x2="564" y2="212" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="325" y="201" width="92" height="22" rx="2" fill="#ffc90e" stroke="#111827" stroke-width="1" />
            <text x="371" y="217" font-size="11.5" font-weight="900" text-anchor="middle" fill="#111827">OFFER</text>
            <text x="245" y="206" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:DHCP服务器1</text>
            <text x="475" y="206" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:255.255.255.255</text>

            <!-- 从右：服务器2 -> 客户机 -->
            <line x1="980" y1="212" x2="576" y2="212" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="735" y="201" width="92" height="22" rx="2" fill="#ffc90e" stroke="#111827" stroke-width="1" />
            <text x="781" y="217" font-size="11.5" font-weight="900" text-anchor="middle" fill="#111827">OFFER</text>
            <text x="655" y="206" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:255.255.255.255</text>
            <text x="865" y="206" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:DHCP服务器2</text>

            <!-- ③ REQUEST 广播确认 (y=244) -->
            <!-- 向左：客户机 -> 服务器1 -->
            <line x1="570" y1="244" x2="166" y2="244" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="325" y="233" width="92" height="22" rx="2" fill="#00a2e8" stroke="#111827" stroke-width="1" />
            <text x="371" y="249" font-size="11.5" font-weight="900" text-anchor="middle" fill="#ffffff">REQUEST</text>
            <text x="245" y="238" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:255.255.255.255</text>
            <text x="455" y="238" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:0.0.0.0</text>

            <!-- 向右：客户机 -> 服务器2 -->
            <line x1="570" y1="244" x2="974" y2="244" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="735" y="233" width="92" height="22" rx="2" fill="#00a2e8" stroke="#111827" stroke-width="1" />
            <text x="781" y="249" font-size="11.5" font-weight="900" text-anchor="middle" fill="#ffffff">REQUEST</text>
            <text x="655" y="238" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:0.0.0.0</text>
            <text x="865" y="238" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:255.255.255.255</text>

            <!-- ④ ACK 确认 (y=276) -->
            <!-- 仅服务器1 发送 -->
            <line x1="160" y1="276" x2="564" y2="276" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="325" y="265" width="92" height="22" rx="2" fill="#00a651" stroke="#111827" stroke-width="1" />
            <text x="371" y="281" font-size="11.5" font-weight="900" text-anchor="middle" fill="#ffffff">ACK</text>
            <text x="245" y="270" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:DHCP服务器1</text>
            <text x="475" y="270" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:255.255.255.255</text>

            <!-- ═════════════════════════════════════════════════ -->
            <!-- 6. 租期续约时序段落 -->
            <!-- ═════════════════════════════════════════════════ -->

            <!-- 到达 0.5 倍租用期 (T1): 客户机单播 REQUEST -->
            <line x1="570" y1="325" x2="166" y2="325" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="325" y="314" width="92" height="22" rx="2" fill="#00a2e8" stroke="#111827" stroke-width="1" />
            <text x="371" y="330" font-size="11.5" font-weight="900" text-anchor="middle" fill="#ffffff">REQUEST</text>
            <text x="245" y="319" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:DHCP服务器1</text>
            <text x="455" y="319" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:租用的地址</text>

            <!-- 0.5 续约的三种情况 -->
            <text x="155" y="356" font-size="12" font-weight="bold" text-anchor="end" fill="var(--vp-c-text-1)">情况1</text>
            <text x="155" y="388" font-size="12" font-weight="bold" text-anchor="end" fill="var(--vp-c-text-1)">情况2</text>
            <text x="155" y="416" font-size="12" font-weight="bold" text-anchor="end" fill="var(--vp-c-text-1)">情况3</text>
            <text x="155" y="432" font-size="11.5" font-weight="bold" text-anchor="end" fill="var(--vp-c-text-1)">不响应</text>

            <!-- 情况 1：服务器响应 ACK -->
            <line x1="160" y1="352" x2="564" y2="352" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="325" y="341" width="92" height="22" rx="2" fill="#00a651" stroke="#111827" stroke-width="1" />
            <text x="371" y="357" font-size="11.5" font-weight="900" text-anchor="middle" fill="#ffffff">ACK</text>
            <text x="245" y="346" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:DHCP服务器1</text>
            <text x="460" y="346" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:租用的地址</text>
            <!-- 客户机右侧说明 -->
            <line x1="570" y1="352" x2="578" y2="352" stroke="#111827" stroke-width="1.5" />
            <text x="585" y="356" font-size="12.5" font-weight="bold" fill="#dc2626">得到新的租用期</text>

            <!-- 情况 2：服务器响应 NACK -->
            <line x1="160" y1="384" x2="564" y2="384" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="325" y="373" width="92" height="22" rx="2" fill="var(--vp-c-bg-elv)" stroke="#111827" stroke-width="1.2" />
            <text x="371" y="389" font-size="11.5" font-weight="900" text-anchor="middle" fill="var(--vp-c-text-1)">NACK</text>
            <text x="245" y="378" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:DHCP服务器1</text>
            <text x="460" y="378" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:租用的地址</text>
            <!-- 客户机右侧说明 -->
            <line x1="570" y1="384" x2="578" y2="384" stroke="#111827" stroke-width="1.5" />
            <text x="585" y="388" font-size="12" font-weight="bold" fill="#dc2626">立即停止使用租用的IP地址</text>
            <text x="585" y="404" font-size="12" font-weight="bold" fill="#dc2626">重新发送DHCP发现报文</text>

            <!-- 情况 3：到达 0.875 倍租期 (T2)，广播 REQUEST 求援 -->
            <line x1="570" y1="440" x2="166" y2="440" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="325" y="429" width="92" height="22" rx="2" fill="#00a2e8" stroke="#111827" stroke-width="1" />
            <text x="371" y="445" font-size="11.5" font-weight="900" text-anchor="middle" fill="#ffffff">REQUEST</text>
            <text x="245" y="434" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:255.255.255.255</text>
            <text x="455" y="434" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:租用的地址</text>

            <!-- 中间垂直省略号 -->
            <text x="371" y="475" font-size="18" font-weight="900" text-anchor="middle" fill="var(--vp-c-text-1)">⋮</text>

            <!-- 到期仍无响应：强制停用 -->
            <g transform="translate(430, 498)">
              <text x="0" y="0" font-size="12" font-weight="bold" text-anchor="middle" fill="#dc2626">立即停止使用租用的IP地址</text>
              <text x="0" y="18" font-size="12" font-weight="bold" text-anchor="middle" fill="#dc2626">重新发送DHCP发现报文</text>
            </g>

            <!-- ═════════════════════════════════════════════════ -->
            <!-- 7. 右侧时间段维度标尺 (0.5倍、0.875倍、租用期) -->
            <!-- ═════════════════════════════════════════════════ -->
            <!-- 0.5 倍水平标线 -->
            <line x1="570" y1="325" x2="710" y2="325" stroke="#111827" stroke-width="1.2" />

            <!-- 0.5 倍租用期垂直双向箭头 -->
            <g transform="translate(635, 0)">
              <line x1="0" y1="280" x2="0" y2="321" stroke="#b91c1c" stroke-width="1.5" marker-start="url(#dim-arrow-up)" marker-end="url(#dim-arrow-down)" />
              <text x="0" y="303" font-size="11.5" font-weight="900" text-anchor="middle" fill="#b91c1c">0.5倍租用期</text>
            </g>

            <!-- 0.875 倍水平标线与双向箭头 -->
            <line x1="570" y1="440" x2="860" y2="440" stroke="#111827" stroke-width="1.2" />
            <g transform="translate(835, 0)">
              <line x1="0" y1="280" x2="0" y2="436" stroke="#b91c1c" stroke-width="1.5" marker-start="url(#dim-arrow-up)" marker-end="url(#dim-arrow-down)" />
              <text x="0" y="355" font-size="11.5" font-weight="900" text-anchor="middle" fill="#b91c1c">0.875倍</text>
              <text x="0" y="372" font-size="11.5" font-weight="900" text-anchor="middle" fill="#b91c1c">租用期</text>
            </g>

            <!-- 完整租用期水平标线与双向箭头 -->
            <line x1="570" y1="520" x2="980" y2="520" stroke="#111827" stroke-width="1.2" />
            <g transform="translate(910, 0)">
              <line x1="0" y1="280" x2="0" y2="516" stroke="#b91c1c" stroke-width="1.5" marker-start="url(#dim-arrow-up)" marker-end="url(#dim-arrow-down)" />
              <text x="0" y="395" font-size="12" font-weight="900" text-anchor="middle" fill="#b91c1c">租用期</text>
            </g>

            <!-- ═════════════════════════════════════════════════ -->
            <!-- 8. 底部：随时解除地址租约 (DHCP RELEASE) -->
            <!-- ═════════════════════════════════════════════════ -->
            <!-- 向左：客户机 -> 服务器1 -->
            <line x1="570" y1="560" x2="166" y2="560" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="325" y="549" width="92" height="22" rx="2" fill="#334155" stroke="#111827" stroke-width="1" />
            <text x="371" y="565" font-size="11.5" font-weight="900" text-anchor="middle" fill="#ffffff">RELEASE</text>
            <text x="245" y="554" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:255.255.255.255</text>
            <text x="455" y="554" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:0.0.0.0</text>

            <!-- 向右：客户机 -> 服务器2 -->
            <line x1="570" y1="560" x2="974" y2="560" stroke="#111827" stroke-width="1.8" marker-end="url(#arrow-black)" />
            <rect x="735" y="549" width="92" height="22" rx="2" fill="#334155" stroke="#111827" stroke-width="1" />
            <text x="781" y="565" font-size="11.5" font-weight="900" text-anchor="middle" fill="#ffffff">RELEASE</text>
            <text x="655" y="554" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">源:0.0.0.0</text>
            <text x="865" y="554" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">目的:255.255.255.255</text>

          </svg>
        </div>

      </div>
    </div>

    <!-- 2. 动态交互模拟器 (单步演示 / 6 大场景全覆盖) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('sim')">
        <div class="header-title-box">
          <span class="card-icon">🎮</span>
          <strong>二、DHCP 交互分步模拟器（6 大场景动态演示与报文抓包仿真）</strong>
          <span class="badge-blue">交互模拟</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.sim ? '收起 ▲' : '展开模拟器 ▼' }}
        </button>
      </div>

      <div v-show="openSections.sim" class="card-body">
        
        <!-- 场景选择 Tabs -->
        <div class="scenario-tabs">
          <button 
            v-for="(sc, idx) in scenarios" 
            :key="idx" 
            class="tab-btn" 
            :class="{ active: currentScenarioIdx === idx }"
            @click="switchScenario(idx)"
          >
            {{ sc.name }}
          </button>
        </div>

        <!-- 场景描述 -->
        <div class="scenario-desc-box">
          <strong>场景简介：</strong>{{ currentScenario.description }}
        </div>

        <!-- 步骤进度指示器 -->
        <div class="steps-progress-bar">
          <div 
            v-for="(st, sIdx) in currentScenario.steps" 
            :key="sIdx"
            class="step-node"
            :class="{ active: currentStepIdx === sIdx, passed: currentStepIdx > sIdx }"
            @click="jumpToStep(sIdx)"
          >
            <span class="step-num">{{ sIdx + 1 }}</span>
            <span class="step-title">{{ st.shortTitle }}</span>
          </div>
        </div>

        <!-- 报文交互动画视窗 -->
        <div class="anim-viewport">
          <div class="node-box node-left" :class="{ highlight: activeEntities.includes('srv1') }">
            <div class="node-icon">🖥️</div>
            <div class="node-name">DHCP 服务器 1</div>
            <div class="node-detail">192.168.1.1 : 67</div>
          </div>

          <div class="traffic-channel">
            <div 
              v-if="currentStep.packet" 
              class="packet-bubble"
              :class="[currentStep.packet.direction, currentStep.packet.typeColor]"
            >
              <span class="packet-name">{{ currentStep.packet.name }}</span>
              <span class="packet-cast">{{ currentStep.packet.castType }}</span>
            </div>
            <div v-else class="packet-idle">
              <span class="idle-text">{{ currentStep.idleText || '内部状态流转中...' }}</span>
            </div>
          </div>

          <div class="node-box node-center" :class="{ highlight: activeEntities.includes('client') }">
            <div class="node-icon">💻</div>
            <div class="node-name">DHCP 客户机</div>
            <div class="node-detail">{{ clientCurrentIp }} : 68</div>
          </div>

          <div class="traffic-channel right-channel">
            <div 
              v-if="currentStep.packetRight" 
              class="packet-bubble"
              :class="[currentStep.packetRight.direction, currentStep.packetRight.typeColor]"
            >
              <span class="packet-name">{{ currentStep.packetRight.name }}</span>
              <span class="packet-cast">{{ currentStep.packetRight.castType }}</span>
            </div>
          </div>

          <div class="node-box node-right" :class="{ highlight: activeEntities.includes('srv2') }">
            <div class="node-icon">🖥️</div>
            <div class="node-name">DHCP 服务器 2</div>
            <div class="node-detail">192.168.1.2 : 67</div>
          </div>
        </div>

        <!-- 控制按钮栏 -->
        <div class="sim-controls">
          <button class="ctrl-btn" @click="prevStep" :disabled="currentStepIdx === 0">
            ⏮️ 上一步
          </button>
          <button class="ctrl-btn primary" @click="togglePlay">
            {{ isPlaying ? '⏸️ 暂停' : '▶️ 自动演示' }}
          </button>
          <button class="ctrl-btn" @click="nextStep" :disabled="currentStepIdx === currentScenario.steps.length - 1">
            下一步 ⏭️
          </button>
          <button class="ctrl-btn outline" @click="resetStep">
            🔄 重置本场景
          </button>
        </div>

        <!-- 详细报文与考点深度解析卡片 -->
        <div class="step-detail-card">
          <div class="detail-header">
            <span class="detail-badge">{{ currentStep.phaseName }}</span>
            <h5 class="detail-title">{{ currentStep.title }}</h5>
          </div>

          <!-- 报文字段速览 (Wireshark 风格) -->
          <div v-if="currentStep.packet" class="packet-fields-grid">
            <div class="field-item">
              <span class="field-label">源 IP : 端口</span>
              <span class="field-val font-mono">{{ currentStep.packet.srcIp }} : {{ currentStep.packet.srcPort }}</span>
            </div>
            <div class="field-item">
              <span class="field-label">目的 IP : 端口</span>
              <span class="field-val font-mono">{{ currentStep.packet.destIp }} : {{ currentStep.packet.destPort }}</span>
            </div>
            <div class="field-item">
              <span class="field-label">传输方式</span>
              <span class="field-val highlight-bold">{{ currentStep.packet.castType }}</span>
            </div>
            <div class="field-item">
              <span class="field-label">携带核心数据</span>
              <span class="field-val">{{ currentStep.packet.payload }}</span>
            </div>
          </div>

          <!-- 考点提示与深度说明 -->
          <div class="explanation-box">
            <div class="tip-title">📝 408 核心考点剖析：</div>
            <p class="tip-content">{{ currentStep.explanation }}</p>
          </div>
        </div>

      </div>
    </div>

    <!-- 3. 核心考点速查与避坑对比表 -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('tables')">
        <div class="header-title-box">
          <span class="card-icon">📋</span>
          <strong>三、DHCP 408 核心考点速查与高频易错辨析表</strong>
          <span class="badge-blue">考点速查</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.tables ? '收起 ▲' : '展开表格 ▼' }}
        </button>
      </div>

      <div v-show="openSections.tables" class="card-body">
        
        <!-- 表 1：两次 ARP 探测机制全对比 -->
        <h5 class="table-caption">⭐ 两次 ARP 探测机制对比（必背高频陷阱）</h5>
        <div class="table-wrapper">
          <table class="dhcp-table">
            <thead>
              <tr>
                <th>对比维度</th>
                <th>① 服务器发 OFFER 前的 ARP 探活</th>
                <th>② 客户机收 ACK 后的免费 ARP 测冲突</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>发起实体</strong></td>
                <td><span class="badge-blue">DHCP 服务器</span></td>
                <td><span class="badge-green">DHCP 客户机</span></td>
              </tr>
              <tr>
                <td><strong>触发时机</strong></td>
                <td>在向客户端发送 <code>DHCPOFFER</code> 报文<strong>之前</strong></td>
                <td>在接收到服务器的 <code>DHCPACK</code> 报文<strong>之后</strong></td>
              </tr>
              <tr>
                <td><strong>探测目的</strong></td>
                <td>检查自己从地址池选取的待分配 IP 是否已被局域网内静态主机占用</td>
                <td>校验最终获得的 IP 地址在局域网内是否唯一、有无 IP 地址冲突</td>
              </tr>
              <tr>
                <td><strong>ARP 报文类型</strong></td>
                <td>标准 ARP 请求报文（广播问询：谁在用此 IP）</td>
                <td><strong>免费 ARP (Gratuitous ARP)</strong>（以自己待绑定的 IP 探测自身）</td>
              </tr>
              <tr>
                <td><strong>冲突处理对策</strong></td>
                <td>若收到应答说明已占用，服务器标记该 IP 不可用并另选新 IP</td>
                <td>若收到应答说明冲突，客户机发送 <code>DHCPDECLINE</code> 拒绝，并重发 DISCOVER</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 表 2：DHCP 各类报文单播/广播全景表 -->
        <h5 class="table-caption" style="margin-top: 20px;">📦 DHCP 各类核心报文单播/广播与端口全景表</h5>
        <div class="table-wrapper">
          <table class="dhcp-table">
            <thead>
              <tr>
                <th>报文名称</th>
                <th>发送方 ➔ 接收方</th>
                <th>传输方式</th>
                <th>源 IP ➔ 目的 IP</th>
                <th>核心功能与考点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>DHCPDISCOVER</code></td>
                <td>客户机 ➔ 服务器</td>
                <td><span class="badge-amber">广播</span></td>
                <td><code>0.0.0.0</code> ➔ <code>255.255.255.255</code></td>
                <td>客户机寻找局域网内的 DHCP 服务器（UDP 68 ➔ 67）</td>
              </tr>
              <tr>
                <td><code>DHCPOFFER</code></td>
                <td>服务器 ➔ 客户机</td>
                <td><span class="badge-amber">广播</span> (或单播)</td>
                <td>服务器 IP ➔ <code>255.255.255.255</code></td>
                <td>提供待分配 IP、子网掩码、网关与租期；<strong>发送前先用 ARP 探活</strong></td>
              </tr>
              <tr>
                <td><code>DHCPREQUEST</code> (获取阶段)</td>
                <td>客户机 ➔ 服务器</td>
                <td><span class="badge-amber">广播</span></td>
                <td><code>0.0.0.0</code> ➔ <code>255.255.255.255</code></td>
                <td><strong>广播通知</strong>：接受选中服务器的提议，并通知其他服务器回收预留 IP</td>
              </tr>
              <tr>
                <td><code>DHCPACK</code></td>
                <td>服务器 ➔ 客户机</td>
                <td><span class="badge-amber">广播</span> (或单播)</td>
                <td>服务器 IP ➔ <code>255.255.255.255</code></td>
                <td>确认分配，租约正式生效；<strong>客户机收到后发免费 ARP 测冲突</strong></td>
              </tr>
              <tr>
                <td><code>DHCPREQUEST</code> (0.5 倍 T1)</td>
                <td>客户机 ➔ 服务器</td>
                <td><span class="badge-blue">单播</span></td>
                <td>分配的 IP ➔ 租约服务器 IP</td>
                <td>向原分配服务器单独申请延长租约</td>
              </tr>
              <tr>
                <td><code>DHCPREQUEST</code> (0.875 倍 T2)</td>
                <td>客户机 ➔ 所有服务器</td>
                <td><span class="badge-amber">广播</span></td>
                <td>分配的 IP ➔ <code>255.255.255.255</code></td>
                <td>原服务器无应答时，向全网任意可用 DHCP 服务器求援续约</td>
              </tr>
              <tr>
                <td><code>DHCPDECLINE</code></td>
                <td>客户机 ➔ 服务器</td>
                <td><span class="badge-amber">广播</span></td>
                <td><code>0.0.0.0</code> ➔ <code>255.255.255.255</code></td>
                <td>免费 ARP 发现 IP 冲突时，谢绝使用该 IP 并重走 DISCOVER</td>
              </tr>
              <tr>
                <td><code>DHCPRELEASE</code></td>
                <td>客户机 ➔ 服务器</td>
                <td><span class="badge-blue">单播</span></td>
                <td>分配的 IP ➔ 租约服务器 IP</td>
                <td>用户下线主动提前释放 IP，归还给服务器地址池</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 表 3：租约生命周期三大时间节点速记表 -->
        <h5 class="table-caption" style="margin-top: 20px;">⏱️ 租约生命周期三大时间节点</h5>
        <div class="table-wrapper">
          <table class="dhcp-table">
            <thead>
              <tr>
                <th>时间点</th>
                <th>比例</th>
                <th>发送报文与传输方式</th>
                <th>结果处理分支</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>T1 续约点</strong></td>
                <td><strong>0.5 倍租用期 (50%)</strong></td>
                <td><strong>单播</strong> <code>DHCPREQUEST</code> 发给原服务器</td>
                <td>
                  ① 收到 <code>DHCPACK</code>：租约倒计时重置，续约成功；<br/>
                  ② 收到 <code>DHCPNACK</code>：立即停用该 IP，重发 DISCOVER；<br/>
                  ③ 无应答：继续使用，等待 T2。
                </td>
              </tr>
              <tr>
                <td><strong>T2 续约点</strong></td>
                <td><strong>0.875 倍租用期 (87.5% / 7/8)</strong></td>
                <td><strong>广播</strong> <code>DHCPREQUEST</code> 向全网求援</td>
                <td>
                  ① 收到任意服务器 <code>DHCPACK</code>：重置租约，续约成功；<br/>
                  ② 仍无应答：继续使用直至租约到期。
                </td>
              </tr>
              <tr>
                <td><strong>租约到期点</strong></td>
                <td><strong>1.0 倍租用期 (100%)</strong></td>
                <td>—</td>
                <td><strong>必须立即强制停止使用该 IP</strong>，彻底回到初始状态重发 <code>DHCPDISCOVER</code>。</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- 4. 408 历年真题互动测试区 -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam')">
        <div class="header-title-box">
          <span class="card-icon">🎯</span>
          <strong>四、408 历年经典真题互动实战（即测即练）</strong>
          <span class="badge-blue">真题自测</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam ? '收起 ▲' : '展开练习 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam" class="card-body">
        
        <!-- 题目 1 -->
        <div class="quiz-item">
          <div class="quiz-stem">
            <strong>【经典题 1】</strong>下列关于 DHCP 协议的叙述中，<strong>错误</strong>的是（ ）。
          </div>
          <div class="options-list">
            <button 
              v-for="(opt, oIdx) in quiz1.options" 
              :key="oIdx"
              class="opt-btn"
              :class="{ 
                selected: quiz1.userAns === oIdx,
                correct: quiz1.revealed && oIdx === quiz1.correctAns,
                wrong: quiz1.revealed && quiz1.userAns === oIdx && oIdx !== quiz1.correctAns
              }"
              @click="handleQuiz(quiz1, oIdx)"
            >
              {{ opt }}
            </button>
          </div>
          <div v-show="quiz1.revealed" class="quiz-feedback">
            <div class="feedback-title">
              {{ quiz1.userAns === quiz1.correctAns ? '✅ 回答正确！' : '❌ 回答错误！' }}
            </div>
            <div class="feedback-desc">
              <strong>解析：</strong>{{ quiz1.explanation }}
            </div>
          </div>
        </div>

        <!-- 题目 2 -->
        <div class="quiz-item" style="margin-top: 18px;">
          <div class="quiz-stem">
            <strong>【经典题 2】</strong>DHCP 客户机在获得服务器分配的 IP 地址（收到 DHCPACK）后，必须使用（ ）协议来检测分配的 IP 地址在局域网内是否发生冲突？若冲突将发送（ ）报文拒绝。
          </div>
          <div class="options-list">
            <button 
              v-for="(opt, oIdx) in quiz2.options" 
              :key="oIdx"
              class="opt-btn"
              :class="{ 
                selected: quiz2.userAns === oIdx,
                correct: quiz2.revealed && oIdx === quiz2.correctAns,
                wrong: quiz2.revealed && quiz2.userAns === oIdx && oIdx !== quiz2.correctAns
              }"
              @click="handleQuiz(quiz2, oIdx)"
            >
              {{ opt }}
            </button>
          </div>
          <div v-show="quiz2.revealed" class="quiz-feedback">
            <div class="feedback-title">
              {{ quiz2.userAns === quiz2.correctAns ? '✅ 回答正确！' : '❌ 回答错误！' }}
            </div>
            <div class="feedback-desc">
              <strong>解析：</strong>{{ quiz2.explanation }}
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// 折叠状态控制
const openSections = reactive({
  topo: true,    // 默认展开时序拓扑
  sim: true,     // 默认展开模拟器
  tables: false, // 默认收起表格
  exam: false    // 默认收起真题
})

const toggle = (key) => {
  openSections[key] = !openSections[key]
}

// 模拟器状态
const currentScenarioIdx = ref(0)
const currentStepIdx = ref(0)
const isPlaying = ref(false)
let playTimer = null

// 场景定义
const scenarios = [
  {
    name: '① 正常获取租约 (4步+免费ARP)',
    description: '客户机通过 DISCOVER 广播寻找服务器，服务器在发 OFFER 前用 ARP 探活；客户机广播发送 REQUEST 选定服务器1并通知服务器2回收；收到 ACK 后客户机发免费 ARP 测无冲突，正式绑定生效。',
    steps: [
      {
        shortTitle: '1. DISCOVER广播',
        phaseName: '寻址阶段',
        title: '步骤 1：客户机广播发送 DHCPDISCOVER 寻址',
        entities: ['client', 'srv1', 'srv2'],
        clientIp: '0.0.0.0',
        packet: {
          name: 'DHCPDISCOVER',
          castType: '广播 (Broadcast)',
          typeColor: 'color-blue',
          direction: 'c-to-l',
          srcIp: '0.0.0.0',
          srcPort: '68',
          destIp: '255.255.255.255',
          destPort: '67',
          payload: '请求分配 IP 地址、子网掩码、默认网关、DNS 服务器'
        },
        packetRight: {
          name: 'DHCPDISCOVER',
          castType: '广播 (Broadcast)',
          typeColor: 'color-blue',
          direction: 'c-to-r'
        },
        explanation: '客户机此时没有 IP 地址，源 IP 填 0.0.0.0；由于不知 DHCP 服务器 IP，目的 IP 填受限广播地址 255.255.255.255。同一局域网内的所有 DHCP 服务器都会收到此报文。'
      },
      {
        shortTitle: '2. 服务器ARP探活',
        phaseName: '探活校验',
        title: '步骤 2：DHCP 服务器发送 OFFER 前进行 ARP 探活',
        entities: ['srv1', 'srv2'],
        clientIp: '0.0.0.0',
        packet: null,
        idleText: '⚡ 服务器 1 在局域网内发出 ARP 请求，探测 192.168.1.100 是否已被静态占用...',
        explanation: '【408核心考点】DHCP 服务器在将 IP 地址分配给客户端前，必须先在局域网内发送 ARP 请求，确保该 IP 地址未被局域网中其它静态配置的主机占用，确认无人应答后再发出 DHCPOFFER。'
      },
      {
        shortTitle: '3. OFFER提供租约',
        phaseName: '提供阶段',
        title: '步骤 3：服务器发送 DHCPOFFER 提供预留 IP 租约',
        entities: ['srv1', 'client', 'srv2'],
        clientIp: '0.0.0.0',
        packet: {
          name: 'DHCPOFFER (192.168.1.100)',
          castType: '广播 / 单播',
          typeColor: 'color-green',
          direction: 'l-to-c',
          srcIp: '192.168.1.1',
          srcPort: '67',
          destIp: '255.255.255.255',
          destPort: '68',
          payload: '拟提供 IP: 192.168.1.100, 掩码: 255.255.255.0, 租期: 86400秒'
        },
        packetRight: {
          name: 'DHCPOFFER (192.168.1.200)',
          castType: '广播 / 单播',
          typeColor: 'color-green',
          direction: 'r-to-c'
        },
        explanation: '两台服务器均收到 DISCOVER 并发 OFFER。通常客户机选择最先到达的 OFFER（此处选中服务器 1）。'
      },
      {
        shortTitle: '4. REQUEST接受租约',
        phaseName: '请求阶段',
        title: '步骤 4：客户机广播发送 DHCPREQUEST 确认选中服务器1',
        entities: ['client', 'srv1', 'srv2'],
        clientIp: '0.0.0.0',
        packet: {
          name: 'DHCPREQUEST',
          castType: '广播 (Broadcast)',
          typeColor: 'color-purple',
          direction: 'c-to-l',
          srcIp: '0.0.0.0',
          srcPort: '68',
          destIp: '255.255.255.255',
          destPort: '67',
          payload: '选定 Server 1 (192.168.1.1)，请求确认租用 192.168.1.100'
        },
        packetRight: {
          name: 'DHCPREQUEST',
          castType: '广播 (Broadcast)',
          typeColor: 'color-purple',
          direction: 'c-to-r'
        },
        explanation: '【双重意义考点】REQUEST 必须以广播方式发送！目的 1：通知服务器 1 接受其提供的参数；目的 2：通知服务器 2 撤销预留 IP 并将 192.168.1.200 回收到地址池。'
      },
      {
        shortTitle: '5. ACK确认租约',
        phaseName: '确认阶段',
        title: '步骤 5：服务器 1 发送 DHCPACK 确认租约正式生效',
        entities: ['srv1', 'client'],
        clientIp: '0.0.0.0',
        packet: {
          name: 'DHCPACK',
          castType: '广播 / 单播',
          typeColor: 'color-green',
          direction: 'l-to-c',
          srcIp: '192.168.1.1',
          srcPort: '67',
          destIp: '255.255.255.255',
          destPort: '68',
          payload: '租约正式确认，租期计时器开启，配置生效'
        },
        explanation: '服务器 1 发出 DHCPACK，将最终配置参数正式下发。客户机获得所有参数，但尚未直接投入生产使用，还需进行最后一道安全检查。'
      },
      {
        shortTitle: '6. 免费ARP防冲突',
        phaseName: '冲突检测',
        title: '步骤 6：客户机发送免费 ARP 检测冲突，无冲突正式启用',
        entities: ['client'],
        clientIp: '192.168.1.100',
        packet: null,
        idleText: '🛡️ 客户机向局域网广播免费 ARP (Gratuitous ARP) 查询自身 192.168.1.100，未收到应答，正式绑定启用！',
        explanation: '【408必背大题】客户机在收到 DHCPACK 后，必须使用免费 ARP（Gratuitous ARP）检测分配到的 IP 是否与局域网内其他设备冲突。若未收到应答，则正式使用此 IP，进入 BOUND 状态！'
      }
    ]
  },
  {
    name: '② 0.5倍租期续约成功',
    description: '当租期流逝达到 50% (T1) 时，客户机单播发送 DHCPREQUEST 给原服务器 1；服务器 1 响应 DHCPACK，租约计时器重置，获得完整新租期。',
    steps: [
      {
        shortTitle: '1. 到达 0.5倍(T1)',
        phaseName: 'T1 触发',
        title: '时间到达租用期的 0.5 倍 (T1 续约计时器)',
        entities: ['client'],
        clientIp: '192.168.1.100',
        packet: null,
        idleText: '⏱️ 租期已消耗 50%，客户机单播续约计时器 T1 触发...',
        explanation: '此时客户机仍合法持有该 IP 地址，网络通信正常进行。为了防止租期突然到期，客户机提前主动发起续约。'
      },
      {
        shortTitle: '2. 单播 REQUEST',
        phaseName: '单播申请',
        title: '客户机单播发送 DHCPREQUEST 向原服务器申请延期',
        entities: ['client', 'srv1'],
        clientIp: '192.168.1.100',
        packet: {
          name: 'DHCPREQUEST (单播续约)',
          castType: '单播 (Unicast)',
          typeColor: 'color-blue',
          direction: 'c-to-l',
          srcIp: '192.168.1.100',
          srcPort: '68',
          destIp: '192.168.1.1',
          destPort: '67',
          payload: '请求延长 IP 192.168.1.100 的租用期限'
        },
        explanation: '【高频单播考点】0.5 倍租期续约时，客户机已知分配给自己 IP 的是服务器 1，且自己持有可用 IP，因此直接使用【单播】向服务器 1 发送，无需在局域网内广播扰民！'
      },
      {
        shortTitle: '3. 服务器响应 ACK',
        phaseName: '续约确认',
        title: '服务器 1 响应 DHCPACK，租约更新成功',
        entities: ['srv1', 'client'],
        clientIp: '192.168.1.100',
        packet: {
          name: 'DHCPACK (重置租期)',
          castType: '单播 (Unicast)',
          typeColor: 'color-green',
          direction: 'l-to-c',
          srcIp: '192.168.1.1',
          srcPort: '67',
          destIp: '192.168.1.100',
          destPort: '68',
          payload: '同意续约，租约计时器重置为新的一轮完整租期'
        },
        explanation: '服务器 1 同意延长租期，回送 DHCPACK。客户机收到后将租用期计时器重新置满，续约圆满成功！'
      }
    ]
  },
  {
    name: '③ 0.5倍续约被拒绝 (NACK)',
    description: '0.5 倍租期时，服务器 1 由于策略调整或地址池重划，向客户机回复 DHCPNACK；客户机必须立即停止使用该 IP，重发 DISCOVER。',
    steps: [
      {
        shortTitle: '1. 单播申请续约',
        phaseName: '单播申请',
        title: '到达 0.5 倍租期，客户机单播发送 DHCPREQUEST',
        entities: ['client', 'srv1'],
        clientIp: '192.168.1.100',
        packet: {
          name: 'DHCPREQUEST',
          castType: '单播 (Unicast)',
          typeColor: 'color-blue',
          direction: 'c-to-l',
          srcIp: '192.168.1.100',
          srcPort: '68',
          destIp: '192.168.1.1',
          destPort: '67',
          payload: '请求续约 192.168.1.100'
        },
        explanation: '客户机单播向服务器 1 请求续约。'
      },
      {
        shortTitle: '2. 服务器回复 NACK',
        phaseName: '拒绝续约',
        title: '服务器 1 回复 DHCPNACK 拒绝续约',
        entities: ['srv1', 'client'],
        clientIp: '192.168.1.100',
        packet: {
          name: 'DHCPNACK (拒绝)',
          castType: '单播 / 广播',
          typeColor: 'color-red',
          direction: 'l-to-c',
          srcIp: '192.168.1.1',
          srcPort: '67',
          destIp: '192.168.1.100',
          destPort: '68',
          payload: '拒绝续约（如策略变更、子网重新划分、地址已被管理员保留）'
        },
        explanation: '【真题陷阱】若收到 DHCPNACK，客户机不能继续使用该 IP，必须立即停止使用！'
      },
      {
        shortTitle: '3. 立即停用重发DISCOVER',
        phaseName: '停用并重选',
        title: '客户机立即停止使用该 IP，回到初始状态重新申请',
        entities: ['client'],
        clientIp: '0.0.0.0',
        packet: null,
        idleText: '🛑 客户机立即释放并停用 192.168.1.100，IP 归零，重新广播 DHCPDISCOVER 寻找新租约...',
        explanation: '收到 NACK 后，客户机释放该 IP，进入 INIT 初始状态，重新启动 4 步广播握手流程。'
      }
    ]
  },
  {
    name: '④ 0.875倍广播续约超时停用',
    description: '服务器 1 宕机无响应；到达 0.875 倍租期 (T2) 时客户机广播发送 REQUEST 向全网求援；若到期仍无任何响应，客户机强制停用 IP。',
    steps: [
      {
        shortTitle: '1. T1 单播超时无果',
        phaseName: 'T1 故障',
        title: '0.5 倍租期单播 REQUEST 后，服务器 1 宕机无应答',
        entities: ['client'],
        clientIp: '192.168.1.100',
        packet: null,
        idleText: '⚠️ 服务器 1 无响应，客户机继续使用原 IP，直至租期流逝到 87.5% (T2)...',
        explanation: '单播续约未果，客户机并不立即放弃，而是继续正常通信，等待 T2 紧急续约点。'
      },
      {
        shortTitle: '2. 到达 0.875倍(T2)广播求援',
        phaseName: 'T2 广播求援',
        title: '到达 0.875 倍租期 (T2)，客户机广播发送 DHCPREQUEST',
        entities: ['client', 'srv2'],
        clientIp: '192.168.1.100',
        packet: {
          name: 'DHCPREQUEST (广播求援)',
          castType: '广播 (Broadcast)',
          typeColor: 'color-amber',
          direction: 'c-to-l',
          srcIp: '192.168.1.100',
          srcPort: '68',
          destIp: '255.255.255.255',
          destPort: '67',
          payload: '向全网任意可用 DHCP 服务器广播求援续约'
        },
        packetRight: {
          name: 'DHCPREQUEST (广播求援)',
          castType: '广播 (Broadcast)',
          typeColor: 'color-amber',
          direction: 'c-to-r'
        },
        explanation: '【核心考点】0.875 倍租期 (T2, 7/8) 时，客户机必须改为【广播】方式，向局域网内任何正常运作的 DHCP 服务器寻求续约！'
      },
      {
        shortTitle: '3. 租期到期强制停用',
        phaseName: '租期耗尽',
        title: '租用期到期 (1.0)，仍未收到响应，强制立即停用',
        entities: ['client'],
        clientIp: '0.0.0.0',
        packet: null,
        idleText: '🛑 租约 100% 耗尽！客户机立即强制停止使用 192.168.1.100，重发 DHCPDISCOVER。',
        explanation: '【408死命令】一旦租用期完全到期仍未续约成功，客户机必须无条件立即停止使用该 IP，防止 IP 冲突。'
      }
    ]
  },
  {
    name: '⑤ 免费ARP测冲突发DECLINE',
    description: '客户机收到 ACK 后，使用免费 ARP 探测发现局域网已有主机使用该 IP；客户机发送 DHCPDECLINE 谢绝，并重发 DISCOVER。',
    steps: [
      {
        shortTitle: '1. 收到 ACK 确认',
        phaseName: '收到确认',
        title: '客户机收到服务器 1 发来的 DHCPACK',
        entities: ['client'],
        clientIp: '0.0.0.0',
        packet: null,
        idleText: '📩 收到 DHCPACK，分配 IP 为 192.168.1.100，启动本地免费 ARP 冲突探查...',
        explanation: '客户机收到 ACK，准备进行启用前的最后一道防御。'
      },
      {
        shortTitle: '2. 免费 ARP 发现冲突',
        phaseName: '冲突报警',
        title: '免费 ARP 广播探测，局域网某静态主机应答冲突！',
        entities: ['client'],
        clientIp: '0.0.0.0',
        packet: null,
        idleText: '💥 局域网某主机响应了该 ARP 请求！说明 192.168.1.100 已被占用，发生 IP 冲突！',
        explanation: '免费 ARP 广播后，竟然有主机回复了该 IP 的 MAC 地址，证实该 IP 处于冲突状态。'
      },
      {
        shortTitle: '3. 发送 DHCPDECLINE',
        phaseName: '谢绝租约',
        title: '客户机发送 DHCPDECLINE 报文谢绝该 IP',
        entities: ['client', 'srv1'],
        clientIp: '0.0.0.0',
        packet: {
          name: 'DHCPDECLINE (谢绝)',
          castType: '广播 (Broadcast)',
          typeColor: 'color-red',
          direction: 'c-to-l',
          srcIp: '0.0.0.0',
          srcPort: '68',
          destIp: '255.255.255.255',
          destPort: '67',
          payload: '谢绝 IP 192.168.1.100（告知服务器该 IP 冲突不可用）'
        },
        explanation: '【板书核心考点】客户机通过 DHCPDECLINE 报文告知服务器该 IP 冲突，服务器将该 IP 标记为不可用，客户机重新发 DISCOVER 重新申请。'
      }
    ]
  },
  {
    name: '⑥ 用户主动下线释放 (RELEASE)',
    description: '用户正常关机或断开网络连接，客户机单播发送 DHCPRELEASE 提前释放 IP，服务器将其回收至地址池。',
    steps: [
      {
        shortTitle: '1. 正常运行中',
        phaseName: '在网运行',
        title: '客户机正在使用 192.168.1.100 正常通信',
        entities: ['client'],
        clientIp: '192.168.1.100',
        packet: null,
        idleText: '💻 用户准备关机 / 禁用网卡，准备优雅释放 IP 地址...',
        explanation: '提前释放 IP 可以极大提高有限 IP 地址池的周转利用率。'
      },
      {
        shortTitle: '2. 发送 DHCPRELEASE',
        phaseName: '主动解约',
        title: '客户机单播发送 DHCPRELEASE 释放租约',
        entities: ['client', 'srv1'],
        clientIp: '192.168.1.100',
        packet: {
          name: 'DHCPRELEASE (释放)',
          castType: '单播 (Unicast)',
          typeColor: 'color-blue',
          direction: 'c-to-l',
          srcIp: '192.168.1.100',
          srcPort: '68',
          destIp: '192.168.1.1',
          destPort: '67',
          payload: '释放 192.168.1.100，归还给服务器 1 地址池'
        },
        explanation: '【主动释放考点】客户机向服务器 1 发送 DHCPRELEASE，告知其提前回收该 IP，服务器将此 IP 重新置为可用状态。'
      }
    ]
  }
]

// 计算属性
const currentScenario = computed(() => scenarios[currentScenarioIdx.value])
const currentStep = computed(() => currentScenario.value.steps[currentStepIdx.value])
const activeEntities = computed(() => currentStep.value.entities || [])
const clientCurrentIp = computed(() => currentStep.value.clientIp || '0.0.0.0')

// 控制函数
const switchScenario = (idx) => {
  stopPlay()
  currentScenarioIdx.value = idx
  currentStepIdx.value = 0
}

const jumpToStep = (sIdx) => {
  stopPlay()
  currentStepIdx.value = sIdx
}

const nextStep = () => {
  if (currentStepIdx.value < currentScenario.value.steps.length - 1) {
    currentStepIdx.value++
  } else {
    stopPlay()
  }
}

const prevStep = () => {
  if (currentStepIdx.value > 0) {
    currentStepIdx.value--
  }
}

const resetStep = () => {
  stopPlay()
  currentStepIdx.value = 0
}

const togglePlay = () => {
  if (isPlaying.value) {
    stopPlay()
  } else {
    startPlay()
  }
}

const startPlay = () => {
  isPlaying.value = true
  playTimer = setInterval(() => {
    if (currentStepIdx.value < currentScenario.value.steps.length - 1) {
      currentStepIdx.value++
    } else {
      stopPlay()
    }
  }, 2200)
}

const stopPlay = () => {
  isPlaying.value = false
  if (playTimer) {
    clearInterval(playTimer)
    playTimer = null
  }
}

// 历年真题练习题数据
const quiz1 = reactive({
  userAns: null,
  revealed: false,
  correctAns: 2,
  options: [
    'A. DHCP 报文封装在 UDP 数据报中传输，服务器监听 67 端口，客户机监听 68 端口',
    'B. 客户机向 DHCP 服务器发送 DHCPDISCOVER 报文时，源 IP 为 0.0.0.0，目的 IP 为 255.255.255.255',
    'C. 当租用期过半 (0.5倍) 时，客户机必须以广播方式向局域网所有服务器发送 DHCPREQUEST 请求续约',
    'D. 客户机收到多个服务器的 DHCPOFFER 报文后，通过广播发送 DHCPREQUEST 告知选中的服务器'
  ],
  explanation: 'C 选项错误！当租用期到达 0.5 倍 (T1) 时，客户机已知是哪台服务器分配给自己的 IP，且自己持有有效 IP，因此直接使用【单播】向原 DHCP 服务器发送 DHCPREQUEST 请求续约；只有在 0.875 倍 (T2) 原服务器仍未响应时，才改用【广播】向全网任意服务器求援。因此选 C。'
})

const quiz2 = reactive({
  userAns: null,
  revealed: false,
  correctAns: 1,
  options: [
    'A. ICMP 协议，发送 ICMP 超时报文',
    'B. 免费 ARP (Gratuitous ARP) 协议，发送 DHCPDECLINE 报文',
    'C. 逆地址解析 RARP 协议，发送 DHCPRELEASE 报文',
    'D. DNS 协议，发送 DHCPNACK 报文'
  ],
  explanation: '客户机在收到 DHCPACK 后，不能盲目直接使用该 IP，必须在局域网内发送【免费 ARP (Gratuitous ARP)】报文探查。若有其他主机响应，说明该 IP 发生冲突，客户机向服务器发送【DHCPDECLINE】报文谢绝使用该 IP，并重新广播 DHCPDISCOVER；若无冲突，才正式绑定使用。因此选 B。'
})

const handleQuiz = (quizObj, oIdx) => {
  quizObj.userAns = oIdx
  quizObj.revealed = true
}

// 全局一键展开/折叠广播监听
const onGlobalCollapse = (e) => {
  const expand = e.detail?.expand ?? false
  Object.keys(openSections).forEach(k => {
    openSections[k] = expand
  })
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('cs408-toggle-collapse-all', onGlobalCollapse)
    if (typeof localStorage !== 'undefined') {
      const pref = localStorage.getItem('cs408-collapse-all-pref')
      if (pref === 'expand') {
        Object.keys(openSections).forEach(k => { openSections[k] = true })
      } else if (pref === 'collapse') {
        Object.keys(openSections).forEach(k => { openSections[k] = false })
      }
    }
  }
})

onUnmounted(() => {
  stopPlay()
  if (typeof window !== 'undefined') {
    window.removeEventListener('cs408-toggle-collapse-all', onGlobalCollapse)
  }
})
</script>

<style scoped>
.dhcp-sim-container {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 顶部横幅 */
.dhcp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 10px 14px;
  flex-wrap: wrap;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.header-title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.badge-blue {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.3);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.badge-green {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.badge-amber {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.rule-tag {
  font-size: 11px;
  color: #0369a1;
  background: rgba(2, 132, 199, 0.08);
  border: 1px dashed rgba(2, 132, 199, 0.35);
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: bold;
}

/* 折叠卡片 */
.collapsible-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--vp-c-bg);
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid var(--vp-c-border);
  flex-wrap: wrap;
  gap: 8px;
}

.card-header:hover {
  background: rgba(37, 99, 235, 0.04);
}

.header-title-box {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.card-icon {
  font-size: 16px;
}

.toggle-btn {
  background: transparent;
  border: none;
  font-size: 11px;
  font-weight: bold;
  color: #2563eb;
  cursor: pointer;
}

.card-body {
  padding: 14px;
}

/* 1:1 矢量板书 SVG 样式 */
.svg-board-wrapper {
  overflow-x: auto;
  display: flex;
  justify-content: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 8px;
}

.board-svg {
  width: 100%;
  max-width: 1080px;
  height: auto;
  font-family: inherit;
  display: block;
}

/* 模拟器 Tabs */
.scenario-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.tab-btn {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #2563eb;
  border-color: #93c5fd;
}

.tab-btn.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.scenario-desc-box {
  background: var(--vp-c-bg);
  border-left: 3px solid #2563eb;
  padding: 8px 12px;
  border-radius: 0 6px 6px 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 14px;
  line-height: 1.5;
}

/* 步骤进度指示器 */
.steps-progress-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.step-node {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  color: var(--vp-c-text-3);
}

.step-node:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.step-node .step-num {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-border);
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 900;
}

.step-node.active {
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.08);
  color: #2563eb;
  font-weight: 800;
}

.step-node.active .step-num {
  background: #2563eb;
  color: #ffffff;
}

.step-node.passed {
  border-color: #10b981;
  color: #059669;
}

.step-node.passed .step-num {
  background: #10b981;
  color: #ffffff;
}

/* 报文视窗动画 */
.anim-viewport {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 18px 14px;
  margin-bottom: 14px;
  min-height: 100px;
  gap: 10px;
}

.node-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
  min-width: 120px;
  transition: all 0.25s;
}

.node-box.highlight {
  border-color: #2563eb;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.2);
  transform: translateY(-2px);
}

.node-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.node-name {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.node-detail {
  font-size: 10px;
  color: var(--vp-c-text-3);
  font-family: monospace;
}

.traffic-channel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 48px;
}

.packet-bubble {
  padding: 6px 12px;
  border-radius: 6px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  animation: pulseBubble 1.2s infinite ease-in-out;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

@keyframes pulseBubble {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

.packet-name {
  font-size: 11.5px;
  font-weight: 900;
}

.packet-cast {
  font-size: 9.5px;
  opacity: 0.9;
}

.color-blue { background: #0284c7; }
.color-green { background: #059669; }
.color-purple { background: #7c3aed; }
.color-amber { background: #d97706; }
.color-red { background: #dc2626; }

.packet-idle {
  color: var(--vp-c-text-3);
  font-size: 11.5px;
  font-style: italic;
  text-align: center;
}

/* 控制按钮栏 */
.sim-controls {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.ctrl-btn {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s;
}

.ctrl-btn:hover:not(:disabled) {
  border-color: #2563eb;
  color: #2563eb;
}

.ctrl-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ctrl-btn.primary {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.ctrl-btn.primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.ctrl-btn.outline {
  border-style: dashed;
}

/* 步骤详情卡片 */
.step-detail-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 12px 14px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.detail-badge {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  font-size: 10.5px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}

.detail-title {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.packet-fields-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.field-label {
  font-size: 10.5px;
  color: var(--vp-c-text-3);
  font-weight: bold;
}

.field-val {
  font-size: 11.5px;
  color: var(--vp-c-text-1);
}

.font-mono {
  font-family: monospace;
}

.highlight-bold {
  font-weight: 800;
  color: #2563eb;
}

.explanation-box {
  border-top: 1px dashed var(--vp-c-border);
  padding-top: 8px;
}

.tip-title {
  font-size: 11.5px;
  font-weight: 800;
  color: #d97706;
  margin-bottom: 4px;
}

.tip-content {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

/* 表格通用样式 */
.table-caption {
  margin: 10px 0 8px 0;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.table-wrapper {
  overflow-x: auto;
}

.dhcp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11.5px;
  text-align: left;
}

.dhcp-table th,
.dhcp-table td {
  padding: 8px 10px;
  border: 1px solid var(--vp-c-border);
}

.dhcp-table th {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-weight: 800;
}

.dhcp-table td {
  color: var(--vp-c-text-2);
}

.dhcp-table td code {
  font-size: 11px;
  padding: 1px 4px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  color: #2563eb;
}

/* 真题测验 */
.quiz-item {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 12px;
}

.quiz-stem {
  font-size: 12.5px;
  color: var(--vp-c-text-1);
  line-height: 1.6;
  margin-bottom: 10px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.opt-btn {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.opt-btn:hover {
  border-color: #2563eb;
  color: var(--vp-c-text-1);
}

.opt-btn.selected {
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.08);
}

.opt-btn.correct {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  font-weight: bold;
}

.opt-btn.wrong {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}

.quiz-feedback {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
}

.feedback-title {
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 4px;
}

.feedback-desc {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .anim-viewport {
    flex-direction: column;
    gap: 12px;
  }
  .traffic-channel {
    min-height: 40px;
  }
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
