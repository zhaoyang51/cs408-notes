<template>
  <div class="gbn-sim-container">
    <!-- 顶部卡片横幅 -->
    <div class="sim-header">
      <div class="header-left">
        <span class="badge-blue">📡 经典时延模型</span>
        <h4 class="header-title">停止-等待 vs 后退 N 帧 (GBN) 时序全景对比与信道利用率推导</h4>
      </div>
      <div class="formula-tag">
        核心公式：信道利用率 <i>U</i> = <i>a</i> / (<i>a</i> + <i>b</i> + <i>c</i> + <i>d</i>) ➔ GBN 需 <i>W</i><sub>T</sub> ≥ ⌈<i>T</i><sub>总</sub> / <i>t</i><sub>帧</sub>⌉
      </div>
    </div>

    <!-- 1. 核心时序图解 (深度复刻 408 经典时延切片对比模型) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('diagram')">
        <div class="header-title-box">
          <span class="card-icon">📐</span>
          <strong>停止-等待 vs 后退 N 帧 (GBN) 通信时序全景对照图</strong>
          <span class="badge-blue">同周期对比</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.diagram ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.diagram" class="card-body">
        <div class="diagram-wrapper">
          <svg viewBox="0 0 920 460" class="sim-svg">
            <defs>
              <!-- 渐变色定义 -->
              <linearGradient id="dataFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.85" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.95" />
              </linearGradient>

              <linearGradient id="ackFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#34d399" stop-opacity="0.85" />
                <stop offset="100%" stop-color="#059669" stop-opacity="0.95" />
              </linearGradient>

              <marker id="arrow-axis" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#64748b" />
              </marker>

              <marker id="arrow-dim" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <polygon points="0 0, 5 2.5, 0 5" fill="#0284c7" />
              </marker>

              <marker id="arrow-dim-green" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <polygon points="0 0, 5 2.5, 0 5" fill="#059669" />
              </marker>
            </defs>

            <!-- ══════════════════════════════════════════════════════════════
                 上半部分：【模型 1】停止-等待协议 (Stop-and-Wait)
                 ══════════════════════════════════════════════════════════════ -->
            <g transform="translate(10, 10)">
              <!-- 左侧大标签 -->
              <rect x="0" y="45" width="85" height="70" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="42.5" y="75" font-size="12" font-weight="bold" text-anchor="middle" fill="#334155">停止-等待</text>
              <text x="42.5" y="95" font-size="12" font-weight="bold" text-anchor="middle" fill="#334155">协议</text>

              <!-- 发送方/接收方 实体标签 (顶部接收方，底部发送方，严格对应考研标准模型) -->
              <rect x="95" y="15" width="60" height="26" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="125" y="32" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#059669">接收方</text>

              <rect x="95" y="125" width="60" height="26" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="125" y="142" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#0284c7">发送方</text>

              <!-- 水平时间轴 -->
              <line x1="165" y1="28" x2="680" y2="28" stroke="#334155" stroke-width="1.8" marker-end="url(#arrow-axis)"/>
              <text x="690" y="32" font-size="13" font-weight="bold" fill="#334155">t</text>

              <line x1="165" y1="138" x2="680" y2="138" stroke="#334155" stroke-width="1.8" marker-end="url(#arrow-axis)"/>
              <text x="690" y="142" font-size="13" font-weight="bold" fill="#334155">t</text>

              <!-- 红色高亮往返周期垂直背景条 (涵盖发送方发出 ➔ 收到确认的整个周期) -->
              <rect x="180" y="12" width="270" height="142" rx="4" fill="rgba(244, 63, 94, 0.12)" stroke="rgba(244, 63, 94, 0.35)" stroke-dasharray="3,3"/>

              <!-- 数据帧 1：从发送方发出 (向上斜行至接收方) -->
              <polygon points="180,138 220,138 335,28 295,28" fill="url(#dataFrameGrad)" stroke="#0284c7" stroke-width="1.2"/>
              <text x="250" y="85" font-size="11" font-weight="bold" fill="#ffffff" transform="rotate(-44, 250, 85)">数据帧</text>

              <!-- 确认帧 1：从接收方发出 (向下斜行至发送方) -->
              <polygon points="335,28 375,28 450,138 410,138" fill="url(#ackFrameGrad)" stroke="#059669" stroke-width="1.2"/>
              <text x="385" y="85" font-size="11" font-weight="bold" fill="#ffffff" transform="rotate(44, 385, 85)">确认帧</text>

              <!-- 数据帧 2：收到确认后方可发送下一帧 -->
              <polygon points="450,138 490,138 605,28 565,28" fill="url(#dataFrameGrad)" stroke="#0284c7" stroke-width="1.2"/>
              <text x="520" y="85" font-size="11" font-weight="bold" fill="#ffffff" transform="rotate(-44, 520, 85)">数据帧</text>

              <!-- 确认帧 2 -->
              <polygon points="605,28 645,28 720,138 680,138" fill="url(#ackFrameGrad)" stroke="#059669" stroke-width="1.2"/>
              <text x="655" y="85" font-size="11" font-weight="bold" fill="#ffffff" transform="rotate(44, 655, 85)">确认帧</text>

              <!-- 省略符号 -->
              <text x="655" y="100" font-size="16" font-weight="bold" fill="#94a3b8">......</text>

              <!-- ── 时延维度标注 (a, b, c, d) ── -->
              <!-- a: 数据帧发送时延 -->
              <line x1="180" y1="152" x2="220" y2="152" stroke="#0284c7" stroke-width="1.2"/>
              <line x1="180" y1="148" x2="180" y2="156" stroke="#0284c7" stroke-width="1.2"/>
              <line x1="220" y1="148" x2="220" y2="156" stroke="#0284c7" stroke-width="1.2"/>
              <text x="200" y="163" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#0284c7">a</text>

              <!-- b: 信号传播时延 -->
              <line x1="220" y1="152" x2="335" y2="152" stroke="#64748b" stroke-width="1.2"/>
              <line x1="335" y1="148" x2="335" y2="156" stroke="#64748b" stroke-width="1.2"/>
              <text x="277" y="163" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#64748b">b</text>

              <!-- c: 确认帧发送时延 -->
              <line x1="335" y1="14" x2="375" y2="14" stroke="#059669" stroke-width="1.2"/>
              <line x1="335" y1="10" x2="335" y2="18" stroke="#059669" stroke-width="1.2"/>
              <line x1="375" y1="10" x2="375" y2="18" stroke="#059669" stroke-width="1.2"/>
              <text x="355" y="7" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#059669">c</text>

              <!-- d: 确认信号传播时延 -->
              <line x1="375" y1="14" x2="450" y2="14" stroke="#64748b" stroke-width="1.2"/>
              <line x1="450" y1="10" x2="450" y2="18" stroke="#64748b" stroke-width="1.2"/>
              <text x="412" y="7" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#64748b">d</text>

              <!-- 右侧参数说明区 -->
              <g transform="translate(710, 15)">
                <rect x="0" y="0" width="190" height="142" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
                <text x="12" y="24" font-size="11.5" font-weight="bold" fill="#0284c7">a: 数据帧发送时延</text>
                <text x="12" y="44" font-size="11.5" font-weight="bold" fill="#64748b">b: 信号传播时延</text>
                <text x="12" y="64" font-size="11.5" font-weight="bold" fill="#059669">c: 确认帧发送时延</text>
                <text x="12" y="84" font-size="11.5" font-weight="bold" fill="#64748b">d: 信号传播时延</text>
                
                <line x1="12" y1="96" x2="178" y2="96" stroke="#e2e8f0" stroke-width="1"/>
                <text x="12" y="116" font-size="11.5" font-weight="bold" fill="#d97706">信道利用率公式：</text>
                <text x="12" y="134" font-size="12" font-weight="900" fill="#d97706">U = a / (a + b + c + d)</text>
              </g>
            </g>

            <!-- ══════════════════════════════════════════════════════════════
                 下半部分：【模型 2】后退 N 帧协议 (GBN)
                 ══════════════════════════════════════════════════════════════ -->
            <g transform="translate(10, 230)">
              <!-- 左侧大标签 -->
              <rect x="0" y="45" width="85" height="70" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="42.5" y="75" font-size="12" font-weight="bold" text-anchor="middle" fill="#0284c7">后退N帧</text>
              <text x="42.5" y="95" font-size="12" font-weight="bold" text-anchor="middle" fill="#0284c7">协议</text>

              <!-- 发送方/接收方 实体标签 -->
              <rect x="95" y="15" width="60" height="26" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="125" y="32" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#059669">接收方</text>

              <rect x="95" y="125" width="60" height="26" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="125" y="142" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#0284c7">发送方</text>

              <!-- 水平时间轴 -->
              <line x1="165" y1="28" x2="680" y2="28" stroke="#334155" stroke-width="1.8" marker-end="url(#arrow-axis)"/>
              <text x="690" y="32" font-size="13" font-weight="bold" fill="#334155">t</text>

              <line x1="165" y1="138" x2="680" y2="138" stroke="#334155" stroke-width="1.8" marker-end="url(#arrow-axis)"/>
              <text x="690" y="142" font-size="13" font-weight="bold" fill="#334155">t</text>

              <!-- 红色高亮往返周期垂直背景条 (与上方完全对齐！完美展示同周期下帧连续发送) -->
              <rect x="180" y="12" width="270" height="142" rx="4" fill="rgba(244, 63, 94, 0.12)" stroke="rgba(244, 63, 94, 0.35)" stroke-dasharray="3,3"/>

              <!-- 连续发送数据帧 0, 1, 2... 密集流水线 -->
              <polygon points="180,138 210,138 325,28 295,28" fill="url(#dataFrameGrad)" stroke="#0284c7" stroke-width="0.8"/>
              <text x="245" y="85" font-size="10" font-weight="bold" fill="#ffffff" transform="rotate(-44, 245, 85)">数据帧</text>

              <polygon points="210,138 240,138 355,28 325,28" fill="url(#dataFrameGrad)" stroke="#0284c7" stroke-width="0.8"/>
              <text x="275" y="85" font-size="10" font-weight="bold" fill="#ffffff" transform="rotate(-44, 275, 85)">数据帧</text>

              <polygon points="240,138 270,138 385,28 355,28" fill="url(#dataFrameGrad)" stroke="#0284c7" stroke-width="0.8"/>
              <text x="305" y="85" font-size="10" font-weight="bold" fill="#ffffff" transform="rotate(-44, 305, 85)">数据帧</text>

              <!-- 省略号：连续发送更多帧 -->
              <text x="300" y="125" font-size="15" font-weight="bold" fill="#0284c7">......</text>

              <!-- 确认帧：在 t=668ms 处返回到达发送方 -->
              <polygon points="325,28 355,28 450,138 420,138" fill="url(#ackFrameGrad)" stroke="#059669" stroke-width="1.2"/>
              <text x="380" y="85" font-size="10" font-weight="bold" fill="#ffffff" transform="rotate(44, 380, 85)">确认帧</text>

              <!-- 收到确认帧后，后续数据帧继续发送，无缝流水线！ -->
              <polygon points="450,138 480,138 595,28 565,28" fill="url(#dataFrameGrad)" stroke="#0284c7" stroke-width="0.8"/>
              <text x="515" y="85" font-size="10" font-weight="bold" fill="#ffffff" transform="rotate(-44, 515, 85)">数据帧</text>

              <polygon points="480,138 510,138 625,28 595,28" fill="url(#dataFrameGrad)" stroke="#0284c7" stroke-width="0.8"/>
              <text x="545" y="85" font-size="10" font-weight="bold" fill="#ffffff" transform="rotate(-44, 545, 85)">数据帧</text>

              <!-- 右侧计算推导区 (完美对应真题计算步骤) -->
              <g transform="translate(560, 15)">
                <rect x="0" y="0" width="340" height="142" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
                
                <text x="12" y="24" font-size="11.5" font-weight="bold" fill="#334155">
                  发送一帧的时间 = (128 × 8) / 16000 = <tspan fill="#0284c7" font-weight="bold">64 ms</tspan>
                </text>
                
                <text x="12" y="52" font-size="11.5" font-weight="bold" fill="#334155">
                  发送一帧到收到确认为止的总时间 =
                </text>
                <text x="24" y="72" font-size="11.5" font-weight="bold" fill="#334155">
                  64 + 270 × 2 + 64 = <tspan fill="#d97706" font-weight="900">668 ms</tspan>
                </text>

                <text x="12" y="102" font-size="11.5" font-weight="bold" fill="#334155">
                  这段总时间可以发送的帧数量 =
                </text>
                <text x="24" y="124" font-size="12" font-weight="900" fill="#059669">
                  668 / 64 = 10.4375 帧 ➔ 窗口 W_T = 11
                </text>
              </g>
            </g>
          </svg>
        </div>

        <!-- 图解下方：核心考点与窗口不等式推导卡片 -->
        <div class="formula-cards-grid">
          <div class="f-card">
            <div class="f-card-header">
              <span class="f-badge">窗口约束</span>
              <strong>GBN 发送窗口尺寸准则</strong>
            </div>
            <div class="f-card-body">
              <div class="f-formula-text">1 &lt; <i>W</i><sub>T</sub> ≤ 2<sup><i>n</i></sup> - 1</div>
              <p class="f-desc">其中 <i>n</i> 为构成帧序号的比特数；GBN 接收窗口固定为 1。</p>
            </div>
          </div>

          <div class="f-card">
            <div class="f-card-header">
              <span class="f-badge">向上取整</span>
              <strong>最高信道利用率条件</strong>
            </div>
            <div class="f-card-body">
              <div class="f-formula-text">连续帧数 10.4375 ➔ <i>W</i><sub>T</sub> 取值为 11</div>
              <p class="f-desc">发送窗口必须能够连续覆盖整个往返周期（668ms），才能实现无停顿满载发送。</p>
            </div>
          </div>

          <div class="f-card">
            <div class="f-card-header">
              <span class="f-badge">序号求解</span>
              <strong>最少帧序号比特数推导</strong>
            </div>
            <div class="f-card-body">
              <div class="f-formula-text">11 ≤ 2<sup><i>n</i></sup> - 1 ⟹ 2<sup><i>n</i></sup> ≥ 12 ⟹ <i>n</i> ≥ 4</div>
              <p class="f-desc">2³ = 8 &lt; 12，故 3 位无法满足；2⁴ = 16 ≥ 12，解得 <i>n</i> 至少为 <strong>4</strong>。</p>
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
          <strong>动态时延实验台：实时调节速率、时延与帧长，观察窗口与比特数变化</strong>
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
  min-width: 820px;
  height: auto;
  display: block;
}

/* 独立公式卡片网格 */
.formula-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
  margin-top: 18px;
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
