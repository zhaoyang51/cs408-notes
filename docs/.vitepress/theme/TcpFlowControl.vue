<template>
  <div class="tcp-flow-container">
    
    <!-- 1. 核心公式与概念导航栏 -->
    <div class="flow-header">
      <div class="header-left">
        <span class="badge-blue">🌊 TCP 流量控制与滑动窗口</span>
        <h3 class="header-title">发送窗口计算准则：W = min(cwnd, rwnd)</h3>
      </div>
      <div class="formula-tag">
        实际发送窗口 = min [ 自身拥塞窗口 cwnd, 接收方通告窗口 rwnd ]
      </div>
    </div>

    <!-- 2. 可视化双模展示区 (字节滑动窗口 + 交互时序图) -->
    <div class="vis-card-grid">
      
      <!-- A. 字节流滑动窗口切片模型 -->
      <div class="sub-vis-card">
        <div class="card-top-title">
          <span class="card-icon">📐</span>
          <strong>字节流滑动窗口状态切片 (Byte Stream Window)</strong>
        </div>

        <!-- 字节块流标尺 -->
        <div class="byte-stream-wrapper">
          <div class="byte-block block-acked">
            <span class="block-range">0 ~ 999</span>
            <span class="block-status">已发且已确认</span>
            <span class="block-sub">移出发送窗口</span>
          </div>

          <div class="byte-block block-unacked">
            <span class="block-range">1000 ~ 1999</span>
            <span class="block-status">已发未确认</span>
            <span class="block-sub">占用 1000B 窗口</span>
          </div>

          <div class="byte-block block-allowed">
            <span class="block-range">2000 ~ 2999</span>
            <span class="block-status">允许发送</span>
            <span class="block-sub">剩余可用 1000B</span>
          </div>

          <div class="byte-block block-disabled">
            <span class="block-range">3000 ~ 3999</span>
            <span class="block-status">禁止发送</span>
            <span class="block-sub">超出接收窗口</span>
          </div>

          <div class="byte-block block-disabled">
            <span class="block-range">4000 ~ 4999</span>
            <span class="block-status">禁止发送</span>
            <span class="block-sub">超出接收窗口</span>
          </div>
        </div>

        <!-- 窗口覆盖范围标尺 -->
        <div class="window-bracket-box">
          <div class="bracket-acked-part">已确认左移</div>
          <div class="bracket-active-window">
            <div class="bracket-line"></div>
            <span class="bracket-label">当前有效发送窗口 W = min(4000, 2000) = 2000 字节 (涵盖 1000 ~ 2999)</span>
          </div>
        </div>

        <div class="byte-summary-bar">
          <span>● 左沿位置：<strong>1000</strong></span>
          <span>● 右沿位置：<strong>2999</strong> (1000 + 2000 - 1)</span>
          <span>● 剩余可发：<strong>2000 ~ 2999 号字节（共 1000 字节）</strong></span>
        </div>
      </div>

      <!-- B. 甲乙双方通信时序时空图 -->
      <div class="sub-vis-card">
        <div class="card-top-title">
          <span class="card-icon">⏱️</span>
          <strong>甲 ➔ 乙 通信时序推导图 (Sequence Diagram)</strong>
        </div>

        <div class="seq-diagram">
          <div class="seq-entities">
            <div class="entity-box entity-client">
              <span class="ent-icon">💻</span>
              <span class="ent-name">主机甲 (发送方)</span>
              <span class="ent-desc">cwnd = 4000B, MSS = 1000B</span>
            </div>
            <div class="conn-bridge">TCP 已经建立连接</div>
            <div class="entity-box entity-server">
              <span class="ent-icon">🖥️</span>
              <span class="ent-name">主机乙 (接收方)</span>
              <span class="ent-desc">通告 rwnd 动态调节</span>
            </div>
          </div>

          <!-- 交互事件流 -->
          <div class="seq-flow-body">
            
            <!-- 事件 1: 发送两个段 -->
            <div class="seq-row">
              <div class="seq-arrow to-right">
                <span class="seq-msg-text">连续发送 2 个最大段 MSS (0~999 & 1000~1999，共 2000 字节)</span>
              </div>
            </div>

            <!-- 事件 2: 返回确认 -->
            <div class="seq-row">
              <div class="seq-arrow to-left">
                <span class="seq-msg-text ack-text">收到对第 1 个段的确认 (ACK=1000, 通告 rwnd = 2000 字节)</span>
              </div>
            </div>

            <!-- 事件 3: 计算结论 -->
            <div class="seq-conclusion">
              <span class="conc-icon">💡</span>
              <span class="conc-text">主机甲当前<strong>还可向乙发送 2000~2999 号字节数据，共 1000 字节</strong></span>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- 3. 2010 年题 39 题真题原貌与精析卡片 -->
    <div class="exam-card">
      <div class="exam-header">
        <span class="exam-tag">📝 408 经典真题</span>
        <span class="exam-title">【2010 年 统考题 39】TCP 滑动窗口与流量控制计算</span>
      </div>

      <div class="exam-question">
        主机甲和主机乙之间建立了一个 TCP 连接，TCP 最大段长度 MSS 为 1000 字节。若主机甲的当前拥塞窗口为 4000 字节，在主机甲向主机乙连续发送两个最大段后，成功收到主机乙发送的第一个段的确认段，确认段中通告的接收窗口大小为 2000 字节，则此时主机甲还可以向主机乙发送的最大字节数是（&nbsp;&nbsp;&nbsp;&nbsp;）。
      </div>

      <div class="exam-options">
        <div class="opt-item opt-correct"><strong>A. 1000</strong> <span class="correct-badge">✔ 正确答案</span></div>
        <div class="opt-item">B. 2000</div>
        <div class="opt-item">C. 3000</div>
        <div class="opt-item">D. 4000</div>
      </div>

      <div class="exam-analysis">
        <div class="analysis-title">🔍 核心推导步骤（408 答题黄金模板）：</div>
        <ol class="analysis-list">
          <li><strong>确定发送窗口上限</strong>：TCP 发送方的实际发送窗口大小受拥塞窗口与接收窗口共同制约，即 $W = \min(\text{cwnd}, \text{rwnd}) = \min(4000, 2000) = 2000\text{ 字节}$。</li>
          <li><strong>确定窗口滑动位置</strong>：收到对第 1 个段（0~999 字节）的累计确认后，滑动窗口左沿向前推进至 <strong>1000</strong>，因此当前发送窗口覆盖的字节序号范围为 <strong>1000 ~ 2999</strong>（总跨度为 2000 字节）。</li>
          <li><strong>扣除已发未确认数据</strong>：甲之前连续发送了 2 个最大段（0~999 和 1000~1999），其中第 2 个段（1000~1999 字节）已经发出但<strong>尚未收到确认</strong>，占用了当前发送窗口中的 1000 字节空间。</li>
          <li><strong>计算剩余可发字节</strong>：还允许发送的字节范围为 <strong>2000 ~ 2999</strong> 号字节，最大字节数 $= 2000 - 1000 = \mathbf{1000\text{ 字节}}$。</li>
        </ol>
      </div>
    </div>

    <!-- 4. 408 核心防坑扩展：持续计时器与死锁 -->
    <div class="trap-card">
      <div class="trap-header">
        <span class="trap-badge">⚠️ 408 核心考点延伸</span>
        <strong>TCP 流量控制中的死锁问题与持续计时器 (Persistence Timer)</strong>
      </div>
      <div class="trap-content">
        <ul>
          <li><strong>死锁发生场景</strong>：接收方向发送方发送 $\text{rwnd} = 0$ 的零窗口通知后，发送方暂停发送；稍后接收方缓存释放，发送 $\text{rwnd} > 0$ 的窗口更新报文，但该报文在网络中<strong>意外丢失</strong>。此时发送方等待窗口更新，接收方等待数据，双方陷入永久互相等待（死锁）。</li>
          <li><strong>解决机制</strong>：TCP 为每个连接设置一个<strong>持续计时器 (Persistence Timer)</strong>。只要收到零窗口通知即启动计时器，超时后发送方主动发送仅含 1 字节数据的<strong>零窗口探测报文段 (Zero-Window Probe)</strong>，迫使接收方重发确认以通告当前最新 $\text{rwnd}$，彻底打破死锁。</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup>
// 组件纯原生 CSS + 结构渲染，零外部依赖
</script>

<style scoped>
.tcp-flow-container {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 顶部栏 */
.flow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 12px 16px;
  flex-wrap: wrap;
  gap: 10px;
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
  font-size: 14px;
  font-weight: 800;
  margin: 0;
  color: var(--vp-c-text-1);
}

.formula-tag {
  background: var(--vp-c-bg);
  border: 1px dashed var(--vp-c-border);
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11.5px;
  color: #2563eb;
  font-weight: 700;
  font-family: 'JetBrains Mono', Consolas, monospace;
}

/* 可视化网格 */
.vis-card-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 12px;
}

@media (max-width: 900px) {
  .vis-card-grid {
    grid-template-columns: 1fr;
  }
}

.sub-vis-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--card-shadow);
}

.card-top-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-border);
  padding-bottom: 8px;
}

/* 字节流滑动窗口 */
.byte-stream-wrapper {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin-top: 4px;
}

.byte-block {
  border-radius: 6px;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.block-range {
  font-size: 11.5px;
  font-weight: 800;
  font-family: 'JetBrains Mono', Consolas, monospace;
}

.block-status {
  font-size: 10px;
  font-weight: 700;
  margin-top: 2px;
}

.block-sub {
  font-size: 8.5px;
  opacity: 0.8;
  margin-top: 1px;
}

.block-acked {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #059669;
}

.block-unacked {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.4);
  color: #d97706;
}

.block-allowed {
  background: rgba(37, 99, 235, 0.15);
  border: 2px solid #2563eb;
  color: #2563eb;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.2);
}

.block-disabled {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-border);
  color: var(--vp-c-text-3);
  opacity: 0.6;
}

/* 窗口覆盖标尺 */
.window-bracket-box {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 6px;
  align-items: center;
}

.bracket-acked-part {
  font-size: 9.5px;
  color: #059669;
  text-align: center;
  font-weight: 700;
}

.bracket-active-window {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.bracket-line {
  width: 50%;
  height: 4px;
  background: #2563eb;
  border-radius: 2px;
  align-self: flex-start;
}

.bracket-label {
  font-size: 10px;
  color: #2563eb;
  font-weight: 700;
  text-align: left;
  width: 100%;
}

.byte-summary-bar {
  display: flex;
  justify-content: space-between;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 11px;
  color: var(--vp-c-text-2);
  flex-wrap: wrap;
  gap: 6px;
}

.byte-summary-bar strong {
  color: #2563eb;
}

/* 时序图 */
.seq-diagram {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.seq-entities {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.entity-box {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 130px;
}

.ent-icon { font-size: 16px; }
.ent-name { font-size: 11.5px; font-weight: 800; color: var(--vp-c-text-1); }
.ent-desc { font-size: 9px; color: var(--vp-c-text-3); }

.conn-bridge {
  font-size: 10px;
  font-weight: 700;
  color: #2563eb;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.2);
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
}

.seq-flow-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 10px;
}

.seq-row {
  display: flex;
  width: 100%;
}

.seq-arrow {
  width: 100%;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10.5px;
  position: relative;
}

.seq-arrow.to-right {
  background: rgba(37, 99, 235, 0.1);
  border-left: 3px solid #2563eb;
  color: #2563eb;
}

.seq-arrow.to-left {
  background: rgba(16, 185, 129, 0.1);
  border-right: 3px solid #10b981;
  color: #059669;
  text-align: right;
}

.seq-msg-text {
  font-weight: 700;
}

.seq-conclusion {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 11.5px;
  color: var(--vp-c-text-1);
}

.seq-conclusion strong {
  color: #d97706;
}

/* 真题卡片 */
.exam-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--card-shadow);
}

.exam-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.exam-tag {
  background: #2563eb;
  color: #ffffff;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 800;
}

.exam-title {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

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
  padding: 10px 14px;
}

.analysis-title {
  font-size: 12px;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 6px;
}

.analysis-list {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  padding-left: 18px;
  margin: 0;
}

.analysis-list li {
  margin-bottom: 4px;
}

.analysis-list strong {
  color: var(--vp-c-text-1);
}

/* 扩展防坑卡片 */
.trap-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.trap-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--vp-c-text-1);
}

.trap-badge {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.35);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 10.5px;
  font-weight: 800;
}

.trap-content {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.trap-content ul {
  padding-left: 18px;
  margin: 0;
}

.trap-content li {
  margin-bottom: 3px;
}
</style>
