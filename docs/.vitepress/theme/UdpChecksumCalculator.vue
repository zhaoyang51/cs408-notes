<template>
  <div class="udp-calc-container">
    
    <!-- 顶部标题横幅 -->
    <div class="udp-header">
      <div class="header-left">
        <span class="badge-indigo">⚡ UDP 用户数据报协议</span>
        <h4 class="header-title">UDP 首部格式、伪首部与二进制反码求和（Checksum）全景</h4>
      </div>
      <div class="rule-tag">
        核心法则：二进制加法 ➔ 最高位溢出循环进位(+1) ➔ 按位取反得校验和
      </div>
    </div>

    <!-- 1. UDP 首部 8 字节与伪首部 12 字节全景图 -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('structure')">
        <div class="header-title-box">
          <span class="card-icon">📦</span>
          <strong>UDP 首部（固定 8 字节）与伪首部（12 字节）结构图解</strong>
          <span class="badge-blue">结构全景</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.structure ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.structure" class="card-body">
        <div class="structure-grid">
          
          <!-- 伪首部 12 字节 (仅用于计算校验和，不向网络发送) -->
          <div class="pseudo-header-box">
            <div class="box-title">
              <span class="badge-purple">临时结构</span>
              <strong>UDP 伪首部（12 字节 · 仅用于计算与检验校验和）</strong>
            </div>
            <div class="pseudo-fields">
              <div class="field-item f-ip">源 IP 地址 (4 字节 / 32 位)</div>
              <div class="field-item f-ip">目的 IP 地址 (4 字节 / 32 位)</div>
              <div class="field-item f-zero">全 0 (1B)</div>
              <div class="field-item f-proto">协议号 17 (1B, UDP=17)</div>
              <div class="field-item f-len">UDP 长度 (2 字节)</div>
            </div>
            <div class="field-note">
              💡 <strong>伪首部作用</strong>：使 UDP 能够同时校验源/目的 IP 是否发生差错，防止误交付。发送和接收时临时生成，<strong>绝不真正封装到 IP 数据报中发送</strong>！
            </div>
          </div>

          <!-- UDP 真正首部 8 字节 -->
          <div class="real-header-box">
            <div class="box-title">
              <span class="badge-emerald">真实首部</span>
              <strong>UDP 首部（固定 8 字节 · 4 个字段各 2 字节）</strong>
            </div>
            <div class="real-fields">
              <div class="field-item f-port">源端口 (2 字节)</div>
              <div class="field-item f-port">目的端口 (2 字节)</div>
              <div class="field-item f-len2">长度 (2 字节, ≥ 8B)</div>
              <div class="field-item f-chk">校验和 (2 字节, 全0则不校验)</div>
            </div>
            <div class="field-note">
              💡 <strong>校验和字段特点</strong>：
              1. 计算前置为 0；
              2. 若数据部分字节数为奇数，末尾<strong>临时补填 1 字节全 0</strong>（不发送）；
              3. 若不计算校验和，该字段填全 0；若计算结果恰为全 0，则填全 1。
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 2. 【2024 年 统考题 39】真题精析卡片 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam39')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>【2024 年 统考题 39】UDP 校验和二进制反码求和计算真题精解</strong>
          <span class="badge-green">2024 统考真题</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam39 ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam39" class="card-body">
        <div class="exam-question">
          <span class="q-badge">【2024 年 题 39 · 2 分】</span>
          若 UDP 协议在计算校验和过程中，计算机得到中间结果为 <code>1011 1001 1011 0110</code> 时，还需要加上最后一个 16 位数 <code>0110 0101 1100 0101</code>，则最终计算得到的校验和是（&nbsp;&nbsp;&nbsp;&nbsp;）。
        </div>

        <!-- 推荐 Bilibili 视频链接 -->
        <div class="video-ref-bar">
          <span class="video-icon">📺</span>
          <span class="video-label">推荐视频精析：</span>
          <a 
            href="https://www.bilibili.com/video/BV1VE411A7Ak/?t=4394.7&p=16&vd_source=82d10a6ac42fc540b554068775f4bb8d" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="video-link"
          >
            【2024年 题39】UDP 二进制反码求和校验和计算（溢出循环进位+按位取反）_哔哩哔哩 ↗
          </a>
        </div>

        <!-- 交互式作答 -->
        <div class="quiz-interactive-box">
          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': quizExam39.userAns === opt,
                'opt-correct': quizExam39.revealed && opt === 'C',
                'opt-wrong': quizExam39.revealed && quizExam39.userAns === opt && opt !== 'C'
              }"
              @click="handleQuizExam39(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'"><code>0001 1111 0111 1011</code></span>
                <span v-else-if="opt === 'B'"><code>0001 1111 0111 1100</code></span>
                <span v-else-if="opt === 'C'"><code>1110 0000 1000 0011</code></span>
                <span v-else-if="opt === 'D'"><code>1110 0000 1000 0100</code></span>
              </div>
              <span v-if="quizExam39.revealed && opt === 'C'" class="correct-badge">✔ 正确答案</span>
              <span v-else-if="quizExam39.revealed && quizExam39.userAns === opt && opt !== 'C'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="quizExam39.revealed = !quizExam39.revealed">
              {{ quizExam39.revealed ? '🔒 隐藏答案与解析' : '💡 点击查看答案与反码求和三步推导' }}
            </button>
            <button v-if="quizExam39.userAns || quizExam39.revealed" class="quiz-btn btn-reset" type="button" @click="resetQuizExam39">
              🔄 重新作答
            </button>
          </div>
        </div>

        <!-- 详细分步推导解析 -->
        <div v-show="quizExam39.revealed" class="exam-analysis">
          <div class="analysis-title">🔍 反码求和计算三步法（标准解题过程）：</div>
          
          <div class="calc-step-box">
            
            <!-- 步骤 1 -->
            <div class="step-card">
              <div class="step-head">
                <span class="step-num">Step 1</span>
                <strong>两 16 位数普通二进制加法</strong>
              </div>
              <div class="binary-math-display">
                <div class="math-line">&nbsp;&nbsp;1011 1001 1011 0110 &nbsp;&nbsp;(中间和 0xB9B6)</div>
                <div class="math-line">+ 0110 0101 1100 0101 &nbsp;&nbsp;(加数 0x65C5)</div>
                <div class="math-divider"></div>
                <div class="math-line highlight-carry">
                  <span class="carry-flag">[1]</span> 0001 1111 0111 1011 &nbsp;&nbsp;(最高位产生了进位 1)
                </div>
              </div>
            </div>

            <!-- 步骤 2 -->
            <div class="step-card">
              <div class="step-head">
                <span class="step-num">Step 2</span>
                <strong>最高位溢出循环进位（End-around Carry，末位 + 1）</strong>
              </div>
              <div class="binary-math-display">
                <div class="math-line">&nbsp;&nbsp;0001 1111 0111 1011</div>
                <div class="math-line">+ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;(加上溢出的最高位 1)</div>
                <div class="math-divider"></div>
                <div class="math-line highlight-sum">
                  =&nbsp;<strong>0001 1111 0111 1100</strong> &nbsp;&nbsp;(此时为累加和，对应选项 B 陷阱！)
                </div>
              </div>
            </div>

            <!-- 步骤 3 -->
            <div class="step-card">
              <div class="step-head">
                <span class="step-num">Step 3</span>
                <strong>求反码（按位取反）：0 变 1，1 变 0 写入校验和字段</strong>
              </div>
              <div class="binary-math-display">
                <div class="math-line">&nbsp;&nbsp;~ (0001 1111 0111 1100)</div>
                <div class="math-divider"></div>
                <div class="math-line highlight-ans">
                  =&nbsp;<strong>1110 0000 1000 0011</strong> &nbsp;&nbsp;(最终校验和 Checksum)
                </div>
              </div>
            </div>

          </div>

          <div class="trap-warning-box">
            ⚠️ <strong>408 经典高频陷阱警示（全网掌握率仅 57% 的失分原因）</strong>：<br>
            • <strong>陷阱 1（选 A）</strong>：加法后直接丢弃最高位进位，且忘记取反；<br>
            • <strong>陷阱 2（选 B）</strong>：正确执行了循环进位（末位 +1），但<strong>忘记了最后一步“按位取反”</strong>！选项 B 是累加和而不是校验和；<br>
            • <strong>正解（选 C）</strong>：严格完成「二进制加法 ➔ 溢出进位加到末尾 ➔ 按位取反」三步，得出 <code>1110 0000 1000 0011</code>。
          </div>
        </div>
      </div>
    </div>

    <!-- 3. UDP 校验和自定义互动演练器 -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('sim')">
        <div class="header-title-box">
          <span class="card-icon">🧮</span>
          <strong>UDP 二进制反码求和动态演练器（支持任意 16 位二进制数实时推导）</strong>
          <span class="badge-purple">互动演练</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.sim ? '收起 ▲' : '展开演练器 ▼' }}
        </button>
      </div>

      <div v-show="openSections.sim" class="card-body">
        <div class="sim-controls">
          <div class="input-group">
            <label>16 位二进制数 A（或预设真题）：</label>
            <input v-model="simInputA" class="sim-input" maxlength="19" placeholder="例如: 1011 1001 1011 0110" />
          </div>
          <div class="input-group">
            <label>16 位二进制数 B：</label>
            <input v-model="simInputB" class="sim-input" maxlength="19" placeholder="例如: 0110 0101 1100 0101" />
          </div>
          <div class="sim-btn-row">
            <button class="quiz-btn btn-toggle" type="button" @click="loadPreset2024">
              📌 载入 2024 年题 39 数据
            </button>
            <button class="quiz-btn btn-reset" type="button" @click="loadPresetRandom">
              🎲 随机生成两组 16 位字
            </button>
          </div>
        </div>

        <!-- 实时计算结果展示 -->
        <div class="sim-result-box" v-if="simCalcResult">
          <div class="res-row">
            <span class="res-label">普通加法和（17位）：</span>
            <code class="res-code">{{ simCalcResult.rawSumStr }}</code>
          </div>
          <div class="res-row">
            <span class="res-label">循环进位状态：</span>
            <span :class="simCalcResult.hasCarry ? 'carry-yes' : 'carry-no'">
              {{ simCalcResult.hasCarry ? '最高位溢出 1 ➔ 已回卷加至末位 (+1)' : '最高位无溢出 ➔ 无需回卷' }}
            </span>
          </div>
          <div class="res-row">
            <span class="res-label">累加和（Sum）：</span>
            <code class="res-code">{{ simCalcResult.sumStr }}</code>
          </div>
          <div class="res-row highlight-final">
            <span class="res-label">最终校验和 Checksum（取反码）：</span>
            <code class="res-code-bold">{{ simCalcResult.checksumStr }}</code>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'

const openSections = reactive({
  structure: true,
  exam39: true,
  sim: false
})

const toggle = (sec) => {
  openSections[sec] = !openSections[sec]
}

// 2024 题 39 作答状态
const quizExam39 = reactive({
  userAns: null,
  revealed: false
})

const handleQuizExam39 = (opt) => {
  quizExam39.userAns = opt
  quizExam39.revealed = true
}

const resetQuizExam39 = () => {
  quizExam39.userAns = null
  quizExam39.revealed = false
}

// 演练器状态
const simInputA = ref('1011 1001 1011 0110')
const simInputB = ref('0110 0101 1100 0101')

const loadPreset2024 = () => {
  simInputA.value = '1011 1001 1011 0110'
  simInputB.value = '0110 0101 1100 0101'
}

const loadPresetRandom = () => {
  const rand16 = () => Math.floor(Math.random() * 65536).toString(2).padStart(16, '0').match(/.{4}/g).join(' ')
  simInputA.value = rand16()
  simInputB.value = rand16()
}

const cleanBin = (str) => str.replace(/[^01]/g, '')
const formatBin = (str) => {
  const padded = str.padStart(16, '0')
  return padded.match(/.{4}/g)?.join(' ') || padded
}

const simCalcResult = computed(() => {
  const binA = cleanBin(simInputA.value)
  const binB = cleanBin(simInputB.value)
  if (!binA || !binB) return null

  const numA = parseInt(binA.slice(0, 16), 2) || 0
  const numB = parseInt(binB.slice(0, 16), 2) || 0
  const rawSum = numA + numB
  const hasCarry = rawSum > 0xFFFF

  let finalSum = rawSum
  if (hasCarry) {
    finalSum = (rawSum & 0xFFFF) + 1
  }
  const checksum = (~finalSum) & 0xFFFF

  return {
    rawSumStr: rawSum.toString(2).padStart(hasCarry ? 17 : 16, '0'),
    hasCarry,
    sumStr: formatBin(finalSum.toString(2)),
    checksumStr: formatBin(checksum.toString(2))
  }
})

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
.udp-calc-container {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.udp-header {
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

.badge-indigo {
  font-size: 11px;
  font-weight: 800;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.12);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.badge-purple {
  font-size: 11px;
  font-weight: 700;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.badge-emerald {
  font-size: 11px;
  font-weight: 700;
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.badge-blue {
  font-size: 11px;
  font-weight: 700;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.1);
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

.rule-tag {
  font-size: 12px;
  font-weight: 600;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(79, 70, 229, 0.25);
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

/* 首部结构样式 */
.structure-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pseudo-header-box, .real-header-box {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 14px;
}

.box-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  margin-bottom: 10px;
}

.pseudo-fields, .real-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-bottom: 10px;
}

.field-item {
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  border: 1px solid transparent;
}

.f-ip { background: rgba(124, 58, 237, 0.1); color: #7c3aed; border-color: rgba(124, 58, 237, 0.25); }
.f-zero { background: rgba(100, 116, 139, 0.1); color: var(--vp-c-text-2); border-color: rgba(100, 116, 139, 0.25); }
.f-proto { background: rgba(2, 132, 199, 0.1); color: #0284c7; border-color: rgba(2, 132, 199, 0.25); }
.f-len, .f-len2 { background: rgba(217, 119, 6, 0.1); color: #d97706; border-color: rgba(217, 119, 6, 0.25); }
.f-port { background: rgba(5, 150, 105, 0.1); color: #059669; border-color: rgba(5, 150, 105, 0.25); }
.f-chk { background: rgba(220, 38, 38, 0.1); color: #dc2626; border-color: rgba(220, 38, 38, 0.25); }

.field-note {
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* 考试刷题框样式 */
.exam-question {
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  margin-bottom: 12px;
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border-left: 3px solid #4f46e5;
}

.q-badge {
  font-size: 11.5px;
  font-weight: 700;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.12);
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 6px;
  display: inline-block;
}

.video-ref-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding: 8px 12px;
  background: rgba(251, 114, 153, 0.08);
  border: 1px solid rgba(251, 114, 153, 0.25);
  border-radius: 6px;
  font-size: 13px;
}

.video-icon {
  font-size: 15px;
}

.video-label {
  font-weight: 700;
  color: #fb7299;
}

.video-link {
  color: #0284c7;
  font-weight: 600;
  text-decoration: none;
}

.video-link:hover {
  text-decoration: underline;
  color: #fb7299;
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
  font-size: 13px;
}

.opt-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
}

.opt-selected {
  border-color: var(--vp-c-brand-1);
  background: rgba(79, 70, 229, 0.08);
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
  background: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
  border: 1px solid rgba(79, 70, 229, 0.25);
}

.btn-toggle:hover {
  background: #4f46e5;
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
  margin-bottom: 12px;
}

.calc-step-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 14px;
}

.step-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 12px 14px;
}

.step-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
}

.step-num {
  font-size: 11px;
  font-weight: 800;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.binary-math-display {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 13px;
  line-height: 1.6;
  background: var(--vp-c-bg-soft);
  padding: 10px 14px;
  border-radius: 6px;
  overflow-x: auto;
}

.math-divider {
  border-bottom: 1px solid var(--vp-c-divider);
  margin: 4px 0;
}

.carry-flag {
  color: #dc2626;
  font-weight: bold;
}

.highlight-carry {
  color: #d97706;
}

.highlight-sum {
  color: #0284c7;
}

.highlight-ans {
  color: #059669;
}

.trap-warning-box {
  padding: 10px 14px;
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid rgba(220, 38, 38, 0.25);
  border-radius: 6px;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

/* 演练器样式 */
.sim-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-group label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.sim-input {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 13.5px;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.sim-btn-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.sim-result-box {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}

.res-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.res-label {
  color: var(--vp-c-text-2);
  min-width: 170px;
}

.res-code {
  font-family: var(--vp-font-family-mono, monospace);
  background: var(--vp-c-bg-elv);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-border);
}

.res-code-bold {
  font-family: var(--vp-font-family-mono, monospace);
  font-weight: 700;
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
  padding: 3px 10px;
  border-radius: 4px;
  border: 1px solid rgba(5, 150, 105, 0.3);
}

.carry-yes {
  color: #d97706;
  font-weight: 600;
}

.carry-no {
  color: #059669;
}

.highlight-final {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dashed var(--vp-c-divider);
}
</style>
