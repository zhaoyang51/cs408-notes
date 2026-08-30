<template>
  <div class="csmaca-container">
    <!-- 顶部横幅 -->
    <div class="sim-header">
      <div class="header-left">
        <span class="badge-blue">📡 IEEE 802.11 无线网络</span>
        <h4 class="header-title">CSMA/CA 碰撞避免机制、帧间间隔 (IFS)、NAV 预约与 802.11 MAC 帧地址全景</h4>
      </div>
      <div class="formula-tag">
        核心考点：SIFS &lt; PIFS &lt; DIFS ➔ NAV = SIFS + <i>t</i><sub>DATA</sub> + SIFS + <i>t</i><sub>ACK</sub> ➔ 地址 1=RA, 地址 2=TA
      </div>
    </div>

    <!-- 1. 核心时序图解 (含 NAV 网络分配向量与 IFS 标注) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('diagram')">
        <div class="header-title-box">
          <span class="card-icon">📐</span>
          <strong>CSMA/CA 完整预约与传输时序图 (RTS ➔ CTS ➔ DATA ➔ ACK 与 NAV 机制)</strong>
          <span class="badge-blue">时序模型</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.diagram ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.diagram" class="card-body">
        <div class="diagram-wrapper">
          <svg viewBox="0 0 920 370" class="sim-svg">
            <defs>
              <linearGradient id="rtsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.95" />
              </linearGradient>
              <linearGradient id="ctsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#34d399" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#059669" stop-opacity="0.95" />
              </linearGradient>
              <linearGradient id="dataGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#2563eb" stop-opacity="0.95" />
              </linearGradient>
              <linearGradient id="ackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.9" />
                <stop offset="100%" stop-color="#047857" stop-opacity="0.95" />
              </linearGradient>
              <marker id="ca-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#64748b" />
              </marker>
            </defs>

            <!-- 实体头部图标与标签 -->
            <!-- 发送主机 H (源端) -->
            <g transform="translate(140, 15)">
              <rect x="-40" y="0" width="80" height="26" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="0" y="18" font-size="12" font-weight="bold" text-anchor="middle" fill="#0284c7">💻 源主机 A/H</text>
            </g>

            <!-- 接收接入点 AP (目的端) -->
            <g transform="translate(480, 15)">
              <rect x="-40" y="0" width="80" height="26" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="0" y="18" font-size="12" font-weight="bold" text-anchor="middle" fill="#059669">📡 接入点 AP</text>
            </g>

            <!-- 隐藏站 B / 其他站 -->
            <g transform="translate(680, 15)">
              <rect x="-40" y="0" width="80" height="26" rx="4" fill="#fff1f2" stroke="#fecdd3" stroke-width="1.2"/>
              <text x="0" y="18" font-size="12" font-weight="bold" text-anchor="middle" fill="#e11d48">👤 隐藏站 B</text>
            </g>

            <!-- 垂直时间轴 -->
            <line x1="140" y1="48" x2="140" y2="330" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#ca-arrow)"/>
            <line x1="480" y1="48" x2="480" y2="330" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#ca-arrow)"/>
            <line x1="680" y1="48" x2="680" y2="330" stroke="#f43f5e" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#ca-arrow)"/>
            <text x="125" y="345" font-size="12" font-weight="bold" fill="#64748b">时间 t</text>
            <text x="465" y="345" font-size="12" font-weight="bold" fill="#64748b">时间 t</text>
            <text x="665" y="345" font-size="12" font-weight="bold" fill="#e11d48">时间 t</text>

            <!-- 1. IFS1: DIFS 帧间隙 (最长) -->
            <line x1="120" y1="52" x2="120" y2="82" stroke="#d97706" stroke-width="2.5"/>
            <text x="65" y="70" font-size="11" font-weight="bold" fill="#d97706">IFS1 (DIFS)</text>
            <text x="50" y="85" font-size="10" fill="#92400e">【最长帧间隙】</text>

            <!-- RTS 帧 (H -> AP) -->
            <polygon points="140,82 140,96 480,118 480,104" fill="url(#rtsGrad)" stroke="#0284c7" stroke-width="1"/>
            <text x="310" y="104" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">RTS (请求发送，含预约时长)</text>

            <!-- 2. IFS2: SIFS (AP 发送 CTS 前等待) -->
            <line x1="500" y1="118" x2="500" y2="136" stroke="#059669" stroke-width="2.5"/>
            <text x="510" y="130" font-size="11" font-weight="bold" fill="#059669">IFS2 (SIFS)</text>

            <!-- CTS 帧 (AP 广播给所有站) -->
            <polygon points="480,136 480,150 140,172 140,158" fill="url(#ctsGrad)" stroke="#059669" stroke-width="1"/>
            <polygon points="480,136 480,150 680,163 680,149" fill="url(#ctsGrad)" stroke="#059669" stroke-width="1" opacity="0.6"/>
            <text x="310" y="158" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">CTS (允许发送，广播给所有站)</text>

            <!-- 隐藏站 B 设置 NAV 虚拟载波监听区域 -->
            <rect x="670" y="163" width="20" height="152" rx="4" fill="rgba(244, 63, 94, 0.2)" stroke="#f43f5e" stroke-dasharray="3,3"/>
            <text x="700" y="240" font-size="11.5" font-weight="bold" fill="#e11d48">NAV 静默期 (网络分配向量)</text>
            <text x="700" y="258" font-size="10.5" fill="#e11d48">NAV = SIFS + t_DATA + SIFS + t_ACK</text>

            <!-- 3. IFS3: SIFS (H 发送 DATA 前等待) -->
            <line x1="120" y1="172" x2="120" y2="190" stroke="#059669" stroke-width="2.5"/>
            <text x="55" y="184" font-size="11" font-weight="bold" fill="#059669">IFS3 (SIFS)</text>

            <!-- DATA 数据帧 (H -> AP) -->
            <polygon points="140,190 140,245 480,267 480,212" fill="url(#dataGrad)" stroke="#2563eb" stroke-width="1"/>
            <text x="310" y="235" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">DATA 数据帧 (传输时延 t_data = L / C)</text>

            <!-- 4. IFS4: SIFS (AP 发送 ACK 前等待) -->
            <line x1="500" y1="267" x2="500" y2="285" stroke="#059669" stroke-width="2.5"/>
            <text x="510" y="279" font-size="11" font-weight="bold" fill="#059669">IFS4 (SIFS)</text>

            <!-- ACK 确认帧 (AP -> H) -->
            <polygon points="480,285 480,299 140,321 140,307" fill="url(#ackGrad)" stroke="#047857" stroke-width="1"/>
            <text x="310" y="306" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">ACK 确认帧 (802.11 必须显式确认)</text>
          </svg>
        </div>

        <!-- 4 大核心机制速查卡片 -->
        <div class="info-cards-grid">
          <div class="info-card">
            <div class="ic-header">
              <span class="ic-badge">考点 1</span>
              <strong>帧间间隔 (IFS) 优先级</strong>
            </div>
            <div class="ic-body">
              <p>• <strong>SIFS (短帧间隙)</strong>：最短，用于 CTS、ACK 及连续 DATA；</p>
              <p>• <strong>PIFS (点协调间隙)</strong>：中等，用于 AP 集中轮询；</p>
              <p>• <strong>DIFS (分布式间隙)</strong>：<strong>最长</strong>，用于首帧/RTS 争用信道。</p>
            </div>
          </div>

          <div class="info-card">
            <div class="ic-header">
              <span class="ic-badge">考点 2</span>
              <strong>NAV 网络分配向量推导</strong>
            </div>
            <div class="ic-body">
              <p>• <strong>定义</strong>：邻居站收到 RTS/CTS 后的静默倒计时器；</p>
              <p>• <strong>CTS 中的 NAV 公式</strong>：</p>
              <p class="formula-mini"><strong>NAV = SIFS + <i>t</i><sub>DATA</sub> + SIFS + <i>t</i><sub>ACK</sub></strong></p>
            </div>
          </div>

          <div class="info-card">
            <div class="ic-header">
              <span class="ic-badge">考点 3</span>
              <strong>MAC 必须确认机制</strong>
            </div>
            <div class="ic-body">
              <p>• <strong>CSMA/CD (有线)</strong>：发生冲突可检测，<strong>无链路层 ACK</strong>；</p>
              <p>• <strong>CSMA/CA (无线)</strong>：无法硬件边发边听，误码率高，<strong>必须有链路层 ACK</strong>。</p>
            </div>
          </div>

          <div class="info-card">
            <div class="ic-header">
              <span class="ic-badge">考点 4</span>
              <strong>802.11 帧 4 种地址口诀</strong>
            </div>
            <div class="ic-body">
              <p>• <strong>地址 1 (RA)</strong>：直接接收端（本段下一跳，如 AP）；</p>
              <p>• <strong>地址 2 (TA)</strong>：直接发送端（本段发送站，如源主机）；</p>
              <p>• <strong>地址 3</strong>：主机发往外网时为<strong>最终目的路由器 MAC</strong>。</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 802.11 MAC 帧地址格式核心速查专题 (2017 题 35 核心模型) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('addr')">
        <div class="header-title-box">
          <span class="card-icon">🏷️</span>
          <strong>IEEE 802.11 数据帧 4 种地址字段结构与 408 答题铁律</strong>
          <span class="badge-blue">地址速查</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.addr ? '收起 ▲' : '展开地址解析 ▼' }}
        </button>
      </div>

      <div v-show="openSections.addr" class="card-body">
        <div class="addr-table-wrapper">
          <table class="addr-table">
            <thead>
              <tr>
                <th>传输场景</th>
                <th>To DS</th>
                <th>From DS</th>
                <th>地址 1 (RA 接收端)</th>
                <th>地址 2 (TA 发送端)</th>
                <th>地址 3 (DA 目的 / SA 源)</th>
                <th>408 核心命题模型</th>
              </tr>
            </thead>
            <tbody>
              <tr class="highlight-row">
                <td><strong>工作站 ➔ AP ➔ 路由器 (发往外网)</strong></td>
                <td><strong>1</strong></td>
                <td><strong>0</strong></td>
                <td><strong>AP 的 MAC</strong> (直接接收)</td>
                <td><strong>源工作站 MAC</strong> (直接发送)</td>
                <td><strong>路由器接口 MAC</strong> (最终目的 DA)</td>
                <td><strong>👑 2017 题 35 核心考点</strong></td>
              </tr>
              <tr>
                <td><strong>路由器 ➔ AP ➔ 工作站 (从外网接收)</strong></td>
                <td>0</td>
                <td>1</td>
                <td><strong>目的工作站 MAC</strong> (直接接收)</td>
                <td><strong>AP 的 MAC</strong> (直接发送)</td>
                <td><strong>路由器接口 MAC</strong> (原始源 SA)</td>
                <td>下行传输经典模型</td>
              </tr>
              <tr>
                <td><strong>工作站 ➔ 工作站 (自组织 IBSS)</strong></td>
                <td>0</td>
                <td>0</td>
                <td>目的工作站 MAC (DA)</td>
                <td>源工作站 MAC (SA)</td>
                <td>BSSID (网络标识)</td>
                <td>无 AP 直连网络</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="addr-memo">
          💡 <strong>秒杀口诀</strong>：无论何种情况，<strong>地址 1 永远是无线直接接收方 RA</strong>，<strong>地址 2 永远是无线直接发送方 TA</strong>！当主机发往外网时，地址 3 是最终目的路由器 DA！
        </div>
      </div>
    </div>

    <!-- 3. 【408 核心真题精练】交互式自测刷题 (5 道统考真题全收录) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>【408 统考真题题库】CSMA/CA 与 802.11 核心真题精解全收录 (5 题)</strong>
          <span class="badge-green">真题演练 (5题)</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam" class="card-body">
        
        <!-- ── 题 1：2011 题 36 MAC 确认 ── -->
        <div class="quiz-block">
          <div class="exam-question">
            <span class="q-badge">【2011 年 题 36】</span>
            下列选项中，对正确接收到的数据帧进行<strong>确认</strong>的 MAC 协议是（&nbsp;&nbsp;&nbsp;&nbsp;）。
          </div>

          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': q1.userAns === opt,
                'opt-correct': q1.revealed && opt === 'D',
                'opt-wrong': q1.revealed && q1.userAns === opt && opt !== 'D'
              }"
              @click="handleQ1(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'">CSMA</span>
                <span v-else-if="opt === 'B'">CDMA</span>
                <span v-else-if="opt === 'C'">CSMA/CD</span>
                <span v-else-if="opt === 'D'">CSMA/CA</span>
              </div>
              <span v-if="q1.revealed && opt === 'D'" class="correct-badge">✔ 正确答案</span>
              <span v-else-if="q1.revealed && q1.userAns === opt && opt !== 'D'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="q1.revealed = !q1.revealed">
              {{ q1.revealed ? '🔒 隐藏解析' : '💡 查看答案与分步解析' }}
            </button>
            <button v-if="q1.userAns || q1.revealed" class="quiz-btn btn-reset" type="button" @click="resetQ1">
              🔄 重新作答
            </button>
          </div>

          <div v-show="q1.revealed" class="exam-analysis">
            <div class="analysis-title">🔍 核心推导解析：</div>
            <ol class="analysis-list">
              <li><strong>CSMA/CD (有线)</strong>：具有碰撞检测能力，发生冲突能立即发现并停止发送，在 MAC 层<strong>不使用确认机制</strong>；</li>
              <li><strong>CSMA/CA (无线)</strong>：由于无线信道误码率高且无法进行可靠的硬件碰撞检测，为了保证数据可靠传输，<strong>必须在 MAC 子层对每个正确接收到的单播数据帧返回 ACK 确认</strong>（<strong>正确答案：D</strong>）。</li>
            </ol>
          </div>
        </div>

        <hr class="quiz-divider" />

        <!-- ── 题 2：2017 题 35 802.11 地址字段 ── -->
        <div class="quiz-block">
          <div class="exam-question">
            <span class="q-badge">【2017 年 题 35】</span>
            在网络拓扑中，主机 H ($00\text{-}12\text{-}34\text{-}56\text{-}78\text{-}9a$) 发送一个封装访问 Internet 的 IP 分组的 IEEE 802.11 数据帧 F 至 AP ($00\text{-}12\text{-}34\text{-}56\text{-}78\text{-}9b$)，AP 再通过有线链路转发给默认网关路由器 R ($00\text{-}12\text{-}34\text{-}56\text{-}78\text{-}9c$)。则帧 F 的<strong>地址 1、地址 2 和地址 3</strong> 分别是（&nbsp;&nbsp;&nbsp;&nbsp;）。
          </div>

          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': q2.userAns === opt,
                'opt-correct': q2.revealed && opt === 'B',
                'opt-wrong': q2.revealed && q2.userAns === opt && opt !== 'B'
              }"
              @click="handleQ2(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'">9a, 9b, 9c</span>
                <span v-else-if="opt === 'B'">9b, 9a, 9c</span>
                <span v-else-if="opt === 'C'">9b, 9c, 9a</span>
                <span v-else-if="opt === 'D'">9a, 9c, 9b</span>
              </div>
              <span v-if="q2.revealed && opt === 'B'" class="correct-badge">✔ 正确答案</span>
              <span v-else-if="q2.revealed && q2.userAns === opt && opt !== 'B'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="q2.revealed = !q2.revealed">
              {{ q2.revealed ? '🔒 隐藏解析' : '💡 查看答案与分步解析' }}
            </button>
            <button v-if="q2.userAns || q2.revealed" class="quiz-btn btn-reset" type="button" @click="resetQ2">
              🔄 重新作答
            </button>
          </div>

          <div v-show="q2.revealed" class="exam-analysis">
            <div class="analysis-title">🔍 核心推导解析：</div>
            <ol class="analysis-list">
              <li><strong>地址 1 (RA 接收端)</strong>：该无线帧的直接接收者是 <strong>AP</strong>，故地址 1 为 <strong>9b</strong>；</li>
              <li><strong>地址 2 (TA 发送端)</strong>：该无线帧的直接发送者是 <strong>主机 H</strong>，故地址 2 为 <strong>9a</strong>；</li>
              <li><strong>地址 3 (DA 目的端)</strong>：数据帧发往分布式系统 (To DS=1, From DS=0)，地址 3 存放最终目的 MAC 地址，即<strong>路由器 R 的端口 MAC (9c)</strong>；</li>
              <li>综合得出：地址 1、2、3 分别为 <strong>9b, 9a, 9c</strong>（<strong>正确答案：B</strong>）。</li>
            </ol>
          </div>
        </div>

        <hr class="quiz-divider" />

        <!-- ── 题 3：2018 题 35 信道预约 ── -->
        <div class="quiz-block">
          <div class="exam-question">
            <span class="q-badge">【2018 年 题 35】</span>
            IEEE 802.11 无线局域网的 MAC 协议 CSMA/CA 进行<strong>信道预约</strong>的方法是（&nbsp;&nbsp;&nbsp;&nbsp;）。
          </div>

          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': q3.userAns === opt,
                'opt-correct': q3.revealed && opt === 'D',
                'opt-wrong': q3.revealed && q3.userAns === opt && opt !== 'D'
              }"
              @click="handleQ3(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'">发送确认帧</span>
                <span v-else-if="opt === 'B'">采用二进制指数退避</span>
                <span v-else-if="opt === 'C'">使用多个 MAC 地址</span>
                <span v-else-if="opt === 'D'">交换 RTS 和 CTS 帧</span>
              </div>
              <span v-if="q3.revealed && opt === 'D'" class="correct-badge">✔ 正确答案</span>
              <span v-else-if="q3.revealed && q3.userAns === opt && opt !== 'D'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="q3.revealed = !q3.revealed">
              {{ q3.revealed ? '🔒 隐藏解析' : '💡 查看答案与分步解析' }}
            </button>
            <button v-if="q3.userAns || q3.revealed" class="quiz-btn btn-reset" type="button" @click="resetQ3">
              🔄 重新作答
            </button>
          </div>

          <div v-show="q3.revealed" class="exam-analysis">
            <div class="analysis-title">🔍 核心推导解析：</div>
            <ol class="analysis-list">
              <li>CSMA/CA 采用 <strong>RTS (请求发送) / CTS (允许发送) 短控制帧</strong> 握手协议来预约信道使用时间；</li>
              <li>RTS 和 CTS 帧均包含「持续时间」字段，其他监听到该帧的节点据此设置 NAV 进行静默等待（<strong>正确答案：D</strong>）。</li>
            </ol>
          </div>
        </div>

        <hr class="quiz-divider" />

        <!-- ── 题 4：2020 题 37 帧间间隔最长 ── -->
        <div class="quiz-block">
          <div class="exam-question">
            <span class="q-badge">【2020 年 题 37】</span>
            某 IEEE 802.11 无线局域网中主机 H 与 AP 之间发送或接收 CSMA/CA 帧的过程中：主机 H 发送 RTS 前等待 IFS1；AP 收到 RTS 后等待 IFS2 发送 CTS；主机 H 收到 CTS 后等待 IFS3 发送 DATA；AP 收到 DATA 后等待 IFS4 发送 ACK。在 H 或 AP 发送帧前所等待的帧间隔时间 (IFS) 中<strong>最长</strong>的是（&nbsp;&nbsp;&nbsp;&nbsp;）。
          </div>

          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': q4.userAns === opt,
                'opt-correct': q4.revealed && opt === 'A',
                'opt-wrong': q4.revealed && q4.userAns === opt && opt !== 'A'
              }"
              @click="handleQ4(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'">IFS1</span>
                <span v-else-if="opt === 'B'">IFS2</span>
                <span v-else-if="opt === 'C'">IFS3</span>
                <span v-else-if="opt === 'D'">IFS4</span>
              </div>
              <span v-if="q4.revealed && opt === 'A'" class="correct-badge">✔ 正确答案</span>
              <span v-else-if="q4.revealed && q4.userAns === opt && opt !== 'A'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="q4.revealed = !q4.revealed">
              {{ q4.revealed ? '🔒 隐藏解析' : '💡 查看答案与分步解析' }}
            </button>
            <button v-if="q4.userAns || q4.revealed" class="quiz-btn btn-reset" type="button" @click="resetQ4">
              🔄 重新作答
            </button>
          </div>

          <div v-show="q4.revealed" class="exam-analysis">
            <div class="analysis-title">🔍 核心推导解析：</div>
            <ol class="analysis-list">
              <li><strong>IFS 种类</strong>：IFS1 是主机发起新会话前争用信道等待的 <strong>DIFS</strong>；IFS2、IFS3、IFS4 均为同一会话中连续响应等待的 <strong>SIFS</strong>；</li>
              <li><strong>大小关系</strong>：$\\text{SIFS} < \\text{PIFS} < \\text{DIFS}$，故 <strong>IFS1 (DIFS) 最长</strong>（<strong>正确答案：A</strong>）。</li>
            </ol>
          </div>
        </div>

        <hr class="quiz-divider" />

        <!-- ── 题 5：NAV 网络分配向量计算 (题 36) ── -->
        <div class="quiz-block">
          <div class="exam-question">
            <span class="q-badge">【经典大题 题 36】</span>
            在采用 CSMA/CA 的 802.11 无线局域网中，DIFS = <strong>128 μs</strong>，SIFS = <strong>28 μs</strong>，RTS、CTS 和 ACK 帧的传输时延分别是 <strong>3 μs、2 μs 和 2 μs</strong>，忽略信号传播时延。若主机 A 欲向 AP 发送一个总长度为 <strong>1998 B</strong> 的数据帧，无线链路带宽为 <strong>54 Mb/s</strong>，则隐藏站 B 收到 AP 发送的 CTS 帧时，设置的网络分配向量 <strong>NAV 的值</strong>是（&nbsp;&nbsp;&nbsp;&nbsp;）。
          </div>

          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': q5.userAns === opt,
                'opt-correct': q5.revealed && opt === 'B',
                'opt-wrong': q5.revealed && q5.userAns === opt && opt !== 'B'
              }"
              @click="handleQ5(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'">326 μs</span>
                <span v-else-if="opt === 'B'">354 μs</span>
                <span v-else-if="opt === 'C'">385 μs</span>
                <span v-else-if="opt === 'D'">513 μs</span>
              </div>
              <span v-if="q5.revealed && opt === 'B'" class="correct-badge">✔ 正确答案</span>
              <span v-else-if="q5.revealed && q5.userAns === opt && opt !== 'B'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="q5.revealed = !q5.revealed">
              {{ q5.revealed ? '🔒 隐藏解析' : '💡 查看答案与分步解析' }}
            </button>
            <button v-if="q5.userAns || q5.revealed" class="quiz-btn btn-reset" type="button" @click="resetQ5">
              🔄 重新作答
            </button>
          </div>

          <div v-show="q5.revealed" class="exam-analysis">
            <div class="analysis-title">🔍 核心推导解析（NAV 计算模型）：</div>
            <ol class="analysis-list">
              <li>
                <strong>NAV 的物理定义</strong>：<br>
                隐藏站 B 收到 CTS 帧时设置的 NAV，代表从 <strong>CTS 发送完毕后</strong> 直到 <strong>AP 发送完 ACK 帧确认整个会话结束</strong> 为止，信道将被占用的剩余总时间。
              </li>
              <li>
                <strong>分步计算各阶段耗时</strong>：<br>
                • CTS 发送完毕后，主机 A 等待短帧间隙：$\\text{SIFS} = \\mathbf{28\\ \\mu\\text{s}}$；<br>
                • 主机 A 发送数据帧的发送时延：<br>
                $$t_{\\text{data}} = \\frac{1998 \\times 8\\text{ bit}}{54\\text{ Mb/s}} = \\frac{15984\\text{ bit}}{54\\text{ bit}/\\mu\\text{s}} = \\mathbf{296\\ \\mu\\text{s}}$$；<br>
                • AP 接收完数据帧后，等待短帧间隙准备发 ACK：$\\text{SIFS} = \\mathbf{28\\ \\mu\\text{s}}$；<br>
                • AP 发送 ACK 帧的发送时延：$t_{\\text{ACK}} = \\mathbf{2\\ \\mu\\text{s}}$。
              </li>
              <li>
                <strong>求和得出 NAV 设定值</strong>：<br>
                $$\\text{NAV} = \\text{SIFS} + t_{\\text{data}} + \\text{SIFS} + t_{\\text{ACK}} = 28 + 296 + 28 + 2 = \\mathbf{354\\ \\mu\\text{s}}$$（<strong>正确答案：B</strong>）。
              </li>
            </ol>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const openSections = reactive({
  diagram: true,
  addr: true,
  exam: true
})

const toggle = (sec) => {
  openSections[sec] = !openSections[sec]
}

// 5 道题的独立响应式状态
const q1 = reactive({ userAns: null, revealed: false })
const handleQ1 = (opt) => { q1.userAns = opt; q1.revealed = true }
const resetQ1 = () => { q1.userAns = null; q1.revealed = false }

const q2 = reactive({ userAns: null, revealed: false })
const handleQ2 = (opt) => { q2.userAns = opt; q2.revealed = true }
const resetQ2 = () => { q2.userAns = null; q2.revealed = false }

const q3 = reactive({ userAns: null, revealed: false })
const handleQ3 = (opt) => { q3.userAns = opt; q3.revealed = true }
const resetQ3 = () => { q3.userAns = null; q3.revealed = false }

const q4 = reactive({ userAns: null, revealed: false })
const handleQ4 = (opt) => { q4.userAns = opt; q4.revealed = true }
const resetQ4 = () => { q4.userAns = null; q4.revealed = false }

const q5 = reactive({ userAns: null, revealed: false })
const handleQ5 = (opt) => { q5.userAns = opt; q5.revealed = true }
const resetQ5 = () => { q5.userAns = null; q5.revealed = false }
</script>

<style scoped>
.csmaca-container {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sim-header {
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

.formula-tag {
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

.sim-svg {
  width: 100%;
  min-width: 860px;
  height: auto;
  display: block;
}

.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.info-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 14px;
}

.ic-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-1);
  margin-bottom: 6px;
}

.ic-badge {
  font-size: 11px;
  font-weight: 700;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.1);
  padding: 1px 6px;
  border-radius: 4px;
}

.ic-body p {
  margin: 4px 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.formula-mini {
  background: var(--vp-c-bg-elv);
  padding: 3px 6px;
  border-radius: 4px;
  color: #0284c7;
  border: 1px solid var(--vp-c-border);
}

/* 地址表格 */
.addr-table-wrapper {
  overflow-x: auto;
  margin-bottom: 12px;
}

.addr-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.addr-table th {
  background: var(--vp-c-bg-soft);
  padding: 8px 12px;
  text-align: left;
  border-bottom: 2px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.addr-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.highlight-row {
  background: rgba(2, 132, 199, 0.04);
}

.addr-memo {
  font-size: 13px;
  line-height: 1.6;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.08);
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(2, 132, 199, 0.25);
}

/* 真题区域 */
.quiz-block {
  margin-bottom: 20px;
}

.quiz-divider {
  border: 0;
  border-top: 1px dashed var(--vp-c-divider);
  margin: 24px 0;
}

.exam-question {
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  margin-bottom: 14px;
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border-left: 3px solid #0284c7;
}

.q-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.12);
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 6px;
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
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--vp-c-text-2);
}

.badge-blue {
  font-size: 11px;
  font-weight: 700;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.badge-green {
  font-size: 11px;
  font-weight: 700;
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}
</style>
