<template>
  <div class="cyber-bg-wrapper">
    <!-- 赛博背景画布：置于底层，穿透，仅在首页生效 -->
    <div v-if="isHome" class="cyber-bg-container" aria-hidden="true">
      <canvas ref="canvasRef" id="bg-canvas"></canvas>
      <div class="vignette-overlay"></div>
    </div>

    <!-- 右下角极简赛博视觉调控胶囊：Teleport 至 body 根节点，彻底摆脱一切父级层叠上下文遮挡 -->
    <ClientOnly>
      <Teleport to="body">
        <div v-if="isMounted && isHome" class="bg-mode-floating-control" @click.stop>
          <div class="floating-pill" :class="{ 'is-active': isMenuOpen }">
            <button 
              class="pill-btn" 
              type="button" 
              @click.stop="toggleModeMenu"
              :title="`当前背景模式：${currentThemeName}，点击切换`"
            >
              <span class="pill-dot" :style="{ background: currentThemeColor }"></span>
              <span class="pill-label">{{ currentThemeName }}</span>
              <span class="pill-arrow" :class="{ 'is-open': isMenuOpen }">▾</span>
            </button>

            <transition name="pill-fade">
              <div v-if="isMenuOpen" class="pill-dropdown-menu" @click.stop>
                <div class="dropdown-title">⚡ 408 赛博量子画布</div>
                
                <button 
                  class="menu-item" 
                  :class="{ active: currentMode === 'quad' }"
                  @click.stop="setBgMode('quad')"
                >
                  <span class="item-icon">🌈</span>
                  <div class="item-text">
                    <span class="item-name">四科光谱矩阵</span>
                    <span class="item-sub">绿蓝紫橙 · 四门科目融合极光</span>
                  </div>
                </button>

                <button 
                  class="menu-item" 
                  :class="{ active: currentMode === 'green' }"
                  @click.stop="setBgMode('green')"
                >
                  <span class="item-icon">🟩</span>
                  <div class="item-text">
                    <span class="item-name">经典赛博绿茵</span>
                    <span class="item-sub">GitHub 贡献图流体波浪</span>
                  </div>
                </button>

                <button 
                  class="menu-item" 
                  :class="{ active: currentMode === 'aurora' }"
                  @click.stop="setBgMode('aurora')"
                >
                  <span class="item-icon">🌌</span>
                  <div class="item-text">
                    <span class="item-name">深空青紫极光</span>
                    <span class="item-sub">科技电青与赛博霓虹</span>
                  </div>
                </button>

                <div class="menu-divider"></div>

                <button class="menu-item toggle-item" @click.stop="toggleAnimation">
                  <span class="item-icon">{{ isPaused ? '▶️' : '⏸️' }}</span>
                  <div class="item-text">
                    <span class="item-name">{{ isPaused ? '恢复流体动态' : '静止省电模式' }}</span>
                    <span class="item-sub">{{ isPaused ? '已暂停帧渲染' : '正以 60FPS 平滑流转' }}</span>
                  </div>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { frontmatter } = useData()
const canvasRef = ref(null)
const isMenuOpen = ref(false)
const isPaused = ref(false)
const isMounted = ref(false)

// 背景预设模式：quad (四科光谱) | green (经典绿茵) | aurora (青紫极光)
const currentMode = ref('quad')

const isHome = computed(() => {
  return frontmatter.value.layout === 'home' || 
         route.path === '/' || 
         route.path === '/cs408-notes/' || 
         route.path.endsWith('/index.html')
})

const currentThemeName = computed(() => {
  if (currentMode.value === 'quad') return '四科光谱'
  if (currentMode.value === 'green') return '赛博绿茵'
  if (currentMode.value === 'aurora') return '青紫极光'
  return '视觉矩阵'
})

const currentThemeColor = computed(() => {
  if (currentMode.value === 'quad') return 'linear-gradient(135deg, #10b981, #3b82f6)'
  if (currentMode.value === 'green') return '#10b981'
  if (currentMode.value === 'aurora') return '#8b5cf6'
  return '#10b981'
})

let animId = null
let width = 0
let height = 0
let time = 0
let mouse = { x: -1000, y: -1000 }

const config = {
  gridSize: 6,
  gap: 2,
  waveSpeed: 0.52,
  mouseRadius: 170,
  mouseForce: 0.35
}

// 模拟芯片总线与网络路由器中穿梭的微光数据包 (Data Packets)
const packets = []
const MAX_PACKETS = 14

function initPackets() {
  packets.length = 0
  for (let i = 0; i < MAX_PACKETS; i++) {
    spawnPacket()
  }
}

function spawnPacket() {
  const cellSize = config.gridSize + config.gap
  const isHorizontal = Math.random() > 0.5
  const cols = Math.ceil((width || 1200) / cellSize)
  const rows = Math.ceil((height || 800) / cellSize)
  
  const col = Math.floor(Math.random() * cols)
  const row = Math.floor(Math.random() * rows)
  
  packets.push({
    x: col * cellSize,
    y: row * cellSize,
    vx: isHorizontal ? (Math.random() > 0.5 ? 2.5 : -2.5) : 0,
    vy: !isHorizontal ? (Math.random() > 0.5 ? 2.5 : -2.5) : 0,
    len: Math.floor(Math.random() * 4) + 3,
    colorType: Math.floor(Math.random() * 4), // 0: 数据结构绿, 1: 计组蓝, 2: 操作系统紫, 3: 计网橙
    life: 0,
    maxLife: Math.floor(Math.random() * 200) + 120
  })
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
  const baseFreq = 0.0075
  const wave1 = Math.sin(x * baseFreq + y * baseFreq * 0.3 + t * 0.015)
  const wave2 = Math.cos(y * baseFreq * 1.2 - x * baseFreq * 0.5 + t * 0.012)
  const offset1 = getOffset(x * 0.05, y * 0.05)
  const localWave1 = Math.sin(x * 0.024 + y * 0.016 + t * 0.018 + offset1)
  const localWave2 = Math.cos((x - y) * 0.011 + t * 0.014)
  const detail = Math.sin(x * 0.06 + offset1 * 0.5) * Math.sin(y * 0.04 + t * 0.022) * 0.12
  return wave1 * 0.35 + wave2 * 0.25 + localWave1 * 0.2 + localWave2 * 0.15 + detail
}

function resize() {
  if (!canvasRef.value) return
  width = window.innerWidth
  height = window.innerHeight
  canvasRef.value.width = width
  canvasRef.value.height = height
}

// 核心多光谱调色算法：根据屏幕物理坐标插值四科颜色
function getSpectrumColor(x, y, intensity, isDark, isParchment) {
  const mode = currentMode.value

  if (mode === 'green') {
    // 经典单色赛博绿
    if (isDark) {
      return `rgba(${Math.floor(40 + intensity * 50)}, ${Math.floor(160 + intensity * 95)}, ${Math.floor(90 + intensity * 60)}, 0.65)`
    } else if (isParchment) {
      return `rgba(${Math.floor(65 + intensity * 40)}, ${Math.floor(135 + intensity * 55)}, ${Math.floor(75 + intensity * 40)}, 0.6)`
    } else {
      return `rgba(${Math.floor(70 + intensity * 50)}, ${Math.floor(190 + intensity * 55)}, ${Math.floor(130 + intensity * 55)}, 0.58)`
    }
  }

  if (mode === 'aurora') {
    // 深空极光：青电蓝与霓虹紫渐变
    const ratio = Math.sin(x * 0.002 + y * 0.002 + time * 0.02) * 0.5 + 0.5
    // 青色: (6, 182, 212) -> 紫色: (168, 85, 247)
    const r = Math.floor(6 + ratio * (168 - 6))
    const g = Math.floor(182 + ratio * (85 - 182))
    const b = Math.floor(212 + ratio * (247 - 212))
    const alpha = isDark ? 0.68 : (isParchment ? 0.52 : 0.58)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // 默认：四科光谱融合矩阵 (Quad-Core Spectrum)
  // 🟢 数据结构 (左上): #10b981 (16, 185, 129)
  // 🔵 计组 (右上): #3b82f6 (59, 130, 246)
  // 🟣 操作系统 (左下): #8b5cf6 (139, 92, 246)
  // 🟠 计网 (右下): #f59e0b (245, 158, 11)
  const u = Math.min(1, Math.max(0, x / (width || 1200)))
  const v = Math.min(1, Math.max(0, y / (height || 800)))

  // 空间双线性插值
  const rTop = 16 * (1 - u) + 59 * u
  const gTop = 185 * (1 - u) + 130 * u
  const bTop = 129 * (1 - u) + 246 * u

  const rBottom = 139 * (1 - u) + 245 * u
  const gBottom = 92 * (1 - u) + 158 * u
  const bBottom = 246 * (1 - u) + 11 * u

  let r = Math.floor(rTop * (1 - v) + rBottom * v)
  let g = Math.floor(gTop * (1 - v) + gBottom * v)
  let b = Math.floor(bTop * (1 - v) + bBottom * v)

  // 根据波浪强度增加亮度
  r = Math.min(255, Math.floor(r + intensity * 45))
  g = Math.min(255, Math.floor(g + intensity * 35))
  b = Math.min(255, Math.floor(b + intensity * 35))

  if (isParchment) {
    // 羊皮纸模式下压低过曝蓝光，增强自然温润度
    return `rgba(${Math.floor(r * 0.85)}, ${Math.floor(g * 0.85)}, ${Math.floor(b * 0.8)}, 0.58)`
  }

  const alpha = isDark ? 0.68 : 0.58
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function drawGrid(ctx) {
  const root = document.documentElement
  const isDark = root.classList.contains('dark')
  const isParchment = root.classList.contains('parchment')

  // 背景底色与全站三大主题浑然一体
  if (isDark) {
    ctx.fillStyle = '#16161a'
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

  // 1. 渲染波浪矩阵像素点
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * cellSize
      const y = j * cellSize

      let value = smoothOrganic(x, y, time)

      const dx = x - mx
      const dy = y - my
      const dist = Math.sqrt(dx * dx + dy * dy)

      // 鼠标水波震荡与轻微吸引力
      if (dist < config.mouseRadius && dist > 0) {
        const force = (1 - dist / config.mouseRadius) * config.mouseForce
        const ripple = Math.sin(dist * 0.05 - time * 0.12)
        value += ripple * force * 0.55
      }

      value = (value + 1.2) / 2.4

      if (value > 0.52) {
        const size = config.gridSize

        if (value > 0.70) {
          const intensity = (value - 0.70) / 0.30
          ctx.fillStyle = getSpectrumColor(x, y, intensity, isDark, isParchment)
        } else {
          const intensity = (value - 0.52) / 0.18
          if (isDark) {
            const gray = Math.floor(100 + intensity * 35)
            ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray + 10}, 0.38)`
          } else if (isParchment) {
            const gray = Math.floor(190 - intensity * 25)
            ctx.fillStyle = `rgba(${gray + 8}, ${gray}, ${gray - 18}, 0.32)`
          } else {
            const gray = Math.floor(210 - intensity * 22)
            ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.32)`
          }
        }

        ctx.fillRect(x, y, size, size)
      }
    }
  }

  // 2. 渲染微光数据流小包 (Bus & Router Micro-Packets)
  if (!isPaused.value) {
    const packetColors = [
      'rgba(16, 185, 129, 0.85)', // 数据结构
      'rgba(59, 130, 246, 0.85)', // 计组
      'rgba(139, 92, 246, 0.85)', // 操作系统
      'rgba(245, 158, 11, 0.85)'   // 计网
    ]

    for (let p = packets.length - 1; p >= 0; p--) {
      const pkt = packets[p]
      pkt.x += pkt.vx
      pkt.y += pkt.vy
      pkt.life++

      ctx.fillStyle = packetColors[pkt.colorType]
      ctx.fillRect(pkt.x, pkt.y, config.gridSize, config.gridSize)

      // 绘制数据包流光拖尾
      for (let t = 1; t <= pkt.len; t++) {
        const trailX = pkt.x - pkt.vx * t * 1.5
        const trailY = pkt.y - pkt.vy * t * 1.5
        ctx.fillStyle = packetColors[pkt.colorType].replace('0.85', `${(0.6 / t).toFixed(2)}`)
        ctx.fillRect(trailX, trailY, config.gridSize, config.gridSize)
      }

      if (pkt.life > pkt.maxLife || pkt.x < 0 || pkt.x > width || pkt.y < 0 || pkt.y > height) {
        packets.splice(p, 1)
        spawnPacket()
      }
    }
  }

  // 3. 鼠标高维光晕感应 (Magnetic Cursor Glow)
  if (mx > -500 && my > -500) {
    const glowGrad = ctx.createRadialGradient(mx, my, 0, mx, my, config.mouseRadius)
    if (isDark) {
      glowGrad.addColorStop(0, 'rgba(52, 211, 153, 0.12)')
      glowGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)')
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    } else {
      glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.15)')
      glowGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.06)')
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    }
    ctx.fillStyle = glowGrad
    ctx.fillRect(mx - config.mouseRadius, my - config.mouseRadius, config.mouseRadius * 2, config.mouseRadius * 2)
  }
}

function animate() {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  if (!isPaused.value) {
    time += config.waveSpeed
  }
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
  initPackets()
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

function toggleModeMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function setBgMode(mode) {
  currentMode.value = mode
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cs408-bg-mode', mode)
  }
  isMenuOpen.value = false
}

function toggleAnimation() {
  isPaused.value = !isPaused.value
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('cs408-bg-paused', isPaused.value ? 'true' : 'false')
  }
  isMenuOpen.value = false
}

function handleOutsideClick(e) {
  if (isMenuOpen.value) {
    const el = document.querySelector('.bg-mode-floating-control')
    if (el && !el.contains(e.target)) {
      isMenuOpen.value = false
    }
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
  isMounted.value = true
  if (typeof localStorage !== 'undefined') {
    const savedMode = localStorage.getItem('cs408-bg-mode')
    if (savedMode) currentMode.value = savedMode
    const savedPause = localStorage.getItem('cs408-bg-paused')
    if (savedPause === 'true') isPaused.value = true
    window.addEventListener('click', handleOutsideClick)
    window.addEventListener('touchstart', handleOutsideClick, { passive: true })
  }

  if (isHome.value) {
    startAnimation()
  }
})

onUnmounted(() => {
  stopAnimation()
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleOutsideClick)
    window.removeEventListener('touchstart', handleOutsideClick)
  }
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
  background: radial-gradient(circle at 50% 45%, rgba(248, 249, 250, 0) 15%, rgba(248, 249, 250, 0.58) 100%);
}

:global(.dark) .vignette-overlay {
  background: radial-gradient(circle at 50% 45%, rgba(22, 22, 26, 0) 15%, rgba(22, 22, 26, 0.72) 100%);
}

:global(html.parchment) .vignette-overlay {
  background: radial-gradient(circle at 50% 45%, rgba(251, 245, 232, 0) 15%, rgba(243, 234, 216, 0.65) 100%);
}

/* ── 右下角悬浮控制胶囊 ── */
.bg-mode-floating-control {
  position: fixed !important;
  bottom: 28px !important;
  right: 28px !important;
  z-index: 999999 !important;
  pointer-events: auto !important;
}

.floating-pill {
  position: relative;
  pointer-events: auto !important;
}

.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(229, 231, 235, 0.85);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  pointer-events: auto !important;
}

:global(.dark) .pill-btn {
  background: rgba(30, 30, 36, 0.92);
  border-color: rgba(63, 63, 70, 0.7);
  color: var(--vp-c-text-1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

:global(html.parchment) .pill-btn {
  background: rgba(254, 250, 240, 0.94);
  border-color: rgba(217, 119, 6, 0.3);
  color: var(--vp-c-text-1);
}

.pill-btn:hover,
.floating-pill.is-active .pill-btn {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(5, 150, 105, 0.25);
}

.pill-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
  pointer-events: none;
}

.pill-label {
  pointer-events: none;
}

.pill-arrow {
  font-size: 10px;
  transition: transform 0.2s ease;
  line-height: 1;
  pointer-events: none;
}

.pill-arrow.is-open {
  transform: rotate(180deg);
}

/* 展开菜单 */
.pill-dropdown-menu {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;
  width: 236px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 231, 235, 0.85);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 20px 48px -6px rgba(0, 0, 0, 0.22);
  z-index: 1000000 !important;
  pointer-events: auto !important;
}

:global(.dark) .pill-dropdown-menu {
  background: rgba(24, 24, 28, 0.95);
  border-color: rgba(63, 63, 70, 0.6);
  box-shadow: 0 16px 40px -6px rgba(0, 0, 0, 0.45);
}

:global(html.parchment) .pill-dropdown-menu {
  background: rgba(254, 250, 240, 0.96);
  border-color: rgba(217, 119, 6, 0.25);
}

.dropdown-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-3);
  padding: 4px 8px 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 10px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.menu-item:hover {
  background: var(--vp-c-bg-soft);
}

.menu-item.active {
  background: rgba(16, 185, 129, 0.1);
}

:global(.dark) .menu-item.active {
  background: rgba(16, 185, 129, 0.16);
}

.item-icon {
  font-size: 15px;
  flex-shrink: 0;
}

.item-text {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.menu-item.active .item-name {
  color: var(--vp-c-brand-1);
}

.item-sub {
  font-size: 10px;
  color: var(--vp-c-text-3);
  margin-top: 1px;
}

.menu-divider {
  height: 1px;
  background: var(--vp-c-divider);
  margin: 6px 0;
}

.pill-fade-enter-active,
.pill-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.pill-fade-enter-from,
.pill-fade-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.95);
}

@media (max-width: 768px) {
  .bg-mode-floating-control {
    bottom: 16px;
    right: 16px;
  }
}
</style>
