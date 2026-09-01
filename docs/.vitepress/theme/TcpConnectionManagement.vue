<template>
  <div class="tcp-cm-container">
    
    <!-- 顶部标题横幅 -->
    <div class="cm-header">
      <div class="header-left">
        <span class="badge-emerald">🤝 TCP 运输连接管理</span>
        <h4 class="header-title">TCP “三报文握手”建立连接 ➔ 全双工数据传输 ➔ “四报文挥手”释放连接（全生命周期全景图）</h4>
      </div>
      <div class="rule-tag">
        核心规律：SYN / FIN 报文段不带数据但必消耗 1 个序号（ack = seq + 1）
      </div>
    </div>

    <!-- 1. 统一合并全景图：三次握手 ➔ 数据传输 ➔ 四次挥手 (高保真矢量 SVG) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('fullFlow')">
        <div class="header-title-box">
          <span class="card-icon">🗺️</span>
          <strong>TCP 运输连接管理全生命周期全景图（三报文握手 ➔ 数据传输 ➔ 四报文挥手）</strong>
          <span class="badge-blue">全景图解</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.fullFlow ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.fullFlow" class="card-body">
        <div class="diagram-wrapper">
          <svg viewBox="0 0 1060 980" class="tcp-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="tcp-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <polygon points="0 1, 8 4, 0 7" fill="#334155" />
              </marker>
              <marker id="curve-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <polygon points="0 1, 7 3.5, 0 6" fill="#475569" />
              </marker>
            </defs>

            <!-- ══ 顶部实体设备标识 ══ -->
            <!-- 客户主机 (左) -->
            <g transform="translate(265, 20)">
              <rect x="-55" y="0" width="110" height="34" rx="4" fill="#ffffff" stroke="#059669" stroke-width="2.5"/>
              <text x="0" y="15" font-size="12" font-weight="bold" text-anchor="middle" fill="#0f766e">TCP</text>
              <text x="0" y="29" font-size="13" font-weight="bold" text-anchor="middle" fill="#0f766e">客户</text>
              <rect x="-8" y="34" width="16" height="6" fill="#059669"/>
              <rect x="-26" y="40" width="52" height="4" rx="2" fill="#059669"/>
            </g>

            <!-- 服务器主机 (右) -->
            <g transform="translate(795, 20)">
              <rect x="-55" y="0" width="110" height="34" rx="4" fill="#ffffff" stroke="#059669" stroke-width="2.5"/>
              <text x="0" y="15" font-size="12" font-weight="bold" text-anchor="middle" fill="#0f766e">TCP</text>
              <text x="0" y="29" font-size="13" font-weight="bold" text-anchor="middle" fill="#0f766e">服务器</text>
              <rect x="-8" y="34" width="16" height="6" fill="#059669"/>
              <rect x="-26" y="40" width="52" height="4" rx="2" fill="#059669"/>
            </g>

            <!-- ═══════════════════════════════════════════════ -->
            <!-- 阶段一：三报文握手 (y: 65 ~ 340)               -->
            <!-- ═══════════════════════════════════════════════ -->

            <!-- 左侧：客户状态柱 (x: 200, 宽: 130) -->
            <!-- 1. 握手前 CLOSED -->
            <rect x="200" y="65" width="130" height="45" fill="#000000"/>
            <text x="265" y="85" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">CLOSED</text>
            <text x="265" y="102" font-size="11.5" fill="#e2e8f0" text-anchor="middle">关闭</text>

            <!-- 主动打开曲线箭头 -->
            <path d="M 210,38 L 125,38 L 125,90 L 198,90" fill="none" stroke="#475569" stroke-width="2" marker-end="url(#curve-arrow)"/>
            <text x="135" y="75" font-size="13.5" font-weight="bold" fill="var(--vp-c-text-1)">主动打开</text>
            <text x="50" y="135" font-size="13.5" font-weight="bold" fill="#dc2626">发送TCP连接请求</text>

            <!-- 2. SYN-SENT -->
            <rect x="200" y="110" width="130" height="135" fill="#b91c1c"/>
            <text x="265" y="172" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">SYN-SENT</text>
            <text x="265" y="194" font-size="12.5" fill="#fecaca" text-anchor="middle">同步已发送</text>

            <!-- 3. ESTABLISHED (握手成功后进入) -->
            <rect x="200" y="245" width="130" height="160" fill="#0d9488"/>
            <text x="265" y="295" font-size="13.5" font-weight="bold" fill="#ffffff" text-anchor="middle">ESTABLISHED</text>
            <text x="265" y="315" font-size="12" fill="#ccfbf1" text-anchor="middle">连接已建立</text>
            
            <text x="40" y="260" font-size="13" font-weight="bold" fill="#059669">发送针对TCP连接请</text>
            <text x="40" y="280" font-size="13" font-weight="bold" fill="#059669">求的确认的确认</text>

            <!-- 右侧：服务器状态柱 (x: 730, 宽: 130) -->
            <!-- 1. 握手前 CLOSED -->
            <rect x="730" y="65" width="130" height="45" fill="#000000"/>
            <text x="795" y="85" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">CLOSED</text>
            <text x="795" y="102" font-size="11.5" fill="#e2e8f0" text-anchor="middle">关闭</text>

            <!-- 被动打开曲线箭头 -->
            <path d="M 850,38 L 935,38 L 935,90 L 862,90" fill="none" stroke="#475569" stroke-width="2" marker-end="url(#curve-arrow)"/>
            <text x="868" y="75" font-size="13.5" font-weight="bold" fill="var(--vp-c-text-1)">被动打开</text>

            <!-- 2. LISTEN -->
            <rect x="730" y="110" width="130" height="65" fill="#0284c7"/>
            <text x="795" y="140" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">LISTEN</text>
            <text x="795" y="160" font-size="12" fill="#e0f2fe" text-anchor="middle">监听</text>

            <!-- 3. SYN-RCVD -->
            <rect x="730" y="175" width="130" height="105" fill="#7c3aed"/>
            <text x="795" y="222" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">SYN-RCVD</text>
            <text x="795" y="244" font-size="12.5" fill="#ede9fe" text-anchor="middle">同步已接收</text>

            <text x="870" y="210" font-size="13" font-weight="bold" fill="#7c3aed">发送针对TCP连接请求</text>
            <text x="870" y="230" font-size="13" font-weight="bold" fill="#7c3aed">的确认</text>

            <!-- 4. ESTABLISHED (服务端握手成功后进入) -->
            <rect x="730" y="280" width="130" height="125" fill="#0d9488"/>
            <text x="795" y="325" font-size="13.5" font-weight="bold" fill="#ffffff" text-anchor="middle">ESTABLISHED</text>
            <text x="795" y="345" font-size="12" fill="#ccfbf1" text-anchor="middle">连接已建立</text>

            <!-- ══ 三报文握手报文段交互 ══ -->
            <!-- 握手 1: 客户 -> 服务器 -->
            <line x1="330" y1="110" x2="725" y2="175" stroke="#334155" stroke-width="2" marker-end="url(#tcp-arrow)"/>
            <g transform="translate(530, 130) rotate(9)">
              <text x="0" y="-8" font-size="14" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                SYN=1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; seq=x
              </text>
            </g>

            <!-- 握手 2: 服务器 -> 客户 -->
            <line x1="730" y1="175" x2="335" y2="245" stroke="#334155" stroke-width="2" marker-end="url(#tcp-arrow)"/>
            <g transform="translate(530, 200) rotate(-10)">
              <text x="0" y="-8" font-size="14" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                SYN=1 &nbsp;&nbsp; ACK=1 &nbsp;&nbsp; seq=y &nbsp;&nbsp; ack=x+1
              </text>
            </g>

            <!-- 握手 3: 客户 -> 服务器 -->
            <line x1="330" y1="245" x2="725" y2="285" stroke="#334155" stroke-width="2" marker-end="url(#tcp-arrow)"/>
            <g transform="translate(530, 255) rotate(6)">
              <text x="0" y="-8" font-size="14" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                ACK=1 &nbsp;&nbsp;&nbsp;&nbsp; seq=x+1 &nbsp;&nbsp;&nbsp;&nbsp; ack=y+1
              </text>
            </g>

            <!-- ═══════════════════════════════════════════════ -->
            <!-- 阶段二：全双工数据传输通道 (y: 350 ~ 395)      -->
            <!-- ═══════════════════════════════════════════════ -->
            <g transform="translate(330, 350)">
              <polygon points="
                0,18  24,0  24,9  
                376,9  376,0  400,18  
                376,36  376,27  24,27  24,36" 
                fill="#ffffff" stroke="#475569" stroke-width="2"/>
              <text x="200" y="24" font-size="15" font-weight="bold" fill="#0d9488" text-anchor="middle">数据传输</text>
            </g>

            <!-- ═══════════════════════════════════════════════ -->
            <!-- 阶段三：四报文挥手释放连接 (y: 405 ~ 900)      -->
            <!-- ═══════════════════════════════════════════════ -->

            <!-- 左侧：客户挥手状态柱 (x: 200, 宽: 130) -->
            <!-- 主动关闭 -->
            <text x="135" y="420" font-size="13.5" font-weight="bold" fill="var(--vp-c-text-1)">主动关闭</text>
            <text x="50" y="450" font-size="13.5" font-weight="bold" fill="#0284c7">发送TCP连接释放</text>

            <!-- 1. FIN-WAIT-1 -->
            <rect x="200" y="405" width="130" height="85" fill="#0284c7"/>
            <text x="265" y="445" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">FIN-WAIT-1</text>
            <text x="265" y="465" font-size="12" fill="#e0f2fe" text-anchor="middle">终止等待1</text>

            <!-- 2. FIN-WAIT-2 -->
            <rect x="200" y="490" width="130" height="135" fill="#1d4ed8"/>
            <text x="265" y="550" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">FIN-WAIT-2</text>
            <text x="265" y="570" font-size="12" fill="#dbeafe" text-anchor="middle">终止等待2</text>

            <!-- 3. TIME-WAIT (玫粉色) -->
            <rect x="200" y="625" width="130" height="170" fill="#db2777"/>
            <text x="265" y="700" font-size="14.5" font-weight="bold" fill="#ffffff" text-anchor="middle">TIME-WAIT</text>
            <text x="265" y="722" font-size="13" fill="#fce7f3" text-anchor="middle">时间等待</text>

            <!-- ★ 用户指定重点：等待 2MSL 字样位于 TIME-WAIT 时间等待 的左边 ★ -->
            <text x="40" y="695" font-size="13.5" font-weight="bold" fill="#db2777">发送TCP</text>
            <text x="40" y="715" font-size="13.5" font-weight="bold" fill="#db2777">普通确认</text>
            
            <g transform="translate(150, 705)">
              <ellipse cx="0" cy="0" rx="30" ry="20" fill="#fdf2f8" stroke="#f43f5e" stroke-width="1.8" stroke-dasharray="3,3"/>
              <text x="0" y="-3" font-size="11.5" fill="#e11d48" font-weight="bold" text-anchor="middle">等待</text>
              <text x="0" y="12" font-size="12" fill="#e11d48" font-weight="bold" text-anchor="middle">2MSL</text>
            </g>

            <!-- 4. 挥手后彻底 CLOSED -->
            <rect x="200" y="795" width="130" height="75" fill="#000000"/>
            <text x="265" y="830" font-size="13.5" font-weight="bold" fill="#ffffff" text-anchor="middle">CLOSED</text>
            <text x="265" y="850" font-size="12" fill="#e2e8f0" text-anchor="middle">关闭</text>

            <!-- 右侧：服务器挥手状态柱 (x: 730, 宽: 130) -->
            <!-- 被动关闭 与 通知应用进程 -->
            <text x="868" y="420" font-size="13.5" font-weight="bold" fill="var(--vp-c-text-1)">被动关闭</text>
            <path d="M 870,450 C 920,430 920,80 855,42" fill="none" stroke="#475569" stroke-width="1.8" stroke-dasharray="4,4" marker-end="url(#curve-arrow)"/>
            <text x="890" y="380" font-size="12.5" font-weight="bold" fill="var(--vp-c-text-1)">通知</text>
            <text x="890" y="398" font-size="12.5" font-weight="bold" fill="var(--vp-c-text-1)">应用</text>
            <text x="890" y="416" font-size="12.5" font-weight="bold" fill="var(--vp-c-text-1)">进程</text>

            <!-- 1. CLOSE-WAIT -->
            <rect x="730" y="405" width="130" height="190" fill="#7c3aed"/>
            <text x="795" y="490" font-size="14.5" font-weight="bold" fill="#ffffff" text-anchor="middle">CLOSE-WAIT</text>
            <text x="795" y="512" font-size="13" fill="#ede9fe" text-anchor="middle">关闭等待</text>

            <text x="870" y="480" font-size="13.5" font-weight="bold" fill="#7c3aed">发送TCP</text>
            <text x="870" y="500" font-size="13.5" font-weight="bold" fill="#7c3aed">普通确认</text>

            <!-- 2. LAST-ACK -->
            <rect x="730" y="595" width="130" height="135" fill="#b91c1c"/>
            <text x="795" y="655" font-size="14.5" font-weight="bold" fill="#ffffff" text-anchor="middle">LAST-ACK</text>
            <text x="795" y="677" font-size="13" fill="#fecaca" text-anchor="middle">最后确认</text>

            <text x="870" y="640" font-size="13.5" font-weight="bold" fill="#dc2626">发送TCP</text>
            <text x="870" y="660" font-size="13.5" font-weight="bold" fill="#dc2626">连接释放</text>

            <!-- 3. 挥手后彻底 CLOSED -->
            <rect x="730" y="730" width="130" height="140" fill="#000000"/>
            <text x="795" y="795" font-size="13.5" font-weight="bold" fill="#ffffff" text-anchor="middle">CLOSED</text>
            <text x="795" y="815" font-size="12" fill="#e2e8f0" text-anchor="middle">关闭</text>

            <!-- ══ 四报文挥手报文段交互 ══ -->
            <!-- 挥手 1: 客户 -> 服务器 -->
            <line x1="330" y1="405" x2="725" y2="455" stroke="#334155" stroke-width="2" marker-end="url(#tcp-arrow)"/>
            <g transform="translate(530, 420) rotate(7)">
              <text x="0" y="-8" font-size="13.5" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                FIN=1 &nbsp;&nbsp; ACK=1 &nbsp;&nbsp; seq=u &nbsp;&nbsp; ack=v
              </text>
            </g>

            <!-- 挥手 2: 服务器 -> 客户 -->
            <line x1="730" y1="455" x2="335" y2="490" stroke="#334155" stroke-width="2" marker-end="url(#tcp-arrow)"/>
            <g transform="translate(530, 465) rotate(-5)">
              <text x="0" y="-8" font-size="13.5" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                ACK=1 &nbsp;&nbsp;&nbsp;&nbsp; seq=v &nbsp;&nbsp;&nbsp;&nbsp; ack=u+1
              </text>
            </g>

            <!-- 中间单向残留数据传输通道 (服务器 -> 客户) -->
            <g transform="translate(565, 520)">
              <polygon points="
                0,16  20,0  20,8  
                150,8  150,24  20,24  20,32" 
                fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
              <text x="85" y="21" font-size="13.5" font-weight="bold" fill="#7c3aed" text-anchor="middle">数据传输</text>
            </g>

            <!-- 挥手 3: 服务器 -> 客户 -->
            <line x1="730" y1="595" x2="335" y2="625" stroke="#334155" stroke-width="2" marker-end="url(#tcp-arrow)"/>
            <g transform="translate(530, 600) rotate(-5)">
              <text x="0" y="-8" font-size="13.5" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                FIN=1 &nbsp;&nbsp; ACK=1 &nbsp;&nbsp; seq=w &nbsp;&nbsp; ack=u+1
              </text>
            </g>

            <!-- 挥手 4: 客户 -> 服务器 -->
            <line x1="330" y1="625" x2="725" y2="730" stroke="#334155" stroke-width="2" marker-end="url(#tcp-arrow)"/>
            <g transform="translate(530, 670) rotate(15)">
              <text x="0" y="-8" font-size="13.5" font-weight="bold" fill="var(--vp-c-text-1)" text-anchor="middle">
                ACK=1 &nbsp;&nbsp;&nbsp;&nbsp; seq=u+1 &nbsp;&nbsp;&nbsp;&nbsp; ack=w+1
              </text>
            </g>

            <!-- ══ 底部 MSL 说明注脚 ══ -->
            <text x="530" y="930" font-size="14" font-weight="bold" fill="#dc2626" text-anchor="middle">
              MSL(Maximum Segment Lifetime) 意思是最长报文段寿命，RFC793 建议为 2 分钟。
            </text>

          </svg>
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

  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'

const openSections = reactive({
  fullFlow: true,
  exam39: true
})

const toggle = (sec) => {
  openSections[sec] = !openSections[sec]
}

const quizConn = reactive({ userAns: null, revealed: false })
const handleQuizConn = (opt) => {
  quizConn.userAns = opt
  quizConn.revealed = true
}
const resetQuizConn = () => {
  quizConn.userAns = null
  quizConn.revealed = false
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
.tcp-cm-container {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cm-header {
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

.badge-emerald {
  font-size: 11px;
  font-weight: 800;
  color: #059669;
  background: rgba(5, 150, 105, 0.12);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.rule-tag {
  font-size: 12px;
  font-weight: 600;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(2, 132, 199, 0.25);
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

.diagram-wrapper {
  width: 100%;
  overflow-x: auto;
}

.tcp-svg {
  width: 100%;
  min-width: 880px;
  height: auto;
  display: block;
}

/* 考试刷题框样式 */
.exam-question {
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  margin-bottom: 14px;
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border-left: 3px solid #059669;
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
  font-size: 13.5px;
}

.opt-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
}

.opt-selected {
  border-color: var(--vp-c-brand-1);
  background: rgba(37, 99, 235, 0.08);
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
  background: rgba(37, 99, 235, 0.1);
  color: var(--vp-c-brand-1);
  border: 1px solid rgba(37, 99, 235, 0.25);
}

.btn-toggle:hover {
  background: var(--vp-c-brand-1);
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
  margin-bottom: 8px;
}

.analysis-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.75;
  color: var(--vp-c-text-2);
}
</style>
