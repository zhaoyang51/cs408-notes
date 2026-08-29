<template>
  <div class="metrics-container">
    <div class="metrics-header">
      <div class="header-left">
        <span class="m-tag">📊 性能指标全景</span>
        <h3 class="m-title">计算机网络 8 大性能指标全景图解</h3>
      </div>
      <div class="header-right">
        <span class="m-sub">💡 点击左侧指标切换查看核心定义与计算公式</span>
      </div>
    </div>

    <div class="metrics-body">
      <!-- 左侧指标切换栏 (还原讲义侧栏交互) -->
      <div class="metrics-sidebar">
        <button 
          v-for="(item, idx) in metricsList" 
          :key="item.key"
          class="sidebar-tab-btn"
          :class="{ active: currentKey === item.key }"
          @click="currentKey = item.key"
        >
          <span class="tab-index">{{ idx + 1 }}</span>
          <span class="tab-label">{{ item.name }}</span>
        </button>
      </div>

      <!-- 右侧详细卡片展示 -->
      <div class="metrics-content">
        <div class="content-card">
          <div class="card-title-row">
            <span class="card-badge">{{ currentMetric.enName }}</span>
            <h4 class="card-title">{{ currentMetric.name }}</h4>
          </div>

          <div class="card-items-list">
            <div 
              v-for="(point, i) in currentMetric.points" 
              :key="i"
              class="point-row"
            >
              <span class="point-box-icon">▫️</span>
              <div class="point-text" v-html="point"></div>
            </div>
          </div>

          <!-- 公式与计算卡片 (如果有) -->
          <div class="formula-box" v-if="currentMetric.formulas && currentMetric.formulas.length">
            <div class="f-title">📐 核心计算公式：</div>
            <div class="f-grid">
              <div 
                v-for="(f, fi) in currentMetric.formulas" 
                :key="fi"
                class="f-item"
              >
                <div class="f-name">{{ f.label }}</div>
                <div class="f-eq">{{ f.equation }}</div>
                <div class="f-note" v-if="f.note">{{ f.note }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentKey = ref('delay')

const metricsList = [
  {
    key: 'speed',
    name: '速率',
    enName: 'Speed / Data Rate',
    points: [
      '连接在计算机网络上的主机在数字信道上传送比特的速率，也称为<strong>比特率</strong>或<strong>数据率</strong>。',
      '<strong>基本单位</strong>：bit/s (b/s, bps)；<strong>常用单位</strong>：kb/s (10³), Mb/s (10⁶), Gb/s (10⁹), Tb/s (10¹²)。',
      '⚠️ <strong>408 核心辨析</strong>：速率单位采用<strong>十进制（10的幂）</strong>，而存储容量单位采用<strong>二进制（2的幂：1KB = 1024B）</strong>。'
    ]
  },
  {
    key: 'bandwidth',
    name: '带宽',
    enName: 'Bandwidth',
    points: [
      '用来表示网络的<strong>通信线路所能传送数据的能力</strong>。',
      '网络带宽表示在单位时间内从网络中的某一点到另一点所能通过的<strong>“最高数据率（理论极限值）”</strong>。',
      '<strong>单位</strong>：与速率单位相同（bit/s、Mb/s、Gb/s 等）。'
    ]
  },
  {
    key: 'throughput',
    name: '吞吐量',
    enName: 'Throughput',
    points: [
      '吞吐量表示在单位时间内通过某个网络（或信道、接口）的<strong>实际数据量</strong>。',
      '经常用于对现实世界中网络的实际性能测量，以便获知实际有多少数据量能通过网络。',
      '<strong>限制因素</strong>：吞吐量受网络实际带宽、额定速率以及中间路由器排队拥塞的严格限制。'
    ]
  },
  {
    key: 'delay',
    name: '时延',
    enName: 'Delay / Latency',
    points: [
      '数据（一个报文或分组，甚至比特）从网络（或链路）的一端传送到另一端所需的时间。',
      '<strong>总时延构成</strong>：总时延 = 发送时延 + 传播时延 + 处理时延 + 排队时延。'
    ],
    formulas: [
      {
        label: '发送时延 (传输时延)',
        equation: '发送时延 = 分组长度 (bit) ÷ 发送速率 (b/s)',
        note: '发生在主机/路由器的网络适配器内部，由数据帧长度和网卡速率决定'
      },
      {
        label: '传播时延',
        equation: '传播时延 = 信道物理长度 (m) ÷ 电磁波传播速率 (m/s)',
        note: '发生在物理信道介质中（光纤/铜线中电磁波速率约为 2.0 × 10⁸ m/s）'
      },
      {
        label: '处理时延与排队时延',
        equation: '处理时延: 检错/查表 | 排队时延: 结点队列等待',
        note: '处理时延一般不便于公式计算；排队时延取决于网络当时的负载和拥塞状况'
      }
    ]
  },
  {
    key: 'dbp',
    name: '时延带宽积',
    enName: 'Delay-Bandwidth Product (DBP)',
    points: [
      '<strong>传播时延和信道带宽的乘积</strong>：<code>时延带宽积 = 传播时延 × 信道带宽</code>。',
      '<strong>物理意义</strong>：若发送端连续发送数据，则在所发送的<strong>第一个比特即将到达终点时，发送端就已经发送了“时延带宽积”个比特</strong>。',
      '<strong>形象比喻</strong>：链路的时延带宽积又称为<strong>“以比特为单位的链路长度（管道容积）”</strong>。'
    ],
    formulas: [
      {
        label: '时延带宽积计算公式',
        equation: '时延带宽积 (bit) = 传播时延 (s) × 信道带宽 (bit/s)',
        note: '只有在时延带宽积填满后，链路的带宽资源才被充分利用'
      }
    ]
  },
  {
    key: 'rtt',
    name: '往返时间',
    enName: 'Round-Trip Time (RTT)',
    points: [
      '在许多情况下，因特网上的信息不仅单向传输，而是<strong>双向交互</strong>。',
      '<strong>定义</strong>：从发送端发送数据开始，到发送端<strong>收到接收端的确认</strong>（例如收到 ACK）所经历的时间。',
      '<strong>组成</strong>：包含往返传播时延、末端处理时延以及排队时延。'
    ]
  },
  {
    key: 'utilization',
    name: '利用率',
    enName: 'Utilization',
    points: [
      '<strong>信道利用率</strong>：表示某信道有百分之几的时间是被利用的（有数据通过）。',
      '<strong>网络利用率</strong>：全网络所有信道利用率的加权平均值。',
      '根据<strong>排队论（M/M/1 队列模型）</strong>，当网络利用率升高时，排队时延会呈<strong>非线性指数级剧增</strong>。',
      '⚠️ <strong>利用率并非越高越好</strong>：当某信道的利用率接近 1 时，该信道引起的时延会趋向无穷大；但也不能使信道利用率太低，这会使宝贵的通信资源被白白浪费。'
    ],
    formulas: [
      {
        label: 'M/M/1 排队论网络时延模型公式',
        equation: 'D = D₀ / (1 - U)',
        note: 'D: 当前网络状态下的总时延 ｜ D₀: 网络空闲（无排队、利用率接近 0）时的基础时延 ｜ U: 网络利用率 (0 ≤ U < 1)'
      }
    ]
  },
  {
    key: 'loss',
    name: '丢包率',
    enName: 'Packet Loss Rate',
    points: [
      '即分组丢失率，是指在一定时间范围内，传输过程中<strong>丢失的分组数量与总发送分组数量的比率</strong>。',
      '<strong>两大核心丢包原因</strong>：',
      '① <strong>分组误码</strong>：物理传输介质受干扰出现比特差错，校验失败被直接丢弃；',
      '② <strong>结点交换机缓存队列满</strong>：网络发生拥塞，路由器输入/输出缓存队列溢出导致主动丢包。'
    ]
  }
]

const currentMetric = computed(() => {
  return metricsList.find(m => m.key === currentKey.value) || metricsList[0]
})
</script>

<style scoped>
.metrics-container {
  margin: 24px 0;
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: all 0.25s ease;
}

.metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
  gap: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.m-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.m-title {
  margin: 0;
  font-size: 15.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.m-sub {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
}

.metrics-body {
  display: grid;
  grid-template-columns: 160px 1fr;
  min-height: 280px;
}

@media (max-width: 640px) {
  .metrics-body {
    grid-template-columns: 1fr;
  }
  .metrics-sidebar {
    display: flex;
    overflow-x: auto;
    border-right: none !important;
    border-bottom: 1px solid var(--vp-c-divider);
  }
  .sidebar-tab-btn {
    white-space: nowrap;
    border-left: none !important;
    border-bottom: 3px solid transparent;
  }
  .sidebar-tab-btn.active {
    border-bottom-color: #ef4444 !important;
    border-left: none !important;
  }
}

.metrics-sidebar {
  background: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  padding: 6px 0;
}

.sidebar-tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.sidebar-tab-btn:hover {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.sidebar-tab-btn.active {
  background: var(--vp-c-bg-elv);
  color: #ef4444;
  border-left-color: #ef4444;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tab-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-bg-alt);
  font-size: 10.5px;
  font-weight: 800;
  color: var(--vp-c-text-3);
}

.sidebar-tab-btn.active .tab-index {
  background: #ef4444;
  color: #ffffff;
}

.metrics-content {
  padding: 18px 22px;
  background: var(--vp-c-bg);
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.card-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
}

.card-title {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.card-items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.point-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  line-height: 1.65;
  color: var(--vp-c-text-1);
}

.point-box-icon {
  color: #ef4444;
  font-size: 13px;
  flex-shrink: 0;
  margin-top: 2px;
}

.point-text :deep(strong) {
  color: #ef4444;
  font-weight: 700;
}

.point-text :deep(code) {
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: var(--vp-c-brand-1);
}

/* 核心公式卡片 */
.formula-box {
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.f-title {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.f-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.f-item {
  padding: 8px 12px;
  background: var(--vp-c-bg-elv);
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.f-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.f-eq {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
}

.f-note {
  font-size: 11px;
  color: var(--vp-c-text-3);
}
</style>
