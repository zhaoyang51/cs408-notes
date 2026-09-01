<template>
  <div class="tcp-cm-container">
    
    <!-- 顶部标题横幅 -->
    <div class="cm-header">
      <div class="header-left">
        <span class="badge-emerald">🤝 TCP 运输连接管理</span>
        <h4 class="header-title">TCP 使用“三报文握手”建立连接 ➔ 全双工数据传输 ➔ “四报文挥手”释放连接</h4>
      </div>
      <div class="rule-tag">
        核心规律：SYN / FIN 报文段不带数据但必消耗 1 个序号（ack = seq + 1）
      </div>
    </div>

    <!-- 1. 三报文握手建立连接全景图 (SVG 矢量高保真重绘) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('handshake')">
        <div class="header-title-box">
          <span class="card-icon">🤝</span>
          <strong>一、TCP 使用“三报文握手”建立连接（状态变迁与时序全景图）</strong>
          <span class="badge-blue">三报文握手</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.handshake ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.handshake" class="card-body">
        <div class="diagram-wrapper">
          <svg viewBox="0 0 960 480" class="tcp-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- 箭头标记 -->
              <marker id="tcp-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <polygon points="0 1, 8 4, 0 7" fill="#334155" />
              </marker>
              <marker id="curve-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <polygon points="0 1, 7 3.5, 0 6" fill="#475569" />
              </marker>
            </defs>

            <!-- 顶部标题 -->
            <rect x="30" y="16" width="16" height="16" fill="#475569" />
            <text x="56" y="30" font-size="16" font-weight="bold" fill="var(--vp-c-text-1)">TCP使用 “三报文握手” 建立连接</text>

            <!-- ══ 左侧：TCP 客户主机 ══ -->
            <g transform="translate(200, 38)">
              <!-- 电脑外框 -->
              <rect x="-50" y="0" width="100" height="34" rx="4" fill="#ffffff" stroke="#059669" stroke-width="2.5"/>
              <text x="0" y="15" font-size="12" font-weight="bold" text-anchor="middle" fill="#0f766e">TCP</text>
              <text x="0" y="29" font-size="13" font-weight="bold" text-anchor="middle" fill="#0f766e">客户</text>
              <!-- 屏幕支架与底座 -->
              <rect x="-8" y="34" width="16" height="6" fill="#059669"/>
              <rect x="-24" y="40" width="48" height="4" rx="2" fill="#059669"/>
            </g>

            <!-- 客户「主动打开」曲线箭头 -->
            <path d="M 150,56 L 65,56 L 65,115 L 138,115" fill="none" stroke="#475569" stroke-width="2" marker-end="url(#curve-arrow)"/>
            <text x="85" y="98" font-size="14" font-weight="bold" fill="var(--vp-c-text-1)">主动打开</text>
            <text x="5" y="160" font-size="13.5" font-weight="bold" fill="#dc2626">发送TCP连接请求</text>
            <text x="5" y="380" font-size="13" font-weight="bold" fill="#059669">发送针对TCP连接请</text>
            <text x="5" y="400" font-size="13" font-weight="bold" fill="#059669">求的确认的确认</text>

            <!-- 客户垂直状态柱 (x: 140, 宽: 120) -->
            <!-- 1. CLOSED -->
            <rect x="140" y="85" width="120" height="55" fill="#000000"/>
            <text x="200" y="108" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">CLOSED</text>
            <text x="200" y="127" font-size="12" fill="#e2e8f0" text-anchor="middle">关闭</text>

            <!-- 2. SYN-SENT -->
            <rect x="140" y="140" width="120" height="150" fill="#b91c1c"/>
            <text x="200" y="210" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">SYN-SENT</text>
            <text x="200" y="232" font-size="12.5" fill="#fecaca" text-anchor="middle">同步已发送</text>

            <!-- 3. ESTABLISHED -->
            <rect x="140" y="290" width="120" height="150" fill="#0d9488"/>
            <text x="200" y="360" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">ESTABLISHED</text>
            <text x="200" y="382" font-size="12.5" fill="#ccfbf1" text-anchor="middle">连接已建立</text>

            <!-- ══ 右侧：TCP 服务器主机 ══ -->
            <g transform="translate(760, 38)">
              <!-- 电脑外框 -->
              <rect x="-50" y="0" width="100" height="34" rx="4" fill="#ffffff" stroke="#059669" stroke-width="2.5"/>
              <text x="0" y="15" font-size="12" font-weight="bold" text-anchor="middle" fill="#0f766e">TCP</text>
              <text x="0" y="29" font-size="13" font-weight="bold" text-anchor="middle" fill="#0f766e">服务器</text>
              <!-- 屏幕支架与底座 -->
              <rect x="-8" y="34" width="16" height="6" fill="#059669"/>
              <rect x="-24" y="40" width="48" height="4" rx="2" fill="#059669"/>
            </g>

            <!-- 服务器「被动打开」曲线箭头 -->
            <path d="M 810,56 L 895,56 L 895,115 L 822,115" fill="none" stroke="#475569" stroke-width="2" marker-end="url(#curve-arrow)"/>
            <text x="828" y="98" font-size="14" font-weight="bold" fill="var(--vp-c-text-1)">被动打开</text>
            <text x="822" y="260" font-size="13" font-weight="bold" fill="#7c3aed">发送针对TCP连接请求</text>
            <text x="822" y="280" font-size="13" font-weight="bold" fill="#7c3aed">的确认</text>

            <!-- 服务器垂直状态柱 (x: 700, 宽: 120) -->
            <!-- 1. CLOSED -->
            <rect x="700" y="85" width="120" height="55" fill="#000000"/>
            <text x="760" y="108" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">CLOSED</text>
            <text x="760" y="127" font-size="12" fill="#e2e8f0" text-anchor="middle">关闭</text>

            <!-- 2. LISTEN -->
            <rect x="700" y="140" width="120" height="75" fill="#0284c7"/>
            <text x="760" y="172" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">LISTEN</text>
            <text x="760" y="193" font-size="12.5" fill="#e0f2fe" text-anchor="middle">监听</text>

            <!-- 3. SYN-RCVD -->
            <rect x="700" y="215" width="120" height="135" fill="#7c3aed"/>
            <text x="760" y="275" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">SYN-RCVD</text>
            <text x="760" y="297" font-size="12.5" fill="#ede9fe" text-anchor="middle">同步已接收</text>

            <!-- 4. ESTABLISHED -->
            <rect x="700" y="350" width="120" height="90" fill="#0d9488"/>
            <text x="760" y="392" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">ESTABLISHED</text>
            <text x="760" y="414" font-size="12.5" fill="#ccfbf1" text-anchor="middle">连接已建立</text>

            <!-- ══ 报文段交互斜向箭头与参数 ══ -->
            <!-- 第 1 次握手: 客户 -> 服务器 -->
            <line x1="260" y1="140" x2="695" y2="215" stroke="#334155" stroke-width="2" marker-end="url(#tcp-arrow)"/>
            <g transform="translate(480, 160) rotate(10)">
              <text x="0" y="-8" font-size="14" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                SYN=1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; seq=x
              </text>
            </g>

            <!-- 第 2 次握手: 服务器 -> 客户 -->
            <line x1="700" y1="215" x2="265" y2="290" stroke="#334155" stroke-width="2" marker-end="url(#tcp-arrow)"/>
            <g transform="translate(480, 240) rotate(-10)">
              <text x="0" y="-8" font-size="14" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                SYN=1 &nbsp;&nbsp; ACK=1 &nbsp;&nbsp; seq=y &nbsp;&nbsp; ack=x+1
              </text>
            </g>

            <!-- 第 3 次握手: 客户 -> 服务器 -->
            <line x1="260" y1="290" x2="695" y2="350" stroke="#334155" stroke-width="2" marker-end="url(#tcp-arrow)"/>
            <g transform="translate(480, 310) rotate(8)">
              <text x="0" y="-8" font-size="14" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                ACK=1 &nbsp;&nbsp;&nbsp;&nbsp; seq=x+1 &nbsp;&nbsp;&nbsp;&nbsp; ack=y+1
              </text>
            </g>

            <!-- ══ 底部数据传输通道 ══ -->
            <g transform="translate(260, 375)">
              <polygon points="
                0,22  30,0  30,12  
                410,12  410,0  440,22  
                410,44  410,32  30,32  30,44" 
                fill="#ffffff" stroke="#475569" stroke-width="2"/>
              <text x="220" y="28" font-size="15" font-weight="bold" fill="#0d9488" text-anchor="middle">数据传输</text>
            </g>

          </svg>
        </div>
      </div>
    </div>

    <!-- 2. 【2011 年 统考题 39】真题精析卡片 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam39')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>【2011 年 统考题 39】TCP 连接建立报文段控制位与序号真题精解</strong>
          <span class="badge-green">真题演练</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam39 ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam39" class="card-body">
        <div class="exam-question">
          主机甲与主机乙之间已建立一个 TCP 连接，双方持续有数据传输，且 Host 甲已发送了序号为 <code>seq = 11220</code>、长度为 <code>0</code> 的控制报文段（含 SYN 标志）。若 Host 乙对该报文段进行确认，并在该报文段中携带自己的同步序号 <code>seq = 20000</code>，则 Host 乙发送的确认报文段中，<code>SYN</code>、<code>ACK</code> 标志位和确认号 <code>ack</code> 字段的取值应分别为（&nbsp;&nbsp;&nbsp;&nbsp;）。
        </div>

        <div class="quiz-interactive-box">
          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': quizConn.userAns === opt,
                'opt-correct': quizConn.revealed && opt === 'C',
                'opt-wrong': quizConn.revealed && quizConn.userAns === opt && opt !== 'C'
              }"
              @click="handleQuizConn(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'">SYN=0, ACK=0, ack=11220</span>
                <span v-else-if="opt === 'B'">SYN=1, ACK=0, ack=11220</span>
                <span v-else-if="opt === 'C'">SYN=1, ACK=1, ack=11221</span>
                <span v-else-if="opt === 'D'">SYN=1, ACK=1, ack=11220</span>
              </div>
              <span v-if="quizConn.revealed && opt === 'C'" class="correct-badge">✔ 正确答案</span>
              <span v-else-if="quizConn.revealed && quizConn.userAns === opt && opt !== 'C'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="quizConn.revealed = !quizConn.revealed">
              {{ quizConn.revealed ? '🔒 隐藏答案与解析' : '💡 点击查看答案与深度解析' }}
            </button>
            <button v-if="quizConn.userAns || quizConn.revealed" class="quiz-btn btn-reset" type="button" @click="resetQuizConn">
              🔄 重新作答
            </button>
          </div>
        </div>

        <div v-show="quizConn.revealed" class="exam-analysis">
          <div class="analysis-title">🔍 核心推导步骤（推导过程）：</div>
          <ol class="analysis-list">
            <li><strong>确认号计算</strong>：SYN 报文段即使不携带应用层数据，也<strong>强制消耗 1 个序列号</strong>。因此乙回复的确认号为 <code>ack = seq + 1 = 11220 + 1 = 11221</code>。</li>
            <li><strong>控制标志位判定</strong>：乙发送的是第二次握手（SYN+ACK 报文段），既用于同步自己的初始序号（<code>SYN = 1</code>），又用于确认甲的报文（<code>ACK = 1</code>）。</li>
            <li><strong>结论</strong>：<code>SYN = 1, ACK = 1, ack = 11221</code>，正确答案选 <strong>C</strong>。</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- 3. 四报文挥手释放连接全景图 (SVG 矢量高保真重绘) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('wave')">
        <div class="header-title-box">
          <span class="card-icon">🚪</span>
          <strong>二、TCP 通过“四报文挥手”来释放连接（状态变迁与时序全景图）</strong>
          <span class="badge-red">四报文挥手</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.wave ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.wave" class="card-body">
        <div class="diagram-wrapper">
          <svg viewBox="0 0 960 580" class="tcp-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="wave-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <polygon points="0 1, 8 4, 0 7" fill="#334155" />
              </marker>
              <marker id="wave-curve-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <polygon points="0 1, 7 3.5, 0 6" fill="#475569" />
              </marker>
            </defs>

            <!-- 顶部标题 -->
            <rect x="30" y="14" width="16" height="16" fill="#475569" />
            <text x="56" y="28" font-size="16" font-weight="bold" fill="var(--vp-c-text-1)">TCP通过 “四报文挥手” 来释放连接</text>

            <!-- ══ 顶部全双工数据传输通道 ══ -->
            <g transform="translate(260, 60)">
              <polygon points="
                0,16  24,0  24,9  
                416,9  416,0  440,16  
                416,32  416,23  24,23  24,32" 
                fill="#ffffff" stroke="#475569" stroke-width="1.8"/>
              <text x="220" y="21" font-size="13" font-weight="bold" fill="#0d9488" text-anchor="middle">数据传输</text>
            </g>

            <!-- ══ 左侧：TCP 客户主机 ══ -->
            <g transform="translate(200, 30)">
              <!-- 电脑外框 -->
              <rect x="-50" y="0" width="100" height="32" rx="4" fill="#ffffff" stroke="#059669" stroke-width="2.5"/>
              <text x="0" y="14" font-size="12" font-weight="bold" text-anchor="middle" fill="#0f766e">TCP</text>
              <text x="0" y="27" font-size="13" font-weight="bold" text-anchor="middle" fill="#0f766e">客户</text>
              <rect x="-8" y="32" width="16" height="5" fill="#059669"/>
              <rect x="-24" y="37" width="48" height="4" rx="2" fill="#059669"/>
            </g>

            <!-- 客户「主动关闭」曲线箭头 -->
            <path d="M 150,46 L 65,46 L 65,95 L 138,95" fill="none" stroke="#475569" stroke-width="2" marker-end="url(#wave-curve-arrow)"/>
            <text x="85" y="80" font-size="14" font-weight="bold" fill="var(--vp-c-text-1)">主动关闭</text>
            <text x="5" y="130" font-size="13.5" font-weight="bold" fill="#0284c7">发送TCP</text>
            <text x="5" y="150" font-size="13.5" font-weight="bold" fill="#0284c7">连接释放</text>

            <text x="5" y="420" font-size="13.5" font-weight="bold" fill="#db2777">发送TCP</text>
            <text x="5" y="440" font-size="13.5" font-weight="bold" fill="#db2777">普通确认</text>
            
            <!-- 等待 2MSL 虚线圆标 -->
            <g transform="translate(105, 428)">
              <ellipse cx="0" cy="0" rx="28" ry="16" fill="#fdf2f8" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3,3"/>
              <text x="0" y="-2" font-size="10.5" fill="#e11d48" font-weight="bold" text-anchor="middle">等待</text>
              <text x="0" y="11" font-size="11" fill="#e11d48" font-weight="bold" text-anchor="middle">2MSL</text>
            </g>

            <!-- 客户垂直状态柱 (x: 140, 宽: 120) -->
            <!-- 1. ESTABLISHED -->
            <rect x="140" y="65" width="120" height="45" fill="#0d9488"/>
            <text x="200" y="84" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">ESTABLISHED</text>
            <text x="200" y="99" font-size="11" fill="#ccfbf1" text-anchor="middle">连接已建立</text>

            <!-- 2. FIN-WAIT-1 -->
            <rect x="140" y="110" width="120" height="85" fill="#0284c7"/>
            <text x="200" y="148" font-size="13.5" font-weight="bold" fill="#ffffff" text-anchor="middle">FIN-WAIT-1</text>
            <text x="200" y="168" font-size="12" fill="#e0f2fe" text-anchor="middle">终止等待1</text>

            <!-- 3. FIN-WAIT-2 -->
            <rect x="140" y="195" width="120" height="100" fill="#1d4ed8"/>
            <text x="200" y="240" font-size="13.5" font-weight="bold" fill="#ffffff" text-anchor="middle">FIN-WAIT-2</text>
            <text x="200" y="260" font-size="12" fill="#dbeafe" text-anchor="middle">终止等待2</text>

            <!-- 4. TIME-WAIT -->
            <rect x="140" y="295" width="120" height="110" fill="#db2777"/>
            <text x="200" y="345" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">TIME-WAIT</text>
            <text x="200" y="367" font-size="12.5" fill="#fce7f3" text-anchor="middle">时间等待</text>

            <!-- 5. CLOSED -->
            <rect x="140" y="405" width="120" height="50" fill="#000000"/>
            <text x="200" y="428" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">CLOSED</text>
            <text x="200" y="445" font-size="11.5" fill="#e2e8f0" text-anchor="middle">关闭</text>

            <!-- ══ 右侧：TCP 服务器主机 ══ -->
            <g transform="translate(760, 30)">
              <rect x="-50" y="0" width="100" height="32" rx="4" fill="#ffffff" stroke="#059669" stroke-width="2.5"/>
              <text x="0" y="14" font-size="12" font-weight="bold" text-anchor="middle" fill="#0f766e">TCP</text>
              <text x="0" y="27" font-size="13" font-weight="bold" text-anchor="middle" fill="#0f766e">服务器</text>
              <rect x="-8" y="32" width="16" height="5" fill="#059669"/>
              <rect x="-24" y="37" width="48" height="4" rx="2" fill="#059669"/>
            </g>

            <!-- 服务器「被动关闭」与「通知应用进程」 -->
            <path d="M 810,46 L 895,46 L 895,95 L 822,95" fill="none" stroke="#475569" stroke-width="2" marker-end="url(#wave-curve-arrow)"/>
            <text x="835" y="80" font-size="14" font-weight="bold" fill="var(--vp-c-text-1)">被动关闭</text>
            
            <!-- 虚线向上箭头通知应用进程 -->
            <path d="M 830,130 C 850,110 850,75 805,52" fill="none" stroke="#475569" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#wave-curve-arrow)"/>
            <text x="850" y="95" font-size="12.5" font-weight="bold" fill="var(--vp-c-text-1)">通知</text>
            <text x="850" y="112" font-size="12.5" font-weight="bold" fill="var(--vp-c-text-1)">应用</text>
            <text x="850" y="130" font-size="12.5" font-weight="bold" fill="var(--vp-c-text-1)">进程</text>

            <text x="825" y="195" font-size="13.5" font-weight="bold" fill="#7c3aed">发送TCP</text>
            <text x="825" y="215" font-size="13.5" font-weight="bold" fill="#7c3aed">普通确认</text>

            <text x="825" y="335" font-size="13.5" font-weight="bold" fill="#dc2626">发送TCP</text>
            <text x="825" y="355" font-size="13.5" font-weight="bold" fill="#dc2626">连接释放</text>

            <!-- 服务器垂直状态柱 (x: 700, 宽: 120) -->
            <!-- 1. ESTABLISHED -->
            <rect x="700" y="65" width="120" height="45" fill="#0d9488"/>
            <text x="760" y="84" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">ESTABLISHED</text>
            <text x="760" y="99" font-size="11" fill="#ccfbf1" text-anchor="middle">连接已建立</text>

            <!-- 2. CLOSE-WAIT -->
            <rect x="700" y="110" width="120" height="150" fill="#7c3aed"/>
            <text x="760" y="180" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">CLOSE-WAIT</text>
            <text x="760" y="202" font-size="12.5" fill="#ede9fe" text-anchor="middle">关闭等待</text>

            <!-- 3. LAST-ACK -->
            <rect x="700" y="260" width="120" height="105" fill="#b91c1c"/>
            <text x="760" y="308" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">LAST-ACK</text>
            <text x="760" y="328" font-size="12.5" fill="#fecaca" text-anchor="middle">最后确认</text>

            <!-- 4. CLOSED -->
            <rect x="700" y="365" width="120" height="90" fill="#000000"/>
            <text x="760" y="405" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">CLOSED</text>
            <text x="760" y="425" font-size="12" fill="#e2e8f0" text-anchor="middle">关闭</text>

            <!-- ══ 报文段交互斜向箭头与参数 ══ -->
            <!-- 挥手 1: 客户 -> 服务器 -->
            <line x1="260" y1="110" x2="695" y2="155" stroke="#334155" stroke-width="2" marker-end="url(#wave-arrow)"/>
            <g transform="translate(480, 125) rotate(6)">
              <text x="0" y="-8" font-size="13.5" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                FIN=1 &nbsp;&nbsp; ACK=1 &nbsp;&nbsp; seq=u &nbsp;&nbsp; ack=v
              </text>
            </g>

            <!-- 挥手 2: 服务器 -> 客户 -->
            <line x1="700" y1="155" x2="265" y2="200" stroke="#334155" stroke-width="2" marker-end="url(#wave-arrow)"/>
            <g transform="translate(480, 170) rotate(-6)">
              <text x="0" y="-8" font-size="13.5" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                ACK=1 &nbsp;&nbsp;&nbsp;&nbsp; seq=v &nbsp;&nbsp;&nbsp;&nbsp; ack=u+1
              </text>
            </g>

            <!-- 中间单向数据传输通道 (服务器 -> 客户) -->
            <g transform="translate(520, 218)">
              <polygon points="
                0,16  20,0  20,8  
                140,8  140,24  20,24  20,32" 
                fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
              <text x="80" y="21" font-size="13" font-weight="bold" fill="#7c3aed" text-anchor="middle">数据传输</text>
            </g>

            <!-- 挥手 3: 服务器 -> 客户 -->
            <line x1="700" y1="260" x2="265" y2="305" stroke="#334155" stroke-width="2" marker-end="url(#wave-arrow)"/>
            <g transform="translate(480, 275) rotate(-6)">
              <text x="0" y="-8" font-size="13.5" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                FIN=1 &nbsp;&nbsp; ACK=1 &nbsp;&nbsp; seq=w &nbsp;&nbsp; ack=u+1
              </text>
            </g>

            <!-- 挥手 4: 客户 -> 服务器 -->
            <line x1="260" y1="305" x2="695" y2="365" stroke="#334155" stroke-width="2" marker-end="url(#wave-arrow)"/>
            <g transform="translate(480, 328) rotate(8)">
              <text x="0" y="-8" font-size="13.5" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                ACK=1 &nbsp;&nbsp;&nbsp;&nbsp; seq=u+1 &nbsp;&nbsp;&nbsp;&nbsp; ack=w+1
              </text>
            </g>

            <!-- ══ 底部 MSL 说明注脚 ══ -->
            <text x="480" y="535" font-size="14" font-weight="bold" fill="#dc2626" text-anchor="middle">
              MSL(Maximum Segment Lifetime)意思是最长报文段寿命，RFC793建议为2分钟。
            </text>

          </svg>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'

const openSections = reactive({
  handshake: true,
  exam39: true,
  wave: true
})

const toggle = (sec) => {
  openSections[sec] = !openSections[sec]
}

const quizConn = reactive({ userAns: null, revealed: false })
const handleQuizConn = (opt) => {
  quizConn.userAns = opt
  quizConn.revealed = true
}
const resetQuizConn = () => {
  quizConn.userAns = null
  quizConn.revealed = false
}

// 全局一键收起/展开监听
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
  if (typeof window !== 'undefined') {
    window.removeEventListener('cs408-toggle-collapse-all', onGlobalCollapse)
  }
})
</script>

<style scoped>
.tcp-cm-container {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 14px 18px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  box-shadow: var(--card-shadow);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.badge-emerald {
  font-size: 11px;
  font-weight: 800;
  color: #059669;
  background: rgba(5, 150, 105, 0.12);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.rule-tag {
  font-size: 12px;
  font-weight: 600;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(2, 132, 199, 0.25);
}

.collapsible-card {
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-elv);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: border-color 0.2s ease;
}

.collapsible-card:hover {
  border-color: var(--vp-c-brand-1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid var(--vp-c-divider);
}

.header-title-box {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.badge-blue {
  font-size: 11px;
  font-weight: 700;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.badge-red {
  font-size: 11px;
  font-weight: 700;
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.badge-green {
  font-size: 11px;
  font-weight: 700;
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.toggle-btn {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: transparent;
  border: none;
  cursor: pointer;
}

.card-body {
  padding: 18px;
}

.diagram-wrapper {
  width: 100%;
  overflow-x: auto;
}

.tcp-svg {
  width: 100%;
  min-width: 860px;
  height: auto;
  display: block;
}

/* 考试刷题框样式 */
.exam-question {
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  margin-bottom: 14px;
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border-left: 3px solid #059669;
}

.quiz-interactive-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exam-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.opt-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13.5px;
}

.opt-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
}

.opt-selected {
  border-color: var(--vp-c-brand-1);
  background: rgba(37, 99, 235, 0.08);
}

.opt-correct {
  border-color: #059669 !important;
  background: rgba(5, 150, 105, 0.12) !important;
}

.opt-wrong {
  border-color: #dc2626 !important;
  background: rgba(220, 38, 38, 0.12) !important;
}

.opt-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.opt-letter {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.correct-badge {
  font-size: 11px;
  font-weight: 700;
  color: #059669;
}

.wrong-badge {
  font-size: 11px;
  font-weight: 700;
  color: #dc2626;
}

.quiz-action-bar {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.quiz-btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-toggle {
  background: rgba(37, 99, 235, 0.1);
  color: var(--vp-c-brand-1);
  border: 1px solid rgba(37, 99, 235, 0.25);
}

.btn-toggle:hover {
  background: var(--vp-c-brand-1);
  color: #ffffff;
}

.btn-reset {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-border);
}

.btn-reset:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-2);
}

.exam-analysis {
  margin-top: 14px;
  padding: 14px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-border);
  border-radius: 8px;
}

.analysis-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.analysis-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.75;
  color: var(--vp-c-text-2);
}
</style>
