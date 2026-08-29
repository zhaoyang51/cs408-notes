<template>
  <div class="dns-sim-container">
    
    <!-- 顶部标题横幅 -->
    <div class="dns-header">
      <div class="header-left">
        <span class="badge-blue">🌐 DNS 域名解析系统</span>
        <h4 class="header-title">域名层次结构、迭代解析 4 级查询与 DNS 高速缓存机制</h4>
      </div>
      <div class="rule-tag">
        核心考点：迭代查询由本地域名服务器逐级发出，最少 0 次 / 最多 4 次
      </div>
    </div>

    <!-- 1. 2016 年题 40 网络拓扑与 4 级迭代解析流程图 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('topo')">
        <div class="header-title-box">
          <span class="card-icon">📡</span>
          <strong>一、【2016 年 题 40】网络综合拓扑与 DNS 迭代解析 4 级查询全景时序图</strong>
          <span class="badge-blue">拓扑时序</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.topo ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.topo" class="card-body">
        
        <!-- SVG 矢量拓扑与时序流 -->
        <div class="svg-dns-wrapper">
          <svg viewBox="0 0 860 380" class="dns-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="dns-arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7"/>
              </marker>
              <marker id="dns-arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669"/>
              </marker>
            </defs>

            <!-- 左侧：局域网拓扑区 -->
            <rect x="15" y="15" width="310" height="350" rx="8" fill="var(--vp-c-bg)" stroke="var(--vp-c-border)" stroke-dasharray="4,4"/>
            <text x="30" y="38" font-size="12" font-weight="bold" fill="#0284c7">🏢 校园网/局域网拓扑环境</text>

            <!-- 本地域名服务器 201.1.1.1 -->
            <g transform="translate(30, 60)">
              <rect x="0" y="0" width="130" height="52" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
              <text x="65" y="22" font-size="11" font-weight="bold" text-anchor="middle" fill="#38bdf8">🖥️ 本地域名服务器</text>
              <text x="65" y="40" font-size="11" font-weight="900" text-anchor="middle" fill="#f8fafc">201.1.1.1</text>
            </g>

            <!-- 默认网关路由器 R2 -->
            <g transform="translate(190, 140)">
              <circle cx="28" cy="28" r="24" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
              <text x="28" y="32" font-size="12" font-weight="900" text-anchor="middle" fill="#fff">R2</text>
              <text x="28" y="64" font-size="9.5" text-anchor="middle" fill="var(--vp-c-text-2)">192.168.3.254</text>
            </g>

            <!-- 集线器 Hub 与 主机 H4 -->
            <g transform="translate(30, 230)">
              <rect x="0" y="0" width="90" height="30" rx="4" fill="var(--vp-c-bg-elv)" stroke="var(--vp-c-border)"/>
              <text x="45" y="19" font-size="10.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-1)">100Base-T Hub</text>
            </g>

            <!-- 主机 H4 -->
            <g transform="translate(30, 290)">
              <rect x="0" y="0" width="115" height="48" rx="6" fill="rgba(37,99,235,0.12)" stroke="#2563eb" stroke-width="1.5"/>
              <text x="57" y="20" font-size="11" font-weight="900" text-anchor="middle" fill="#2563eb">💻 主机 H4</text>
              <text x="57" y="38" font-size="10" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-2)">192.168.3.252</text>
            </g>

            <!-- 拓扑连接线 -->
            <line x1="95" y1="112" x2="190" y2="155" stroke="var(--vp-c-border)" stroke-width="1.5"/>
            <line x1="205" y1="188" x2="75" y2="230" stroke="var(--vp-c-border)" stroke-width="1.5"/>
            <line x1="75" y1="260" x2="75" y2="290" stroke="var(--vp-c-border)" stroke-width="1.5"/>

            <!-- 右侧：4 级迭代解析流程 -->
            <text x="355" y="38" font-size="13" font-weight="bold" fill="var(--vp-c-text-1)">🌐 目标规范域名：<tspan fill="#2563eb">www.abc.xyz.com</tspan></text>

            <!-- 4 级域名服务器节点 -->
            <!-- 1. 根域名服务器 -->
            <g transform="translate(640, 50)">
              <rect x="0" y="0" width="190" height="42" rx="6" fill="#0284c7" stroke="#0369a1"/>
              <text x="95" y="18" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">① 根域名服务器 (Root)</text>
              <text x="95" y="33" font-size="9.5" text-anchor="middle" fill="#e0f2fe">返回 .com 顶级 DNS 地址</text>
            </g>

            <!-- 2. 顶级域名服务器 .com -->
            <g transform="translate(640, 125)">
              <rect x="0" y="0" width="190" height="42" rx="6" fill="#0d9488" stroke="#0f766e"/>
              <text x="95" y="18" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">② 顶级域名服务器 (.com)</text>
              <text x="95" y="33" font-size="9.5" text-anchor="middle" fill="#ccfbf1">返回 xyz.com 权限 DNS 地址</text>
            </g>

            <!-- 3. 权限域名服务器 xyz.com -->
            <g transform="translate(640, 200)">
              <rect x="0" y="0" width="190" height="42" rx="6" fill="#d97706" stroke="#b45309"/>
              <text x="95" y="18" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">③ 权限域名服务器 (xyz.com)</text>
              <text x="95" y="33" font-size="9.5" text-anchor="middle" fill="#fef3c7">返回 abc.xyz.com 权限 DNS</text>
            </g>

            <!-- 4. 权限域名服务器 abc.xyz.com -->
            <g transform="translate(640, 275)">
              <rect x="0" y="0" width="190" height="42" rx="6" fill="#7c3aed" stroke="#6d28d9"/>
              <text x="95" y="18" font-size="11" font-weight="bold" text-anchor="middle" fill="#fff">④ 权限服务器 (abc.xyz.com)</text>
              <text x="95" y="33" font-size="9.5" text-anchor="middle" fill="#ede9fe">返回 www.abc.xyz.com IP</text>
            </g>

            <!-- 迭代查询交互箭头 (201.1.1.1 依次往返) -->
            <!-- 往返 1 -->
            <path d="M 160,75 C 360,60 480,60 635,65" fill="none" stroke="#0284c7" stroke-width="1.8" marker-end="url(#dns-arrow-blue)"/>
            <text x="390" y="62" font-size="10" font-weight="bold" fill="#0284c7">第 1 次查询 ➔</text>

            <!-- 往返 2 -->
            <path d="M 160,82 C 360,110 480,130 635,140" fill="none" stroke="#0d9488" stroke-width="1.8" marker-end="url(#dns-arrow-blue)"/>
            <text x="390" y="118" font-size="10" font-weight="bold" fill="#0d9488">第 2 次查询 ➔</text>

            <!-- 往返 3 -->
            <path d="M 160,90 C 360,160 480,200 635,215" fill="none" stroke="#d97706" stroke-width="1.8" marker-end="url(#dns-arrow-blue)"/>
            <text x="390" y="172" font-size="10" font-weight="bold" fill="#d97706">第 3 次查询 ➔</text>

            <!-- 往返 4 -->
            <path d="M 160,98 C 360,210 480,270 635,290" fill="none" stroke="#7c3aed" stroke-width="1.8" marker-end="url(#dns-arrow-blue)"/>
            <text x="390" y="228" font-size="10" font-weight="bold" fill="#7c3aed">第 4 次查询 ➔</text>

            <!-- 最终返回给 H4 -->
            <path d="M 95,112 L 95,285" fill="none" stroke="#059669" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#dns-arrow-green)"/>
            <text x="105" y="200" font-size="10" font-weight="bold" fill="#059669">最终返回 IP 给 H4</text>

          </svg>
        </div>

      </div>
    </div>

    <!-- 2. 【2016 年 统考题 40】真题精讲卡片 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>二、【2016 年 统考题 40】DNS 迭代解析查询次数真题精解</strong>
          <span class="badge-green">真题演练</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam" class="card-body">
        <div class="exam-question">
          假设所有域名服务器均采用迭代查询方式进行域名解析，当 H4 访问规范域名为 <strong>www.abc.xyz.com</strong> 的网站时，域名服务器 201.1.1.1 在完成该域名解析过程中，可能发出 DNS 查询的最少和最多次数分别是（&nbsp;&nbsp;&nbsp;&nbsp;）。
        </div>

        <div class="exam-options">
          <div class="opt-item">A. 0, 3</div>
          <div class="opt-item">B. 1, 3</div>
          <div class="opt-item opt-correct"><strong>C. 0, 4</strong> <span class="correct-badge">✔ 正确答案</span></div>
          <div class="opt-item">D. 1, 4</div>
        </div>

        <!-- 详细解析 -->
        <div class="exam-analysis">
          <div class="analysis-title">🔍 核心推导步骤（最少 vs 最多查询深度剖析）：</div>
          <ol class="analysis-list">
            <li><strong>最少查询次数推导（考查 DNS 高速缓存机制）</strong>：
              <ul>
                <li><strong>场景 1（H4 本地命中）</strong>：若主机 H4 的本地 DNS 高速缓存中已有该域名的映射记录，H4 直接从本地获取 IP，<strong>根本无需向本地域名服务器 201.1.1.1 发出查询请求</strong>，此时 201.1.1.1 发出的查询次数为 <strong>0</strong>；</li>
                <li><strong>场景 2（201.1.1.1 本地命中）</strong>：退一步，即使 H4 向 201.1.1.1 发起查询，若 201.1.1.1 自身的高速缓存中已缓存该记录，它直接返回结果，<strong>也无需向外部发出任何查询</strong>，发出次数同样为 <strong>0</strong>。</li>
                <li>综上，最少发出 DNS 查询次数为 <strong>0 次</strong>。</li>
              </ul>
            </li>
            <li><strong>最多次数推导（考查 迭代查询 4 级逐层解析）</strong>：
              <ul>
                <li>在最坏情况下（各级缓存均无记录），本地域名服务器 201.1.1.1 必须<strong>以迭代方式依次发出 4 次查询</strong>：</li>
                <li><strong>第 1 次</strong>：向 <strong>根域名服务器</strong> 查询，获得顶级域名服务器 <code class="code-tag">.com</code> 的 IP；</li>
                <li><strong>第 2 次</strong>：向 <strong>顶级域名服务器 (.com)</strong> 查询，获得权限域名服务器 <code class="code-tag">xyz.com</code> 的 IP；</li>
                <li><strong>第 3 次</strong>：向 <strong>权限域名服务器 (xyz.com)</strong> 查询，获得下一级权限域名服务器 <code class="code-tag">abc.xyz.com</code> 的 IP；</li>
                <li><strong>第 4 次</strong>：向 <strong>权限域名服务器 (abc.xyz.com)</strong> 查询，最终获得主机 <code class="code-tag">www.abc.xyz.com</code> 的 IP 地址。</li>
                <li>综上，最多发出 DNS 查询次数为 <strong>4 次</strong>。</li>
              </ul>
            </li>
            <li><strong>结论</strong>：最少和最多次数分别为 <strong>0, 4</strong>，选 <strong>C</strong>。</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- 3. DNS 迭代查询 vs 递归查询核心机制辨析 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('diff')">
        <div class="header-title-box">
          <span class="card-icon">💡</span>
          <strong>三、DNS 递归查询 (Recursive) vs 迭代查询 (Iterative) 机制全景辨析</strong>
          <span class="badge-amber">必考概念</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.diff ? '收起 ▲' : '展开辨析 ▼' }}
        </button>
      </div>

      <div v-show="openSections.diff" class="card-body">
        <div class="dns-mode-grid">
          
          <div class="mode-card">
            <div class="mc-head color-blue">🔄 递归查询 (Recursive Query)</div>
            <div class="mc-sub">“一查到底，由被查询者代劳”</div>
            <div class="mc-desc">
              - <strong>流程</strong>：本地域名服务器若不知道 IP，就<strong>代替主机向根域名服务器发起请求</strong>，根向顶级请求，顶级向权限请求，结果逐级原路返回。<br>
              - <strong>特点</strong>：给根/顶级域名服务器带来<strong>极大的负载压力</strong>，现代互联网中根域名服务器通常<strong>拒绝递归查询</strong>。
            </div>
          </div>

          <div class="mode-card">
            <div class="mc-head color-green">🔁 迭代查询 (Iterative Query)</div>
            <div class="mc-sub">“分步指路，由本地域名服务器亲自跑腿”</div>
            <div class="mc-desc">
              - <strong>流程</strong>：根域名服务器收到请求后，不直接代查，而是<strong>告诉本地域名服务器“下一步该去问哪个顶级域名服务器”</strong>，本地域名服务器再自行逐级发起查询。<br>
              - <strong>特点</strong>：根服务器压力极小，是<strong>当前互联网域名解析的绝对标准方式</strong>。
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
  topo: false, // 默认收起时序图
  exam: false, // 默认收起真题
  diff: false  // 默认收起递归vs迭代
})

const toggle = (key) => {
  openSections[key] = !openSections[key]
}
</script>

<style scoped>
.dns-sim-container {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 顶部栏 */
.dns-header {
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
  color: #0284c7;
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
.svg-dns-wrapper {
  width: 100%;
  overflow-x: auto;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 8px;
}

.dns-svg {
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

.code-tag {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-weight: 700;
  color: #2563eb;
}

/* 递归 vs 迭代网格 */
.dns-mode-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 768px) {
  .dns-mode-grid {
    grid-template-columns: 1fr;
  }
}

.mode-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mc-head {
  font-size: 12.5px;
  font-weight: 800;
}

.color-blue { color: #0284c7; }
.color-green { color: #059669; }

.mc-sub {
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-3);
}

.mc-desc {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.mc-desc strong {
  color: var(--vp-c-text-1);
}
</style>
