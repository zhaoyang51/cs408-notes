<template>
  <div class="media-card" :class="[`media-${type}`, { 'has-shadow': shadow }]">
    <!-- 头部标头（可选） -->
    <div class="media-header" v-if="title || tag">
      <span class="media-tag" v-if="tag">{{ tag }}</span>
      <span class="media-title" v-if="title">{{ title }}</span>
    </div>

    <!-- 主展示区 -->
    <div class="media-body">
      <!-- 1. 图片 / GIF 动图展示 -->
      <div class="image-wrapper" v-if="src">
        <img :src="src" :alt="alt || title || '示意图'" class="media-img" loading="lazy" />
      </div>

      <!-- 2. 插槽：自定义 HTML5 / SVG / 交互式组件内容 -->
      <slot></slot>
    </div>

    <!-- 底部描述注脚 -->
    <div class="media-caption" v-if="caption">
      <span class="caption-icon">💡</span>
      <span class="caption-text">{{ caption }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  tag: {
    type: String,
    default: '📊 考点架构图'
  },
  caption: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'default' // 'default' | 'diagram' | 'interactive' | 'code'
  },
  shadow: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.media-card {
  margin: 22px 0;
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  overflow: hidden;
  transition: all 0.25s ease;
}

.media-card.has-shadow {
  box-shadow: var(--card-shadow);
}

.media-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--card-hover-shadow);
}

.media-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.media-tag {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.25);
}

.dark .media-tag {
  color: #60a5fa;
}

.media-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.media-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.media-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.media-img:hover {
  transform: scale(1.01);
}

.media-caption {
  padding: 8px 16px 10px 16px;
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  gap: 6px;
}

.caption-icon {
  font-size: 14px;
}
</style>
