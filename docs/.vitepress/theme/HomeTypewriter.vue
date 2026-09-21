<template>
  <div class="home-typewriter-wrapper" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div class="typewriter-badge" :class="currentBadgeClass">
      <!-- 科目徽章标识 -->
      <span class="subject-tag">
        <span class="tag-icon">{{ currentTag.icon }}</span>
        <span class="tag-name">{{ currentTag.name }}</span>
      </span>

      <span class="tag-divider"></span>

      <!-- 终端前缀与打字机文字 -->
      <div class="text-content">
        <span class="typewriter-prefix">❯</span>
        <span class="typewriter-text">{{ displayText }}</span>
        <span class="typewriter-cursor"></span>
      </div>

      <!-- 快速切换下一条按钮 -->
      <button 
        class="next-spark-btn" 
        type="button" 
        @click.stop="nextSlogan" 
        title="点击换一条考点速记/极客金句"
      >
        <span class="spark-icon">🎲</span>
        <span class="spark-label">换一条</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const items = [
  {
    category: 'ds',
    tag: '数据结构',
    icon: '🟢',
    text: '先序遍历+中序遍历可唯一确定二叉树，而后序+先序无法确定结构'
  },
  {
    category: 'co',
    tag: '计组',
    icon: '🔵',
    text: 'Cache 缺失率：直接映射 > 组相联 > 全相联；命中时间则正好相反'
  },
  {
    category: 'os',
    tag: '操作系统',
    icon: '🟣',
    text: '死锁预防破坏4大互斥条件，死锁避免使用银行家算法维护安全序列'
  },
  {
    category: 'cn',
    tag: '计网',
    icon: '🟠',
    text: 'TCP 三次握手建连接，四次挥手保释放；拥塞控制慢开始与加法增乘法减'
  },
  {
    category: 'ds',
    tag: '数据结构',
    icon: '🟢',
    text: '拓扑排序必为有向无环图 (DAG)，关键路径为 AOE 网中最长路径'
  },
  {
    category: 'co',
    tag: '计组',
    icon: '🔵',
    text: 'IEEE 754 浮点数：1位符号位 + 8位阶码(偏移量127) + 23位尾数'
  },
  {
    category: 'os',
    tag: '操作系统',
    icon: '🟣',
    text: '虚拟内存三大支柱：时间空间局部性 + 地址快表TLB映射 + 页面置换'
  },
  {
    category: 'cn',
    tag: '计网',
    icon: '🟠',
    text: '协议栈分工：物理传比特，链路成帧，网络IP路由，传输端口端到端'
  },
  {
    category: 'geek',
    tag: '赛博哲学',
    icon: '⚡',
    text: '今日赛博务农，明日考场丰收 · 408 知识磁盘坏块修复与绿化工程'
  },
  {
    category: 'geek',
    tag: '高分算法',
    icon: '🎯',
    text: 'const 研究生 = async () => await Promise.all([408.pass(), 数学.top()]);'
  },
  {
    category: 'geek',
    tag: '应试双核',
    icon: '💡',
    text: '时钟周期内破解真题最优解，在课本与真题间构建双向链表'
  }
]

const displayText = ref('')
const isHovered = ref(false)
let timer = null
let currentIndex = -1
let currentCharIndex = 0
let isDeleting = false

const currentTag = computed(() => {
  if (currentIndex < 0 || currentIndex >= items.length) {
    return { name: '考点精髓', icon: '⚡', category: 'geek' }
  }
  return {
    name: items[currentIndex].tag,
    icon: items[currentIndex].icon,
    category: items[currentIndex].category
  }
})

const currentBadgeClass = computed(() => {
  return `badge-${currentTag.value.category}`
})

function getRandomIndex() {
  let newIndex
  do {
    newIndex = Math.floor(Math.random() * items.length)
  } while (newIndex === currentIndex && items.length > 1)
  return newIndex
}

function nextSlogan() {
  if (timer) clearTimeout(timer)
  isDeleting = false
  currentCharIndex = 0
  currentIndex = getRandomIndex()
  displayText.value = ''
  typeWriter()
}

function typeWriter() {
  if (currentIndex === -1) {
    currentIndex = getRandomIndex()
  }

  // 鼠标悬停时暂停打字机，方便完整研读考点
  if (isHovered.value && !isDeleting && currentCharIndex >= items[currentIndex].text.length) {
    timer = setTimeout(typeWriter, 500)
    return
  }

  const currentText = items[currentIndex].text
  const typeSpeed = isDeleting ? 20 : 55

  if (!isDeleting) {
    displayText.value = currentText.substring(0, currentCharIndex + 1)
    currentCharIndex++

    if (currentCharIndex >= currentText.length) {
      isDeleting = true
      timer = setTimeout(typeWriter, 6500) // 停留 6.5 秒以供充分记忆
      return
    }
  } else {
    displayText.value = currentText.substring(0, currentCharIndex - 1)
    currentCharIndex--

    if (currentCharIndex <= 0) {
      isDeleting = false
      currentIndex = getRandomIndex()
      timer = setTimeout(typeWriter, 400)
      return
    }
  }

  timer = setTimeout(typeWriter, typeSpeed)
}

onMounted(() => {
  timer = setTimeout(typeWriter, 500)
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
  margin: 12px 0 22px;
  width: 100%;
}

.typewriter-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 10px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(229, 231, 235, 0.85);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 95vw;
}

:global(.dark) .typewriter-badge {
  background: rgba(26, 26, 32, 0.85);
  border-color: rgba(63, 63, 70, 0.6);
  box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.35);
}

:global(html.parchment) .typewriter-badge {
  background: rgba(254, 250, 240, 0.9);
  border-color: rgba(217, 119, 6, 0.25);
  box-shadow: 0 4px 18px -2px rgba(140, 83, 36, 0.08);
}

.typewriter-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px -4px rgba(5, 150, 105, 0.18);
  border-color: rgba(16, 185, 129, 0.5);
}

/* 科目专属颜色风格映射 */
.badge-ds { border-left: 3px solid #10b981 !important; }
.badge-co { border-left: 3px solid #3b82f6 !important; }
.badge-os { border-left: 3px solid #8b5cf6 !important; }
.badge-cn { border-left: 3px solid #f59e0b !important; }
.badge-geek { border-left: 3px solid #10b981 !important; }

.subject-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11.5px;
  font-weight: 700;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  flex-shrink: 0;
  user-select: none;
}

.tag-divider {
  width: 1px;
  height: 14px;
  background: var(--vp-c-divider);
  flex-shrink: 0;
}

.text-content {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
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
  background-color: #10b981;
  animation: blink 1s infinite;
  flex-shrink: 0;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 换一条按钮 */
.next-spark-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 6px;
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px dashed var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  user-select: none;
}

.next-spark-btn:hover {
  background: var(--vp-c-bg-elv);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: scale(1.05);
}

.spark-icon {
  font-size: 11px;
}

@media (max-width: 768px) {
  .typewriter-badge {
    padding: 5px 10px;
    gap: 6px;
  }
  .text-content {
    font-size: 11.5px;
  }
  .spark-label {
    display: none;
  }
  .next-spark-btn {
    padding: 2px 5px;
  }
}
</style>
