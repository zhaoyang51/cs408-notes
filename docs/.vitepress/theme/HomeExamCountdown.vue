<template>
  <div class="exam-hud-container" aria-label="408 备考战力与倒计时仪表盘">
    <div class="hud-glass-panel">
      <!-- 倒计时指示器 -->
      <div class="hud-item countdown-item">
        <span class="hud-icon-pulse">⏳</span>
        <div class="hud-meta">
          <span class="hud-label">距离全国统考仅剩</span>
          <span class="hud-value countdown-num">{{ daysRemaining }} <span class="unit">天</span></span>
        </div>
      </div>

      <div class="hud-divider"></div>

      <!-- 真题题库指标 -->
      <a href="/cs408-notes/practice/" class="hud-item link-item" title="点击进入 846 道真题分类做题本">
        <span class="hud-icon">✍️</span>
        <div class="hud-meta">
          <span class="hud-label">分类真题做题本</span>
          <span class="hud-value">846 <span class="unit">道全收录</span></span>
        </div>
        <span class="hud-arrow">→</span>
      </a>

      <div class="hud-divider"></div>

      <!-- 考点精炼指标 -->
      <div class="hud-item">
        <span class="hud-icon">🎯</span>
        <div class="hud-meta">
          <span class="hud-label">全科核心考点</span>
          <span class="hud-value">97 <span class="unit">个分类</span></span>
        </div>
      </div>

      <div class="hud-divider"></div>

      <!-- 极简应试体系 -->
      <div class="hud-item">
        <span class="hud-icon">⚡</span>
        <div class="hud-meta">
          <span class="hud-label">最小集应试知识</span>
          <span class="hud-value">100% <span class="unit">考纲穿透</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const daysRemaining = ref(90)

function calculateCountdown() {
  const now = new Date()
  const currentYear = now.getFullYear()
  
  // 考研初试通常在 12 月倒数第二个周末（周六）
  // 找该年 12 月倒数第二个周六
  function getExamDate(year) {
    let d = new Date(year, 11, 31) // 12月31日
    let saturdays = []
    while (d.getMonth() === 11) {
      if (d.getDay() === 6) {
        saturdays.push(new Date(d))
      }
      d.setDate(d.getDate() - 1)
    }
    // saturdays 是倒序的，索引 1 为倒数第二个周六
    return saturdays[1] || new Date(year, 11, 21, 8, 30)
  }

  let targetDate = getExamDate(currentYear)
  // 如果今年考试已过，则计算明年的考研
  if (now.getTime() > targetDate.getTime()) {
    targetDate = getExamDate(currentYear + 1)
  }

  const diffTime = targetDate.getTime() - now.getTime()
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  daysRemaining.value = diffDays
}

onMounted(() => {
  calculateCountdown()
})
</script>

<style scoped>
.exam-hud-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 18px 0 28px;
}

.hud-glass-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(229, 231, 235, 0.85);
  border-radius: 9999px;
  box-shadow: 0 10px 30px -4px rgba(0, 0, 0, 0.06);
  max-width: 95vw;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:global(.dark) .hud-glass-panel {
  background: rgba(26, 26, 32, 0.82);
  border-color: rgba(63, 63, 70, 0.6);
  box-shadow: 0 10px 36px -4px rgba(0, 0, 0, 0.4);
}

:global(html.parchment) .hud-glass-panel {
  background: rgba(254, 250, 240, 0.9);
  border-color: rgba(217, 119, 6, 0.25);
  box-shadow: 0 10px 30px -4px rgba(140, 83, 36, 0.08);
}

.hud-glass-panel:hover {
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow: 0 16px 40px -4px rgba(5, 150, 105, 0.15);
  transform: translateY(-2px);
}

.hud-item {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none !important;
  color: inherit;
  transition: all 0.2s ease;
}

.hud-item.link-item {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
}

.hud-item.link-item:hover {
  background: rgba(16, 185, 129, 0.08);
}

.hud-item.link-item:hover .hud-value {
  color: var(--vp-c-brand-1);
}

.hud-item.link-item:hover .hud-arrow {
  transform: translateX(3px);
  color: var(--vp-c-brand-1);
}

.hud-icon {
  font-size: 17px;
  line-height: 1;
}

.hud-icon-pulse {
  font-size: 17px;
  animation: pulse-hud 2.5s infinite ease-in-out;
}

@keyframes pulse-hud {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15) rotate(5deg); }
}

.hud-meta {
  display: flex;
  flex-direction: column;
}

.hud-label {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  letter-spacing: -0.1px;
}

.hud-value {
  font-size: 14.5px;
  font-weight: 800;
  color: var(--vp-c-text-1);
  letter-spacing: -0.2px;
  line-height: 1.2;
}

.countdown-num {
  color: #059669;
}

:global(.dark) .countdown-num {
  color: #34d399;
}

.unit {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.hud-arrow {
  font-size: 13px;
  font-weight: 800;
  color: var(--vp-c-text-3);
  transition: transform 0.2s ease, color 0.2s ease;
  margin-left: -2px;
}

.hud-divider {
  width: 1px;
  height: 24px;
  background: var(--vp-c-divider);
  flex-shrink: 0;
}

@media (max-width: 860px) {
  .hud-glass-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 18px;
    padding: 12px 18px;
    gap: 12px;
  }
  .hud-divider {
    display: none;
  }
}
</style>
