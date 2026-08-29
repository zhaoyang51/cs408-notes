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
          :class="{ active: currentTab === 'flow' }"
          @click="currentTab = 'flow'"
        >
          🔀 4大转换通路
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'baseband' }"
          @click="currentTab = 'baseband'"
        >
          📈 4大基带编码波形
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

    <!-- 视图 1：消息、数据、信号与 4 大转换通路 -->
    <div class="em-view" v-if="currentTab === 'flow'">
      <div class="flow-hierarchy">
        <div class="flow-nodes-row">
          <div class="flow-node">
            <span class="node-icon">📄</span>
            <div class="node-info">
              <span class="node-title">消息 (Message)</span>
              <span class="node-desc">文字/图片/音频/视频</span>
            </div>
          </div>
          <span class="flow-arrow">➔ 运送实体的表现 ➔</span>
          <div class="flow-node">
            <span class="node-icon">💻</span>
            <div class="node-info">
              <span class="node-title">数据 (Data)</span>
              <span class="node-desc">二进制数字或模拟数据</span>
            </div>
          </div>
          <span class="flow-arrow">➔ 电磁表现 ➔</span>
          <div class="flow-node">
            <span class="node-icon">⚡</span>
            <div class="node-info">
              <span class="node-title">信号 (Signal)</span>
              <span class="node-desc">信源发出的原始电信号</span>
            </div>
          </div>
          <span class="flow-arrow">➔ 基带形态 ➔</span>
          <div class="flow-node highlight">
            <span class="node-icon">📶</span>
            <div class="node-info">
              <span class="node-title">基带信号 (Baseband)</span>
              <span class="node-desc">数字基带 vs 模拟基带</span>
            </div>
          </div>
        </div>

        <div class="conversion-grid">
          <!-- 1. 数字基带 -> 编码 -> 数字信道 -->
          <div class="conv-card conv-dig-code">
            <div class="conv-header">
              <span class="c-tag">数字基带 ➔ 数字信道</span>
              <span class="c-tech">编码 (Encoding)</span>
            </div>
            <div class="conv-body">
              <p class="c-desc">将离散的数字数据直接转换为适合数字信道传输的数字电平信号。</p>
              <div class="c-examples">
                <span class="ex-pill">以太网 曼彻斯特编码 (10BASE-T)</span>
                <span class="ex-pill">4B/5B (百兆快速以太网)</span>
                <span class="ex-pill">8B/10B (千兆以太网)</span>
              </div>
            </div>
          </div>

          <!-- 2. 数字基带 -> 调制 -> 模拟信道 -->
          <div class="conv-card conv-dig-mod">
            <div class="conv-header">
              <span class="c-tag">数字基带 ➔ 模拟信道</span>
              <span class="c-tech">调制 (Modulation)</span>
            </div>
            <div class="conv-body">
              <p class="c-desc">使用载波将数字信号的“0/1”变换为高频连续模拟波形，在无线或光纤中远距离传输。</p>
              <div class="c-examples">
                <span class="ex-pill">Wi-Fi (CCK / DSSS / OFDM)</span>
                <span class="ex-pill">基本调制 (2ASK / 2FSK / 2PSK)</span>
                <span class="ex-pill">高阶正交振幅调制 (QAM-16 / QAM-64)</span>
              </div>
            </div>
          </div>

          <!-- 3. 模拟基带 -> 编码 -> 数字信道 -->
          <div class="conv-card conv-ana-code">
            <div class="conv-header">
              <span class="c-tag">模拟基带 ➔ 数字信道</span>
              <span class="c-tech">数字化编码 (Digitization)</span>
            </div>
            <div class="conv-body">
              <p class="c-desc">连续的模拟信号（如语音、音乐）经过“采样-量化-编码”三步转换为离散数字码流。</p>
              <div class="c-examples">
                <span class="ex-pill">脉冲编码调制 PCM (Pulse Code Modulation)</span>
                <span class="ex-pill">采样定理：采样频率 f_s ≥ 2 f_max</span>
              </div>
            </div>
          </div>

          <!-- 4. 模拟基带 -> 调制 -> 模拟信道 -->
          <div class="conv-card conv-ana-mod">
            <div class="conv-header">
              <span class="c-tag">模拟基带 ➔ 模拟信道</span>
              <span class="c-tech">频分复用调制 (FDM)</span>
            </div>
            <div class="conv-body">
              <p class="c-desc">将语音等基带信号搬移到高频载波频段，利用频分复用技术多路并发传输，充分利用信道带宽。</p>
              <div class="c-examples">
                <span class="ex-pill">传统调频/调幅广播 (FM / AM)</span>
                <span class="ex-pill">有线电视模拟传输</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视图 2：4 大常用基带编码波形对比 -->
    <div class="em-view" v-if="currentTab === 'baseband'">
      <div class="wave-panel">
        <div class="bit-banner">
          <span class="bit-label">输入比特流 (Bitstream):</span>
          <div class="bit-cells">
            <span class="b-cell" v-for="(b, i) in bits" :key="i">{{ b }}</span>
          </div>
        </div>

        <div class="wave-stack">
          <!-- 1. 不归零编码 (NRZ) -->
          <div class="wave-row">
            <div class="wave-meta">
              <span class="w-name">不归零编码 (NRZ)</span>
              <span class="w-sub">Non-Return-to-Zero</span>
              <span class="w-tip">⚠️ 无自同步能力，长串 0 或 1 易丢失时钟同步</span>
            </div>
            <div class="wave-svg-box">
              <svg viewBox="0 0 800 60" class="wave-svg">
                <!-- 网格线 -->
                <line v-for="g in 9" :key="g" :x1="(g-1)*100" y1="0" :x2="(g-1)*100" y2="60" stroke="var(--vp-c-divider)" stroke-dasharray="3,3" />
                <line x1="0" y1="30" x2="800" y2="30" stroke="var(--vp-c-divider)" stroke-width="0.5" />
                <!-- NRZ 波形: 1=高(10), 0=低(50) [1,0,0,1,0,1,1,1] -->
                <path d="M 0 10 L 100 10 L 100 50 L 300 50 L 300 10 L 400 10 L 400 50 L 500 50 L 500 10 L 800 10" fill="none" stroke="#3b82f6" stroke-width="2.5" />
              </svg>
            </div>
          </div>

          <!-- 2. 归零编码 (RZ) -->
          <div class="wave-row">
            <div class="wave-meta">
              <span class="w-name">归零编码 (RZ)</span>
              <span class="w-sub">Return-to-Zero</span>
              <span class="w-tip">具备自同步能力；但码元正中归零导致频带占用加倍，效率低</span>
            </div>
            <div class="wave-svg-box">
              <svg viewBox="0 0 800 60" class="wave-svg">
                <line v-for="g in 9" :key="g" :x1="(g-1)*100" y1="0" :x2="(g-1)*100" y2="60" stroke="var(--vp-c-divider)" stroke-dasharray="3,3" />
                <!-- 归零波形: 1=前前半高后半零, 0=前前半低后半零 -->
                <path d="M 0 10 L 50 10 L 50 30 L 100 30 L 100 50 L 150 50 L 150 30 L 200 30 L 200 50 L 250 50 L 250 30 L 300 30 L 300 10 L 350 10 L 350 30 L 400 30 L 400 50 L 450 50 L 450 30 L 500 30 L 500 10 L 550 10 L 550 30 L 600 30 L 600 10 L 650 10 L 650 30 L 700 30 L 700 10 L 750 10 L 750 30 L 800 30" fill="none" stroke="#10b981" stroke-width="2.5" />
              </svg>
            </div>
          </div>

          <!-- 3. 曼彻斯特编码 (Manchester) -->
          <div class="wave-row highlight-row">
            <div class="wave-meta">
              <span class="w-name">曼彻斯特编码 (Manchester)</span>
              <span class="w-sub">以太网标准 (10BASE-T)</span>
              <span class="w-tip">⭐️ <strong>中心跳变既做时钟又做数据</strong>（1=高到低，0=低到高）。波特率是比特率 2 倍，编码效率 50%</span>
            </div>
            <div class="wave-svg-box">
              <svg viewBox="0 0 800 60" class="wave-svg">
                <line v-for="g in 9" :key="g" :x1="(g-1)*100" y1="0" :x2="(g-1)*100" y2="60" stroke="var(--vp-c-divider)" stroke-dasharray="3,3" />
                <!-- 1: 高->低(10->50); 0: 低->高(50->10) -->
                <!-- b0=1(0..100): 10->50 -->
                <!-- b1=0(100..200): 50->10 (no step at 100) -->
                <!-- b2=0(200..300): 50->10 (step at 200: 10->50) -->
                <!-- b3=1(300..400): 10->50 (step at 300: 10->10) -->
                <!-- b4=0(400..500): 50->10 (no step at 400) -->
                <!-- b5=1(500..600): 10->50 (step at 500: 10->10) -->
                <!-- b6=1(600..700): 10->50 (step at 600: 50->10) -->
                <!-- b7=1(700..800): 10->50 (step at 700: 50->10) -->
                <path d="M 0 10 L 50 10 L 50 50 L 150 50 L 150 10 L 200 10 L 200 50 L 250 50 L 250 10 L 300 10 L 350 10 L 350 50 L 450 50 L 450 10 L 500 10 L 550 10 L 550 50 L 600 50 L 600 10 L 650 10 L 650 50 L 700 50 L 700 10 L 750 10 L 750 50 L 800 50" fill="none" stroke="#ef4444" stroke-width="2.5" />
                <!-- 箭头标注时钟与数据 -->
                <text x="50" y="32" font-size="10" fill="#ef4444" text-anchor="middle">↓(1)</text>
                <text x="150" y="32" font-size="10" fill="#ef4444" text-anchor="middle">↑(0)</text>
                <text x="250" y="32" font-size="10" fill="#ef4444" text-anchor="middle">↑(0)</text>
                <text x="350" y="32" font-size="10" fill="#ef4444" text-anchor="middle">↓(1)</text>
                <text x="450" y="32" font-size="10" fill="#ef4444" text-anchor="middle">↑(0)</text>
                <text x="550" y="32" font-size="10" fill="#ef4444" text-anchor="middle">↓(1)</text>
                <text x="650" y="32" font-size="10" fill="#ef4444" text-anchor="middle">↓(1)</text>
                <text x="750" y="32" font-size="10" fill="#ef4444" text-anchor="middle">↓(1)</text>
              </svg>
            </div>
          </div>

          <!-- 4. 差分曼彻斯特编码 (Differential Manchester) -->
          <div class="wave-row highlight-row">
            <div class="wave-meta">
              <span class="w-name">差分曼彻斯特编码 (Differential Manchester)</span>
              <span class="w-sub">抗干扰能力强 · 更适合高速传输</span>
              <span class="w-tip">⭐️ <strong>中心跳变仅做时钟；边界有跳变表示 0，无跳变表示 1</strong></span>
            </div>
            <div class="wave-svg-box">
              <svg viewBox="0 0 800 60" class="wave-svg">
                <line v-for="g in 9" :key="g" :x1="(g-1)*100" y1="0" :x2="(g-1)*100" y2="60" stroke="var(--vp-c-divider)" stroke-dasharray="3,3" />
                <path d="M 0 10 L 50 10 L 50 50 L 100 50 L 100 10 L 150 10 L 150 50 L 200 50 L 200 10 L 250 10 L 250 50 L 350 50 L 350 10 L 400 10 L 400 50 L 450 50 L 450 10 L 550 10 L 550 50 L 650 50 L 650 10 L 750 10 L 750 50 L 800 50" fill="none" stroke="#8b5cf6" stroke-width="2.5" />
                <text x="100" y="56" font-size="9.5" fill="#8b5cf6" text-anchor="middle">边界跳变(0)</text>
                <text x="200" y="56" font-size="9.5" fill="#8b5cf6" text-anchor="middle">边界跳变(0)</text>
                <text x="300" y="56" font-size="9.5" fill="#8b5cf6" text-anchor="middle">无跳变(1)</text>
                <text x="400" y="56" font-size="9.5" fill="#8b5cf6" text-anchor="middle">边界跳变(0)</text>
                <text x="500" y="56" font-size="9.5" fill="#8b5cf6" text-anchor="middle">无跳变(1)</text>
                <text x="600" y="56" font-size="9.5" fill="#8b5cf6" text-anchor="middle">无跳变(1)</text>
                <text x="700" y="56" font-size="9.5" fill="#8b5cf6" text-anchor="middle">无跳变(1)</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视图 3：基本载波调制方式 (2ASK / 2FSK / 2PSK) -->
    <div class="em-view" v-if="currentTab === 'modulation'">
      <div class="mod-panel">
        <div class="bit-banner">
          <span class="bit-label">数字基带信号比特序列:</span>
          <div class="bit-cells">
            <span class="b-cell mod-cell" v-for="(b, i) in modBits" :key="i">{{ b }}</span>
          </div>
        </div>

        <div class="mod-methods-grid">
          <!-- 调幅 2ASK -->
          <div class="mod-method-card">
            <div class="m-card-header">
              <span class="m-type-badge">调幅 (AM / 2ASK)</span>
              <span class="m-key">改变载波振幅</span>
            </div>
            <p class="m-explain">有载波输出表示 <strong>1</strong>，无载波输出表示 <strong>0</strong>（或用两种不同振幅表示 0 和 1）。抗干扰能力最弱。</p>
            <div class="carrier-wave-box">
              <svg viewBox="0 0 500 50" class="carrier-svg">
                <!-- 0 (无), 1 (正弦), 0 (无), 0 (无), 1 (正弦) -->
                <line x1="0" y1="25" x2="100" y2="25" stroke="#0284c7" stroke-width="2" />
                <path d="M 100 25 Q 112.5 0 125 25 T 150 25 T 175 25 T 200 25" fill="none" stroke="#0284c7" stroke-width="2" />
                <line x1="200" y1="25" x2="400" y2="25" stroke="#0284c7" stroke-width="2" />
                <path d="M 400 25 Q 412.5 0 425 25 T 450 25 T 475 25 T 500 25" fill="none" stroke="#0284c7" stroke-width="2" />
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
              <svg viewBox="0 0 500 50" class="carrier-svg">
                <!-- 0 (稀疏: 1周期/100px), 1 (密集: 2周期/100px), 0, 0, 1 -->
                <path d="M 0 25 Q 25 0 50 25 T 100 25 Q 112.5 0 125 25 T 150 25 T 175 25 T 200 25 Q 225 0 250 25 T 300 25 Q 325 0 350 25 T 400 25 Q 412.5 0 425 25 T 450 25 T 475 25 T 500 25" fill="none" stroke="#10b981" stroke-width="2" />
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
              <svg viewBox="0 0 500 50" class="carrier-svg">
                <!-- 0 (0°), 1 (180°), 0 (0°), 0 (0°), 1 (180°) -->
                <path d="M 0 25 Q 25 0 50 25 T 100 25 Q 125 50 150 25 T 200 25 Q 225 0 250 25 T 300 25 Q 325 0 350 25 T 400 25 Q 425 50 450 25 T 500 25" fill="none" stroke="#f59e0b" stroke-width="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视图 4：正交振幅调制 QAM-16 与格雷码 -->
    <div class="em-view" v-if="currentTab === 'qam'">
      <div class="qam-layout">
        <!-- 左侧特征要点 -->
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
              <span><strong>信息承载量</strong>：每个码元携带 <strong>4 个比特</strong>（因为 $16 = 2^4 \implies \log_2 16 = 4\text{ bit}$）。</span>
            </div>
            <div class="q-item">
              <span class="q-bullet">🔹</span>
              <span><strong>格雷码 (Gray Code) 映射</strong>：任意两个<strong>相邻码元之间仅有 1 个比特不同</strong>。当信道受噪声干扰误判为相邻码元时，仅产生 1 bit 错误，极大降低误码率！</span>
            </div>
          </div>
        </div>

        <!-- 右侧 QAM-16 星座图渲染 -->
        <div class="qam-chart-box">
          <div class="qam-grid-wrapper">
            <svg viewBox="-180 -180 360 360" class="qam-svg">
              <!-- 坐标轴 -->
              <line x1="-160" y1="0" x2="160" y2="0" stroke="var(--vp-c-text-3)" stroke-width="1.5" marker-end="url(#arrow)" />
              <line x1="0" y1="160" x2="0" y2="-160" stroke="var(--vp-c-text-3)" stroke-width="1.5" />
              
              <!-- 同心圆参考线 (不同振幅) -->
              <circle cx="0" cy="0" r="60" fill="none" stroke="var(--vp-c-divider)" stroke-dasharray="3,3" />
              <circle cx="0" cy="0" r="120" fill="none" stroke="var(--vp-c-divider)" stroke-dasharray="3,3" />

              <!-- 16 个星座点 (4x4 格雷码布局) -->
              <!-- 第一象限 -->
              <g class="const-point" transform="translate(45, -45)"><circle r="4.5" fill="#ef4444"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">1101</text></g>
              <g class="const-point" transform="translate(120, -45)"><circle r="4.5" fill="#ef4444"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">1001</text></g>
              <g class="const-point" transform="translate(45, -120)"><circle r="4.5" fill="#ef4444"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">1100</text></g>
              <g class="const-point" transform="translate(120, -120)"><circle r="4.5" fill="#ef4444"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">1000</text></g>

              <!-- 第二象限 -->
              <g class="const-point" transform="translate(-45, -45)"><circle r="4.5" fill="#0284c7"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0101</text></g>
              <g class="const-point" transform="translate(-120, -45)"><circle r="4.5" fill="#0284c7"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0001</text></g>
              <g class="const-point" transform="translate(-45, -120)"><circle r="4.5" fill="#0284c7"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0100</text></g>
              <g class="const-point" transform="translate(-120, -120)"><circle r="4.5" fill="#0284c7"/><text y="-8" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0000</text></g>

              <!-- 第三象限 -->
              <g class="const-point" transform="translate(-45, 45)"><circle r="4.5" fill="#10b981"/><text y="16" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0111</text></g>
              <g class="const-point" transform="translate(-120, 45)"><circle r="4.5" fill="#10b981"/><text y="16" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0011</text></g>
              <g class="const-point" transform="translate(-45, 120)"><circle r="4.5" fill="#10b981"/><text y="16" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0110</text></g>
              <g class="const-point" transform="translate(-120, 120)"><circle r="4.5" fill="#10b981"/><text y="16" font-size="9" font-weight="700" fill="var(--vp-c-text-1)" text-anchor="middle">0010</text></g>

              <!-- 第四象限 -->
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

const currentTab = ref('flow')
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

/* 4大通路层次结构 */
.flow-nodes-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.flow-node {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  flex-shrink: 0;
}

.flow-node.highlight {
  border-color: #0284c7;
  background: rgba(2, 132, 199, 0.08);
}

.node-icon {
  font-size: 18px;
}

.node-info {
  display: flex;
  flex-direction: column;
}

.node-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.node-desc {
  font-size: 10px;
  color: var(--vp-c-text-3);
}

.flow-arrow {
  font-size: 10px;
  font-weight: 700;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  flex-shrink: 0;
}

/* 2x2 转换卡片 */
.conversion-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 768px) {
  .conversion-grid {
    grid-template-columns: 1fr;
  }
}

.conv-card {
  padding: 14px 16px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  transition: all 0.2s ease;
}

.conv-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.c-tag {
  font-size: 12px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.c-tech {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.c-desc {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0 0 8px 0;
}

.c-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ex-pill {
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

/* 波形面板 */
.bit-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin-bottom: 14px;
  border: 1px solid var(--vp-c-divider);
}

.bit-label {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.bit-cells {
  display: flex;
  gap: 6px;
}

.b-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 800;
  font-family: var(--vp-font-family-mono);
}

.mod-cell {
  width: 40px;
}

.wave-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.wave-row {
  padding: 12px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
}

.highlight-row {
  border-left: 3px solid #ef4444;
}

.wave-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.w-name {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.w-sub {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.w-tip {
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.wave-svg-box {
  width: 100%;
  overflow-x: auto;
  background: var(--vp-c-bg);
  border-radius: 6px;
  padding: 4px;
}

.wave-svg {
  width: 100%;
  min-width: 600px;
  height: 60px;
}

/* 载波调制卡片 */
.mod-methods-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  padding: 6px;
}

.carrier-svg {
  width: 100%;
  height: 40px;
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
