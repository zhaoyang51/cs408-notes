<template>
  <div :id="'q-' + question.id" class="question-card">
    <!-- 题目头部元信息 -->
    <div class="question-card-header">
      <div class="card-title-group">
        <span class="q-id-badge">#{{ question.id }}</span>
        <span class="q-source-badge">{{ question.source }}</span>
        <span :class="['q-section-badge', getSubjectShort(question.subjectKey)]">
          {{ question.sectionCode }} {{ question.sectionTitle }}
        </span>
        <span class="badge" :class="question.type === 'choice' ? 'badge-freq' : 'badge-formula'">
          {{ question.type === 'choice' ? '单项选择题' : '综合应用题' }}
        </span>
      </div>

      <div class="card-action-group">
        <button 
          class="icon-btn" 
          :class="{ 'active-fav': isFavorite }"
          @click="$emit('toggleFavorite', question.id)"
          :title="isFavorite ? '已收藏' : '收藏此题'"
        >
          {{ isFavorite ? '★ 已收藏' : '☆ 收藏' }}
        </button>

        <button 
          v-if="userAnswer"
          class="icon-btn"
          @click="$emit('resetAnswer', question.id)"
          title="重新作答"
        >
          🔄 重做
        </button>
      </div>
    </div>

    <!-- 题干正文 -->
    <div class="question-stem">
      <template v-for="(block, bIdx) in parsedStemBlocks" :key="bIdx">
        <div v-if="block.type === 'text'" class="stem-text">{{ block.content }}</div>
        <div v-else-if="block.type === 'code'" class="stem-code-wrap">
          <div class="stem-code-header">
            <span class="code-lang-tag">{{ (block.lang || 'c').toUpperCase() }}</span>
            <span class="code-dot-group">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </span>
          </div>
          <pre class="stem-code"><code>{{ block.content }}</code></pre>
        </div>
      </template>
    </div>

    <!-- 选择题选项区 -->
    <div v-if="question.type === 'choice' && question.options && question.options.length" class="options-list">
      <div
        v-for="opt in question.options"
        :key="opt.label"
        class="option-item"
        :class="getOptionClass(opt.label)"
        @click="onSelectOption(opt.label)"
      >
        <span class="opt-label">{{ opt.label }}</span>
        <span class="opt-text">{{ opt.text }}</span>
      </div>
    </div>

    <!-- 综合大题做题纸/草稿纸 -->
    <div v-if="question.type === 'comprehensive'" class="scratchpad-area">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.85rem; font-weight: 600; color: var(--vp-c-text-2);">
        <span>📝 个人解题思路与手写草稿：</span>
        <span v-if="draftSaved" style="color: #10b981; font-weight: normal;">已保存至本地</span>
      </div>
      <textarea
        v-model="draftNote"
        class="scratchpad-textarea"
        placeholder="在此手写记录你的算法思想、核心步骤推导或伪代码（自动保存在本地，考前复盘可用）..."
        @input="onNoteInput"
      ></textarea>
    </div>

    <!-- 解析与答案切换 -->
    <div style="margin-top: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
      <button 
        class="mode-btn" 
        :class="{ active: showAnswer }" 
        @click="showAnswer = !showAnswer"
      >
        {{ showAnswer ? '收起解析' : '💡 查看参考答案与考点精解' }}
      </button>

      <a 
        v-if="question.relatedPath" 
        :href="withBase(question.relatedPath)" 
        target="_blank" 
        class="reference-link-btn"
      >
        📖 反查本节讲义考点 ↗
      </a>
    </div>

    <!-- 展开后的答案与解析卡片 -->
    <div v-if="showAnswer || (userAnswer && question.type === 'choice')" class="answer-box">
      <div class="answer-header">
        <div>
          <span style="font-weight: 700; color: var(--vp-c-text-2); margin-right: 0.5rem;">参考答案：</span>
          <span class="correct-tag">{{ question.answer || (question.type === 'choice' ? '参考选项分析' : '详见大题解答') }}</span>
        </div>
        <div v-if="userAnswer && question.type === 'choice'">
          <span v-if="userAnswer.isCorrect" style="color: #10b981; font-weight: 700;">✅ 回答正确</span>
          <span v-else style="color: #ef4444; font-weight: 700;">❌ 回答错误（你的选择：{{ userAnswer.selected }}）</span>
        </div>
      </div>

      <div class="explanation-text">
        <div v-if="question.explanation">
          <strong>【考点精析】</strong>
          <template v-for="(block, bIdx) in parsedExplanationBlocks" :key="bIdx">
            <span v-if="block.type === 'text'" class="stem-text">{{ block.content }}</span>
            <div v-else-if="block.type === 'code'" class="stem-code-wrap">
              <pre class="stem-code"><code>{{ block.content }}</code></pre>
            </div>
          </template>
        </div>
        <div v-else style="color: var(--vp-c-text-2); font-size: 0.88rem;">
          根据 408 统考大纲：本题考查 <strong>{{ question.sectionTitle }}</strong> 核心概念与常规题型设问。请点击上方按钮跳转到讲义对应章节深入复盘。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { withBase } from 'vitepress'

function parseContentBlocks(rawText) {
  if (!rawText) return []
  const blocks = []
  const regex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      const seg = rawText.slice(lastIndex, match.index).trim()
      if (seg) {
        blocks.push({ type: 'text', content: seg })
      }
    }
    blocks.push({
      type: 'code',
      lang: match[1] || 'c',
      content: match[2].trimEnd()
    })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < rawText.length) {
    const remaining = rawText.slice(lastIndex).trim()
    if (remaining) {
      blocks.push({ type: 'text', content: remaining })
    }
  }

  if (blocks.length === 0) {
    blocks.push({ type: 'text', content: rawText })
  }

  return blocks
}

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  userAnswer: {
    type: Object,
    default: null
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  isWrong: {
    type: Boolean,
    default: false
  },
  userNote: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['selectOption', 'toggleFavorite', 'toggleWrong', 'saveNote', 'resetAnswer'])

const parsedStemBlocks = computed(() => parseContentBlocks(props.question?.stem))
const parsedExplanationBlocks = computed(() => parseContentBlocks(props.question?.explanation))

const showAnswer = ref(false)
const draftNote = ref(props.userNote || '')
const draftSaved = ref(false)
let noteTimer = null

watch(() => props.userNote, (val) => {
  draftNote.value = val || ''
})

function getSubjectShort(subKey) {
  if (subKey === 'data-structure') return 'ds'
  if (subKey === 'computer-organization') return 'co'
  if (subKey === 'operating-system') return 'os'
  if (subKey === 'computer-network') return 'cn'
  return ''
}

function onSelectOption(label) {
  const isCorrect = props.question.answer ? label === props.question.answer : true
  emit('selectOption', {
    qId: props.question.id,
    selected: label,
    isCorrect: isCorrect
  })
}

function getOptionClass(label) {
  if (!props.userAnswer) return ''
  
  const selected = props.userAnswer.selected === label
  const isCorrectAnswer = props.question.answer === label

  if (props.question.answer) {
    if (isCorrectAnswer) return 'correct-ans'
    if (selected && !props.userAnswer.isCorrect) return 'wrong-ans'
  } else {
    if (selected) return 'selected'
  }
  return ''
}

function onNoteInput() {
  draftSaved.value = false
  if (noteTimer) clearTimeout(noteTimer)
  noteTimer = setTimeout(() => {
    emit('saveNote', {
      qId: props.question.id,
      note: draftNote.value
    })
    draftSaved.value = true
    setTimeout(() => { draftSaved.value = false }, 2000)
  }, 600)
}
</script>
