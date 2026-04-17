<template>
  <aside class="es-left">
    

    <div class="es-stat-grid">
      <div class="es-stat es-stat--red">
        <div class="es-stat-main">
          <p class="es-stat-title">今日预警</p>
          <div class="es-stat-val">
            <span>8</span><small>条</small>
          </div>
          <p class="es-stat-trend up">↑ 12% <span class="es-muted">较昨日</span></p>
        </div>
        <div class="es-stat-ico">
          <WarningOutlined />
        </div>
      </div>
      <div class="es-stat es-stat--amber">
        <div class="es-stat-main">
          <p class="es-stat-title">隐患点</p>
          <div class="es-stat-val">
            <span>131</span><small>处</small>
          </div>
        </div>
        <div class="es-stat-ico">
          <EnvironmentOutlined />
        </div>
      </div>
      <div class="es-stat es-stat--cyan">
        <div class="es-stat-main">
          <p class="es-stat-title">监测设备</p>
          <div class="es-stat-val">
            <span>186</span><small>台</small>
          </div>
        </div>
        <div class="es-stat-ico">
          <AppstoreOutlined />
        </div>
      </div>
      <div class="es-stat es-stat--emerald">
        <div class="es-stat-main">
          <p class="es-stat-title">已处置</p>
          <div class="es-stat-val">
            <span>5</span><small>起</small>
          </div>
          <p class="es-stat-trend down">↓ 10% <span class="es-muted">较昨日</span></p>
        </div>
        <div class="es-stat-ico">
          <SafetyCertificateOutlined />
        </div>
      </div>
    </div>

    <div class="es-card">
      <div class="es-sec-head">
        <ThunderboltOutlined class="es-sec-ico" />
        <h3>实时预警信息</h3>
      </div>
      <div class="es-alert-scroll custom-scroll">
        <div v-for="a in realtimeAlerts" :key="a.id" class="es-alert-item">
          <div class="es-alert-top">
            <div class="es-alert-left">
              <WarningOutlined :class="a.level === '红色' ? 'text-rose' : 'text-amber'" />
              <span class="es-badge" :class="a.level === '红色' ? 'es-badge--red' : 'es-badge--amber'">{{ a.level
                }}</span>
              <span class="es-alert-type">{{ a.type }}</span>
            </div>
            <span class="es-alert-status" :class="a.status === '待处理' ? 'st-pend' : 'st-do'">{{ a.status }}</span>
          </div>
          <div class="es-alert-loc">
            <EnvironmentOutlined class="es-pin" />{{ a.location }}
          </div>
          <div class="es-alert-time">
            <LineChartOutlined class="es-pin" />{{ a.time }}
          </div>
        </div>
      </div>
    </div>

    <div class="es-monitor">
      <div class="es-sec-head">
        <AppstoreOutlined class="es-sec-ico" />
        <h3>监测系统状态</h3>
      </div>
      <div class="es-monitor-grid">
        <div class="es-mini">
          <div class="es-mini-top">
            <span class="es-mini-ico">
              <LineChartOutlined />
            </span>
            <span class="es-dot" />
          </div>
          <div class="es-mini-num">2,847</div>
          <div class="es-mini-label">监测站点</div>
        </div>
        <div class="es-mini">
          <div class="es-mini-top">
            <span class="es-mini-ico es-mini-ico--em">
              <ThunderboltOutlined />
            </span>
            <span class="es-dot" />
          </div>
          <div class="es-mini-num">12,568</div>
          <div class="es-mini-label">传感器数</div>
        </div>
      </div>
    </div>

    <div class="es-trend">
      <div class="es-trend-head">
        <div class="es-sec-head es-sec-head--flat">
          <LineChartOutlined class="es-sec-ico" />
          <h3>灾害发生趋势</h3>
        </div>
        <div class="es-legend-mini">
          <span><i class="dot dot-b" />滑坡</span>
          <span><i class="dot dot-a" />泥石流</span>
          <span><i class="dot dot-r" />崩塌</span>
        </div>
      </div>
      <div ref="trendRef" class="es-chart" />
    </div>
  </aside>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import {
  AppstoreOutlined,
  CloudOutlined,
  EnvironmentOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { disasterTrendData, realtimeAlerts } from './mockData';

const now = ref(new Date());
const trendRef = ref<HTMLDivElement | null>(null);
let chart: echarts.ECharts | null = null;

const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
let timer: number;

const dateStr = computed(() => {
  const d = now.value;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}年${p(d.getMonth() + 1)}月${p(d.getDate())}日 ${weekdays[d.getDay()]}`;
});

const timeStr = computed(() => {
  const d = now.value;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
});

function buildTrendOption(): echarts.EChartsOption {
  const x = disasterTrendData.map((r) => r.name);
  const s1 = disasterTrendData.map((r) => r['滑坡']);
  const s2 = disasterTrendData.map((r) => r['泥石流']);
  const s3 = disasterTrendData.map((r) => r['崩塌']);
  return {
    color: ['#3b82f6', '#f59e0b', '#ef4444'],
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0f172a',
      borderColor: 'rgba(59, 130, 246, 0.2)',
      textStyle: { fontSize: 11 },
    },
    grid: { left: 4, right: 8, top: 28, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: x,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 9, color: '#64748b' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 9, color: '#64748b' },
    },
    series: [
      {
        name: '滑坡',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#3b82f6' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59,130,246,0.45)' },
            { offset: 1, color: 'rgba(59,130,246,0)' },
          ]),
        },
        data: s1,
      },
      {
        name: '泥石流',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#f59e0b' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245,158,11,0.45)' },
            { offset: 1, color: 'rgba(245,158,11,0)' },
          ]),
        },
        data: s2,
      },
      {
        name: '崩塌',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#ef4444' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(239,68,68,0.45)' },
            { offset: 1, color: 'rgba(239,68,68,0)' },
          ]),
        },
        data: s3,
      },
    ],
  };
}

function onResize() {
  chart?.resize();
}

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
  if (trendRef.value) {
    chart = echarts.init(trendRef.value);
    chart.setOption(buildTrendOption());
    window.addEventListener('resize', onResize);
  }
});

onBeforeUnmount(() => {
  clearInterval(timer);
  window.removeEventListener('resize', onResize);
  chart?.dispose();
  chart = null;
});
</script>

<style scoped lang="less">
.es-left {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
  overflow: hidden;
  padding-right: 4px;
}

.es-time {
  flex-shrink: 0;
}

.es-time-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 4px;
}

.es-date {
  font-size: 12px;
  color: #94a3b8;
}

.es-clock {
  font-size: 22px;
  font-weight: 700;
  font-family: ui-monospace, monospace;
  color: #fff;
  letter-spacing: -0.02em;
}

.es-weather {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 11px;
  color: #94a3b8;
}

.es-wicon {
  margin-right: 2px;
}

.es-wi {
  font-size: 12px;
  margin-right: 2px;
}

.es-stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  flex-shrink: 0;
}

.es-stat {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid;
  background: rgba(15, 23, 42, 0.6);

  &--red {
    border-color: rgba(244, 63, 94, 0.35);
    background: rgba(136, 19, 55, 0.15);
  }

  &--amber {
    border-color: rgba(245, 158, 11, 0.35);
    background: rgba(120, 53, 15, 0.15);
  }

  &--cyan {
    border-color: rgba(6, 182, 212, 0.35);
    background: rgba(14, 116, 144, 0.15);
  }

  &--emerald {
    border-color: rgba(16, 185, 129, 0.35);
    background: rgba(6, 78, 59, 0.15);
  }
}

.es-stat-title {
  font-size: 11px;
  color: #94a3b8;
  margin: 0 0 4px;
}

.es-stat-val {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 22px;
  font-weight: 700;
  font-family: ui-monospace, monospace;
  color: #fff;

  small {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 400;
  }
}

.es-stat-trend {
  font-size: 10px;
  margin: 6px 0 0;
  display: flex;
  align-items: center;
  gap: 4px;

  &.up {
    color: #f43f5e;
  }

  &.down {
    color: #34d399;
  }
}

.es-muted {
  color: #64748b;
}

.es-stat-ico {
  padding: 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 18px;
  color: #22d3ee;
}

.es-stat--red .es-stat-ico {
  color: #fb7185;
}

.es-stat--amber .es-stat-ico {
  color: #fbbf24;
}

.es-stat--cyan .es-stat-ico {
  color: #22d3ee;
}

.es-stat--emerald .es-stat-ico {
  color: #34d399;
}

.es-card {
  border: 1px solid rgba(51, 65, 85, 0.8);
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1 1 0;
}

.es-sec-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 12px 8px;

  h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: 0.05em;
  }

  &--flat {
    padding: 0;
  }
}

.es-sec-ico {
  font-size: 15px;
  color: #22d3ee;
}

.es-alert-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 12px 12px;
}

.es-alert-item {
  padding: 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(51, 65, 85, 0.9);
  margin-bottom: 10px;
  transition: border-color 0.2s;

  &:hover {
    border-color: rgba(59, 130, 246, 0.35);
  }
}

.es-alert-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.es-alert-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-rose {
  color: #f43f5e;
}

.text-amber {
  color: #f59e0b;
}

.es-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  color: #fff;

  &--red {
    background: #e11d48;
  }

  &--amber {
    background: #d97706;
  }
}

.es-alert-type {
  font-size: 12px;
  font-weight: 700;
  color: #cbd5e1;
}

.es-alert-status {
  font-size: 11px;
  font-weight: 600;

  &.st-pend {
    color: #fb7185;
  }

  &.st-do {
    color: #fbbf24;
  }
}

.es-alert-loc,
.es-alert-time {
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.es-pin {
  font-size: 12px;
  color: #475569;
}

.es-monitor {
  flex-shrink: 0;
}

.es-monitor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.es-mini {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(51, 65, 85, 0.9);
  background: rgba(15, 23, 42, 0.45);
}

.es-mini-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.es-mini-ico {
  padding: 4px;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
  font-size: 15px;

  &--em {
    background: rgba(16, 185, 129, 0.12);
    color: #34d399;
  }
}

.es-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.es-mini-num {
  font-size: 20px;
  font-weight: 700;
  font-family: ui-monospace, monospace;
  color: #fff;
}

.es-mini-label {
  font-size: 10px;
  color: #64748b;
  margin-top: 2px;
}

.es-trend {
  flex-shrink: 0;
}

.es-trend-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.es-legend-mini {
  display: flex;
  gap: 10px;
  font-size: 10px;
  color: #94a3b8;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;

  &.dot-b {
    background: #3b82f6;
  }

  &.dot-a {
    background: #f59e0b;
  }

  &.dot-r {
    background: #ef4444;
  }
}

.es-chart {
  height: 192px;
  border-radius: 8px;
  border: 1px solid rgba(51, 65, 85, 0.9);
  background: rgba(15, 23, 42, 0.45);
  padding: 4px;
}

.custom-scroll {
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.35);
    border-radius: 2px;
  }
}
</style>
