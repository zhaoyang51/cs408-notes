<template>
  <div class="simulator-card">
    <div class="sim-header">
      <div class="sim-title-box">
        <span class="sim-badge">🎮 交互式动画模拟器</span>
        <h3 class="sim-title">中断处理 10 步执行全景动态仿真</h3>
      </div>
      <div class="sim-controls">
        <button class="sim-btn" @click="prevStep" :disabled="currentStep === 0" title="上一步">
          ◀ 上一步
        </button>
        <button class="sim-btn play-btn" @click="toggleAutoPlay">
          {{ isPlaying ? '⏸ 暂停' : '▶ 自动播放' }}
        </button>
        <button class="sim-btn" @click="nextStep" :disabled="currentStep === steps.length - 1" title="下一步">
          下一步 ▶
        </button>
        <button class="sim-btn reset-btn" @click="reset" title="重置回到起点">
          ↺ 重置
        </button>
      </div>
    </div>

    <!-- 步骤时间轴导航 -->
    <div class="timeline-bar">
      <div 
        v-for="(st, idx) in steps" 
        :key="idx"
        class="timeline-node"
        :class="{
          'is-active': currentStep === idx,
          'is-passed': currentStep > idx,
          'is-hardware': idx < 3,
          'is-software': idx >= 3
        }"
        @click="goToStep(idx)"
        :title="`第 ${idx+1} 步: ${st.shortTitle}`"
      >
        <div class="node-circle">{{ idx + 1 }}</div>
        <span class="node-label">{{ st.shortTitle }}</span>
      </div>
    </div>

    <!-- 核心仿真演示区 -->
    <div class="sim-dashboard">
      <!-- 左侧：当前执行微指令与考点精析 -->
      <div class="sim-step-detail" :class="currentStep < 3 ? 'detail-hw' : 'detail-sw'">
        <div class="step-meta">
          <span class="stage-tag" :class="currentStep < 3 ? 'hw-tag' : 'sw-tag'">
            {{ currentStep < 3 ? '⚡ 硬件阶段（中断隐指令）' : '💻 软件阶段（中断服务程序）' }}
          </span>
          <span class="step-counter">步骤 {{ currentStep + 1 }} / {{ steps.length }}</span>
        </div>
        
        <h4 class="step-name">{{ steps[currentStep].title }}</h4>
        <p class="step-desc">{{ steps[currentStep].desc }}</p>
        
        <div class="exam-trap-box">
          <span class="trap-icon">🎯 408 命题核心眼：</span>
          <span class="trap-text">{{ steps[currentStep].examPoint }}</span>
        </div>
      </div>

      <!-- 右侧：硬件/CPU/内核栈实时状态可视化 -->
      <div class="sim-system-state">
        <div class="state-header">
          <span>🖥️ CPU 与系统内核状态机实时拓扑</span>
          <span class="mode-pill" :class="state.cpuMode === '内核态 (Kernel)' ? 'mode-kernel' : 'mode-user'">
            {{ state.cpuMode }}
          </span>
        </div>

        <div class="state-grid">
          <!-- 中断允许位 IF -->
          <div class="state-item">
            <span class="state-label">中断允许标志 (IF)</span>
            <span class="state-val" :class="state.ifFlag ? 'val-on' : 'val-off'">
              {{ state.ifFlag ? '🟢 1 (开中断)' : '🔴 0 (关中断)' }}
            </span>
          </div>

          <!-- PC 程序计数器 -->
          <div class="state-item">
            <span class="state-label">PC 程序计数器</span>
            <span class="state-val mono">{{ state.pc }}</span>
          </div>

          <!-- 栈顶 (SP) -->
          <div class="state-item">
            <span class="state-label">内核栈压入内容</span>
            <span class="state-val stack-val mono">{{ state.stackContent || '(空栈)' }}</span>
          </div>

          <!-- 通用寄存器状态 -->
          <div class="state-item">
            <span class="state-label">通用寄存器 (R0-R3)</span>
            <span class="state-val" :class="state.regSaved ? 'val-saved' : 'val-normal'">
              {{ state.regSaved ? '🔒 已压栈保护' : '⚡ 正常运行中' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const currentStep = ref(0)
const isPlaying = ref(false)
let timer = null

const steps = [
  {
    shortTitle: '关中断',
    title: '① 关中断 (硬件自动执行)',
    desc: 'CPU 内部硬件逻辑将中断允许触发器 (IF) 清零，暂时禁止响应新的可屏蔽外部中断请求。',
    examPoint: '保证断点信息（PC、PSW）在压栈保存过程中绝对不会被打断造成数据破坏。',
    cpuMode: '用户态 → 内核态',
    ifFlag: false,
    pc: '0x0040_1000 (原断点)',
    stackContent: '(准备压栈)',
    regSaved: false
  },
  {
    shortTitle: '保存断点',
    title: '② 保存断点与程序状态 (硬件自动压栈)',
    desc: '硬件将当前程序计数器 (PC) 和程序状态字寄存器 (PSW) 压入系统内核栈中保存。',
    examPoint: '408 高频坑：断点 PC/PSW 是由硬件隐指令自动压栈，绝不是软件指令 push！',
    cpuMode: '内核态 (Kernel)',
    ifFlag: false,
    pc: '0x0040_1000 (原断点)',
    stackContent: '[Top: PSW, PC (0x0040_1000)]',
    regSaved: false
  },
  {
    shortTitle: '引出向量',
    title: '③ 寻找入口地址 (引出中断向量)',
    desc: '硬件根据设备送来的中断向量号，查询中断向量表，取出对应中断服务程序 (ISR) 的入口地址赋给 PC。',
    examPoint: '中断向量是 ISR 入口地址；向量地址是存放该入口地址的内存单元地址。',
    cpuMode: '内核态 (Kernel)',
    ifFlag: false,
    pc: '0xFFFF_8020 (ISR入口地址)',
    stackContent: '[Top: PSW, PC (0x0040_1000)]',
    regSaved: false
  },
  {
    shortTitle: '保护现场',
    title: '④ 保护现场 (软件代码执行)',
    desc: '进入 ISR 第一步，由操作系统软件指令将 ISR 需要使用的通用寄存器内容及原中断屏蔽字压入内核栈。',
    examPoint: '通用寄存器由软件指令保存（不同 ISR 需用寄存器不同，由软件按需保存效率最高）。',
    cpuMode: '内核态 (Kernel)',
    ifFlag: false,
    pc: '0xFFFF_8028 (保护现场指令)',
    stackContent: '[Top: R0..R3, 屏蔽字 | PSW, PC]',
    regSaved: true
  },
  {
    shortTitle: '开中断',
    title: '⑤ 设置新屏蔽字并开中断 (软件开启嵌套)',
    desc: '修改中断屏蔽字后执行开中断指令 (sti)，允许优先级更高的外部中断抢占当前服务程序，实现多重中断。',
    examPoint: '单重中断无需此步（全程关中断）；多重中断必须在服务前提前开中断支持嵌套。',
    cpuMode: '内核态 (Kernel)',
    ifFlag: true,
    pc: '0xFFFF_8034 (开中断完毕)',
    stackContent: '[Top: R0..R3, 屏蔽字 | PSW, PC]',
    regSaved: true
  },
  {
    shortTitle: '执行服务',
    title: '⑥ 执行中断服务程序核心例程 (处理具体业务)',
    desc: 'CPU 执行具体设备的 I/O 传输、磁盘数据读写、定时器时钟节拍更新或系统异常处理业务。',
    examPoint: '此时若发生更高级别中断，CPU 会产生嵌套中断；同级或低级中断则被屏蔽字挡住。',
    cpuMode: '内核态 (Kernel)',
    ifFlag: true,
    pc: '0xFFFF_80A0 (处理设备I/O数据)',
    stackContent: '[Top: R0..R3, 屏蔽字 | PSW, PC]',
    regSaved: true
  },
  {
    shortTitle: '关中断',
    title: '⑦ 关中断 (软件准备恢复现场)',
    desc: '业务处理完毕，在恢复通用寄存器现场之前再次关中断 (cli)，防止恢复过程中寄存器值被篡改。',
    examPoint: '恢复现场期间必须保证原子性与一致性，禁止任何中断抢占插队。',
    cpuMode: '内核态 (Kernel)',
    ifFlag: false,
    pc: '0xFFFF_80E0 (关中断)',
    stackContent: '[Top: R0..R3, 屏蔽字 | PSW, PC]',
    regSaved: true
  },
  {
    shortTitle: '恢复现场',
    title: '⑧ 恢复现场 (软件出栈还原)',
    desc: '软件指令依次从内核栈中弹出通用寄存器原值和旧中断屏蔽字，使 CPU 寄存器状态完全复原。',
    examPoint: '出栈顺序与入栈顺序严格相反，恢复出原程序运行时的精确寄存器环境。',
    cpuMode: '内核态 (Kernel)',
    ifFlag: false,
    pc: '0xFFFF_80F0 (出栈还原完成)',
    stackContent: '[Top: PSW, PC (0x0040_1000)]',
    regSaved: false
  },
  {
    shortTitle: '开中断',
    title: '⑨ 开中断 (软件恢复中断响应)',
    desc: '重新开启中断响应能力，允许 CPU 恢复对外界事件的感知。',
    examPoint: '为原程序或下一个等待的中断恢复正常中断受理机制。',
    cpuMode: '内核态 (Kernel)',
    ifFlag: true,
    pc: '0xFFFF_80F8 (准备返回)',
    stackContent: '[Top: PSW, PC (0x0040_1000)]',
    regSaved: false
  },
  {
    shortTitle: '中断返回',
    title: '⑩ 中断返回 (执行 iret 特权指令)',
    desc: '执行 iret 中断返回指令，硬件自动从内核栈弹出原 PC 与 PSW，CPU 切换回用户态并回到断点继续执行原程序！',
    examPoint: 'iret 指令同时恢复断点地址 PC、程序状态字 PSW，并由内核态切换回用户态。',
    cpuMode: '用户态 (User Mode)',
    ifFlag: true,
    pc: '0x0040_1000 (成功返回原程序断点继续执行)',
    stackContent: '(栈已清空复原)',
    regSaved: false
  }
]

const state = computed(() => steps[currentStep.value])

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    stopAutoPlay()
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function goToStep(idx) {
  currentStep.value = idx
}

function reset() {
  stopAutoPlay()
  currentStep.value = 0
}

function toggleAutoPlay() {
  if (isPlaying.value) {
    stopAutoPlay()
  } else {
    isPlaying.value = true
    if (currentStep.value === steps.length - 1) {
      currentStep.value = 0
    }
    timer = setInterval(() => {
      if (currentStep.value < steps.length - 1) {
        currentStep.value++
      } else {
        stopAutoPlay()
      }
    }, 2200)
  }
}

function stopAutoPlay() {
  isPlaying.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.simulator-card {
  margin: 28px 0;
  padding: 20px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  box-shadow: var(--card-shadow);
  transition: all 0.25s ease;
}

.sim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.sim-title-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sim-badge {
  font-size: 12px;
  font-weight: 700;
  color: #3b82f6;
}

.sim-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0;
  border: none;
  padding: 0;
}

.sim-controls {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sim-btn {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sim-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
}

.sim-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.play-btn {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
  border-color: rgba(59, 130, 246, 0.35);
}

.dark .play-btn {
  color: #60a5fa;
}

.reset-btn {
  color: var(--vp-c-text-3);
}

/* 时间轴导航 */
.timeline-bar {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
  user-select: none;
}

.timeline-node:hover {
  transform: translateY(-2px);
}

.node-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.node-label {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  transition: color 0.25s ease;
}

.timeline-node.is-active .node-circle {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #ffffff;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.4);
  transform: scale(1.15);
}

.timeline-node.is-active .node-label {
  color: var(--vp-c-brand-1);
  font-weight: 800;
}

.timeline-node.is-passed .node-circle {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-2);
}

/* 仿真仪表盘 */
.sim-dashboard {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 16px;
}

.sim-step-detail {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.25s ease;
}

.detail-hw {
  background: rgba(59, 130, 246, 0.06);
  border-color: rgba(59, 130, 246, 0.35);
}

.detail-sw {
  background: rgba(16, 185, 129, 0.06);
  border-color: rgba(16, 185, 129, 0.35);
}

.step-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stage-tag {
  font-size: 12px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 9999px;
}

.hw-tag {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}

.dark .hw-tag {
  color: #60a5fa;
}

.sw-tag {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

.dark .sw-tag {
  color: #34d399;
}

.step-counter {
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-text-3);
}

.step-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0;
  border: none;
  padding: 0;
}

.step-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

.exam-trap-box {
  margin-top: auto;
  padding: 10px 12px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.trap-icon {
  font-weight: 800;
  color: #d97706;
}

.dark .trap-icon {
  color: #fbbf24;
}

/* 右侧系统状态区 */
.sim-system-state {
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.state-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 800;
  color: var(--vp-c-text-1);
}

.mode-pill {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 9999px;
}

.mode-kernel {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.mode-user {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.state-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.state-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 13px;
}

.state-label {
  color: var(--vp-c-text-2);
  font-weight: 600;
}

.state-val {
  font-weight: 700;
}

.val-on {
  color: #059669;
}

.val-off {
  color: #ef4444;
}

.val-saved {
  color: #8b5cf6;
}

.val-normal {
  color: var(--vp-c-text-3);
}

.mono {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}

.stack-val {
  color: #2563eb;
}

.dark .stack-val {
  color: #60a5fa;
}

@media (max-width: 800px) {
  .sim-dashboard {
    grid-template-columns: 1fr;
  }
  .timeline-bar {
    overflow-x: auto;
    display: flex;
    gap: 12px;
    padding-bottom: 8px;
  }
  .timeline-node {
    min-width: 48px;
  }
}
</style>
