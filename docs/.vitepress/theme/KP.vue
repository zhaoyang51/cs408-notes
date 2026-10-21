<template>
  <div class="kp-card">
    <div class="kp-header" v-if="title || tag">
      <div class="kp-header-left">
        <span v-if="tag" class="kp-tag">{{ tag }}</span>
        <span v-if="title" class="kp-title">{{ title }}</span>
      </div>
    </div>
    <div class="kp-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  tag: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.kp-card {
  position: relative;
  margin: 18px 0;
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  box-shadow: var(--card-shadow);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.kp-card:hover {
  box-shadow: var(--card-hover-shadow);
  border-color: var(--vp-c-brand-1);
}

.kp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  gap: 10px;
}

.kp-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.kp-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
}

.kp-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.kp-body {
  padding: 14px 18px;
  font-size: 14.5px;
  line-height: 1.7;
}

.kp-body :deep(p:first-child) {
  margin-top: 0;
}

.kp-body :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
