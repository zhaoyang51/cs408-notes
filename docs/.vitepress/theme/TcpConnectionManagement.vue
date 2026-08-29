<template>
  <div class="tcp-cm-container">
    
    <!-- 顶部标题横幅 -->
    <div class="cm-header">
      <div class="header-left">
        <span class="badge-emerald">🤝 TCP 运输连接建立</span>
        <h4 class="header-title">三次握手 (Three-way Handshake) 状态机迁移与控制位规则</h4>
      </div>
      <div class="rule-tag">
        SYN 报文不带数据但必消耗 1 个序号：ack = seq + 1
      </div>
    </div>

    <!-- 1. 三次握手时序与状态迁移全景图 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('topo')">
        <div class="header-title-box">
          <span class="card-icon">⏱️</span>
          <strong>TCP 客户甲 ➔ 服务器乙 三次握手时空时序与状态变迁图</strong>
          <span class="badge-blue">状态迁移</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.topo ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.topo" class="card-body">
        
        <!-- 左右双方角色栏 -->
        <div class="handshake-roles-bar">
          <div class="role-box role-client">
            <span class="r-icon">💻</span>
            <div>
              <div class="r-name">主机甲 (TCP 客户端)</div>
              <div class="r-desc">主动打开 (Active Open)</div>
            </div>
          </div>
          <div class="role-mid-title">
            <span class="handshake-tag">三次握手建立全双工连接</span>
          </div>
          <div class="role-box role-server">
            <span class="r-icon">🖥️</span>
            <div>
              <div class="r-name">主机乙 (TCP 服务器)</div>
              <div class="r-desc">被动打开 (Passive Open)</div>
            </div>
          </div>
        </div>

        <!-- 三次握手交互流程卡片 -->
        <div class="handshake-flow-grid">
          
          <!-- 左侧：客户端状态柱 -->
          <div class="state-column">
            <div class="state-block state-closed">CLOSED<br><span class="st-sub">关闭状态</span></div>
            <div class="state-arrow-down">⬇ 主动打开</div>
            <div class="state-block state-syn-sent">SYN-SENT<br><span class="st-sub">同步已发送</span></div>
            <div class="state-arrow-down">⬇ 收到 SYN+ACK</div>
            <div class="state-block state-estab">ESTABLISHED<br><span class="st-sub">连接已建立</span></div>
          </div>

          <!-- 中间：三次报文段交互 -->
          <div class="messages-column">
            
            <!-- 握手 1 -->
            <div class="msg-step-box step-1">
              <div class="msg-meta">
                <span class="step-badge">第 1 次握手</span>
                <span class="step-action">发送 TCP 连接请求 (SYN)</span>
              </div>
              <div class="packet-pill pill-blue">
                <strong>SYN = 1</strong>，ACK = 0，<i class="m-var">seq</i> = <i class="m-var">x</i> = 11220
              </div>
              <div class="msg-arrow-line to-right">
                <span>➔</span>
              </div>
            </div>

            <!-- 握手 2 -->
            <div class="msg-step-box step-2">
              <div class="msg-meta text-right">
                <span class="step-badge badge-amber">第 2 次握手</span>
                <span class="step-action">针对连接请求的确认及同步 (SYN+ACK)</span>
              </div>
              <div class="packet-pill pill-amber">
                <strong>SYN = 1</strong>，<strong>ACK = 1</strong>，<i class="m-var">seq</i> = <i class="m-var">y</i> (随意指定)，<strong><i class="m-var">ack</i> = <i class="m-var">x</i> + 1 = 11221</strong>
              </div>
              <div class="msg-arrow-line to-left">
                <span>⬅</span>
              </div>
            </div>

            <!-- 握手 3 -->
            <div class="msg-step-box step-3">
              <div class="msg-meta">
                <span class="step-badge badge-green">第 3 次握手</span>
                <span class="step-action">针对 SYN+ACK 的确认 (ACK)</span>
              </div>
              <div class="packet-pill pill-green">
                SYN = 0，<strong>ACK = 1</strong>，<i class="m-var">seq</i> = <i class="m-var">x</i> + 1 = 11221，<strong><i class="m-var">ack</i> = <i class="m-var">y</i> + 1</strong>
              </div>
              <div class="msg-arrow-line to-right">
                <span>➔</span>
              </div>
            </div>

            <!-- 数据传输通道 -->
            <div class="data-transfer-bridge">
              <span class="dt-icon">🔄</span>
              <strong>双方进入 ESTABLISHED 状态，正式开启全双工可靠数据传输</strong>
            </div>

          </div>

          <!-- 右侧：服务端状态柱 -->
          <div class="state-column">
            <div class="state-block state-closed">CLOSED<br><span class="st-sub">关闭状态</span></div>
            <div class="state-arrow-down">⬇ 被动打开</div>
            <div class="state-block state-listen">LISTEN<br><span class="st-sub">监听状态</span></div>
            <div class="state-arrow-down">⬇ 收到 SYN</div>
            <div class="state-block state-syn-rcvd">SYN-RCVD<br><span class="st-sub">同步已接收</span></div>
            <div class="state-arrow-down">⬇ 收到 ACK</div>
            <div class="state-block state-estab">ESTABLISHED<br><span class="st-sub">连接已建立</span></div>
          </div>

        </div>

      </div>
    </div>

    <!-- 2. 【2011 年 统考题 39】真题精析卡片 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>【2011 年 统考题 39】TCP 连接建立报文段控制位与序号真题精解</strong>
          <span class="badge-green">真题演练</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam" class="card-body">
        <div class="exam-question">
          主机甲向主机乙发送一个（SYN=1, seq=11220）的 TCP 段，期望与主机乙建立 TCP 连接，若主机乙接受该连接请求，则主机乙向主机甲发送的正确的 TCP 段可能是（&nbsp;&nbsp;&nbsp;&nbsp;）。
        </div>

        <div class="exam-options">
          <div class="opt-item">A. (SYN=0 , ACK=0, seq=11221, ack=11221)</div>
          <div class="opt-item">B. (SYN=1 , ACK=1, seq=11220, ack=11220)</div>
          <div class="opt-item opt-correct"><strong>C. (SYN=1 , ACK=1, seq=11221, ack=11221)</strong> <span class="correct-badge">✔ 正确答案</span></div>
          <div class="opt-item">D. (SYN=0 , ACK=0, seq=11220, ack=11220)</div>
        </div>

        <!-- 详细推导步骤 -->
        <div class="exam-analysis">
          <div class="analysis-title">🔍 核心推导步骤（408 黄金答题法则）：</div>
          <ol class="analysis-list">
            <li><strong>判定控制位 SYN 与 ACK</strong>：第 2 次握手是主机乙对主机甲连接请求的<strong>确认与同步</strong>，因此必须同时置位：<strong>SYN = 1</strong>（表明请求同步）和 <strong>ACK = 1</strong>（表明确认号字段有效）。排除了 A、D 选项。</li>
            <li><strong>计算确认号 ack</strong>：主机甲在第 1 次握手中发送的序号 <i class="m-var">seq</i> = 11220。由于 <strong>SYN 报文段虽然不携带数据，但必须消耗一个序号</strong>，因此主机乙回复的确认序号必须为：
               <span class="m-formula"><i class="m-var">ack</i> = <i class="m-var">x</i> + 1 = 11220 + 1 = 11221</span>。排除了 B 选项。
            </li>
            <li><strong>确定自身序号 seq</strong>：主机乙作为被连接方，需要为自己发送的报文段随机选择一个初始序号 <i class="m-var">seq</i> = <i class="m-var">y</i>。选项 C 中假定主机乙随机生成的初始序号恰好为 11221（合法随机值）。</li>
            <li><strong>结论</strong>：综合得出主机乙发送的报文段必须满足 <strong>SYN=1, ACK=1, ack=11221</strong>，选 <strong>C</strong>。</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- 3. 408 核心考点延伸：为什么需要三次握手？(支持折叠) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('why3')">
        <div class="header-title-box">
          <span class="card-icon">💡</span>
          <strong>408 经典简答：为什么 TCP 建立连接必须是“三次握手”而不是“两次握手”？</strong>
          <span class="badge-amber">考研大题</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.why3 ? '收起 ▲' : '展开问答 ▼' }}
        </button>
      </div>

      <div v-show="openSections.why3" class="card-body">
        <div class="why3-content">
          <div class="why3-item">
            <div class="w-title">🎯 核心原因：防止已失效的连接请求报文段突然又传送到了服务端</div>
            <div class="w-desc">
              <p><strong>异常场景假设（若只有两次握手）</strong>：</p>
              <ul>
                <li>主机甲发出的第 1 个连接请求报文段在网络节点中<strong>长时间滞留</strong>，甲超时未收到确认，便重发连接请求并正常完成通信后关闭了连接；</li>
                <li>连接释放后，那条先前滞留在网络中的<strong>旧请求报文段</strong>突然到达了主机乙；</li>
                <li>若只有“两次握手”，主机乙收到后误以为甲又发起了新连接，便直接向甲发出确认并<strong>进入 ESTABLISHED 状态单方面建立连接</strong>；</li>
                <li>而主机甲此时并未发起连接，收到乙的确认后<strong>不予理睬</strong>，导致主机乙一直苦苦等待甲发送数据，<strong>白白浪费大量的服务器连接与内存资源</strong>。</li>
              </ul>
              <p><strong>三次握手的解决之道</strong>：在三次握手下，主机甲收到乙的旧确认后发现并非自己当前期望的连接，会立即向乙发送<strong>复位报文段 (RST=1)</strong>，主机乙收到 RST 后便终止连接建立，完美避免脏连接。</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive } from 'vue'

const openSections = reactive({
  topo: true,   // 默认展开时序图
  exam: true,   // 默认展开真题
  why3: false   // 默认收起为什么三次握手
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
  border: 1px dashed #059669;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  color: #059669;
  font-weight: 700;
}

/* 折叠卡片 */
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

.badge-blue, .badge-green, .badge-amber {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.badge-blue { background: rgba(37, 99, 235, 0.12); color: #2563eb; }
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
  gap: 12px;
}

/* 双方角色栏 */
.handshake-roles-bar {
  display: grid;
  grid-template-columns: 180px 1fr 180px;
  align-items: center;
  gap: 10px;
}

@media (max-width: 768px) {
  .handshake-roles-bar {
    grid-template-columns: 1fr;
  }
}

.role-box {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-client { border-left: 3px solid #2563eb; }
.role-server { border-right: 3px solid #10b981; }

.r-icon { font-size: 18px; }
.r-name { font-size: 12px; font-weight: 800; color: var(--vp-c-text-1); }
.r-desc { font-size: 9.5px; color: var(--vp-c-text-3); }

.role-mid-title {
  display: flex;
  justify-content: center;
}

.handshake-tag {
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.25);
  color: #2563eb;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

/* 握手交互流程卡片 */
.handshake-flow-grid {
  display: grid;
  grid-template-columns: 110px 1fr 110px;
  gap: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 12px;
}

@media (max-width: 768px) {
  .handshake-flow-grid {
    grid-template-columns: 80px 1fr 80px;
    font-size: 10px;
  }
}

/* 状态柱 */
.state-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.state-block {
  width: 100%;
  padding: 6px 4px;
  border-radius: 6px;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  border: 1px solid transparent;
}

.st-sub {
  font-size: 8.5px;
  font-weight: 400;
  opacity: 0.85;
}

.state-closed { background: #1e293b; color: #ffffff; }
.state-syn-sent { background: #e11d48; color: #ffffff; }
.state-listen { background: #0284c7; color: #ffffff; }
.state-syn-rcvd { background: #7c3aed; color: #ffffff; }
.state-estab { background: #059669; color: #ffffff; }

.state-arrow-down {
  font-size: 8.5px;
  color: var(--vp-c-text-3);
  text-align: center;
}

/* 报文流 */
.messages-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
}

.msg-step-box {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

.step-1 { border-left: 3px solid #2563eb; }
.step-2 { border-right: 3px solid #d97706; }
.step-3 { border-left: 3px solid #059669; }

.msg-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.text-right {
  justify-content: flex-end;
}

.step-badge {
  background: #2563eb;
  color: #ffffff;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 9.5px;
  font-weight: 800;
}

.badge-amber { background: #d97706; }
.badge-green { background: #059669; }

.step-action {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.packet-pill {
  font-size: 11.5px;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.pill-blue { background: rgba(37, 99, 235, 0.08); color: #2563eb; }
.pill-amber { background: rgba(245, 158, 11, 0.1); color: #d97706; }
.pill-green { background: rgba(16, 185, 129, 0.08); color: #059669; }

.msg-arrow-line {
  font-size: 13px;
  font-weight: 900;
  display: flex;
}

.to-right { justify-content: flex-end; color: #2563eb; }
.to-left { justify-content: flex-start; color: #d97706; }

.data-transfer-bridge {
  background: rgba(5, 150, 105, 0.1);
  border: 1px solid rgba(5, 150, 105, 0.3);
  border-radius: 6px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: #059669;
  text-align: center;
}

/* 真题卡片 */
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
  font-size: 11.5px;
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

/* 为什么三次握手 */
.why3-content {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 10px 14px;
}

.w-title {
  font-size: 12.5px;
  font-weight: 800;
  color: #d97706;
  margin-bottom: 6px;
}

.w-desc {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.w-desc p { margin: 4px 0; }
.w-desc ul { padding-left: 18px; margin: 4px 0; }
.w-desc li { margin-bottom: 3px; }

.m-var {
  font-family: 'Times New Roman', 'Cambria Math', 'KaTeX_Math', serif;
  font-style: italic;
  font-weight: 700;
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
</style>
