<template>
  <div class="process-table-container">
    <div class="process-table-title" v-if="title">
      <span class="title-icon">📊</span>
      <span>{{ title }}</span>
    </div>

    <div class="process-table-wrapper">
      <table class="process-flow-table">
        <thead>
          <tr>
            <th class="col-stage">{{ stageHeader }}</th>
            <th class="col-steps">{{ stepHeader }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- 硬件阶段分组 -->
          <tr v-if="hasHardwareSteps">
            <td :rowspan="hardwareSteps.length" class="stage-cell stage-hardware">
              <div class="stage-badge-box">
                <span class="stage-icon">⚡</span>
                <span class="stage-main-text">{{ hardwareTitle }}</span>
                <span class="stage-sub-text" v-if="hardwareSubtitle">({{ hardwareSubtitle }})</span>
              </div>
            </td>
            <td class="step-cell step-hardware-row">
              <div class="step-content">
                <span class="step-num-badge hardware-badge">①</span>
                <span class="step-desc" v-html="hardwareSteps[0]"></span>
              </div>
            </td>
          </tr>
          <tr v-for="(step, idx) in hardwareSteps.slice(1)" :key="'hw-' + idx">
            <td class="step-cell step-hardware-row">
              <div class="step-content">
                <span class="step-num-badge hardware-badge">{{ getCircledNumber(idx + 2) }}</span>
                <span class="step-desc" v-html="step"></span>
              </div>
            </td>
          </tr>

          <!-- 软件阶段分组 -->
          <tr v-if="hasSoftwareSteps">
            <td :rowspan="softwareSteps.length" class="stage-cell stage-software">
              <div class="stage-badge-box">
                <span class="stage-icon">💻</span>
                <span class="stage-main-text">{{ softwareTitle }}</span>
                <span class="stage-sub-text" v-if="softwareSubtitle">({{ softwareSubtitle }})</span>
              </div>
            </td>
            <td class="step-cell step-software-row">
              <div class="step-content">
                <span class="step-num-badge software-badge">{{ getCircledNumber(hardwareSteps.length + 1) }}</span>
                <span class="step-desc" v-html="softwareSteps[0]"></span>
              </div>
            </td>
          </tr>
          <tr v-for="(step, idx) in softwareSteps.slice(1)" :key="'sw-' + idx">
            <td class="step-cell step-software-row">
              <div class="step-content">
                <span class="step-num-badge software-badge">{{ getCircledNumber(hardwareSteps.length + idx + 2) }}</span>
                <span class="step-desc" v-html="step"></span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '中断处理流程（10 个步骤）'
  },
  stageHeader: {
    type: String,
    default: '阶段'
  },
  stepHeader: {
    type: String,
    default: '处理步骤'
  },
  hardwareTitle: {
    type: String,
    default: '中断隐指令'
  },
  hardwareSubtitle: {
    type: String,
    default: '硬件自动'
  },
  softwareTitle: {
    type: String,
    default: '中断服务程序'
  },
  softwareSubtitle: {
    type: String,
    default: '软件执行'
  },
  hardwareList: {
    type: Array,
    default: () => [
      '<strong>关中断</strong> (硬件关闭可屏蔽外中断，保护断点不被打扰)',
      '<strong>保存 PC、PSW (断点)</strong> (硬件将原 PC、PSW 压入系统内核栈)',
      '<strong>引出中断向量 (找到服务程序入口)</strong> (硬件根据中断号查向量表获取 ISR 入口地址)'
    ]
  },
  softwareList: {
    type: Array,
    default: () => [
      '<strong>保护现场</strong> (软件指令将通用寄存器与旧屏蔽字压栈)',
      '<strong>开中断</strong> (允许更高级别中断抢占嵌套)',
      '<strong>执行中断服务程序</strong> (处理具体 I/O 或异常核心业务)',
      '<strong>关中断</strong> (恢复现场过程中禁止被打扰)',
      '<strong>恢复现场</strong> (恢复通用寄存器与旧屏蔽字)',
      '<strong>开中断</strong> (准备恢复正常中断响应)',
      '<strong>中断返回</strong> (执行 <code>iret</code> 特权指令，恢复断点 PC、PSW 并返回原程序)'
    ]
  }
})

const hardwareSteps = computed(() => props.hardwareList || [])
const softwareSteps = computed(() => props.softwareList || [])
const hasHardwareSteps = computed(() => hardwareSteps.value.length > 0)
const hasSoftwareSteps = computed(() => softwareSteps.value.length > 0)

const CIRCLED_NUMBERS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳']

function getCircledNumber(n) {
  if (n >= 1 && n <= 20) return CIRCLED_NUMBERS[n - 1]
  return `(${n})`
}
</script>

<style scoped>
.process-table-container {
  margin: 24px 0;
  padding: 16px 20px 20px 20px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  transition: all 0.25s ease;
}

.process-table-title {
  text-align: center;
  font-size: 17px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.02em;
}

.process-table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
}

.process-flow-table {
  width: 100%;
  border-collapse: separate !important;
  border-spacing: 0 !important;
  border: 2px solid #3b82f6 !important;
  border-radius: 8px !important;
  margin: 0 !important;
  font-size: 14.5px;
  box-shadow: none !important;
  overflow: hidden;
}

.process-flow-table th {
  background: var(--vp-c-bg-soft) !important;
  color: var(--vp-c-text-1) !important;
  font-weight: 800 !important;
  text-align: center !important;
  padding: 10px 14px !important;
  border-bottom: 2px solid #3b82f6 !important;
  border-right: 1px solid var(--vp-c-divider) !important;
  letter-spacing: 0.03em;
}

.process-flow-table th:last-child {
  border-right: none !important;
}

.col-stage {
  width: 28%;
  min-width: 130px;
}

.col-steps {
  width: 72%;
}

.stage-cell {
  text-align: center !important;
  vertical-align: middle !important;
  padding: 16px 12px !important;
  border-right: 2px solid #3b82f6 !important;
  border-bottom: 1px solid var(--vp-c-divider) !important;
  font-weight: 700;
}

.stage-badge-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.stage-icon {
  font-size: 20px;
  line-height: 1;
}

.stage-main-text {
  font-size: 15.5px;
  font-weight: 800;
  line-height: 1.3;
}

.stage-sub-text {
  font-size: 12px;
  opacity: 0.85;
  font-weight: 600;
}

/* 硬件阶段风格 (科技蓝/蓝紫) */
.stage-hardware {
  background: rgba(59, 130, 246, 0.12) !important;
  color: #1d4ed8 !important;
  border-bottom: 2px solid #3b82f6 !important;
}

.dark .stage-hardware {
  background: rgba(59, 130, 246, 0.22) !important;
  color: #93c5fd !important;
}

html.parchment .stage-hardware {
  background: #e0f2fe !important;
  color: #0369a1 !important;
}

/* 软件阶段风格 (翡翠绿/薄荷绿) */
.stage-software {
  background: rgba(16, 185, 129, 0.12) !important;
  color: #047857 !important;
  border-bottom: none !important;
}

.dark .stage-software {
  background: rgba(16, 185, 129, 0.2) !important;
  color: #6ee7b7 !important;
}

html.parchment .stage-software {
  background: #dcfce7 !important;
  color: #15803d !important;
}

/* 步骤内容单元格 */
.step-cell {
  padding: 9px 14px !important;
  border-bottom: 1px solid var(--vp-c-divider) !important;
  background: var(--vp-c-bg) !important;
  color: var(--vp-c-text-1) !important;
  vertical-align: middle !important;
  transition: background 0.15s ease;
}

.process-flow-table tbody tr:hover .step-cell {
  background: var(--vp-c-bg-soft) !important;
}

.step-content {
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.5;
}

.step-num-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
  flex-shrink: 0;
}

.hardware-badge {
  color: #2563eb;
}

.dark .hardware-badge {
  color: #60a5fa;
}

.software-badge {
  color: #059669;
}

.dark .software-badge {
  color: #34d399;
}

.step-desc {
  font-size: 14.5px;
  color: var(--vp-c-text-1);
}

.step-desc code {
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-code-bg);
  color: var(--vp-code-color);
}

@media (max-width: 640px) {
  .process-table-container {
    padding: 12px;
    margin: 16px 0;
  }
  .stage-main-text {
    font-size: 13.5px;
  }
  .step-desc {
    font-size: 13.5px;
  }
}
</style>
