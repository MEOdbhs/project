<template>
  <!-- 地震实时评估 -->
  <div class="tech-page">
    <div class="tech-columns">
      <div class="tech-main">
        <div class="tech-card">
          <div class="tech-card__header">
            <div class="tech-card__title">今日地震活动趋势（震级/时间）</div>
          </div>
          <div class="tech-card__body">
            <div ref="trendChartRef" class="tech-chart" />
          </div>
        </div>

        <div class="tech-card">
          <div class="tech-card__header">
            <div class="tech-card__title">近期地震记录</div>
          </div>
          <div class="tech-card__body">
            <div class="eq-list">
              <div v-for="(eq, idx) in earthquakeList" :key="idx" class="eq-item">
                <div class="eq-mag" :style="{ color: Number(eq.mag) >= 2.5 ? 'var(--tech-warning)' : 'var(--tech-cyan)' }">
                  M{{ eq.mag }}
                </div>
                <div class="eq-loc">{{ eq.loc }}</div>
                <div class="eq-depth">{{ eq.depth }}</div>
                <div class="eq-time">{{ eq.time }}</div>
                <div
                  class="eq-risk"
                  :style="{
                    color: eq.risk === '中' ? 'var(--tech-warning)' : 'var(--tech-success)',
                    background: eq.risk === '中' ? 'rgba(250,173,20,0.1)' : 'rgba(82,196,26,0.1)',
                  }"
                >
                  {{ eq.risk }}险
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="tech-side">
        <div class="tech-card">
          <div class="tech-card__header">
            <div class="tech-card__title">地震风险等级分布</div>
          </div>
          <div class="tech-card__body">
            <div class="dist">
              <div v-for="(item, idx) in riskDistribution" :key="idx" class="dist-item">
                <div class="dist-head">
                  <span class="dist-label">{{ item.level }}</span>
                  <span class="dist-val" :style="{ color: item.color }">{{ item.count }}%</span>
                </div>
                <div class="dist-track">
                  <div class="dist-bar" :style="{ width: `${item.count}%`, background: item.color }" />
                </div>
              </div>
              <div class="dist-summary">
                <div class="dist-summary__label">当前地震风险综合评估</div>
                <div class="dist-summary__value">低风险</div>
                <div class="dist-summary__desc">永靖县区域地震风险处于低风险水平，近期无显著地震活动</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, type Ref } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';

  const trendChartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(trendChartRef as Ref<HTMLDivElement>);

  const earthquakeData = [
    { time: '00:00', magnitude: 0.2 },
    { time: '02:00', magnitude: 0.5 },
    { time: '04:00', magnitude: 0.3 },
    { time: '06:00', magnitude: 1.1 },
    { time: '08:00', magnitude: 0.8 },
    { time: '10:00', magnitude: 0.4 },
    { time: '12:00', magnitude: 0.6 },
    { time: '14:00', magnitude: 1.8 },
    { time: '16:00', magnitude: 0.9 },
    { time: '18:00', magnitude: 0.3 },
    { time: '20:00', magnitude: 0.7 },
    { time: '22:00', magnitude: 0.5 },
  ];

  const earthquakeList = [
    { time: '2026-03-26 14:17', mag: '1.8', depth: '8km', loc: '永靖县北部山区', risk: '低' },
    { time: '2026-03-25 09:32', mag: '2.1', depth: '12km', loc: '刘家峡水库附近', risk: '低' },
    { time: '2026-03-24 22:14', mag: '1.3', depth: '5km', loc: '太极山南麓', risk: '低' },
    { time: '2026-03-23 07:55', mag: '2.8', depth: '15km', loc: '永靖县东南方向', risk: '中' },
  ];

  const riskDistribution = [
    { level: '低风险区', count: 85, color: 'var(--tech-success)' },
    { level: '中风险区', count: 12, color: 'var(--tech-warning)' },
    { level: '高风险区', count: 3, color: 'var(--tech-danger)' },
  ];

  onMounted(() => {
    setOptions({
      grid: { left: 36, right: 12, top: 24, bottom: 24 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'var(--tech-card)',
        borderColor: 'var(--tech-border)',
        textStyle: { color: 'var(--tech-text)' },
      },
      xAxis: {
        type: 'category',
        data: earthquakeData.map((i) => i.time),
        axisLabel: { color: 'var(--tech-text-dim)', fontSize: 11 },
        axisLine: { lineStyle: { color: 'rgba(0,120,255,0.25)' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: 'var(--tech-text-dim)', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(0,120,255,0.1)' } },
      },
      series: [
        {
          name: '震级',
          type: 'line',
          smooth: true,
          data: earthquakeData.map((i) => i.magnitude),
          showSymbol: true,
          symbolSize: 6,
          lineStyle: { color: 'var(--tech-cyan)', width: 2 },
          itemStyle: { color: 'var(--tech-cyan)' },
          areaStyle: { color: 'rgba(0,212,255,0.06)' },
        },
      ],
    });
  });
</script>

<style lang="less" scoped>
  @import '/@/assets/less/techTheme.less';

  .tech-page {
    padding: 16px;
  }

  .tech-columns {
    display: flex;
    gap: 12px;
  }

  .tech-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .tech-side {
    width: 280px;
  }

  .tech-chart {
    height: 220px;
  }

  .eq-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .eq-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 4px;
    background: rgba(0, 30, 70, 0.4);
    border: 1px solid var(--tech-border);
    font-size: 12px;
  }

  .eq-mag {
    width: 44px;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
  }

  .eq-loc {
    flex: 1;
    color: var(--tech-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .eq-depth {
    width: 56px;
    text-align: center;
    color: var(--tech-text-dim);
  }

  .eq-time {
    width: 132px;
    text-align: right;
    color: var(--tech-text-dim);
  }

  .eq-risk {
    width: 44px;
    text-align: center;
    border-radius: 4px;
    padding: 2px 0;
  }

  .dist {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .dist-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .dist-head {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }

  .dist-label {
    color: var(--tech-text);
  }

  .dist-track {
    height: 8px;
    border-radius: 999px;
    overflow: hidden;
    background: var(--tech-input-bg);
  }

  .dist-bar {
    height: 100%;
    border-radius: 999px;
  }

  .dist-summary {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--tech-border);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .dist-summary__label {
    font-size: 12px;
    color: var(--tech-text-dim);
  }

  .dist-summary__value {
    font-size: 18px;
    font-weight: 700;
    color: var(--tech-success);
  }

  .dist-summary__desc {
    font-size: 12px;
    color: var(--tech-text-dim);
    line-height: 1.4;
  }
</style>
