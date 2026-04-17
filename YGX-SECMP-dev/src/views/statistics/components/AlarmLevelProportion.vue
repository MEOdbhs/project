<template>
  <div class="alarm-level-proportion">
    <div class="card-header">
      <span class="card-title">预警等级占比</span>
      <div class="toggle-group">
        <span :class="['toggle-item', activeTab === '1' ? 'active' : '']" @click="changeTab('1')">
          今日
        </span>
        <span :class="['toggle-item', activeTab === '2' ? 'active' : '']" @click="changeTab('2')">
          近7日
        </span>
      </div>
    </div>
    <div class="card-content">
      <div class="chart-wrapper">
        <div class="chart-container" ref="chartRef"></div>
      </div>
      <div class="legend-list">
        <div class="legend-item" v-for="(item, index) in alarmData" :key="index">
          <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
          <div class="legend-info">
            <span class="legend-label">{{ item.label }}</span>
            <span class="legend-value">{{ item.percentage }}</span>
          </div>
          <div class="legend-count">{{ item.count }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts/core';
import type { EChartsType } from 'echarts/core';
import type { EChartsOption } from 'echarts';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, GraphicComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { warningLevelStatistics } from '../api';

echarts.use([PieChart, TooltipComponent, GraphicComponent, CanvasRenderer]);

interface AlarmData {
  label: string;
  color: string;
  percentage: number;
  count: number;
}

const activeTab = ref<'1' | '2'>('1');

const alarmData = ref<AlarmData[]>([
  {
    label: '蓝色预警',
    color: '#1890ff',
    percentage: 6,
    count: 10
  },
  {
    label: '黄色预警',
    color: '#faad14',
    percentage: 12,
    count: 23
  },
  {
    label: '橙色预警',
    color: '#ff7a00',
    percentage: 41,
    count: 72
  },
  {
    label: '红色预警',
    color: '#ff4d4f',
    percentage: 41,
    count: 71
  }
]);

const totalCount = computed(() => {
  return alarmData.value.reduce((sum, item) => sum + item.count, 0);
});

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: EChartsType | null = null;

const renderChart = () => {
  if (!chartRef.value) return;

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  }

  const chartData = alarmData.value.map(item => ({
    value: item.count,
    name: item.label,
    itemStyle: {
      color: item.color
    }
  }));

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '预警等级',
        type: 'pie',
        radius: ['65%', '90%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '35%',
        style: {
          text: String(totalCount.value),
          fill: '#ffffff',
          fontSize: 36,
          fontWeight: 600,
          textAlign: 'center',
          textVerticalAlign: 'middle'
        } as any
      },
      {
        type: 'text',
        left: 'center',
        top: '58%',
        style: {
          text: '预警总数',
          fill: '#87ceeb',
          fontSize: 14,
          textAlign: 'center',
          textVerticalAlign: 'middle'
        } as any
      }
    ]
  };

  chartInstance.setOption(option);
  chartInstance.resize();
};

const handleResize = () => {
  chartInstance?.resize();
};

const changeTab = (tab: '1' | '2') => {
  activeTab.value = tab;
  getWarningLevelStatistics();
};
const getWarningLevelStatistics = async () => {
  const res = await warningLevelStatistics({ type: activeTab.value });
  if (res) {
    const { redCount, redRatio, orangeCount, orangeRatio, yellowCount, yellowRatio, blueCount, blueRatio } = res;
    alarmData.value[0].count = blueCount;
    alarmData.value[0].percentage = blueRatio;
    alarmData.value[1].count = yellowCount;
    alarmData.value[1].percentage = yellowRatio;
    alarmData.value[2].count = orangeCount;
    alarmData.value[2].percentage = orangeRatio;
    alarmData.value[3].count = redCount;
    alarmData.value[3].percentage = redRatio;
    // totalCount.value = redCount + orangeCount + yellowCount + blueCount;
    renderChart();
  }
};

onMounted(() => {
  renderChart();
  window.addEventListener('resize', handleResize, { passive: true });
  getWarningLevelStatistics();
});

watch([totalCount, alarmData], () => {
  renderChart();
}, { deep: true });

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<style lang="less" scoped>
.alarm-level-proportion {
  background: rgba(11, 28, 54, 0.6);
  border: 1px solid rgba(64, 169, 255, 0.3);
  border-radius: 4px;
  padding: 16px;
  height: 278px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }

    .toggle-group {
      display: flex;
      gap: 8px;

      .toggle-item {
        padding: 4px 12px;
        font-size: 13px;
        color: #87ceeb;
        cursor: pointer;
        border-radius: 2px;
        transition: all 0.3s;

        &.active {
          color: #fff;
          background: rgba(64, 169, 255, 0.3);
        }

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .card-content {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 200px;

    .chart-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .chart-container {
        width: 200px;
        height: 200px;
      }
    }

    .legend-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 0;

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .legend-info {
          flex: 1;
          display: flex;
          justify-content: space-between;

          .legend-label {
            font-size: 14px;
            color: #fff;
          }

          .legend-value {
            font-size: 14px;
            color: #87ceeb;
          }
        }

        .legend-count {
          font-size: 14px;
          color: #40a9ff;
          font-weight: 500;
          min-width: 40px;
          text-align: right;
        }
      }
    }
  }
}
</style>
