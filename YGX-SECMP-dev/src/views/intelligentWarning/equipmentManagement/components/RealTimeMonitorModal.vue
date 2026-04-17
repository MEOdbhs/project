<template>
  <BasicModal
    :title="'实时监控'"
    :width="1200"
    :destroyOnClose="true"
    @register="registerModal"
    @visible-change="handleVisibleChange"
  >
    <div class="monitor-container">
      <!-- 头部：设备信息 + 操作栏 -->
      <div class="monitor-header">
        <div class="header-left">
          <span class="device-info">设备：{{ deviceInfo.monitorName }} ({{ deviceInfo.monitorCode }})</span>
        </div>
        <div class="header-right">
          <a-select v-model:value="timeRange" style="width: 120px" @change="handleTimeRangeChange">
            <a-select-option value="24h">过去24小时</a-select-option>
            <a-select-option value="7d">过去7天</a-select-option>
            <a-select-option value="30d">过去30天</a-select-option>
          </a-select>
          <a-button @click="refreshData">
            <template #icon><ReloadOutlined /></template>
            刷新
          </a-button>
        </div>
      </div>

      <!-- 上半部分：图表 + 评判标准 -->
      <div class="chart-wrapper">
        <div class="chart-container">
          <div ref="chartRef" style="height: 350px; width: 100%"></div>
        </div>
        <div class="standards-container">
          <div v-for="item in standardList" :key="item.paramTypeValue" class="standard-item">
            <div class="standard-label">{{ item.paramTypeName }}</div>
            <div class="standard-value">正常 {{ item.normalThreshold }}</div>
            <div class="standard-value abnormal">异常 {{ item.abnormalThreshold }}</div>
          </div>
        </div>
      </div>

      <!-- 告警表格 -->
      <div class="alert-section">
        <div class="section-title">运维告警</div>
        <a-table
          :columns="alertColumns"
          :dataSource="alertData"
          :pagination="false"
          size="small"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'paramName'">
              {{ record.paramName }}
            </template>
            <template v-else-if="column.dataIndex === 'currentValue'">
              {{ record.currentValue }}
            </template>
            <template v-else-if="column.dataIndex === 'alertTime'">
              {{ record.alertTime }}
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { ReloadOutlined } from '@ant-design/icons-vue';
import * as echarts from 'echarts';
import { getMonitorMation } from '../line.api';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

type TimeRange = '24h' | '7d' | '30d';

const [registerModal, { closeModal }] = useModalInner((data) => {
  if (data?.device) {
    deviceInfo.value = data.device;
    timeRange.value = '24h';
    loadMonitorData();
  }
});

const deviceInfo = ref<any>({});
const chartRef = ref<HTMLElement>();
let chartInstance: echarts.ECharts | null = null;
const timeRange = ref<TimeRange>('24h');

// 告警表格列定义
const alertColumns = [
  { title: '序号', dataIndex: 'index', width: 60 },
  { title: '异常参数', dataIndex: 'paramName', width: 120 },
  { title: '当前值', dataIndex: 'currentValue', width: 100 },
  { title: '报警时间', dataIndex: 'alertTime', width: 160 },
];

const alertData = ref<any[]>([]);
const standardList = ref<any[]>([]); // 动态标准卡片数据

// 预定义图表颜色
const colorPalette = ['#3b7cff', '#52c41a', '#faad14', '#f56c6c', '#926de2', '#26c6da'];

// 根据时间范围计算开始/结束时间
const getTimeRangeParams = (range: TimeRange) => {
  const end = dayjs();
  let start: dayjs.Dayjs;
  switch (range) {
    case '24h':
      start = end.subtract(24, 'hour');
      break;
    case '7d':
      start = end.subtract(7, 'day');
      break;
    case '30d':
      start = end.subtract(30, 'day');
      break;
    default:
      start = end.subtract(24, 'hour');
  }
  return {
    startRealtimeDate: start.format('YYYY-MM-DD HH:mm:ss'),
    endRealtimeDate: end.format('YYYY-MM-DD HH:mm:ss'),
  };
};

// 生成阈值文本（正常和异常）
const generateThresholdText = (item: any) => {
  const { alarmConditionId, alarmConditionName, alarmThreshold, alarmUnitName } = item;
  const unit = alarmUnitName || '';
  let normalText = '';
  let abnormalText = '';

  if (alarmConditionId === 'condition_greater') {
    // 异常：大于阈值
    abnormalText = `> ${alarmThreshold}${unit}`;
    normalText = `≤ ${alarmThreshold}${unit}`;
  } else if (alarmConditionId === 'condition_less') {
    // 异常：小于阈值
    abnormalText = `< ${alarmThreshold}${unit}`;
    normalText = `≥ ${alarmThreshold}${unit}`;
  } else {
    // 兜底
    abnormalText = `${alarmConditionName} ${alarmThreshold}${unit}`;
    normalText = `正常范围`;
  }
  return { normalText, abnormalText };
};

// 加载监控数据
const loadMonitorData = async () => {
  try {
    const { startRealtimeDate, endRealtimeDate } = getTimeRangeParams(timeRange.value);
    const params = {
      deviceId: deviceInfo.value.id,
      startRealtimeDate,
      endRealtimeDate,
    };
    const res = await getMonitorMation(params);
    console.log('接口返回数据：', res);

    const mationList = res.mation || [];
    const warningList = res.warning || [];
    const detailList = res.alarmConfig?.detailList || [];

    // 处理告警表格数据
    alertData.value = warningList.map((item, idx) => ({
      index: idx + 1,
      paramName: item.warningMessage || '未知异常',
      currentValue: item.warningLevelName || '',
      alertTime: item.warningTime || '',
    }));

    // 处理标准卡片数据
    standardList.value = detailList.map((item: any) => ({
      paramTypeValue: item.paramTypeValue,
      paramTypeName: item.paramTypeName,
      normalThreshold: generateThresholdText(item).normalText,
      abnormalThreshold: generateThresholdText(item).abnormalText,
    }));

    // 处理图表数据
    if (mationList.length > 0 && detailList.length > 0) {
      // 按 collect_time 升序排序
      const sorted = [...mationList].sort((a, b) =>
        dayjs(a.collect_time).valueOf() - dayjs(b.collect_time).valueOf()
      );

      const xAxis = sorted.map(item =>
        dayjs(item.collect_time).format(timeRange.value === '24h' ? 'HH:mm' : 'MM-DD HH:mm')
      );

      // 构建 series
      const series = detailList.map((config: any, idx: number) => {
        const field = config.paramTypeValue; // 例如 'x', 'y', 'z'
        const data = sorted.map(item => item[field] ?? null);
        return {
          name: config.paramTypeName,
          type: 'line',
          data,
          yAxisIndex: 0, // 所有数据使用左侧百分比轴
          lineStyle: { color: colorPalette[idx % colorPalette.length], width: 2 },
          symbol: 'circle',
          symbolSize: 6,
          smooth: false,
        };
      });

      renderChart(xAxis, series);
    } else if (mationList.length > 0 && detailList.length === 0) {
      // 若无配置但有时序数据，按静态默认处理（可选降级）
      const sorted = [...mationList].sort((a, b) =>
        dayjs(a.collect_time).valueOf() - dayjs(b.collect_time).valueOf()
      );
      const xAxis = sorted.map(item =>
        dayjs(item.collect_time).format(timeRange.value === '24h' ? 'HH:mm' : 'MM-DD HH:mm')
      );
      const series = [
        {
          name: '电池电量 (%)',
          type: 'line',
          data: sorted.map(item => item.x),
          yAxisIndex: 0,
          lineStyle: { color: '#3b7cff', width: 2 },
          symbol: 'circle',
          symbolSize: 6,
        },
        {
          name: '数据上传完整率 (%)',
          type: 'line',
          data: sorted.map(item => item.y),
          yAxisIndex: 0,
          lineStyle: { color: '#52c41a', width: 2 },
          symbol: 'circle',
          symbolSize: 6,
        },
        {
          name: '信号强度 (dBm)',
          type: 'line',
          data: sorted.map(item => item.z),
          yAxisIndex: 1,
          lineStyle: { color: '#faad14', width: 2 },
          symbol: 'circle',
          symbolSize: 6,
        },
      ];
      renderChart(xAxis, series);
    } else {
      // 无数据时清空图表
      if (chartInstance) chartInstance.clear();
    }
  } catch (error) {
    console.error('获取监控数据失败', error);
    message.error('获取监控数据失败，使用模拟数据');
    // 降级：使用模拟数据
    const mockData = getMockData(timeRange.value);
    alertData.value = mockData.alerts;
    standardList.value = mockData.standards;
    renderChart(mockData.xAxis, mockData.series);
  }
};

// 模拟数据（降级方案）
const getMockData = (range: TimeRange) => {
  const xAxis = range === '24h'
    ? ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
    : ['1月24日', '1月25日', '1月26日', '1月27日', '1月28日', '1月29日', '1月30日'];
  return {
    xAxis,
    series: [
      { name: 'X累计位移', data: [98, 95, 92, 88, 85, 82, 78, 75], yAxisIndex: 0, color: '#3b7cff' },
      { name: 'Y累计位移', data: [99, 98, 97, 96, 95, 94, 93, 92], yAxisIndex: 0, color: '#52c41a' },
      { name: 'Z累计位移', data: [-45, -48, -52, -55, -58, -60, -63, -65], yAxisIndex: 1, color: '#faad14' },
    ].map(s => ({
      name: s.name,
      type: 'line',
      data: s.data,
      yAxisIndex: s.yAxisIndex,
      lineStyle: { color: s.color, width: 2 },
      symbol: 'circle',
      symbolSize: 6,
    })),
    alerts: [
      { index: 1, paramName: 'X累计位移异常', currentValue: '15mm', alertTime: '2026-01-23 13:23:20' },
      { index: 2, paramName: 'Y累计位移异常', currentValue: '12mm', alertTime: '2026-01-23 13:23:20' },
    ],
    standards: [
      { paramTypeName: 'X累计位移', normalThreshold: '≤ 81.5℃', abnormalThreshold: '> 81.5℃' },
      { paramTypeName: 'Y累计位移', normalThreshold: '≤ 75%', abnormalThreshold: '> 75%' },
    ],
  };
};

// 渲染图表（支持动态系列）
const renderChart = (xAxisData: string[], seriesData: any[]) => {
  if (!chartRef.value) return;
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  }

  // 判断是否需要双Y轴（如果有信号强度类指标，数值可能为负且范围不同，可动态调整）
  // 简单判断是否有系列使用 yAxisIndex 1，没有则只用左轴
  const hasRightAxis = seriesData.some(s => s.yAxisIndex === 1);
  const yAxis = hasRightAxis
    ? [
        {
          type: 'value',
          name: '百分比 (%)',
          min: 0,
          max: 100,
          position: 'left',
          axisLabel: { formatter: '{value}%' },
        },
        {
          type: 'value',
          name: '信号强度 (dBm)',
          min: -100,
          max: -30,
          position: 'right',
          axisLabel: { formatter: '{value} dBm' },
          axisLine: { show: true },
        },
      ]
    : [
        {
          type: 'value',
          name: '数值',
          position: 'left',
        },
      ];

  const option = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: seriesData.map(s => s.name),
      left: 'left',
      textStyle: { color: '#fff' },
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      name: timeRange.value === '24h' ? '时间' : '日期',
    },
    yAxis,
    series: seriesData,
    grid: { containLabel: true, left: 60, right: 60, top: 50, bottom: 20 },
  };
  chartInstance.setOption(option, true);
};

// 刷新数据
const refreshData = () => loadMonitorData();

// 时间范围变化
const handleTimeRangeChange = () => loadMonitorData();

// 弹窗可见性变化时调整图表尺寸
const handleVisibleChange = (visible: boolean) => {
  if (visible) {
    nextTick(() => chartInstance?.resize());
  } else {
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }
  }
};
</script>

<style scoped lang="less">
.monitor-container {
  padding: 8px 0;

  .monitor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .header-left {
      .device-info {
        font-weight: 500;
        color: #fff;
      }
    }
    .header-right {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }

  .chart-wrapper {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
    .chart-container {
      flex: 3;
    }
    .standards-container {
      flex: 1;
      padding: 16px;
      border-radius: 8px;
      .standard-item {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
        .standard-label {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 8px;
          color: #fff;
        }
        .standard-value {
          font-size: 12px;
          color: #52c41a;
          margin-bottom: 4px;
          &.abnormal {
            color: #ff4d4f;
          }
        }
      }
    }
  }

  .alert-section {
    margin-top: 8px;
    .section-title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 12px;
      padding-left: 8px;
      border-left: 4px solid #ff7a45;
    }
  }
}
</style>