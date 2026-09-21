<template>
  <div class="home-typewriter-wrapper">
    <div class="typewriter-badge">
      <span class="pulse-dot"></span>
      <span class="typewriter-prefix">❯</span>
      <span class="typewriter-text">{{ displayText }}</span>
      <span class="typewriter-cursor"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slogans = [
  "今日赛博务农，明日考场丰收",
  "Keep your 408 contribution graph green",
  "408知识磁盘绿化工程",
  "fsck -y /dev/408：408知识磁盘坏块修复工程",
  "const 研究生 = async () => await allGreen(Promise);",
  "时钟周期内破解408真题的时空最优解",
  "408知识索引B+树构建工程",
  "课本与真题的双向链表",
  "构建408知识链路层，建立零差错的知识传输通道"
]

const displayText = ref('')
let timer = null
let currentSloganIndex = -1
let currentCharIndex = 0
let isDeleting = false

function getRandomIndex() {
  let newIndex
  do {
    newIndex = Math.floor(Math.random() * slogans.length)
  } while (newIndex === currentSloganIndex && slogans.length > 1)
  return newIndex
}

function typeWriter() {
  if (currentSloganIndex === -1) {
    currentSloganIndex = getRandomIndex()
  }

  const currentText = slogans[currentSloganIndex]
  const typeSpeed = isDeleting ? 25 : 65

  if (!isDeleting) {
    displayText.value = currentText.substring(0, currentCharIndex + 1)
    currentCharIndex++

    if (currentCharIndex >= currentText.length) {
      isDeleting = true
      timer = setTimeout(typeWriter, 5000)
      return
    }
  } else {
    displayText.value = currentText.substring(0, currentCharIndex - 1)
    currentCharIndex--

    if (currentCharIndex <= 0) {
      isDeleting = false
      currentSloganIndex = getRandomIndex()
      timer = setTimeout(typeWriter, 500)
      return
    }
  }

  timer = setTimeout(typeWriter, typeSpeed)
}

onMounted(() => {
  timer = setTimeout(typeWriter, 600)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.home-typewriter-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 14px 0 20px;
  width: 100%;
}

.typewriter-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.28);
  padding: 6px 16px;
  border-radius: 9999px;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13.5px;
  font-weight: 600;
  color: #059669;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 16px -2px rgba(5, 150, 105, 0.12);
  max-width: 90vw;
  transition: all 0.3s ease;
}

:global(.dark) .typewriter-badge {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(52, 211, 153, 0.35);
  color: #34d399;
  box-shadow: 0 4px 20px -2px rgba(16, 185, 129, 0.2);
}

:global(html.parchment) .typewriter-badge {
  background: rgba(4, 120, 87, 0.08);
  border-color: rgba(4, 120, 87, 0.25);
  color: #065f46;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulse-glow 2s infinite ease-in-out;
  flex-shrink: 0;
}

@keyframes pulse-glow {
  0%, 100% {
    transform: scale(0.9);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
    box-shadow: 0 0 12px #34d399;
  }
}

.typewriter-prefix {
  color: #10b981;
  font-weight: 800;
  flex-shrink: 0;
}

.typewriter-text {
  letter-spacing: -0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.typewriter-cursor {
  display: inline-block;
  width: 2px;
  height: 14px;
  background-color: #059669;
  animation: blink 1s infinite;
  flex-shrink: 0;
}

:global(.dark) .typewriter-cursor {
  background-color: #34d399;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .typewriter-badge {
    font-size: 11.5px;
    padding: 5px 12px;
    gap: 6px;
  }
}
</style>
