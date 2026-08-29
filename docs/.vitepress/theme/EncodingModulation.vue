<template>
  <div class="em-container">
    <!-- 头部导航与选项卡 -->
    <div class="em-header">
      <div class="header-left">
        <span class="em-badge">📡 物理层信号与传输</span>
        <h3 class="em-title">编码与调制全景拓扑与波形实验室</h3>
      </div>
      <div class="tab-btn-group">
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'baseband' }"
          @click="currentTab = 'baseband'"
        >
          📈 5大基带编码波形
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'modulation' }"
          @click="currentTab = 'modulation'"
        >
          〰️ 基本载波调制
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'qam' }"
          @click="currentTab = 'qam'"
        >
          💠 QAM-16 星座图
        </button>
      </div>
    </div>

    <!-- 视图 1：5 大常用基带编码波形对比 (NRZ, NRZI, RZ, 曼彻斯特, 差分曼彻斯特) -->
    <div class="em-view" v-if="currentTab === 'baseband'">
      <div class="wave-panel">
        
        <!-- 顶部对齐比特流轨道 -->
        <div class="aligned-bit-track-row">
          <div class="track-meta-label">
            <span class="t-badge">输入比特流</span>
          </div>
          <div class="track-svg-wrapper">
            <svg viewBox="0 0 800 36" class="bit-svg" preserveAspectRatio="none">
              <!-- 8个比特网格与对应数字 -->
              <g v-for="(b, i) in bits" :key="i">
                <rect :x="i * 100 + 4" y="4" width="92" height="28" rx="6" class="bit-rect" />
                <text :x="i * 100 + 50" y="23" class="bit-text" text-anchor="middle">{{ b }}</text>
                <!-- 周期分割线 -->
                <line :x1="i * 100" y1="0" :x2="i * 100" y2="36" class="grid-line" />
              </g>
              <line x1="800" y1="0" x2="800" y2="36" class="grid-line" />
            </svg>
          </div>
        </div>

        <div class="wave-stack">
          <!-- 1. 不归零编码 (NRZ) -->
          <div class="wave-row">
            <div class="wave-meta">
              <div class="meta-title-line">
                <span class="w-name">1. 不归零编码 (NRZ)</span>
                <span class="w-sub">Non-Return-to-Zero</span>
              </div>
              <span class="w-rule">高电平表示 1，低电平表示 0。</span>
              <span class="w-tip">⚠️ <strong>无自同步能力</strong>，连续发送多个 0 或 1 时易发生时钟漂移失步。</span>
            </div>
            <div class="wave-svg-box">
              <svg viewBox="0 0 800 64" class="wave-svg" preserveAspectRatio="none">
                <!-- 周期分割虚线 (加深对比度) -->
                <line v-for="g in 9" :key="'g1-'+g" :x1="(g-1)*100" y1="0" :x2="(g-1)*100" y2="64" class="grid-line" />
                <line x1="0" y1="32" x2="800" y2="32" class="center-axis" />
                <!-- NRZ 波形: [1,0,0,1,0,1,1,1] -> 高,低,低,高,低,高,高,高 -->
                <path d="M 0 12 L 100 12 L 100 52 L 300 52 L 300 12 L 400 12 L 400 52 L 500 52 L 500 12 L 800 12" class="signal-path path-nrz" />
              </svg>
            </div>
          </div>

          <!-- 2. 不归零反转编码 (NRZI) -->
          <div class="wave-row highlight-nrz-row">
            <div class="wave-meta">
              <div class="meta-title-line">
                <span class="w-name">2. 不归零反转编码 (NRZI)</span>
                <span class="w-sub">NRZ-Inverted (逢1翻转)</span>
              </div>
              <span class="w-rule">遇到 1 发生电平跳变翻转，遇到 0 电平保持不变。</span>
              <span class="w-tip">⭐️ 具备<strong>连续 1 的自同步</strong>（USB标准/配合 4B/5B 避免长串 0 达到全自同步）。</span>
            </div>
            <div class="wave-svg-box">
              <svg viewBox="0 0 800 64" class="wave-svg" preserveAspectRatio="none">
                <line v-for="g in 9" :key="'g2-'+g" :x1="(g-1)*100" y1="0" :x2="(g-1)*100" y2="64" class="grid-line" />
                <line x1="0" y1="32" x2="800" y2="32" class="center-axis" />
                <!-- NRZI (初态低): b0=1翻转(高), b1=0不变(高), b2=0不变(高), b3=1翻转(低), b4=0不变(低), b5=1翻转(高), b6=1翻转(低), b7=1翻转(高) -->
                <path d="M 0 12 L 300 12 L 300 52 L 500 52 L 500 12 L 600 12 L 600 52 L 700 52 L 700 12 L 800 12" class="signal-path path-nrzi" />
                <!-- 关键翻转标注 -->
                <text x="50" y="28" class="wave-annotation">1 翻转</text>
                <text x="150" y="28" class="wave-annotation">0 保持</text>
                <text x="250" y="28" class="wave-annotation">0 保持</text>
                <text x="350" y="44" class="wave-annotation">1 翻转</text>
                <text x="450" y="44" class="wave-annotation">0 保持</text>
                <text x="550" y="28" class="wave-annotation">1 翻转</text>
                <text x="650" y="44" class="wave-annotation">1 翻转</text>
                <text x="750" y="28" class="wave-annotation">1 翻转</text>
              </svg>
            </div>
          </div>

          <!-- 3. 归零编码 (RZ) -->
          <div class="wave-row">
            <div class="wave-meta">
              <div class="meta-title-line">
                <span class="w-name">3. 归零编码 (RZ)</span>
                <span class="w-sub">Return-to-Zero</span>
              </div>
              <span class="w-rule">1为前半高后归零，0为前半低后归零。</span>
              <span class="w-tip">码元正中归零具备自同步；但脉冲变窄占用带宽翻倍，编码效率低。</span>
            </div>
            <div class="wave-svg-box">
              <svg viewBox="0 0 800 64" class="wave-svg" preserveAspectRatio="none">
                <line v-for="g in 9" :key="'g3-'+g" :x1="(g-1)*100" y1="0" :x2="(g-1)*100" y2="64" class="grid-line" />
                <line x1="0" y1="32" x2="800" y2="32" class="center-axis" />
                <path d="M 0 12 L 50 12 L 50 32 L 100 32 L 100 52 L 150 52 L 150 32 L 200 32 L 200 52 L 250 52 L 250 32 L 300 32 L 300 12 L 350 12 L 350 32 L 400 32 L 400 52 L 450 52 L 450 32 L 500 32 L 500 12 L 550 12 L 550 32 L 600 32 L 600 12 L 650 12 L 650 32 L 700 32 L 700 12 L 750 12 L 750 32 L 800 32" class="signal-path path-rz" />
              </svg>
            </div>
          </div>

          <!-- 4. 曼彻斯特编码 (Manchester) -->
          <div class="wave-row highlight-row">
            <div class="wave-meta">
              <div class="meta-title-line">
                <span class="w-name">4. 曼彻斯特编码 (Manchester)</span>
                <span class="w-sub">以太网标准 (10BASE-T)</span>
              </div>
              <span class="w-rule">码元**中心跳变既表示时钟又表示数据**（高到低为1，低到高为0）。</span>
              <span class="w-tip">⭐️ 具备强自同步能力。每个比特跳变 2 次，波特率是比特率 2 倍，编码效率 50%。</span>
            </div>
            <div class="wave-svg-box">
              <svg viewBox="0 0 800 64" class="wave-svg" preserveAspectRatio="none">
                <line v-for="g in 9" :key="'g4-'+g" :x1="(g-1)*100" y1="0" :x2="(g-1)*100" y2="64" class="grid-line" />
                <line x1="0" y1="32" x2="800" y2="32" class="center-axis" />
                <path d="M 0 12 L 50 12 L 50 52 L 150 52 L 150 12 L 200 12 L 200 52 L 250 52 L 250 12 L 300 12 L 350 12 L 350 52 L 450 52 L 450 12 L 500 12 L 550 12 L 550 52 L 600 52 L 600 12 L 650 12 L 650 52 L 700 52 L 700 12 L 750 12 L 750 52 L 800 52" class="signal-path path-man" />
                <!-- 中心跳变标注 -->
                <text x="50" y="36" class="arrow-anno">↓ 1</text>
                <text x="150" y="36" class="arrow-anno">↑ 0</text>
                <text x="250" y="36" class="arrow-anno">↑ 0</text>
                <text x="350" y="36" class="arrow-anno">↓ 1</text>
                <text x="450" y="36" class="arrow-anno">↑ 0</text>
                <text x="550" y="36" class="arrow-anno">↓ 1</text>
                <text x="650" y="36" class="arrow-anno">↓ 1</text>
                <text x="750" y="36" class="arrow-anno">↓ 1</text>
              </svg>
            </div>
          </div>

          <!-- 5. 差分曼彻斯特编码 (Differential Manchester) -->
          <div class="wave-row highlight-row">
            <div class="wave-meta">
              <div class="meta-title-line">
                <span class="w-name">5. 差分曼彻斯特编码</span>
                <span class="w-sub">抗干扰能力强 · 高速传输</span>
              </div>
              <span class="w-rule">码元**中心仅做时钟；边界有跳变表示 0，无跳变表示 1**。</span>
              <span class="w-tip">⭐️ 比曼彻斯特编码电平变化更少，抗干扰与纠错能力显著提升。</span>
            </div>
            <div class="wave-svg-box">
              <svg viewBox="0 0 800 64" class="wave-svg" preserveAspectRatio="none">
                <line v-for="g in 9" :key="'g5-'+g" :x1="(g-1)*100" y1="0" :x2="(g-1)*100" y2="64" class="grid-line" />
                <line x1="0" y1="32" x2="800" y2="32" class="center-axis" />
                <path d="M 0 12 L 50 12 L 50 52 L 100 52 L 100 12 L 150 12 L 150 52 L 200 52 L 200 12 L 250 12 L 250 52 L 350 52 L 350 12 L 400 12 L 400 52 L 450 52 L 450 12 L 550 12 L 550 52 L 650 52 L 650 12 L 750 12 L 750 52 L 800 52" class="signal-path path-diff-man" />
                <text x="100" y="58" class="diff-anno">边界跳变(0)</text>
                <text x="200" y="58" class="diff-anno">边界跳变(0)</text>
                <text x="300" y="58" class="diff-anno">无跳变(1)</text>
                <text x="400" y="58" class="diff-anno">边界跳变(0)</text>
                <text x="500" y="58" class="diff-anno">无跳变(1)</text>
                <text x="600" y="58" class="diff-anno">无跳变(1)</text>
                <text x="700" y="58" class="diff-anno">无跳变(1)</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视图 2：基本载波调制方式 (2ASK / 2FSK / 2PSK) -->
    <div class="em-view" v-if="currentTab === 'modulation'">
      <div class="mod-panel">
        <div class="aligned-bit-track-row">
          <div class="track-meta-label">
            <span class="t-badge">数字基带序列</span>
          </div>
          <div class="track-svg-wrapper">
            <svg viewBox="0 0 500 36" class="bit-svg" preserveAspectRatio="none">
              <g v-for="(b, i) in modBits" :key="i">
                <rect :x="i * 100 + 6" y="4" width="88" height="28" rx="6" class="bit-rect" />
                <text :x="i * 100 + 50" y="23" class="bit-text" text-anchor="middle">{{ b }}</text>
                <line :x1="i * 100" y1="0" :x2="i * 100" y2="36" class="grid-line" />
              </g>
              <line x1="500" y1="0" x2="500" y2="36" class="grid-line" />
            </svg>
          </div>
        </div>

        <div class="mod-methods-grid">
          <!-- 调幅 2ASK -->
          <div class="mod-method-card">
            <div class="m-card-header">
              <span class="m-type-badge">调幅 (AM / 2ASK)</span>
              <span class="m-key">改变载波振幅</span>
            </div>
            <p class="m-explain">有载波输出表示 <strong>1</strong>，无载波输出表示 <strong>0</strong>。抗干扰能力最弱。</p>
            <div class="carrier-wave-box">
              <svg viewBox="0 0 500 50" class="carrier-svg" preserveAspectRatio="none">
                <line v-for="g in 6" :key="'gask-'+g" :x1="(g-1)*100" y1="0" :x2="(g-1)*100" y2="50" class="grid-line" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#0284c7" stroke-width="2.5" />
                <path d="M 100 25 Q 112.5 0 125 25 T 150 25 T 175 25 T 200 25" fill="none" stroke="#0284c7" stroke-width="2.5" />
                <line x1="200" y1="25" x2="400" y2="25" stroke="#0284c7" stroke-width="2.5" />
                <path d="M 400 25 Q 412.5 0 425 25 T 450 25 T 475 25 T 500 25" fill="none" stroke="#0284c7" stroke-width="2.5" />
              </svg>
            </div>
          </div>

          <!-- 调频 2FSK -->
          <div class="mod-method-card">
            <div class="m-card-header">
              <span class="m-type-badge">调频 (FM / 2FSK)</span>
              <span class="m-key">改变载波频率</span>
            </div>
            <p class="m-explain">频率 <strong>f₁</strong>（稀疏波形）表示 <strong>0</strong>，频率 <strong>f₂</strong>（密集波形）表示 <strong>1</strong>。抗干扰较强。</p>
            <div class="carrier-wave-box">
              <svg viewBox="0 0 500 50" class="carrier-svg" preserveAspectRatio="none">
                <line v-for="g in 6" :key="'gfsk-'+g" :x1="(g-1)*100" y1="0" :x2="(g-1)*100" y2="50" class="grid-line" />
                <path d="M 0 25 Q 25 0 50 25 T 100 25 Q 112.5 0 125 25 T 150 25 T 175 25 T 200 25 Q 225 0 250 25 T 300 25 Q 325 0 350 25 T 400 25 Q 412.5 0 425 25 T 450 25 T 475 25 T 500 25" fill="none" stroke="#10b981" stroke-width="2.5" />
              </svg>
            </div>
          </div>

          <!-- 调相 2PSK -->
          <div class="mod-method-card">
            <div class="m-card-header">
              <span class="m-type-badge">调相 (PM / 2PSK)</span>
              <span class="m-key">改变载波初相位</span>
            </div>
            <p class="m-explain">初相位 <strong>0°</strong> 表示 <strong>0</strong>，初相位 <strong>180°</strong>（波形反相突变）表示 <strong>1</strong>。抗干扰能力最强。</p>
            <div class="carrier-wave-box">
              <svg viewBox="0 0 500 50" class="carrier-svg" preserveAspectRatio="none">
                <line v-for="g in 6" :key="'gpsk-'+g" :x1="(g-1)*100" y1="0" :x2="(g-1)*100" y2="50" class="grid-line" />
                <path d="M 0 25 Q 25 0 50 25 T 100 25 Q 125 50 150 25 T 200 25 Q 225 0 250 25 T 300 25 Q 325 0 350 25 T 400 25 Q 425 50 450 25 T 500 25" fill="none" stroke="#f59e0b" stroke-width="2.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视图 3：正交振幅调制 QAM-16 与格雷码 -->
    <div class="em-view" v-if="currentTab === 'qam'">
      <div class="qam-layout">
        <div class="qam-points">
          <h4 class="qam-title">正交振幅调制 (QAM-16) 核心机理</h4>
          <div class="q-list">
            <div class="q-item">
              <span class="q-bullet">🔹</span>
              <span><strong>多载波混合调制</strong>：同时改变载波的<strong>振幅</strong>与<strong>相位</strong>。</span>
            </div>
            <div class="q-item">
              <span class="q-bullet">🔹</span>
              <span><strong>16 种状态码元</strong>：具有 <strong>12 种相位</strong>，每种相位有 1 或 2 种振幅可选，共组合出 16 种不同波形。</span>
            </div>
            <div class="q-item">
              <span class="q-bullet">🔹</span>
              <span><strong>信息承载量</strong>：每个码元携带 <strong>4 个比特</strong>（因为 16 = 2⁴ ⇒ log₂16 = 4 bit）。</span>
            </div>
            <div class="q-item">
              <span class="q-bullet">🔹</span>
              <span><strong>格雷码 (Gray Code) 映射</strong>：任意两个<strong>相邻码元之间仅有 1 个比特不同</strong>。当信道受噪声干扰误判为相邻码元时，仅产生 1 bit 错误，极大降低误码率！</span>
            </div>
          </div>
        </div>

        <div class="qam-chart-box">
          <div class="qam-grid-wrapper">
            <svg viewBox="-180 -180 360 360" class="qam-svg">
              <line x1="-160" y1="0" x2="160" y2="0" stroke="var(--vp-c-text-3)" stroke-width="1.5" />
              <line x1="0" y1="160" x2="0" y2="-160" stroke="var(--vp-c-text-3)" stroke-width="1.5" />
              
              <circle cx="0" cy="0" r="60" fill="none" stroke="var(--vp-c-divider)" stroke-dasharray="3,3" />
              <circle cx="0" cy="0" r="120" fill="none" stroke="var(--vp-c-divider)" stroke-dasharray="3,3" />

              <!-- 16 个星座点 (4x4 格雷码布局) -->
              <g class="const-point" transform="translate(45, -45)"><circle r="4.5" fill="#ef4444"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">1101</text></g>
              <g class="const-point" transform="translate(120, -45)"><circle r="4.5" fill="#ef4444"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">1001</text></g>
              <g class="const-point" transform="translate(45, -120)"><circle r="4.5" fill="#ef4444"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">1100</text></g>
              <g class="const-point" transform="translate(120, -120)"><circle r="4.5" fill="#ef4444"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">1000</text></g>

              <g class="const-point" transform="translate(-45, -45)"><circle r="4.5" fill="#0284c7"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0101</text></g>
              <g class="const-point" transform="translate(-120, -45)"><circle r="4.5" fill="#0284c7"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0001</text></g>
              <g class="const-point" transform="translate(-45, -120)"><circle r="4.5" fill="#0284c7"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0100</text></g>
              <g class="const-point" transform="translate(-120, -120)"><circle r="4.5" fill="#0284c7"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0000</text></g>

              <g class="const-point" transform="translate(-45, 45)"><circle r="4.5" fill="#10b981"/><text y="16" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0111</text></g>
              <g class="const-point" transform="translate(-120, 45)"><circle r="4.5" fill="#10b981"/><text y="16" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0011</text></g>
              <g class="const-point" transform="translate(-45, 120)"><circle r="4.5" fill="#10b981"/><text y="16" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0110</text></g>
              <g class="const-point" transform="translate(-120, 120)"><circle r="4.5" fill="#10b981"/><text y="16" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0010</text></g>

              <g class="const-point" transform="translate(45, 45)"><circle r="4.5" fill="#8b5cf6"/><text y="16" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">1111</text></g>
              <g class="const-point" transform="translate(120, 45)"><circle r="4.5" fill="#8b5cf6"/><text y="16" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">1011</text></g>
              <g class="const-point" transform="translate(45, 120)"><circle r="4.5" fill="#8b5cf6"/><text y="16" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">1110</text></g>
              <g class="const-point" transform="translate(120, 120)"><circle r="4.5" fill="#8b5cf6"/><text y="16" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">1010</text></g>
            </svg>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentTab = ref('baseband')
const bits = ref(['1', '0', '0', '1', '0', '1', '1', '1'])
const modBits = ref(['0', '1', '0', '0', '1'])
</script>

<style scoped>
.em-container {
  margin: 24px 0;
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: all 0.25s ease;
}

.em-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
  gap: 10px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.em-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(2, 132, 199, 0.12);
  color: #0284c7;
  border: 1px solid rgba(2, 132, 199, 0.3);
}

.em-title {
  margin: 0;
  font-size: 15.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.tab-btn-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.tab-btn.active {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.em-view {
  padding: 18px 20px;
  background: var(--vp-c-bg);
}

/* 对齐的比特流轨道 */
.aligned-bit-track-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 14px;
  align-items: center;
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .aligned-bit-track-row {
    grid-template-columns: 1fr;
  }
}

.track-meta-label {
  display: flex;
  align-items: center;
}

.t-badge {
  font-size: 12px;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  padding: 3px 8px;
  background: var(--vp-c-brand-soft);
  border-radius: 6px;
}

.track-svg-wrapper {
  width: 100%;
  overflow-x: auto;
}

.bit-svg {
  width: 100%;
  min-width: 540px;
  height: 36px;
  display: block;
}

.bit-rect {
  fill: var(--vp-c-bg-alt);
  stroke: var(--vp-c-brand-soft);
  stroke-width: 1;
}

.bit-text {
  font-size: 16px;
  font-weight: 900;
  fill: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
}

/* 周期分割虚线 (清晰加深) */
.grid-line {
  stroke: #64748b;
  stroke-width: 1.2;
  stroke-dasharray: 4, 3;
  opacity: 0.75;
}

.dark .grid-line {
  stroke: #94a3b8;
  opacity: 0.6;
}

.center-axis {
  stroke: var(--vp-c-divider);
  stroke-width: 0.8;
}

/* 波形行布局 (左侧 200px 描述，右侧波形与顶部比特流绝对对齐) */
.wave-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wave-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 14px;
  align-items: center;
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  transition: all 0.2s ease;
}

@media (max-width: 768px) {
  .wave-row {
    grid-template-columns: 1fr;
  }
}

.wave-row:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.highlight-row {
  border-left: 4px solid #ef4444;
}

.highlight-nrz-row {
  border-left: 4px solid #06b6d4;
}

.wave-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-title-line {
  display: flex;
  flex-direction: column;
}

.w-name {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.w-sub {
  font-size: 10.5px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.w-rule {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.w-tip {
  font-size: 11px;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

.wave-svg-box {
  width: 100%;
  overflow-x: auto;
  background: var(--vp-c-bg);
  border-radius: 6px;
  padding: 2px 0;
}

.wave-svg {
  width: 100%;
  min-width: 540px;
  height: 64px;
  display: block;
}

/* 信号路径画笔 */
.signal-path {
  fill: none;
  stroke-width: 2.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.path-nrz { stroke: #3b82f6; }
.path-nrzi { stroke: #06b6d4; }
.path-rz { stroke: #10b981; }
.path-man { stroke: #ef4444; }
.path-diff-man { stroke: #8b5cf6; }

.wave-annotation {
  font-size: 10px;
  font-weight: 800;
  fill: #06b6d4;
  text-anchor: middle;
}

.arrow-anno {
  font-size: 11px;
  font-weight: 800;
  fill: #ef4444;
  text-anchor: middle;
}

.diff-anno {
  font-size: 9.5px;
  font-weight: 700;
  fill: #8b5cf6;
  text-anchor: middle;
}

/* 载波调制卡片 */
.mod-methods-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
}

.mod-method-card {
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
}

.m-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.m-type-badge {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.m-key {
  font-size: 11.5px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.m-explain {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  margin: 0 0 8px 0;
}

.carrier-wave-box {
  background: var(--vp-c-bg);
  border-radius: 6px;
  padding: 6px 0;
}

.carrier-svg {
  width: 100%;
  min-width: 500px;
  height: 50px;
  display: block;
}

/* QAM 布局 */
.qam-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
  align-items: center;
}

@media (max-width: 768px) {
  .qam-layout {
    grid-template-columns: 1fr;
  }
}

.qam-title {
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.q-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.q-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.q-bullet {
  color: var(--vp-c-brand-1);
  font-size: 11px;
  margin-top: 3px;
}

.qam-chart-box {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 14px;
}

.qam-grid-wrapper {
  width: 100%;
  max-width: 260px;
}

.qam-svg {
  width: 100%;
  height: auto;
}
</style>
