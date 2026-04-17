<template>
  <aside class="it-left">
    <div class="it-left__grid">
      <div class="it-stat it-stat--cyan">
        <div class="it-stat__top">
          <DatabaseOutlined />
        </div>
        <div class="it-stat__val">{{ COUNTY_STATS.totalEnterprises }}</div>
        <div class="it-stat__lbl">监管企业总数</div>
      </div>
      <div class="it-stat it-stat--green">
        <div class="it-stat__top">
          <RadarChartOutlined />
        </div>
        <div class="it-stat__val">186</div>
        <div class="it-stat__lbl">实时在线设备</div>
      </div>
      <div class="it-stat it-stat--red">
        <div class="it-stat__top">
          <WarningOutlined />
          <span class="it-stat__trend">+12%</span>
        </div>
        <div class="it-stat__val">{{ COUNTY_STATS.riskStats.unhandled }}</div>
        <div class="it-stat__lbl">今日新增报警</div>
      </div>
      <div class="it-stat it-stat--blue">
        <div class="it-stat__top">
          <SafetyCertificateOutlined />
          <span class="it-stat__trend">-5%</span>
        </div>
        <div class="it-stat__val">{{ COUNTY_STATS.riskStats.handled }}</div>
        <div class="it-stat__lbl">已处置闭环</div>
      </div>
    </div>

    <div class="it-section">
      <h3 class="it-section__title"><span class="it-section__bar" />重点监管企业分布</h3>
      <IndustryTypePie :data="COUNTY_STATS.typeDistribution" :colors="PIE_COLORS" />
    </div>

    <div class="it-section">
      <h3 class="it-section__title"><span class="it-section__bar" />风险统计信息</h3>
      <div class="it-risk-list">
        <div v-for="row in riskRows" :key="row.label" class="it-risk">
          <div class="it-risk__head">
            <div class="it-risk__lbl">
              <span class="it-risk__dot" :class="`it-risk__dot--${row.color}`" />
              <span>{{ row.label }}</span>
            </div>
            <span class="it-risk__total">总数: {{ row.stats.total }}</span>
          </div>
          <div class="it-risk__bar">
            <div
              class="it-risk__seg"
              :class="`it-risk__seg--${row.color}`"
              :style="{ width: segPct(row.stats.unhandled, row.stats.total) }"
            />
            <div
              class="it-risk__seg it-risk__seg--muted"
              :style="{ width: segPct(row.stats.handled, row.stats.total) }"
            />
          </div>
          <div class="it-risk__foot">
            <span>未处置: {{ row.stats.unhandled }}</span>
            <span>已处置: {{ row.stats.handled }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import {
  DatabaseOutlined,
  RadarChartOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue';
import { computed } from 'vue';
import IndustryTypePie from './IndustryTypePie.vue';
import { COUNTY_STATS, PIE_COLORS } from './mockData';
import type { RiskLevel } from './types';

const riskRows = computed(() => {
  const b = COUNTY_STATS.riskStats.byLevel;
  return [
    { label: '红色风险', stats: b.red, color: 'red' as RiskLevel },
    { label: '橙色风险', stats: b.orange, color: 'orange' as RiskLevel },
    { label: '黄色风险', stats: b.yellow, color: 'yellow' as RiskLevel },
    { label: '蓝色风险', stats: b.blue, color: 'blue' as RiskLevel },
  ];
});

function segPct(part: number, total: number) {
  if (!total) return '0%';
  return `${(part / total) * 100}%`;
}
</script>

<style lang="less" scoped>
.it-left {
  width: min(320px, 28vw);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.05);

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 4px;
  }
}

.it-left__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.it-stat {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &--cyan {
    border-color: rgba(34, 211, 238, 0.2);
    background: rgba(34, 211, 238, 0.08);
    color: #22d3ee;
  }
  &--green {
    border-color: rgba(74, 222, 128, 0.2);
    background: rgba(74, 222, 128, 0.08);
    color: #4ade80;
  }
  &--red {
    border-color: rgba(248, 113, 113, 0.2);
    background: rgba(248, 113, 113, 0.08);
    color: #f87171;
  }
  &--blue {
    border-color: rgba(96, 165, 250, 0.2);
    background: rgba(96, 165, 250, 0.08);
    color: #60a5fa;
  }
}

.it-stat__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  opacity: 0.85;
}

.it-stat__trend {
  font-size: 10px;
  font-family: ui-monospace, monospace;
}

.it-stat__val {
  font-size: 20px;
  font-weight: 700;
  font-family: ui-monospace, monospace;
  color: #fff;
}

.it-stat__lbl {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.55;
  color: rgba(255, 255, 255, 0.85);
}

.it-section {
  padding: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.it-section__title {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.it-section__bar {
  width: 4px;
  height: 14px;
  border-radius: 2px;
  background: #22d3ee;
}

.it-risk-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.it-risk__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.it-risk__lbl {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.85);
}

.it-risk__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;

  &--red {
    background: #ef4444;
  }
  &--orange {
    background: #f97316;
  }
  &--yellow {
    background: #eab308;
  }
  &--blue {
    background: #3b82f6;
  }
}

.it-risk__total {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
}

.it-risk__bar {
  display: flex;
  height: 6px;
  width: 100%;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 6px;
  background: rgba(255, 255, 255, 0.05);
}

.it-risk__seg {
  height: 100%;

  &--red {
    background: #ef4444;
  }
  &--orange {
    background: #f97316;
  }
  &--yellow {
    background: #eab308;
  }
  &--blue {
    background: #3b82f6;
  }
  &--muted {
    background: rgba(255, 255, 255, 0.2);
  }
}

.it-risk__foot {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 10px;
  font-family: ui-monospace, monospace;
  color: rgba(255, 255, 255, 0.35);
}
</style>
