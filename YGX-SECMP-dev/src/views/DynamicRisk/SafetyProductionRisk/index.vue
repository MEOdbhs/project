<template>
  <!-- 企业安全生产风险评价 -->
  <div class="tech-page">
    <div class="tech-columns">
      <div class="tech-left">
        <div class="tech-card">
          <div class="tech-card__header">
            <div class="tech-card__title">安全生产综合评分雷达图</div>
          </div>
          <div class="tech-card__body">
            <div ref="radarChartRef" class="tech-chart" />
          </div>
        </div>
      </div>
      <div class="tech-right">
        <div class="tech-card">
          <div class="tech-card__header">
            <div class="tech-card__title">企业安全风险排行</div>
          </div>
          <div class="tech-card__body">
            <div class="ent-head">
              <div class="ent-rank">排名</div>
              <div class="ent-name">企业名称</div>
              <div class="ent-type">行业类型</div>
              <div class="ent-score">安全评分</div>
              <div class="ent-level">风险等级</div>
              <div class="ent-action">操作</div>
            </div>
            <div class="ent-list">
              <div v-for="(ent, idx) in topEnterprises" :key="idx" class="ent-item">
                <div class="ent-rank">
                  <div class="ent-rank-badge" :style="{ background: idx < 3 ? 'var(--tech-active)' : 'var(--tech-input-bg)' }">{{ idx + 1 }}</div>
                </div>
                <div class="ent-name">{{ ent.name }}</div>
                <div class="ent-type">{{ ent.type }}</div>
                <div class="ent-score">{{ ent.score }}</div>
                <div class="ent-level">
                  <span class="ent-level-tag" :style="{ color: riskColor(ent.level), background: 'rgba(0,0,0,0.2)' }">{{ riskLabel(ent.level) }}</span>
                </div>
                <div class="ent-action">
                  <button type="button" class="ent-link" @click="handleDetail(ent)">详情</button>
                </div>
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
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  const radarChartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(radarChartRef as Ref<HTMLDivElement>);

  const enterpriseData = [
    { name: '作业环境', value: 72 },
    { name: '设备设施', value: 85 },
    { name: '人员行为', value: 68 },
    { name: '管理制度', value: 90 },
    { name: '应急能力', value: 75 },
    { name: '隐患治理', value: 62 },
  ];

  const topEnterprises = [
    { name: '永靖化工有限公司', score: 87, level: 'low', type: '危化品' },
    { name: '盐锅峡矿业集团', score: 65, level: 'medium', type: '矿山' },
    { name: '西部煤炭有限公司', score: 52, level: 'high', type: '矿山' },
    { name: '永靖工业园区A企业', score: 78, level: 'low', type: '工贸' },
    { name: '新寺化工原料厂', score: 44, level: 'high', type: '危化品' },
  ];

  function riskColor(level: string) {
    return level === 'high' ? 'var(--tech-danger)' : level === 'medium' ? 'var(--tech-warning)' : 'var(--tech-success)';
  }

  function riskLabel(level: string) {
    return level === 'high' ? '高风险' : level === 'medium' ? '中风险' : '低风险';
  }

  function handleDetail(ent: { name: string }) {
    createMessage.info(ent.name);
  }

  onMounted(() => {
    setOptions({
      tooltip: {
        backgroundColor: 'var(--tech-card)',
        borderColor: 'var(--tech-border)',
        textStyle: { color: 'var(--tech-text)' },
      },
      radar: {
        indicator: enterpriseData.map((i) => ({ name: i.name, max: 100 })),
        axisName: { color: 'var(--tech-text-dim)', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(0,120,255,0.2)' } },
        splitArea: { areaStyle: { color: ['rgba(0,0,0,0)'] } },
        axisLine: { lineStyle: { color: 'rgba(0,120,255,0.2)' } },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: enterpriseData.map((i) => i.value),
              areaStyle: { color: 'rgba(0,212,255,0.15)' },
              lineStyle: { color: 'var(--tech-cyan)', width: 2 },
              itemStyle: { color: 'var(--tech-cyan)' },
            },
          ],
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

  .tech-left {
    width: 320px;
    flex-shrink: 0;
  }

  .tech-right {
    flex: 1;
    min-width: 0;
  }

  .tech-chart {
    height: 280px;
  }

  .ent-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 12px;
    font-size: 12px;
    color: var(--tech-cyan);
  }

  .ent-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }

  .ent-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 4px;
    background: rgba(0, 30, 70, 0.4);
    border: 1px solid var(--tech-border);
    font-size: 12px;
    color: var(--tech-text);
  }

  .ent-rank {
    width: 44px;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
  }

  .ent-rank-badge {
    width: 24px;
    height: 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: var(--tech-text);
  }

  .ent-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ent-type,
  .ent-score,
  .ent-level,
  .ent-action {
    width: 88px;
    text-align: center;
    flex-shrink: 0;
  }

  .ent-type {
    color: var(--tech-text-dim);
  }

  .ent-score {
    font-weight: 700;
    color: var(--tech-cyan);
  }

  .ent-level-tag {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 4px;
  }

  .ent-link {
    border: none;
    background: transparent;
    color: var(--tech-cyan);
    cursor: pointer;
    font-size: 12px;
  }
</style>
