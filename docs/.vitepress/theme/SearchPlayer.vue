<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

type SearchMode = 'binary-search' | 'avl-rotate' | 'b-tree' | 'hash-table'

// ==========================================
// 1. 折半查找数据结构
// ==========================================
interface BinarySearchStep {
  title: string
  desc: string
  examTip?: string
  low: number
  high: number
  mid: number
  found: boolean
  comparedVal: number
}

const bsArray = [7, 14, 18, 21, 23, 29, 31, 35, 42, 47, 53]
const bsTarget = 35

const binarySearchSteps: BinarySearchStep[] = [
  {
    title: '初始状态：设定双指针 low=0, high=10',
    desc: '在长度为 11 的有序顺序表中查找目标关键字 35。初始查找区间为整个数组 [0..10]。',
    examTip: '408考点：折半查找的前提是有序且顺序存储；比较次数至多不超过判定树高度 ⌈log₂(n+1)⌉。这里 n=11，树高为 4。',
    low: 0,
    high: 10,
    mid: 5,
    found: false,
    comparedVal: 29
  },
  {
    title: '第 1 轮比较：mid=5 (值 29) 与目标 35 比对',
    desc: '计算 mid = ⌊(0+10)/2⌋ = 5，元素为 29。因为 35 > 29，目标只能落在右半区间！更新 low = mid + 1 = 6。',
    low: 6,
    high: 10,
    mid: 8,
    found: false,
    comparedVal: 42
  },
  {
    title: '第 2 轮比较：mid=8 (值 42) 与目标 35 比对',
    desc: '当前区间 [6..10]，计算 mid = ⌊(6+10)/2⌋ = 8，元素为 42。因为 35 < 42，目标落在左半区间！更新 high = mid - 1 = 7。',
    low: 6,
    high: 7,
    mid: 6,
    found: false,
    comparedVal: 31
  },
  {
    title: '第 3 轮比较：mid=6 (值 31) 与目标 35 比对',
    desc: '当前区间 [6..7]，计算 mid = ⌊(6+7)/2⌋ = 6，元素为 31。因为 35 > 31，更新 low = mid + 1 = 7。',
    low: 7,
    high: 7,
    mid: 7,
    found: false,
    comparedVal: 35
  },
  {
    title: '第 4 轮比较：mid=7 (值 35) 匹配成功！🎉',
    desc: '当前区间 [7..7]，计算 mid = 7，元素为 35。35 == 35，命中目标，查找成功！共比较 4 次。',
    examTip: '命中叶结点层，用时 4 次比较。若查找不存在的元素（如 36），下一步 low 将超过 high (low > high) 宣布查找失败。',
    low: 7,
    high: 7,
    mid: 7,
    found: true,
    comparedVal: 35
  }
]

// ==========================================
// 2. AVL 旋转数据结构
// ==========================================
type AvlCase = 'LL' | 'RR' | 'LR' | 'RL'
const currentAvlCase = ref<AvlCase>('LL')

interface AvlStep {
  title: string
  desc: string
  examTip?: string
  nodes: { id: string; x: number; y: number; val: number; bf?: number; isNew?: boolean; isUnbalanced?: boolean }[]
  edges: [string, string][]
  highlightPath?: string[]
}

const avlStepsLL: AvlStep[] = [
  {
    title: '初始状态：平衡二叉树正常',
    desc: 'AVL 树包含节点 50, 30, 70, 20，所有节点的平衡因子 BF 均在 {-1, 0, 1} 内，整树平衡。',
    nodes: [
      { id: '50', x: 280, y: 35, val: 50, bf: 1 },
      { id: '30', x: 180, y: 95, val: 30, bf: 1 },
      { id: '70', x: 380, y: 95, val: 70, bf: 0 },
      { id: '20', x: 120, y: 155, val: 20, bf: 0 }
    ],
    edges: [['50', '30'], ['50', '70'], ['30', '20']]
  },
  {
    title: '插入新节点 10，触发失衡！',
    desc: '按 BST 规则，10 插入成为 20 的左孩子。自底向上回溯更新平衡因子：20 的 BF 变为 +1；30 的 BF 变为 +2（失衡！）；50 的 BF 变为 +2。',
    examTip: '408极高频考点：“最小失衡子树”是从新插入节点向上回溯遇到的第一个 BF 绝对值大于 1 的祖先结点。这里是 30！',
    nodes: [
      { id: '50', x: 280, y: 35, val: 50, bf: 2 },
      { id: '30', x: 180, y: 95, val: 30, bf: 2, isUnbalanced: true },
      { id: '70', x: 380, y: 95, val: 70, bf: 0 },
      { id: '20', x: 120, y: 155, val: 20, bf: 1 },
      { id: '10', x: 70, y: 215, val: 10, bf: 0, isNew: true }
    ],
    edges: [['50', '30'], ['50', '70'], ['30', '20'], ['20', '10']],
    highlightPath: ['30', '20', '10']
  },
  {
    title: '判定失衡类型：LL 型失衡（左孩子的左子树）',
    desc: '失衡结点 30 的左孩子是 20，新插入点在 20 的左侧（10），故属于 LL 型失衡。只需进行一次【右单旋】调整！',
    nodes: [
      { id: '50', x: 280, y: 35, val: 50, bf: 2 },
      { id: '30', x: 180, y: 95, val: 30, bf: 2, isUnbalanced: true },
      { id: '70', x: 380, y: 95, val: 70, bf: 0 },
      { id: '20', x: 120, y: 155, val: 20, bf: 1 },
      { id: '10', x: 70, y: 215, val: 10, bf: 0 }
    ],
    edges: [['50', '30'], ['50', '70'], ['30', '20'], ['20', '10']],
    highlightPath: ['30', '20', '10']
  },
  {
    title: '执行右单旋：20 上升为子树根，30 下沉为右孩子',
    desc: '右旋转使得 20 取代 30 成为新子树根，30 带着原有右子树下沉成为 20 的右孩子。整棵子树高度恢复为 2！',
    examTip: '旋转操作本质是指针重定向，时间复杂度恒为 O(1)。',
    nodes: [
      { id: '50', x: 280, y: 35, val: 50, bf: 1 },
      { id: '20', x: 180, y: 95, val: 20, bf: 0 },
      { id: '70', x: 380, y: 95, val: 70, bf: 0 },
      { id: '10', x: 120, y: 155, val: 10, bf: 0 },
      { id: '30', x: 240, y: 155, val: 30, bf: 0 }
    ],
    edges: [['50', '20'], ['50', '70'], ['20', '10'], ['20', '30']]
  }
]

const avlStepsLR: AvlStep[] = [
  {
    title: '初始状态：准备插入 25',
    desc: 'AVL 树包含 50, 30, 70, 20。准备向树中插入 25。',
    nodes: [
      { id: '50', x: 280, y: 35, val: 50, bf: 1 },
      { id: '30', x: 180, y: 95, val: 30, bf: 1 },
      { id: '70', x: 380, y: 95, val: 70, bf: 0 },
      { id: '20', x: 120, y: 155, val: 20, bf: 0 }
    ],
    edges: [['50', '30'], ['50', '70'], ['30', '20']]
  },
  {
    title: '插入 25 成为 20 的右孩子，触发 LR 型失衡！',
    desc: '25 插入到 20 的右侧。30 的 BF 达到 +2，失衡！路径为 30 → 20 → 25（左-右），故为 LR 型失衡。',
    examTip: 'LR 双旋口诀：“先左旋孩子，再右旋失衡根”。',
    nodes: [
      { id: '50', x: 280, y: 35, val: 50, bf: 2 },
      { id: '30', x: 180, y: 95, val: 30, bf: 2, isUnbalanced: true },
      { id: '70', x: 380, y: 95, val: 70, bf: 0 },
      { id: '20', x: 120, y: 155, val: 20, bf: -1 },
      { id: '25', x: 160, y: 215, val: 25, bf: 0, isNew: true }
    ],
    edges: [['50', '30'], ['50', '70'], ['30', '20'], ['20', '25']],
    highlightPath: ['30', '20', '25']
  },
  {
    title: '第一旋（左单旋）：对孩子 20 进行左旋，折线拉直',
    desc: '25 上升成为 20 的父节点，20 成为 25 的左孩子。原内折线 30-20-25 被拉直为 30-25-20（LL 形态）！',
    nodes: [
      { id: '50', x: 280, y: 35, val: 50, bf: 2 },
      { id: '30', x: 180, y: 95, val: 30, bf: 2, isUnbalanced: true },
      { id: '70', x: 380, y: 95, val: 70, bf: 0 },
      { id: '25', x: 120, y: 155, val: 25, bf: 1 },
      { id: '20', x: 80, y: 215, val: 20, bf: 0 }
    ],
    edges: [['50', '30'], ['50', '70'], ['30', '25'], ['25', '20']],
    highlightPath: ['30', '25', '20']
  },
  {
    title: '第二旋（右单旋）：对失衡根 30 进行右旋，大功告成！',
    desc: '对 30 执行右旋：25 登顶成为子树根，20 与 30 分居 25 的左右两侧。所有节点平衡因子归零，完美平衡！',
    nodes: [
      { id: '50', x: 280, y: 35, val: 50, bf: 1 },
      { id: '25', x: 180, y: 95, val: 25, bf: 0 },
      { id: '70', x: 380, y: 95, val: 70, bf: 0 },
      { id: '20', x: 120, y: 155, val: 20, bf: 0 },
      { id: '30', x: 240, y: 155, val: 30, bf: 0 }
    ],
    edges: [['50', '25'], ['50', '70'], ['25', '20'], ['25', '30']]
  }
]

// ==========================================
// 3. 5阶 B-树插入与分裂数据结构
// ==========================================
interface BTreeStep {
  title: string
  desc: string
  examTip?: string
  nodes: { id: string; x: number; y: number; keys: number[]; isOverflow?: boolean; isPromoted?: boolean }[]
  edges: [string, string][]
}

const bTreeSteps: BTreeStep[] = [
  {
    title: '初始状态：5 阶 B-树叶子结点已达上限 4',
    desc: '根结点包含 [30, 60, 90, 120]；最右叶结点 E 包含 4 个关键字 [125, 126, 128, 135]。',
    examTip: '408考点：m 阶 B-树中，每个非根结点最多 m-1 个关键字，最少 ⌈m/2⌉-1 个关键字。5 阶 B-树关键字个数限制为 2 ≤ n ≤ 4！',
    nodes: [
      { id: 'root', x: 270, y: 40, keys: [30, 60, 90, 120] },
      { id: 'e', x: 440, y: 130, keys: [125, 126, 128, 135] },
      { id: 'a', x: 100, y: 130, keys: [10, 20] },
      { id: 'b', x: 200, y: 130, keys: [40, 50] }
    ],
    edges: [['root', 'a'], ['root', 'b'], ['root', 'e']]
  },
  {
    title: '插入 132：叶结点关键字达到 5 个，触发上溢！',
    desc: '将 132 插入叶结点 E 的有序位置，此时 E 变为 [125, 126, 128, 132, 135]（5 个关键字，超出上限 4！）',
    nodes: [
      { id: 'root', x: 270, y: 40, keys: [30, 60, 90, 120] },
      { id: 'e', x: 440, y: 130, keys: [125, 126, 128, 132, 135], isOverflow: true },
      { id: 'a', x: 100, y: 130, keys: [10, 20] },
      { id: 'b', x: 200, y: 130, keys: [40, 50] }
    ],
    edges: [['root', 'a'], ['root', 'b'], ['root', 'e']]
  },
  {
    title: '拆分叶结点：中间第 3 个关键字 128 上升进入父结点',
    desc: '取 ⌈5/2⌉ = 第 3 个关键字 128 上升进入根结点；左边 [125, 126] 与右边 [132, 135] 各保留 2 个关键字分裂为两个新叶结点！',
    examTip: '分裂原则：中间位置 ⌈m/2⌉ 的关键字上升，左右两半各自成为独立的新结点。',
    nodes: [
      { id: 'root', x: 270, y: 40, keys: [30, 60, 90, 120, 128], isOverflow: true },
      { id: 'e1', x: 380, y: 130, keys: [125, 126] },
      { id: 'e2', x: 490, y: 130, keys: [132, 135] },
      { id: 'a', x: 100, y: 130, keys: [10, 20] },
      { id: 'b', x: 200, y: 130, keys: [40, 50] }
    ],
    edges: [['root', 'a'], ['root', 'b'], ['root', 'e1'], ['root', 'e2']]
  },
  {
    title: '根结点接纳 128 也超额，继续向上分裂形成新根！',
    desc: '根结点也达到 5 个关键字产生溢出！其中间关键字 90 再次上升生成全新根结点，树高由 2 层增加为 3 层！',
    examTip: 'B-树唯一的增高方式：自底向上的分裂一路波及到根结点，根结点分裂产生新根，树高加 1！',
    nodes: [
      { id: 'new-root', x: 270, y: 25, keys: [90], isPromoted: true },
      { id: 'left-parent', x: 150, y: 95, keys: [30, 60] },
      { id: 'right-parent', x: 390, y: 95, keys: [120, 128] },
      { id: 'e1', x: 370, y: 165, keys: [125, 126] },
      { id: 'e2', x: 470, y: 165, keys: [132, 135] },
      { id: 'a', x: 100, y: 165, keys: [10, 20] },
      { id: 'b', x: 190, y: 165, keys: [40, 50] }
    ],
    edges: [
      ['new-root', 'left-parent'],
      ['new-root', 'right-parent'],
      ['left-parent', 'a'],
      ['left-parent', 'b'],
      ['right-parent', 'e1'],
      ['right-parent', 'e2']
    ]
  }
]

// ==========================================
// 4. 散列表线性探测数据结构
// 容量 m=11, H(key) = key % 11
// 插入流: [19, 14, 23, 1, 68, 20, 84, 27]
// ==========================================
interface HashStep {
  title: string
  desc: string
  examTip?: string
  table: (number | null)[]
  currentKey: number | null
  targetSlot: number | null
  conflictSlots: number[]
  historyCounts: { key: number; comps: number }[]
  aslSuccess?: string
}

const hashSteps: HashStep[] = [
  {
    title: '初始状态：散列表长度 m=11，全空',
    desc: '散列函数 H(key) = key % 11，采用开放定址法中的线性探测法解决冲突。待插入流：[19, 14, 23, 1, 68, 20, 84, 27]。',
    examTip: '408考点：散列表的平均查找长度 ASL 取决于装填因子 α = n / m，与表长 m 无直接绝对关系。线性探测容易产生“聚集（堆积）”现象。',
    table: [null, null, null, null, null, null, null, null, null, null, null],
    currentKey: null,
    targetSlot: null,
    conflictSlots: [],
    historyCounts: []
  },
  {
    title: '插入 19: H(19) = 19 % 11 = 8',
    desc: '槽位 8 为空，直接放入 19。比较次数: 1。',
    table: [null, null, null, null, null, null, null, null, 19, null, null],
    currentKey: 19,
    targetSlot: 8,
    conflictSlots: [],
    historyCounts: [{ key: 19, comps: 1 }]
  },
  {
    title: '插入 14: H(14) = 14 % 11 = 3',
    desc: '槽位 3 为空，直接放入 14。比较次数: 1。',
    table: [null, null, null, 14, null, null, null, null, 19, null, null],
    currentKey: 14,
    targetSlot: 3,
    conflictSlots: [],
    historyCounts: [{ key: 19, comps: 1 }, { key: 14, comps: 1 }]
  },
  {
    title: '插入 23: H(23) = 23 % 11 = 1',
    desc: '槽位 1 为空，直接放入 23。比较次数: 1。',
    table: [null, 23, null, 14, null, null, null, null, 19, null, null],
    currentKey: 23,
    targetSlot: 1,
    conflictSlots: [],
    historyCounts: [{ key: 19, comps: 1 }, { key: 14, comps: 1 }, { key: 23, comps: 1 }]
  },
  {
    title: '插入 1: H(1) = 1 % 11 = 1，触发冲突！⚡',
    desc: '槽位 1 已有 23 占用！线性探测顺移到槽位 (1+1)%11 = 2，槽位 2 为空，放入 1。比较次数: 2。',
    examTip: '发生冲突时，顺次探测下一个地址 d_i = (H(key) + i) % m。',
    table: [null, 23, 1, 14, null, null, null, null, 19, null, null],
    currentKey: 1,
    targetSlot: 2,
    conflictSlots: [1],
    historyCounts: [{ key: 19, comps: 1 }, { key: 14, comps: 1 }, { key: 23, comps: 1 }, { key: 1, comps: 2 }]
  },
  {
    title: '插入 68: H(68) = 68 % 11 = 2，连续 2 次冲突！⚡⚡',
    desc: '槽位 2 冲突（有 1），顺移到槽位 3 也冲突（有 14），再顺移到槽位 4 为空，放入 68！比较次数: 3。',
    table: [null, 23, 1, 14, 68, null, null, null, 19, null, null],
    currentKey: 68,
    targetSlot: 4,
    conflictSlots: [2, 3],
    historyCounts: [
      { key: 19, comps: 1 }, { key: 14, comps: 1 }, { key: 23, comps: 1 },
      { key: 1, comps: 2 }, { key: 68, comps: 3 }
    ]
  },
  {
    title: '完成全部 8 个元素插入，计算 ASL_成功！',
    desc: '8 个元素总比较次数 = 1 + 1 + 1 + 2 + 3 + 1 + 1 + 1 = 11。',
    examTip: 'ASL_成功 = (比较总次数) / (元素个数) = 11 / 8 = 1.375！',
    table: [null, 23, 1, 14, 68, 27, null, 84, 19, 20, null],
    currentKey: null,
    targetSlot: null,
    conflictSlots: [],
    historyCounts: [
      { key: 19, comps: 1 }, { key: 14, comps: 1 }, { key: 23, comps: 1 },
      { key: 1, comps: 2 }, { key: 68, comps: 3 }, { key: 20, comps: 1 },
      { key: 84, comps: 1 }, { key: 27, comps: 1 }
    ],
    aslSuccess: 'ASL_成功 = (1+1+1+2+3+1+1+1) / 8 = 11 / 8 = 1.375'
  }
]

const currentMode = ref<SearchMode>('binary-search')
const stepIndex = ref(0)
const isPlaying = ref(false)
const playSpeed = ref(1800)
let timer: any = null

const totalSteps = computed(() => {
  if (currentMode.value === 'binary-search') return binarySearchSteps.length
  if (currentMode.value === 'avl-rotate') {
    return currentAvlCase.value === 'LL' ? avlStepsLL.length : avlStepsLR.length
  }
  if (currentMode.value === 'b-tree') return bTreeSteps.length
  return hashSteps.length
})

function setMode(mode: SearchMode) {
  pause()
  currentMode.value = mode
  stepIndex.value = 0
}

function setAvlCase(c: AvlCase) {
  pause()
  currentAvlCase.value = c
  stepIndex.value = 0
}

function nextStep() {
  if (stepIndex.value < totalSteps.value - 1) stepIndex.value++
  else pause()
}

function prevStep() {
  if (stepIndex.value > 0) stepIndex.value--
}

function reset() {
  pause()
  stepIndex.value = 0
}

function togglePlay() {
  if (isPlaying.value) pause()
  else play()
}

function play() {
  if (stepIndex.value >= totalSteps.value - 1) stepIndex.value = 0
  isPlaying.value = true
  timer = setInterval(() => {
    if (stepIndex.value < totalSteps.value - 1) stepIndex.value++
    else pause()
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
  <div class="search-player-card">
    <!-- 头部导航与模式切换 -->
    <div class="player-header">
      <div class="title-group">
        <span class="player-icon">🔍</span>
        <div>
          <div class="player-main-title">查找算法与数据结构全景演示系统</div>
          <div class="player-sub-title">408 核心重难点 · 折半查找区间收缩、AVL 4种平衡旋转、B-树插入分裂与散列表冲突探测</div>
        </div>
      </div>
      <div class="mode-tabs">
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'binary-search' }"
          @click="setMode('binary-search')"
        >
          折半查找区间
        </button>
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'avl-rotate' }"
          @click="setMode('avl-rotate')"
        >
          AVL 平衡旋转
        </button>
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'b-tree' }"
          @click="setMode('b-tree')"
        >
          5阶 B-树分裂
        </button>
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'hash-table' }"
          @click="setMode('hash-table')"
        >
          散列表线性探测
        </button>
      </div>
    </div>

    <!-- 控制工具栏 -->
    <div class="player-controls">
      <div class="btn-group">
        <button class="ctrl-btn" :disabled="stepIndex === 0" @click="reset">⏮ 重置</button>
        <button class="ctrl-btn" :disabled="stepIndex === 0" @click="prevStep">◀ 上一步</button>
        <button class="ctrl-btn play-btn" @click="togglePlay">
          {{ isPlaying ? '⏸ 暂停' : '▶ 自动播放' }}
        </button>
        <button class="ctrl-btn" :disabled="stepIndex === totalSteps - 1" @click="nextStep">下一步 ▶</button>
      </div>

      <div class="slider-group">
        <span class="step-counter">步骤: <strong>{{ stepIndex + 1 }}</strong> / {{ totalSteps }}</span>
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
      <!-- 1. 折半查找解释 -->
      <template v-if="currentMode === 'binary-search'">
        <div class="step-title-line">
          <span class="step-badge">Step {{ stepIndex + 1 }}</span>
          <span class="step-heading">{{ binarySearchSteps[stepIndex].title }}</span>
        </div>
        <p class="step-desc">{{ binarySearchSteps[stepIndex].desc }}</p>
        <div v-if="binarySearchSteps[stepIndex].examTip" class="exam-tip-box">
          <span class="tip-icon">💡</span>
          <span>{{ binarySearchSteps[stepIndex].examTip }}</span>
        </div>
      </template>

      <!-- 2. AVL 旋转解释 -->
      <template v-else-if="currentMode === 'avl-rotate'">
        <div class="case-sub-tabs">
          <span class="sub-label">旋转类型选择:</span>
          <button
            class="sub-btn"
            :class="{ active: currentAvlCase === 'LL' }"
            @click="setAvlCase('LL')"
          >
            LL 右单旋案例
          </button>
          <button
            class="sub-btn"
            :class="{ active: currentAvlCase === 'LR' }"
            @click="setAvlCase('LR')"
          >
            LR 先左后右双旋案例
          </button>
        </div>
        <div class="step-title-line">
          <span class="step-badge avl-badge">Step {{ stepIndex + 1 }}</span>
          <span class="step-heading">
            {{ currentAvlCase === 'LL' ? avlStepsLL[stepIndex].title : avlStepsLR[stepIndex].title }}
          </span>
        </div>
        <p class="step-desc">
          {{ currentAvlCase === 'LL' ? avlStepsLL[stepIndex].desc : avlStepsLR[stepIndex].desc }}
        </p>
        <div
          v-if="currentAvlCase === 'LL' ? avlStepsLL[stepIndex].examTip : avlStepsLR[stepIndex].examTip"
          class="exam-tip-box"
        >
          <span class="tip-icon">💡</span>
          <span>{{ currentAvlCase === 'LL' ? avlStepsLL[stepIndex].examTip : avlStepsLR[stepIndex].examTip }}</span>
        </div>
      </template>

      <!-- 3. B-树解释 -->
      <template v-else-if="currentMode === 'b-tree'">
        <div class="step-title-line">
          <span class="step-badge btree-badge">Step {{ stepIndex + 1 }}</span>
          <span class="step-heading">{{ bTreeSteps[stepIndex].title }}</span>
        </div>
        <p class="step-desc">{{ bTreeSteps[stepIndex].desc }}</p>
        <div v-if="bTreeSteps[stepIndex].examTip" class="exam-tip-box">
          <span class="tip-icon">💡</span>
          <span>{{ bTreeSteps[stepIndex].examTip }}</span>
        </div>
      </template>

      <!-- 4. 散列表解释 -->
      <template v-else>
        <div class="step-title-line">
          <span class="step-badge hash-badge">Step {{ stepIndex + 1 }}</span>
          <span class="step-heading">{{ hashSteps[stepIndex].title }}</span>
        </div>
        <p class="step-desc">{{ hashSteps[stepIndex].desc }}</p>
        <div v-if="hashSteps[stepIndex].aslSuccess" class="wpl-badge-box">
          ✨ <strong>{{ hashSteps[stepIndex].aslSuccess }}</strong>
        </div>
        <div v-if="hashSteps[stepIndex].examTip" class="exam-tip-box">
          <span class="tip-icon">💡</span>
          <span>{{ hashSteps[stepIndex].examTip }}</span>
        </div>
      </template>
    </div>

    <!-- 舞台展示区 -->
    <div class="stage-container">
      <!-- 模式 1: 折半查找 -->
      <div v-if="currentMode === 'binary-search'" class="bs-stage">
        <div class="target-card">
          🎯 查找目标: <strong class="target-val">{{ bsTarget }}</strong>
          <span class="search-status" :class="{ 'is-found': binarySearchSteps[stepIndex].found }">
            {{ binarySearchSteps[stepIndex].found ? '✅ 查找成功 (第 ' + (stepIndex + 1) + ' 次命中)' : '⏳ 正在折半缩小区间...' }}
          </span>
        </div>

        <div class="array-container">
          <div
            v-for="(val, idx) in bsArray"
            :key="idx"
            class="array-cell"
            :class="{
              'in-range': idx >= binarySearchSteps[stepIndex].low && idx <= binarySearchSteps[stepIndex].high,
              'out-range': idx < binarySearchSteps[stepIndex].low || idx > binarySearchSteps[stepIndex].high,
              'is-mid': idx === binarySearchSteps[stepIndex].mid,
              'is-hit': binarySearchSteps[stepIndex].found && idx === binarySearchSteps[stepIndex].mid
            }"
          >
            <!-- 顶部指针标签 -->
            <div class="pointer-tags">
              <span v-if="idx === binarySearchSteps[stepIndex].low" class="pt-tag low-tag">low</span>
              <span v-if="idx === binarySearchSteps[stepIndex].mid" class="pt-tag mid-tag">mid</span>
              <span v-if="idx === binarySearchSteps[stepIndex].high" class="pt-tag high-tag">high</span>
            </div>
            <div class="cell-val">{{ val }}</div>
            <div class="cell-idx">[{{ idx }}]</div>
          </div>
        </div>
      </div>

      <!-- 模式 2: AVL 平衡旋转 -->
      <div v-else-if="currentMode === 'avl-rotate'" class="avl-stage">
        <div class="tree-svg-card">
          <svg viewBox="0 0 540 240" width="100%" height="240" class="tree-svg">
            <!-- 连线 -->
            <g class="edges">
              <line
                v-for="(edge, idx) in (currentAvlCase === 'LL' ? avlStepsLL[stepIndex].edges : avlStepsLR[stepIndex].edges)"
                :key="idx"
                :x1="(currentAvlCase === 'LL' ? avlStepsLL[stepIndex].nodes : avlStepsLR[stepIndex].nodes).find(n => n.id === edge[0])?.x || 0"
                :y1="(currentAvlCase === 'LL' ? avlStepsLL[stepIndex].nodes : avlStepsLR[stepIndex].nodes).find(n => n.id === edge[0])?.y || 0"
                :x2="(currentAvlCase === 'LL' ? avlStepsLL[stepIndex].nodes : avlStepsLR[stepIndex].nodes).find(n => n.id === edge[1])?.x || 0"
                :y2="(currentAvlCase === 'LL' ? avlStepsLL[stepIndex].nodes : avlStepsLR[stepIndex].nodes).find(n => n.id === edge[1])?.y || 0"
                stroke="var(--vp-c-divider)"
                stroke-width="2.2"
              />
            </g>

            <!-- 节点 -->
            <g class="nodes">
              <g
                v-for="n in (currentAvlCase === 'LL' ? avlStepsLL[stepIndex].nodes : avlStepsLR[stepIndex].nodes)"
                :key="n.id"
                :transform="`translate(${n.x}, ${n.y})`"
              >
                <circle
                  cx="0"
                  cy="0"
                  r="16"
                  :class="[
                    'tree-circle',
                    {
                      'unbalanced-circle': n.isUnbalanced,
                      'new-circle': n.isNew,
                      'normal-avl-circle': !n.isUnbalanced && !n.isNew
                    }
                  ]"
                />
                <text x="0" y="4.5" text-anchor="middle" class="node-label">{{ n.val }}</text>
                <!-- 平衡因子标签 -->
                <text x="22" y="3" class="bf-tag" :class="{ 'bf-red': Math.abs(n.bf || 0) >= 2 }">
                  BF={{ n.bf !== undefined ? (n.bf > 0 ? '+' + n.bf : n.bf) : '0' }}
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <!-- 模式 3: 5阶 B-树分裂 -->
      <div v-else-if="currentMode === 'b-tree'" class="btree-stage">
        <div class="tree-svg-card">
          <svg viewBox="0 0 580 220" width="100%" height="220" class="tree-svg">
            <!-- 连线 -->
            <g class="edges">
              <line
                v-for="(edge, idx) in bTreeSteps[stepIndex].edges"
                :key="idx"
                :x1="bTreeSteps[stepIndex].nodes.find(n => n.id === edge[0])?.x || 0"
                :y1="(bTreeSteps[stepIndex].nodes.find(n => n.id === edge[0])?.y || 0) + 12"
                :x2="bTreeSteps[stepIndex].nodes.find(n => n.id === edge[1])?.x || 0"
                :y2="(bTreeSteps[stepIndex].nodes.find(n => n.id === edge[1])?.y || 0) - 12"
                stroke="var(--vp-c-divider)"
                stroke-width="2"
              />
            </g>

            <!-- 节点 -->
            <g class="nodes">
              <g
                v-for="n in bTreeSteps[stepIndex].nodes"
                :key="n.id"
                :transform="`translate(${n.x}, ${n.y})`"
              >
                <!-- 多关键字矩形框 -->
                <rect
                  :x="-n.keys.length * 18"
                  y="-14"
                  :width="n.keys.length * 36"
                  height="28"
                  rx="6"
                  :class="[
                    'btree-box',
                    {
                      'overflow-box': n.isOverflow,
                      'promoted-box': n.isPromoted
                    }
                  ]"
                />
                <!-- 关键字数值 -->
                <g v-for="(k, kIdx) in n.keys" :key="kIdx">
                  <text
                    :x="-n.keys.length * 18 + kIdx * 36 + 18"
                    y="5"
                    text-anchor="middle"
                    class="btree-key"
                  >
                    {{ k }}
                  </text>
                  <line
                    v-if="kIdx > 0"
                    :x1="-n.keys.length * 18 + kIdx * 36"
                    y1="-14"
                    :x2="-n.keys.length * 18 + kIdx * 36"
                    y2="14"
                    stroke="var(--vp-c-divider)"
                    stroke-width="1"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <!-- 模式 4: 散列表线性探测 -->
      <div v-else class="hash-stage">
        <div class="hash-info-row">
          <span>散列函数: <strong>H(key) = key % 11</strong></span>
          <span v-if="hashSteps[stepIndex].currentKey !== null">
            当前插入: <strong>{{ hashSteps[stepIndex].currentKey }}</strong> ➔ 目标槽位 [{{ hashSteps[stepIndex].targetSlot }}]
          </span>
        </div>

        <div class="hash-table-grid">
          <div
            v-for="(val, idx) in hashSteps[stepIndex].table"
            :key="idx"
            class="hash-cell"
            :class="{
              'is-active-slot': idx === hashSteps[stepIndex].targetSlot,
              'is-conflict-slot': hashSteps[stepIndex].conflictSlots.includes(idx)
            }"
          >
            <div class="hash-idx">槽位 {{ idx }}</div>
            <div class="hash-val">{{ val !== null ? val : '∅' }}</div>
            <div v-if="hashSteps[stepIndex].conflictSlots.includes(idx)" class="conflict-badge">
              ⚡ 冲突
            </div>
          </div>
        </div>

        <div v-if="hashSteps[stepIndex].historyCounts.length > 0" class="history-counts-row">
          <span class="counts-title">各关键字比较次数记录:</span>
          <div class="counts-chips">
            <span
              v-for="item in hashSteps[stepIndex].historyCounts"
              :key="item.key"
              class="count-chip"
              :class="{ 'high-comp': item.comps > 1 }"
            >
              {{ item.key }}: <strong>{{ item.comps }}次</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-player-card {
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
  font-size: 12.5px;
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

.avl-badge { background: #7c3aed; }
.btree-badge { background: #059669; }
.hash-badge { background: #ea580c; }

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

.case-sub-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.sub-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.sub-btn {
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 600;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  cursor: pointer;
  color: var(--vp-c-text-2);
}

.sub-btn.active {
  background: #7c3aed;
  color: #fff;
  border-color: #7c3aed;
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

.wpl-badge-box {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(234, 88, 12, 0.1);
  border: 1px solid #ea580c;
  color: #ea580c;
  font-size: 13px;
  margin-bottom: 8px;
}

.tip-icon { font-size: 15px; }

.stage-container {
  padding: 20px;
  min-height: 320px;
}

/* 折半查找样式 */
.target-card {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 16px;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.target-val {
  color: #2563eb;
  font-size: 16px;
  font-family: monospace;
}

.search-status {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.search-status.is-found {
  color: #10b981;
  font-weight: 700;
}

.array-container {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 10px 4px;
}

.array-cell {
  flex: 1;
  min-width: 44px;
  background: var(--vp-c-bg);
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 6px;
  text-align: center;
  padding: 6px 2px;
  position: relative;
  transition: all 0.3s;
}

.array-cell.in-range {
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.04);
}

.array-cell.out-range {
  opacity: 0.35;
  background: var(--vp-c-bg-alt);
}

.array-cell.is-mid {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.15);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
  transform: translateY(-2px);
}

.array-cell.is-hit {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.2);
  box-shadow: 0 0 14px rgba(16, 185, 129, 0.4);
}

.pointer-tags {
  height: 18px;
  display: flex;
  justify-content: center;
  gap: 2px;
}

.pt-tag {
  font-size: 9.5px;
  font-weight: 700;
  padding: 1px 3px;
  border-radius: 3px;
  color: #fff;
}

.low-tag { background: #2563eb; }
.mid-tag { background: #f59e0b; }
.high-tag { background: #7c3aed; }

.cell-val {
  font-size: 16px;
  font-weight: 800;
  font-family: monospace;
  color: var(--vp-c-text-1);
  margin: 4px 0;
}

.cell-idx {
  font-size: 10px;
  color: var(--vp-c-text-3);
}

/* AVL / BTree SVG 样式 */
.tree-svg-card {
  background: var(--vp-c-bg);
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px;
}

.tree-svg {
  display: block;
  margin: 0 auto;
}

.tree-circle {
  stroke-width: 2;
  transition: all 0.3s;
}

.normal-avl-circle {
  fill: #2563eb;
  stroke: #1d4ed8;
}

.unbalanced-circle {
  fill: #ef4444;
  stroke: #dc2626;
  animation: pulse-ring 1s infinite;
}

.new-circle {
  fill: #f59e0b;
  stroke: #d97706;
}

.node-label {
  font-size: 12px;
  font-weight: 800;
  fill: #fff;
}

.bf-tag {
  font-size: 10.5px;
  font-weight: 700;
  fill: var(--vp-c-text-2);
}

.bf-red {
  fill: #ef4444;
  font-weight: 800;
}

.btree-box {
  fill: var(--vp-c-bg-alt);
  stroke: var(--vp-c-brand-1);
  stroke-width: 1.8;
  transition: all 0.3s;
}

.overflow-box {
  stroke: #ef4444;
  stroke-width: 2.2;
  fill: rgba(239, 68, 68, 0.08);
}

.promoted-box {
  stroke: #10b981;
  stroke-width: 2.5;
  fill: rgba(16, 185, 129, 0.12);
}

.btree-key {
  font-size: 12.5px;
  font-weight: 700;
  fill: var(--vp-c-text-1);
  font-family: monospace;
}

/* 散列表样式 */
.hash-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
}

.hash-table-grid {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: 6px;
  margin-bottom: 16px;
}

.hash-cell {
  background: var(--vp-c-bg);
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 8px 2px;
  text-align: center;
  position: relative;
  transition: all 0.2s;
}

.hash-cell.is-active-slot {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}

.hash-cell.is-conflict-slot {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

.hash-idx {
  font-size: 10px;
  color: var(--vp-c-text-3);
  margin-bottom: 2px;
}

.hash-val {
  font-size: 16px;
  font-weight: 800;
  font-family: monospace;
  color: var(--vp-c-text-1);
}

.conflict-badge {
  font-size: 9.5px;
  color: #ef4444;
  font-weight: 700;
  margin-top: 2px;
}

.history-counts-row {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 10px 14px;
}

.counts-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  display: block;
  margin-bottom: 6px;
}

.counts-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.count-chip {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.count-chip.high-comp {
  border-color: #f59e0b;
  color: #d97706;
}

@media (max-width: 768px) {
  .hash-table-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
