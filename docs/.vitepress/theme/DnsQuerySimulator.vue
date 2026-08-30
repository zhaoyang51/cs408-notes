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
              <rect x="0" y="0" width="130" height="52" rx="6" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
              <text x="65" y="22" font-size="11" font-weight="bold" text-anchor="middle" fill="#0284c7">🖥️ 本地域名服务器</text>
              <text x="65" y="40" font-size="11" font-weight="900" text-anchor="middle" fill="#0284c7">201.1.1.1</text>
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
          某校园网的主机 A 向本地域名服务器发出 DNS 请求报文，查询 <code>abc.xyz.com</code> 的 IP 地址。假设本地域名服务器采用<strong>迭代查询</strong>，且各服务器均无缓存，则为主机 A 解析该域名<strong>最少</strong>和<strong>最多</strong>需要向根域名服务器或授权域名服务器发出的 DNS 查询报文次数分别是（&nbsp;&nbsp;&nbsp;&nbsp;）。
        </div>

        <!-- 交互式作答选项 (默认不标答案) -->
        <div class="quiz-interactive-box">
          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': quizDns.userAns === opt,
                'opt-correct': quizDns.revealed && opt === 'C',
                'opt-wrong': quizDns.revealed && quizDns.userAns === opt && opt !== 'C'
              }"
              @click="handleQuizDns(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'">0, 3</span>
                <span v-else-if="opt === 'B'">1, 3</span>
                <span v-else-if="opt === 'C'">0, 4</span>
                <span v-else-if="opt === 'D'">1, 4</span>
              </div>
              <span v-if="quizDns.revealed && opt === 'C'" class="correct-badge">✔ 正确答案</span>
              <span v-else-if="quizDns.revealed && quizDns.userAns === opt && opt !== 'C'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="quizDns.revealed = !quizDns.revealed">
              {{ quizDns.revealed ? '🔒 隐藏答案与解析' : '💡 点击查看答案与深度解析' }}
            </button>
            <button v-if="quizDns.userAns || quizDns.revealed" class="quiz-btn btn-reset" type="button" @click="resetQuizDns">
              🔄 重新作答
            </button>
          </div>
        </div>

        <!-- 深度解析 (默认隐藏) -->
        <div v-show="quizDns.revealed" class="exam-analysis">
          <div class="analysis-title">🔍 核心推导步骤（推导过程）：</div>
          <ol class="analysis-list">
            <li><strong>最少查询次数（0 次）</strong>：若主机 A 自身的 DNS 高速缓存命中，或本地域名服务器自身的高速缓存命中，均<strong>无需向外部发出任何查询</strong>，因此最少为 <strong>0 次</strong>。</li>
            <li><strong>最多查询次数（4 次）</strong>：在全无缓存的最坏情况下，本地域名服务器必须严格执行 4 级逐层迭代解析：
              <ul>
                <li>① 向<strong>根域名服务器</strong>查询 ➔ 返回顶级域名服务器 <code>.com</code> 的 IP；</li>
                <li>② 向<strong>顶级域名服务器 <code>.com</code></strong> 查询 ➔ 返回二级域名服务器 <code>xyz.com</code> 的 IP；</li>
                <li>③ 向<strong>二级权限域名服务器 <code>xyz.com</code></strong> 查询 ➔ 返回三级域名服务器 <code>abc.xyz.com</code> 的 IP；</li>
                <li>④ 向<strong>三级权限域名服务器 <code>abc.xyz.com</code></strong> 查询 ➔ 最终返回 <code>abc.xyz.com</code> 的目标主机 IP。</li>
              </ul>
            </li>
            <li><strong>结论</strong>：最少 0 次，最多 4 次，正确答案选 <strong>C</strong>。</li>
          </ol>
        </div></div>
    </div>

  </div>
</template>

<script setup>
import { reactive , onMounted, onUnmounted} from 'vue'

const quizDns = reactive({ userAns: null, revealed: false })
const handleQuizDns = (opt) => {
  quizDns.userAns = opt
  quizDns.revealed = true
}
const resetQuizDns = () => {
  quizDns.userAns = null
  quizDns.revealed = false
}

const openSections = reactive({
  topo: false, // 默认收起时序图
  exam: false, // 默认收起真题
  diff: false  // 默认收起递归vs迭代
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
