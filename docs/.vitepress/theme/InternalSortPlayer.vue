<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'

type AlgorithmKey =
  | 'direct-insert'
  | 'binary-insert'
  | 'shell'
  | 'bubble'
  | 'quick'
  | 'selection'
  | 'heap'
  | 'merge'
  | 'radix'

interface StepData {
  title: string
  desc: string
  values: number[]
  activeIndexes?: number[]
  comparedIndexes?: number[]
  sortedIndexes?: number[]
  pivotIndex?: number
  pointers?: { label: string; index: number; color?: string }[]
  // 堆排序专用字段
  heapSize?: number
  // 归并排序专用字段
  tempValues?: (number | null)[]
  mergeRange?: [number, number]
  // 基数排序专用字段
  radixBuckets?: number[][]
  currentDigit?: string
}

const currentAlgorithm = ref<AlgorithmKey>('direct-insert')
const currentStepIndex = ref(0)
const isPlaying = ref(false)
let playTimer: any = null

// -------------------------------------------------------------
// 1. 生成各算法分步数据生成器
// -------------------------------------------------------------

// --- 直接插入排序 ---
function generateDirectInsertSteps(): StepData[] {
  const arr = [5, 2, 8, 1, 6, 3, 7, 4]
  const steps: StepData[] = [
    {
      title: '初始状态：下标 0 视为有序区',
      desc: '待排序数组 [5, 2, 8, 1, 6, 3, 7, 4]，从下标 1 的元素开始依次取出向已排序区插入。',
      values: [...arr],
      sortedIndexes: [0]
    }
  ]

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]
    steps.push({
      title: `第 ${i} 趟：取出待插元素 key = ${key}`,
      desc: `待插元素为下标 ${i}（值为 ${key}），准备在已排序区 [0..${i - 1}] 中从后向前扫描。`,
      values: [...arr],
      activeIndexes: [i],
      sortedIndexes: Array.from({ length: i }, (_, k) => k),
      pointers: [{ label: 'key', index: i, color: '#f59e0b' }]
    })

    let j = i - 1
    while (j >= 0 && arr[j] > key) {
      steps.push({
        title: `第 ${i} 趟：比较并后移`,
        desc: `比较 a[${j}]=${arr[j]} 与 key=${key}：${arr[j]} > ${key}，元素 ${arr[j]} 向右后移一格。`,
        values: [...arr],
        comparedIndexes: [j],
        activeIndexes: [j + 1],
        sortedIndexes: Array.from({ length: i }, (_, k) => k),
        pointers: [
          { label: 'j', index: j, color: '#2563eb' },
          { label: `key:${key}`, index: i, color: '#f59e0b' }
        ]
      })
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = key
    steps.push({
      title: `第 ${i} 趟：放入最终位置`,
      desc: `找到插入空位下标 ${j + 1}，将 key=${key} 填入。此时前 ${i + 1} 个元素全部保持有序。`,
      values: [...arr],
      activeIndexes: [j + 1],
      sortedIndexes: Array.from({ length: i + 1 }, (_, k) => k)
    })
  }

  steps.push({
    title: '直接插入排序完成',
    desc: '全部元素已按升序排列，直接插入排序在基本有序时趋近 O(n)，是快排小区间收尾首选。',
    values: [...arr],
    sortedIndexes: arr.map((_, idx) => idx)
  })
  return steps
}

// --- 折半插入排序 ---
function generateBinaryInsertSteps(): StepData[] {
  const arr = [5, 2, 8, 1, 6, 3, 7, 4]
  const steps: StepData[] = [
    {
      title: '初始状态：下标 0 视为有序区',
      desc: '折半插入对直接插入的优化：在已排序区中使用二分查找确定插入位置，减少比较次数。',
      values: [...arr],
      sortedIndexes: [0]
    }
  ]

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]
    let low = 0
    let high = i - 1

    steps.push({
      title: `第 ${i} 趟：取出 key = ${key}，开始折半查找`,
      desc: `当前有序区间为 [${low}..${high}]，使用二分折半查找插入位置。`,
      values: [...arr],
      activeIndexes: [i],
      sortedIndexes: Array.from({ length: i }, (_, k) => k),
      pointers: [
        { label: 'low', index: low, color: '#10b981' },
        { label: 'high', index: high, color: '#ef4444' },
        { label: `key:${key}`, index: i, color: '#f59e0b' }
      ]
    })

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      steps.push({
        title: `折半探测 mid = ${mid}`,
        desc: `比较 a[mid]=${arr[mid]} 与 key=${key}：${arr[mid] > key ? '大于 key，high 向左收缩' : '小于等于 key，low 向右收缩'}。`,
        values: [...arr],
        comparedIndexes: [mid],
        sortedIndexes: Array.from({ length: i }, (_, k) => k),
        pointers: [
          { label: 'low', index: low, color: '#10b981' },
          { label: 'mid', index: mid, color: '#2563eb' },
          { label: 'high', index: high, color: '#ef4444' }
        ]
      })
      if (arr[mid] > key) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    }

    steps.push({
      title: `确定插入位置为 low = ${low}`,
      desc: `二分查找结束，目标插入下标为 ${low}。注意：元素后移次数并未减少，整体后移！`,
      values: [...arr],
      activeIndexes: [low],
      sortedIndexes: Array.from({ length: i }, (_, k) => k),
      pointers: [{ label: '目标位', index: low, color: '#10b981' }]
    })

    for (let j = i - 1; j >= low; j--) {
      arr[j + 1] = arr[j]
    }
    arr[low] = key

    steps.push({
      title: `第 ${i} 趟完成：元素整体后移并插入 key=${key}`,
      desc: `完成下标 ${low} 到 ${i} 的整体后移，填入 key。前 ${i + 1} 个元素有序。`,
      values: [...arr],
      activeIndexes: [low],
      sortedIndexes: Array.from({ length: i + 1 }, (_, k) => k)
    })
  }

  steps.push({
    title: '折半插入排序完成',
    desc: '核心考点：比较次数由 O(n²) 降到 O(n log n)，但移动次数仍为 O(n²)，总时间仍为 O(n²)。',
    values: [...arr],
    sortedIndexes: arr.map((_, idx) => idx)
  })
  return steps
}

// --- 希尔排序 ---
function generateShellSteps(): StepData[] {
  const arr = [9, 8, 7, 6, 5, 4, 3, 2]
  const steps: StepData[] = [
    {
      title: '希尔排序初始状态',
      desc: '待排序列 [9, 8, 7, 6, 5, 4, 3, 2]，采用缩小增量 d = 4, 2, 1 逐步分组插入排序。',
      values: [...arr]
    }
  ]

  const gaps = [4, 2, 1]
  for (const gap of gaps) {
    steps.push({
      title: `开始增量 d = ${gap} 的排序阶段`,
      desc: `将相隔距离为 ${gap} 的元素划分为同组，组内独立执行直接插入排序。`,
      values: [...arr]
    })

    for (let i = gap; i < arr.length; i++) {
      const temp = arr[i]
      let j = i
      steps.push({
        title: `d = ${gap}：处理元素 a[${i}]=${temp}`,
        desc: `与本组前一个元素 a[${i - gap}]=${arr[i - gap]} 进行跨步长比较。`,
        values: [...arr],
        activeIndexes: [i],
        comparedIndexes: [i - gap],
        pointers: [
          { label: '前驱', index: i - gap, color: '#2563eb' },
          { label: '当前', index: i, color: '#f59e0b' }
        ]
      })

      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap]
        j -= gap
      }
      arr[j] = temp

      steps.push({
        title: `d = ${gap}：组内就位`,
        desc: `元素 ${temp} 跨步长插入到下标 ${j}，有效消除了远距离逆序对。`,
        values: [...arr],
        activeIndexes: [j]
      })
    }
  }

  steps.push({
    title: '希尔排序完成',
    desc: '最后一趟必须满足 d = 1。跨增量比较与移动会破坏相同元素的相对次序，故希尔排序是不稳定排序。',
    values: [...arr],
    sortedIndexes: arr.map((_, idx) => idx)
  })
  return steps
}

// --- 冒泡排序 ---
function generateBubbleSteps(): StepData[] {
  const arr = [5, 2, 8, 1, 6, 3, 7, 4]
  const steps: StepData[] = [
    {
      title: '冒泡排序初始状态',
      desc: '待排序列 [5, 2, 8, 1, 6, 3, 7, 4]，从左到右相邻两两比较，逆序则交换。',
      values: [...arr]
    }
  ]

  for (let i = 0; i < arr.length - 1; i++) {
    let swapped = false
    steps.push({
      title: `第 ${i + 1} 趟冒泡开始（范围 0..${arr.length - 1 - i}）`,
      desc: `本趟目标：将该区间内的最大值冒泡浮动到最右侧下标 ${arr.length - 1 - i}。`,
      values: [...arr],
      sortedIndexes: i > 0 ? Array.from({ length: i }, (_, k) => arr.length - k - 1) : []
    })

    for (let j = 0; j < arr.length - 1 - i; j++) {
      steps.push({
        title: `比较相邻元素 a[${j}]=${arr[j]} 与 a[${j + 1}]=${arr[j + 1]}`,
        desc: arr[j] > arr[j + 1] ? `${arr[j]} > ${arr[j + 1]}，发生逆序，准备交换。` : `${arr[j]} ≤ ${arr[j + 1]}，顺序正确，不交换。`,
        values: [...arr],
        comparedIndexes: [j, j + 1],
        pointers: [
          { label: 'L', index: j, color: '#2563eb' },
          { label: 'R', index: j + 1, color: '#f59e0b' }
        ]
      })

      if (arr[j] > arr[j + 1]) {
        const t = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = t
        swapped = true

        steps.push({
          title: `交换完成：${arr[j + 1]} 冒泡后移`,
          desc: `下标 ${j} 与 ${j + 1} 交换为 [${arr[j]}, ${arr[j + 1]}]。`,
          values: [...arr],
          activeIndexes: [j, j + 1]
        })
      }
    }

    steps.push({
      title: `第 ${i + 1} 趟结束：下标 ${arr.length - 1 - i} 绝对就位`,
      desc: `最大值 ${arr[arr.length - 1 - i]} 已固定在其最终位置。`,
      values: [...arr],
      sortedIndexes: Array.from({ length: i + 1 }, (_, k) => arr.length - k - 1)
    })

    if (!swapped) {
      steps.push({
        title: '提前退出优化触发 (Flag = 0)',
        desc: '本整趟比较过程中未发生任何交换，说明序列已然全局有序，无需继续后续各趟！',
        values: [...arr],
        sortedIndexes: arr.map((_, idx) => idx)
      })
      break
    }
  }

  steps.push({
    title: '冒泡排序完成',
    desc: '相邻比较只在真正大于时才交换，相等元素绝不交换，因而冒泡排序具备天然稳定性。',
    values: [...arr],
    sortedIndexes: arr.map((_, idx) => idx)
  })
  return steps
}

// --- 快速排序 (单次完整划分 Partition) ---
function generateQuickSteps(): StepData[] {
  const arr = [7, 2, 9, 1, 8, 3, 6, 4, 10, 5]
  const steps: StepData[] = [
    {
      title: '快速排序：一次完整 Partition 划分过程',
      desc: '待排数组 [7, 2, 9, 1, 8, 3, 6, 4, 10, 5]，选取右端元素 5 作为基准枢轴 (Pivot)。',
      values: [...arr],
      pointers: [{ label: 'Pivot:5', index: 9, color: '#ef4444' }]
    }
  ]

  const pivot = arr[9]
  let i = 0
  let j = 8

  steps.push({
    title: '初始化双指针：i 从最左侧开始，j 从 pivot 左邻开始',
    desc: 'i 向右找偏大元素 (> pivot)，j 向左找偏小元素 (< pivot)。',
    values: [...arr],
    pointers: [
      { label: 'i', index: i, color: '#2563eb' },
      { label: 'j', index: j, color: '#10b981' },
      { label: 'Pivot', index: 9, color: '#ef4444' }
    ]
  })

  while (i <= j) {
    while (i <= j && arr[i] <= pivot) {
      steps.push({
        title: `i 指针扫描：a[${i}]=${arr[i]} ≤ Pivot(${pivot})`,
        desc: `元素 ${arr[i]} 小于等于基准，无需挪动，i 向右前进。`,
        values: [...arr],
        comparedIndexes: [i],
        pointers: [
          { label: 'i', index: i, color: '#2563eb' },
          { label: 'j', index: j, color: '#10b981' }
        ]
      })
      i++
    }

    while (i <= j && arr[j] >= pivot) {
      steps.push({
        title: `j 指针扫描：a[${j}]=${arr[j]} ≥ Pivot(${pivot})`,
        desc: `元素 ${arr[j]} 大于等于基准，无需挪动，j 向左前进。`,
        values: [...arr],
        comparedIndexes: [j],
        pointers: [
          { label: 'i', index: i, color: '#2563eb' },
          { label: 'j', index: j, color: '#10b981' }
        ]
      })
      j--
    }

    if (i < j) {
      steps.push({
        title: `发现逆序对：交换 a[${i}]=${arr[i]} 与 a[${j}]=${arr[j]}`,
        desc: `i 指向偏大数 ${arr[i]}，j 指向偏小数 ${arr[j]}，交换双方以归位。`,
        values: [...arr],
        activeIndexes: [i, j],
        pointers: [
          { label: 'i', index: i, color: '#2563eb' },
          { label: 'j', index: j, color: '#10b981' }
        ]
      })
      const t = arr[i]
      arr[i] = arr[j]
      arr[j] = t
      i++
      j--
    }
  }

  steps.push({
    title: `指针交错终止扫描：i=${i} > j=${j}`,
    desc: '扫描结束，此时 i 左侧均 ≤ Pivot，i 及其右侧均 ≥ Pivot。准备将 Pivot 与 i 处交换。',
    values: [...arr],
    pointers: [
      { label: 'i (落脚点)', index: i, color: '#2563eb' },
      { label: 'Pivot', index: 9, color: '#ef4444' }
    ]
  })

  const t = arr[i]
  arr[i] = arr[9]
  arr[9] = t

  steps.push({
    title: `Pivot 5 最终就位于下标 ${i}`,
    desc: `基准值 5 成功就位！左侧 [${arr.slice(0, i).join(', ')}] 均 ≤ 5，右侧 [${arr.slice(i + 1).join(', ')}] 均 ≥ 5。随后对两区间递归划分。`,
    values: [...arr],
    activeIndexes: [i],
    sortedIndexes: [i]
  })

  return steps
}

// --- 简单选择排序 ---
function generateSelectionSteps(): StepData[] {
  const arr = [5, 2, 8, 1, 6, 3, 7, 4]
  const steps: StepData[] = [
    {
      title: '简单选择排序初始状态',
      desc: '待排序列 [5, 2, 8, 1, 6, 3, 7, 4]，每趟从未排序区选出最小元素，与未排序区首位交换。',
      values: [...arr]
    }
  ]

  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i
    steps.push({
      title: `第 ${i + 1} 趟选择开始：初始假设 a[${i}]=${arr[i]} 为最小值`,
      desc: `在未排序区 [${i}..${arr.length - 1}] 中向后扫描更小者。比较次数恒定，与初序无关！`,
      values: [...arr],
      sortedIndexes: Array.from({ length: i }, (_, k) => k),
      pointers: [{ label: 'min', index: minIdx, color: '#10b981' }]
    })

    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({
          title: `更新最小值标记：min = ${minIdx} (值 ${arr[minIdx]})`,
          desc: `发现更小元素 a[${j}]=${arr[j]}，移动 min 标记。注意：此时并不做交换！`,
          values: [...arr],
          comparedIndexes: [j],
          sortedIndexes: Array.from({ length: i }, (_, k) => k),
          pointers: [
            { label: 'min', index: minIdx, color: '#10b981' },
            { label: 'j', index: j, color: '#2563eb' }
          ]
        })
      }
    }

    if (minIdx !== i) {
      steps.push({
        title: `第 ${i + 1} 趟结束：交换 a[${i}]=${arr[i]} 与 a[${minIdx}]=${arr[minIdx]}`,
        desc: `全趟扫描完毕，最多执行一次交换。最小值 ${arr[minIdx]} 归入已排序区首位。`,
        values: [...arr],
        activeIndexes: [i, minIdx],
        sortedIndexes: Array.from({ length: i }, (_, k) => k)
      })
      const t = arr[i]
      arr[i] = arr[minIdx]
      arr[minIdx] = t
    }

    steps.push({
      title: `第 ${i + 1} 趟完成：下标 ${i} (值 ${arr[i]}) 已就位`,
      desc: `已排序区扩充至 [0..${i}]。比较次数共比较 ${arr.length - 1 - i} 次。`,
      values: [...arr],
      sortedIndexes: Array.from({ length: i + 1 }, (_, k) => k)
    })
  }

  steps.push({
    title: '简单选择排序完成',
    desc: '总比较次数恒为 n(n-1)/2 = 28 次，移动次数最多仅 n-1 次。因为跨越式交换故不稳定。',
    values: [...arr],
    sortedIndexes: arr.map((_, idx) => idx)
  })
  return steps
}

// --- 堆排序 (大顶堆建堆与调整) ---
function generateHeapSteps(): StepData[] {
  const arr = [45, 87, 78, 32, 17, 65, 53, 9]
  const steps: StepData[] = [
    {
      title: '堆排序初始状态（未建堆）',
      desc: '待排数组 [45, 87, 78, 32, 17, 65, 53, 9]，对应一棵完全二叉树。需先建大根堆。',
      values: [...arr],
      heapSize: arr.length
    }
  ]

  // 建堆自底向上
  function siftDown(data: number[], start: number, end: number, reason: string) {
    let parent = start
    while (parent * 2 + 1 <= end) {
      let child = parent * 2 + 1
      if (child + 1 <= end && data[child + 1] > data[child]) {
        child++
      }
      if (data[parent] < data[child]) {
        steps.push({
          title: `向下调整 SiftDown：${reason}`,
          desc: `父节点 a[${parent}]=${data[parent]} 小于较大孩子 a[${child}]=${data[child]}，发生下沉交换。`,
          values: [...data],
          activeIndexes: [parent, child],
          heapSize: end + 1
        })
        const t = data[parent]
        data[parent] = data[child]
        data[child] = t
        parent = child
      } else {
        break
      }
    }
  }

  // 初始建堆
  for (let i = Math.floor((arr.length - 2) / 2); i >= 0; i--) {
    steps.push({
      title: `初始建堆：自非叶结点 ${i} 开始调整`,
      desc: `检查结点 a[${i}]=${arr[i]} 及其子树，使其满足大根堆性质（根 ≥ 左右孩子）。`,
      values: [...arr],
      activeIndexes: [i],
      heapSize: arr.length
    })
    siftDown(arr, i, arr.length - 1, `初始建堆阶段调整结点 ${i}`)
  }

  steps.push({
    title: '大根堆构建完成',
    desc: '堆顶 a[0] 必然是当前全堆最大值。建堆时间复杂度为 O(n)。',
    values: [...arr],
    heapSize: arr.length,
    activeIndexes: [0]
  })

  // 排序阶段：取前 3 次做示范
  for (let end = arr.length - 1; end >= arr.length - 3; end--) {
    steps.push({
      title: `排序：将堆顶 a[0]=${arr[0]} 与堆底 a[${end}]=${arr[end]} 交换`,
      desc: `最大值 ${arr[0]} 移到未排序区末尾，已确定绝对位置。堆有效大小缩减为 ${end}。`,
      values: [...arr],
      activeIndexes: [0, end],
      heapSize: end + 1
    })

    const t = arr[0]
    arr[0] = arr[end]
    arr[end] = t

    steps.push({
      title: `新堆顶 ${arr[0]} 开始向下筛选下沉`,
      desc: `在剩余 [0..${end - 1}] 中下沉调整，恢复大根堆性质。`,
      values: [...arr],
      activeIndexes: [0],
      heapSize: end,
      sortedIndexes: Array.from({ length: arr.length - end }, (_, k) => arr.length - 1 - k)
    })

    siftDown(arr, 0, end - 1, `排序后对堆顶进行恢复调整`)
  }

  return steps
}

// --- 二路归并排序 ---
function generateMergeSteps(): StepData[] {
  const arr = [15, 24, 5, 9, 31, 8, 20, 1]
  const steps: StepData[] = [
    {
      title: '二路归并排序初始状态',
      desc: '待排序列 [15, 24, 5, 9, 31, 8, 20, 1]，每个元素初始视作长度为 1 的有序段。',
      values: [...arr]
    },
    {
      title: '第 1 轮归并：两两合并为长为 2 的段',
      desc: '合并 [15] 与 [24] ➔ [15, 24]；合并 [5] 与 [9] ➔ [5, 9]；合并 [31] 与 [8] ➔ [8, 31]；合并 [20] 与 [1] ➔ [1, 20]。',
      values: [15, 24, 5, 9, 8, 31, 1, 20],
      activeIndexes: [0, 1, 2, 3, 4, 5, 6, 7]
    },
    {
      title: '第 2 轮归并：两两合并为长为 4 的段',
      desc: '合并 [15, 24] 与 [5, 9] ➔ [5, 9, 15, 24]；合并 [8, 31] 与 [1, 20] ➔ [1, 8, 20, 31]。借助 O(n) 辅助数组。',
      values: [5, 9, 15, 24, 1, 8, 20, 31],
      activeIndexes: [0, 1, 2, 3, 4, 5, 6, 7]
    },
    {
      title: '第 3 轮最终归并：合并两个长为 4 的有序段',
      desc: '双指针同时扫描 [5, 9, 15, 24] 与 [1, 8, 20, 31]，取较小者依次推入辅助空间，最终拷回。',
      values: [1, 5, 8, 9, 15, 20, 24, 31],
      sortedIndexes: [0, 1, 2, 3, 4, 5, 6, 7]
    },
    {
      title: '二路归并排序完成',
      desc: '总趟数 ⌈log₂ 8⌉ = 3 趟，时间复杂度恒定为 O(n log n)，稳定，但需要额外 O(n) 辅助存储。',
      values: [1, 5, 8, 9, 15, 20, 24, 31],
      sortedIndexes: [0, 1, 2, 3, 4, 5, 6, 7]
    }
  ]
  return steps
}

// --- 基数排序 ---
function generateRadixSteps(): StepData[] {
  const arr = [329, 457, 657, 839, 436, 720, 355]
  return [
    {
      title: '基数排序初始序列（待排 3 位数）',
      desc: '待排数字 [329, 457, 657, 839, 436, 720, 355]，采用 LSD（最低位优先），准备设立 0~9 号队列桶。',
      values: [...arr]
    },
    {
      title: '第 1 趟：按【个位】分配入桶',
      desc: '依次查看个位：720➔桶0, 355➔桶5, 436➔桶6, 457/657➔桶7, 329/839➔桶9。同桶内保持先后顺序！',
      values: [...arr],
      currentDigit: '个位',
      radixBuckets: [
        [720], [], [], [], [],
        [355], [436], [457, 657], [], [329, 839]
      ]
    },
    {
      title: '第 1 趟：按桶 0~9 顺序收集',
      desc: '收集成新序列：[720, 355, 436, 457, 657, 329, 839]。个位已有序。',
      values: [720, 355, 436, 457, 657, 329, 839],
      currentDigit: '个位'
    },
    {
      title: '第 2 趟：按【十位】分配入桶',
      desc: '查看十位：720/329➔桶2, 436/839➔桶3, 355/457/657➔桶5。',
      values: [720, 355, 436, 457, 657, 329, 839],
      currentDigit: '十位',
      radixBuckets: [
        [], [], [720, 329], [436, 839], [],
        [355, 457, 657], [], [], [], []
      ]
    },
    {
      title: '第 2 趟：按桶 0~9 顺序收集',
      desc: '收集成新序列：[720, 329, 436, 839, 355, 457, 657]。后两位已有序。',
      values: [720, 329, 436, 839, 355, 457, 657],
      currentDigit: '十位'
    },
    {
      title: '第 3 趟：按【百位】分配入桶',
      desc: '查看最高百位：329/355➔桶3, 436/457➔桶4, 657➔桶6, 720➔桶7, 839➔桶8。',
      values: [720, 329, 436, 839, 355, 457, 657],
      currentDigit: '百位',
      radixBuckets: [
        [], [], [], [329, 355], [436, 457],
        [], [657], [720], [839], []
      ]
    },
    {
      title: '第 3 趟：最终收集完毕',
      desc: '最终有序序列：[329, 355, 436, 457, 657, 720, 839]！非比较排序，复杂度 O(d(n+r))。',
      values: [329, 355, 436, 457, 657, 720, 839],
      sortedIndexes: [0, 1, 2, 3, 4, 5, 6]
    }
  ]
}

// -------------------------------------------------------------
// 2. 状态映射与控制器
// -------------------------------------------------------------

const algorithmStepsMap: Record<AlgorithmKey, () => StepData[]> = {
  'direct-insert': generateDirectInsertSteps,
  'binary-insert': generateBinaryInsertSteps,
  shell: generateShellSteps,
  bubble: generateBubbleSteps,
  quick: generateQuickSteps,
  selection: generateSelectionSteps,
  heap: generateHeapSteps,
  merge: generateMergeSteps,
  radix: generateRadixSteps
}

const currentSteps = computed(() => {
  return algorithmStepsMap[currentAlgorithm.value]()
})

const currentStep = computed<StepData>(() => {
  const steps = currentSteps.value
  const idx = Math.min(Math.max(currentStepIndex.value, 0), steps.length - 1)
  return steps[idx] || steps[0]
})

function selectAlgorithm(key: AlgorithmKey) {
  stopPlay()
  currentAlgorithm.value = key
  currentStepIndex.value = 0
}

function nextStep() {
  if (currentStepIndex.value < currentSteps.value.length - 1) {
    currentStepIndex.value++
  } else {
    stopPlay()
  }
}

function prevStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

function resetSteps() {
  stopPlay()
  currentStepIndex.value = 0
}

function togglePlay() {
  if (isPlaying.value) {
    stopPlay()
  } else {
    isPlaying.value = true
    if (currentStepIndex.value >= currentSteps.value.length - 1) {
      currentStepIndex.value = 0
    }
    playTimer = setInterval(() => {
      if (currentStepIndex.value < currentSteps.value.length - 1) {
        currentStepIndex.value++
      } else {
        stopPlay()
      }
    }, 1200)
  }
}

function stopPlay() {
  isPlaying.value = false
  if (playTimer) {
    clearInterval(playTimer)
    playTimer = null
  }
}

watch(currentAlgorithm, () => {
  resetSteps()
})

onUnmounted(() => {
  stopPlay()
})
</script>

<template>
  <div class="sort-player-card">
    <!-- 顶部算法选择 Tab 导航栏 -->
    <div class="player-nav">
      <div class="nav-title">
        <span class="icon">🎬</span>
        <strong>内部排序 9 大核心算法分步动态演练</strong>
      </div>
      <div class="tabs-wrapper">
        <button
          type="button"
          :class="['tab-btn', { active: currentAlgorithm === 'direct-insert' }]"
          @click="selectAlgorithm('direct-insert')"
        >
          直接插入
        </button>
        <button
          type="button"
          :class="['tab-btn', { active: currentAlgorithm === 'binary-insert' }]"
          @click="selectAlgorithm('binary-insert')"
        >
          折半插入
        </button>
        <button
          type="button"
          :class="['tab-btn', { active: currentAlgorithm === 'shell' }]"
          @click="selectAlgorithm('shell')"
        >
          希尔排序
        </button>
        <button
          type="button"
          :class="['tab-btn', { active: currentAlgorithm === 'bubble' }]"
          @click="selectAlgorithm('bubble')"
        >
          冒泡排序
        </button>
        <button
          type="button"
          :class="['tab-btn', { active: currentAlgorithm === 'quick' }]"
          @click="selectAlgorithm('quick')"
        >
          快速排序
        </button>
        <button
          type="button"
          :class="['tab-btn', { active: currentAlgorithm === 'selection' }]"
          @click="selectAlgorithm('selection')"
        >
          简单选择
        </button>
        <button
          type="button"
          :class="['tab-btn', { active: currentAlgorithm === 'heap' }]"
          @click="selectAlgorithm('heap')"
        >
          堆排序
        </button>
        <button
          type="button"
          :class="['tab-btn', { active: currentAlgorithm === 'merge' }]"
          @click="selectAlgorithm('merge')"
        >
          二路归并
        </button>
        <button
          type="button"
          :class="['tab-btn', { active: currentAlgorithm === 'radix' }]"
          @click="selectAlgorithm('radix')"
        >
          基数排序
        </button>
      </div>
    </div>

    <!-- 步骤解说横幅 -->
    <div class="step-banner">
      <div class="step-header">
        <span class="step-badge">步骤 {{ currentStepIndex + 1 }} / {{ currentSteps.length }}</span>
        <span class="step-title">{{ currentStep.title }}</span>
      </div>
      <p class="step-desc">{{ currentStep.desc }}</p>
    </div>

    <!-- 动画展示主视窗 -->
    <div class="stage-container">
      <!-- 1. 常规数组元素格子渲染 -->
      <div v-if="currentAlgorithm !== 'radix'" class="array-stage">
        <div
          v-for="(val, idx) in currentStep.values"
          :key="idx"
          :class="[
            'cell-box',
            {
              'is-active': currentStep.activeIndexes?.includes(idx),
              'is-compared': currentStep.comparedIndexes?.includes(idx),
              'is-sorted': currentStep.sortedIndexes?.includes(idx)
            }
          ]"
        >
          <!-- 顶部指针指示器 -->
          <div class="pointer-slot">
            <span
              v-for="p in (currentStep.pointers || []).filter(x => x.index === idx)"
              :key="p.label"
              class="pointer-tag"
              :style="{ color: p.color || 'var(--vp-c-brand-1)' }"
            >
              {{ p.label }} ▼
            </span>
          </div>
          <!-- 数组数值卡片 -->
          <div class="value-rect">{{ val }}</div>
          <!-- 下标 -->
          <div class="index-label">[{{ idx }}]</div>
        </div>
      </div>

      <!-- 2. 堆排序额外完全二叉树视角 -->
      <div v-if="currentAlgorithm === 'heap'" class="heap-tree-view">
        <div class="view-title">完全二叉树结构对照（堆顶：根结点 0）</div>
        <svg viewBox="0 0 540 180" class="tree-svg">
          <!-- 连线 -->
          <!-- 0 -> 1, 2 -->
          <line x1="270" y1="25" x2="150" y2="70" stroke="var(--vp-c-divider)" stroke-width="2" />
          <line x1="270" y1="25" x2="390" y2="70" stroke="var(--vp-c-divider)" stroke-width="2" />
          <!-- 1 -> 3, 4 -->
          <line x1="150" y1="70" x2="90" y2="125" stroke="var(--vp-c-divider)" stroke-width="2" />
          <line x1="150" y1="70" x2="210" y2="125" stroke="var(--vp-c-divider)" stroke-width="2" />
          <!-- 2 -> 5, 6 -->
          <line x1="390" y1="70" x2="330" y2="125" stroke="var(--vp-c-divider)" stroke-width="2" />
          <line x1="390" y1="70" x2="450" y2="125" stroke="var(--vp-c-divider)" stroke-width="2" />
          <!-- 3 -> 7 -->
          <line x1="90" y1="125" x2="60" y2="165" stroke="var(--vp-c-divider)" stroke-width="1.8" />

          <!-- 结点 0~7 -->
          <!-- 根 0 (270, 25) -->
          <circle cx="270" cy="25" r="18" :fill="currentStep.activeIndexes?.includes(0) ? '#f59e0b' : '#2563eb'" />
          <text x="270" y="30" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">{{ currentStep.values[0] }}</text>

          <!-- 1 (150, 70), 2 (390, 70) -->
          <circle cx="150" cy="70" r="18" :fill="currentStep.activeIndexes?.includes(1) ? '#f59e0b' : '#2563eb'" />
          <text x="150" y="75" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">{{ currentStep.values[1] }}</text>

          <circle cx="390" cy="70" r="18" :fill="currentStep.activeIndexes?.includes(2) ? '#f59e0b' : '#2563eb'" />
          <text x="390" y="75" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">{{ currentStep.values[2] }}</text>

          <!-- 3 (90, 125), 4 (210, 125), 5 (330, 125), 6 (450, 125) -->
          <circle cx="90" cy="125" r="16" :fill="currentStep.activeIndexes?.includes(3) ? '#f59e0b' : '#2563eb'" />
          <text x="90" y="130" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">{{ currentStep.values[3] }}</text>

          <circle cx="210" cy="125" r="16" :fill="currentStep.activeIndexes?.includes(4) ? '#f59e0b' : '#2563eb'" />
          <text x="210" y="130" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">{{ currentStep.values[4] }}</text>

          <circle cx="330" cy="125" r="16" :fill="currentStep.activeIndexes?.includes(5) ? '#f59e0b' : '#2563eb'" />
          <text x="330" y="130" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">{{ currentStep.values[5] }}</text>

          <circle cx="450" cy="125" r="16" :fill="currentStep.activeIndexes?.includes(6) ? '#f59e0b' : '#2563eb'" />
          <text x="450" y="130" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">{{ currentStep.values[6] }}</text>

          <!-- 7 (60, 165) -->
          <circle cx="60" cy="165" r="14" :fill="currentStep.activeIndexes?.includes(7) ? '#f59e0b' : '#2563eb'" />
          <text x="60" y="169" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">{{ currentStep.values[7] }}</text>
        </svg>
      </div>

      <!-- 3. 基数排序专用 10 桶队列视图 -->
      <div v-if="currentAlgorithm === 'radix'" class="radix-stage">
        <div class="current-array-strip">
          <span class="strip-label">当前序列：</span>
          <div class="strip-tokens">
            <span v-for="(v, i) in currentStep.values" :key="i" class="token-box">
              {{ v }}
            </span>
          </div>
        </div>

        <div class="buckets-grid">
          <div v-for="bIdx in 10" :key="bIdx - 1" class="bucket-col">
            <div class="bucket-header">桶 {{ bIdx - 1 }}</div>
            <div class="bucket-body">
              <div
                v-for="(item, itemIdx) in (currentStep.radixBuckets?.[bIdx - 1] || [])"
                :key="itemIdx"
                class="bucket-item"
              >
                {{ item }}
              </div>
              <div v-if="!(currentStep.radixBuckets?.[bIdx - 1]?.length)" class="bucket-empty">空</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部控制面板 -->
    <div class="player-controls">
      <div class="controls-left">
        <button type="button" class="ctrl-btn" @click="resetSteps">↺ 重置</button>
      </div>
      <div class="controls-center">
        <button
          type="button"
          class="ctrl-btn"
          :disabled="currentStepIndex === 0"
          @click="prevStep"
        >
          ← 上一步
        </button>
        <button type="button" class="ctrl-btn play-btn" @click="togglePlay">
          {{ isPlaying ? '⏸ 暂停' : '▶ 自动播放' }}
        </button>
        <button
          type="button"
          class="ctrl-btn primary-btn"
          :disabled="currentStepIndex === currentSteps.length - 1"
          @click="nextStep"
        >
          下一步 →
        </button>
      </div>
      <div class="controls-right">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${((currentStepIndex + 1) / currentSteps.length) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sort-player-card {
  margin: 1.5rem 0;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.player-nav {
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.nav-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  margin-bottom: 10px;
}

.tabs-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tab-btn {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.tab-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.step-banner {
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.step-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}

.step-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.step-desc {
  margin: 0;
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.stage-container {
  padding: 24px 16px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
}

.array-stage {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  width: 100%;
}

.cell-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 52px;
  transition: transform 0.2s;
}

.pointer-slot {
  height: 22px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.pointer-tag {
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.value-rect {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 18px;
  font-weight: bold;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-divider);
  transition: all 0.25s ease;
}

.cell-box.is-active .value-rect {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.18);
  color: #f59e0b;
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.2);
}

.cell-box.is-compared .value-rect {
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.15);
  color: #2563eb;
}

.cell-box.is-sorted .value-rect {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.index-label {
  margin-top: 4px;
  font-size: 11px;
  color: var(--vp-c-text-3);
  font-family: monospace;
}

.heap-tree-view {
  margin-top: 20px;
  width: 100%;
  max-width: 540px;
  text-align: center;
}

.view-title {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}

.tree-svg {
  width: 100%;
  height: auto;
}

.radix-stage {
  width: 100%;
}

.current-array-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.strip-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.strip-tokens {
  display: flex;
  gap: 6px;
}

.token-box {
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  font-family: monospace;
  font-weight: 700;
  font-size: 14px;
}

.buckets-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  margin-top: 10px;
}

@media (max-width: 640px) {
  .buckets-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.bucket-col {
  border: 1px dashed var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg-alt);
  overflow: hidden;
}

.bucket-header {
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  padding: 4px 0;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
}

.bucket-body {
  min-height: 70px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bucket-item {
  font-size: 11px;
  font-family: monospace;
  font-weight: bold;
  text-align: center;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border-radius: 2px;
  padding: 2px 0;
}

.bucket-empty {
  font-size: 10px;
  color: var(--vp-c-text-3);
  text-align: center;
  margin-top: 20px;
}

.player-controls {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  gap: 12px;
  flex-wrap: wrap;
}

.controls-center {
  display: flex;
  gap: 8px;
}

.ctrl-btn {
  padding: 6px 14px;
  font-size: 12.5px;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s;
}

.ctrl-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.ctrl-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ctrl-btn.play-btn {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.ctrl-btn.primary-btn {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.progress-bar {
  width: 120px;
  height: 6px;
  border-radius: 3px;
  background: var(--vp-c-divider);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--vp-c-brand-1);
  transition: width 0.3s ease;
}
</style>
