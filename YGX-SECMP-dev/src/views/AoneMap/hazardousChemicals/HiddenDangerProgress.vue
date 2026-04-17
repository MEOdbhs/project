<template>
  <div class="hc-hd">
    <div v-for="row in rows" :key="row.label" class="hc-hd__row">
      <div class="hc-hd__head">
        <span class="hc-hd__lbl">{{ row.label }}</span>
        <span class="hc-hd__pct" :class="row.pctClass">{{ row.pct }}%</span>
      </div>
      <div class="hc-hd__track">
        <div class="hc-hd__fill" :class="row.fillClass" :style="{ width: `${row.pct}%` }" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const rows = [
  { label: '未处置', pct: 12, pctClass: 'hc-hd__pct--red', fillClass: 'hc-hd__fill--red' },
  { label: '处置中', pct: 35, pctClass: 'hc-hd__pct--orange', fillClass: 'hc-hd__fill--orange' },
  { label: '已闭环', pct: 53, pctClass: 'hc-hd__pct--green', fillClass: 'hc-hd__fill--green' },
];
</script>

<style lang="less" scoped>
.hc-hd {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
}

.hc-hd__head {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}

.hc-hd__lbl {
  color: #94a3b8;
}

.hc-hd__pct {
  font-weight: 700;

  &--red {
    color: #f87171;
  }
  &--orange {
    color: #fb923c;
  }
  &--green {
    color: #4ade80;
  }
}

.hc-hd__track {
  height: 8px;
  border-radius: 999px;
  background: #1e293b;
  overflow: hidden;
}

.hc-hd__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.8s ease-out;

  &--red {
    background: #ef4444;
  }
  &--orange {
    background: #f97316;
  }
  &--green {
    background: #4ade80;
  }
}
</style>
