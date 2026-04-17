<template>
  <div class="rank">
    <div v-for="(region, index) in regions" :key="region.name" class="rank__row">
      <span :class="['rank__num', index < 3 ? 'rank__num--top' : '']">{{ index + 1 }}</span>
      <div class="rank__bar-wrap">
        <div class="rank__label-row">
          <span class="rank__name">{{ region.name }}</span>
          <span class="rank__count">{{ region.count }}处</span>
        </div>
        <div class="rank__track">
          <div
            class="rank__fill"
            :class="barClass(index)"
            :style="{ width: region.percentage + '%' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/** 大屏仅展示 Top3，压缩纵向占位 */
const regions = [
  { name: '刘家峡镇', count: 28, percentage: 100 },
  { name: '盐锅峡镇', count: 24, percentage: 86 },
  { name: '西河镇', count: 19, percentage: 68 },
];

function barClass(index: number) {
  if (index === 0) return 'rank__fill--1';
  if (index === 1) return 'rank__fill--2';
  if (index === 2) return 'rank__fill--3';
  return 'rank__fill--rest';
}
</script>

<style lang="less" scoped>
.rank {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rank__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rank__num {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(51, 65, 85, 0.6);
  color: #cbd5e1;

  &--top {
    background: linear-gradient(135deg, #38bdf8, #0ea5e9);
    color: #0c1220;
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.35);
  }
}

.rank__bar-wrap {
  flex: 1;
  min-width: 0;
}

.rank__label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.rank__name {
  font-size: 12px;
  color: #e2e8f0;
}

.rank__count {
  font-size: 12px;
  color: #64748b;
}

.rank__track {
  height: 5px;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.8);
  overflow: hidden;
}

.rank__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;

  &--1 {
    background: linear-gradient(90deg, #ef4444, #f87171);
  }
  &--2 {
    background: linear-gradient(90deg, #f97316, #fb923c);
  }
  &--3 {
    background: linear-gradient(90deg, #eab308, #facc15);
  }
  &--rest {
    background: linear-gradient(90deg, #38bdf8, #22d3ee);
  }
}
</style>
