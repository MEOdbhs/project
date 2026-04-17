<template>
  <!-- 边坡风险评价 -->
  <div class="tech-page">
    <div class="tech-columns">
      <div class="tech-col">
        <div class="tech-card">
          <div class="tech-card__header">
            <div class="tech-card__title">边坡风险评分排行</div>
          </div>
          <div class="tech-card__body">
            <div ref="rankChartRef" class="tech-chart" />
          </div>
        </div>
      </div>
      <div class="tech-col">
        <div class="tech-card">
          <div class="tech-card__header">
            <div class="tech-card__title">边坡监测详情</div>
          </div>
          <div class="tech-card__body">
            <div class="slope-list">
              <div v-for="(s, idx) in slopeData" :key="idx" class="slope-item">
                <div class="slope-name">{{ s.name }}</div>
                <div class="slope-track">
                  <div class="slope-bar" :style="{ width: `${s.risk}%`, background: riskColor(s.risk) }" />
                </div>
                <div class="slope-score" :style="{ color: riskColor(s.risk) }">{{ s.risk }}</div>
                <div class="slope-tag" :style="{ color: riskColor(s.risk), background: riskBg(s.risk) }">{{ riskLabel(s.risk) }}</div>
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

  const rankChartRef = ref<HTMLDivElement | null>(null);
  const { setOptions, echarts } = useECharts(rankChartRef as Ref<HTMLDivElement>);

  const slopeData = [
    { name: '太极山北坡', risk: 72, displacement: 3.2, rainfall: 45, stability: 65 },
    { name: '南山滑坡体', risk: 88, displacement: 7.8, rainfall: 62, stability: 42 },
    { name: '西河沟侧坡', risk: 45, displacement: 1.1, rainfall: 28, stability: 82 },
    { name: '刘家峡坝坡', risk: 38, displacement: 0.8, rainfall: 20, stability: 90 },
    { name: '尾矿库坝坡A', risk: 65, displacement: 4.5, rainfall: 38, stability: 70 },
  ];

  function riskColor(score: number) {
    return score >= 80 ? 'var(--tech-danger)' : score >= 60 ? 'var(--tech-warning)' : 'var(--tech-success)';
  }

  function riskBg(score: number) {
    return score >= 80 ? 'rgba(255,77,79,0.1)' : score >= 60 ? 'rgba(250,173,20,0.1)' : 'rgba(82,196,26,0.1)';
  }

  function riskLabel(score: number) {
    return score >= 80 ? '高风险' : score >= 60 ? '中风险' : '低风险';
  }

  onMounted(() => {
    const sorted = [...slopeData].sort((a, b) => b.risk - a.risk);
    setOptions({
      grid: { left: 90, right: 18, top: 18, bottom: 18 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'var(--tech-card)',
        borderColor: 'var(--tech-border)',
        textStyle: { color: 'var(--tech-text)' },
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: { color: 'var(--tech-text-dim)', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(0,120,255,0.1)' } },
        axisLine: { lineStyle: { color: 'rgba(0,120,255,0.25)' } },
      },
      yAxis: {
        type: 'category',
        data: sorted.map((i) => i.name),
        axisLabel: { color: 'var(--tech-text-dim)', fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          name: '风险评分',
          type: 'bar',
          data: sorted.map((i) => i.risk),
          barWidth: 12,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(22,119,255,0.15)' },
              { offset: 1, color: 'var(--tech-active)' },
            ]),
          },
        },
      ],
    });
  });

</script>

  @import '/@/assets/less/techTheme.less';

  .tech-page {
    padding: 16px;
  }

  .tech-columns {
    display: flex;
    gap: 12px;
  }

  .tech-col {
    flex: 1;
    min-width: 0;
  }

  .tech-chart {
    height: 260px;
  }

  .slope-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .slope-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 4px;
    background: rgba(0, 30, 70, 0.4);
    border: 1px solid var(--tech-border);
    font-size: 12px;
  }

  .slope-name {
    width: 112px;
    flex-shrink: 0;
    color: var(--tech-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .slope-track {
    height: 8px;
    flex: 1;
    border-radius: 999px;
    overflow: hidden;
    background: var(--tech-input-bg);
  }

  .slope-bar {
    height: 100%;
    border-radius: 999px;
  }

  .slope-score {
    width: 40px;
    text-align: right;
    font-weight: 700;
  }

  .slope-tag {
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 12px;
  }
 
