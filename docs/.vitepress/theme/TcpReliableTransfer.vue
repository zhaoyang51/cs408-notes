<template>
  <div class="tcp-rt-container">
    
    <!-- 顶部横幅 -->
    <div class="rt-header">
      <div class="header-left">
        <span class="badge-blue">🛡️ TCP 可靠传输机制</span>
        <h4 class="header-title">报文段序号 (Seq) 与 累计确认号 (ACK) 核心计算模型</h4>
      </div>
      <div class="rule-tag">
        累计确认原则：ACK = 已连续按序接收的最大字节序号 + 1
      </div>
    </div>

    <!-- 1. 2011 题 40 交互时序拓扑与报文载荷切片 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('topo')">
        <div class="header-title-box">
          <span class="card-icon">📡</span>
          <strong>甲 ➔ 乙 连续报文段发送、丢包与累计确认时序推导图</strong>
          <span class="badge-blue">时序推导</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.topo ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.topo" class="card-body">
        
        <!-- 核心通信时序图 (SVG 矢量高质感复刻图解) -->
        <div class="svg-seq-wrapper">
          <svg viewBox="0 0 840 320" class="rt-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7"/>
              </marker>
              <marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669"/>
              </marker>
            </defs>

            <!-- 顶部双向连接黄色宽条 -->
            <!-- 主机甲 -->
            <rect x="70" y="15" width="85" height="38" rx="6" fill="#06b6d4" stroke="#0891b2" stroke-width="1.5"/>
            <text x="112" y="38" font-size="13" font-weight="900" text-anchor="middle" fill="#ffffff">主机甲</text>

            <!-- 中间黄色连接条 -->
            <polygon points="170,25 660,25 675,34 660,43 170,43 155,34" fill="#eab308" stroke="#ca8a04" stroke-width="1.5"/>
            <text x="415" y="38" font-size="13.5" font-weight="900" text-anchor="middle" fill="#000000">已建立 TCP 连接</text>

            <!-- 主机乙 -->
            <rect x="675" y="15" width="85" height="38" rx="6" fill="#06b6d4" stroke="#0891b2" stroke-width="1.5"/>
            <text x="717" y="38" font-size="13" font-weight="900" text-anchor="middle" fill="#ffffff">主机乙</text>

            <!-- 甲乙垂直时间轴虚线 -->
            <line x1="112" y1="53" x2="112" y2="305" stroke="#06b6d4" stroke-width="2" stroke-dasharray="5,4"/>
            <line x1="717" y1="53" x2="717" y2="305" stroke="#06b6d4" stroke-width="2" stroke-dasharray="5,4"/>

            <!-- 报文段 1 (序号 200, 载荷 300B, 200..499) -->
            <!-- 传输斜线 -->
            <line x1="112" y1="95" x2="710" y2="105" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)"/>
            <!-- 报文方块 -->
            <g transform="translate(300, 65)">
              <rect x="0" y="0" width="160" height="28" fill="var(--vp-c-bg)" stroke="#0284c7" stroke-width="1.5"/>
              <text x="80" y="18" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">300 字节的数据载荷</text>
              <!-- 首部块 -->
              <rect x="160" y="0" width="75" height="28" fill="#0284c7"/>
              <text x="197" y="12" font-size="10" font-weight="bold" text-anchor="middle" fill="#fff">序号 = 200</text>
              <text x="197" y="24" font-size="9" font-weight="bold" text-anchor="middle" fill="#fff">首部</text>
              <!-- 两端字节序号标签 -->
              <text x="5" y="-4" font-size="10.5" font-weight="bold" fill="var(--vp-c-text-2)">499</text>
              <text x="175" y="-4" font-size="10.5" font-weight="bold" fill="var(--vp-c-text-2)">200</text>
            </g>

            <!-- 报文段 2 (序号 500, 载荷 400B, 500..899) -> 丢失 -->
            <!-- 传输断裂线 -->
            <line x1="112" y1="150" x2="570" y2="157" stroke="#0284c7" stroke-width="1.8"/>
            <!-- 报文方块 -->
            <g transform="translate(260, 120)">
              <rect x="0" y="0" width="190" height="28" fill="var(--vp-c-bg)" stroke="#0284c7" stroke-width="1.5"/>
              <text x="95" y="18" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">400 字节的数据载荷</text>
              <!-- 首部块 -->
              <rect x="190" y="0" width="75" height="28" fill="#0284c7"/>
              <text x="227" y="12" font-size="10" font-weight="bold" text-anchor="middle" fill="#fff">序号 = 500</text>
              <text x="227" y="24" font-size="9" font-weight="bold" text-anchor="middle" fill="#fff">首部</text>
              <!-- 序号标签 -->
              <text x="5" y="-4" font-size="10.5" font-weight="bold" fill="var(--vp-c-text-2)">899</text>
              <text x="205" y="-4" font-size="10.5" font-weight="bold" fill="var(--vp-c-text-2)">500</text>
            </g>
            <!-- 红色爆炸丢失图标 -->
            <g transform="translate(580, 140)">
              <path d="M 0,-15 L 6,-6 L 16,-10 L 11,0 L 18,8 L 8,9 L 6,18 L -1,11 L -10,16 L -7,6 L -16,1 L -8,-5 z" fill="#ef4444" stroke="#b91c1c" stroke-width="1"/>
              <text x="0" y="4" font-size="9.5" font-weight="900" text-anchor="middle" fill="#fff">丢失</text>
            </g>

            <!-- 报文段 3 (序号 900, 载荷 500B, 900..1399) -->
            <!-- 传输斜线 -->
            <line x1="112" y1="205" x2="710" y2="215" stroke="#0284c7" stroke-width="1.8" marker-end="url(#arrow-blue)"/>
            <!-- 报文方块 -->
            <g transform="translate(220, 175)">
              <rect x="0" y="0" width="220" height="28" fill="var(--vp-c-bg)" stroke="#0284c7" stroke-width="1.5"/>
              <text x="110" y="18" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">500 字节的数据载荷</text>
              <!-- 首部块 -->
              <rect x="220" y="0" width="75" height="28" fill="#0284c7"/>
              <text x="257" y="12" font-size="10" font-weight="bold" text-anchor="middle" fill="#fff">序号 = 900</text>
              <text x="257" y="24" font-size="9" font-weight="bold" text-anchor="middle" fill="#fff">首部</text>
              <!-- 序号标签 -->
              <text x="5" y="-4" font-size="10.5" font-weight="bold" fill="var(--vp-c-text-2)">1399</text>
              <text x="235" y="-4" font-size="10.5" font-weight="bold" fill="var(--vp-c-text-2)">900</text>
            </g>

            <!-- 乙回复确认段 (ACK = 500) -->
            <line x1="717" y1="245" x2="119" y2="280" stroke="#059669" stroke-width="2" marker-end="url(#arrow-green)"/>
            <!-- 确认块 -->
            <g transform="translate(370, 250)">
              <rect x="0" y="0" width="115" height="28" rx="4" fill="#059669"/>
              <text x="57" y="12" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#fff">确认序号 = 500</text>
              <text x="57" y="24" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#fff">首部</text>
            </g>

            <!-- 左侧绿色虚线弧与说明文字 -->
            <path d="M 112,95 C 40,130 40,240 112,280" fill="none" stroke="#059669" stroke-width="2" stroke-dasharray="5,4"/>
            <rect x="10" y="145" width="130" height="42" rx="4" fill="rgba(5,150,105,0.12)" stroke="#059669" stroke-width="1"/>
            <text x="75" y="162" font-size="10" font-weight="bold" text-anchor="middle" fill="#059669">这是对已接收</text>
            <text x="75" y="176" font-size="10" font-weight="bold" text-anchor="middle" fill="#059669">且按序到达的</text>
            <text x="75" y="190" font-size="10" font-weight="bold" text-anchor="middle" fill="#059669">最后一个报文段的确认！</text>

          </svg>
        </div>

      </div>
    </div>

    <!-- 2. 【2011 年 统考题 40】真题精讲卡片 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>【2011 年 统考题 40】TCP 报文段序号与确认号计算真题精解</strong>
          <span class="badge-green">真题演练</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam" class="card-body">
        <div class="exam-question">
          主机甲向主机乙连续发送了两个 TCP 报文段，其序号分别为 <code>200</code> 和 <code>500</code>。第一个报文段携带了 300 字节数据，第二个报文段携带了 400 字节数据。如果主机乙仅收到了第一个报文段，则主机乙发送给主机甲的确认报文段中，确认号字段的值以及主机甲重传报文段的序号分别为（&nbsp;&nbsp;&nbsp;&nbsp;）。
        </div>

        <!-- 交互式作答选项 (默认不标答案) -->
        <div class="quiz-interactive-box">
          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': quizRel.userAns === opt,
                'opt-correct': quizRel.revealed && opt === 'B',
                'opt-wrong': quizRel.revealed && quizRel.userAns === opt && opt !== 'B'
              }"
              @click="handleQuizRel(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'">300, 900</span>
                <span v-else-if="opt === 'B'">500, 500</span>
                <span v-else-if="opt === 'C'">500, 1400</span>
                <span v-else-if="opt === 'D'">1400, 1400</span>
              </div>
              <span v-if="quizRel.revealed && opt === 'B'" class="correct-badge">✔ 正确答案</span>
              <span v-else-if="quizRel.revealed && quizRel.userAns === opt && opt !== 'B'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="quizRel.revealed = !quizRel.revealed">
              {{ quizRel.revealed ? '🔒 隐藏答案与解析' : '💡 点击查看答案与深度解析' }}
            </button>
            <button v-if="quizRel.userAns || quizRel.revealed" class="quiz-btn btn-reset" type="button" @click="resetQuizRel">
              🔄 重新作答
            </button>
          </div>
        </div>

        <div v-show="quizRel.revealed" class="exam-analysis">
          <div class="analysis-title">🔍 核心推导步骤（推导过程）：</div>
          <ol class="analysis-list">
            <li><strong>确认号确认的是期望收到的下一个字节序号</strong>：第一个报文段序号为 200，包含 300 字节（字节范围 200~499）。乙成功接收后，期望收到的下一个字节序号为 <code>200 + 300 = 500</code>，因此确认号 <code>ack = 500</code>。</li>
            <li><strong>重传报文段的序号</strong>：第二个报文段（序号 500，400 字节，字节范围 500~899）丢失未被乙接收，超时后甲必须从丢失的字节起点开始重传，故重传报文段的序号仍为 <code>seq = 500</code>。</li>
            <li><strong>结论</strong>：确认号为 500，重传序号为 500，正确答案选 <strong>B</strong>。</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- 3. 核心知识点延伸：序号与确认号 4 大黄金法则 (支持折叠) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('rules')">
        <div class="header-title-box">
          <span class="card-icon">💡</span>
          <strong>TCP 序号 (seq) 与 确认号 (ack) 4 大黄金法则</strong>
          <span class="badge-amber">必背概念</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.rules ? '收起 ▲' : '展开法则 ▼' }}
        </button>
      </div>

      <div v-show="openSections.rules" class="card-body">
        <div class="rules-grid">
          <div class="rule-box">
            <div class="r-title">1. 序号 (seq)</div>
            <div class="r-desc">占 32 位。本 TCP 报文段所发送数据的<strong>第 1 个字节的序号</strong>。TCP 是面向字节流的，每个字节都有唯一编号。</div>
          </div>

          <div class="rule-box">
            <div class="r-title">2. 确认号 (ack)</div>
            <div class="r-desc">占 32 位。<strong>期望收到对方下一个报文段的第 1 个数据字节的序号</strong>。若确认号为 <i class="m-var">N</i>，表明到序号 <i class="m-var">N - 1</i> 为止的所有数据已全部正确收到。</div>
          </div>

          <div class="rule-box">
            <div class="r-title">3. 确认控制位 ACK</div>
            <div class="r-desc">占 1 位。仅当 <strong>ACK = 1</strong> 时确认号字段才有效。TCP 规定，在连接建立后的所有传送报文段中都必须将 ACK 置 1。</div>
          </div>

          <div class="rule-box">
            <div class="r-title">4. 累计确认与失序处理</div>
            <div class="r-desc">TCP 默认使用<strong>累计确认</strong>，对失序到达的分组暂存在接收缓存中，但确认号<strong>绝不向前跨越跳过缺失的报文段</strong>。</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive , onMounted, onUnmounted} from 'vue'

const quizRel = reactive({ userAns: null, revealed: false })
const handleQuizRel = (opt) => {
  quizRel.userAns = opt
  quizRel.revealed = true
}
const resetQuizRel = () => {
  quizRel.userAns = null
  quizRel.revealed = false
}

const openSections = reactive({
  topo: false,   // 默认展开时序图
  exam: false,   // 默认展开真题
  rules: false  // 默认收起法则
})

const toggle = (key) => {
  openSections[key] = !openSections[key]
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
.tcp-rt-container {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 顶部栏 */
.rt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 10px 14px;
  flex-wrap: wrap;
  gap: 8px;
  box-shadow: var(--card-shadow);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
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

.header-title {
  font-size: 13.5px;
  font-weight: 800;
  margin: 0;
  color: var(--vp-c-text-1);
}

.rule-tag {
  background: var(--vp-c-bg);
  border: 1px dashed var(--vp-c-border);
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11.5px;
  color: #059669;
  font-weight: 700;
}

/* 可折叠卡片 */
.collapsible-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--vp-c-bg-elv);
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}

.card-header:hover {
  background: var(--vp-c-bg);
}

.header-title-box {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.badge-green, .badge-amber {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.badge-green { background: rgba(16, 185, 129, 0.12); color: #059669; }
.badge-amber { background: rgba(245, 158, 11, 0.15); color: #d97706; }

.toggle-btn {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  cursor: pointer;
}

.card-body {
  padding: 12px 14px;
  border-top: 1px solid var(--vp-c-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* SVG 容器 */
.svg-seq-wrapper {
  width: 100%;
  overflow-x: auto;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 10px;
}

.rt-svg {
  width: 100%;
  min-width: 760px;
  height: auto;
  display: block;
}

/* 数学变量 */
.m-var {
  font-family: 'Times New Roman', 'Cambria Math', 'KaTeX_Math', serif;
  font-style: italic;
  font-weight: 700;
  padding: 0 1px;
}

/* 真题 */
.exam-question {
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  padding: 10px 12px;
  border-radius: 6px;
  border-left: 3px solid #2563eb;
}

.exam-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

@media (max-width: 640px) {
  .exam-options {
    grid-template-columns: repeat(2, 1fr);
  }
}

.opt-item {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.opt-correct {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.correct-badge {
  font-size: 10px;
  background: #10b981;
  color: #ffffff;
  padding: 1px 4px;
  border-radius: 3px;
}

.exam-analysis {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 10px 12px;
}

.analysis-title {
  font-size: 12px;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 6px;
}

.analysis-list {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  padding-left: 18px;
  margin: 0;
}

.analysis-list li { margin-bottom: 4px; }
.analysis-list strong { color: var(--vp-c-text-1); }

/* 法则网格 */
.rules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (max-width: 768px) {
  .rules-grid {
    grid-template-columns: 1fr;
  }
}

.rule-box {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.r-title {
  font-size: 12px;
  font-weight: 800;
  color: #059669;
}

.r-desc {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
