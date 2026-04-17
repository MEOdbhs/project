<template>
  <!-- 设备实时监控 -->
  <div class="tech-page">
    <div class="tech-left">
      <div v-for="group in deviceGroups" :key="group.category" class="tech-card tech-group-card">
        <div class="tech-card__header">
          <div class="tech-card__title">{{ group.category }}</div>
          <div class="group-extra">{{ group.online }}/{{ group.count }}在线</div>
        </div>
        <div class="tech-card__body">
          <div class="group-list">
            <button
              v-for="item in group.items"
              :key="item.id"
              type="button"
              class="group-item"
              :class="{ 'group-item--active': selectedDevice === item.id }"
              @click="selectedDevice = item.id"
            >
              <div class="group-icon" :style="{ color: statusColor(item.status) }">
                <Icon :icon="statusIcon(item.status)" />
              </div>
              <div class="group-info">
                <div class="group-name">{{ item.name }}</div>
                <div class="group-id">{{ item.id }}</div>
              </div>
              <div class="group-val">{{ item.value }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="tech-right">
      <div class="tech-card">
        <div class="tech-card__header">
          <div class="tech-card__title">实时数据详情 — {{ selectedDevice }}</div>
        </div>
        <div class="tech-card__body">
          <div class="detail-stats">
            <div v-for="(item, idx) in detailStats" :key="idx" class="detail-stat">
              <div class="detail-stat__value" :style="{ color: item.color }">{{ item.value }}</div>
              <div class="detail-stat__label">{{ item.label }}</div>
            </div>
          </div>

          <div class="detail-tip">近2小时数据趋势（位移/mm）</div>
          <div ref="trendChartRef" class="detail-chart" />
        </div>
      </div>

      <div class="tech-card">
        <div class="tech-card__header">
          <div class="tech-card__title">历史告警记录</div>
        </div>
        <div class="tech-card__body">
          <div class="alarm-list">
            <div v-for="(r, idx) in alarmList" :key="idx" class="alarm-item">
              <Icon icon="mdi:chart-timeline-variant" :style="{ color: r.level === 'danger' ? 'var(--tech-danger)' : 'var(--tech-warning)' }" />
              <div class="alarm-time">{{ r.time }}</div>
              <div class="alarm-val" :style="{ color: r.level === 'danger' ? 'var(--tech-danger)' : 'var(--tech-warning)' }">{{ r.val }}</div>
              <div class="alarm-desc">{{ r.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, type Ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { useECharts } from '/@/hooks/web/useECharts';

  const deviceGroups = [
    {
      category: '地质灾害',
      count: 28,
      online: 25,
      items: [
        { id: 'JC-GZ-0001', name: '太极山位移传感器01', value: '2.3mm', unit: '位移', status: 'normal' },
        { id: 'JC-GZ-0002', name: '南山雨量计', value: '12.5mm/h', unit: '雨量', status: 'warning' },
        { id: 'JC-GZ-0003', name: '刘家峡水位计', value: '1732.4m', unit: '水位', status: 'normal' },
        { id: 'JC-GZ-0004', name: '西北坡倾斜仪', value: '0.8°', unit: '倾斜', status: 'normal' },
      ],
    },
    {
      category: '矿山',
      count: 42,
      online: 38,
      items: [
        { id: 'KS-WS-0001', name: '02巷瓦斯探头01', value: '0.3%', unit: '瓦斯', status: 'normal' },
        { id: 'KS-WS-0002', name: '主通风口风速计', value: '4.2m/s', unit: '风速', status: 'normal' },
        { id: 'KS-WS-0003', name: '采煤工作面温度', value: '28.5°C', unit: '温度', status: 'warning' },
      ],
    },
    {
      category: '危化品',
      count: 15,
      online: 14,
      items: [
        { id: 'HX-QT-0001', name: '氨气检测仪01', value: '8ppm', unit: '浓度', status: 'normal' },
        { id: 'HX-QT-0002', name: '可燃气体检测01', value: '15%LEL', unit: '浓度', status: 'warning' },
      ],
    },
  ];

  const chartData = [
    { time: '13:00', v: 2.1 },
    { time: '13:10', v: 2.2 },
    { time: '13:20', v: 2.0 },
    { time: '13:30', v: 2.3 },
    { time: '13:40', v: 2.5 },
    { time: '13:50', v: 2.3 },
    { time: '14:00', v: 2.3 },
    { time: '14:10', v: 2.4 },
    { time: '14:20', v: 2.8 },
    { time: '14:30', v: 3.0 },
    { time: '14:40', v: 2.9 },
    { time: '14:50', v: 2.7 },
  ];

  const alarmList = [
    { time: '2026-03-26 10:32', val: '4.8mm', level: 'warning', desc: '位移值接近预警阈值' },
    { time: '2026-03-25 22:15', val: '5.2mm', level: 'danger', desc: '位移值超过预警阈值，已触发橙色预警' },
    { time: '2026-03-25 16:40', val: '4.1mm', level: 'warning', desc: '位移速率超过3mm/d' },
  ];

  const selectedDevice = ref('JC-GZ-0001');

  const detailStats = computed(() => [
    { label: '当前数值', value: '2.3mm', color: 'var(--tech-cyan)' },
    { label: '今日最大值', value: '3.0mm', color: 'var(--tech-warning)' },
    { label: '今日最小值', value: '1.8mm', color: 'var(--tech-success)' },
    { label: '告警阈值', value: '5.0mm', color: 'var(--tech-danger)' },
  ]);

  function statusColor(status: string) {
    if (status === 'offline') return 'var(--tech-danger)';
    if (status === 'warning') return 'var(--tech-warning)';
    return 'var(--tech-success)';
  }

  function statusIcon(status: string) {
    if (status === 'offline') return 'mdi:wifi-off';
    if (status === 'warning') return 'mdi:alert';
    return 'mdi:wifi';
  }

  const trendChartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(trendChartRef as Ref<HTMLDivElement>);

  onMounted(() => {
    setOptions({
      grid: { left: 36, right: 12, top: 12, bottom: 24 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'var(--tech-card)',
        borderColor: 'var(--tech-border)',
        textStyle: { color: 'var(--tech-text)' },
      },
      xAxis: {
        type: 'category',
        data: chartData.map((i) => i.time),
        axisLabel: { color: 'var(--tech-text-dim)', fontSize: 11 },
        axisLine: { lineStyle: { color: 'rgba(0,120,255,0.25)' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 6,
        axisLabel: { color: 'var(--tech-text-dim)', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(0,120,255,0.1)' } },
      },
      series: [
        {
          name: '位移(mm)',
          type: 'line',
          smooth: true,
          data: chartData.map((i) => i.v),
          showSymbol: false,
          lineStyle: { color: 'var(--tech-cyan)', width: 2 },
        },
      ],
    });
  });
</script>

<style lang="less" scoped>
  @import '/@/assets/less/techTheme.less';

  .tech-page {
    display: flex;
    gap: 12px;
    padding: 16px;
  }

  .tech-left {
    width: 280px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .tech-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .group-extra {
    font-size: 12px;
    color: var(--tech-text-dim);
  }

  .group-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .group-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 4px;
    background: rgba(0, 30, 70, 0.3);
    border: 1px solid var(--tech-border);
    cursor: pointer;
    transition: background-color 0.15s ease;
    width: 100%;
    text-align: left;
  }

  .group-item--active {
    background: rgba(22, 119, 255, 0.15);
    border-color: var(--tech-active);
  }

  .group-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .group-info {
    flex: 1;
    min-width: 0;
  }

  .group-name {
    font-size: 12px;
    color: var(--tech-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .group-id {
    font-size: 12px;
    color: var(--tech-text-dim);
  }

  .group-val {
    font-size: 12px;
    font-weight: 700;
    color: var(--tech-cyan);
    flex-shrink: 0;
  }

  .detail-stats {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  .detail-stat {
    flex: 1;
    border-radius: 4px;
    padding: 12px;
    background: rgba(0, 30, 70, 0.4);
    border: 1px solid var(--tech-border);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-stat__value {
    font-size: 20px;
    font-weight: 700;
  }

  .detail-stat__label {
    font-size: 12px;
    color: var(--tech-text-dim);
  }

  .detail-tip {
    font-size: 12px;
    color: var(--tech-text-dim);
    margin-bottom: 8px;
  }

  .detail-chart {
    height: 200px;
  }

  .alarm-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .alarm-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 4px;
    background: rgba(0, 30, 70, 0.4);
    border: 1px solid var(--tech-border);
    font-size: 12px;
  }

  .alarm-time {
    color: var(--tech-text-dim);
  }

  .alarm-val {
    font-weight: 700;
  }

  .alarm-desc {
    color: var(--tech-text);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
