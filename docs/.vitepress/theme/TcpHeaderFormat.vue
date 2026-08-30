<template>
  <div class="tcp-header-container">
    
    <!-- 顶部标题横幅 -->
    <div class="th-header">
      <div class="header-left">
        <span class="badge-blue">📦 TCP 报文段结构</span>
        <h4 class="header-title">面向字节流传输模型与 TCP 报文段首部格式（20~60 字节）</h4>
      </div>
      <div class="rule-tag">
        数据偏移：以 4 字节为单位，值 5~15 ➔ 首部 20~60 字节
      </div>
    </div>

    <!-- 1. 面向字节流模型与报文段组装 (支持折叠) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('stream')">
        <div class="header-title-box">
          <span class="card-icon">🌊</span>
          <strong>面向字节流的传输模型（发送缓存切片 ➔ 报文段封装 ➔ 接收缓存重组）</strong>
          <span class="badge-blue">工作机理</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.stream ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.stream" class="card-body">
        <div class="stream-vis-box">
          
          <!-- 发送端 -->
          <div class="stream-side">
            <div class="app-node">
              <span class="node-title">发送方应用进程</span>
              <div class="stream-blocks">
                <span class="s-byte">21</span><span class="s-byte">20</span><span class="s-byte">19</span>
                <span class="s-arrow">⬇ 字节流</span>
              </div>
            </div>
            <div class="buffer-node">
              <span class="buf-title">TCP 发送缓存</span>
              <div class="buf-blocks">
                <span class="b-byte">18</span><span class="b-byte">17</span><span class="b-byte">16</span><span class="b-byte">15</span><span class="b-byte">14</span>
              </div>
            </div>
            <div class="segment-node">
              <span class="seg-title">封装为 TCP 报文段</span>
              <div class="seg-packet">
                <span class="seg-h">TCP 首部</span>
                <span class="seg-d">13 12 11</span>
              </div>
            </div>
          </div>

          <!-- 网络传输通道 -->
          <div class="stream-mid-bridge">
            <span class="bridge-arrow">➔ ➔ IP 网络分组传输 ➔ ➔</span>
            <span class="bridge-sub">（按字节序号切片传输）</span>
          </div>

          <!-- 接收端 -->
          <div class="stream-side">
            <div class="segment-node">
              <span class="seg-title">解封装 TCP 报文段</span>
              <div class="seg-packet">
                <span class="seg-h">TCP 首部</span>
                <span class="seg-d">13 12 11</span>
              </div>
            </div>
            <div class="buffer-node">
              <span class="buf-title">TCP 接收缓存</span>
              <div class="buf-blocks">
                <span class="b-byte">5</span><span class="b-byte">4</span>
              </div>
            </div>
            <div class="app-node">
              <span class="node-title">接收方应用进程</span>
              <div class="stream-blocks">
                <span class="s-arrow">⬆ 字节流</span>
                <span class="s-byte">0</span><span class="s-byte">1</span><span class="s-byte">2</span><span class="s-byte">3</span>
              </div>
            </div>
          </div>

        </div>

        <div class="stream-summary-bar">
          <span>● <strong>面向字节流</strong>：TCP 不管应用程序一次写入多长报文，都仅视作一连串无结构的字节序列，根据窗口和网络拥塞程度灵活切片。</span>
        </div>
      </div>
    </div>

    <!-- 2. TCP 报文段首部 32 位拓扑全景图 (默认展开) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('header')">
        <div class="header-title-box">
          <span class="card-icon">📐</span>
          <strong>TCP 报文段首部格式（32 位全景结构与字段功能）</strong>
          <span class="badge-green">首部格式</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.header ? '收起 ▲' : '展开结构 ▼' }}
        </button>
      </div>

      <div v-show="openSections.header" class="card-body">
        
        <!-- 32 位首部网格 -->
        <div class="header-grid-wrapper">
          <div class="bit-ruler">
            <span>位 0</span>
            <span>15 16</span>
            <span>31</span>
          </div>

          <div class="tcp-header-table">
            <!-- 行 1 -->
            <div class="h-row">
              <div class="h-col col-16">
                <strong>源端口 (Source Port)</strong>
                <span class="h-bit">16 位</span>
              </div>
              <div class="h-col col-16">
                <strong>目的端口 (Destination Port)</strong>
                <span class="h-bit">16 位</span>
              </div>
            </div>

            <!-- 行 2 -->
            <div class="h-row">
              <div class="h-col col-32 col-highlight-blue">
                <strong>序号 (Sequence Number)</strong>
                <span class="h-bit">32 位（本报文段数据第 1 字节序号）</span>
              </div>
            </div>

            <!-- 行 3 -->
            <div class="h-row">
              <div class="h-col col-32 col-highlight-green">
                <strong>确认号 (Acknowledgment Number)</strong>
                <span class="h-bit">32 位（期望收到对方下一个字节序号）</span>
              </div>
            </div>

            <!-- 行 4 -->
            <div class="h-row">
              <div class="h-col col-4 col-highlight-amber">
                <strong>数据偏移</strong>
                <span class="h-bit">4 位 (4B单位)</span>
              </div>
              <div class="h-col col-6">
                <strong>保留</strong>
                <span class="h-bit">6 位</span>
              </div>
              <div class="h-col col-6 col-flags">
                <span class="flag-item">U<br>R<br>G</span>
                <span class="flag-item">A<br>C<br>K</span>
                <span class="flag-item">P<br>S<br>H</span>
                <span class="flag-item">R<br>S<br>T</span>
                <span class="flag-item">S<br>Y<br>N</span>
                <span class="flag-item">F<br>I<br>N</span>
              </div>
              <div class="h-col col-16 col-highlight-purple">
                <strong>窗口 (Window / rwnd)</strong>
                <span class="h-bit">16 位（接收方允许发送的最大字节数）</span>
              </div>
            </div>

            <!-- 行 5 -->
            <div class="h-row">
              <div class="h-col col-16">
                <strong>校验和 (Checksum)</strong>
                <span class="h-bit">16 位（含 12B 伪首部）</span>
              </div>
              <div class="h-col col-16">
                <strong>紧急指针 (Urgent Pointer)</strong>
                <span class="h-bit">16 位（配合 URG=1）</span>
              </div>
            </div>

            <!-- 扩展行 -->
            <div class="h-row row-opt">
              <div class="h-col col-24">
                <strong>选项 (Options，长度可变，最大 40 字节，如 MSS、窗口扩大、SACK、时间戳)</strong>
              </div>
              <div class="h-col col-8">
                <strong>填充 (Padding，补齐 4 字节整倍数)</strong>
              </div>
            </div>

          </div>
        </div>

        <div class="header-size-tag">
          固定首部 <strong>20 字节</strong> + 扩展首部（最大 40 字节） = <strong>TCP 首部长度范围：20 ~ 60 字节</strong>
        </div>

      </div>
    </div>

    <!-- 3. 6 大控制标志位与核心字段速查表 (支持折叠) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('flags')">
        <div class="header-title-box">
          <span class="card-icon">💡</span>
          <strong>6 大控制标志位 (URG/ACK/PSH/RST/SYN/FIN) 与核心字段考点速查</strong>
          <span class="badge-amber">必背字段</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.flags ? '收起 ▲' : '展开速查 ▼' }}
        </button>
      </div>

      <div v-show="openSections.flags" class="card-body">
        <div class="flags-grid">
          
          <div class="flag-card">
            <div class="fc-head color-blue">1. SYN (Synchronize) 同步位</div>
            <div class="fc-body">
              <strong>SYN = 1</strong> 表示这是一个<strong>连接请求或连接接受报文段</strong>。<br>
              握手前两次必须置 1；SYN 报文<strong>即使不携带数据也必须消耗 1 个序号</strong>。
            </div>
          </div>

          <div class="flag-card">
            <div class="fc-head color-green">2. ACK (Acknowledgment) 确认位</div>
            <div class="fc-body">
              仅当 <strong>ACK = 1</strong> 时确认号字段才有效。<br>
              TCP 规定，在<strong>连接建立后的所有传送报文段中都必须将 ACK 置 1</strong>。
            </div>
          </div>

          <div class="flag-card">
            <div class="fc-head color-red">3. FIN (Finish) 终止位</div>
            <div class="fc-body">
              <strong>FIN = 1</strong> 用来<strong>释放一个连接</strong>，表明发送方的数据已发送完毕并请求释放连接。<br>
              FIN 报文<strong>不带数据也消耗 1 个序号</strong>。
            </div>
          </div>

          <div class="flag-card">
            <div class="fc-head color-red">4. RST (Reset) 复位位</div>
            <div class="fc-body">
              <strong>RST = 1</strong> 表明 TCP 连接中出现严重差错，<strong>必须释放连接并重新建立</strong>；也可用来拒绝非法连接请求。
            </div>
          </div>

          <div class="flag-card">
            <div class="fc-head color-amber">5. URG (Urgent) 紧急位</div>
            <div class="fc-body">
              <strong>URG = 1</strong> 时<strong>紧急指针字段有效</strong>，告诉系统此报文段中有紧急数据，应高优先级尽快传送，不按排队顺序。
            </div>
          </div>

          <div class="flag-card">
            <div class="fc-head color-purple">6. PSH (Push) 推送位</div>
            <div class="fc-body">
              <strong>PSH = 1</strong> 时接收方尽快将报文段交付给应用层，而<strong>不再等待接收缓存填满后再向上交付</strong>。
            </div>
          </div>

        </div>

        <div class="offset-formula-card">
          <div class="of-title">📐 408 必考单位换算：数据偏移 (Data Offset)</div>
          <div class="of-desc">
            数据偏移占 4 位，表示首部长度。<strong>其计算单位是 4 字节（32 位字长）</strong>：<br>
            - 最小值：二进制 <code class="code-val">0101</code>（十进制 5） ➔ 首部长度 = 5 × 4 = <strong>20 字节</strong>（无选项固定首部）；<br>
            - 最大值：二进制 <code class="code-val">1111</code>（十进制 15） ➔ 首部长度 = 15 × 4 = <strong>60 字节</strong>（包含最大 40 字节选项）。
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive , onMounted, onUnmounted} from 'vue'

const openSections = reactive({
  stream: false, // 默认收起流模型
  header: false,  // 默认展开首部拓扑
  flags: false    // 默认展开标志位速查
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
.tcp-header-container {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 顶部栏 */
.th-header {
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

/* 字节流模型 */
.stream-vis-box {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 1.2fr;
  gap: 10px;
  align-items: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 12px;
}

@media (max-width: 768px) {
  .stream-vis-box {
    grid-template-columns: 1fr;
  }
}

.stream-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.app-node, .buffer-node, .segment-node {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.node-title, .buf-title, .seg-title {
  font-size: 11px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.stream-blocks, .buf-blocks {
  display: flex;
  gap: 4px;
  align-items: center;
}

.s-byte, .b-byte {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #d97706;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}

.s-arrow {
  font-size: 10px;
  color: var(--vp-c-text-3);
  margin-left: 4px;
}

.seg-packet {
  display: flex;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  overflow: hidden;
}

.seg-h {
  background: #2563eb;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
}

.seg-d {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  flex: 1;
}

.stream-mid-bridge {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}

.bridge-arrow {
  font-size: 11px;
  font-weight: 800;
  color: #2563eb;
}

.bridge-sub {
  font-size: 9.5px;
  color: var(--vp-c-text-3);
}

.stream-summary-bar {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 11.5px;
  color: var(--vp-c-text-2);
}

/* 首部网格 */
.header-grid-wrapper {
  overflow-x: auto;
}

.bit-ruler {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 800;
  color: var(--vp-c-text-3);
  padding: 0 4px 4px 4px;
  min-width: 680px;
}

.tcp-header-table {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 680px;
}

.h-row {
  display: flex;
  gap: 3px;
  width: 100%;
}

.h-col {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 11.5px;
}

.col-4 { width: 12.5%; }
.col-6 { width: 18.75%; }
.col-8 { width: 25%; }
.col-16 { width: 50%; }
.col-24 { width: 75%; }
.col-32 { width: 100%; }

.col-flags {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 4px 2px;
}

.flag-item {
  font-size: 9px;
  font-weight: 800;
  line-height: 1.1;
  text-align: center;
  color: #2563eb;
}

.h-bit {
  font-size: 9px;
  color: var(--vp-c-text-3);
  margin-top: 2px;
}

.col-highlight-blue { background: rgba(37, 99, 235, 0.08); border-color: rgba(37, 99, 235, 0.3); }
.col-highlight-green { background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.3); }
.col-highlight-amber { background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.3); }
.col-highlight-purple { background: rgba(139, 92, 246, 0.08); border-color: rgba(139, 92, 246, 0.3); }

.row-opt .h-col {
  background: var(--vp-c-bg-elv);
  border-style: dashed;
}

.header-size-tag {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.header-size-tag strong {
  color: #2563eb;
}

/* 标志位网格 */
.flags-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

@media (max-width: 820px) {
  .flags-grid {
    grid-template-columns: 1fr;
  }
}

.flag-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fc-head {
  font-size: 12px;
  font-weight: 800;
}

.color-blue { color: #2563eb; }
.color-green { color: #059669; }
.color-red { color: #ef4444; }
.color-amber { color: #d97706; }
.color-purple { color: #8b5cf6; }

.fc-body {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.fc-body strong {
  color: var(--vp-c-text-1);
}

.offset-formula-card {
  background: var(--vp-c-bg);
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  padding: 10px 12px;
}

.of-title {
  font-size: 12px;
  font-weight: 800;
  color: #d97706;
  margin-bottom: 4px;
}

.of-desc {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.code-val {
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-weight: 700;
  color: #2563eb;
}
</style>
