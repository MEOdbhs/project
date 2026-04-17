<template>
  <aside class="mi-left">
    <div class="mi-stat-grid">
      <div
        v-for="card in statCards"
        :key="card.title"
        class="mi-stat-card"
        :class="`mi-stat-card--${card.color}`"
      >
        <div class="mi-stat-card__head">
          <span class="mi-stat-card__title">{{ card.title }}</span>
          <div class="mi-stat-card__icon" aria-hidden="true">
            <component :is="card.icon" />
          </div>
        </div>
        <div class="mi-stat-card__value-row">
          <span class="mi-stat-card__value">{{ card.value }}</span>
          <span v-if="card.unit" class="mi-stat-card__unit">{{ card.unit }}</span>
        </div>
        <div v-if="card.trend" class="mi-stat-card__trend" :class="card.trend.isUp ? 'is-up' : 'is-down'">
          <span>{{ card.trend.isUp ? '↑' : '↓' }}</span>
          <span>{{ card.trend.value }}</span>
          <span class="mi-stat-card__trend-note">较昨日</span>
        </div>
        <div class="mi-stat-card__shine" />
      </div>
    </div>

    <div class="mi-dash-card mi-dash-card--grow">
      <div class="mi-dash-card__header">
        <div class="mi-dash-card__title">
          <WarningOutlined class="mi-dash-card__title-icon" />
          <span>实时预警信息</span>
        </div>
       
      </div>
      <div class="mi-alerts">
        <div
          v-for="(alert, i) in liveAlerts"
          :key="`${alert.location}-${i}`"
          class="mi-alert"
          :style="{ animationDelay: `${i * 0.1}s` }"
        >
          <div class="mi-alert__row">
            <div class="mi-alert__left">
              <span class="mi-alert__level" :class="levelClass(alert.level)">{{ alert.level }}色</span>
              <span class="mi-alert__type">{{ alert.type }}</span>
            </div>
            <span class="mi-alert__status">{{ alert.status }}</span>
          </div>
          <div class="mi-alert__loc">
            <span class="mi-alert__dot" />
            <span>{{ alert.location }}</span>
          </div>
          <div class="mi-alert__gas">
            <span class="mi-alert__gas-label">CH₄</span>
            <span class="mi-alert__gas-val">{{ alert.gasCh4 }}</span>
            <span class="mi-alert__gas-sep">·</span>
            <span class="mi-alert__gas-safe" :class="gasSafetyClass(alert.gasSafety)">{{ alert.gasSafety }}</span>
          </div>
          <div class="mi-alert__time">{{ alert.time }}</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import {
  AlertOutlined,
  CheckCircleOutlined,
  ClusterOutlined,
  LineChartOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue';
import { countyData, liveAlerts } from './mockData';

const statCards = computed(() => [
  {
    title: '矿山总数',
    value: countyData.totalMines,
    unit: '座',
    icon: ClusterOutlined,
    color: 'cyan' as const,
  },
  {
    title: '风险隐患',
    value: countyData.unprocessedRisks + countyData.unrectifiedHazards,
    unit: '处',
    icon: AlertOutlined,
    color: 'red' as const,
    trend: { value: '12%', isUp: true },
  },
  {
    title: '监测设备',
    value: 186,
    unit: '台',
    icon: LineChartOutlined,
    color: 'blue' as const,
  },
  {
    title: '已处置',
    value: countyData.processedRisks + countyData.rectifiedHazards,
    unit: '起',
    icon: CheckCircleOutlined,
    color: 'green' as const,
    trend: { value: '10%', isUp: false },
  },
]);

function levelClass(level: string) {
  if (level === '红') return 'is-red';
  if (level === '橙') return 'is-orange';
  return 'is-yellow';
}

function gasSafetyClass(s: string) {
  if (s === '预警') return 'is-warn';
  if (s === '关注') return 'is-watch';
  return 'is-ok';
}
</script>

<style scoped lang="less">
@card-bg: rgba(13, 25, 48, 0.7);
@card-border: rgba(30, 58, 138, 0.3);
@accent: #00f2ff;

.mi-left {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  min-height: 0;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

.mi-stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.mi-stat-card {
  position: relative;
  overflow: hidden;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 4px;
  border: 1px solid @card-border;
  background: @card-bg;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  transition: border-color 0.2s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);

    .mi-stat-card__shine {
      width: 100%;
    }
  }
}

.mi-stat-card__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.mi-stat-card__title {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mi-stat-card__icon {
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.mi-stat-card--cyan .mi-stat-card__icon {
  color: @accent;
  border: 1px solid rgba(0, 242, 255, 0.2);
  background: rgba(0, 242, 255, 0.05);
}
.mi-stat-card--cyan {
  background: rgba(0, 242, 255, 0.05);
}
.mi-stat-card--cyan .mi-stat-card__value {
  color: @accent;
}

.mi-stat-card--red .mi-stat-card__icon {
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.05);
}
.mi-stat-card--red {
  background: rgba(239, 68, 68, 0.05);
}
.mi-stat-card--red .mi-stat-card__value {
  color: #ef4444;
}

.mi-stat-card--blue .mi-stat-card__icon {
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(59, 130, 246, 0.05);
}
.mi-stat-card--blue {
  background: rgba(59, 130, 246, 0.05);
}
.mi-stat-card--blue .mi-stat-card__value {
  color: #3b82f6;
}

.mi-stat-card--green .mi-stat-card__icon {
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
  background: rgba(16, 185, 129, 0.05);
}
.mi-stat-card--green {
  background: rgba(16, 185, 129, 0.05);
}
.mi-stat-card--green .mi-stat-card__value {
  color: #10b981;
}

.mi-stat-card__value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.mi-stat-card__value {
  font-size: 24px;
  font-weight: 700;
  font-family: ui-monospace, 'JetBrains Mono', SFMono-Regular, monospace;
  letter-spacing: -0.02em;
}

.mi-stat-card__unit {
  font-size: 12px;
  color: #64748b;
}

.mi-stat-card__trend {
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 4px;

  &.is-up {
    color: #34d399;
  }
  &.is-down {
    color: #f87171;
  }
}

.mi-stat-card__trend-note {
  color: #64748b;
  margin-left: 4px;
}

.mi-stat-card__shine {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  transition: width 0.5s ease;
}

.mi-stat-card--cyan .mi-stat-card__shine {
  background: @accent;
}
.mi-stat-card--red .mi-stat-card__shine {
  background: #ef4444;
}
.mi-stat-card--blue .mi-stat-card__shine {
  background: #3b82f6;
}
.mi-stat-card--green .mi-stat-card__shine {
  background: #10b981;
}

.mi-dash-card {
  border-radius: 4px;
  border: 1px solid @card-border;
  background: @card-bg;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.mi-dash-card--grow {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.mi-dash-card__header {
  flex-shrink: 0;
  border-bottom: 1px solid @card-border;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mi-dash-card__title {
  font-size: 14px;
  font-weight: 600;
  color: @accent;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mi-dash-card__title-icon {
  font-size: 16px;
}

.mi-dash-card__subtitle {
  font-size: 10px;
  color: #64748b;
  font-family: ui-monospace, 'JetBrains Mono', monospace;
}

.mi-alerts {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mi-alert {
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s;
  animation: mi-alert-in 0.35s ease forwards;
  opacity: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:hover .mi-alert__status {
    text-decoration: underline;
  }
}

@keyframes mi-alert-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.mi-alert__row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.mi-alert__left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mi-alert__level {
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 700;

  &.is-red {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }
  &.is-orange {
    background: rgba(249, 115, 22, 0.2);
    color: #f97316;
    border: 1px solid rgba(249, 115, 22, 0.3);
  }
  &.is-yellow {
    background: rgba(234, 179, 8, 0.2);
    color: #eab308;
    border: 1px solid rgba(234, 179, 8, 0.3);
  }
}

.mi-alert__type {
  font-size: 12px;
  font-weight: 500;
  color: #e2e8f0;
}

.mi-alert__status {
  font-size: 10px;
  color: #60a5fa;
}

.mi-alert__loc {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.mi-alert__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #64748b;
  flex-shrink: 0;
}

.mi-alert__gas {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 10px;
  margin-bottom: 4px;
  font-family: ui-monospace, 'JetBrains Mono', monospace;
}

.mi-alert__gas-label {
  color: #64748b;
  letter-spacing: 0.02em;
}

.mi-alert__gas-val {
  color: #a5f3fc;
}

.mi-alert__gas-sep {
  color: #475569;
}

.mi-alert__gas-safe {
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 2px;

  &.is-ok {
    color: #34d399;
    background: rgba(52, 211, 153, 0.12);
  }
  &.is-watch {
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.12);
  }
  &.is-warn {
    color: #f87171;
    background: rgba(248, 113, 113, 0.15);
  }
}

.mi-alert__time {
  font-size: 10px;
  color: #64748b;
  font-family: ui-monospace, 'JetBrains Mono', monospace;
}
</style>
