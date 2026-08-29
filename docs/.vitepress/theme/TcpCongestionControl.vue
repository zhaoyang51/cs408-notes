<template>
  <div class="tcp-cc-container">
    
    <!-- 顶部标题与公式横幅 -->
    <div class="cc-header">
      <div class="header-left">
        <span class="badge-amber">📈 TCP 拥塞控制全景</span>
        <h3 class="header-title">拥塞窗口演变规律：慢开始 (指数) vs 拥塞避免 (加法)</h3>
      </div>
      <div class="rule-tag">
        超时重置：ssthresh = 发生拥塞时的 cwnd / 2，cwnd = 1
      </div>
    </div>

    <!-- 核心 SVG 矢量演化折线图 -->
    <div class="chart-card">
      <div class="chart-title">
        <span class="card-icon">📊</span>
        <strong>TCP 拥塞窗口 (cwnd) 动态演变折线图（超时重传与 4 个 RTT 恢复全景）</strong>
      </div>

      <div class="svg-wrapper">
        <svg viewBox="0 0 840 350" class="cc-svg" xmlns="http://www.w3.org/2000/svg">
          <!-- 背景网格线与坐标轴 -->
          <defs>
            <linearGradient id="gradSlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.03"/>
            </linearGradient>
            <linearGradient id="gradAvoid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.03"/>
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#db2777"/>
            </marker>
          </defs>

          <!-- 水平网格线 (每2KB一条) -->
          <g class="grid-lines" stroke="var(--vp-c-border)" stroke-width="1" stroke-dasharray="3,3" opacity="0.6">
            <line x1="50" y1="280" x2="790" y2="280"/> <!-- 0 -->
            <line x1="50" y1="250" x2="790" y2="250"/> <!-- 2 -->
            <line x1="50" y1="220" x2="790" y2="220"/> <!-- 4 -->
            <line x1="50" y1="190" x2="790" y2="190"/> <!-- 6 -->
            <line x1="50" y1="160" x2="790" y2="160"/> <!-- 8 ssthresh -->
            <line x1="50" y1="130" x2="790" y2="130"/> <!-- 10 -->
            <line x1="50" y1="100" x2="790" y2="100"/> <!-- 12 -->
            <line x1="50" y1="70" x2="790" y2="70"/>   <!-- 14 -->
            <line x1="50" y1="40" x2="790" y2="40"/>   <!-- 16 -->
          </g>

          <!-- 区域填充色块 1: 前期慢开始 (假设初始门限为8KB) -->
          <polygon points="50,280 50,265 85,250 120,220 155,160 155,280" fill="url(#gradSlow)"/>
          <text x="80" y="235" fill="#10b981" font-size="11" font-weight="bold">慢开始</text>
          <text x="80" y="248" fill="#10b981" font-size="9">(假设初始门限)</text>

          <!-- 区域填充色块 2: 前期拥塞避免 -->
          <polygon points="155,280 155,160 190,145 225,130 260,115 295,100 330,85 365,70 400,55 435,40 435,280" fill="url(#gradAvoid)"/>
          <text x="270" y="75" fill="#d97706" font-size="12.5" font-weight="bold">拥塞避免 (每个 RTT 线性加 1)</text>

          <!-- 区域填充色块 3: 超时后慢开始 (第 12~15 轮) -->
          <polygon points="470,280 470,265 505,250 540,220 575,160 575,280" fill="url(#gradSlow)"/>
          <text x="500" y="220" fill="#10b981" font-size="12" font-weight="bold">慢开始</text>

          <!-- 区域填充色块 4: 超时后拥塞避免 (第 15~16 轮) -->
          <polygon points="575,280 575,160 610,145 610,280" fill="url(#gradAvoid)"/>
          <text x="575" y="105" fill="#d97706" font-size="11" font-weight="bold">拥塞避免</text>

          <!-- ssthresh 红色基准虚线 (8KB, y=160) -->
          <line x1="50" y1="160" x2="790" y2="160" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="6,4"/>
          <rect x="52" y="142" width="220" height="18" rx="3" fill="var(--vp-c-bg)" stroke="#ef4444" stroke-width="0.8"/>
          <text x="56" y="155" fill="#ef4444" font-size="10.5" font-weight="bold">超时后更新门限 ssthresh = 16 / 2 = 8 KB</text>

          <!-- 折线 1: 前期演变 -->
          <polyline points="
            50,265 
            85,250 
            120,220 
            155,160 
            190,145 
            225,130 
            260,115 
            295,100 
            330,85 
            365,70 
            400,55 
            435,40
          " fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- 折线 2: 超时断崖跌落 (435,40 -> 470,265) -->
          <line x1="435" y1="40" x2="470" y2="265" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,3"/>

          <!-- 折线 3: 超时后恢复折线 (470,265 -> 610,145) -->
          <polyline points="
            470,265 
            505,250 
            540,220 
            575,160 
            610,145
          " fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- 各数据点圆圈与标签 -->
          <g fill="#2563eb">
            <circle cx="50" cy="265" r="3.5"/><text x="50" y="260" font-size="9" text-anchor="middle" fill="var(--vp-c-text-2)">1</text>
            <circle cx="85" cy="250" r="3.5"/><text x="85" y="245" font-size="9" text-anchor="middle" fill="var(--vp-c-text-2)">2</text>
            <circle cx="120" cy="220" r="3.5"/><text x="120" y="215" font-size="9" text-anchor="middle" fill="var(--vp-c-text-2)">4</text>
            <circle cx="155" cy="160" r="4"/><text x="155" y="155" font-size="10" font-weight="bold" text-anchor="middle" fill="#2563eb">8</text>
            <circle cx="190" cy="145" r="3"/><text x="190" y="140" font-size="8.5" text-anchor="middle" fill="var(--vp-c-text-3)">9</text>
            <circle cx="225" cy="130" r="3"/><text x="225" y="125" font-size="8.5" text-anchor="middle" fill="var(--vp-c-text-3)">10</text>
            <circle cx="260" cy="115" r="3"/><text x="260" y="110" font-size="8.5" text-anchor="middle" fill="var(--vp-c-text-3)">11</text>
            <circle cx="295" cy="100" r="3"/><text x="295" y="95" font-size="8.5" text-anchor="middle" fill="var(--vp-c-text-3)">12</text>
            <circle cx="330" cy="85" r="3"/><text x="330" y="80" font-size="8.5" text-anchor="middle" fill="var(--vp-c-text-3)">13</text>
            <circle cx="365" cy="70" r="3"/><text x="365" y="65" font-size="8.5" text-anchor="middle" fill="var(--vp-c-text-3)">14</text>
            <circle cx="400" cy="55" r="3"/><text x="400" y="50" font-size="8.5" text-anchor="middle" fill="var(--vp-c-text-3)">15</text>
          </g>

          <!-- 超时发生红圈点 (435, 40) -->
          <circle cx="435" cy="40" r="6" fill="#ef4444"/>
          <text x="435" y="28" font-size="11" font-weight="bold" text-anchor="middle" fill="#ef4444">16 (发生超时)</text>

          <!-- 超时后 4 个 RTT 的关键点 -->
          <g fill="#2563eb">
            <circle cx="470" cy="265" r="4"/><text x="470" y="260" font-size="9.5" text-anchor="middle" fill="#2563eb">1</text>
            <circle cx="505" cy="250" r="4"/><text x="505" y="245" font-size="9.5" text-anchor="middle" fill="#2563eb">2</text>
            <circle cx="540" cy="220" r="4"/><text x="540" y="215" font-size="9.5" text-anchor="middle" fill="#2563eb">4</text>
            <circle cx="575" cy="160" r="4.5" fill="#d97706"/><text x="575" y="153" font-size="10" font-weight="bold" text-anchor="middle" fill="#d97706">8</text>
          </g>

          <!-- 最终目标点：第 4 个 RTT 结束 (610, 145) -->
          <circle cx="610" cy="145" r="6" fill="#db2777"/>
          <text x="610" y="137" font-size="12" font-weight="bold" text-anchor="middle" fill="#db2777">9 KB</text>

          <!-- 粉色箭头与提示说明 -->
          <path d="M 685,180 L 625,152" fill="none" stroke="#db2777" stroke-width="2" marker-end="url(#arrow)"/>
          <rect x="635" y="185" width="165" height="42" rx="6" fill="rgba(219,39,119,0.12)" stroke="#db2777" stroke-width="1.2"/>
          <text x="717" y="202" font-size="11" font-weight="bold" text-anchor="middle" fill="#db2777">超时后的第 4 个 RTT 后</text>
          <text x="717" y="218" font-size="11" font-weight="bold" text-anchor="middle" fill="#db2777">拥塞窗口增长到 9 KB</text>

          <!-- 坐标轴主体 -->
          <g stroke="var(--vp-c-text-1)" stroke-width="1.5">
            <!-- Y 轴 -->
            <line x1="50" y1="280" x2="50" y2="20"/>
            <!-- X 轴 -->
            <line x1="50" y1="280" x2="800" y2="280"/>
          </g>

          <!-- Y 轴标签 -->
          <text x="40" y="15" font-size="10.5" font-weight="bold" text-anchor="end" fill="var(--vp-c-text-1)">cwnd (KB)</text>
          <g font-size="9.5" text-anchor="end" fill="var(--vp-c-text-2)">
            <text x="42" y="284">0</text>
            <text x="42" y="254">2</text>
            <text x="42" y="224">4</text>
            <text x="42" y="194">6</text>
            <text x="42" y="164">8</text>
            <text x="42" y="134">10</text>
            <text x="42" y="104">12</text>
            <text x="42" y="74">14</text>
            <text x="42" y="44">16</text>
          </g>

          <!-- X 轴刻度 (0..20) -->
          <text x="795" y="295" font-size="10.5" font-weight="bold" fill="var(--vp-c-text-1)">传输轮次</text>
          <g font-size="9" text-anchor="middle" fill="var(--vp-c-text-2)">
            <text x="50" y="295">0</text>
            <text x="85" y="295">1</text>
            <text x="120" y="295">2</text>
            <text x="155" y="295">3</text>
            <text x="190" y="295">4</text>
            <text x="225" y="295">5</text>
            <text x="260" y="295">6</text>
            <text x="295" y="295">7</text>
            <text x="330" y="295">8</text>
            <text x="365" y="295">9</text>
            <text x="400" y="295">10</text>
            <text x="435" y="295">11</text>
            <text x="470" y="295">12</text>
            <text x="505" y="295">13</text>
            <text x="540" y="295">14</text>
            <text x="575" y="295">15</text>
            <text x="610" y="295">16</text>
            <text x="645" y="295">17</text>
            <text x="680" y="295">18</text>
            <text x="715" y="295">19</text>
            <text x="750" y="295">20</text>
          </g>
        </svg>
      </div>
    </div>

    <!-- 2009 年题 39 真题解析卡片 -->
    <div class="exam-card">
      <div class="exam-header">
        <span class="exam-tag">📝 408 经典真题</span>
        <span class="exam-title">【2009 年 统考题 39】TCP 拥塞控制超时恢复计算</span>
      </div>

      <div class="exam-question">
        一个 TCP 连接总是以 1KB 的最大段长 MSS 发送 TCP 段，发送方有足够多的数据要发送。当拥塞窗口为 16KB 时发生了超时，如果接下来的 4 个 RTT（往返时间）内的 TCP 段的传输都是成功的，那么当第 4 个 RTT 时间内发送的所有 TCP 段都得到肯定应答时，拥塞窗口大小是（&nbsp;&nbsp;&nbsp;&nbsp;）。
      </div>

      <div class="exam-options">
        <div class="opt-item">A. 7KB</div>
        <div class="opt-item">B. 8KB</div>
        <div class="opt-item opt-correct"><strong>C. 9KB</strong> <span class="correct-badge">✔ 正确答案</span></div>
        <div class="opt-item">D. 16KB</div>
      </div>

      <!-- 核心审题与破题说明 -->
      <div class="exam-insight-box">
        <div class="insight-title">💡 关键审题与破题点（关于初始 ssthresh 的说明）：</div>
        <div class="insight-content">
          <p>1. <strong>初始门限不影响解题</strong>：题目中<strong>并未给出第 11 轮超时发生前的初始慢开始门限是多少</strong>。图示中假设初始门限为 8KB 仅为绘图演示。实际上，一开始的 $ssthresh$ 无论是 8KB、16KB 还是 32KB，对本题的解答<strong>毫无影响</strong>。</p>
          <p>2. <strong>超时门限更新法则</strong>：根据 TCP 拥塞控制协议规范，无论超时发生前的状态如何，<strong>一旦在 $cwnd = 16\text{KB}$ 时发生了网络超时</strong>，新的慢开始门限必然被更新为<strong>发生拥塞时拥塞窗口的一半</strong>，即：
             $$\text{更新后的慢开始门限 } ssthresh = \frac{\text{发生拥塞时的 } cwnd}{2} = \frac{16\text{KB}}{2} = \mathbf{8\text{KB}}$$
             同时拥塞窗口重置为 $\mathbf{cwnd = 1\text{KB}}$，并重新执行慢开始算法。</p>
          <p>3. <strong>推导起点</strong>：后续接下来的 4 个 RTT 的计算，全部严格以此<strong>超时重置时刻（$ssthresh = 8\text{KB}, cwnd = 1\text{KB}$）作为独立起点</strong>展开推导！</p>
        </div>
      </div>

      <!-- 4 个 RTT 逐轮演化推导表 -->
      <div class="rtt-steps-box">
        <div class="rtt-box-title">🔍 超时后 4 个 RTT 演化推导链条：</div>
        <div class="rtt-table-responsive">
          <table class="rtt-table">
            <thead>
              <tr>
                <th>阶段 / 时刻</th>
                <th>RTT 计数</th>
                <th>当前拥塞窗口 cwnd</th>
                <th>门限 ssthresh</th>
                <th>所处拥塞控制算法</th>
                <th>窗口演进规则说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>超时触发刻</strong></td>
                <td>RTT 0</td>
                <td class="cell-highlight-red">1 KB</td>
                <td class="cell-highlight-amber">8 KB (16 / 2)</td>
                <td>慢开始 (Slow Start)</td>
                <td>超时将 ssthresh 减半为 8KB，cwnd 重置为 1KB</td>
              </tr>
              <tr>
                <td><strong>第 1 个 RTT 结束</strong></td>
                <td>RTT 1</td>
                <td>2 KB</td>
                <td>8 KB</td>
                <td>慢开始 (cwnd &lt; ssthresh)</td>
                <td>收到全部 ACK，cwnd 指数翻倍：1 × 2 = 2 KB</td>
              </tr>
              <tr>
                <td><strong>第 2 个 RTT 结束</strong></td>
                <td>RTT 2</td>
                <td>4 KB</td>
                <td>8 KB</td>
                <td>慢开始 (cwnd &lt; ssthresh)</td>
                <td>收到全部 ACK，cwnd 指数翻倍：2 × 2 = 4 KB</td>
              </tr>
              <tr>
                <td><strong>第 3 个 RTT 结束</strong></td>
                <td>RTT 3</td>
                <td>8 KB</td>
                <td>8 KB</td>
                <td>触碰慢开始门限</td>
                <td>收到全部 ACK，cwnd 指数翻倍达到门限：4 × 2 = 8 KB</td>
              </tr>
              <tr class="row-target">
                <td><strong>第 4 个 RTT 结束</strong></td>
                <td>RTT 4</td>
                <td class="cell-target-val">9 KB</td>
                <td>8 KB</td>
                <td>拥塞避免 (Congestion Avoid)</td>
                <td><strong>cwnd ≥ ssthresh 切换为加法线性递增：8 + 1 = 9 KB</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 4 大机制切换法则总结卡片 -->
    <div class="summary-rules-card">
      <div class="rules-title">💡 TCP 拥塞控制 4 大机制状态机切换核心准则</div>
      <div class="rules-grid">
        <div class="rule-box box-slow">
          <div class="r-title">1. 慢开始 (Slow Start)</div>
          <div class="r-desc"><strong>条件</strong>：$cwnd < ssthresh$<br><strong>规律</strong>：每经过 1 个 RTT，拥塞窗口 $cwnd$ <strong>指数级翻倍</strong>（$1 \rightarrow 2 \rightarrow 4 \dots$）。</div>
        </div>

        <div class="rule-box box-avoid">
          <div class="r-title">2. 拥塞避免 (Congestion Avoid)</div>
          <div class="r-desc"><strong>条件</strong>：$cwnd \ge ssthresh$<br><strong>规律</strong>：每经过 1 个 RTT，拥塞窗口 $cwnd$ <strong>线性加法递增 $+1$</strong>。</div>
        </div>

        <div class="rule-box box-timeout">
          <div class="r-title">3. 网络超时 (Timeout)</div>
          <div class="r-desc"><strong>重置</strong>：$ssthresh = cwnd / 2$ 且 $cwnd = 1$。<br><strong>状态</strong>：重新进入慢开始算法。</div>
        </div>

        <div class="rule-box box-fast">
          <div class="r-title">4. 快重传与快恢复 (FR/FR)</div>
          <div class="r-desc"><strong>触发</strong>：收到 <strong>3 个冗余 ACK</strong>。<br><strong>重置</strong>：$ssthresh = cwnd / 2$ 且 $cwnd = ssthresh$，直接进入拥塞避免。</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
// 组件纯原生 CSS + 结构渲染，零外部依赖
</script>

<style scoped>
.tcp-cc-container {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 顶部栏 */
.cc-header {
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

.badge-amber {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.35);
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

.rule-tag {
  background: var(--vp-c-bg);
  border: 1px dashed #ef4444;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11.5px;
  color: #ef4444;
  font-weight: 700;
  font-family: 'JetBrains Mono', Consolas, monospace;
}

/* 矢量折线图卡片 */
.chart-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--card-shadow);
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-border);
  padding-bottom: 8px;
}

.svg-wrapper {
  width: 100%;
  overflow-x: auto;
}

.cc-svg {
  width: 100%;
  min-width: 680px;
  height: auto;
  display: block;
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

/* 审题与破题点卡片 */
.exam-insight-box {
  background: var(--vp-c-bg);
  border: 1px solid rgba(37, 99, 235, 0.35);
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.insight-title {
  font-size: 12.5px;
  font-weight: 800;
  color: #2563eb;
}

.insight-content {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.insight-content p {
  margin: 4px 0;
}

.insight-content strong {
  color: var(--vp-c-text-1);
}

/* 4 个 RTT 演化推导表格 */
.rtt-steps-box {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 10px 12px;
}

.rtt-box-title {
  font-size: 12px;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 8px;
}

.rtt-table-responsive {
  overflow-x: auto;
}

.rtt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11.5px;
  text-align: left;
}

.rtt-table th, .rtt-table td {
  padding: 6px 8px;
  border: 1px solid var(--vp-c-border);
}

.rtt-table th {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-weight: 700;
}

.cell-highlight-red {
  color: #ef4444;
  font-weight: 800;
}

.cell-highlight-amber {
  color: #d97706;
  font-weight: 800;
}

.row-target {
  background: rgba(219, 39, 119, 0.08);
}

.cell-target-val {
  color: #db2777;
  font-weight: 900;
  font-size: 13px;
}

/* 4 大机制卡片网格 */
.summary-rules-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--card-shadow);
}

.rules-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-border);
  padding-bottom: 6px;
}

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
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.r-title {
  font-size: 12px;
  font-weight: 800;
}

.r-desc {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.box-slow .r-title { color: #059669; }
.box-avoid .r-title { color: #d97706; }
.box-timeout .r-title { color: #ef4444; }
.box-fast .r-title { color: #2563eb; }
</style>
