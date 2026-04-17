<template>
  <div class="er-col">
    <div class="glass er-panel">
      <div class="er-panel-head">
        <span class="er-panel-bar" />
        <span class="er-panel-title">资源总览统计</span>
      </div>
      <div class="er-overview">
        <div class="er-stat">
          <div class="er-stat-label">救援队伍</div>
          <div class="er-stat-val er-stat-val--red">{{ stats.teams }}</div>
        </div>
        <div class="er-stat">
          <div class="er-stat-label">物资仓库</div>
          <div class="er-stat-val er-stat-val--yellow">{{ stats.materials }}</div>
        </div>
        <div class="er-stat">
          <div class="er-stat-label">医疗站点</div>
          <div class="er-stat-val er-stat-val--green">{{ stats.medicals }}</div>
        </div>
        <div class="er-stat">
          <div class="er-stat-label">应急通道</div>
          <div class="er-stat-val er-stat-val--purple">{{ stats.channels }}</div>
        </div>
      </div>
    </div>

    <div class="glass er-panel er-panel--grow">
      <div class="er-panel-head">
        <span class="er-panel-bar er-panel-bar--red" />
        <span class="er-panel-title">救援队伍管理</span>
      </div>
      <div ref="chartRef" class="er-chart" />
      <div class="er-team-split">
        <h3 class="er-subtitle">队伍类型分布</h3>
        <div class="er-type-row">
          <span class="er-type-name">专业救援队</span>
          <div class="er-type-meta">
            <span class="er-type-num er-type-num--red">7支</span>
            <div class="er-bar">
              <i class="er-bar-fill er-bar-fill--pro" style="width: 58%" />
            </div>
          </div>
        </div>
        <div class="er-type-row">
          <span class="er-type-name">志愿救援队</span>
          <div class="er-type-meta">
            <span class="er-type-num er-type-num--orange">5支</span>
            <div class="er-bar">
              <i class="er-bar-fill er-bar-fill--vol" style="width: 42%" />
            </div>
          </div>
        </div>
      </div>
      <div class="er-team-scroll custom-scrollbar">
        <h3 class="er-subtitle">队伍资质与训练</h3>
        <div
          v-for="team in teams"
          :key="team.name"
          class="er-team-item list-item"
          :class="borderClass(team.level)"
          @click="emit('selectTeam', team.name, team.town)"
        >
          <div class="er-team-top">
            <div class="er-team-info">
              <div class="er-team-name">{{ team.name }}</div>
              <div class="er-team-meta">{{ team.level }} | {{ team.subType }}</div>
            </div>
            <span class="er-badge" :class="statusClass(team.status)">{{ team.status }}</span>
          </div>
          <div class="er-team-foot">
            {{ team.personnel ?? 0 }}人 | 近期演练{{ teamDrillCounts[team.name] ?? 1 }}次
          </div>
        </div>
      </div>
    </div>

    <div class="glass er-panel">
      <div class="er-panel-head">
        <span class="er-panel-bar er-panel-bar--amber" />
        <span class="er-panel-title">物资储备管理</span>
        <span class="er-panel-extra">临期预警</span>
      </div>
      <div class="er-mat-grid">
        <div class="er-mat-cell er-mat-cell--amber">
          <div class="er-mat-label">抢险装备</div>
          <div class="er-mat-val">256件</div>
        </div>
        <div class="er-mat-cell er-mat-cell--blue">
          <div class="er-mat-label">防护用品</div>
          <div class="er-mat-val">1,520套</div>
        </div>
        <div class="er-mat-cell er-mat-cell--green">
          <div class="er-mat-label">生活物资</div>
          <div class="er-mat-val">3,200件</div>
        </div>
      </div>
      <div class="er-mat-list">
        <div class="list-item er-mat-row border-l-yellow">
          <div>
            <div class="er-mat-row-title">消防灭火器</div>
            <div class="er-mat-row-sub">有效期：2024-06-15</div>
          </div>
          <span class="er-tag er-tag--yellow">临期</span>
        </div>
        <div class="list-item er-mat-row border-l-red">
          <div>
            <div class="er-mat-row-title">急救药品包</div>
            <div class="er-mat-row-sub">库存：15件 | 短缺</div>
          </div>
          <span class="er-tag er-tag--red">短缺</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { resourceData, teamDrillCounts } from './mockData';

defineProps<{
  stats: { teams: number; materials: number; medicals: number; channels: number };
}>();

const emit = defineEmits<{
  selectTeam: [name: string, town: string];
}>();

const teams = computed(() => resourceData.filter((r) => r.type === '救援队伍'));

const chartRef = ref<HTMLDivElement | null>(null);
let chart: echarts.ECharts | null = null;

function borderClass(level?: string) {
  if (level === '一级资质') return 'border-l-red';
  if (level === '二级资质') return 'border-l-orange';
  if (level === '三级资质') return 'border-l-yellow';
  return 'border-l-blue';
}

function statusClass(s: string) {
  if (s === '可用') return 'er-badge--ok';
  if (s === '占用') return 'er-badge--busy';
  return 'er-badge--off';
}

function initChart() {
  const el = chartRef.value;
  if (!el) return;
  chart = echarts.init(el);
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15,23,42,0.95)',
      borderColor: 'rgba(64,196,255,0.2)',
      textStyle: { color: '#e2e8f0' },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['专业队伍', '志愿队伍'],
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.08)' } },
      axisLine: { show: false },
    },
    series: [
      {
        data: [
          {
            value: 7,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ef4444' },
                { offset: 1, color: '#b91c1c' },
              ]),
            },
          },
          {
            value: 5,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#f59e0b' },
                { offset: 1, color: '#d97706' },
              ]),
            },
          },
        ],
        type: 'bar',
        barWidth: '40%',
        itemStyle: { borderRadius: [6, 6, 0, 0] },
      },
    ],
  });
}

function onResize() {
  chart?.resize();
}

onMounted(() => {
  initChart();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  chart?.dispose();
  chart = null;
});
</script>

<style scoped lang="less">
@glass-bg: linear-gradient(135deg, rgba(13, 31, 60, 0.8) 0%, rgba(10, 22, 40, 0.9) 100%);
@border: rgba(64, 196, 255, 0.15);

.er-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.glass {
  background: @glass-bg;
  border: 1px solid @border;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.er-panel {
  padding: 14px;
}

.er-col > .glass:first-child {
  flex-shrink: 0;
}

.er-panel--grow {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.er-col > .glass:last-child {
  flex: 0 1 auto;
  min-height: 0;
  max-height: min(260px, 34vh);
  overflow-x: hidden;
  overflow-y: auto;
}

.er-panel-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(64, 196, 255, 0.1);
}

.er-panel-bar {
  width: 4px;
  height: 16px;
  border-radius: 2px;
  background: linear-gradient(180deg, #3b82f6 0%, #06b6d4 100%);

  &--red {
    background: linear-gradient(180deg, #ef4444 0%, #f97316 100%);
  }

  &--amber {
    background: linear-gradient(180deg, #f59e0b 0%, #eab308 100%);
  }
}

.er-panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #60a5fa;
  letter-spacing: 1px;
}

.er-panel-extra {
  margin-left: auto;
  font-size: 11px;
  color: #64748b;
}

.er-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.er-stat {
  text-align: center;
  padding: 10px 6px;
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.6) 0%, rgba(20, 40, 70, 0.8) 100%);
  border: 1px solid rgba(64, 196, 255, 0.1);
  border-radius: 12px;
  transition:
    transform 0.2s,
    border-color 0.2s;

  &:hover {
    border-color: rgba(64, 196, 255, 0.3);
    transform: translateY(-2px);
  }
}

.er-stat-label {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.er-stat-val {
  font-size: 20px;
  font-weight: 700;

  &--red {
    color: #f87171;
  }
  &--yellow {
    color: #fbbf24;
  }
  &--green {
    color: #4ade80;
  }
  &--purple {
    color: #c084fc;
  }
}

.er-chart {
  width: 100%;
  height: 120px;
  flex-shrink: 0;
}

.er-team-split {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.er-subtitle {
  font-size: 11px;
  color: #94a3b8;
  margin: 0 0 8px;
}

.er-type-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 6px;
}

.er-type-name {
  color: #cbd5e1;
}

.er-type-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.er-type-num {
  font-size: 11px;

  &--red {
    color: #f87171;
  }
  &--orange {
    color: #fb923c;
  }
}

.er-bar {
  width: 80px;
  height: 6px;
  background: #1e293b;
  border-radius: 999px;
  overflow: hidden;
}

.er-bar-fill {
  display: block;
  height: 100%;
  border-radius: 999px;

  &--pro {
    background: linear-gradient(90deg, #ef4444, #f97316);
  }

  &--vol {
    background: linear-gradient(90deg, #f97316, #eab308);
  }
}

.er-team-scroll {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.list-item {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
  border-left: 3px solid;
  transition: background 0.2s;
  cursor: pointer;

  &:hover {
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.12) 0%, transparent 100%);
  }
}

.border-l-red {
  border-left-color: #ef4444;
}
.border-l-orange {
  border-left-color: #f97316;
}
.border-l-yellow {
  border-left-color: #eab308;
}
.border-l-blue {
  border-left-color: #3b82f6;
}

.er-team-item {
  padding: 8px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 8px;
}

.er-team-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.er-team-name {
  font-size: 11px;
  color: #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
}

.er-team-meta {
  font-size: 10px;
  color: #64748b;
  margin-top: 2px;
}

.er-badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 500;
  flex-shrink: 0;

  &--ok {
    background: rgba(16, 185, 129, 0.9);
    color: #fff;
  }
  &--busy {
    background: rgba(245, 158, 11, 0.9);
    color: #fff;
  }
  &--off {
    background: rgba(107, 114, 128, 0.9);
    color: #fff;
  }
}

.er-team-foot {
  margin-top: 6px;
  font-size: 11px;
  color: #94a3b8;
}

.er-mat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}

.er-mat-cell {
  text-align: center;
  padding: 8px;
  border-radius: 8px;

  &--amber {
    background: rgba(113, 63, 18, 0.3);
  }
  &--blue {
    background: rgba(30, 58, 138, 0.3);
  }
  &--green {
    background: rgba(6, 78, 59, 0.3);
  }
}

.er-mat-label {
  font-size: 11px;
  color: #94a3b8;
}

.er-mat-val {
  font-size: 16px;
  font-weight: 700;
  margin-top: 2px;
}

.er-mat-cell--amber .er-mat-val {
  color: #fbbf24;
}
.er-mat-cell--blue .er-mat-val {
  color: #60a5fa;
}
.er-mat-cell--green .er-mat-val {
  color: #4ade80;
}

.er-mat-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.er-mat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 0 8px 8px 0;
}

.er-mat-row-title {
  font-size: 13px;
  color: #e2e8f0;
}

.er-mat-row-sub {
  font-size: 11px;
  color: #64748b;
}

.er-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  white-space: nowrap;

  &--yellow {
    background: rgba(234, 179, 8, 0.2);
    color: #fbbf24;
  }
  &--red {
    background: rgba(239, 68, 68, 0.2);
    color: #f87171;
  }
}

.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #3b82f6 0%, #06b6d4 100%);
    border-radius: 2px;
  }
}
</style>
