<template>
  <BigScreenShell>
    <div class="hyd-page">
      <main class="hyd-main">
        <div class="hyd-top">
          <div class="hyd-grid">
            <div class="hyd-col hyd-col--left">
              <GeologicalPanel title="实时水位监测" :icon="DashboardOutlined">
                <div class="hyd-summary">
                  <div class="hyd-summary__cell">
                    <div class="hyd-summary__value hyd-summary__value--cyan">{{ avgWaterLevel }}</div>
                    <div class="hyd-summary__label">平均水位(m)</div>
                  </div>
                  <div class="hyd-summary__cell">
                    <div class="hyd-summary__value hyd-summary__value--green">{{ normalStationCount }}</div>
                    <div class="hyd-summary__label">正常站点</div>
                  </div>
                </div>
              </GeologicalPanel>

              <div class="hyd-station-list">
                <HydrologyStationCard v-for="s in sidebarStations" :key="s.id" :station="s" />
              </div>
            </div>

            <div class="hyd-col hyd-col--center">
              <GeologicalPanel title="永靖县水文站点分布" :icon="GlobalOutlined" class="hyd-panel-map" flush-body>
                <HydrologyMap :stations="hydrologyStations" />
              </GeologicalPanel>
            </div>

            <div class="hyd-col hyd-col--right">
              <GeologicalPanel title="水质监测" :icon="SafetyCertificateOutlined">
                <div class="hyd-wq-summary">
                  <div class="hyd-wq-summary__cell">
                    <div class="hyd-wq-summary__n hyd-wq-summary__n--green">{{ qualityGoodCount }}</div>
                    <div class="hyd-wq-summary__t">优良</div>
                  </div>
                  <div class="hyd-wq-summary__cell">
                    <div class="hyd-wq-summary__n hyd-wq-summary__n--yellow">{{ qualityFairCount }}</div>
                    <div class="hyd-wq-summary__t">良好</div>
                  </div>
                  <div class="hyd-wq-summary__cell">
                    <div class="hyd-wq-summary__n hyd-wq-summary__n--red">{{ qualityPoorCount }}</div>
                    <div class="hyd-wq-summary__t">较差</div>
                  </div>
                </div>
                <div class="hyd-wq-list">
                  <div v-for="row in waterQualityRows" :key="row.station" class="hyd-wq-row">
                    <div class="hyd-wq-row__head">
                      <span class="hyd-wq-row__name">{{ row.station }}</span>
                      <span class="hyd-wq-row__badge" :class="`hyd-wq-row__badge--${row.status}`">{{
                        waterQualityStatusLabel(row.status)
                      }}</span>
                    </div>
                    <div class="hyd-wq-row__grid">
                      <div class="hyd-wq-metric">
                        <div class="hyd-wq-metric__l">PH</div>
                        <div class="hyd-wq-metric__v">{{ row.ph }}</div>
                      </div>
                      <div class="hyd-wq-metric">
                        <div class="hyd-wq-metric__l">溶解氧</div>
                        <div class="hyd-wq-metric__v">{{ row.dissolvedOxygen }}</div>
                      </div>
                      <div class="hyd-wq-metric">
                        <div class="hyd-wq-metric__l">浊度</div>
                        <div class="hyd-wq-metric__v">{{ row.turbidity }}</div>
                      </div>
                      <div class="hyd-wq-metric">
                        <div class="hyd-wq-metric__l">电导率</div>
                        <div class="hyd-wq-metric__v">{{ row.conductivity }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </GeologicalPanel>

              <GeologicalPanel title="预警信息" :icon="WarningOutlined" class="hyd-panel-warnings">
                <template #action>
                  <span class="hyd-warn-count">{{ hydrologyWarnings.length }}条</span>
                </template>
                <div class="hyd-warn-list">
                  <div
                    v-for="w in hydrologyWarnings"
                    :key="w.id"
                    class="hyd-warn-item"
                    :class="`hyd-warn-item--${w.level}`"
                  >
                    <WarningOutlined class="hyd-warn-item__icon" />
                    <div class="hyd-warn-item__body">
                      <div class="hyd-warn-item__meta">{{ w.station }} · {{ w.time }}</div>
                      <div class="hyd-warn-item__msg">{{ w.message }}</div>
                    </div>
                  </div>
                </div>
              </GeologicalPanel>
            </div>
          </div>
        </div>

        <GeologicalPanel title="数据统计概览" :icon="RiseOutlined" class="hyd-bottom-panel">
          <div class="hyd-overview">
            <div class="hyd-overview__cell">
              <div class="hyd-overview__n hyd-overview__n--cyan">{{ hydrologyStations.length }}</div>
              <div class="hyd-overview__t">监测站点</div>
              <div class="hyd-overview__sub hyd-overview__sub--green">+2 本月新增</div>
            </div>
            <div class="hyd-overview__cell">
              <div class="hyd-overview__n hyd-overview__n--green">{{ totalFlowK }}K</div>
              <div class="hyd-overview__t">总流量(m³/s)</div>
              <div class="hyd-overview__sub hyd-overview__sub--cyan">↑ 5.2%</div>
            </div>
            <div class="hyd-overview__cell">
              <div class="hyd-overview__n hyd-overview__n--cyan2">{{ waterQualityRows.length }}</div>
              <div class="hyd-overview__t">水质监测点</div>
              <div class="hyd-overview__sub hyd-overview__sub--green">达标率 75%</div>
            </div>
            <div class="hyd-overview__cell">
              <div class="hyd-overview__n hyd-overview__n--yellow">{{ seriousWarningCount }}</div>
              <div class="hyd-overview__t">预警/告警</div>
              <div class="hyd-overview__sub hyd-overview__sub--yellow">需关注</div>
            </div>
            <div class="hyd-overview__cell">
              <div class="hyd-overview__n hyd-overview__n--purple">99.8%</div>
              <div class="hyd-overview__t">系统可用率</div>
              <div class="hyd-overview__sub hyd-overview__sub--muted">近30天</div>
            </div>
          </div>
        </GeologicalPanel>
      </main>
    </div>
  </BigScreenShell>
</template>

<script lang="ts" setup>
import {
  DashboardOutlined,
  GlobalOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue';
import { computed } from 'vue';
import BigScreenShell from '../BigScreenShell.vue';
import GeologicalPanel from '../geologicalDisasters/GeologicalPanel.vue';
import HydrologyMap from './HydrologyMap.vue';
import HydrologyStationCard from './HydrologyStationCard.vue';
import {
  hydrologyStations,
  hydrologyWarnings,
  waterQualityRows,
  waterQualityStatusLabel,
} from './mockData';

const sidebarStations = computed(() => hydrologyStations.slice(0, 4));

const avgWaterLevel = computed(() =>
  (hydrologyStations.reduce((sum, s) => sum + s.waterLevel, 0) / hydrologyStations.length).toFixed(1),
);

const normalStationCount = computed(() => hydrologyStations.filter((s) => s.status === 'normal').length);

const qualityGoodCount = computed(() => waterQualityRows.filter((q) => q.status === 'good').length);
const qualityFairCount = computed(() => waterQualityRows.filter((q) => q.status === 'fair').length);
const qualityPoorCount = computed(() => waterQualityRows.filter((q) => q.status === 'poor').length);

const totalFlowK = computed(() =>
  (hydrologyStations.reduce((acc, s) => acc + s.flow, 0) / 1000).toFixed(1),
);

const seriousWarningCount = computed(() => hydrologyWarnings.filter((w) => w.level !== 'info').length);
</script>

<style lang="less" scoped>
.hyd-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: radial-gradient(ellipse 120% 80% at 50% -20%, rgba(56, 189, 248, 0.12), transparent),
    linear-gradient(180deg, #0a0f18 0%, #070b12 40%, #050810 100%);
  color: #e2e8f0;
}

.hyd-main {
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hyd-top {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.hyd-grid {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(400px, 2fr) minmax(260px, 1fr);
  gap: 16px;
  height: 100%;
  align-content: stretch;
}

.hyd-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow: hidden;

  &--left,
  &--right {
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(56, 189, 248, 0.2);
      border-radius: 4px;
    }
  }

  &--center {
    min-width: 0;
  }
}

.hyd-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.hyd-summary__cell {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background: rgba(13, 31, 60, 0.45);
  border: 1px solid rgba(56, 189, 248, 0.1);
}

.hyd-summary__value {
  font-size: 22px;
  font-weight: 700;

  &--cyan {
    color: #22d3ee;
  }
  &--green {
    color: #4ade80;
  }
}

.hyd-summary__label {
  margin-top: 4px;
  font-size: 11px;
  color: #94a3b8;
}

.hyd-station-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
}

.hyd-panel-map {
  flex: 1;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.hyd-panel-warnings {
  flex: 1;
  min-height: 160px;
}

:deep(.hyd-panel-map .geo-panel__body--flush) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 320px;
}

.hyd-wq-summary {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.hyd-wq-summary__cell {
  flex: 1;
  text-align: center;
  padding: 8px;
  border-radius: 8px;
  background: rgba(13, 31, 60, 0.45);
}

.hyd-wq-summary__n {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.15;

  &--green {
    color: #4ade80;
  }
  &--yellow {
    color: #facc15;
  }
  &--red {
    color: #f87171;
  }
}

.hyd-wq-summary__t {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
}

.hyd-wq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 220px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.2);
    border-radius: 4px;
  }
}

.hyd-wq-row {
  padding: 10px;
  border-radius: 8px;
  background: rgba(13, 31, 60, 0.45);
  border: 1px solid rgba(56, 189, 248, 0.08);
}

.hyd-wq-row__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.hyd-wq-row__name {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hyd-wq-row__badge {
  flex-shrink: 0;
  font-size: 12px;
  padding: 3px 9px;
  border-radius: 4px;

  &--good {
    color: #4ade80;
    background: rgba(74, 222, 128, 0.12);
  }
  &--fair {
    color: #facc15;
    background: rgba(250, 204, 21, 0.12);
  }
  &--poor {
    color: #f87171;
    background: rgba(248, 113, 113, 0.12);
  }
}

.hyd-wq-row__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.hyd-wq-metric {
  text-align: center;
}

.hyd-wq-metric__l {
  font-size: 12px;
  color: #94a3b8;
}

.hyd-wq-metric__v {
  font-size: 15px;
  color: #67e8f9;
  font-weight: 600;
  margin-top: 4px;
  font-variant-numeric: tabular-nums;
}

.hyd-warn-count {
  font-size: 11px;
  color: #f87171;
  background: rgba(248, 113, 113, 0.12);
  padding: 2px 8px;
  border-radius: 4px;
}

.hyd-warn-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 280px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(56, 189, 248, 0.2);
    border-radius: 4px;
  }
}

.hyd-warn-item {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid transparent;

  &--danger {
    border-color: rgba(239, 68, 68, 0.45);
    background: rgba(239, 68, 68, 0.1);
  }
  &--warning {
    border-color: rgba(234, 179, 8, 0.45);
    background: rgba(234, 179, 8, 0.1);
  }
  &--info {
    border-color: rgba(59, 130, 246, 0.45);
    background: rgba(59, 130, 246, 0.1);
  }
}

.hyd-warn-item__icon {
  flex-shrink: 0;
  margin-top: 2px;
  font-size: 14px;
}

.hyd-warn-item--danger .hyd-warn-item__icon {
  color: #f87171;
}
.hyd-warn-item--warning .hyd-warn-item__icon {
  color: #facc15;
}
.hyd-warn-item--info .hyd-warn-item__icon {
  color: #60a5fa;
}

.hyd-warn-item__meta {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.hyd-warn-item__msg {
  font-size: 13px;
  color: #e2e8f0;
  line-height: 1.45;
}

.hyd-bottom-panel {
  flex-shrink: 0;
}

.hyd-overview {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

@media (max-width: 1400px) {
  .hyd-overview {
    grid-template-columns: repeat(3, 1fr);
  }
}

.hyd-overview__cell {
  text-align: center;
  padding: 16px 12px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(13, 31, 60, 0.75) 0%, transparent 100%);
  border: 1px solid rgba(56, 189, 248, 0.1);
}

.hyd-overview__n {
  font-size: 26px;
  font-weight: 700;

  &--cyan {
    color: #22d3ee;
  }
  &--green {
    color: #4ade80;
  }
  &--cyan2 {
    color: #67e8f9;
  }
  &--yellow {
    color: #facc15;
  }
  &--purple {
    color: #c084fc;
  }
}

.hyd-overview__t {
  margin-top: 6px;
  font-size: 13px;
  color: #94a3b8;
}

.hyd-overview__sub {
  margin-top: 4px;
  font-size: 11px;

  &--green {
    color: #4ade80;
  }
  &--cyan {
    color: #22d3ee;
  }
  &--yellow {
    color: #facc15;
  }
  &--muted {
    color: #64748b;
  }
}
</style>
