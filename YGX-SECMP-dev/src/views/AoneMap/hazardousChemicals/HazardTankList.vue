<template>
  <div class="hc-tanks">
    <div v-for="t in tanks" :key="t.id" class="hc-tank">
      <div class="hc-tank__head">
        <span class="hc-tank__name">{{ t.name }}</span>
        <span class="hc-tank__tag">{{ t.type }}</span>
      </div>
      <div class="hc-tank__grid">
        <div class="hc-tank__cell">
          <div class="hc-tank__l">介质</div>
          <div class="hc-tank__v">{{ t.media }}</div>
        </div>
        <div class="hc-tank__cell">
          <div class="hc-tank__l">温度</div>
          <div class="hc-tank__v hc-tank__v--orange">{{ t.temp }}℃</div>
        </div>
        <div class="hc-tank__cell">
          <div class="hc-tank__l">压力</div>
          <div class="hc-tank__v hc-tank__v--cyan">{{ t.pressure }}MPa</div>
        </div>
      </div>
      <div class="hc-tank__lvl">
        <div class="hc-tank__lvl-row">
          <span class="hc-tank__l">当前液位</span>
          <span>{{ t.level }}m / {{ t.maxLevel }}m</span>
        </div>
        <div class="hc-tank__track">
          <div
            class="hc-tank__fill"
            :class="t.level / t.maxLevel > 0.8 ? 'hc-tank__fill--danger' : ''"
            :style="{ width: `${(t.level / t.maxLevel) * 100}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TankData } from './types';

defineProps<{ tanks: TankData[] }>();
</script>

<style lang="less" scoped>
.hc-tanks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hc-tank {
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.hc-tank__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.hc-tank__name {
  font-size: 13px;
  font-weight: 700;
  color: #38bdf8;
}

.hc-tank__tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
}

.hc-tank__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 10px;
  text-align: center;
}

.hc-tank__l {
  font-size: 10px;
  color: #64748b;
}

.hc-tank__v {
  font-size: 12px;
  font-weight: 600;
  color: #e2e8f0;
  margin-top: 2px;

  &--orange {
    color: #fb923c;
  }
  &--cyan {
    color: #22d3ee;
  }
}

.hc-tank__lvl-row {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.hc-tank__track {
  height: 6px;
  border-radius: 999px;
  background: #1e293b;
  overflow: hidden;
}

.hc-tank__fill {
  height: 100%;
  border-radius: 999px;
  background: #38bdf8;
  transition: width 0.8s ease-out;

  &--danger {
    background: #ef4444;
  }
}
</style>
