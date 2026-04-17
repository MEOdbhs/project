<template>
  <div class="hc-park">
    <div v-for="p in parks" :key="p.name" class="hc-park__row">
      <span class="hc-park__name">{{ p.name }}</span>
      <span class="hc-park__tag" :class="`hc-park__tag--${p.level}`">{{ p.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const parks = [
  { name: '临港化工园区', label: '低风险', level: 'blue' },
  { name: '金山工业区', label: '一般风险', level: 'yellow' },
  { name: '大榭开发区', label: '较大风险', level: 'orange' },
];
</script>

<style lang="less" scoped>
.hc-park {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.hc-park__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
}

.hc-park__name {
  font-size: 12px;
  color: #e2e8f0;
}

.hc-park__tag {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;

  &--blue {
    background: rgba(59, 130, 246, 0.15);
    color: #60a5fa;
  }
  &--yellow {
    background: rgba(234, 179, 8, 0.15);
    color: #facc15;
  }
  &--orange {
    background: rgba(249, 115, 22, 0.15);
    color: #fb923c;
  }
}
</style>
