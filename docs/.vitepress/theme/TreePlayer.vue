<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

type TreeMode = 'post-in' | 'pre-in' | 'huffman'

interface TreeStep {
  title: string
  desc: string
  examTip?: string
  // 序列高亮信息
  seq1Label: string
  seq1: string[]
  seq1Highlights: { index: number; type: 'root' | 'left' | 'right' }[]
  seq2Label: string
  seq2: string[]
  seq2Highlights: { index: number; type: 'root' | 'left' | 'right' }[]
  // 树中已显示的节点与连线
  activeNodes: string[]
  currentRoot?: string
  edges: [string, string][]
  // 树节点坐标布局
  nodeLayout: Record<string, { x: number; y: number; label: string; color?: string }>
}

interface HuffmanStep {
  title: string
  desc: string
  examTip?: string
  // 森林中的树列表
  forest: { id: string; weight: number; rootLabel: string }[]
  selectedIds: string[]
  // 树中所有节点与连线
  nodes: { id: string; x: number; y: number; weight: number; isLeaf?: boolean }[]
  edges: [string, string][]
  wplCalculation?: string
}

const currentMode = ref<TreeMode>('post-in')
const stepIndex = ref(0)
const isPlaying = ref(false)
const playSpeed = ref(1800)
let timer: any = null

// ==========================================
// 模式 1: 后序 + 中序 还原二叉树
// 后序: [D, E, B, F, C, A]
// 中序: [D, B, E, A, F, C]
// 构造二叉树:
//       A
//      / \
//     B   C
//    / \   \
//   D   E   F
// ==========================================
const baseTreeLayout: Record<string, { x: number; y: number; label: string }> = {
  A: { x: 300, y: 35, label: 'A' },
  B: { x: 190, y: 100, label: 'B' },
  C: { x: 410, y: 100, label: 'C' },
  D: { x: 130, y: 170, label: 'D' },
  E: { x: 250, y: 170, label: 'E' },
  F: { x: 470, y: 170, label: 'F' }
}

const postInSteps: TreeStep[] = [
  {
    title: '初始状态：输入后序与中序序列',
    desc: '后序遍历为 [D, E, B, F, C, A]，中序遍历为 [D, B, E, A, F, C]。准备开始自顶向下递归构建二叉树。',
    examTip: '408高频考点：后序遍历的“最后一个元素”必定是整棵树（或当前子树）的根结点！',
    seq1Label: '后序序列',
    seq1: ['D', 'E', 'B', 'F', 'C', 'A'],
    seq1Highlights: [],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [],
    activeNodes: [],
    edges: [],
    nodeLayout: baseTreeLayout
  },
  {
    title: '第一步：后序末位确定整树根结点 A',
    desc: '查看后序序列最后一个元素为 A，故 A 为二叉树的根结点！在视图中生成根结点 A。',
    examTip: '后序序列结构为：[左子树后序, 右子树后序, 根]。',
    seq1Label: '后序序列',
    seq1: ['D', 'E', 'B', 'F', 'C', 'A'],
    seq1Highlights: [{ index: 5, type: 'root' }],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [{ index: 3, type: 'root' }],
    activeNodes: ['A'],
    currentRoot: 'A',
    edges: [],
    nodeLayout: baseTreeLayout
  },
  {
    title: '第二步：在中序序列中以 A 为界切分子树区间',
    desc: '在中序序列中找到 A（下标 3）：A 左侧的 [D, B, E] 构成左子树（长度 3）；A 右侧的 [F, C] 构成右子树（长度 2）。后序序列相应划分为左 [D, E, B] 与右 [F, C]。',
    examTip: '中序遍历结构为：[左子树中序, 根, 右子树中序]，左右子树结点个数与后序严格对应。',
    seq1Label: '后序序列',
    seq1: ['D', 'E', 'B', 'F', 'C', 'A'],
    seq1Highlights: [
      { index: 0, type: 'left' },
      { index: 1, type: 'left' },
      { index: 2, type: 'left' },
      { index: 3, type: 'right' },
      { index: 4, type: 'right' },
      { index: 5, type: 'root' }
    ],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [
      { index: 0, type: 'left' },
      { index: 1, type: 'left' },
      { index: 2, type: 'left' },
      { index: 3, type: 'root' },
      { index: 4, type: 'right' },
      { index: 5, type: 'right' }
    ],
    activeNodes: ['A'],
    currentRoot: 'A',
    edges: [],
    nodeLayout: baseTreeLayout
  },
  {
    title: '第三步：递归求解左子树，后序末位确定根 B',
    desc: '观察左子树后序 [D, E, B]，其末位为 B，故 B 为左子树的根！A 的左指针连接到 B。在中序 [D, B, E] 中以 B 为界：D 为 B 的左孩子，E 为 B 的右孩子。',
    seq1Label: '后序序列',
    seq1: ['D', 'E', 'B', 'F', 'C', 'A'],
    seq1Highlights: [{ index: 2, type: 'root' }],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [{ index: 1, type: 'root' }],
    activeNodes: ['A', 'B'],
    currentRoot: 'B',
    edges: [['A', 'B']],
    nodeLayout: baseTreeLayout
  },
  {
    title: '第四步：挂接左子树叶结点 D 与 E',
    desc: 'D 和 E 各自只有 1 个结点，直接作为 B 的左、右孩子接入树中。左子树构建完毕！',
    seq1Label: '后序序列',
    seq1: ['D', 'E', 'B', 'F', 'C', 'A'],
    seq1Highlights: [
      { index: 0, type: 'left' },
      { index: 1, type: 'left' }
    ],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [
      { index: 0, type: 'left' },
      { index: 2, type: 'left' }
    ],
    activeNodes: ['A', 'B', 'D', 'E'],
    edges: [
      ['A', 'B'],
      ['B', 'D'],
      ['B', 'E']
    ],
    nodeLayout: baseTreeLayout
  },
  {
    title: '第五步：递归求解右子树，后序末位确定根 C',
    desc: '观察右子树后序 [F, C]，末位为 C，故 C 为右子树的根！A 的右指针连接到 C。在中序 [F, C] 中，F 位于 C 的左侧，故 F 为 C 的左孩子，C 无右孩子！',
    seq1Label: '后序序列',
    seq1: ['D', 'E', 'B', 'F', 'C', 'A'],
    seq1Highlights: [{ index: 4, type: 'root' }],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [{ index: 5, type: 'root' }],
    activeNodes: ['A', 'B', 'D', 'E', 'C'],
    currentRoot: 'C',
    edges: [
      ['A', 'B'],
      ['B', 'D'],
      ['B', 'E'],
      ['A', 'C']
    ],
    nodeLayout: baseTreeLayout
  },
  {
    title: '第六步：挂接 F 到 C 的左侧，构建圆满完成！',
    desc: 'F 作为 C 的左孩子接入，整棵二叉树唯一确定并成功复原！',
    examTip: '核心定理：只有包含“中序遍历”与其他任一遍历序列（先序、后序或层序），才能唯一确定一棵二叉树；先序 + 后序无法唯一确定二叉树！',
    seq1Label: '后序序列',
    seq1: ['D', 'E', 'B', 'F', 'C', 'A'],
    seq1Highlights: [],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [],
    activeNodes: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      ['A', 'B'],
      ['B', 'D'],
      ['B', 'E'],
      ['A', 'C'],
      ['C', 'F']
    ],
    nodeLayout: baseTreeLayout
  }
]

// ==========================================
// 模式 2: 先序 + 中序 还原二叉树
// 先序: [A, B, D, E, C, F]
// 中序: [D, B, E, A, F, C]
// ==========================================
const preInSteps: TreeStep[] = [
  {
    title: '初始状态：输入先序与中序序列',
    desc: '先序遍历为 [A, B, D, E, C, F]，中序遍历为 [D, B, E, A, F, C]。准备开始自顶向下找根划分子树。',
    examTip: '408高频考点：先序遍历的“第一个元素”必定是整棵树（或当前子树）的根结点！',
    seq1Label: '先序序列',
    seq1: ['A', 'B', 'D', 'E', 'C', 'F'],
    seq1Highlights: [],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [],
    activeNodes: [],
    edges: [],
    nodeLayout: baseTreeLayout
  },
  {
    title: '第一步：先序首位确定整树根结点 A',
    desc: '先序序列首位为 A，因此 A 必定是根结点！在中序中找到 A（下标 3）。',
    seq1Label: '先序序列',
    seq1: ['A', 'B', 'D', 'E', 'C', 'F'],
    seq1Highlights: [{ index: 0, type: 'root' }],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [{ index: 3, type: 'root' }],
    activeNodes: ['A'],
    currentRoot: 'A',
    edges: [],
    nodeLayout: baseTreeLayout
  },
  {
    title: '第二步：中序切分左右子树区间',
    desc: '中序中 A 左侧的 [D, B, E] 为左子树（长度 3），A 右侧的 [F, C] 为右子树（长度 2）。先序相应划分为左 [B, D, E] 与右 [C, F]。',
    seq1Label: '先序序列',
    seq1: ['A', 'B', 'D', 'E', 'C', 'F'],
    seq1Highlights: [
      { index: 0, type: 'root' },
      { index: 1, type: 'left' },
      { index: 2, type: 'left' },
      { index: 3, type: 'left' },
      { index: 4, type: 'right' },
      { index: 5, type: 'right' }
    ],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [
      { index: 0, type: 'left' },
      { index: 1, type: 'left' },
      { index: 2, type: 'left' },
      { index: 3, type: 'root' },
      { index: 4, type: 'right' },
      { index: 5, type: 'right' }
    ],
    activeNodes: ['A'],
    currentRoot: 'A',
    edges: [],
    nodeLayout: baseTreeLayout
  },
  {
    title: '第三步：左子树先序首位为 B，挂接左孩子',
    desc: '左子树先序 [B, D, E] 首位为 B，B 是左子树根！在中序 [D, B, E] 中，D 在 B 左，E 在 B 右。',
    seq1Label: '先序序列',
    seq1: ['A', 'B', 'D', 'E', 'C', 'F'],
    seq1Highlights: [{ index: 1, type: 'root' }],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [{ index: 1, type: 'root' }],
    activeNodes: ['A', 'B', 'D', 'E'],
    edges: [
      ['A', 'B'],
      ['B', 'D'],
      ['B', 'E']
    ],
    nodeLayout: baseTreeLayout
  },
  {
    title: '第四步：右子树先序首位为 C，挂接右孩子',
    desc: '右子树先序 [C, F] 首位为 C，C 是右子树根！在中序 [F, C] 中 F 在 C 左边，所以 F 是 C 的左孩子。',
    seq1Label: '先序序列',
    seq1: ['A', 'B', 'D', 'E', 'C', 'F'],
    seq1Highlights: [{ index: 4, type: 'root' }],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [{ index: 5, type: 'root' }],
    activeNodes: ['A', 'B', 'D', 'E', 'C', 'F'],
    edges: [
      ['A', 'B'],
      ['B', 'D'],
      ['B', 'E'],
      ['A', 'C'],
      ['C', 'F']
    ],
    nodeLayout: baseTreeLayout
  },
  {
    title: '第五步：二叉树重构完毕，结构完全一致',
    desc: '先序+中序 与 后序+中序 还原出完全相同的二叉树形态，验证了双序列定树的严密逻辑！',
    examTip: '真题高频题型：给定先序与中序，求其后序遍历。直接画出树后写出后序即可秒杀！',
    seq1Label: '先序序列',
    seq1: ['A', 'B', 'D', 'E', 'C', 'F'],
    seq1Highlights: [],
    seq2Label: '中序序列',
    seq2: ['D', 'B', 'E', 'A', 'F', 'C'],
    seq2Highlights: [],
    activeNodes: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      ['A', 'B'],
      ['B', 'D'],
      ['B', 'E'],
      ['A', 'C'],
      ['C', 'F']
    ],
    nodeLayout: baseTreeLayout
  }
]

// ==========================================
// 模式 3: 哈夫曼树 (Huffman Tree) 贪心构建
// 叶子权值: [2, 3, 6, 7, 10, 19]
// 合并步骤:
// 1. 选 2, 3 合并为 5
// 2. 选 5, 6 合并为 11
// 3. 选 7, 10 合并为 17
// 4. 选 11, 17 合并为 28
// 5. 选 19, 28 合并为 47
// ==========================================
const huffmanSteps: HuffmanStep[] = [
  {
    title: '初始状态：6 个带权叶子节点构成森林',
    desc: '给定 6 个叶子节点权值集合：[2, 3, 6, 7, 10, 19]。每个节点自成一棵单节点二叉树。',
    examTip: '408考点：n 个叶子节点的哈夫曼树中没有度为 1 的节点，总节点数恒为 2n - 1。此处 n=6，总节点数必定为 11！',
    forest: [
      { id: '2', weight: 2, rootLabel: '2' },
      { id: '3', weight: 3, rootLabel: '3' },
      { id: '6', weight: 6, rootLabel: '6' },
      { id: '7', weight: 7, rootLabel: '7' },
      { id: '10', weight: 10, rootLabel: '10' },
      { id: '19', weight: 19, rootLabel: '19' }
    ],
    selectedIds: [],
    nodes: [
      { id: '2', x: 60, y: 190, weight: 2, isLeaf: true },
      { id: '3', x: 120, y: 190, weight: 3, isLeaf: true },
      { id: '6', x: 200, y: 190, weight: 6, isLeaf: true },
      { id: '7', x: 280, y: 190, weight: 7, isLeaf: true },
      { id: '10', x: 360, y: 190, weight: 10, isLeaf: true },
      { id: '19', x: 500, y: 190, weight: 19, isLeaf: true }
    ],
    edges: []
  },
  {
    title: '第一轮合并：选取权值最小的 2 和 3 合并为 5',
    desc: '从森林中选出最小的两个权值 2 和 3，生成新内部节点 5，原 2 和 3 作为左右孩子。森林剩余：[5, 6, 7, 10, 19]。',
    forest: [
      { id: '5', weight: 5, rootLabel: '5' },
      { id: '6', weight: 6, rootLabel: '6' },
      { id: '7', weight: 7, rootLabel: '7' },
      { id: '10', weight: 10, rootLabel: '10' },
      { id: '19', weight: 19, rootLabel: '19' }
    ],
    selectedIds: ['2', '3'],
    nodes: [
      { id: '2', x: 60, y: 190, weight: 2, isLeaf: true },
      { id: '3', x: 120, y: 190, weight: 3, isLeaf: true },
      { id: '5', x: 90, y: 140, weight: 5 },
      { id: '6', x: 200, y: 190, weight: 6, isLeaf: true },
      { id: '7', x: 280, y: 190, weight: 7, isLeaf: true },
      { id: '10', x: 360, y: 190, weight: 10, isLeaf: true },
      { id: '19', x: 500, y: 190, weight: 19, isLeaf: true }
    ],
    edges: [
      ['5', '2'],
      ['5', '3']
    ]
  },
  {
    title: '第二轮合并：选取最小的 5 和 6 合并为 11',
    desc: '当前森林最小为 5 和 6，合并生成内部节点 11。森林剩余：[7, 10, 11, 19]。',
    forest: [
      { id: '7', weight: 7, rootLabel: '7' },
      { id: '10', weight: 10, rootLabel: '10' },
      { id: '11', weight: 11, rootLabel: '11' },
      { id: '19', weight: 19, rootLabel: '19' }
    ],
    selectedIds: ['5', '6'],
    nodes: [
      { id: '2', x: 60, y: 190, weight: 2, isLeaf: true },
      { id: '3', x: 120, y: 190, weight: 3, isLeaf: true },
      { id: '5', x: 90, y: 140, weight: 5 },
      { id: '6', x: 170, y: 140, weight: 6, isLeaf: true },
      { id: '11', x: 130, y: 90, weight: 11 },
      { id: '7', x: 280, y: 190, weight: 7, isLeaf: true },
      { id: '10', x: 360, y: 190, weight: 10, isLeaf: true },
      { id: '19', x: 500, y: 190, weight: 19, isLeaf: true }
    ],
    edges: [
      ['5', '2'],
      ['5', '3'],
      ['11', '5'],
      ['11', '6']
    ]
  },
  {
    title: '第三轮合并：选取最小的 7 和 10 合并为 17',
    desc: '当前森林最小为 7 和 10，合并生成内部节点 17。森林剩余：[11, 17, 19]。',
    forest: [
      { id: '11', weight: 11, rootLabel: '11' },
      { id: '17', weight: 17, rootLabel: '17' },
      { id: '19', weight: 19, rootLabel: '19' }
    ],
    selectedIds: ['7', '10'],
    nodes: [
      { id: '2', x: 60, y: 190, weight: 2, isLeaf: true },
      { id: '3', x: 120, y: 190, weight: 3, isLeaf: true },
      { id: '5', x: 90, y: 140, weight: 5 },
      { id: '6', x: 170, y: 140, weight: 6, isLeaf: true },
      { id: '11', x: 130, y: 90, weight: 11 },
      { id: '7', x: 270, y: 140, weight: 7, isLeaf: true },
      { id: '10', x: 350, y: 140, weight: 10, isLeaf: true },
      { id: '17', x: 310, y: 90, weight: 17 },
      { id: '19', x: 500, y: 190, weight: 19, isLeaf: true }
    ],
    edges: [
      ['5', '2'],
      ['5', '3'],
      ['11', '5'],
      ['11', '6'],
      ['17', '7'],
      ['17', '10']
    ]
  },
  {
    title: '第四轮合并：选取最小的 11 和 17 合并为 28',
    desc: '当前森林最小为 11 和 17，合并生成新子树根 28。森林剩余两棵树：[19, 28]。',
    forest: [
      { id: '19', weight: 19, rootLabel: '19' },
      { id: '28', weight: 28, rootLabel: '28' }
    ],
    selectedIds: ['11', '17'],
    nodes: [
      { id: '2', x: 60, y: 200, weight: 2, isLeaf: true },
      { id: '3', x: 120, y: 200, weight: 3, isLeaf: true },
      { id: '5', x: 90, y: 155, weight: 5 },
      { id: '6', x: 165, y: 155, weight: 6, isLeaf: true },
      { id: '11', x: 130, y: 105, weight: 11 },
      { id: '7', x: 270, y: 155, weight: 7, isLeaf: true },
      { id: '10', x: 345, y: 155, weight: 10, isLeaf: true },
      { id: '17', x: 310, y: 105, weight: 17 },
      { id: '28', x: 220, y: 55, weight: 28 },
      { id: '19', x: 500, y: 200, weight: 19, isLeaf: true }
    ],
    edges: [
      ['5', '2'],
      ['5', '3'],
      ['11', '5'],
      ['11', '6'],
      ['17', '7'],
      ['17', '10'],
      ['28', '11'],
      ['28', '17']
    ]
  },
  {
    title: '第五轮合并：19 与 28 合并为根 47，大功告成！',
    desc: '最后两棵树 19 与 28 合并为整棵哈夫曼树的根 47！整树包含 6 个叶子与 5 个度为 2 的分支节点，共 11 个节点。',
    examTip: 'WPL 两种算题速算法：① 累加所有内部节点的权值：5 + 11 + 17 + 28 + 47 = 108（若加上中间层）；② 各叶子权值 × 路径长度：2×4 + 3×4 + 6×3 + 7×3 + 10×3 + 19×1 = 108！',
    forest: [{ id: '47', weight: 47, rootLabel: '47' }],
    selectedIds: ['19', '28'],
    nodes: [
      { id: '2', x: 60, y: 200, weight: 2, isLeaf: true },
      { id: '3', x: 120, y: 200, weight: 3, isLeaf: true },
      { id: '5', x: 90, y: 155, weight: 5 },
      { id: '6', x: 165, y: 155, weight: 6, isLeaf: true },
      { id: '11', x: 130, y: 110, weight: 11 },
      { id: '7', x: 270, y: 155, weight: 7, isLeaf: true },
      { id: '10', x: 345, y: 155, weight: 10, isLeaf: true },
      { id: '17', x: 310, y: 110, weight: 17 },
      { id: '28', x: 220, y: 65, weight: 28 },
      { id: '19', x: 440, y: 65, weight: 19, isLeaf: true },
      { id: '47', x: 330, y: 20, weight: 47 }
    ],
    edges: [
      ['5', '2'],
      ['5', '3'],
      ['11', '5'],
      ['11', '6'],
      ['17', '7'],
      ['17', '10'],
      ['28', '11'],
      ['28', '17'],
      ['47', '28'],
      ['47', '19']
    ],
    wplCalculation: 'WPL = 2×4 + 3×4 + 6×3 + 7×3 + 10×3 + 19×1 = 108'
  }
]

const totalSteps = computed(() => {
  if (currentMode.value === 'post-in') return postInSteps.length
  if (currentMode.value === 'pre-in') return preInSteps.length
  return huffmanSteps.length
})

const currentTreeStep = computed(() => {
  if (currentMode.value === 'post-in') return postInSteps[Math.min(stepIndex.value, postInSteps.length - 1)]
  return preInSteps[Math.min(stepIndex.value, preInSteps.length - 1)]
})

const currentHuffmanStep = computed(() => {
  return huffmanSteps[Math.min(stepIndex.value, huffmanSteps.length - 1)]
})

function setMode(mode: TreeMode) {
  pause()
  currentMode.value = mode
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
  <div class="tree-player-card">
    <!-- 头部导航与模式切换 -->
    <div class="player-header">
      <div class="title-group">
        <span class="player-icon">🌲</span>
        <div>
          <div class="player-main-title">二叉树核心机理交互演示系统</div>
          <div class="player-sub-title">408 核心重难点 · 遍历序列唯一确定二叉树 & 哈夫曼树贪心构建全流程</div>
        </div>
      </div>
      <div class="mode-tabs">
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'post-in' }"
          @click="setMode('post-in')"
        >
          后序 + 中序还原
        </button>
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'pre-in' }"
          @click="setMode('pre-in')"
        >
          先序 + 中序还原
        </button>
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'huffman' }"
          @click="setMode('huffman')"
        >
          哈夫曼树贪心构建
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
      <template v-if="currentMode === 'huffman'">
        <div class="step-title-line">
          <span class="step-badge huffman-badge">Step {{ stepIndex + 1 }}</span>
          <span class="step-heading">{{ currentHuffmanStep.title }}</span>
        </div>
        <p class="step-desc">{{ currentHuffmanStep.desc }}</p>
        <div v-if="currentHuffmanStep.wplCalculation" class="wpl-badge-box">
          ✨ <strong>{{ currentHuffmanStep.wplCalculation }}</strong>
        </div>
        <div v-if="currentHuffmanStep.examTip" class="exam-tip-box">
          <span class="tip-icon">💡</span>
          <span>{{ currentHuffmanStep.examTip }}</span>
        </div>
      </template>

      <template v-else>
        <div class="step-title-line">
          <span class="step-badge">Step {{ stepIndex + 1 }}</span>
          <span class="step-heading">{{ currentTreeStep.title }}</span>
        </div>
        <p class="step-desc">{{ currentTreeStep.desc }}</p>
        <div v-if="currentTreeStep.examTip" class="exam-tip-box">
          <span class="tip-icon">💡</span>
          <span>{{ currentTreeStep.examTip }}</span>
        </div>
      </template>
    </div>

    <!-- 舞台展示区 -->
    <div class="stage-container">
      <!-- 模式 1 & 2: 序列还原二叉树 -->
      <div v-if="currentMode === 'post-in' || currentMode === 'pre-in'" class="rebuild-stage">
        <!-- 序列展示条带 -->
        <div class="sequence-box">
          <div class="seq-row">
            <span class="seq-label">{{ currentTreeStep.seq1Label }}:</span>
            <div class="seq-items">
              <span
                v-for="(val, idx) in currentTreeStep.seq1"
                :key="idx"
                class="seq-item"
                :class="{
                  'is-root': currentTreeStep.seq1Highlights.some(h => h.index === idx && h.type === 'root'),
                  'is-left': currentTreeStep.seq1Highlights.some(h => h.index === idx && h.type === 'left'),
                  'is-right': currentTreeStep.seq1Highlights.some(h => h.index === idx && h.type === 'right')
                }"
              >
                {{ val }}
              </span>
            </div>
          </div>

          <div class="seq-row">
            <span class="seq-label">{{ currentTreeStep.seq2Label }}:</span>
            <div class="seq-items">
              <span
                v-for="(val, idx) in currentTreeStep.seq2"
                :key="idx"
                class="seq-item"
                :class="{
                  'is-root': currentTreeStep.seq2Highlights.some(h => h.index === idx && h.type === 'root'),
                  'is-left': currentTreeStep.seq2Highlights.some(h => h.index === idx && h.type === 'left'),
                  'is-right': currentTreeStep.seq2Highlights.some(h => h.index === idx && h.type === 'right')
                }"
              >
                {{ val }}
              </span>
            </div>
          </div>

          <div class="seq-legend">
            <span class="legend-item"><span class="color-dot dot-root"></span> 根节点</span>
            <span class="legend-item"><span class="color-dot dot-left"></span> 左子树区间</span>
            <span class="legend-item"><span class="color-dot dot-right"></span> 右子树区间</span>
          </div>
        </div>

        <!-- SVG 树形图 -->
        <div class="tree-svg-card">
          <svg viewBox="0 0 600 230" width="100%" height="230" class="tree-svg">
            <!-- 树边 -->
            <g class="edges">
              <line
                v-for="(edge, idx) in currentTreeStep.edges"
                :key="idx"
                :x1="currentTreeStep.nodeLayout[edge[0]].x"
                :y1="currentTreeStep.nodeLayout[edge[0]].y"
                :x2="currentTreeStep.nodeLayout[edge[1]].x"
                :y2="currentTreeStep.nodeLayout[edge[1]].y"
                stroke="var(--vp-c-divider)"
                stroke-width="2.2"
              />
            </g>

            <!-- 树节点 -->
            <g class="nodes">
              <g
                v-for="name in currentTreeStep.activeNodes"
                :key="name"
                :transform="`translate(${currentTreeStep.nodeLayout[name].x}, ${currentTreeStep.nodeLayout[name].y})`"
              >
                <circle
                  cx="0"
                  cy="0"
                  r="16"
                  :class="[
                    'tree-circle',
                    {
                      'root-circle': name === currentTreeStep.currentRoot,
                      'normal-circle': name !== currentTreeStep.currentRoot
                    }
                  ]"
                />
                <text x="0" y="5" text-anchor="middle" class="node-label">{{ name }}</text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <!-- 模式 3: 哈夫曼树构建 -->
      <div v-else class="huffman-stage">
        <!-- 森林候选树卡片 -->
        <div class="forest-card">
          <span class="forest-title">🌲 森林候选集 (每次贪心挑选最小两棵):</span>
          <div class="forest-chips">
            <span
              v-for="tree in currentHuffmanStep.forest"
              :key="tree.id"
              class="forest-chip"
              :class="{ 'chip-selected': currentHuffmanStep.selectedIds.includes(tree.id) }"
            >
              权值: <strong>{{ tree.weight }}</strong>
            </span>
          </div>
        </div>

        <!-- 哈夫曼 SVG 树形图 -->
        <div class="tree-svg-card">
          <svg viewBox="0 0 600 240" width="100%" height="240" class="tree-svg">
            <!-- 连线 -->
            <g class="edges">
              <line
                v-for="(edge, idx) in currentHuffmanStep.edges"
                :key="idx"
                :x1="currentHuffmanStep.nodes.find(n => n.id === edge[0])?.x || 0"
                :y1="currentHuffmanStep.nodes.find(n => n.id === edge[0])?.y || 0"
                :x2="currentHuffmanStep.nodes.find(n => n.id === edge[1])?.x || 0"
                :y2="currentHuffmanStep.nodes.find(n => n.id === edge[1])?.y || 0"
                stroke="var(--vp-c-divider)"
                stroke-width="2"
              />
            </g>

            <!-- 节点 -->
            <g class="nodes">
              <g
                v-for="n in currentHuffmanStep.nodes"
                :key="n.id"
                :transform="`translate(${n.x}, ${n.y})`"
              >
                <circle
                  cx="0"
                  cy="0"
                  :r="n.isLeaf ? 14 : 17"
                  :class="['tree-circle', n.isLeaf ? 'leaf-circle' : 'internal-circle']"
                />
                <text x="0" y="4" text-anchor="middle" class="node-label">{{ n.weight }}</text>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tree-player-card {
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

.huffman-badge {
  background: #059669;
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

.wpl-badge-box {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(5, 150, 105, 0.1);
  border: 1px solid #059669;
  color: #059669;
  font-size: 13px;
  margin-bottom: 8px;
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
  min-height: 380px;
}

.sequence-box {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 14px;
}

.seq-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.seq-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  width: 70px;
}

.seq-items {
  display: flex;
  gap: 6px;
}

.seq-item {
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-family: monospace;
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  transition: all 0.3s;
}

.seq-item.is-root {
  background: #f59e0b;
  color: #ffffff;
  border-color: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}

.seq-item.is-left {
  background: rgba(37, 99, 235, 0.15);
  border-color: #2563eb;
  color: #2563eb;
}

.seq-item.is-right {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #10b981;
}

.seq-legend {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 11.5px;
  color: var(--vp-c-text-3);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.color-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.dot-root { background: #f59e0b; }
.dot-left { background: #2563eb; }
.dot-right { background: #10b981; }

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
  transition: all 0.3s ease;
}

.root-circle {
  fill: #f59e0b;
  stroke: #d97706;
}

.normal-circle {
  fill: var(--vp-c-brand-1);
  stroke: var(--vp-c-brand-2, #1d4ed8);
}

.leaf-circle {
  fill: rgba(37, 99, 235, 0.15);
  stroke: #2563eb;
}

.internal-circle {
  fill: #059669;
  stroke: #047857;
}

.node-label {
  font-size: 12.5px;
  font-weight: 800;
  fill: #ffffff;
  font-family: inherit;
}

.leaf-circle + .node-label {
  fill: #2563eb;
}

.forest-card {
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 14px;
}

.forest-title {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  display: block;
  margin-bottom: 8px;
}

.forest-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.forest-chip {
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  transition: all 0.3s;
}

.chip-selected {
  background: rgba(245, 158, 11, 0.15);
  border-color: #f59e0b;
  color: #d97706;
  font-weight: 700;
}
</style>
