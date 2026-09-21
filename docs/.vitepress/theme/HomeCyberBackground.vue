<template>
  <div v-if="isHome" class="cyber-bg-container" aria-hidden="true">
    <canvas ref="canvasRef" id="bg-canvas"></canvas>
    <div class="vignette-overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { frontmatter } = useData()
const canvasRef = ref(null)

const isHome = computed(() => {
  return frontmatter.value.layout === 'home' || 
         route.path === '/' || 
         route.path === '/cs408-notes/' || 
         route.path.endsWith('/index.html')
})

let animId = null
let width = 0
let height = 0
let time = 0
let mouse = { x: -1000, y: -1000 }

const config = {
  gridSize: 6,
  gap: 2,
  waveSpeed: 0.55,
  mouseRadius: 160,
  mouseForce: 0.32
}

function safeCoord(val) {
  if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) return -1000
  return val
}

function getOffset(x, y) {
  const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return (hash - Math.floor(hash)) * Math.PI * 2
}

function smoothOrganic(x, y, t) {
  const baseFreq = 0.008
  const wave1 = Math.sin(x * baseFreq + y * baseFreq * 0.3 + t * 0.015)
  const wave2 = Math.cos(y * baseFreq * 1.2 - x * baseFreq * 0.5 + t * 0.012)
  const offset1 = getOffset(x * 0.05, y * 0.05)
  const localWave1 = Math.sin(x * 0.025 + y * 0.015 + t * 0.02 + offset1)
  const localWave2 = Math.cos((x - y) * 0.012 + t * 0.015)
  const detail = Math.sin(x * 0.06 + offset1 * 0.5) * Math.sin(y * 0.04 + t * 0.025) * 0.12
  return wave1 * 0.35 + wave2 * 0.25 + localWave1 * 0.2 + localWave2 * 0.15 + detail
}

function resize() {
  if (!canvasRef.value) return
  width = window.innerWidth
  height = window.innerHeight
  canvasRef.value.width = width
  canvasRef.value.height = height
}

function drawGrid(ctx) {
  const root = document.documentElement
  const isDark = root.classList.contains('dark')
  const isParchment = root.classList.contains('parchment')

  // 背景底色与全站主题自然融合
  if (isDark) {
    ctx.fillStyle = '#18181b'
  } else if (isParchment) {
    ctx.fillStyle = '#fbf5e8'
  } else {
    ctx.fillStyle = '#f8f9fa'
  }
  ctx.fillRect(0, 0, width, height)

  const mx = safeCoord(mouse.x)
  const my = safeCoord(mouse.y)
  const cellSize = config.gridSize + config.gap
  const cols = Math.ceil(width / cellSize) + 1
  const rows = Math.ceil(height / cellSize) + 1

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * cellSize
      const y = j * cellSize

      let value = smoothOrganic(x, y, time)

      const dx = x - mx
      const dy = y - my
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < config.mouseRadius && dist > 0) {
        const force = (1 - dist / config.mouseRadius) * config.mouseForce
        const ripple = Math.sin(dist * 0.05 - time * 0.12)
        value += ripple * force * 0.5
      }

      value = (value + 1.2) / 2.4

      if (value > 0.52) {
        const size = config.gridSize

        if (value > 0.72) {
          const intensity = (value - 0.72) / 0.28
          if (isDark) {
            // 深色翠绿荧光
            const r = Math.floor(40 + intensity * 50)
            const g = Math.floor(160 + intensity * 95)
            const b = Math.floor(90 + intensity * 60)
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.65)`
          } else if (isParchment) {
            // 羊皮纸墨绿柔光
            const r = Math.floor(65 + intensity * 40)
            const g = Math.floor(135 + intensity * 55)
            const b = Math.floor(75 + intensity * 40)
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`
          } else {
            // 浅色赛博翡翠绿
            const r = Math.floor(80 + intensity * 50)
            const g = Math.floor(190 + intensity * 55)
            const b = Math.floor(140 + intensity * 55)
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.55)`
          }
        } else {
          const intensity = (value - 0.52) / 0.2
          if (isDark) {
            const gray = Math.floor(110 + intensity * 40)
            ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.42)`
          } else if (isParchment) {
            const gray = Math.floor(190 - intensity * 25)
            ctx.fillStyle = `rgba(${gray + 10}, ${gray}, ${gray - 20}, 0.35)`
          } else {
            const gray = Math.floor(205 - intensity * 20)
            ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.35)`
          }
        }

        ctx.fillRect(x, y, size, size)
      }
    }
  }
}

function animate() {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  time += config.waveSpeed
  drawGrid(ctx)
  animId = requestAnimationFrame(animate)
}

function onMouseMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

function onMouseLeave() {
  mouse.x = -1000
  mouse.y = -1000
}

function startAnimation() {
  if (typeof window === 'undefined') return
  stopAnimation()
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseleave', onMouseLeave)
  animate()
}

function stopAnimation() {
  if (animId) {
    cancelAnimationFrame(animId)
    animId = null
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseleave', onMouseLeave)
  }
}

watch(isHome, (val) => {
  if (val) {
    setTimeout(startAnimation, 50)
  } else {
    stopAnimation()
  }
})

onMounted(() => {
  if (isHome.value) {
    startAnimation()
  }
})

onUnmounted(() => {
  stopAnimation()
})
</script>

<style scoped>
.cyber-bg-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

#bg-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.vignette-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: radial-gradient(circle at center, rgba(248, 249, 250, 0) 0%, rgba(248, 249, 250, 0.55) 100%);
}

:global(.dark) .vignette-overlay {
  background: radial-gradient(circle at center, rgba(24, 24, 27, 0) 0%, rgba(24, 24, 27, 0.72) 100%);
}

:global(html.parchment) .vignette-overlay {
  background: radial-gradient(circle at center, rgba(251, 245, 232, 0) 0%, rgba(243, 234, 216, 0.65) 100%);
}
</style>
