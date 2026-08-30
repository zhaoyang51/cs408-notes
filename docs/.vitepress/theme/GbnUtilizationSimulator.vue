<template>
  <div class="gbn-sim-container">
    <!-- 顶部卡片横幅 -->
    <div class="sim-header">
      <div class="header-left">
        <span class="badge-blue">📡 滑动窗口与信道利用率</span>
        <h4 class="header-title">后退 N 帧 (GBN) 连续传输时延模型与最高信道利用率推导</h4>
      </div>
      <div class="formula-tag">
        最高利用率条件：发送窗口 $W_T \ge \lceil T_{\text{cycle}} / t_{\text{frame}} \rceil$ 且 $W_T \le 2^n - 1$
      </div>
    </div>

    <!-- 1. 停止-等待 vs GBN 时序对比与时延分解 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('diagram')">
        <div class="header-title-box">
          <span class="card-icon">📐</span>
          <strong>停止-等待 vs GBN 协议通信时序对比图（往返时延周期模型）</strong>
          <span class="badge-blue">时延切片</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.diagram ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.diagram" class="card-body">
        <div class="diagram-wrapper">
          <svg viewBox="0 0 780 340" class="sim-svg">
            <defs>
              <!-- 箭头标记 -->
              <marker id="arrowhead-gbn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#64748b" />
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
              <rect x="0" y="0" width="760" height="140" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-border)" stroke-width="1.2"/>
              <text x="20" y="24" font-size="12" font-weight="bold" fill="#0284c7">【模型 1】停止-等待协议 (Stop-and-Wait) · 单帧等待往返确认</text>

              <!-- 实体标签 -->
              <rect x="20" y="38" width="60" height="24" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
              <text x="50" y="54" font-size="11" font-weight="bold" text-anchor="middle" fill="#0284c7">发送方</text>

              <rect x="20" y="98" width="60" height="24" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
              <text x="50" y="114" font-size="11" font-weight="bold" text-anchor="middle" fill="#059669">接收方</text>

              <!-- 时间轴 -->
              <line x1="90" y1="50" x2="740" y2="50" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrowhead-gbn)"/>
              <text x="735" y="44" font-size="10.5" fill="#64748b">t</text>

              <line x1="90" y1="110" x2="740" y2="110" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrowhead-gbn)"/>
              <text x="735" y="104" font-size="10.5" fill="#64748b">t</text>

              <!-- 数据帧发送 (时延 a) + 传播 (时延 b) -->
              <polygon points="110,50 160,50 250,110 200,110" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="1.2"/>
              <text x="180" y="76" font-size="11" font-weight="bold" fill="#0284c7" transform="rotate(33, 180, 76)">数据帧 (a+b)</text>

              <!-- 确认帧发送 (时延 c) + 反向传播 (时延 d) -->
              <polygon points="250,110 300,110 390,50 340,50" fill="rgba(5, 150, 105, 0.18)" stroke="#059669" stroke-width="1.2"/>
              <text x="320" y="86" font-size="11" font-weight="bold" fill="#059669" transform="rotate(-33, 320, 86)">确认帧 (c+d)</text>

              <!-- 下一数据帧 -->
              <polygon points="390,50 440,50 530,110 480,110" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" stroke-width="1.2"/>
              <text x="460" y="76" font-size="11" font-weight="bold" fill="#0284c7" transform="rotate(33, 460, 76)">数据帧 2</text>

              <!-- 时延标尺 (a, b, c, d) -->
              <!-- a: 发送时延 -->
              <line x1="110" y1="36" x2="160" y2="36" stroke="#0284c7" stroke-width="1.5"/>
              <line x1="110" y1="32" x2="110" y2="40" stroke="#0284c7" stroke-width="1"/>
              <line x1="160" y1="32" x2="160" y2="40" stroke="#0284c7" stroke-width="1"/>
              <text x="135" y="30" font-size="10" font-weight="bold" text-anchor="middle" fill="#0284c7">a: 发送</text>

              <!-- a+b+c+d 周期标尺 -->
              <rect x="110" y="125" width="280" height="12" rx="3" fill="rgba(245, 158, 11, 0.15)" stroke="#d97706" stroke-dasharray="2,2"/>
              <text x="250" y="134" font-size="10" font-weight="bold" text-anchor="middle" fill="#d97706">单帧往返总周期 T = a + b + c + d (信道利用率 U = a / T)</text>
            </g>

            <!-- ── B. 后退 N 帧 (GBN) 连续发送时序 ── -->
            <g transform="translate(10, 175)">
              <rect x="0" y="0" width="760" height="150" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-border)" stroke-width="1.2"/>
              <text x="20" y="24" font-size="12" font-weight="bold" fill="#059669">【模型 2】后退 N 帧 (GBN) 协议 · 流水线连续发送达到最高信道利用率</text>

              <!-- 实体标签 -->
              <rect x="20" y="38" width="60" height="24" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
              <text x="50" y="54" font-size="11" font-weight="bold" text-anchor="middle" fill="#0284c7">发送方</text>

              <rect x="20" y="98" width="60" height="24" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
              <text x="50" y="114" font-size="11" font-weight="bold" text-anchor="middle" fill="#059669">接收方</text>

              <!-- 时间轴 -->
              <line x1="90" y1="50" x2="740" y2="50" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrowhead-gbn)"/>
              <text x="735" y="44" font-size="10.5" fill="#64748b">t</text>

              <line x1="90" y1="110" x2="740" y2="110" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arrowhead-gbn)"/>
              <text x="735" y="104" font-size="10.5" fill="#64748b">t</text>

              <!-- 连续发送 1, 2, 3, ... 帧 -->
              <polygon points="110,50 140,50 230,110 200,110" fill="rgba(2, 132, 199, 0.25)" stroke="#0284c7" stroke-width="1"/>
              <polygon points="140,50 170,50 260,110 230,110" fill="rgba(2, 132, 199, 0.2)" stroke="#0284c7" stroke-width="1"/>
              <polygon points="170,50 200,50 290,110 260,110" fill="rgba(2, 132, 199, 0.2)" stroke="#0284c7" stroke-width="1"/>
              <polygon points="200,50 230,50 320,110 290,110" fill="rgba(2, 132, 199, 0.2)" stroke="#0284c7" stroke-width="1"/>
              <polygon points="230,50 260,50 350,110 320,110" fill="rgba(2, 132, 199, 0.2)" stroke="#0284c7" stroke-width="1"/>
              <polygon points="260,50 290,50 380,110 350,110" fill="rgba(2, 132, 199, 0.2)" stroke="#0284c7" stroke-width="1"/>
              <polygon points="290,50 320,50 410,110 380,110" fill="rgba(2, 132, 199, 0.2)" stroke="#0284c7" stroke-width="1"/>
              <polygon points="320,50 350,50 440,110 410,110" fill="rgba(2, 132, 199, 0.2)" stroke="#0284c7" stroke-width="1"/>
              <polygon points="350,50 380,50 470,110 440,110" fill="rgba(2, 132, 199, 0.2)" stroke="#0284c7" stroke-width="1"/>
              <polygon points="380,50 410,50 500,110 470,110" fill="rgba(2, 132, 199, 0.25)" stroke="#0284c7" stroke-width="1"/>

              <!-- 收到第 1 帧的确认 ACK 0 -->
              <polygon points="230,110 260,110 350,50 320,50" fill="rgba(5, 150, 105, 0.25)" stroke="#059669" stroke-width="1.2"/>
              <text x="290" y="80" font-size="10" font-weight="bold" fill="#059669" transform="rotate(-33, 290, 80)">ACK 0 到达</text>

              <!-- 连续发送不停歇指示 -->
              <line x1="110" y1="36" x2="350" y2="36" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3,2"/>
              <text x="230" y="32" font-size="10" font-weight="bold" text-anchor="middle" fill="#0284c7">发送窗口内连续发送 N 帧 (无需空闲等待)</text>

              <!-- 结论框 -->
              <rect x="360" y="42" width="380" height="95" rx="6" fill="var(--vp-c-bg-soft)" stroke="var(--vp-c-divider)"/>
              <text x="375" y="62" font-size="11" font-weight="bold" fill="#0284c7">💡 最高利用率判定公式 (408 必背)</text>
              <text x="375" y="82" font-size="10.5" fill="var(--vp-c-text-2)">① 往返周期：T_cycle = 发送时延 + 2×传播时延 + 确认时延</text>
              <text x="375" y="100" font-size="10.5" fill="var(--vp-c-text-2)">② 连续帧数：N = T_cycle / 发送时延 ➔ 窗口向上取整 W_T = ⌈N⌉</text>
              <text x="375" y="118" font-size="10.5" font-weight="bold" fill="#059669">③ 序号比特：W_T ≤ 2ⁿ - 1 ⟹ 2ⁿ ≥ W_T + 1 ⟹ n ≥ ⌈log₂(W_T + 1)⌉</text>
            </g>
          </svg>
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
                {{ isAckSameSize ? '切换为：确认帧很短(可忽略)' : '切换为：确认帧等长' }}
              </button>
            </div>
          </div>

          <!-- 右侧：动态计算结果面板 -->
          <div class="calc-results">
            <div class="res-title">🧮 实时推导指标面板</div>
            <div class="res-item">
              <span class="res-name">数据帧发送时延 ($t_{\text{tx}}$)：</span>
              <strong class="res-val">{{ computedTxDelay.toFixed(2) }} ms</strong>
            </div>
            <div class="res-item">
              <span class="res-name">确认帧发送时延 ($t_{\text{ack}}$)：</span>
              <strong class="res-val">{{ computedAckDelay.toFixed(2) }} ms</strong>
            </div>
            <div class="res-item">
              <span class="res-name">单帧往返总周期 ($T_{\text{cycle}}$)：</span>
              <strong class="res-val highlight">{{ computedTotalCycle.toFixed(2) }} ms</strong>
            </div>
            <div class="res-item">
              <span class="res-name">周期内可发帧数 ($N$)：</span>
              <strong class="res-val">{{ computedFramesInCycle.toFixed(4) }} 帧</strong>
            </div>
            <div class="res-item">
              <span class="res-name">最高利用率所需窗口 ($W_T$)：</span>
              <strong class="res-val highlight">≥ {{ computedRequiredWindow }}</strong>
            </div>
            <div class="res-item-final">
              <span class="res-name">GBN 最小帧序号比特数 ($n$)：</span>
              <strong class="res-val-final">{{ computedMinBits }} 位 (支持 $W_T \le {{ Math.pow(2, computedMinBits) - 1 }}$)</strong>
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
              数据帧长度范围是 128 ~ 512 字节。为使信道利用率在<strong>任何情况下均能达到最高</strong>，必须考虑<strong>发送时延最短（即连续发帧数量最多、所需发送窗口最大）的最不利极限情况</strong>，即取数据帧长 $L = 128	ext{ 字节}$。
            </li>
            <li>
              <strong>计算各阶段时延</strong>：<br>
              - 数据帧发送时延 $t_{\text{tx}} = \frac{128 \times 8\text{ bit}}{16000\text{ bps}} = \frac{1024}{16000}\text{ s} = 0.064\text{ s} = 64\text{ ms}$；<br>
              - 确认帧发送时延（题目说明与数据帧等长）：$t_{\text{ack}} = t_{\text{tx}} = 64\text{ ms}$；<br>
              - 信号单向传播时延：$t_{\text{prop}} = 270\text{ ms}$。
            </li>
            <li>
              <strong>计算单帧往返总周期</strong>：<br>
              发送一帧到收到其确认帧的总时间周期 $T_{\text{cycle}} = t_{\text{tx}} + t_{\text{prop}} + t_{\text{ack}} + t_{\text{prop}} = 64 + 270 + 64 + 270 = 668\text{ ms}$。
            </li>
            <li>
              <strong>计算周期内需连续发送的帧数</strong>：<br>
              为使信道利用率达到 $100\%$（信道无空闲等待），在该周期内连续发送的帧数需满足：<br>
              $$N = \frac{T_{\text{cycle}}}{t_{\text{tx}}} = \frac{668\text{ ms}}{64\text{ ms}} = 10.4375\text{ 帧}$$<br>
              因此，发送窗口大小必须向上取整：$W_T \ge 11$。
            </li>
            <li>
              <strong>求解帧序号比特数 $n$</strong>：<br>
              根据 GBN 协议窗口约束条件 $W_T \le 2^n - 1$，代入 $W_T = 11$：<br>
              $$11 \le 2^n - 1 \implies 2^n \ge 12 \implies n \ge 4$$<br>
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
