<template>
  <div class="csmaca-container">
    <!-- 顶部横幅 -->
    <div class="sim-header">
      <div class="header-left">
        <span class="badge-blue">📡 IEEE 802.11 协议族</span>
        <h4 class="header-title">CSMA/CA 碰撞避免机制、帧间间隔 (IFS) 与 RTS/CTS 时序全景</h4>
      </div>
      <div class="formula-tag">
        帧间隙优先级铁律：SIFS (最短) &lt; PIFS &lt; DIFS (最长) ➔ 首帧发前等 DIFS，连续应答等 SIFS
      </div>
    </div>

    <!-- 1. 核心时序图解 (深度复刻 802.11 RTS/CTS 与数据传输交互时序) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('diagram')">
        <div class="header-title-box">
          <span class="card-icon">📐</span>
          <strong>CSMA/CA 完整预约与传输时序图 (RTS ➔ CTS ➔ DATA ➔ ACK)</strong>
          <span class="badge-blue">时序模型</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.diagram ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.diagram" class="card-body">
        <div class="diagram-wrapper">
          <svg viewBox="0 0 880 340" class="sim-svg">
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
            <g transform="translate(150, 15)">
              <rect x="-35" y="0" width="70" height="26" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="0" y="18" font-size="12" font-weight="bold" text-anchor="middle" fill="#0284c7">💻 主机 H</text>
            </g>

            <!-- 接收接入点 AP (目的端) -->
            <g transform="translate(560, 15)">
              <rect x="-35" y="0" width="70" height="26" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.2"/>
              <text x="0" y="18" font-size="12" font-weight="bold" text-anchor="middle" fill="#059669">📡 AP / 接收方</text>
            </g>

            <!-- 垂直时间轴 -->
            <line x1="150" y1="48" x2="150" y2="310" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#ca-arrow)"/>
            <line x1="560" y1="48" x2="560" y2="310" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#ca-arrow)"/>
            <text x="135" y="325" font-size="12" font-weight="bold" fill="#64748b">时间 t</text>
            <text x="545" y="325" font-size="12" font-weight="bold" fill="#64748b">时间 t</text>

            <!-- 1. IFS1: DIFS 帧间隙 (最长) -->
            <line x1="130" y1="52" x2="130" y2="82" stroke="#d97706" stroke-width="2.5"/>
            <text x="75" y="70" font-size="11.5" font-weight="bold" fill="#d97706">IFS1 (DIFS)</text>
            <text x="60" y="85" font-size="10" fill="#92400e">【最长帧间隔】</text>

            <!-- RTS 帧 (H -> AP) -->
            <polygon points="150,82 150,96 560,118 560,104" fill="url(#rtsGrad)" stroke="#0284c7" stroke-width="1"/>
            <text x="355" y="104" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">RTS (请求发送，含预约时长)</text>

            <!-- 2. IFS2: SIFS (AP 发送 CTS 前等待) -->
            <line x1="580" y1="118" x2="580" y2="136" stroke="#059669" stroke-width="2.5"/>
            <text x="590" y="130" font-size="11.5" font-weight="bold" fill="#059669">IFS2 (SIFS 短间隙)</text>

            <!-- CTS 帧 (AP -> H) -->
            <polygon points="560,136 560,150 150,172 150,158" fill="url(#ctsGrad)" stroke="#059669" stroke-width="1"/>
            <text x="355" y="158" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">CTS (允许发送，广播给所有邻居)</text>

            <!-- 3. IFS3: SIFS (H 发送 DATA 前等待) -->
            <line x1="130" y1="172" x2="130" y2="190" stroke="#059669" stroke-width="2.5"/>
            <text x="65" y="184" font-size="11.5" font-weight="bold" fill="#059669">IFS3 (SIFS 短间隙)</text>

            <!-- DATA 数据帧 (H -> AP) -->
            <polygon points="150,190 150,240 560,262 560,212" fill="url(#dataGrad)" stroke="#2563eb" stroke-width="1"/>
            <text x="355" y="232" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">DATA 数据帧 (总时长 t_data = L / C)</text>

            <!-- 4. IFS4: SIFS (AP 发送 ACK 前等待) -->
            <line x1="580" y1="262" x2="580" y2="280" stroke="#059669" stroke-width="2.5"/>
            <text x="590" y="274" font-size="11.5" font-weight="bold" fill="#059669">IFS4 (SIFS 短间隙)</text>

            <!-- ACK 确认帧 (AP -> H) -->
            <polygon points="560,280 560,294 150,316 150,302" fill="url(#ackGrad)" stroke="#047857" stroke-width="1"/>
            <text x="355" y="301" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">ACK 确认帧 (表示数据正确接收)</text>

            <!-- 右侧核心考点总结框 -->
            <g transform="translate(670, 50)">
              <rect x="0" y="0" width="190" height="235" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
              <text x="12" y="24" font-size="12" font-weight="bold" fill="#0284c7">📌 408 核心考点口诀：</text>
              <line x1="12" y1="34" x2="178" y2="34" stroke="#e2e8f0" stroke-width="1"/>
              
              <text x="12" y="55" font-size="11" font-weight="bold" fill="#d97706">① 帧间隔长度排序：</text>
              <text x="16" y="73" font-size="11" font-weight="900" fill="#d97706">SIFS &lt; PIFS &lt; DIFS</text>
              
              <text x="12" y="102" font-size="11" font-weight="bold" fill="#334155">② 为什么 IFS1 最长？</text>
              <text x="16" y="120" font-size="10.5" fill="#64748b">源站发起新对话</text>
              <text x="16" y="136" font-size="10.5" fill="#64748b">必须等待 DIFS 监听</text>

              <text x="12" y="165" font-size="11" font-weight="bold" fill="#334155">③ 为什么后续等 SIFS？</text>
              <text x="16" y="183" font-size="10.5" fill="#059669">CTS、DATA、ACK 为</text>
              <text x="16" y="199" font-size="10.5" fill="#059669">最高优先级连续响应，</text>
              <text x="16" y="215" font-size="10.5" fill="#059669">防止其他站点插队打断！</text>
            </g>
          </svg>
        </div>

        <!-- 3 大关键机制速查卡片 -->
        <div class="info-cards-grid">
          <div class="info-card">
            <div class="ic-header">
              <span class="ic-badge">机制 1</span>
              <strong>帧间间隔 (IFS) 体系</strong>
            </div>
            <div class="ic-body">
              <p>• <strong>SIFS (短帧间隙)</strong>：最短，用于 CTS、ACK 及连续分片帧；</p>
              <p>• <strong>PIFS (点协调间隙)</strong>：中等，用于 AP 轮询控制；</p>
              <p>• <strong>DIFS (分布式协调间隙)</strong>：最长，用于站点发起数据帧/RTS 前争用信道。</p>
            </div>
          </div>

          <div class="info-card">
            <div class="ic-header">
              <span class="ic-badge">机制 2</span>
              <strong>隐蔽站与 RTS/CTS 握手</strong>
            </div>
            <div class="ic-body">
              <p>• <strong>隐蔽站问题</strong>：A 和 C 互相听不到彼此，但同时向 B 发送数据导致碰撞；</p>
              <p>• <strong>解决</strong>：A 发 RTS 请求 ➔ B 广播 CTS 允许 ➔ C 收到 CTS 后设置 <strong>NAV (网络分配向量)</strong> 静默等待。</p>
            </div>
          </div>

          <div class="info-card">
            <div class="ic-header">
              <span class="ic-badge">机制 3</span>
              <strong>确认机制与退避算法</strong>
            </div>
            <div class="ic-body">
              <p>• <strong>必须有 ACK</strong>：无线信道误码率高，802.11 规定数据链路层必须对每个单播数据帧进行 ACK 确认；</p>
              <p>• <strong>退避计时</strong>：信道忙时冻结退避计数器，信道空闲持续 DIFS 后继续倒计时。</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 动态参数实验台：CSMA/CA 传输耗时计算 -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('calc')">
        <div class="header-title-box">
          <span class="card-icon">⚡</span>
          <strong>动态时延计算实验台：实时推导数据发送时延与确认最小耗时</strong>
          <span class="badge-green">参数调节</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.calc ? '收起 ▲' : '展开实验台 ▼' }}
        </button>
      </div>

      <div v-show="openSections.calc" class="card-body">
        <div class="calc-grid">
          <div class="calc-controls">
            <div class="param-row">
              <label class="param-label">
                <span>数据传输速率 (C):</span>
                <strong>{{ calcRate }} Mbps</strong>
              </label>
              <input type="range" v-model.number="calcRate" min="54" max="600" step="6" class="param-slider"/>
            </div>

            <div class="param-row">
              <label class="param-label">
                <span>数据帧长度 (L):</span>
                <strong>{{ calcFrameSize }} 字节 ({{ calcFrameSize * 8 }} bit)</strong>
              </label>
              <input type="range" v-model.number="calcFrameSize" min="500" max="2312" step="50" class="param-slider"/>
            </div>

            <div class="param-row">
              <label class="param-label">
                <span>短帧间隙 SIFS:</span>
                <strong>{{ calcSifs }} μs</strong>
              </label>
              <input type="range" v-model.number="calcSifs" min="10" max="50" step="2" class="param-slider"/>
            </div>

            <div class="param-row">
              <label class="param-label">
                <span>分布式帧间隙 DIFS:</span>
                <strong>{{ calcDifs }} μs</strong>
              </label>
              <input type="range" v-model.number="calcDifs" min="50" max="200" step="5" class="param-slider"/>
            </div>
          </div>

          <div class="calc-results">
            <div class="res-title">🧮 实时推导时延指标</div>
            <div class="res-item">
              <span class="res-name">数据帧发送时延 (<i>t</i><sub>data</sub> = <i>L</i> / <i>C</i>)：</span>
              <strong class="res-val">{{ computedDataTx.toFixed(2) }} μs</strong>
            </div>
            <div class="res-item">
              <span class="res-name">接收端等待 ACK 间隔 (SIFS)：</span>
              <strong class="res-val">{{ calcSifs }} μs</strong>
            </div>
            <div class="res-item-final">
              <span class="res-name">从开始发送数据帧至确认收到最小时间：</span>
              <strong class="res-val-final">{{ (computedDataTx + calcSifs).toFixed(2) }} μs</strong>
            </div>
            <p class="res-note">
              💡 公式：<i>T</i><sub>min</sub> = <i>t</i><sub>data</sub> + SIFS（忽略传播时延与 ACK 发送时延时）
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 【408 核心真题精练】交互式自测刷题 (2 道经典真题) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>【408 统考真题精选】CSMA/CA 传输时延与帧间隔 (IFS) 深度真题精解</strong>
          <span class="badge-green">真题演练 (2题)</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam" class="card-body">
        
        <!-- ── 题 1：CSMA/CA 传输总耗时计算 ── -->
        <div class="quiz-block">
          <div class="exam-question">
            <span class="q-badge">真题 1</span>
            假设采用 CSMA/CA 的 IEEE 802.11 无线局域网，其数据传输速率为 <strong>300 Mbps</strong>，DIFS = <strong>128 μs</strong>，SIFS = <strong>28 μs</strong>。忽略除数据帧以外的其他帧的传输时延及信号传播时延，主机 H 发送一个总长度为 <strong>1500 B</strong> 的数据帧，则从<strong>开始发送数据帧</strong>至<strong>确认接收方收到</strong>所需的时间至少为（&nbsp;&nbsp;&nbsp;&nbsp;）。
          </div>

          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': quiz1.userAns === opt,
                'opt-correct': quiz1.revealed && opt === 'B',
                'opt-wrong': quiz1.revealed && quiz1.userAns === opt && opt !== 'B'
              }"
              @click="handleQuiz1(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'">40 μs</span>
                <span v-else-if="opt === 'B'">68 μs</span>
                <span v-else-if="opt === 'C'">168 μs</span>
                <span v-else-if="opt === 'D'">196 μs</span>
              </div>
              <span v-if="quiz1.revealed && opt === 'B'" class="correct-badge">✔ 正确答案</span>
              <span v-else-if="quiz1.revealed && quiz1.userAns === opt && opt !== 'B'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="quiz1.revealed = !quiz1.revealed">
              {{ quiz1.revealed ? '🔒 隐藏解析' : '💡 查看答案与分步解析' }}
            </button>
            <button v-if="quiz1.userAns || quiz1.revealed" class="quiz-btn btn-reset" type="button" @click="resetQuiz1">
              🔄 重新作答
            </button>
          </div>

          <div v-show="quiz1.revealed" class="exam-analysis">
            <div class="analysis-title">🔍 核心推导解析：</div>
            <ol class="analysis-list">
              <li>
                <strong>审题关键（审清起止时间点）</strong>：<br>
                题目明确询问的是「从<strong>开始发送数据帧</strong>」至「<strong>确认接收方收到</strong>」所需的时间。因此在数据帧发送之前等待的 <strong>DIFS（128 μs）以及退避时间均不计入</strong>此阶段！
              </li>
              <li>
                <strong>计算数据帧发送时延</strong>：<br>
                数据帧长 $L = 1500\text{ 字节} = 1500 \times 8\text{ bit} = 12000\text{ bit}$；<br>
                数据率 $C = 300\text{ Mbps} = 300\text{ bit}/\mu\text{s}$；<br>
                数据帧发送时延 $t_{\text{data}} = \frac{12000\text{ bit}}{300\text{ bit}/\mu\text{s}} = \mathbf{40\ \mu\text{s}}$。
              </li>
              <li>
                <strong>接收方处理与等待时延</strong>：<br>
                接收方正确接收数据帧后，必须等待一个短帧间隙 <strong>SIFS = 28 μs</strong> 才能开始发送 ACK 帧；<br>
                题目明确说明「忽略除数据帧以外的其他帧传输时延及信号传播时延」，故 ACK 发送时延与往返传播时延均计为 0。
              </li>
              <li>
                <strong>求和得出最短总时间</strong>：<br>
                $T_{\min} = t_{\text{data}} + \text{SIFS} = 40\ \mu\text{s} + 28\ \mu\text{s} = \mathbf{68\ \mu\text{s}}$（<strong>正确答案：B</strong>）。
              </li>
            </ol>
          </div>
        </div>

        <hr class="quiz-divider" />

        <!-- ── 题 2：802.11 帧间隙 IFS 辨析 ── -->
        <div class="quiz-block">
          <div class="exam-question">
            <span class="q-badge">真题 2 (2018 统考题 37)</span>
            某 IEEE 802.11 无线局域网中主机 H 与 AP 之间发送或接收 CSMA/CA 帧的过程如下：主机 H 发送 RTS 前等待 IFS1；AP 收到 RTS 后等待 IFS2 发送 CTS；主机 H 收到 CTS 后等待 IFS3 发送 DATA；AP 收到 DATA 后等待 IFS4 发送 ACK。在 H 或 AP 发送帧前所等待的帧间隔时间 (IFS) 中<strong>最长</strong>的是（&nbsp;&nbsp;&nbsp;&nbsp;）。
          </div>

          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': quiz2.userAns === opt,
                'opt-correct': quiz2.revealed && opt === 'A',
                'opt-wrong': quiz2.revealed && quiz2.userAns === opt && opt !== 'A'
              }"
              @click="handleQuiz2(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'">IFS1</span>
                <span v-else-if="opt === 'B'">IFS2</span>
                <span v-else-if="opt === 'C'">IFS3</span>
                <span v-else-if="opt === 'D'">IFS4</span>
              </div>
              <span v-if="quiz2.revealed && opt === 'A'" class="correct-badge">✔ 正确答案</span>
              <span v-else-if="quiz2.revealed && quiz2.userAns === opt && opt !== 'A'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="quiz2.revealed = !quiz2.revealed">
              {{ quiz2.revealed ? '🔒 隐藏解析' : '💡 查看答案与分步解析' }}
            </button>
            <button v-if="quiz2.userAns || quiz2.revealed" class="quiz-btn btn-reset" type="button" @click="resetQuiz2">
              🔄 重新作答
            </button>
          </div>

          <div v-show="quiz2.revealed" class="exam-analysis">
            <div class="analysis-title">🔍 核心推导解析：</div>
            <ol class="analysis-list">
              <li>
                <strong>IFS 种类与作用分析</strong>：<br>
                • <strong>IFS1</strong>：主机 H 初次发起对话发送 RTS 帧，此时属于争用信道阶段，必须等待分布式协调帧间距 <strong>DIFS</strong>；<br>
                • <strong>IFS2</strong>：AP 发送 CTS 帧，属于同一对话的连续响应，等待短帧间距 <strong>SIFS</strong>；<br>
                • <strong>IFS3</strong>：主机 H 收到 CTS 后立即发送 DATA 数据帧，等待 <strong>SIFS</strong>；<br>
                • <strong>IFS4</strong>：AP 收到 DATA 后立即发送 ACK 确认帧，等待 <strong>SIFS</strong>。
              </li>
              <li>
                <strong>帧间距长度比较</strong>：<br>
                根据 IEEE 802.11 规范：$\text{SIFS} < \text{PIFS} < \text{DIFS}$。<br>
                因为 SIFS 是最短的帧间距（赋予最高优先级以防中途被打断），而 DIFS 是最长的帧间距，故 <strong>IFS1 (DIFS) 最长</strong>（<strong>正确答案：A</strong>）。
              </li>
            </ol>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const openSections = reactive({
  diagram: true,
  calc: false,
  exam: true
})

const toggle = (sec) => {
  openSections[sec] = !openSections[sec]
}

// 实验台状态
const calcRate = ref(300) // Mbps
const calcFrameSize = ref(1500) // Bytes
const calcSifs = ref(28) // us
const calcDifs = ref(128) // us

const computedDataTx = computed(() => {
  return (calcFrameSize.value * 8) / calcRate.value
})

// 题 1 状态
const quiz1 = reactive({
  userAns: null,
  revealed: false
})

const handleQuiz1 = (opt) => {
  quiz1.userAns = opt
  quiz1.revealed = true
}

const resetQuiz1 = () => {
  quiz1.userAns = null
  quiz1.revealed = false
}

// 题 2 状态
const quiz2 = reactive({
  userAns: null,
  revealed: false
})

const handleQuiz2 = (opt) => {
  quiz2.userAns = opt
  quiz2.revealed = true
}

const resetQuiz2 = () => {
  quiz2.userAns = null
  quiz2.revealed = false
}
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
  min-width: 780px;
  height: auto;
  display: block;
}

.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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

/* 实验台 */
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
  font-size: 16px;
  font-weight: 800;
  color: #059669;
}

.res-note {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
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
