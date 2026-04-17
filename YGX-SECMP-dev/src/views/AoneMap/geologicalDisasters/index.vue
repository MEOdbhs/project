<template>
  <BigScreenShell>
    <div class="geo-page">
    <main class="geo-main">
      <div class="geo-grid">
        <div class="geo-col geo-col--left">
          <div class="geo-stats">
            <StatCard
              title="今日预警"
              :value="8"
              unit="条"
              :icon="WarningOutlined"
              :trend="{ value: 12, isUp: true }"
              variant="danger"
              compact
            />
            <StatCard
              title="隐患点"
              :value="131"
              unit="处"
              :icon="EnvironmentOutlined"
              variant="warning"
              compact
            />
            <StatCard
              title="监测设备"
              :value="186"
              unit="台"
              :icon="AppstoreOutlined"
              variant="info"
              compact
            />
            <StatCard
              title="已处置"
              :value="5"
              unit="起"
              :icon="FileProtectOutlined"
              :trend="{ value: 10, isUp: false }"
              variant="success"
              compact
            />
          </div>

          <GeologicalPanel title="实时预警信息" :icon="WarningOutlined" class="geo-panel-warnings">
            <WarningList />
          </GeologicalPanel>
        </div>

        <div class="geo-col geo-col--center">
          <GeologicalPanel
            title="永靖县地质灾害分布图"
            :icon="GlobalOutlined"
            class="geo-panel-map"
            flush-body
          >
            <YongjingMap />
          </GeologicalPanel>

          <GeologicalPanel title="灾害发生趋势" :icon="RiseOutlined" class="geo-panel-trend">
            <template #action>
              <div class="geo-legend-inline">
                <span class="geo-legend-inline__item"><i class="dot dot-b" />滑坡</span>
                <span class="geo-legend-inline__item"><i class="dot dot-y" />泥石流</span>
                <span class="geo-legend-inline__item"><i class="dot dot-r" />崩塌</span>
              </div>
            </template>
            <TrendChart />
          </GeologicalPanel>
        </div>

        <div class="geo-col geo-col--right">
          <GeologicalPanel title="监测系统状态" :icon="AppstoreOutlined" class="geo-panel-monitoring">
            <MonitoringStats />
          </GeologicalPanel>

          <GeologicalPanel title="隐患点区域排行" :icon="DeploymentUnitOutlined" class="geo-panel-rank">
            <RegionRanking />
          </GeologicalPanel>

          <GeologicalPanel title="预警动态" :icon="FileProtectOutlined" class="geo-panel-dynamics">
            <WarningDynamics />
          </GeologicalPanel>
        </div>
      </div>
    </main>
    </div>
  </BigScreenShell>
</template>

<script lang="ts" setup>
import BigScreenShell from '../BigScreenShell.vue';
import {
  AppstoreOutlined,
  DeploymentUnitOutlined,
  EnvironmentOutlined,
  FileProtectOutlined,
  GlobalOutlined,
  RiseOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue';
import GeologicalPanel from './GeologicalPanel.vue';
import MonitoringStats from './MonitoringStats.vue';
import RegionRanking from './RegionRanking.vue';
import StatCard from './StatCard.vue';
import TrendChart from './TrendChart.vue';
import WarningDynamics from './WarningDynamics.vue';
import WarningList from './WarningList.vue';
import YongjingMap from './YongjingMap.vue';
</script>

<style lang="less" scoped>
.geo-page {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: radial-gradient(ellipse 120% 80% at 50% -20%, rgba(56, 189, 248, 0.12), transparent),
    linear-gradient(180deg, #0a0f18 0%, #070b12 40%, #050810 100%);
  color: #e2e8f0;
}

.geo-main {
  flex: 1;
  min-height: 0;
  padding: 12px;
  overflow: hidden;
}

.geo-grid {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(400px, 2fr) minmax(240px, 1fr);
  grid-template-rows: minmax(0, 1fr);
  gap: 12px;
  height: 100%;
  min-height: 0;
  align-content: stretch;

  > * {
    min-width: 0;
    min-height: 0;
  }
}

.geo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow: hidden;

  &--left,
  &--right {
    overflow: hidden;
  }

  &--center {
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 12px;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }
}

.geo-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  flex: 0 0 auto;
}

.geo-panel-grow {
  flex: 1;
  min-height: 0;
}

.geo-panel-warnings {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;

  :deep(.geo-panel__body) {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }
}

.geo-panel-map {
  min-height: 0;
  height: 100%;
  max-height: 100%;
  align-self: stretch;
  overflow: hidden;

  :deep(.geo-panel__body--flush) {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  :deep(.yj-map) {
    flex: 1;
    min-height: 0;
    height: auto;
  }
}

.geo-panel-trend {
  min-height: 0;
  flex-shrink: 0;
}

.geo-panel-monitoring {
  flex: 0 0 auto;
  min-height: 0;
}

.geo-panel-rank {
  flex: 0 0 auto;
  min-height: 0;
}

.geo-panel-dynamics {
  flex: 0 0 auto;
  max-height: 300px;
  min-height: 0;
  overflow: hidden;

  :deep(.geo-panel__body) {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
}

.geo-legend-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #94a3b8;
}

.geo-legend-inline__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
}
.dot-b {
  background: #3b82f6;
}
.dot-y {
  background: #eab308;
}
.dot-r {
  background: #ef4444;
}
</style>
