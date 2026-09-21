<template>
  <div class="practice-container">
    <!-- 顶部横幅与目标看板 -->
    <div class="practice-hero">
      <h1>🎯 408 计算机考研真题分类刷题中心</h1>
      <p class="hero-desc">
        依据《408 真题分类∙做题本》整理 · 全面收录 <strong>2009—2026 年统考真题共 846 题</strong>。
        支持四大科目分章节精准巩固、单选即时判分、大题手写草稿、错题自动归档与站内讲义考点秒级反查。
      </p>

      <!-- 统计仪表盘 -->
      <div class="practice-stats-grid">
        <div class="stat-box" :class="{ active: currentMode === 'all' }" @click="setMode('all')">
          <span class="stat-label">总题库题量</span>
          <span class="stat-value">846</span>
        </div>

        <div class="stat-box" :class="{ active: currentMode === 'all' }" @click="setMode('all')">
          <span class="stat-label">已作答进度</span>
          <span class="stat-value">{{ answeredCount }} <span style="font-size: 0.9rem; font-weight: normal; color: var(--vp-c-text-2);">({{ progressPercent }}%)</span></span>
        </div>

        <div class="stat-box correct">
          <span class="stat-label">选择题正确率</span>
          <span class="stat-value">{{ correctRate }}%</span>
        </div>

        <div class="stat-box wrong" :class="{ active: currentMode === 'wrong' }" @click="setMode('wrong')">
          <span class="stat-label">📕 待攻坚错题</span>
          <span class="stat-value">{{ wrongList.length }}</span>
        </div>

        <div class="stat-box fav" :class="{ active: currentMode === 'favorite' }" @click="setMode('favorite')">
          <span class="stat-label">⭐ 我的收藏本</span>
          <span class="stat-value">{{ favoriteList.length }}</span>
        </div>
      </div>
    </div>

    <!-- 筛选与控制面板 -->
    <div class="practice-filter-panel">
      <!-- 科目药丸选项卡 -->
      <div class="subject-pill-tabs">
        <button
          v-for="sub in subjects"
          :key="sub.key"
          class="subject-pill"
          :class="[sub.key, { active: selectedSubject === sub.key }]"
          @click="onSelectSubject(sub.key)"
        >
          <span>{{ sub.icon }} {{ sub.name }}</span>
          <span class="count-badge">{{ sub.count }}</span>
        </button>
      </div>

      <!-- 二级筛选栏：章节 / 题型 / 年份 / 搜索 -->
      <div class="filter-row">
        <!-- 章节选择 -->
        <select v-model="selectedSection" class="filter-select" style="max-width: 240px;">
          <option value="">📂 全部考点章节 ({{ filteredSections.length }} 个)</option>
          <option v-for="sec in filteredSections" :key="sec.code" :value="sec.code">
            {{ sec.code }} {{ sec.title }} ({{ sec.count }}题)
          </option>
        </select>

        <!-- 题型选择 -->
        <select v-model="selectedType" class="filter-select">
          <option value="">📝 全部题型</option>
          <option value="choice">单项选择题</option>
          <option value="comprehensive">综合应用题</option>
        </select>

        <!-- 年份选择 -->
        <select v-model="selectedYear" class="filter-select">
          <option value="">📅 全部年份 (2009-2026)</option>
          <option v-for="y in yearsList" :key="y" :value="y">{{ y }} 年统考</option>
        </select>

        <!-- 搜索输入框 -->
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="🔍 搜索真题关键字、出处 (如 2011-1) 或代码..."
        />
      </div>

      <!-- 答题模式切换栏 -->
      <div class="mode-switch-bar">
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'all' }"
          @click="setMode('all')"
        >
          📑 顺序刷题
        </button>

        <button
          class="mode-btn"
          :class="{ active: currentMode === 'random' }"
          @click="setMode('random')"
        >
          🎲 随机抽题 (20题)
        </button>

        <button
          class="mode-btn"
          :class="{ active: currentMode === 'wrong' }"
          @click="setMode('wrong')"
        >
          📕 错题专攻 ({{ wrongList.length }})
        </button>

        <button
          class="mode-btn"
          :class="{ active: currentMode === 'favorite' }"
          @click="setMode('favorite')"
        >
          ⭐ 我的收藏 ({{ favoriteList.length }})
        </button>

        <button
          class="mode-btn"
          style="margin-left: auto; color: #ef4444;"
          @click="resetAllProgress"
          title="清空答题记录与错题本"
        >
          🗑️ 重置进度
        </button>
      </div>
    </div>

    <!-- 答题卡快速跳转面板 -->
    <div v-if="filteredQuestions.length" class="answer-sheet-card">
      <div class="sheet-header">
        <span>📋 答题卡与快速定位 (当前筛选结果：共 {{ filteredQuestions.length }} 题)</span>
        <button class="icon-btn" @click="sheetCollapsed = !sheetCollapsed">
          {{ sheetCollapsed ? '展开答题卡 ▼' : '收起答题卡 ▲' }}
        </button>
      </div>

      <div v-show="!sheetCollapsed" class="sheet-grid">
        <div
          v-for="q in filteredQuestions"
          :key="q.id"
          class="sheet-item"
          :class="getSheetItemClass(q)"
          @click="scrollToQuestion(q.id)"
          :title="'#' + q.id + ' (' + q.source + ')'"
        >
          {{ q.id }}
        </div>
      </div>
    </div>

    <!-- 题目加载中状态 -->
    <div v-if="loading" style="text-align: center; padding: 4rem 1rem; color: var(--vp-c-text-2);">
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏳</div>
      正在加载真题题库数据，请稍候...
    </div>

    <!-- 无结果状态 -->
    <div v-else-if="filteredQuestions.length === 0" style="text-align: center; padding: 4rem 1rem; background: var(--vp-c-bg-alt); border-radius: 12px; border: 1px dashed var(--vp-c-divider); margin: 2rem 0;">
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
      <div style="font-size: 1.1rem; font-weight: 700; color: var(--vp-c-text-1);">没有找到符合筛选条件的题目</div>
      <p style="color: var(--vp-c-text-2); font-size: 0.9rem; margin-top: 0.5rem;">
        尝试放宽筛选条件，或切换至「顺序刷题」模式查看完整题库。
      </p>
      <button class="mode-btn active" style="margin-top: 1rem;" @click="clearFilters">
        重置所有筛选条件
      </button>
    </div>

    <!-- 题目列表 -->
    <div v-else class="questions-stream">
      <PracticeQuestionCard
        v-for="q in paginatedQuestions"
        :key="q.id"
        :question="q"
        :user-answer="userAnswers[q.id]"
        :is-favorite="favoriteList.includes(q.id)"
        :is-wrong="wrongList.includes(q.id)"
        :user-note="userNotes[q.id] || ''"
        @select-option="handleSelectOption"
        @toggle-favorite="handleToggleFavorite"
        @toggle-wrong="handleToggleWrong"
        @save-note="handleSaveNote"
        @reset-answer="handleResetAnswer"
      />

      <!-- 分页栏 -->
      <div class="practice-pagination">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          上一页
        </button>

        <span class="page-info">
          第 {{ currentPage }} / {{ totalPages }} 页 (每页 15 题)
        </span>

        <button
          class="page-btn"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { withBase } from 'vitepress'
import PracticeQuestionCard from './PracticeQuestionCard.vue'

const subjects = [
  { key: 'all', name: '全部科目', icon: '⚡', count: 846 },
  { key: 'data-structure', name: '数据结构', icon: '🟢', count: 233 },
  { key: 'computer-organization', name: '计算机组成原理', icon: '🔵', count: 235 },
  { key: 'operating-system', name: '操作系统', icon: '🟣', count: 216 },
  { key: 'computer-network', name: '计算机网络', icon: '🟠', count: 162 }
]

const yearsList = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009]

const selectedSubject = ref('all')
const selectedSection = ref('')
const selectedType = ref('')
const selectedYear = ref('')
const searchQuery = ref('')
const currentMode = ref('all') // 'all', 'random', 'wrong', 'favorite'
const sheetCollapsed = ref(true)

const currentPage = ref(1)
const pageSize = 15
const loading = ref(true)

const sections = ref([])
const questionsMap = ref({
  'data-structure': [],
  'computer-organization': [],
  'operating-system': [],
  'computer-network': []
})

// LocalStorage states
const userAnswers = ref({})
const wrongList = ref([])
const favoriteList = ref([])
const userNotes = ref({})
const randomQuestionIds = ref([])

onMounted(async () => {
  loadLocalState()
  await loadSections()
  await loadAllQuestions()
})

function loadLocalState() {
  if (typeof window === 'undefined') return
  try {
    userAnswers.value = JSON.parse(localStorage.getItem('cs408_answers') || '{}')
    wrongList.value = JSON.parse(localStorage.getItem('cs408_wrong') || '[]')
    favoriteList.value = JSON.parse(localStorage.getItem('cs408_favorites') || '[]')
    userNotes.value = JSON.parse(localStorage.getItem('cs408_notes') || '{}')
  } catch (e) {
    console.error('Failed to load localStorage state', e)
  }
}

function saveLocalState() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('cs408_answers', JSON.stringify(userAnswers.value))
    localStorage.setItem('cs408_wrong', JSON.stringify(wrongList.value))
    localStorage.setItem('cs408_favorites', JSON.stringify(favoriteList.value))
    localStorage.setItem('cs408_notes', JSON.stringify(userNotes.value))
  } catch (e) {}
}

async function loadSections() {
  try {
    const res = await fetch(withBase('/data/practice/sections.json'))
    sections.value = await res.json()
  } catch (e) {
    console.error('Failed to load sections.json', e)
  }
}

async function loadAllQuestions() {
  loading.value = true
  const subKeys = ['data-structure', 'computer-organization', 'operating-system', 'computer-network']
  try {
    await Promise.all(subKeys.map(async (key) => {
      const res = await fetch(withBase(`/data/practice/${key}.json`))
      questionsMap.value[key] = await res.json()
    }))
  } catch (e) {
    console.error('Failed to load questions', e)
  } finally {
    loading.value = false
  }
}

const allQuestionsList = computed(() => {
  return [
    ...(questionsMap.value['data-structure'] || []),
    ...(questionsMap.value['computer-organization'] || []),
    ...(questionsMap.value['operating-system'] || []),
    ...(questionsMap.value['computer-network'] || [])
  ].sort((a, b) => a.id - b.id)
})

const filteredSections = computed(() => {
  if (selectedSubject.value === 'all') return sections.value
  return sections.value.filter(s => s.subjectKey === selectedSubject.value)
})

// Filter questions
const filteredQuestions = computed(() => {
  let list = allQuestionsList.value

  // Mode filter
  if (currentMode.value === 'wrong') {
    list = list.filter(q => wrongList.value.includes(q.id))
  } else if (currentMode.value === 'favorite') {
    list = list.filter(q => favoriteList.value.includes(q.id))
  } else if (currentMode.value === 'random') {
    list = list.filter(q => randomQuestionIds.value.includes(q.id))
  }

  // Subject filter
  if (selectedSubject.value !== 'all') {
    list = list.filter(q => q.subjectKey === selectedSubject.value)
  }

  // Section filter
  if (selectedSection.value) {
    list = list.filter(q => q.sectionCode === selectedSection.value)
  }

  // Type filter
  if (selectedType.value) {
    list = list.filter(q => q.type === selectedType.value)
  }

  // Year filter
  if (selectedYear.value) {
    list = list.filter(q => q.year === parseInt(selectedYear.value))
  }

  // Search query
  if (searchQuery.value.trim()) {
    const qTerm = searchQuery.value.trim().toLowerCase()
    list = list.filter(q => {
      return (
        q.source.toLowerCase().includes(qTerm) ||
        q.stem.toLowerCase().includes(qTerm) ||
        q.sectionTitle.toLowerCase().includes(qTerm) ||
        (q.options && q.options.some(o => o.text.toLowerCase().includes(qTerm)))
      )
    })
  }

  return list
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredQuestions.value.length / pageSize))
})

const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredQuestions.value.slice(start, start + pageSize)
})

// Reset page on filter change
watch([selectedSubject, selectedSection, selectedType, selectedYear, searchQuery, currentMode], () => {
  currentPage.value = 1
})

function onSelectSubject(key) {
  selectedSubject.value = key
  selectedSection.value = ''
}

function setMode(mode) {
  currentMode.value = mode
  if (mode === 'random') {
    generateRandomQuestions()
  }
}

function generateRandomQuestions() {
  const list = selectedSubject.value === 'all'
    ? allQuestionsList.value
    : questionsMap.value[selectedSubject.value] || []
  
  const shuffled = [...list].sort(() => 0.5 - Math.random())
  randomQuestionIds.value = shuffled.slice(0, 20).map(q => q.id)
}

function clearFilters() {
  selectedSubject.value = 'all'
  selectedSection.value = ''
  selectedType.value = ''
  selectedYear.value = ''
  searchQuery.value = ''
  currentMode.value = 'all'
}

// User Action Handlers
function handleSelectOption({ qId, selected, isCorrect }) {
  userAnswers.value[qId] = {
    selected,
    isCorrect,
    timestamp: Date.now()
  }

  if (!isCorrect) {
    if (!wrongList.value.includes(qId)) {
      wrongList.value.push(qId)
    }
  } else {
    // If correct, remove from wrong list
    wrongList.value = wrongList.value.filter(id => id !== qId)
  }
  saveLocalState()
}

function handleResetAnswer(qId) {
  delete userAnswers.value[qId]
  wrongList.value = wrongList.value.filter(id => id !== qId)
  saveLocalState()
}

function handleToggleFavorite(qId) {
  if (favoriteList.value.includes(qId)) {
    favoriteList.value = favoriteList.value.filter(id => id !== qId)
  } else {
    favoriteList.value.push(qId)
  }
  saveLocalState()
}

function handleToggleWrong(qId) {
  if (wrongList.value.includes(qId)) {
    wrongList.value = wrongList.value.filter(id => id !== qId)
  } else {
    wrongList.value.push(qId)
  }
  saveLocalState()
}

function handleSaveNote({ qId, note }) {
  if (!note || !note.trim()) {
    delete userNotes.value[qId]
  } else {
    userNotes.value[qId] = note.trim()
  }
  saveLocalState()
}

function resetAllProgress() {
  if (typeof window !== 'undefined' && window.confirm('确定要清空所有刷题答题记录、错题本与笔记吗？此操作不可逆。')) {
    userAnswers.value = {}
    wrongList.value = []
    favoriteList.value = []
    userNotes.value = {}
    saveLocalState()
  }
}

function scrollToQuestion(qId) {
  const el = document.getElementById('q-' + qId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } else {
    // Find what page it's on
    const idx = filteredQuestions.value.findIndex(q => q.id === qId)
    if (idx !== -1) {
      currentPage.value = Math.floor(idx / pageSize) + 1
      setTimeout(() => {
        const target = document.getElementById('q-' + qId)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }
}

function getSheetItemClass(q) {
  const ans = userAnswers.value[q.id]
  if (ans) {
    return ans.isCorrect ? 'correct' : 'wrong'
  }
  if (userNotes.value[q.id]) {
    return 'noted'
  }
  return ''
}

// Stats metrics
const answeredCount = computed(() => Object.keys(userAnswers.value).length)
const progressPercent = computed(() => {
  return ((answeredCount.value / 846) * 100).toFixed(1)
})
const correctRate = computed(() => {
  const list = Object.values(userAnswers.value)
  if (!list.length) return 0
  const correct = list.filter(a => a.isCorrect).length
  return ((correct / list.length) * 100).toFixed(1)
})
</script>
