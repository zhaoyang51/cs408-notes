<template>
  <div class="gbn-sim-container">
    <!-- 顶部卡片横幅 -->
    <div class="sim-header">
      <div class="header-left">
        <span class="badge-blue">📡 滑动窗口与信道利用率</span>
        <h4 class="header-title">后退 N 帧 (GBN) 连续传输时延模型与最高信道利用率推导</h4>
      </div>
      <div class="formula-tag">
        最高利用率准则：<i>W</i><sub>T</sub> ≥ ⌈<i>T</i><sub>cycle</sub> / <i>t</i><sub>tx</sub>⌉ 且 GBN 满足 <i>W</i><sub>T</sub> ≤ 2<sup><i>n</i></sup> - 1
      </div>
    </div>

    <!-- 1. 停止-等待 vs GBN 时序对比与时延分解 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('diagram')">
        <div class="header-title-box">
          <span class="card-icon">📐</span>
          <strong>停止-等待 vs GBN 协议通信时序对比图（往返时延周期模型）</strong>
          <span class="badge-blue">无遮挡清晰时序</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.diagram ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.diagram" class="card-body">
        <!-- SVG 时序主图 (彻底移除覆盖在图上的公式文字框，保证图画线条清晰无遮挡) -->
        <div class="diagram-wrapper">
          <svg viewBox="0 0 780 340" class="sim-svg">
            <defs>
              <marker id="arrowhead-gbn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#94a3b8" />
              </marker>
              <marker id="arrowhead-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#0284c7" />
              </marker>
              <marker id="arrowhead-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#059669" />
              </marker>
            </defs>

            <!-- ── A. 停止-等待协议时序 ── -->
            <g transform="translate(10, 15)">
              <rect x="0" y="0" width="760" height="145" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-border)" stroke-width="1.2"/>
              <text x="20" y="24" font-size="12" font-weight="bold" fill="#0284c7">【模型 1】停止-等待协议 (Stop-and-Wait) · 发送 1 帧即停下等待 ACK</text>

              <!-- 实体标签 -->
              <rect x="20" y="40" width="60" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="50" y="56" font-size="11" font-weight="bold" text-anchor="middle" fill="#0284c7">发送方</text>

              <rect x="20" y="102" width="60" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="50" y="118" font-size="11" font-weight="bold" text-anchor="middle" fill="#059669">接收方</text>

              <!-- 时间轴 -->
              <line x1="90" y1="52" x2="740" y2="52" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrowhead-gbn)"/>
              <text x="735" y="46" font-size="10.5" fill="#64748b">时间 t</text>

              <line x1="90" y1="114" x2="740" y2="114" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrowhead-gbn)"/>
              <text x="735" y="108" font-size="10.5" fill="#64748b">时间 t</text>

              <!-- 数据帧发送 (时延 a) + 传播 (时延 b) -->
              <polygon points="105,52 155,52 245,114 195,114" fill="rgba(2, 132, 199, 0.15)" stroke="#0284c7" stroke-width="1.2"/>
              <text x="175" y="80" font-size="10.5" font-weight="bold" fill="#0284c7" transform="rotate(35, 175, 80)">数据帧 0 (a 发送 + b 传播)</text>

              <!-- 确认帧发送 (时延 c) + 反向传播 (时延 d) -->
              <polygon points="245,114 295,114 385,52 335,52" fill="rgba(5, 150, 105, 0.15)" stroke="#059669" stroke-width="1.2"/>
              <text x="315" y="90" font-size="10.5" font-weight="bold" fill="#059669" transform="rotate(-35, 315, 90)">确认帧 ACK 0 (c 发送 + d 传播)</text>

              <!-- 发送方空闲等待指示 -->
              <line x1="155" y1="52" x2="335" y2="52" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3,2"/>
              <text x="245" y="44" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#ef4444">⏸️ 发送方空闲等待信道</text>

              <!-- 下一数据帧 -->
              <polygon points="385,52 435,52 525,114 475,114" fill="rgba(2, 132, 199, 0.15)" stroke="#0284c7" stroke-width="1.2"/>
              <text x="455" y="80" font-size="10.5" font-weight="bold" fill="#0284c7" transform="rotate(35, 455, 80)">数据帧 1</text>

              <!-- 时延标尺 a: 发送时延 -->
              <line x1="105" y1="36" x2="155" y2="36" stroke="#0284c7" stroke-width="1.5"/>
              <line x1="105" y1="32" x2="105" y2="40" stroke="#0284c7" stroke-width="1"/>
              <line x1="155" y1="32" x2="155" y2="40" stroke="#0284c7" stroke-width="1"/>
              <text x="130" y="30" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#0284c7">a: 发送</text>

              <!-- a+b+c+d 往返总周期标尺 -->
              <line x1="105" y1="130" x2="385" y2="130" stroke="#d97706" stroke-width="1.5"/>
              <line x1="105" y1="126" x2="105" y2="134" stroke="#d97706" stroke-width="1.5"/>
              <line x1="385" y1="126" x2="385" y2="134" stroke="#d97706" stroke-width="1.5"/>
              <text x="245" y="141" font-size="10" font-weight="bold" text-anchor="middle" fill="#d97706">单帧往返总周期 T_cycle = a + b + c + d （信道利用率 U = a / T_cycle 极低）</text>
            </g>

            <!-- ── B. 后退 N 帧 (GBN) 连续发送时序 ── -->
            <g transform="translate(10, 175)">
              <rect x="0" y="0" width="760" height="150" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-border)" stroke-width="1.2"/>
              <text x="20" y="24" font-size="12" font-weight="bold" fill="#059669">【模型 2】后退 N 帧 (GBN) 协议 · 流水线连续发送达到 100% 最高信道利用率</text>

              <!-- 实体标签 -->
              <rect x="20" y="40" width="60" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="50" y="56" font-size="11" font-weight="bold" text-anchor="middle" fill="#0284c7">发送方</text>

              <rect x="20" y="102" width="60" height="24" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="50" y="118" font-size="11" font-weight="bold" text-anchor="middle" fill="#059669">接收方</text>

              <!-- 时间轴 -->
              <line x1="90" y1="52" x2="740" y2="52" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrowhead-gbn)"/>
              <text x="735" y="46" font-size="10.5" fill="#64748b">时间 t</text>

              <line x1="90" y1="114" x2="740" y2="114" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrowhead-gbn)"/>
              <text x="735" y="108" font-size="10.5" fill="#64748b">时间 t</text>

              <!-- 连续发送 11 个帧 (0, 1, 2, ... 10) 连续铺满信道，无任何空闲间隔 -->
              <polygon points="105,52 130,52 220,114 195,114" fill="rgba(2, 132, 199, 0.25)" stroke="#0284c7" stroke-width="0.8"/>
              <polygon points="130,52 155,52 245,114 220,114" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="0.8"/>
              <polygon points="155,52 180,52 270,114 245,114" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="0.8"/>
              <polygon points="180,52 205,52 295,114 270,114" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="0.8"/>
              <polygon points="205,52 230,52 320,114 295,114" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="0.8"/>
              <polygon points="230,52 255,52 345,114 320,114" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="0.8"/>
              <polygon points="255,52 280,52 370,114 345,114" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="0.8"/>
              <polygon points="280,52 305,52 395,114 370,114" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="0.8"/>
              <polygon points="305,52 330,52 420,114 395,114" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="0.8"/>
              <polygon points="330,52 355,52 445,114 420,114" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="0.8"/>
              <polygon points="355,52 380,52 470,114 445,114" fill="rgba(2, 132, 199, 0.25)" stroke="#0284c7" stroke-width="0.8"/>

              <!-- 收到第 1 帧的确认 ACK 0 (在 t = 385ms 处到达发送方) -->
              <polygon points="220,114 245,114 380,52 355,52" fill="rgba(5, 150, 105, 0.25)" stroke="#059669" stroke-width="1.2"/>
              <text x="300" y="85" font-size="10.5" font-weight="bold" fill="#059669" transform="rotate(-35, 300, 85)">ACK 0 到达</text>

              <!-- 随后第 11 帧、12 帧继续发送，无缝衔接 -->
              <polygon points="380,52 405,52 495,114 470,114" fill="rgba(2, 132, 199, 0.25)" stroke="#0284c7" stroke-width="0.8"/>
              <polygon points="405,52 430,52 520,114 495,114" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="0.8"/>

              <!-- 连续发送标尺 -->
              <line x1="105" y1="36" x2="380" y2="36" stroke="#0284c7" stroke-width="1.5"/>
              <line x1="105" y1="32" x2="105" y2="40" stroke="#0284c7" stroke-width="1"/>
              <line x1="380" y1="32" x2="380" y2="40" stroke="#0284c7" stroke-width="1"/>
              <text x="242" y="30" font-size="10" font-weight="bold" text-anchor="middle" fill="#0284c7">往返周期内连续发送 11 帧 (发送方信道 100% 满负荷，无需等待)</text>

              <!-- 关键时间点标注 -->
              <text x="105" y="68" font-size="9.5" text-anchor="middle" fill="var(--vp-c-text-3)">t=0 (发帧0)</text>
              <text x="380" y="68" font-size="9.5" text-anchor="middle" fill="#059669">t=T_cycle (收ACK 0)</text>
            </g>
          </svg>
        </div>

        <!-- 独立公式卡片三列网格 (位于图解下方，完全避免图文遮挡) -->
        <div class="formula-cards-grid">
          <div class="f-card">
            <div class="f-card-header">
              <span class="f-badge">① 往返周期</span>
              <strong>单帧往返总耗时</strong>
            </div>
            <div class="f-card-body">
              <div class="f-formula-text"><i>T</i><sub>cycle</sub> = <i>t</i><sub>tx</sub> + 2<i>t</i><sub>prop</sub> + <i>t</i><sub>ack</sub></div>
              <p class="f-desc">包含数据帧发送、去程传播、确认帧发送与回程传播。若确认帧与数据帧等长则 <i>t</i><sub>ack</sub> = <i>t</i><sub>tx</sub>。</p>
            </div>
          </div>

          <div class="f-card">
            <div class="f-card-header">
              <span class="f-badge">② 连续帧数</span>
              <strong>最高利用率窗口大小</strong>
            </div>
            <div class="f-card-body">
              <div class="f-formula-text"><i>W</i><sub>T</sub> ≥ ⌈ <i>T</i><sub>cycle</sub> / <i>t</i><sub>tx</sub> ⌉</div>
              <p class="f-desc">为使信道在等待 ACK 期间不停歇，发送窗口 <i>W</i><sub>T</sub> 必须能容纳一个往返周期内连续发出的全部帧数（向上取整）。</p>
            </div>
          </div>

          <div class="f-card">
            <div class="f-card-header">
              <span class="f-badge">③ 序号比特</span>
              <strong>帧序号比特数 <i>n</i> 约束</strong>
            </div>
            <div class="f-card-body">
              <div class="f-formula-text"><i>W</i><sub>T</sub> ≤ 2<sup><i>n</i></sup> - 1 ⟹ <i>n</i> ≥ ⌈log<sub>2</sub>(<i>W</i><sub>T</sub> + 1)⌉</div>
              <p class="f-desc">GBN 接收窗口为 1，发送窗口最大为 2<sup><i>n</i></sup> - 1；对比选择重传 (SR) 协议 <i>W</i><sub>T</sub> ≤ 2<sup><i>n</i>-1</sup>。</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 2. 动态参数实验台：GBN 信道利用率与最小序号比特推导 -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('calc')">
        <div class="header-title-box">
          <span class="card-icon">⚡</span>
          <strong>动态时延实验台：实时计算发送时延、周期与最小帧序号比特</strong>
          <span class="badge-green">参数调节</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.calc ? '收起 ▲' : '展开实验台 ▼' }}
        </button>
      </div>

      <div v-show="openSections.calc" class="card-body">
        <div class="calc-grid">
          <!-- 左侧：参数控制器 -->
          <div class="calc-controls">
            <div class="param-row">
              <label class="param-label">
                <span>数据传输速率 (C):</span>
                <strong>{{ calcRate }} kbps</strong>
              </label>
              <input type="range" v-model.number="calcRate" min="8" max="128" step="8" class="param-slider"/>
            </div>

            <div class="param-row">
              <label class="param-label">
                <span>单向传播时延 (t_prop):</span>
                <strong>{{ calcPropDelay }} ms</strong>
              </label>
              <input type="range" v-model.number="calcPropDelay" min="10" max="500" step="10" class="param-slider"/>
            </div>

            <div class="param-row">
              <label class="param-label">
                <span>数据帧长度 (L):</span>
                <strong>{{ calcFrameSize }} 字节 ({{ calcFrameSize * 8 }} bit)</strong>
              </label>
              <input type="range" v-model.number="calcFrameSize" min="64" max="1024" step="64" class="param-slider"/>
            </div>

            <div class="param-row">
              <label class="param-label">
                <span>确认帧长度与数据帧等长:</span>
                <strong>{{ isAckSameSize ? '是 (与数据帧等长)' : '否 (忽略确认发送时延)' }}</strong>
              </label>
              <button class="param-btn" type="button" @click="isAckSameSize = !isAckSameSize">
                {{ isAckSameSize ? '切换为：确认帧很短 (忽略 t_ack)' : '切换为：确认帧等长 (计入 t_ack)' }}
              </button>
            </div>
          </div>

          <!-- 右侧：动态计算结果面板 -->
          <div class="calc-results">
            <div class="res-title">🧮 实时推导指标面板</div>
            <div class="res-item">
              <span class="res-name">数据帧发送时延 (<i>t</i><sub>tx</sub>)：</span>
              <strong class="res-val">{{ computedTxDelay.toFixed(2) }} ms</strong>
            </div>
            <div class="res-item">
              <span class="res-name">确认帧发送时延 (<i>t</i><sub>ack</sub>)：</span>
              <strong class="res-val">{{ computedAckDelay.toFixed(2) }} ms</strong>
            </div>
            <div class="res-item">
              <span class="res-name">单帧往返总周期 (<i>T</i><sub>cycle</sub>)：</span>
              <strong class="res-val highlight">{{ computedTotalCycle.toFixed(2) }} ms</strong>
            </div>
            <div class="res-item">
              <span class="res-name">周期内可发帧数 (<i>N</i>)：</span>
              <strong class="res-val">{{ computedFramesInCycle.toFixed(4) }} 帧</strong>
            </div>
            <div class="res-item">
              <span class="res-name">最高利用率所需窗口 (<i>W</i><sub>T</sub>)：</span>
              <strong class="res-val highlight">≥ {{ computedRequiredWindow }}</strong>
            </div>
            <div class="res-item-final">
              <span class="res-name">GBN 最小帧序号比特数 (<i>n</i>)：</span>
              <strong class="res-val-final">{{ computedMinBits }} 位 (支持 <i>W</i><sub>T</sub> ≤ {{ Math.pow(2, computedMinBits) - 1 }})</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 【2012 年 统考题 36】交互式自测刷题 (零剧透设计) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>【2012 年 统考题 36】GBN 协议信道利用率与帧序号比特数真题精解</strong>
          <span class="badge-green">真题演练</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam" class="card-body">
        <div class="exam-question">
          两台主机之间的数据链路层采用<strong>后退 N 帧协议 (GBN)</strong> 传输数据，数据传输速率为 <strong>16 kbps</strong>，单向传播时延为 <strong>270 ms</strong>，数据帧长度范围是 <strong>128 ~ 512 字节</strong>，接收方总是以与数据帧<strong>等长</strong>的帧进行确认。为使信道利用率达到最高，帧序号的比特数至少为（&nbsp;&nbsp;&nbsp;&nbsp;）。
        </div>

        <!-- 交互式作答选项 -->
        <div class="quiz-interactive-box">
          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': quiz.userAns === opt,
                'opt-correct': quiz.revealed && opt === 'B',
                'opt-wrong': quiz.revealed && quiz.userAns === opt && opt !== 'B'
              }"
              @click="handleQuiz(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'">5</span>
                <span v-else-if="opt === 'B'">4</span>
                <span v-else-if="opt === 'C'">3</span>
                <span v-else-if="opt === 'D'">2</span>
              </div>
              <span v-if="quiz.revealed && opt === 'B'" class="correct-badge">✔ 正确答案</span>
              <span v-else-if="quiz.revealed && quiz.userAns === opt && opt !== 'B'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="quiz.revealed = !quiz.revealed">
              {{ quiz.revealed ? '🔒 隐藏答案与解析' : '💡 点击查看答案与深度推导' }}
            </button>
            <button v-if="quiz.userAns || quiz.revealed" class="quiz-btn btn-reset" type="button" @click="resetQuiz">
              🔄 重新作答
            </button>
          </div>
        </div>

        <!-- 详细推导过程 (默认隐藏) -->
        <div v-show="quiz.revealed" class="exam-analysis">
          <div class="analysis-title">🔍 核心推导步骤（极值分析与不等式推导）：</div>
          <ol class="analysis-list">
            <li>
              <strong>极值分析（关键陷阱）</strong>：<br>
              数据帧长度范围是 128 ~ 512 字节。为使信道利用率在<strong>任何情况下均能达到最高</strong>，必须考虑<strong>发送时延最短（即连续发帧数量最多、所需发送窗口最大）的最不利极限情况</strong>，即取数据帧长 <i>L</i> = 128 字节。
            </li>
            <li>
              <strong>计算各阶段时延</strong>：<br>
              • 数据帧发送时延 <i>t</i><sub>tx</sub> = (128 × 8 bit) / (16000 bps) = 1024 / 16000 s = 0.064 s = <strong>64 ms</strong>；<br>
              • 确认帧发送时延（题目说明与数据帧等长）：<i>t</i><sub>ack</sub> = <i>t</i><sub>tx</sub> = <strong>64 ms</strong>；<br>
              • 信号单向传播时延：<i>t</i><sub>prop</sub> = <strong>270 ms</strong>。
            </li>
            <li>
              <strong>计算单帧往返总周期</strong>：<br>
              发送一帧到收到其确认帧的总时间周期 <i>T</i><sub>cycle</sub> = <i>t</i><sub>tx</sub> + <i>t</i><sub>prop</sub> + <i>t</i><sub>ack</sub> + <i>t</i><sub>prop</sub> = 64 + 270 + 64 + 270 = <strong>668 ms</strong>。
            </li>
            <li>
              <strong>计算周期内需连续发送的帧数</strong>：<br>
              为使信道利用率达到 100%（信道无空闲等待），在该周期内连续发送的帧数需满足：<br>
              <i>N</i> = <i>T</i><sub>cycle</sub> / <i>t</i><sub>tx</sub> = 668 ms / 64 ms = <strong>10.4375 帧</strong><br>
              因此，发送窗口大小必须向上取整：<i>W</i><sub>T</sub> ≥ <strong>11</strong>。
            </li>
            <li>
              <strong>求解帧序号比特数 <i>n</i></strong>：<br>
              根据 GBN 协议窗口约束条件 <i>W</i><sub>T</sub> ≤ 2<sup><i>n</i></sup> - 1，代入 <i>W</i><sub>T</sub> = 11：<br>
              11 ≤ 2<sup><i>n</i></sup> - 1 ⟹ 2<sup><i>n</i></sup> ≥ 12 ⟹ <i>n</i> ≥ <strong>4</strong><br>
              因此，帧序号的比特数至少为 <strong>4</strong>（选 B）。
            </li>
          </ol>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const openSections = reactive({
  diagram: true, // 默认展开时序图
  calc: false,   // 默认收起计算台
  exam: true     // 默认展开真题
})

const toggle = (section) => {
  openSections[section] = !openSections[section]
}

// 计算台响应式状态
const calcRate = ref(16) // kbps
const calcPropDelay = ref(270) // ms
const calcFrameSize = ref(128) // bytes
const isAckSameSize = ref(true)

const computedTxDelay = computed(() => {
  return (calcFrameSize.value * 8) / (calcRate.value * 1000) * 1000
})

const computedAckDelay = computed(() => {
  if (!isAckSameSize.value) return 0
  return computedTxDelay.value
})

const computedTotalCycle = computed(() => {
  return computedTxDelay.value + 2 * calcPropDelay.value + computedAckDelay.value
})

const computedFramesInCycle = computed(() => {
  return computedTotalCycle.value / computedTxDelay.value
})

const computedRequiredWindow = computed(() => {
  return Math.ceil(computedFramesInCycle.value)
})

const computedMinBits = computed(() => {
  return Math.ceil(Math.log2(computedRequiredWindow.value + 1))
})

// 交互式刷题状态
const quiz = reactive({
  userAns: null,
  revealed: false
})

const handleQuiz = (opt) => {
  quiz.userAns = opt
  quiz.revealed = true
}

const resetQuiz = () => {
  quiz.userAns = null
  quiz.revealed = false
}
</script>

<style scoped>
.gbn-sim-container {
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
  min-width: 680px;
  height: auto;
  display: block;
}

/* 独立公式卡片网格 */
.formula-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.f-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.f-card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.f-badge {
  font-size: 11px;
  font-weight: 700;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.1);
  padding: 1px 6px;
  border-radius: 4px;
}

.f-formula-text {
  font-size: 13.5px;
  font-weight: 700;
  color: #0284c7;
  background: var(--vp-c-bg-elv);
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-border);
  margin: 4px 0;
  text-align: center;
}

.f-desc {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* 实验台样式 */
.calc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 720px) {
  .calc-grid {
    grid-template-columns: 1fr;
  }
}

.calc-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.param-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.param-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.param-slider {
  width: 100%;
  cursor: pointer;
}

.param-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.08);
  border: 1px solid rgba(2, 132, 199, 0.3);
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
}

.param-btn:hover {
  background: rgba(2, 132, 199, 0.15);
}

.calc-results {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.res-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  border-bottom: 1px dashed var(--vp-c-divider);
  padding-bottom: 6px;
}

.res-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.res-val {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.res-val.highlight {
  color: #0284c7;
  font-weight: 700;
}

.res-item-final {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1.5px solid var(--vp-c-divider);
  font-size: 13.5px;
}

.res-val-final {
  font-size: 15px;
  font-weight: 800;
  color: #059669;
}

/* 真题区域样式 */
.exam-question {
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border-left: 3px solid #059669;
}

.exam-analysis {
  margin-top: 16px;
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
