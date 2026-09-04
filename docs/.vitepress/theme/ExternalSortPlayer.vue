<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

type ModeKey = 'loser-tree' | 'replacement-selection'

interface LoserTreeStep {
  title: string
  desc: string
  examTip?: string
  // 各归并段队列剩余元素
  runs: number[][]
  // 叶子节点当前元素 b[0..3]
  leaves: (number | null)[]
  // 败者树内部节点 ls[1..3], ls[0]是全局胜者段号
  ls: number[]
  // 高亮或正在比较的节点/叶子
  activeLeaf?: number
  activeNode?: number
  comparingWith?: number
  // 输出区已经输出的元素
  output: number[]
  phase: 'idle' | 'output' | 'fetch' | 'compare' | 'win'
}

interface ReplacementStep {
  title: string
  desc: string
  examTip?: string
  // 工作区4个槽位，每个槽位 { val: number, frozen: boolean, isMin?: boolean, isNew?: boolean }
  wa: { val: number; frozen: boolean; isMin?: boolean; isNew?: boolean }[]
  // 输入流剩余
  inputRemaining: number[]
  // 当前正在生成的 Run
  currentRun: number[]
  // 已经完成的历史 Runs
  completedRuns: { id: number; items: number[] }[]
  lastOutput: number | null
  currentRunId: number
  event: 'init' | 'select-min' | 'output-min' | 'load-input' | 'freeze' | 'unfreeze-all'
}

const currentMode = ref<ModeKey>('loser-tree')
const stepIndex = ref(0)
const isPlaying = ref(false)
const playSpeed = ref<number>(1800) // 毫秒
let timer: any = null

// ==========================================
// 模式 1: 败者树 4 路归并数据生成
// ==========================================
const loserTreeSteps: LoserTreeStep[] = [
  {
    title: '初始状态：4 路归并段就绪，叶子装载段首',
    desc: '4 个归并段 R0~R3 首元素分别载入叶子 b[0..3] = [10, 9, 6, 8]。完成初次建树后，ls[0]=2，表示当前全局最小值为 R2 的 6。',
    examTip: '408考点：k路归并的败者树高度为 ⌈log₂ k⌉+1。传统选择最小需 k-1 次比较，败者树仅需 ⌈log₂ k⌉ 次。',
    runs: [
      [15, 22, 35],
      [18, 24, 40],
      [12, 30, 48],
      [14, 28, 50]
    ],
    leaves: [10, 9, 6, 8],
    ls: [2, 1, 0, 3], // ls[0]=2(胜者), ls[1]=1, ls[2]=0, ls[3]=3
    output: [],
    phase: 'idle'
  },
  {
    title: '第一步：输出全局胜者到有序段',
    desc: '根据 ls[0]=2，确定当前全局最小元素为 R2 的 6，将其弹出并写入外存输出缓冲区。',
    examTip: '归并过程每次只向外存输出 1 个记录，外存缓冲区满后统一写盘。',
    runs: [
      [15, 22, 35],
      [18, 24, 40],
      [12, 30, 48],
      [14, 28, 50]
    ],
    leaves: [10, 9, 6, 8],
    ls: [2, 1, 0, 3],
    activeLeaf: 2,
    output: [6],
    phase: 'output'
  },
  {
    title: '第二步：从胜者所在段 R2 补充新元素',
    desc: 'R2 弹出下一个记录 12，填入叶子槽位 b[2]。准备沿 b[2] 单一向上分支进行沿途淘汰重赛。',
    examTip: '重赛只需沿着刚输出的叶子节点一路向上更新到根节点，其他分支结构完全保持不变！',
    runs: [
      [15, 22, 35],
      [18, 24, 40],
      [30, 48],
      [14, 28, 50]
    ],
    leaves: [10, 9, 12, 8],
    ls: [2, 1, 0, 3],
    activeLeaf: 2,
    output: [6],
    phase: 'fetch'
  },
  {
    title: '第三步：b[2] 与父节点 ls[3] 进行第一轮 PK',
    desc: 'b[2] 的父节点为 ls[3]，其原有败者为段 3 (b[3]=8)。比较 b[2]=12 与 b[3]=8：8 < 12，故 8 胜出，12 失败！败者段 2 留在 ls[3]，胜者段 3 带着值 8 继续上升！',
    examTip: '败者树核心规则：“胜者继续上升，败者留在该节点”。ls[i] 存的是败者所在段号。',
    runs: [
      [15, 22, 35],
      [18, 24, 40],
      [30, 48],
      [14, 28, 50]
    ],
    leaves: [10, 9, 12, 8],
    ls: [2, 1, 0, 2], // ls[3] 变为 2 (段2是败者)
    activeLeaf: 2,
    activeNode: 3,
    comparingWith: 3,
    output: [6],
    phase: 'compare'
  },
  {
    title: '第四步：胜者段 3 上升至 ls[1] 进行第二轮 PK',
    desc: '段 3 继续上升挑战 ls[1] 原有败者段 1 (b[1]=9)。比较 b[3]=8 与 b[1]=9：8 < 9，故段 3 再次胜出！段 1 仍为败者保留在 ls[1]=1。段 3 成功晋级！',
    examTip: '4 路归并仅需 ⌈log₂ 4⌉ = 2 次比较即可直达根部！',
    runs: [
      [15, 22, 35],
      [18, 24, 40],
      [30, 48],
      [14, 28, 50]
    ],
    leaves: [10, 9, 12, 8],
    ls: [2, 1, 0, 2],
    activeNode: 1,
    comparingWith: 1,
    output: [6],
    phase: 'compare'
  },
  {
    title: '第五步：决出新全局胜者，更新 ls[0]',
    desc: '段 3 获胜到达树顶，更新全局冠军 ls[0] = 3。当前全局最小值为 R3 的 8！',
    examTip: 'ls[0] 是唯一存放最终“胜者”段号的特殊节点，树身内部所有其他节点全是败者。',
    runs: [
      [15, 22, 35],
      [18, 24, 40],
      [30, 48],
      [14, 28, 50]
    ],
    leaves: [10, 9, 12, 8],
    ls: [3, 1, 0, 2], // ls[0] 更新为 3
    activeNode: 0,
    output: [6],
    phase: 'win'
  },
  {
    title: '第六步：输出新胜者 8，并从 R3 补入 14',
    desc: '输出 R3 的 8。随后从 R3 读入下一个元素 14 填补 b[3]。准备沿 b[3] 向上重赛。',
    runs: [
      [15, 22, 35],
      [18, 24, 40],
      [30, 48],
      [28, 50]
    ],
    leaves: [10, 9, 12, 14],
    ls: [3, 1, 0, 2],
    activeLeaf: 3,
    output: [6, 8],
    phase: 'output'
  },
  {
    title: '第七步：b[3]=14 与 ls[3] (段2=12) 比较',
    desc: '向上到达 ls[3]，与其中记录的段 2 (b[2]=12) 比较：12 < 14，段 2 获胜！段 3 成为败者留在 ls[3]=3，胜者段 2 带着 12 继续上升！',
    runs: [
      [15, 22, 35],
      [18, 24, 40],
      [30, 48],
      [28, 50]
    ],
    leaves: [10, 9, 12, 14],
    ls: [3, 1, 0, 3], // ls[3] 变为 3
    activeNode: 3,
    comparingWith: 2,
    output: [6, 8],
    phase: 'compare'
  },
  {
    title: '第八步：胜者段 2 上升与 ls[1] (段1=9) 比较',
    desc: '段 2 (12) 向上挑战 ls[1] 中的段 1 (9)。比较 12 与 9：9 < 12，故段 1 获胜，段 2 成为败者留在 ls[1]=2！胜者段 1 带着 9 登上树顶！',
    runs: [
      [15, 22, 35],
      [18, 24, 40],
      [30, 48],
      [28, 50]
    ],
    leaves: [10, 9, 12, 14],
    ls: [3, 2, 0, 3], // ls[1] 变为 2
    activeNode: 1,
    comparingWith: 1,
    output: [6, 8],
    phase: 'compare'
  },
  {
    title: '第九步：更新树顶 ls[0]=1，当前全局最小为 9',
    desc: '段 1 登顶，ls[0] 更新为 1。下一轮即将输出 9，并从 R1 补入 18。整个归并流程严丝合缝、高效稳定！',
    examTip: '总结：无论归并多少个段，选出下一个元素的时间复杂度恒定为 O(log k)。',
    runs: [
      [15, 22, 35],
      [18, 24, 40],
      [30, 48],
      [28, 50]
    ],
    leaves: [10, 9, 12, 14],
    ls: [1, 2, 0, 3], // ls[0] 变为 1
    activeNode: 0,
    output: [6, 8],
    phase: 'win'
  },
  {
    title: '第十步：连续归并输出，最终得到完整有序序列',
    desc: '重复上述“输出胜者 ➔ 补入新值 ➔ 沿单支对数次比较 ➔ 决出新胜者”机制，所有归并段平滑流出，完成外部排序阶段性归并任务！',
    runs: [
      [22, 35],
      [24, 40],
      [30, 48],
      [28, 50]
    ],
    leaves: [10, 18, 12, 14],
    ls: [0, 2, 1, 3],
    output: [6, 8, 9, 10],
    phase: 'idle'
  }
]

// ==========================================
// 模式 2: 置换-选择排序数据生成
// ==========================================
// 工作区容量 w = 4
// 输入数据流: [17, 21, 5, 8, 10, 2, 12, 19, 1, 23, 7]
const replacementSteps: ReplacementStep[] = [
  {
    title: '初始状态：从输入流填满容量为 4 的工作区',
    desc: '内存工作区容量 w=4，首先读入前 4 个记录 [17, 21, 5, 8]。当前正在生成 Run 1，尚无元素被冻结。',
    examTip: '408大题高频：置换-选择排序旨在突破内存容量限制，生成平均长度为 2w 的超长初始归并段！',
    wa: [
      { val: 17, frozen: false },
      { val: 21, frozen: false },
      { val: 5, frozen: false },
      { val: 8, frozen: false }
    ],
    inputRemaining: [10, 2, 12, 19, 1, 23, 7],
    currentRun: [],
    completedRuns: [],
    lastOutput: null,
    currentRunId: 1,
    event: 'init'
  },
  {
    title: '选最小值：选出工作区未冻结的全局最小 5',
    desc: '工作区当前未冻结元素为 [17, 21, 5, 8]，其中最小元素为 5（位于槽位 2）。',
    wa: [
      { val: 17, frozen: false },
      { val: 21, frozen: false },
      { val: 5, frozen: false, isMin: true },
      { val: 8, frozen: false }
    ],
    inputRemaining: [10, 2, 12, 19, 1, 23, 7],
    currentRun: [],
    completedRuns: [],
    lastOutput: null,
    currentRunId: 1,
    event: 'select-min'
  },
  {
    title: '输出 5 到 Run 1，并从输入流读入 10 补充',
    desc: '将 5 输出到 Run 1。从输入流取 10 放入槽位 2。因为 10 ≥ 上一输出值 5，允许参与本段排序，未冻结！',
    examTip: '判定规则：新读入值 ≥ lastOutput，属于当前 Run；若新读入值 < lastOutput，必须冻结！',
    wa: [
      { val: 17, frozen: false },
      { val: 21, frozen: false },
      { val: 10, frozen: false, isNew: true },
      { val: 8, frozen: false }
    ],
    inputRemaining: [2, 12, 19, 1, 23, 7],
    currentRun: [5],
    completedRuns: [],
    lastOutput: 5,
    currentRunId: 1,
    event: 'load-input'
  },
  {
    title: '选最小值：选出未冻结最小元素 8',
    desc: '工作区未冻结元素为 [17, 21, 10, 8]，最小值为 8（槽位 3）。',
    wa: [
      { val: 17, frozen: false },
      { val: 21, frozen: false },
      { val: 10, frozen: false },
      { val: 8, frozen: false, isMin: true }
    ],
    inputRemaining: [2, 12, 19, 1, 23, 7],
    currentRun: [5],
    completedRuns: [],
    lastOutput: 5,
    currentRunId: 1,
    event: 'select-min'
  },
  {
    title: '输出 8，读入 2！触发关键冻结 ❄️',
    desc: '输出 8 到 Run 1。输入流下一个为 2。因为 2 < 上一输出值 8（无法保持单调递增），故打上冻结标记 ❄️！该槽位暂时不参与 Run 1 的选择。',
    examTip: '408避坑：冻结的元素不属于本归并段，其数值即使极小也不能被选出，必须等到下一段才能解冻！',
    wa: [
      { val: 17, frozen: false },
      { val: 21, frozen: false },
      { val: 10, frozen: false },
      { val: 2, frozen: true, isNew: true }
    ],
    inputRemaining: [12, 19, 1, 23, 7],
    currentRun: [5, 8],
    completedRuns: [],
    lastOutput: 8,
    currentRunId: 1,
    event: 'freeze'
  },
  {
    title: '选最小值：在未冻结的 [17, 21, 10] 中选出 10',
    desc: '槽位 3 的 2 已被冻结跳过，未冻结中最小值为 10（槽位 2）。',
    wa: [
      { val: 17, frozen: false },
      { val: 21, frozen: false },
      { val: 10, frozen: false, isMin: true },
      { val: 2, frozen: true }
    ],
    inputRemaining: [12, 19, 1, 23, 7],
    currentRun: [5, 8],
    completedRuns: [],
    lastOutput: 8,
    currentRunId: 1,
    event: 'select-min'
  },
  {
    title: '输出 10，读入 12（≥ 10，正常不冻结）',
    desc: '输出 10 到 Run 1。输入流读入 12 填入槽位 2。12 ≥ 10，符合单调递增，正常可用！',
    wa: [
      { val: 17, frozen: false },
      { val: 21, frozen: false },
      { val: 12, frozen: false, isNew: true },
      { val: 2, frozen: true }
    ],
    inputRemaining: [19, 1, 23, 7],
    currentRun: [5, 8, 10],
    completedRuns: [],
    lastOutput: 10,
    currentRunId: 1,
    event: 'load-input'
  },
  {
    title: '选出 12 输出，读入 19（≥ 12，正常不冻结）',
    desc: '选出 12 输出到 Run 1。读入 19 填入。19 ≥ 12，可用。工作区目前：[17, 21, 19, 2(冻结)]。',
    wa: [
      { val: 17, frozen: false },
      { val: 21, frozen: false },
      { val: 19, frozen: false, isNew: true },
      { val: 2, frozen: true }
    ],
    inputRemaining: [1, 23, 7],
    currentRun: [5, 8, 10, 12],
    completedRuns: [],
    lastOutput: 12,
    currentRunId: 1,
    event: 'load-input'
  },
  {
    title: '选出 17 输出，读入 1！再次触发冻结 ❄️',
    desc: '未冻结中最小为 17，输出到 Run 1。读入新元素 1。因为 1 < 17，槽位 0 被冻结 ❄️！工作区已有 2 个元素冻结。',
    wa: [
      { val: 1, frozen: true, isNew: true },
      { val: 21, frozen: false },
      { val: 19, frozen: false },
      { val: 2, frozen: true }
    ],
    inputRemaining: [23, 7],
    currentRun: [5, 8, 10, 12, 17],
    completedRuns: [],
    lastOutput: 17,
    currentRunId: 1,
    event: 'freeze'
  },
  {
    title: '选出 19 输出，读入 23（≥ 19，可用）',
    desc: '选出 19 输出到 Run 1。读入 23 填入槽位 2。23 ≥ 19，不冻结。工作区：[1(冻), 21, 23, 2(冻)]。',
    wa: [
      { val: 1, frozen: true },
      { val: 21, frozen: false },
      { val: 23, frozen: false, isNew: true },
      { val: 2, frozen: true }
    ],
    inputRemaining: [7],
    currentRun: [5, 8, 10, 12, 17, 19],
    completedRuns: [],
    lastOutput: 19,
    currentRunId: 1,
    event: 'load-input'
  },
  {
    title: '选出 21 输出，读入 7！第三个被冻结 ❄️',
    desc: '选出 21 输出。读入 7。因为 7 < 21，槽位 1 冻结 ❄️！此时工作区已有 3 个槽位冻结！',
    wa: [
      { val: 1, frozen: true },
      { val: 7, frozen: true, isNew: true },
      { val: 23, frozen: false },
      { val: 2, frozen: true }
    ],
    inputRemaining: [],
    currentRun: [5, 8, 10, 12, 17, 19, 21],
    completedRuns: [],
    lastOutput: 21,
    currentRunId: 1,
    event: 'freeze'
  },
  {
    title: '选出最后一个未冻结的 23 输出！',
    desc: '工作区唯一未冻结元素 23 输出到 Run 1。输入流已空。此时工作区内所有元素全部进入冻结状态！',
    examTip: '当工作区中所有元素均被冻结时，标志着当前初始归并段 Run 1 结束！',
    wa: [
      { val: 1, frozen: true },
      { val: 7, frozen: true },
      { val: 23, frozen: true },
      { val: 2, frozen: true }
    ],
    inputRemaining: [],
    currentRun: [5, 8, 10, 12, 17, 19, 21, 23],
    completedRuns: [],
    lastOutput: 23,
    currentRunId: 1,
    event: 'freeze'
  },
  {
    title: '全冻结触发段终！Run 1 归档，一键全部解冻开启 Run 2 🚀',
    desc: 'Run 1 完结，长度高达 8（是工作区容量 4 的整整 2 倍！）。工作区内 [1, 7, 23已出用余数, 2] 全部解除冻结，开启归并段 Run 2！',
    examTip: '408经典结论：置换-选择排序生成的归并段长度不等，但平均长度约为 2w。这大幅减少了初始归并段总数 m，进而显著减少了归并趟数与磁盘 I/O！',
    wa: [
      { val: 1, frozen: false },
      { val: 7, frozen: false },
      { val: 2, frozen: false }
    ],
    inputRemaining: [],
    currentRun: [],
    completedRuns: [{ id: 1, items: [5, 8, 10, 12, 17, 19, 21, 23] }],
    lastOutput: null,
    currentRunId: 2,
    event: 'unfreeze-all'
  }
]

const totalSteps = computed(() => {
  return currentMode.value === 'loser-tree'
    ? loserTreeSteps.length
    : replacementSteps.length
})

const currentLoserStep = computed(() => {
  return loserTreeSteps[Math.min(stepIndex.value, loserTreeSteps.length - 1)]
})

const currentReplacementStep = computed(() => {
  return replacementSteps[Math.min(stepIndex.value, replacementSteps.length - 1)]
})

function setMode(mode: ModeKey) {
  pause()
  currentMode.value = mode
  stepIndex.value = 0
}

function nextStep() {
  if (stepIndex.value < totalSteps.value - 1) {
    stepIndex.value++
  } else {
    pause()
  }
}

function prevStep() {
  if (stepIndex.value > 0) {
    stepIndex.value--
  }
}

function reset() {
  pause()
  stepIndex.value = 0
}

function togglePlay() {
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

function play() {
  if (stepIndex.value >= totalSteps.value - 1) {
    stepIndex.value = 0
  }
  isPlaying.value = true
  timer = setInterval(() => {
    if (stepIndex.value < totalSteps.value - 1) {
      stepIndex.value++
    } else {
      pause()
    }
  }, playSpeed.value)
}

function pause() {
  isPlaying.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="external-sort-card">
    <!-- 头部导航与模式切换 -->
    <div class="player-header">
      <div class="title-group">
        <span class="player-icon">🗄️</span>
        <div>
          <div class="player-main-title">外部排序核心机理交互式演示系统</div>
          <div class="player-sub-title">408 核心重难点 · 败者树沿单一分支重赛 & 置换-选择工作区动态冻结流水线</div>
        </div>
      </div>
      <div class="mode-tabs">
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'loser-tree' }"
          @click="setMode('loser-tree')"
        >
          🌲 败者树 4 路归并动态重赛
        </button>
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'replacement-selection' }"
          @click="setMode('replacement-selection')"
        >
          ❄️ 置换-选择排序工作区冻结
        </button>
      </div>
    </div>

    <!-- 控制工具栏 -->
    <div class="player-controls">
      <div class="btn-group">
        <button class="ctrl-btn" :disabled="stepIndex === 0" @click="reset">
          ⏮ 重置
        </button>
        <button class="ctrl-btn" :disabled="stepIndex === 0" @click="prevStep">
          ◀ 上一步
        </button>
        <button class="ctrl-btn play-btn" @click="togglePlay">
          {{ isPlaying ? '⏸ 暂停' : '▶ 自动播放' }}
        </button>
        <button class="ctrl-btn" :disabled="stepIndex === totalSteps - 1" @click="nextStep">
          下一步 ▶
        </button>
      </div>

      <div class="slider-group">
        <span class="step-counter">进度: <strong>{{ stepIndex + 1 }}</strong> / {{ totalSteps }}</span>
        <input
          v-model.number="stepIndex"
          type="range"
          min="0"
          :max="totalSteps - 1"
          class="progress-slider"
        />
      </div>
    </div>

    <!-- 步骤文字与 408 考点高亮框 -->
    <div class="step-explanation">
      <template v-if="currentMode === 'loser-tree'">
        <div class="step-title-line">
          <span class="step-badge">Step {{ stepIndex + 1 }}</span>
          <span class="step-heading">{{ currentLoserStep.title }}</span>
        </div>
        <p class="step-desc">{{ currentLoserStep.desc }}</p>
        <div v-if="currentLoserStep.examTip" class="exam-tip-box">
          <span class="tip-icon">💡</span>
          <span>{{ currentLoserStep.examTip }}</span>
        </div>
      </template>

      <template v-else>
        <div class="step-title-line">
          <span class="step-badge replacement-badge">Step {{ stepIndex + 1 }}</span>
          <span class="step-heading">{{ currentReplacementStep.title }}</span>
        </div>
        <p class="step-desc">{{ currentReplacementStep.desc }}</p>
        <div v-if="currentReplacementStep.examTip" class="exam-tip-box">
          <span class="tip-icon">💡</span>
          <span>{{ currentReplacementStep.examTip }}</span>
        </div>
      </template>
    </div>

    <!-- 舞台呈现区 -->
    <div class="stage-container">
      <!-- ================= 模式 1: 败者树可视化 ================= -->
      <div v-if="currentMode === 'loser-tree'" class="loser-tree-stage">
        <!-- 胜者输出区 -->
        <div class="output-track-box">
          <div class="track-label">📤 归并段输出序列 (已写出到外存缓冲区):</div>
          <div class="output-chips">
            <span v-if="currentLoserStep.output.length === 0" class="empty-tip">暂无输出 (准备决出首个最小元素)</span>
            <span
              v-for="(item, idx) in currentLoserStep.output"
              :key="idx"
              class="output-chip"
              :class="{ 'latest-output': idx === currentLoserStep.output.length - 1 }"
            >
              {{ item }}
            </span>
          </div>
        </div>

        <!-- 败者树 SVG 拓扑图 -->
        <div class="svg-wrapper">
          <svg viewBox="0 0 680 230" width="100%" height="230" class="tree-svg">
            <!-- 连线 -->
            <!-- ls[0] 到 ls[1] -->
            <line x1="340" y1="40" x2="340" y2="70" stroke="var(--vp-c-divider)" stroke-width="2" />
            <!-- ls[1] 到 ls[2] & ls[3] -->
            <line x1="340" y1="90" x2="210" y2="125" stroke="var(--vp-c-divider)" stroke-width="2" />
            <line x1="340" y1="90" x2="470" y2="125" stroke="var(--vp-c-divider)" stroke-width="2" />
            <!-- ls[2] 到 b[0], b[1] -->
            <line x1="210" y1="145" x2="150" y2="180" stroke="var(--vp-c-divider)" stroke-width="2" />
            <line x1="210" y1="145" x2="270" y2="180" stroke="var(--vp-c-divider)" stroke-width="2" />
            <!-- ls[3] 到 b[2], b[3] -->
            <line x1="470" y1="145" x2="410" y2="180" stroke="var(--vp-c-divider)" stroke-width="2" />
            <line x1="470" y1="145" x2="530" y2="180" stroke="var(--vp-c-divider)" stroke-width="2" />

            <!-- ls[0]: 冠军节点 (顶层独立) -->
            <g transform="translate(290, 12)">
              <rect
                x="0"
                y="0"
                width="100"
                height="28"
                rx="6"
                :class="[
                  'winner-rect',
                  { 'highlight-win': currentLoserStep.activeNode === 0 || currentLoserStep.phase === 'win' }
                ]"
              />
              <text x="50" y="18" text-anchor="middle" class="tree-text bold-text">
                ls[0] = 段{{ currentLoserStep.ls[0] }} 👑
              </text>
            </g>

            <!-- ls[1]: 根部内部败者节点 -->
            <g transform="translate(340, 80)">
              <circle
                cx="0"
                cy="0"
                r="17"
                :class="[
                  'internal-node',
                  { 'highlight-active': currentLoserStep.activeNode === 1 }
                ]"
              />
              <text x="0" y="4" text-anchor="middle" class="tree-text">
                R{{ currentLoserStep.ls[1] }}
              </text>
              <text x="24" y="3" class="node-tag">ls[1]</text>
            </g>

            <!-- ls[2]: 内部败者节点左 -->
            <g transform="translate(210, 135)">
              <circle
                cx="0"
                cy="0"
                r="16"
                :class="[
                  'internal-node',
                  { 'highlight-active': currentLoserStep.activeNode === 2 }
                ]"
              />
              <text x="0" y="4" text-anchor="middle" class="tree-text">
                R{{ currentLoserStep.ls[2] }}
              </text>
              <text x="-36" y="3" class="node-tag">ls[2]</text>
            </g>

            <!-- ls[3]: 内部败者节点右 -->
            <g transform="translate(470, 135)">
              <circle
                cx="0"
                cy="0"
                r="16"
                :class="[
                  'internal-node',
                  { 'highlight-active': currentLoserStep.activeNode === 3 }
                ]"
              />
              <text x="0" y="4" text-anchor="middle" class="tree-text">
                R{{ currentLoserStep.ls[3] }}
              </text>
              <text x="23" y="3" class="node-tag">ls[3]</text>
            </g>

            <!-- 4 个叶子槽位 b[0..3] (代表各段当前待比元素) -->
            <!-- b[0] -->
            <g transform="translate(115, 180)">
              <rect
                x="0"
                y="0"
                width="70"
                height="32"
                rx="4"
                :class="['leaf-rect', { 'highlight-leaf': currentLoserStep.activeLeaf === 0 }]"
              />
              <text x="35" y="16" text-anchor="middle" class="leaf-title">b[0] (R0)</text>
              <text x="35" y="27" text-anchor="middle" class="leaf-val">{{ currentLoserStep.leaves[0] }}</text>
            </g>

            <!-- b[1] -->
            <g transform="translate(235, 180)">
              <rect
                x="0"
                y="0"
                width="70"
                height="32"
                rx="4"
                :class="['leaf-rect', { 'highlight-leaf': currentLoserStep.activeLeaf === 1 }]"
              />
              <text x="35" y="16" text-anchor="middle" class="leaf-title">b[1] (R1)</text>
              <text x="35" y="27" text-anchor="middle" class="leaf-val">{{ currentLoserStep.leaves[1] }}</text>
            </g>

            <!-- b[2] -->
            <g transform="translate(375, 180)">
              <rect
                x="0"
                y="0"
                width="70"
                height="32"
                rx="4"
                :class="['leaf-rect', { 'highlight-leaf': currentLoserStep.activeLeaf === 2 }]"
              />
              <text x="35" y="16" text-anchor="middle" class="leaf-title">b[2] (R2)</text>
              <text x="35" y="27" text-anchor="middle" class="leaf-val">{{ currentLoserStep.leaves[2] }}</text>
            </g>

            <!-- b[3] -->
            <g transform="translate(495, 180)">
              <rect
                x="0"
                y="0"
                width="70"
                height="32"
                rx="4"
                :class="['leaf-rect', { 'highlight-leaf': currentLoserStep.activeLeaf === 3 }]"
              />
              <text x="35" y="16" text-anchor="middle" class="leaf-title">b[3] (R3)</text>
              <text x="35" y="27" text-anchor="middle" class="leaf-val">{{ currentLoserStep.leaves[3] }}</text>
            </g>
          </svg>
        </div>

        <!-- 4 路输入归并段待取队列 -->
        <div class="runs-queue-grid">
          <div
            v-for="(queue, rIdx) in currentLoserStep.runs"
            :key="rIdx"
            class="run-row"
            :class="{ 'active-run-row': currentLoserStep.ls[0] === rIdx }"
          >
            <div class="run-name">
              <span>段 R{{ rIdx }}</span>
              <span v-if="currentLoserStep.ls[0] === rIdx" class="champion-badge">当前段首胜出</span>
            </div>
            <div class="queue-items">
              <span v-if="queue.length === 0" class="empty-tag">队列已空 (∞)</span>
              <span
                v-for="(val, qIdx) in queue"
                :key="qIdx"
                class="queue-item"
                :class="{ 'next-item': qIdx === 0 }"
              >
                {{ val }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= 模式 2: 置换-选择排序可视化 ================= -->
      <div v-else class="replacement-stage">
        <!-- 内存工作区卡片 (Work Area, 容量 4) -->
        <div class="section-container">
          <div class="section-title">
            <span>🧠 内存工作区 (Work Area, 限制容量 w = 4)</span>
            <span class="status-tip">
              状态: 已冻结 <strong>{{ currentReplacementStep.wa.filter(s => s.frozen).length }}</strong> / 4
            </span>
          </div>

          <div class="wa-slots-grid">
            <div
              v-for="(slot, idx) in currentReplacementStep.wa"
              :key="idx"
              class="wa-slot"
              :class="{
                'is-frozen': slot.frozen,
                'is-min': slot.isMin,
                'is-new': slot.isNew
              }"
            >
              <div class="slot-idx">槽位 {{ idx }}</div>
              <div class="slot-value">{{ slot.val }}</div>
              <div v-if="slot.frozen" class="slot-badge frozen-badge">
                ❄️ 冻结 (下一段)
              </div>
              <div v-else-if="slot.isMin" class="slot-badge min-badge">
                ⭐ 本轮最小
              </div>
              <div v-else-if="slot.isNew" class="slot-badge new-badge">
                📥 新读入
              </div>
              <div v-else class="slot-badge normal-badge">
                待选
              </div>
            </div>
          </div>
        </div>

        <!-- 传送带流动指示 -->
        <div class="flow-indicators">
          <div class="flow-box">
            <span class="flow-label">📥 待排输入流 (Input Stream):</span>
            <div class="stream-chips">
              <span v-if="currentReplacementStep.inputRemaining.length === 0" class="empty-tip">已全部读入内存</span>
              <span
                v-for="(n, i) in currentReplacementStep.inputRemaining"
                :key="i"
                class="stream-chip"
                :class="{ 'next-stream': i === 0 }"
              >
                {{ n }}
              </span>
            </div>
          </div>

          <div class="flow-box">
            <span class="flow-label">
              📌 上一写出值 (Last Output):
              <strong class="last-val">{{ currentReplacementStep.lastOutput !== null ? currentReplacementStep.lastOutput : 'None' }}</strong>
            </span>
            <span class="compare-rule">
              (若新元素 &lt; {{ currentReplacementStep.lastOutput !== null ? currentReplacementStep.lastOutput : '当前值' }} 则打上冻结 ❄️)
            </span>
          </div>
        </div>

        <!-- 初始归并段输出流水线 -->
        <div class="section-container runs-container">
          <div class="section-title">
            <span>📦 生成的初始归并段 (Runs)</span>
            <span class="status-tip">当前活跃段: Run {{ currentReplacementStep.currentRunId }}</span>
          </div>

          <!-- 当前正在写入的归并段 -->
          <div class="active-run-box">
            <div class="run-header">
              <span class="run-tag active-tag">Run {{ currentReplacementStep.currentRunId }} (生成中)</span>
              <span class="run-len">当前已生成长度: <strong>{{ currentReplacementStep.currentRun.length }}</strong></span>
            </div>
            <div class="run-chips">
              <span v-if="currentReplacementStep.currentRun.length === 0" class="empty-tip">等待输出第一条记录...</span>
              <span
                v-for="(val, idx) in currentReplacementStep.currentRun"
                :key="idx"
                class="run-chip"
                :class="{ 'latest-chip': idx === currentReplacementStep.currentRun.length - 1 }"
              >
                {{ val }}
              </span>
            </div>
          </div>

          <!-- 已封存的历史归并段 -->
          <div v-if="currentReplacementStep.completedRuns.length > 0" class="completed-runs">
            <div
              v-for="cRun in currentReplacementStep.completedRuns"
              :key="cRun.id"
              class="completed-run-box"
            >
              <div class="run-header">
                <span class="run-tag completed-tag">Run {{ cRun.id }} (已封存完成)</span>
                <span class="run-len">最终长度: <strong>{{ cRun.items.length }}</strong> (突破内存容量 4!)</span>
              </div>
              <div class="run-chips">
                <span v-for="(val, idx) in cRun.items" :key="idx" class="run-chip completed-chip">
                  {{ val }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.external-sort-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
  margin: 24px 0;
  overflow: hidden;
  font-family: inherit;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  flex-wrap: wrap;
  gap: 12px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-icon {
  font-size: 26px;
}

.player-main-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.player-sub-title {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-top: 2px;
}

.mode-tabs {
  display: flex;
  gap: 8px;
}

.mode-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.mode-btn.active {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.player-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
  gap: 12px;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.ctrl-btn {
  padding: 6px 13px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ctrl-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.ctrl-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.play-btn {
  background: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
}

.play-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-2, #1d4ed8);
  color: #ffffff;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.step-counter {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.progress-slider {
  cursor: pointer;
  accent-color: var(--vp-c-brand-1);
}

.step-explanation {
  padding: 14px 20px;
  background: var(--vp-c-bg-soft, rgba(0, 0, 0, 0.02));
  border-bottom: 1px solid var(--vp-c-divider);
}

.step-title-line {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.step-badge {
  padding: 2px 8px;
  background: var(--vp-c-brand-1);
  color: #ffffff;
  font-size: 11.5px;
  font-weight: 700;
  border-radius: 4px;
}

.replacement-badge {
  background: #7c3aed;
}

.step-heading {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.step-desc {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.exam-tip-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(245, 158, 11, 0.1);
  border-left: 3px solid #f59e0b;
  color: var(--vp-c-text-1);
  font-size: 12.5px;
  line-height: 1.5;
}

.tip-icon {
  font-size: 15px;
}

.stage-container {
  padding: 20px;
  min-height: 400px;
}

/* ================= 败者树样式 ================= */
.output-track-box {
  background: var(--vp-c-bg-alt);
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  margin-bottom: 14px;
}

.track-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.output-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 32px;
  align-items: center;
}

.output-chip {
  padding: 4px 10px;
  border-radius: 4px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid #10b981;
  color: #10b981;
  font-family: monospace;
  font-weight: 700;
  font-size: 13px;
}

.latest-output {
  background: #10b981;
  color: #ffffff;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
  animation: pulse-out 0.8s ease;
}

@keyframes pulse-out {
  0% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.empty-tip {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-style: italic;
}

.svg-wrapper {
  background: var(--vp-c-bg);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  margin-bottom: 14px;
  padding: 6px;
}

.tree-svg {
  display: block;
  margin: 0 auto;
}

.winner-rect {
  fill: var(--vp-c-bg-alt);
  stroke: var(--vp-c-brand-1);
  stroke-width: 2;
  transition: all 0.3s;
}

.highlight-win {
  fill: rgba(16, 185, 129, 0.2);
  stroke: #10b981;
  stroke-width: 2.5;
}

.internal-node {
  fill: var(--vp-c-bg-alt);
  stroke: var(--vp-c-divider);
  stroke-width: 2;
  transition: all 0.3s;
}

.highlight-active {
  fill: rgba(245, 158, 11, 0.25);
  stroke: #f59e0b;
  stroke-width: 3;
}

.node-tag {
  font-size: 10px;
  fill: var(--vp-c-text-3);
}

.tree-text {
  font-size: 12px;
  fill: var(--vp-c-text-1);
}

.bold-text {
  font-weight: 700;
}

.leaf-rect {
  fill: rgba(37, 99, 235, 0.06);
  stroke: var(--vp-c-brand-1);
  stroke-width: 1.5;
  transition: all 0.3s;
}

.highlight-leaf {
  fill: rgba(245, 158, 11, 0.2);
  stroke: #f59e0b;
  stroke-width: 2.5;
}

.leaf-title {
  font-size: 10.5px;
  fill: var(--vp-c-text-2);
}

.leaf-val {
  font-size: 13px;
  font-weight: 700;
  fill: var(--vp-c-brand-1);
  font-family: monospace;
}

.runs-queue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.run-row {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 8px 10px;
  transition: all 0.2s;
}

.active-run-row {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.run-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 6px;
}

.champion-badge {
  font-size: 10px;
  background: #10b981;
  color: #fff;
  padding: 1px 4px;
  border-radius: 3px;
}

.queue-items {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.queue-item {
  padding: 2px 6px;
  border-radius: 3px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  font-family: monospace;
  font-size: 11.5px;
  color: var(--vp-c-text-2);
}

.next-item {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

.empty-tag {
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-style: italic;
}

/* ================= 置换-选择排序样式 ================= */
.section-container {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 12px;
}

.status-tip {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.wa-slots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.wa-slot {
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 8px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.wa-slot.is-frozen {
  background: rgba(147, 51, 234, 0.08);
  border-color: #9333ea;
}

.wa-slot.is-min {
  background: rgba(16, 185, 129, 0.12);
  border-color: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
  transform: translateY(-2px);
}

.wa-slot.is-new {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
}

.slot-idx {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-bottom: 4px;
}

.slot-value {
  font-size: 22px;
  font-weight: 800;
  font-family: monospace;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.slot-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.frozen-badge {
  background: #9333ea;
  color: #ffffff;
}

.min-badge {
  background: #10b981;
  color: #ffffff;
}

.new-badge {
  background: #3b82f6;
  color: #ffffff;
}

.normal-badge {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.flow-indicators {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.flow-box {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 14px;
}

.flow-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  display: block;
  margin-bottom: 6px;
}

.stream-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.stream-chip {
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  font-family: monospace;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.next-stream {
  border-color: #3b82f6;
  color: #3b82f6;
  font-weight: 700;
  background: rgba(59, 130, 246, 0.1);
}

.last-val {
  color: #e11d48;
  font-size: 14px;
  font-family: monospace;
}

.compare-rule {
  display: block;
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-top: 4px;
}

.runs-container {
  margin-bottom: 0;
}

.active-run-box {
  background: var(--vp-c-bg);
  border: 1.5px solid #10b981;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}

.run-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.run-tag {
  font-size: 11.5px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.active-tag {
  background: #10b981;
  color: #fff;
}

.completed-tag {
  background: #6b7280;
  color: #fff;
}

.run-len {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.run-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 28px;
  align-items: center;
}

.run-chip {
  padding: 3px 9px;
  border-radius: 4px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid #10b981;
  color: #10b981;
  font-family: monospace;
  font-weight: 700;
  font-size: 12.5px;
}

.latest-chip {
  background: #10b981;
  color: #fff;
  animation: pulse-out 0.8s ease;
}

.completed-runs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.completed-run-box {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 8px 10px;
}

.completed-chip {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .wa-slots-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .flow-indicators {
    grid-template-columns: 1fr;
  }
  .mode-tabs {
    width: 100%;
  }
  .mode-btn {
    flex: 1;
    text-align: center;
  }
}
</style>
