<template>
  <div class="http-sim-container">
    
    <!-- 顶部标题横幅 -->
    <div class="http-header">
      <div class="header-left">
        <span class="badge-blue">🌐 HTTP 超文本传输协议</span>
        <h4 class="header-title">报文格式、Cookie 状态追踪与持续/非持续 RTT 耗时模型</h4>
      </div>
      <div class="rule-tag">
        核心公式：非持续 2(1+n) RTT ➔ 持续非流水线 (2+n) RTT ➔ 持续流水线 3 RTT
      </div>
    </div>

    <!-- 1. HTTP 持续非流水线连接时空时序图 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('topo')">
        <div class="header-title-box">
          <span class="card-icon">⏱️</span>
          <strong>一、【2011 题 47】HTTP 持续非流水线 4 个 RTT 交互时空时序图</strong>
          <span class="badge-blue">时序推导</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.topo ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.topo" class="card-body">
        
        <div class="svg-http-wrapper">
          <svg viewBox="0 0 840 380" class="http-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="http-arr-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7"/>
              </marker>
              <marker id="http-arr-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#059669"/>
              </marker>
            </defs>

            <!-- 左右端点 -->
            <rect x="180" y="15" width="90" height="32" rx="4" fill="#0284c7"/>
            <text x="225" y="35" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#fff">💻 浏览器 (客户)</text>

            <rect x="490" y="15" width="90" height="32" rx="4" fill="#1e293b"/>
            <text x="535" y="35" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#38bdf8">🖥️ Web 服务器</text>

            <!-- 时间垂线 -->
            <line x1="225" y1="47" x2="225" y2="365" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>
            <line x1="535" y1="47" x2="535" y2="365" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>

            <!-- RTT 1: TCP 三次握手 -->
            <!-- 左侧 RTT 标尺 -->
            <line x1="120" y1="60" x2="120" y2="120" stroke="#0284c7" stroke-width="2"/>
            <text x="95" y="94" font-size="11" font-weight="900" text-anchor="middle" fill="#0284c7">RTT 1</text>

            <!-- 黄色握手背景 -->
            <rect x="225" y="60" width="310" height="65" fill="#fef3c7" opacity="0.85"/>
            <text x="380" y="85" font-size="11" font-weight="900" text-anchor="middle" fill="#b45309">TCP 三报文握手建立连接</text>

            <!-- 握手 1 (SYN) -->
            <path d="M 225,65 L 530,80" fill="none" stroke="#d97706" stroke-width="1.5" marker-end="url(#http-arr-blue)"/>
            <!-- 握手 2 (SYN+ACK) -->
            <path d="M 535,80 L 230,105" fill="none" stroke="#d97706" stroke-width="1.5" marker-end="url(#http-arr-blue)"/>
            <!-- 握手 3 携带 GET 请求 -->
            <path d="M 225,105 L 530,125" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#http-arr-blue)"/>
            <text x="360" y="118" font-size="10" font-weight="bold" fill="#0284c7">请求 rfc.html</text>

            <!-- RTT 2: HTML 响应 + 请求第 1 个 JPEG -->
            <line x1="120" y1="125" x2="120" y2="195" stroke="#0284c7" stroke-width="2"/>
            <text x="95" y="164" font-size="11" font-weight="900" text-anchor="middle" fill="#0284c7">RTT 2</text>

            <path d="M 535,125 L 230,155" fill="none" stroke="#059669" stroke-width="1.8" marker-end="url(#http-arr-green)"/>
            <text x="380" y="148" font-size="10" font-weight="bold" fill="#059669">响应 rfc.html 数据</text>

            <path d="M 225,155 L 530,185" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#http-arr-blue)"/>
            <text x="360" y="178" font-size="10" font-weight="bold" fill="#0284c7">请求第 1 个 JPEG 图像</text>

            <!-- RTT 3: JPEG 1 响应 + 请求第 2 个 JPEG -->
            <line x1="120" y1="195" x2="120" y2="275" stroke="#0284c7" stroke-width="2"/>
            <text x="95" y="239" font-size="11" font-weight="900" text-anchor="middle" fill="#0284c7">RTT 3</text>

            <path d="M 535,185 L 230,225" fill="none" stroke="#059669" stroke-width="1.8" marker-end="url(#http-arr-green)"/>
            <text x="380" y="215" font-size="10" font-weight="bold" fill="#059669">响应第 1 个 JPEG 数据</text>

            <path d="M 225,225 L 530,265" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#http-arr-blue)"/>
            <text x="360" y="255" font-size="10" font-weight="bold" fill="#0284c7">请求第 2 个 JPEG 图像</text>

            <!-- RTT 4: JPEG 2 响应 -->
            <line x1="120" y1="275" x2="120" y2="345" stroke="#0284c7" stroke-width="2"/>
            <text x="95" y="314" font-size="11" font-weight="900" text-anchor="middle" fill="#0284c7">RTT 4</text>

            <path d="M 535,265 L 230,335" fill="none" stroke="#059669" stroke-width="1.8" marker-end="url(#http-arr-green)"/>
            <text x="380" y="310" font-size="10" font-weight="bold" fill="#059669">响应第 2 个 JPEG 数据</text>

            <!-- 右侧核心机制卡片说明 -->
            <g transform="translate(600, 70)">
              <rect x="0" y="0" width="220" height="110" rx="6" fill="rgba(239,68,68,0.08)" stroke="#ef4444"/>
              <text x="15" y="22" font-size="11" font-weight="bold" fill="#dc2626">📌 持续连接方式：</text>
              <text x="15" y="42" font-size="10" fill="var(--vp-c-text-2)">服务器发送响应后仍然保持</text>
              <text x="15" y="60" font-size="10" fill="var(--vp-c-text-2)">连接，同一个客户端可继续</text>
              <text x="15" y="78" font-size="10" fill="var(--vp-c-text-2)">在此连接上传送后续 HTTP 请求</text>
              <text x="15" y="96" font-size="10" font-weight="bold" fill="#dc2626">（无需反复发起 TCP 握手）</text>
            </g>

            <g transform="translate(600, 200)">
              <rect x="0" y="0" width="220" height="90" rx="6" fill="rgba(16,185,129,0.08)" stroke="#10b981"/>
              <text x="15" y="22" font-size="11" font-weight="bold" fill="#059669">📌 非流水线方式：</text>
              <text x="15" y="42" font-size="10" fill="var(--vp-c-text-2)">只有收到上一个请求的响应，</text>
              <text x="15" y="60" font-size="10" fill="var(--vp-c-text-2)">才能发出下一个对象的请求。</text>
              <text x="15" y="78" font-size="10" font-weight="bold" fill="#059669">每个对象消耗 1 个 RTT</text>
            </g>

          </svg>
        </div>

      </div>
    </div>

    <!-- 2. 【修改自 2011 题 47】真题计算与 3 大连接模式公式对比 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('calc')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>二、【2011 年 题 47 第 (3) 问】HTTP 持续连接非流水线 RTT 耗时真题精解</strong>
          <span class="badge-green">真题演练</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.calc ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.calc" class="card-body">
        <div class="exam-question">
          假设 HTTP/1.1 协议以<strong>持续的非流水线方式</strong>工作，一次请求-响应的时间为 RTT，<code>rfc.html</code> 页面引用了 2 个 JPEG 小图像，则浏览器从开始建立 TCP 连接到收到全部内容为止，需要多少个 RTT？
        </div>

        <div class="quiz-action-bar">
          <button class="quiz-btn btn-toggle" type="button" @click="quiz2011.revealed = !quiz2011.revealed">
            {{ quiz2011.revealed ? '🔒 隐藏推导与答案' : '💡 点击查看推导步骤与答案 (4 RTT)' }}
          </button>
        </div>

        <div v-show="quiz2011.revealed" class="exam-analysis">
          <div class="analysis-title">🔍 核心推导步骤（一步步拆解）：</div>
          <ol class="analysis-list">
            <li><strong>第 1 个 RTT（TCP 建立连接）</strong>：客户发送 SYN，服务器回复 SYN+ACK，耗时 <strong>1 个 RTT</strong>；第三次握手的 ACK 可以直接搭载 HTTP GET 请求数据。</li>
            <li><strong>第 2 个 RTT（请求基础页面）</strong>：请求并接收 <code>rfc.html</code> 基础文本页面，耗时 <strong>1 个 RTT</strong>。</li>
            <li><strong>第 3 个 RTT（请求第 1 个 JPEG）</strong>：浏览器解析 HTML 发现引用了第 1 个图像，发出 GET 请求并收到图像数据，耗时 <strong>1 个 RTT</strong>。</li>
            <li><strong>第 4 个 RTT（请求第 2 个 JPEG）</strong>：以非流水线方式串行发出第 2 个图像的 GET 请求并收到数据，耗时 <strong>1 个 RTT</strong>。</li>
            <li><strong>总耗时</strong>：1 (TCP) + 1 (HTML) + 2 (两个引用图像) = <strong>4 个 RTT</strong>。</li>
          </ol>
        </div>

        <!-- 3 大模式公式对比 -->
        <div class="modes-formula-grid">
          <div class="formula-card">
            <div class="fc-name">1. 非持续连接 (HTTP/1.0 默认)</div>
            <div class="fc-math">总时间 = 2(1 + n) RTT</div>
            <div class="fc-desc">每个对象都需要独立建立一次 TCP 连接（1 RTT 握手 + 1 RTT 数据）。引用 2 个图像总耗时 = 2 × (1 + 2) = <strong>6 RTT</strong>。</div>
          </div>

          <div class="formula-card">
            <div class="fc-name">2. 持续非流水线 (本题模式)</div>
            <div class="fc-math">总时间 = (2 + n) RTT</div>
            <div class="fc-desc">仅需 1 次 TCP 握手，所有对象串行发送。引用 2 个图像总耗时 = 2 + 2 = <strong>4 RTT</strong>。</div>
          </div>

          <div class="formula-card">
            <div class="fc-name">3. 持续流水线 (HTTP/1.1 优化)</div>
            <div class="fc-math">总时间 = 3 RTT (与 n 无关)</div>
            <div class="fc-desc">仅需 1 次 TCP 握手，收到 HTML 后所有引用的 $n$ 个对象<strong>并发连续流水线发出</strong>。引用 2 个图像总耗时 = <strong>3 RTT</strong>。</div>
          </div>
        </div>

      </div>
    </div>

    <!-- 3. 【2015 年 统考题 40】HTTP 请求报文结构与首部行精析 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('exam2015')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>三、【2015 年 统考题 40】HTTP 请求报文格式、Connection 与 Cookie 真题精解</strong>
          <span class="badge-green">真题演练</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.exam2015 ? '收起 ▲' : '展开真题 ▼' }}
        </button>
      </div>

      <div v-show="openSections.exam2015" class="card-body">
        <div class="exam-question">
          某浏览器发出的 HTTP 请求报文如下：
          <div class="http-raw-box">
            <code>
              GET /index.html HTTP/1.1<br>
              Host: www.test.edu.cn<br>
              Connection: Close<br>
              Cookie: 123456
            </code>
          </div>
          下列叙述中，<strong>错误</strong>的是（&nbsp;&nbsp;&nbsp;&nbsp;）。
        </div>

        <!-- 交互式作答选项 (默认不标答案) -->
        <div class="quiz-interactive-box">
          <div class="exam-options">
            <div 
              v-for="opt in ['A', 'B', 'C', 'D']" 
              :key="opt"
              class="opt-item"
              :class="{
                'opt-selected': quiz2015.userAns === opt,
                'opt-correct': quiz2015.revealed && opt === 'C',
                'opt-wrong': quiz2015.revealed && quiz2015.userAns === opt && opt !== 'C'
              }"
              @click="handleQuiz2015(opt)"
            >
              <div class="opt-label">
                <span class="opt-letter">{{ opt }}.</span>
                <span v-if="opt === 'A'">该浏览器请求浏览 index.html</span>
                <span v-else-if="opt === 'B'">index.html 存放在 www.test.edu.cn 上</span>
                <span v-else-if="opt === 'C'">该浏览器请求使用持续连接</span>
                <span v-else-if="opt === 'D'">该浏览器曾经浏览过 www.test.edu.cn</span>
              </div>
              <span v-if="quiz2015.revealed && opt === 'C'" class="correct-badge">✔ 错误叙述 (本题答案)</span>
              <span v-else-if="quiz2015.revealed && quiz2015.userAns === opt && opt !== 'C'" class="wrong-badge">✖ 你的选择</span>
            </div>
          </div>

          <div class="quiz-action-bar">
            <button class="quiz-btn btn-toggle" type="button" @click="quiz2015.revealed = !quiz2015.revealed">
              {{ quiz2015.revealed ? '🔒 隐藏答案与解析' : '💡 点击查看答案与深度解析' }}
            </button>
            <button v-if="quiz2015.userAns || quiz2015.revealed" class="quiz-btn btn-reset" type="button" @click="resetQuiz2015">
              🔄 重新作答
            </button>
          </div>
        </div>

        <div v-show="quiz2015.revealed" class="exam-analysis">
          <div class="analysis-title">🔍 请求报文逐行深度剖析：</div>
          <ul class="analysis-list">
            <li><code>GET /index.html HTTP/1.1</code>（<strong>请求行</strong>）：指明使用 <code>GET</code> 方法，请求的资源为 <code>/index.html</code>，协议版本为 <code>HTTP/1.1</code> ➔ A 叙述正确。</li>
            <li><code>Host: www.test.edu.cn</code>（<strong>首部行</strong>）：指明目标服务器的主机域名为 <code>www.test.edu.cn</code> ➔ B 叙述正确。</li>
            <li><code>Connection: Close</code>（<strong>首部行</strong>）：告诉服务器<strong>发送完请求的文档后就可以释放 TCP 连接，即请求使用非持续连接</strong>。若要使用持续连接，取值应为 <code>keep-alive</code> ➔ <strong>C 叙述错误（符合题意，选 C）</strong>。</li>
            <li><code>Cookie: 123456</code>（<strong>首部行</strong>）：这是服务器此前为该浏览器生成的 Cookie 识别码，本次请求将其附带回传，<strong>表明该浏览器曾经访问过该网站</strong> ➔ D 叙述正确。</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 4. HTTP 常见状态码分类速查 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('status')">
        <div class="header-title-box">
          <span class="card-icon">💡</span>
          <strong>四、HTTP 5 大类常见状态码速查表 (2xx / 3xx / 4xx / 5xx)</strong>
          <span class="badge-amber">必考速查</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.status ? '收起 ▲' : '展开速查 ▼' }}
        </button>
      </div>

      <div v-show="openSections.status" class="card-body">
        <div class="table-wrapper">
          <table class="status-summary-table">
            <thead>
              <tr>
                <th>状态码</th>
                <th>类别</th>
                <th>中文含义</th>
                <th>408 核心应用场景与考点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code class="code-tag">200 OK</code></td>
                <td>2xx 成功</td>
                <td>请求成功</td>
                <td>请求已正常处理并返回资源内容。</td>
              </tr>
              <tr>
                <td><code class="code-tag">301 Moved Permanently</code></td>
                <td>3xx 重定向</td>
                <td>永久重定向</td>
                <td>资源已永久分配了新 URL，搜索引擎与浏览器会自动更新书签。</td>
              </tr>
              <tr>
                <td><code class="code-tag">302 Found</code></td>
                <td>3xx 重定向</td>
                <td>临时重定向</td>
                <td>资源临时移动到新 URL，客户端应继续使用原有 URL。</td>
              </tr>
              <tr>
                <td><code class="code-tag">400 Bad Request</code></td>
                <td>4xx 客户端错误</td>
                <td>错误请求</td>
                <td>客户端请求报文存在语法错误，服务器无法解析。</td>
              </tr>
              <tr>
                <td><code class="code-tag">403 Forbidden</code></td>
                <td>4xx 客户端错误</td>
                <td>禁止访问</td>
                <td>服务器理解请求但拒绝提供服务（通常为文件权限不足或 IP 被封禁）。</td>
              </tr>
              <tr>
                <td><code class="code-tag">404 Not Found</code></td>
                <td>4xx 客户端错误</td>
                <td>未找到资源</td>
                <td>服务器上不存在所请求的 URL 对应资源。</td>
              </tr>
              <tr>
                <td><code class="code-tag">500 Internal Server Error</code></td>
                <td>5xx 服务器错误</td>
                <td>服务器内部错误</td>
                <td>服务器在执行请求时遇到未知异常，无法完成响应。</td>
              </tr>
              <tr>
                <td><code class="code-tag">502 Bad Gateway</code></td>
                <td>5xx 服务器错误</td>
                <td>错误网关</td>
                <td>作为网关或反向代理的服务器从上游服务器接收到了无效响应。</td>
              </tr>
              <tr>
                <td><code class="code-tag">504 Gateway Timeout</code></td>
                <td>5xx 服务器错误</td>
                <td>网关超时</td>
                <td>充当网关或代理的服务器未能在规定时间内收到上游服务器的响应。</td>
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

const quiz2011 = reactive({ revealed: false })

const quiz2015 = reactive({ userAns: null, revealed: false })
const handleQuiz2015 = (opt) => {
  quiz2015.userAns = opt
  quiz2015.revealed = true
}
const resetQuiz2015 = () => {
  quiz2015.userAns = null
  quiz2015.revealed = false
}

const openSections = reactive({
  topo: false,     // 默认收起时序图
  calc: false,     // 默认收起真题计算
  exam2015: false, // 默认收起 2015 题 40
  status: false    // 默认收起状态码
})

const toggle = (key) => {
  openSections[key] = !openSections[key]
}
</script>

<style scoped>
.http-sim-container {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 顶部栏 */
.http-header {
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
  font-size: 11px;
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
.svg-http-wrapper {
  width: 100%;
  overflow-x: auto;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 8px;
}

.http-svg {
  width: 100%;
  min-width: 780px;
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

.http-raw-box {
  margin: 6px 0;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 8px 12px;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #2563eb;
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

/* 公式网格 */
.modes-formula-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

@media (max-width: 820px) {
  .modes-formula-grid {
    grid-template-columns: 1fr;
  }
}

.formula-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fc-name {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.fc-math {
  font-size: 12px;
  font-weight: 900;
  color: #2563eb;
}

.fc-desc {
  font-size: 11px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* 表格 */
.table-wrapper {
  overflow-x: auto;
}

.status-summary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: left;
}

.status-summary-table th,
.status-summary-table td {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-border);
}

.status-summary-table th {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-weight: 800;
}

.status-summary-table td {
  color: var(--vp-c-text-2);
}

.code-tag {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-weight: 700;
  color: #2563eb;
}
</style>
