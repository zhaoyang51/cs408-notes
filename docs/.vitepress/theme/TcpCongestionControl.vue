<template>
  <div class="tcp-cc-container">
    
    <!-- 顶部标题与公式横幅 -->
    <div class="cc-header">
      <div class="header-left">
        <span class="badge-amber">📈 拥塞控制大一统</span>
        <h4 class="header-title">4 大机制动态演进：慢开始 ➔ 拥塞避免 ➔ 超时跌落 ➔ 快重传与快恢复</h4>
      </div>
      <div class="rule-tags-row">
        <span class="tag-red">超时：<i class="m-var">ssthresh</i> = <i class="m-var">cwnd</i> / 2，<i class="m-var">cwnd</i> = 1</span>
        <span class="tag-blue">3 个重复 ACK：<i class="m-var">ssthresh</i> = <i class="m-var">cwnd</i> / 2，<i class="m-var">cwnd</i> = <i class="m-var">ssthresh</i> (或 +3)</span>
      </div>
    </div>

    <!-- 1. 核心折线图 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('chart')">
        <div class="header-title-box">
          <span class="card-icon">📊</span>
          <strong>拥塞窗口 (<i class="m-var">cwnd</i>) 0~28 传输轮次演化大一统拓扑图</strong>
          <span class="badge-sub">全景矢量</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.chart ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.chart" class="card-body">
        <div class="svg-wrapper">
          <svg viewBox="0 0 940 370" class="cc-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradSlowMaster" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.28"/>
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.03"/>
              </linearGradient>
              <linearGradient id="gradAvoidMaster" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.28"/>
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.03"/>
              </linearGradient>
            </defs>

            <!-- 网格线 -->
            <g class="grid-lines" stroke="var(--vp-c-border)" stroke-width="1" stroke-dasharray="3,3" opacity="0.6">
              <line x1="55" y1="290" x2="900" y2="290"/>
              <line x1="55" y1="250" x2="900" y2="250"/>
              <line x1="55" y1="210" x2="900" y2="210"/>
              <line x1="55" y1="170" x2="900" y2="170"/>
              <line x1="55" y1="130" x2="900" y2="130"/>
              <line x1="55" y1="90" x2="900" y2="90"/>
              <line x1="55" y1="50" x2="900" y2="50"/>
            </g>

            <!-- 区域 1: 初始慢开始 -->
            <polygon points="55,290 55,280 85,270 115,250 145,210 175,130 175,290" fill="url(#gradSlowMaster)"/>
            <text x="105" y="240" fill="#10b981" font-size="12" font-weight="bold">慢开始</text>

            <!-- 区域 2: 拥塞避免 1 -->
            <polygon points="175,290 175,130 205,120 235,110 265,100 295,90 325,80 355,70 385,60 415,50 415,290" fill="url(#gradAvoidMaster)"/>
            <text x="270" y="80" fill="#d97706" font-size="13" font-weight="bold">拥塞避免 (线性加 1)</text>

            <!-- 区域 3: 超时后慢开始 -->
            <polygon points="445,290 445,280 475,270 505,250 535,210 565,170 565,290" fill="url(#gradSlowMaster)"/>
            <text x="495" y="235" fill="#10b981" font-size="12" font-weight="bold">慢开始</text>

            <!-- 区域 4: 拥塞避免 2 -->
            <polygon points="565,290 565,170 595,160 625,150 655,140 685,130 685,290" fill="url(#gradAvoidMaster)"/>
            <text x="610" y="135" fill="#d97706" font-size="12" font-weight="bold">拥塞避免</text>

            <!-- 区域 5: 快恢复后拥塞避免 3 -->
            <polygon points="715,290 715,210 745,200 775,190 805,180 835,170 835,290" fill="url(#gradAvoidMaster)"/>
            <text x="760" y="175" fill="#d97706" font-size="12" font-weight="bold">拥塞避免</text>

            <!-- 3 条门限线 -->
            <line x1="55" y1="130" x2="415" y2="130" stroke="#64748b" stroke-width="1.6" stroke-dasharray="6,4"/>
            <text x="58" y="123" fill="#64748b" font-size="10.5" font-weight="bold">ssthresh 初始值 = 16 KB</text>

            <line x1="415" y1="170" x2="685" y2="170" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="6,4"/>
            <text x="448" y="163" fill="#ef4444" font-size="10.5" font-weight="bold">ssthresh 更新值 1 = 24 / 2 = 12 KB</text>

            <line x1="685" y1="210" x2="890" y2="210" stroke="#8b5cf6" stroke-width="1.8" stroke-dasharray="6,4"/>
            <text x="718" y="203" fill="#8b5cf6" font-size="10.5" font-weight="bold">ssthresh 更新值 2 = 16 / 2 = 8 KB</text>

            <!-- 折线主体 -->
            <polyline points="
              55,280 85,270 115,250 145,210 175,130 
              205,120 235,110 265,100 295,90 325,80 355,70 385,60 415,50
            " fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

            <line x1="415" y1="50" x2="445" y2="280" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,3"/>

            <polyline points="
              445,280 475,270 505,250 535,210 565,170 
              595,160 625,150 655,140 685,130
            " fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

            <line x1="685" y1="130" x2="715" y2="210" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="4,3"/>

            <polyline points="
              715,210 745,200 775,190 805,180 835,170
            " fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

            <!-- 关键节点 -->
            <circle cx="415" cy="50" r="7" fill="#ef4444"/>
            <text x="415" y="44" font-size="10" font-weight="900" text-anchor="middle" fill="#fff">24</text>
            <rect x="360" y="8" width="180" height="32" rx="4" fill="rgba(239,68,68,0.12)" stroke="#ef4444" stroke-width="1"/>
            <text x="450" y="22" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#ef4444">🔴 超时重传 (Timeout)</text>
            <text x="450" y="34" font-size="9" text-anchor="middle" fill="#ef4444">ssthresh=12, cwnd 重置为 1</text>

            <polygon points="685,118 693,134 677,134" fill="#0284c7"/>
            <text x="685" y="146" font-size="10" font-weight="bold" text-anchor="middle" fill="#0284c7">16</text>
            <rect x="630" y="70" width="165" height="32" rx="4" fill="rgba(2,132,199,0.12)" stroke="#0284c7" stroke-width="1"/>
            <text x="712" y="84" font-size="10.5" font-weight="bold" text-anchor="middle" fill="#0284c7">🔷 收到 3 个重复确认</text>
            <text x="712" y="96" font-size="9" text-anchor="middle" fill="#0284c7">触发快重传与快恢复</text>

            <rect x="709" y="204" width="12" height="12" rx="2" fill="#8b5cf6"/>
            <text x="715" y="228" font-size="10" font-weight="bold" text-anchor="middle" fill="#8b5cf6">8</text>
            <text x="760" y="250" font-size="10" font-weight="bold" fill="#8b5cf6">🟣 快恢复: cwnd = ssthresh = 8</text>

            <!-- 坐标轴 -->
            <g stroke="var(--vp-c-text-1)" stroke-width="1.5">
              <line x1="55" y1="290" x2="55" y2="15"/>
              <line x1="55" y1="290" x2="905" y2="290"/>
            </g>
            <text x="45" y="15" font-size="10.5" font-weight="bold" text-anchor="end" fill="var(--vp-c-text-1)">cwnd (KB)</text>
            <g font-size="9" text-anchor="end" fill="var(--vp-c-text-2)">
              <text x="48" y="294">0</text><text x="48" y="254">4</text><text x="48" y="214">8</text>
              <text x="48" y="174">12</text><text x="48" y="134">16</text><text x="48" y="94">20</text><text x="48" y="54">24</text>
            </g>
            <text x="905" y="305" font-size="10.5" font-weight="bold" fill="var(--vp-c-text-1)">传输轮次</text>
            <g font-size="8.5" text-anchor="middle" fill="var(--vp-c-text-2)">
              <text x="55" y="305">0</text><text x="85" y="305">1</text><text x="115" y="305">2</text><text x="145" y="305">3</text><text x="175" y="305">4</text>
              <text x="205" y="305">5</text><text x="235" y="305">6</text><text x="265" y="305">7</text><text x="295" y="305">8</text><text x="325" y="305">9</text>
              <text x="355" y="305">10</text><text x="385" y="305">11</text><text x="415" y="305">12</text><text x="445" y="305">13</text><text x="475" y="305">14</text>
              <text x="505" y="305">15</text><text x="535" y="305">16</text><text x="565" y="305">17</text><text x="595" y="305">18</text><text x="625" y="305">19</text>
              <text x="655" y="305">20</text><text x="685" y="305">21</text><text x="715" y="305">22</text><text x="745" y="305">23</text><text x="775" y="305">24</text>
              <text x="805" y="305">25</text><text x="835" y="305">26</text><text x="865" y="305">27</text><text x="895" y="305">28</text>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- 2. 快重传与快恢复核心机制详解 (支持折叠) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('frfr')">
        <div class="header-title-box">
          <span class="card-icon">⚡</span>
          <strong>快重传 (Fast Retransmit) 与 快恢复 (Fast Recovery) 原理与实现</strong>
          <span class="badge-blue">核心考点</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.frfr ? '收起 ▲' : '展开原理 ▼' }}
        </button>
      </div>

      <div v-show="openSections.frfr" class="card-body">
        <div class="m-grid">
          <!-- 快重传 -->
          <div class="m-item item-blue">
            <div class="m-item-head">
              <span class="m-item-icon">🔄</span>
              <strong>一、快重传 (Fast Retransmit) 核心机制</strong>
            </div>
            <div class="m-item-content">
              <p class="m-core-def"><strong>核心目的</strong>：使发送方<strong>尽快重传</strong>丢失的分组，而不是等待超时重传计时器超时。</p>
              <ul class="m-sub-list">
                <li><strong>立即确认</strong>：接收方不等待捎带确认，收到报文段<strong>立即发送确认</strong>；</li>
                <li><strong>重复确认</strong>：收到失序报文段立即发送对已收到报文段的<strong>重复确认 (Duplicate ACK)</strong>；</li>
                <li><strong>3 次触发立即重传</strong>：发送方一旦<strong>收到 3 个连续的重复确认</strong>，立即重传对应报文段；</li>
                <li><strong>效益提升</strong>：避免了因超时重传误将 <i class="m-var">cwnd</i> 降为 1，网络吞吐量<strong>提升约 20%</strong>。</li>
              </ul>
            </div>
          </div>

          <!-- 快恢复 -->
          <div class="m-item item-purple">
            <div class="m-item-head">
              <span class="m-item-icon">🛡️</span>
              <strong>二、快恢复 (Fast Recovery) 核心机制与 2 种实现</strong>
            </div>
            <div class="m-item-content">
              <p class="m-core-def"><strong>触发前提</strong>：收到 3 个重复确认表明<strong>仅丢失个别报文段</strong>，不启动慢开始，执行快恢复：</p>
              <div class="impl-box">
                <div class="impl-title">📌 实现方式 1（经典标准实现）：</div>
                <p>将慢开始门限与拥塞窗口同时调整为当前窗口的一半：<br>
                   <span class="m-formula"><i class="m-var">ssthresh</i> = <i class="m-var">cwnd</i> / 2</span>，
                   <span class="m-formula"><i class="m-var">cwnd</i> = <i class="m-var">ssthresh</i></span><br>
                   随后直接执行<strong>拥塞避免算法</strong>（加法线性递增）。
                </p>
              </div>

              <div class="impl-box">
                <div class="impl-title">📌 实现方式 2（RFC 5681 优化实现：<i class="m-var">cwnd</i> = <i class="m-var">ssthresh</i> + 3）：</div>
                <p>把初始拥塞窗口扩大为 <span class="m-formula"><i class="m-var">ssthresh</i> + 3</span>。其<strong>深层原理</strong>为：</p>
                <ul class="impl-reason-list">
                  <li>收到 3 个重复确认表明<strong>已有 3 个数据报文段离开了网络</strong>并留在接收缓存中；</li>
                  <li>网络中报文段实际减少了 3 个，故可适当将拥塞窗口扩大 3 个 MSS。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 408 概念陷阱深度辨析 (支持折叠) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('traps')">
        <div class="header-title-box">
          <span class="card-icon">🎯</span>
          <strong>408 高频选择题概念陷阱辨析（慢开始不慢 / 拥塞避免不免）</strong>
          <span class="badge-red">必背陷阱</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.traps ? '收起 ▲' : '展开辨析 ▼' }}
        </button>
      </div>

      <div v-show="openSections.traps" class="card-body">
        <div class="trap-grid">
          <div class="trap-item">
            <div class="trap-item-title">■ “慢开始”真的“慢”吗？</div>
            <div class="trap-item-body">
              <strong>“慢开始”是指一开始向网络注入的报文段少</strong>（从 <i class="m-var">cwnd</i> = 1 MSS 起步试探），<strong>并不是指拥塞窗口 <i class="m-var">cwnd</i> 的增长速度慢</strong>！<br>
              相反，慢开始阶段拥塞窗口每经过一个 RTT 就<strong>指数级翻倍（1 ➔ 2 ➔ 4 ➔ 8…）</strong>，其增长速率在所有阶段中是<strong>最快、最剧烈</strong>的。
            </div>
          </div>

          <div class="trap-item">
            <div class="trap-item-title">■ “拥塞避免”能够“完全避免拥塞”吗？</div>
            <div class="trap-item-body">
              <strong>“拥塞避免”并非指能够完全避免拥塞</strong>，而是指在拥塞避免阶段将拥塞窗口控制为<strong>加法线性增长（+1 MSS / RTT）</strong>，降低窗口膨胀速率，<strong>使网络比较不容易出现拥塞</strong>。<br>
              当网络负载超过信道极限时，依然会发生超时或分组丢失。
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. 2009 题 39 真题精析与 4 个 RTT 演化表 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>【2009 年 统考题 39】TCP 拥塞控制超时恢复真题精解</strong>
          <span class="badge-green">真题演练</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam" class="card-body">
        <div class="exam-question">
          一个 TCP 连接总是以 1KB 的最大段长 MSS 发送 TCP 段，发送方有足够多的数据要发送。当拥塞窗口为 16KB 时发生了超时，如果接下来的 4 个 RTT（往返时间）内的 TCP 段的传输都是成功的，那么当第 4 个 RTT 时间内发送的所有 TCP 段都得到肯定应答时，拥塞窗口大小是（&nbsp;&nbsp;&nbsp;&nbsp;）。
        </div>

        <div class="exam-options">
          <div class="opt-item">A. 7KB</div>
          <div class="opt-item">B. 8KB</div>
          <div class="opt-item opt-correct"><strong>C. 9KB</strong> <span class="correct-badge">✔ 正确答案</span></div>
          <div class="opt-item">D. 16KB</div>
        </div>

        <!-- 审题要点说明 -->
        <div class="exam-insight-box">
          <div class="insight-title">💡 关键审题与破题点（关于初始 ssthresh 的说明）：</div>
          <div class="insight-content">
            <p>1. <strong>初始门限不影响解题</strong>：题目中<strong>并未给出发生超时前的初始慢开始门限是多少</strong>。实际上，一开始的 <i class="m-var">ssthresh</i> 无论设为 8KB、16KB 还是 32KB，对本题解答<strong>毫无影响</strong>。</p>
            <p>2. <strong>超时门限更新法则</strong>：根据 TCP 协议规范，<strong>一旦在 <i class="m-var">cwnd</i> = 16KB 发生超时</strong>，新的门限强制更新为发生拥塞时的一半：
               <span class="m-formula"><i class="m-var">ssthresh</i> = 16KB / 2 = 8KB</span>，
               同时拥塞窗口重置为 <span class="m-formula"><i class="m-var">cwnd</i> = 1KB</span>，重新执行慢开始。
            </p>
            <p>3. <strong>推导起点</strong>：后续接下来的 4 个 RTT 全部严格以此超时重置时刻（<i class="m-var">ssthresh</i> = 8KB, <i class="m-var">cwnd</i> = 1KB）为唯一起点展开推导！</p>
          </div>
        </div>

        <!-- 4 个 RTT 逐步推导表格 -->
        <div class="rtt-steps-box">
          <div class="rtt-box-title">🔍 超时后 4 个 RTT 演化推导链条：</div>
          <div class="rtt-table-responsive">
            <table class="rtt-table">
              <thead>
                <tr>
                  <th>阶段 / 时刻</th>
                  <th>RTT 计数</th>
                  <th>拥塞窗口 cwnd</th>
                  <th>门限 ssthresh</th>
                  <th>所处算法</th>
                  <th>演进规则说明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>超时触发刻</strong></td>
                  <td>RTT 0</td>
                  <td class="cell-red">1 KB</td>
                  <td class="cell-amber">8 KB (16 / 2)</td>
                  <td>慢开始</td>
                  <td>超时将 ssthresh 减半为 8KB，cwnd 重置为 1KB</td>
                </tr>
                <tr>
                  <td><strong>第 1 个 RTT 结束</strong></td>
                  <td>RTT 1</td>
                  <td>2 KB</td>
                  <td>8 KB</td>
                  <td>慢开始 (cwnd &lt; ssthresh)</td>
                  <td>收到全部 ACK，指数翻倍：1 × 2 = 2 KB</td>
                </tr>
                <tr>
                  <td><strong>第 2 个 RTT 结束</strong></td>
                  <td>RTT 2</td>
                  <td>4 KB</td>
                  <td>8 KB</td>
                  <td>慢开始 (cwnd &lt; ssthresh)</td>
                  <td>收到全部 ACK，指数翻倍：2 × 2 = 4 KB</td>
                </tr>
                <tr>
                  <td><strong>第 3 个 RTT 结束</strong></td>
                  <td>RTT 3</td>
                  <td>8 KB</td>
                  <td>8 KB</td>
                  <td>触碰门限</td>
                  <td>收到全部 ACK，指数翻倍达到门限：4 × 2 = 8 KB</td>
                </tr>
                <tr class="row-target">
                  <td><strong>第 4 个 RTT 结束</strong></td>
                  <td>RTT 4</td>
                  <td class="cell-target-val">9 KB</td>
                  <td>8 KB</td>
                  <td>拥塞避免</td>
                  <td><strong>cwnd ≥ ssthresh 切换为加法线性递增：8 + 1 = 9 KB</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive } from 'vue'

const openSections = reactive({
  chart: false,  // 默认展开图解
  frfr: false,   // 默认展开原理
  traps: false, // 默认收起辨析
  exam: false    // 默认展开真题
})

const toggle = (key) => {
  openSections[key] = !openSections[key]
}
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
  font-size: 13.5px;
  font-weight: 800;
  margin: 0;
  color: var(--vp-c-text-1);
}

.rule-tags-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-red {
  background: var(--vp-c-bg);
  border: 1px dashed #ef4444;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  color: #ef4444;
  font-weight: 700;
}

.tag-blue {
  background: var(--vp-c-bg);
  border: 1px dashed #2563eb;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  color: #2563eb;
  font-weight: 700;
}

/* 可折叠卡片 */
.collapsible-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: all 0.2s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--vp-c-bg-elv);
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid transparent;
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

.badge-sub, .badge-blue, .badge-red, .badge-green {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.badge-sub { background: var(--vp-c-bg); border: 1px solid var(--vp-c-border); color: var(--vp-c-text-2); }
.badge-blue { background: rgba(37, 99, 235, 0.12); color: #2563eb; }
.badge-red { background: rgba(239, 68, 68, 0.12); color: #ef4444; }
.badge-green { background: rgba(16, 185, 129, 0.12); color: #059669; }

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

/* 矢量图 */
.svg-wrapper {
  width: 100%;
  overflow-x: auto;
}

.cc-svg {
  width: 100%;
  min-width: 780px;
  height: auto;
  display: block;
}

/* 数学公式与变量样式 */
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
  margin: 2px 0;
}

/* 快重传与快恢复网格 */
.m-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 820px) {
  .m-grid {
    grid-template-columns: 1fr;
  }
}

.m-item {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-blue { border-left: 4px solid #2563eb; }
.item-purple { border-left: 4px solid #8b5cf6; }

.m-item-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.m-item-content {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.m-core-def {
  margin: 0;
  color: var(--vp-c-text-1);
}

.m-sub-list {
  padding-left: 16px;
  margin: 0;
}

.m-sub-list li {
  margin-bottom: 4px;
}

.impl-box {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 8px 10px;
  margin-top: 4px;
}

.impl-title {
  font-weight: 800;
  color: #8b5cf6;
  margin-bottom: 2px;
}

.impl-box p {
  margin: 0;
}

.impl-reason-list {
  padding-left: 14px;
  margin: 4px 0 0 0;
  font-size: 11px;
}

.impl-reason-list li {
  margin-bottom: 2px;
}

/* 概念辨析 */
.trap-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (max-width: 768px) {
  .trap-grid {
    grid-template-columns: 1fr;
  }
}

.trap-item {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-left: 4px solid #ef4444;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.trap-item-title {
  font-size: 12px;
  font-weight: 800;
  color: #ef4444;
}

.trap-item-body {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.trap-item-body strong {
  color: var(--vp-c-text-1);
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

.exam-insight-box {
  background: var(--vp-c-bg);
  border: 1px solid rgba(37, 99, 235, 0.35);
  border-radius: 8px;
  padding: 10px 12px;
}

.insight-title {
  font-size: 12px;
  font-weight: 800;
  color: #2563eb;
}

.insight-content {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.insight-content p {
  margin: 3px 0;
}

.insight-content strong {
  color: var(--vp-c-text-1);
}

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
  margin-bottom: 6px;
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

.cell-red { color: #ef4444; font-weight: 800; }
.cell-amber { color: #d97706; font-weight: 800; }
.row-target { background: rgba(219, 39, 119, 0.08); }
.cell-target-val { color: #db2777; font-weight: 900; font-size: 13px; }
</style>
