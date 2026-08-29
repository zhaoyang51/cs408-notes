<template>
  <div class="email-sim-container">
    
    <!-- 顶部标题横幅 (置顶用户黄金口诀) -->
    <div class="email-header">
      <div class="header-left">
        <span class="badge-blue">✉️ 电子邮件传输系统</span>
        <h4 class="header-title">SMTP 发送中继 (Push) + POP3 / IMAP 邮件读取 (Pull)</h4>
      </div>
      <div class="rule-tag">
        ⭐️ 黄金法则：给服务器送信全用 SMTP，从服务器取信才用 POP3/IMAP
      </div>
    </div>

    <!-- 1. 邮件传输 3 阶段全景时序拓扑图 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('topo')">
        <div class="header-title-box">
          <span class="card-icon">📡</span>
          <strong>一、电子邮件 3 阶段端到端传输拓扑与协议/角色对应图</strong>
          <span class="badge-blue">时序拓扑</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.topo ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.topo" class="card-body">
        
        <div class="svg-email-wrapper">
          <svg viewBox="0 0 860 300" class="email-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="email-arr-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7"/>
              </marker>
              <marker id="email-arr-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669"/>
              </marker>
            </defs>

            <!-- 1. 发送方用户代理 (用户1) -->
            <g transform="translate(20, 50)">
              <rect x="0" y="0" width="130" height="90" rx="8" fill="rgba(37,99,235,0.08)" stroke="#2563eb" stroke-width="1.5"/>
              <text x="65" y="24" font-size="11.5" font-weight="900" text-anchor="middle" fill="#2563eb">💻 发送方用户代理</text>
              <text x="65" y="42" font-size="10.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-2)">(用户 1)</text>
              <!-- 内部角色 -->
              <rect x="15" y="54" width="100" height="24" rx="4" fill="#0284c7"/>
              <text x="65" y="70" font-size="10" font-weight="bold" text-anchor="middle" fill="#fff">SMTP 客户</text>
            </g>

            <!-- 阶段 ① 箭头 (用户1 -> 邮件服务器1) -->
            <path d="M 155,95 L 260,95" fill="none" stroke="#0284c7" stroke-width="2.2" marker-end="url(#email-arr-blue)"/>
            <rect x="165" y="68" width="80" height="20" rx="3" fill="#e0f2fe" stroke="#0284c7"/>
            <text x="205" y="82" font-size="10" font-weight="900" text-anchor="middle" fill="#0369a1">① SMTP</text>
            <text x="205" y="112" font-size="9" text-anchor="middle" fill="var(--vp-c-text-3)">TCP 25 (Push)</text>

            <!-- 2. 发送方邮件服务器 (用户1的邮件服务器) -->
            <g transform="translate(265, 30)">
              <rect x="0" y="0" width="140" height="130" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
              <text x="70" y="24" font-size="11.5" font-weight="900" text-anchor="middle" fill="#38bdf8">🖥️ 发送方邮件服务器</text>
              <text x="70" y="42" font-size="10" text-anchor="middle" fill="#94a3b8">(用户 1 的服务器)</text>
              <!-- 两个角色 -->
              <rect x="15" y="55" width="110" height="26" rx="4" fill="#0284c7"/>
              <text x="70" y="72" font-size="10" font-weight="bold" text-anchor="middle" fill="#fff">SMTP 服务器</text>
              <rect x="15" y="90" width="110" height="26" rx="4" fill="#0284c7"/>
              <text x="70" y="107" font-size="10" font-weight="bold" text-anchor="middle" fill="#fff">SMTP 客户</text>
            </g>

            <!-- 阶段 ② 箭头 (邮件服务器1 -> 邮件服务器2) -->
            <path d="M 410,95 L 485,95" fill="none" stroke="#0284c7" stroke-width="2.2" marker-end="url(#email-arr-blue)"/>
            <rect x="415" y="68" width="60" height="20" rx="3" fill="#e0f2fe" stroke="#0284c7"/>
            <text x="445" y="82" font-size="10" font-weight="900" text-anchor="middle" fill="#0369a1">② SMTP</text>
            <text x="445" y="112" font-size="9" text-anchor="middle" fill="var(--vp-c-text-3)">TCP 25 (Push)</text>

            <!-- 3. 接收方邮件服务器 (用户2的邮件服务器) -->
            <g transform="translate(490, 30)">
              <rect x="0" y="0" width="140" height="130" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
              <text x="70" y="24" font-size="11.5" font-weight="900" text-anchor="middle" fill="#38bdf8">🖥️ 接收方邮件服务器</text>
              <text x="70" y="42" font-size="10" text-anchor="middle" fill="#94a3b8">(用户 2 的服务器)</text>
              <!-- 两个角色 -->
              <rect x="15" y="55" width="110" height="26" rx="4" fill="#0284c7"/>
              <text x="70" y="72" font-size="10" font-weight="bold" text-anchor="middle" fill="#fff">SMTP 服务器</text>
              <rect x="15" y="90" width="110" height="26" rx="4" fill="#059669"/>
              <text x="70" y="107" font-size="10" font-weight="bold" text-anchor="middle" fill="#fff">POP3/IMAP 服务端</text>
            </g>

            <!-- 阶段 ③ 箭头 (邮件服务器2 -> 用户2) -->
            <path d="M 635,95 L 705,95" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#email-arr-green)"/>
            <rect x="635" y="68" width="65" height="20" rx="3" fill="#ecfdf5" stroke="#059669"/>
            <text x="667" y="82" font-size="9.5" font-weight="900" text-anchor="middle" fill="#047857">③ POP3</text>
            <text x="667" y="112" font-size="9" text-anchor="middle" fill="var(--vp-c-text-3)">TCP 110 (Pull)</text>

            <!-- 4. 接收方用户代理 (用户2) -->
            <g transform="translate(710, 50)">
              <rect x="0" y="0" width="130" height="90" rx="8" fill="rgba(16,185,129,0.08)" stroke="#10b981" stroke-width="1.5"/>
              <text x="65" y="24" font-size="11.5" font-weight="900" text-anchor="middle" fill="#059669">💻 接收方用户代理</text>
              <text x="65" y="42" font-size="10.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-2)">(用户 2)</text>
              <!-- 内部角色 -->
              <rect x="15" y="54" width="100" height="24" rx="4" fill="#059669"/>
              <text x="65" y="70" font-size="10" font-weight="bold" text-anchor="middle" fill="#fff">POP3/IMAP 客户</text>
            </g>

            <!-- 底部宏观划分横幅 -->
            <!-- 发送段 -->
            <line x1="20" y1="210" x2="625" y2="210" stroke="#0284c7" stroke-width="2"/>
            <text x="320" y="200" font-size="11" font-weight="900" text-anchor="middle" fill="#0284c7">📤 使用 SMTP 发送 / 中继邮件 (阶段 ① + 阶段 ②)</text>
            <!-- 接收段 -->
            <line x1="635" y1="210" x2="840" y2="210" stroke="#059669" stroke-width="2"/>
            <text x="737" y="200" font-size="11" font-weight="900" text-anchor="middle" fill="#059669">📥 使用 POP3/IMAP 读取邮件 (阶段 ③)</text>

            <!-- 总结框 -->
            <rect x="20" y="240" width="820" height="42" rx="6" fill="var(--vp-c-bg-elv)" stroke="var(--vp-c-border)"/>
            <text x="430" y="265" font-size="11.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">
              💡 核心结论：<tspan fill="#2563eb">向服务器发送邮件（客户到服务器、服务器到服务器）全用 SMTP</tspan>；<tspan fill="#059669">从服务器读取邮件才用 POP3 或 IMAP</tspan>。
            </text>

          </svg>
        </div>

      </div>
    </div>

    <!-- 2. 【2012 年 统考题 40】真题精析 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam2012')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>二、【2012 年 统考题 40】邮件传输 3 阶段应用层协议判定真题精解</strong>
          <span class="badge-green">真题演练</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam2012 ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam2012" class="card-body">
        <div class="exam-question">
          若用户 1 与用户 2 之间发送和接收电子邮件的过程如拓扑图所示（用户 1 ➔ ① ➔ 邮件服务器 1 ➔ ② ➔ 邮件服务器 2 ➔ ③ ➔ 用户 2），则图中 ①、②、③ 阶段分别使用的应用层协议可以是（&nbsp;&nbsp;&nbsp;&nbsp;）。
        </div>

        <div class="exam-options">
          <div class="opt-item">A. SMTP、SMTP、SMTP</div>
          <div class="opt-item">B. POP3、SMTP、POP3</div>
          <div class="opt-item">C. POP3、SMTP、SMTP</div>
          <div class="opt-item opt-correct"><strong>D. SMTP、SMTP、POP3</strong> <span class="correct-badge">✔ 正确答案</span></div>
        </div>

        <div class="exam-analysis">
          <div class="analysis-title">🔍 核心推导步骤（408 极速秒杀法）：</div>
          <ol class="analysis-list">
            <li><strong>分析阶段 ①（用户 1 ➔ 邮件服务器 1）</strong>：用户代理向邮件服务器发送/上传邮件，属于“推 (Push)”操作，使用 <strong>SMTP</strong> 协议。</li>
            <li><strong>分析阶段 ②（邮件服务器 1 ➔ 邮件服务器 2）</strong>：邮件服务器之间进行邮件中继转发，属于“推 (Push)”操作，同样使用 <strong>SMTP</strong> 协议。</li>
            <li><strong>分析阶段 ③（邮件服务器 2 ➔ 用户 2）</strong>：用户代理从邮件服务器读取/下载邮件，属于“拉 (Pull)”操作，使用 <strong>POP3</strong> 或 <strong>IMAP</strong> 协议。</li>
            <li><strong>结论</strong>：①、②、③ 分别对应 <strong>SMTP、SMTP、POP3</strong>，正确答案选 <strong>D</strong>。</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- 3. 【2013 年 统考题 40】真题精析 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam2013')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>三、【2013 年 统考题 40】SMTP 协议传输特性与方向判定真题精解</strong>
          <span class="badge-green">真题演练</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam2013 ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam2013" class="card-body">
        <div class="exam-question">
          下列关于 SMTP 协议的叙述中，正确的是（&nbsp;&nbsp;&nbsp;&nbsp;）。<br>
          Ⅰ. 只支持传输 7 比特 ASCII 码内容<br>
          Ⅱ. 支持在邮件服务器之间发送邮件<br>
          Ⅲ. 支持从用户代理向邮件服务器发送邮件<br>
          Ⅳ. 支持从邮件服务器向用户代理发送邮件
        </div>

        <div class="exam-options">
          <div class="opt-item opt-correct"><strong>A. 仅 Ⅰ、Ⅱ 和 Ⅲ</strong> <span class="correct-badge">✔ 正确答案</span></div>
          <div class="opt-item">B. 仅 Ⅰ、Ⅱ 和 Ⅳ</div>
          <div class="opt-item">C. 仅 Ⅰ、Ⅲ 和 Ⅳ</div>
          <div class="opt-item">D. 仅 Ⅱ、Ⅲ 和 Ⅳ</div>
        </div>

        <div class="exam-analysis">
          <div class="analysis-title">🔍 逐项深度剖析：</div>
          <ul class="analysis-list">
            <li><strong>Ⅰ. 正确 ✔</strong>：原始 SMTP 只能传输 <strong>7 位 ASCII 码</strong>。传输中文、图片等二进制多媒体内容时必须借助 <strong>MIME</strong> 编码转换为 7 位 ASCII 码后再由 SMTP 传输。</li>
            <li><strong>Ⅱ. 正确 ✔</strong>：SMTP 既用于用户代理到邮件服务器的发送，也用于<strong>邮件服务器之间的中继发送</strong>。</li>
            <li><strong>Ⅲ. 正确 ✔</strong>：用户代理通过 SMTP 将邮件“推 (Push)”到发送方邮件服务器。</li>
            <li><strong>Ⅳ. 错误 ✖</strong>：SMTP <strong>绝不支持从邮件服务器向用户代理“推送”邮件</strong>。因为接收方用户代理可能关机或离线，无法建立长连接接收推送，必须由用户代理在开机联网后主动使用 <strong>POP3/IMAP</strong> 从服务器“拉取”。</li>
            <li><strong>结论</strong>：正确项为 Ⅰ、Ⅱ、Ⅲ，答案选 <strong>A</strong>。</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 4. 408 核心邮件协议速查对比表 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('diff')">
        <div class="header-title-box">
          <span class="card-icon">💡</span>
          <strong>四、SMTP / POP3 / IMAP / MIME 4 大邮件协议核心考点全景速查</strong>
          <span class="badge-amber">必考概念</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.diff ? '收起 ▲' : '展开速查 ▼' }}
        </button>
      </div>

      <div v-show="openSections.diff" class="card-body">
        <div class="table-wrapper">
          <table class="email-summary-table">
            <thead>
              <tr>
                <th>协议名称</th>
                <th>传输层</th>
                <th>熟知端口</th>
                <th>工作模式</th>
                <th>408 核心考点与特性</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>SMTP</strong> (简单邮件传输)</td>
                <td>TCP</td>
                <td><strong>25</strong></td>
                <td><strong>推 (Push)</strong></td>
                <td>用于<strong>客户端 ➔ 服务器</strong>、<strong>服务器 ➔ 服务器</strong>；仅支持 7 位 ASCII 码；不支持向客户端推信。</td>
              </tr>
              <tr>
                <td><strong>POP3</strong> (邮局协议第3版)</td>
                <td>TCP</td>
                <td><strong>110</strong></td>
                <td><strong>拉 (Pull)</strong></td>
                <td>用于<strong>客户端 ➔ 服务器读取邮件</strong>；默认将邮件从服务器下载并删除（不支持多端状态同步）。</td>
              </tr>
              <tr>
                <td><strong>IMAP</strong> (因特网报文存取)</td>
                <td>TCP</td>
                <td><strong>143</strong></td>
                <td><strong>拉 (Pull)</strong></td>
                <td>用于<strong>客户端 ➔ 服务器读取邮件</strong>；在服务器端保留邮件与文件夹结构，<strong>支持多设备状态漫游与同步</strong>。</td>
              </tr>
              <tr>
                <td><strong>MIME</strong> (通用互联网邮件扩充)</td>
                <td>-</td>
                <td>-</td>
                <td><strong>内容编码</strong></td>
                <td>非传输协议，定义非 ASCII 码多媒体数据格式，将其编码为 7 位 ASCII 码以便 SMTP 传输。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive } from 'vue'

const openSections = reactive({
  topo: false,     // 默认收起时序拓扑
  exam2012: false, // 默认收起 2012 题 40
  exam2013: false, // 默认收起 2013 题 40
  diff: false      // 默认收起对比表
})

const toggle = (key) => {
  openSections[key] = !openSections[key]
}
</script>

<style scoped>
.email-sim-container {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 顶部栏 */
.email-header {
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
  color: #2563eb;
  font-weight: 800;
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

/* SVG 拓扑 */
.svg-email-wrapper {
  width: 100%;
  overflow-x: auto;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 8px;
}

.email-svg {
  width: 100%;
  min-width: 800px;
  height: auto;
  display: block;
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

/* 表格 */
.table-wrapper {
  overflow-x: auto;
}

.email-summary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: left;
}

.email-summary-table th,
.email-summary-table td {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-border);
}

.email-summary-table th {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-weight: 800;
}

.email-summary-table td {
  color: var(--vp-c-text-2);
}
</style>
