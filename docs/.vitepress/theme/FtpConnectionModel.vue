<template>
  <div class="ftp-sim-container">
    
    <!-- 顶部标题横幅 -->
    <div class="ftp-header">
      <div class="header-left">
        <span class="badge-blue">📂 FTP 协议双连接模型</span>
        <h4 class="header-title">控制连接 (TCP 21, 持续开启) + 数据连接 (动态建立/关闭)</h4>
      </div>
      <div class="rule-tag">
        连接规则：主动模式用 TCP 20；被动模式由服务器临时端口协商
      </div>
    </div>

    <!-- 1. 控制连接 vs 数据连接核心特性 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('conn')">
        <div class="header-title-box">
          <span class="card-icon">⚡</span>
          <strong>一、FTP 两个并行 TCP 连接核心特性对比</strong>
          <span class="badge-blue">核心模型</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.conn ? '收起 ▲' : '展开特性 ▼' }}
        </button>
      </div>

      <div v-show="openSections.conn" class="card-body">
        <div class="conn-grid">
          
          <div class="conn-box box-control">
            <div class="cb-head">
              <span class="cb-icon">📡</span>
              <strong>1. 控制连接 (Control Connection)</strong>
              <span class="port-tag tag-blue">熟知端口 TCP 21</span>
            </div>
            <ul class="cb-list">
              <li><strong>生命周期</strong>：在整个会话期间<strong>一直保持打开状态</strong>。</li>
              <li><strong>传输内容</strong>：传输客户端命令（如登录认证、操作指令、模式请求）与服务端响应码。</li>
              <li><strong>带外控制 (Out-of-band)</strong>：控制信息与数据分离传送，互不干扰。</li>
            </ul>
          </div>

          <div class="conn-box box-data">
            <div class="cb-head">
              <span class="cb-icon">📦</span>
              <strong>2. 数据连接 (Data Connection)</strong>
              <span class="port-tag tag-amber">TCP 20 / 临时端口</span>
            </div>
            <ul class="cb-list">
              <li><strong>生命周期</strong>：<strong>每次文件传输时才建立，传输结束立即关闭</strong>。</li>
              <li><strong>传输内容</strong>：用于传输实际的文件内容、目录列表清单等。</li>
              <li><strong>端口规则</strong>：主动模式下服务器端固定使用 <strong>TCP 20</strong>；被动模式下为<strong>随机临时端口</strong>。</li>
            </ul>
          </div>

        </div>
      </div>
    </div>

    <!-- 2. 主动模式 (PORT) vs 被动模式 (PASV) 全景时序拓扑图 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('modes')">
        <div class="header-title-box">
          <span class="card-icon">🔄</span>
          <strong>二、主动模式 (PORT) 与 被动模式 (PASV) 数据连接建立时序拓扑对比</strong>
          <span class="badge-green">模式图解</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.modes ? '收起 ▲' : '展开图解 ▼' }}
        </button>
      </div>

      <div v-show="openSections.modes" class="card-body">
        
        <!-- 左右并排双时序对比图 -->
        <div class="mode-comparison-layout">
          
          <!-- 左侧：主动模式 PORT -->
          <div class="mode-vis-panel">
            <div class="panel-header header-active">
              <strong>🔥 主动模式 (PORT Mode)</strong>
              <span class="p-sub">服务端主动连接客户端</span>
            </div>

            <div class="svg-wrapper">
              <svg viewBox="0 0 380 280" class="mode-svg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <marker id="ftp-arr-orange" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316"/>
                  </marker>
                  <marker id="ftp-arr-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
                  </marker>
                </defs>

                <!-- 客户端与服务端实体 -->
                <rect x="20" y="15" width="80" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
                <text x="60" y="35" font-size="11" font-weight="bold" text-anchor="middle" fill="#2563eb">FTP 客户</text>

                <rect x="280" y="15" width="80" height="32" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
                <text x="320" y="35" font-size="11" font-weight="bold" text-anchor="middle" fill="#0369a1">FTP 服务器</text>

                <!-- 时间垂线 -->
                <line x1="60" y1="47" x2="60" y2="265" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>
                <line x1="320" y1="47" x2="320" y2="265" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>

                <!-- ① 控制连接 (客户发起) -->
                <path d="M 60,75 L 315,75" fill="none" stroke="#f97316" stroke-width="2" marker-end="url(#ftp-arr-orange)"/>
                <rect x="80" y="60" width="220" height="22" rx="3" fill="#ffedd5" stroke="#f97316"/>
                <text x="190" y="75" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#c2410c">① 控制连接: 临时端口 ➔ TCP 21</text>

                <!-- ② 告知临时端口 -->
                <path d="M 60,125 L 315,125" fill="none" stroke="#f97316" stroke-width="1.5" marker-end="url(#ftp-arr-orange)"/>
                <text x="190" y="118" font-size="9.5" font-weight="bold" text-anchor="middle" fill="var(--vp-c-text-2)">② 发送 PORT 命令告知另一临时端口</text>

                <!-- ③ 数据连接 (服务器 20 主动连接客户端) -->
                <path d="M 320,185 L 65,185" fill="none" stroke="#0284c7" stroke-width="2.2" marker-end="url(#ftp-arr-blue)"/>
                <rect x="75" y="170" width="230" height="24" rx="3" fill="#e0f2fe" stroke="#0284c7"/>
                <text x="190" y="186" font-size="10" font-weight="900" text-anchor="middle" fill="#0369a1">③ 服务器 TCP 20 ➔ 客户端临时端口 (数据通道)</text>

                <!-- 底部提示 -->
                <rect x="25" y="225" width="330" height="30" rx="4" fill="var(--vp-c-bg-elv)" stroke="var(--vp-c-border)"/>
                <text x="190" y="244" font-size="9.5" text-anchor="middle" fill="#dc2626">⚠️ 客户端在防火墙/NAT内部时容易被拦截阻断</text>
              </svg>
            </div>
          </div>

          <!-- 右侧：被动模式 PASV -->
          <div class="mode-vis-panel">
            <div class="panel-header header-passive">
              <strong>🛡️ 被动模式 (PASV Mode)</strong>
              <span class="p-sub">客户端主动连接服务端临时端口</span>
            </div>

            <div class="svg-wrapper">
              <svg viewBox="0 0 380 280" class="mode-svg" xmlns="http://www.w3.org/2000/svg">
                <!-- 客户端与服务端实体 -->
                <rect x="20" y="15" width="80" height="32" rx="4" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
                <text x="60" y="35" font-size="11" font-weight="bold" text-anchor="middle" fill="#2563eb">FTP 客户</text>

                <rect x="280" y="15" width="80" height="32" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
                <text x="320" y="35" font-size="11" font-weight="bold" text-anchor="middle" fill="#0369a1">FTP 服务器</text>

                <!-- 时间垂线 -->
                <line x1="60" y1="47" x2="60" y2="265" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>
                <line x1="320" y1="47" x2="320" y2="265" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>

                <!-- ① 控制连接 (客户发起) -->
                <path d="M 60,75 L 315,75" fill="none" stroke="#f97316" stroke-width="2" marker-end="url(#ftp-arr-orange)"/>
                <rect x="80" y="60" width="220" height="22" rx="3" fill="#ffedd5" stroke="#f97316"/>
                <text x="190" y="75" font-size="9.5" font-weight="bold" text-anchor="middle" fill="#c2410c">① 控制连接: 临时端口 ➔ TCP 21</text>

                <!-- ② 发送 PASV 命令与服务端回复临时端口 -->
                <path d="M 60,115 L 315,115" fill="none" stroke="#f97316" stroke-width="1.5" marker-end="url(#ftp-arr-orange)"/>
                <text x="190" y="108" font-size="9.5" text-anchor="middle" fill="var(--vp-c-text-2)">② 客户发 PASV，服务端返回随机临时端口</text>
                <path d="M 320,135 L 65,135" fill="none" stroke="#f97316" stroke-width="1.5" marker-end="url(#ftp-arr-orange)"/>

                <!-- ③ 数据连接 (客户端主动连接服务器临时端口) -->
                <path d="M 60,185 L 315,185" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#ftp-arr-green)"/>
                <rect x="65" y="170" width="250" height="24" rx="3" fill="#ecfdf5" stroke="#059669"/>
                <text x="190" y="186" font-size="10" font-weight="900" text-anchor="middle" fill="#047857">③ 客户临时端口 ➔ 服务端临时端口 (不用 20)</text>

                <!-- 底部提示 -->
                <rect x="25" y="225" width="330" height="30" rx="4" fill="var(--vp-c-bg-elv)" stroke="var(--vp-c-border)"/>
                <text x="190" y="244" font-size="9.5" text-anchor="middle" fill="#059669">✔ 完美穿越客户端 NAT 与防火墙，当前主流标准</text>
              </svg>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- 3. 408 核心考点速记表格 (默认收起) -->
    <div class="collapsible-card">
      <div class="card-header" @click="toggle('summary')">
        <div class="header-title-box">
          <span class="card-icon">📝</span>
          <strong>三、核心考点速记：主动模式 vs 被动模式对比总结</strong>
          <span class="badge-amber">必背速查</span>
        </div>
        <button class="toggle-btn" type="button">
          {{ openSections.summary ? '收起 ▲' : '展开速查 ▼' }}
        </button>
      </div>

      <div v-show="openSections.summary" class="card-body">
        <div class="table-wrapper">
          <table class="ftp-summary-table">
            <thead>
              <tr>
                <th>对比维度</th>
                <th>🔥 主动模式 (PORT Mode)</th>
                <th>🛡️ 被动模式 (PASV Mode)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>发起数据连接方</strong></td>
                <td><strong>FTP 服务器主动发起</strong></td>
                <td><strong>FTP 客户端主动发起</strong></td>
              </tr>
              <tr>
                <td><strong>服务器数据端口</strong></td>
                <td>固定使用 <strong>TCP 20</strong> 端口</td>
                <td>由服务器随机开启<strong>临时端口</strong>（不用 20 端口）</td>
              </tr>
              <tr>
                <td><strong>客户端数据端口</strong></td>
                <td>客户端指定的随机临时端口</td>
                <td>客户端开启的随机临时端口</td>
              </tr>
              <tr>
                <td><strong>控制命令</strong></td>
                <td>客户端发送 <code class="code-val">PORT</code> 命令告知端口</td>
                <td>客户端发送 <code class="code-val">PASV</code> 命令请求端口</td>
              </tr>
              <tr>
                <td><strong>NAT / 防火墙适应性</strong></td>
                <td>较差（防火墙常拦截服务器的主动入站连接）</td>
                <td><strong>极佳</strong>（客户端出站发起连接，天然穿透 NAT）</td>
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
  conn: false,    // 默认收起连接特性
  modes: false,   // 默认收起模式对比
  summary: false  // 默认收起总结表格
})

const toggle = (key) => {
  openSections[key] = !openSections[key]
}
</script>

<style scoped>
.ftp-sim-container {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 顶部栏 */
.ftp-header {
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

/* 连接特性网格 */
.conn-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 768px) {
  .conn-grid {
    grid-template-columns: 1fr;
  }
}

.conn-box {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.box-control { border-left: 4px solid #2563eb; }
.box-data { border-left: 4px solid #f59e0b; }

.cb-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 12.5px;
}

.port-tag {
  font-size: 10px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 4px;
}

.tag-blue { background: rgba(37, 99, 235, 0.12); color: #2563eb; border: 1px solid rgba(37, 99, 235, 0.3); }
.tag-amber { background: rgba(245, 158, 11, 0.15); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.3); }

.cb-list {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  padding-left: 18px;
  margin: 0;
}

.cb-list li { margin-bottom: 3px; }
.cb-list strong { color: var(--vp-c-text-1); }

/* 模式图解布局 */
.mode-comparison-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 820px) {
  .mode-comparison-layout {
    grid-template-columns: 1fr;
  }
}

.mode-vis-panel {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.header-active { background: rgba(249, 115, 22, 0.1); color: #c2410c; border-bottom: 1px solid rgba(249, 115, 22, 0.2); }
.header-passive { background: rgba(16, 185, 129, 0.1); color: #047857; border-bottom: 1px solid rgba(16, 185, 129, 0.2); }

.p-sub {
  font-size: 10px;
  opacity: 0.85;
}

.svg-wrapper {
  padding: 8px;
  overflow-x: auto;
}

.mode-svg {
  width: 100%;
  min-width: 320px;
  height: auto;
  display: block;
}

/* 表格 */
.table-wrapper {
  overflow-x: auto;
}

.ftp-summary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: left;
}

.ftp-summary-table th,
.ftp-summary-table td {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-border);
}

.ftp-summary-table th {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-weight: 800;
}

.ftp-summary-table td {
  color: var(--vp-c-text-2);
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
