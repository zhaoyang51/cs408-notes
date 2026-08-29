<template>
  <div class="tcp-cm-container">
    
    <!-- 顶部标题横幅 -->
    <div class="cm-header">
      <div class="header-left">
        <span class="badge-emerald">🤝 TCP 运输连接管理</span>
        <h4 class="header-title">三次握手建立连接 ➔ 全双工数据传输 ➔ 四次挥手释放连接</h4>
      </div>
      <div class="rule-tag">
        SYN / FIN 报文不带数据但必消耗 1 个序号：ack = seq + 1
      </div>
    </div>

    <!-- 1. 三次握手建立连接全景图 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('handshake')">
        <div class="header-title-box">
          <span class="card-icon">🤝</span>
          <strong>一、TCP 客户甲 ➔ 服务器乙 三次握手建立连接时空时序与状态变迁图</strong>
          <span class="badge-blue">三次握手</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.handshake ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.handshake" class="card-body">
        
        <div class="handshake-flow-grid">
          <!-- 左侧：客户端状态柱 -->
          <div class="state-column">
            <div class="role-title-box">
              <span class="role-icon">💻</span>
              <strong>主机甲 (TCP 客户)</strong>
            </div>
            <div class="state-block state-closed">CLOSED<br><span class="st-sub">关闭</span></div>
            <div class="state-arrow-down">⬇ 主动打开，发连接请求</div>
            <div class="state-block state-syn-sent">SYN-SENT<br><span class="st-sub">同步已发送</span></div>
            <div class="state-arrow-down">⬇ 收到针对请求的确认</div>
            <div class="state-block state-estab">ESTABLISHED<br><span class="st-sub">连接已建立</span></div>
          </div>

          <!-- 中间：三次报文交互 -->
          <div class="messages-column">
            
            <!-- 握手 1 -->
            <div class="msg-step-box step-1">
              <div class="msg-meta">
                <span class="step-badge">第 1 次握手</span>
                <span class="step-action">发送 TCP 连接请求</span>
              </div>
              <div class="packet-pill pill-blue">
                <strong>SYN = 1</strong>，ACK = 0，<i class="m-var">seq</i> = <i class="m-var">x</i> = 11220
              </div>
              <div class="msg-arrow-line to-right"><span>➔</span></div>
            </div>

            <!-- 握手 2 -->
            <div class="msg-step-box step-2">
              <div class="msg-meta text-right">
                <span class="step-badge badge-amber">第 2 次握手</span>
                <span class="step-action">发送针对 TCP 连接请求的确认 (SYN+ACK)</span>
              </div>
              <div class="packet-pill pill-amber">
                <strong>SYN = 1</strong>，<strong>ACK = 1</strong>，<i class="m-var">seq</i> = <i class="m-var">y</i> (乙随机)，<strong><i class="m-var">ack</i> = <i class="m-var">x</i> + 1 = 11221</strong>
              </div>
              <div class="msg-arrow-line to-left"><span>⬅</span></div>
            </div>

            <!-- 握手 3 -->
            <div class="msg-step-box step-3">
              <div class="msg-meta">
                <span class="step-badge badge-green">第 3 次握手</span>
                <span class="step-action">发送针对确认的确认 (ACK)</span>
              </div>
              <div class="packet-pill pill-green">
                SYN = 0，<strong>ACK = 1</strong>，<i class="m-var">seq</i> = <i class="m-var">x</i> + 1 = 11221，<strong><i class="m-var">ack</i> = <i class="m-var">y</i> + 1</strong>
              </div>
              <div class="msg-arrow-line to-right"><span>➔</span></div>
            </div>

            <!-- 数据传输通道 -->
            <div class="data-transfer-bridge">
              <span class="dt-icon">🔄</span>
              <strong>双方进入 ESTABLISHED，开启双向数据传输</strong>
            </div>

          </div>

          <!-- 右侧：服务端状态柱 -->
          <div class="state-column">
            <div class="role-title-box">
              <span class="role-icon">🖥️</span>
              <strong>主机乙 (TCP 服务器)</strong>
            </div>
            <div class="state-block state-closed">CLOSED<br><span class="st-sub">关闭</span></div>
            <div class="state-arrow-down">⬇ 被动打开</div>
            <div class="state-block state-listen">LISTEN<br><span class="st-sub">监听</span></div>
            <div class="state-arrow-down">⬇ 收到连接请求</div>
            <div class="state-block state-syn-rcvd">SYN-RCVD<br><span class="st-sub">同步已接收</span></div>
            <div class="state-arrow-down">⬇ 收到确认</div>
            <div class="state-block state-estab">ESTABLISHED<br><span class="st-sub">连接已建立</span></div>
          </div>
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

        <!-- 交互式作答选项 (默认不标答案) -->
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

    <!-- 3. 四次挥手释放连接全景图 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('wave')">
        <div class="header-title-box">
          <span class="card-icon">🚪</span>
          <strong>二、TCP 客户甲 ➔ 服务器乙 四次挥手释放连接与状态变迁图</strong>
          <span class="badge-red">四次挥手</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.wave ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.wave" class="card-body">
        
        <div class="handshake-flow-grid">
          <!-- 左侧：客户端状态柱 -->
          <div class="state-column">
            <div class="role-title-box">
              <span class="role-icon">💻</span>
              <strong>主机甲 (主动关闭)</strong>
            </div>
            <div class="state-block state-estab">ESTABLISHED<br><span class="st-sub">连接已建立</span></div>
            <div class="state-arrow-down">⬇ 主动关闭，发 FIN</div>
            <div class="state-block state-fin1">FIN-WAIT-1<br><span class="st-sub">终止等待1</span></div>
            <div class="state-arrow-down">⬇ 收到普通确认 ACK</div>
            <div class="state-block state-fin2">FIN-WAIT-2<br><span class="st-sub">终止等待2 (半关闭)</span></div>
            <div class="state-arrow-down">⬇ 收到释放 FIN</div>
            <div class="state-block state-timewait">TIME-WAIT<br><span class="st-sub">时间等待 (等待 2MSL)</span></div>
            <div class="state-arrow-down">⬇ 2MSL 计时器超时</div>
            <div class="state-block state-closed">CLOSED<br><span class="st-sub">关闭状态</span></div>
          </div>

          <!-- 中间：四次报文交互 -->
          <div class="messages-column">
            
            <!-- 挥手 1 -->
            <div class="msg-step-box step-1">
              <div class="msg-meta">
                <span class="step-badge badge-red">第 1 次挥手</span>
                <span class="step-action">发送 TCP 连接释放报文 (FIN)</span>
              </div>
              <div class="packet-pill pill-red">
                <strong>FIN = 1</strong>，ACK = 1，<i class="m-var">seq</i> = <i class="m-var">u</i>，<i class="m-var">ack</i> = <i class="m-var">v</i>
              </div>
              <div class="msg-arrow-line to-right"><span>➔</span></div>
            </div>

            <!-- 挥手 2 -->
            <div class="msg-step-box step-2">
              <div class="msg-meta text-right">
                <span class="step-badge badge-amber">第 2 次挥手</span>
                <span class="step-action">发送针对释放的普通确认 (ACK)</span>
              </div>
              <div class="packet-pill pill-amber">
                ACK = 1，<i class="m-var">seq</i> = <i class="m-var">v</i>，<strong><i class="m-var">ack</i> = <i class="m-var">u</i> + 1</strong>
              </div>
              <div class="msg-arrow-line to-left"><span>⬅</span></div>
            </div>

            <!-- 半关闭单向传输 -->
            <div class="half-close-bridge">
              <span>⬅ <strong>乙向甲单向数据传输（甲到乙已关闭）</strong></span>
            </div>

            <!-- 挥手 3 -->
            <div class="msg-step-box step-3">
              <div class="msg-meta text-right">
                <span class="step-badge badge-red">第 3 次挥手</span>
                <span class="step-action">乙数据发完，发送连接释放 (FIN)</span>
              </div>
              <div class="packet-pill pill-red">
                <strong>FIN = 1</strong>，ACK = 1，<i class="m-var">seq</i> = <i class="m-var">w</i>，<strong><i class="m-var">ack</i> = <i class="m-var">u</i> + 1</strong>
              </div>
              <div class="msg-arrow-line to-left"><span>⬅</span></div>
            </div>

            <!-- 挥手 4 -->
            <div class="msg-step-box step-4">
              <div class="msg-meta">
                <span class="step-badge badge-green">第 4 次挥手</span>
                <span class="step-action">甲发送最终确认 (ACK)</span>
              </div>
              <div class="packet-pill pill-green">
                ACK = 1，<i class="m-var">seq</i> = <i class="m-var">u</i> + 1，<strong><i class="m-var">ack</i> = <i class="m-var">w</i> + 1</strong>
              </div>
              <div class="msg-arrow-line to-right"><span>➔</span></div>
            </div>

            <div class="msl-tip-box">
              <span>⏳ <strong>甲进入 TIME-WAIT 状态，必须等待 2MSL 才能彻底 CLOSED</strong></span>
            </div>

          </div>

          <!-- 右侧：服务端状态柱 -->
          <div class="state-column">
            <div class="role-title-box">
              <span class="role-icon">🖥️</span>
              <strong>主机乙 (被动关闭)</strong>
            </div>
            <div class="state-block state-estab">ESTABLISHED<br><span class="st-sub">连接已建立</span></div>
            <div class="state-arrow-down">⬇ 收到释放 FIN，通知应用</div>
            <div class="state-block state-closewait">CLOSE-WAIT<br><span class="st-sub">关闭等待 (半关闭)</span></div>
            <div class="state-arrow-down">⬇ 数据发完，发 FIN</div>
            <div class="state-block state-lastack">LAST-ACK<br><span class="st-sub">最后确认</span></div>
            <div class="state-arrow-down">⬇ 收到最终确认 ACK</div>
            <div class="state-block state-closed">CLOSED<br><span class="st-sub">关闭状态</span></div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive } from 'vue'

const quizConn = reactive({ userAns: null, revealed: false })
const handleQuizConn = (opt) => {
  quizConn.userAns = opt
  quizConn.revealed = true
}
const resetQuizConn = () => {
  quizConn.userAns = null
  quizConn.revealed = false
}

const openSections = reactive({
  handshake: false, // 默认展开三次握手
  exam39: false,    // 默认展开 2011 题 39
  wave: false,      // 默认展开四次挥手
  msl: false       // 默认收起 2MSL 简答
})

const toggle = (key) => {
  openSections[key] = !openSections[key]
}
</script>

<style scoped>
.tcp-cm-container {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 顶部栏 */
.cm-header {
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

.badge-emerald {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
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

.badge-blue, .badge-green, .badge-red, .badge-amber {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.badge-blue { background: rgba(37, 99, 235, 0.12); color: #2563eb; }
.badge-green { background: rgba(16, 185, 129, 0.12); color: #059669; }
.badge-red { background: rgba(239, 68, 68, 0.12); color: #ef4444; }
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

/* 握手/挥手布局网格 */
.handshake-flow-grid {
  display: grid;
  grid-template-columns: 140px 1fr 140px;
  gap: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 14px 10px;
}

@media (max-width: 768px) {
  .handshake-flow-grid {
    grid-template-columns: 1fr;
  }
}

.state-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.role-title-box {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.state-block {
  width: 100%;
  border-radius: 6px;
  padding: 6px 4px;
  font-size: 10.5px;
  font-weight: 800;
  text-align: center;
  border: 1px solid transparent;
}

.st-sub {
  font-size: 9px;
  font-weight: normal;
  opacity: 0.85;
}

.state-closed { background: #1e293b; color: #fff; }
.state-syn-sent { background: #dc2626; color: #fff; }
.state-listen { background: #0284c7; color: #fff; }
.state-syn-rcvd { background: #7c3aed; color: #fff; }
.state-estab { background: #059669; color: #fff; }
.state-fin1 { background: #0284c7; color: #fff; }
.state-fin2 { background: #2563eb; color: #fff; }
.state-closewait { background: #7c3aed; color: #fff; }
.state-lastack { background: #dc2626; color: #fff; }
.state-timewait { background: #db2777; color: #fff; }

.state-arrow-down {
  font-size: 9.5px;
  color: var(--vp-c-text-3);
  text-align: center;
}

/* 中间报文流 */
.messages-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-around;
}

.msg-step-box {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.msg-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
}

.text-right {
  justify-content: flex-end;
}

.step-badge {
  background: #2563eb;
  color: #fff;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 9.5px;
  font-weight: 800;
}

.step-action {
  color: var(--vp-c-text-2);
  font-weight: 700;
}

.packet-pill {
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid transparent;
}

.pill-blue { background: rgba(37, 99, 235, 0.1); border-color: rgba(37, 99, 235, 0.3); color: #2563eb; }
.pill-amber { background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.35); color: #d97706; text-align: right; }
.pill-green { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); color: #059669; }
.pill-red { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #ef4444; }

.msg-arrow-line {
  font-size: 12px;
  font-weight: 900;
}

.msg-arrow-line.to-right { color: #2563eb; }
.msg-arrow-line.to-left { color: #d97706; text-align: right; }

.data-transfer-bridge, .half-close-bridge, .msl-tip-box {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 11px;
  color: var(--vp-c-text-1);
  text-align: center;
}

.data-transfer-bridge { border-color: rgba(16, 185, 129, 0.4); color: #059669; }
.half-close-bridge { border-color: rgba(139, 92, 246, 0.4); color: #8b5cf6; }
.msl-tip-box { border-color: rgba(219, 39, 119, 0.4); color: #db2777; }

/* 数学变量 */
.m-var {
  font-family: 'Times New Roman', 'Cambria Math', 'KaTeX_Math', serif;
  font-style: italic;
  font-weight: 700;
  padding: 0 1px;
}

.m-formula {
  font-family: 'Times New Roman', 'Cambria Math', 'KaTeX_Math', serif;
  font-weight: 700;
  color: #2563eb;
  background: rgba(37, 99, 235, 0.08);
  padding: 1px 6px;
  border-radius: 4px;
  display: inline-block;
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
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

@media (max-width: 640px) {
  .exam-options {
    grid-template-columns: 1fr;
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

/* MSL 详情 */
.msl-detail-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.msl-item {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 8px 12px;
}

.m-head {
  font-size: 12px;
  font-weight: 800;
  color: #d97706;
  margin-bottom: 3px;
}

.m-text {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.m-text strong {
  color: var(--vp-c-text-1);
}
</style>
