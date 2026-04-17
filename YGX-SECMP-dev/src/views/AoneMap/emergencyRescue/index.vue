<template>
  <BigScreenShell>
    <div class="er-page">
      <EmergencyRescueTopBar
        v-model:area-filter="areaFilter"
        v-model:type-filter="typeFilter"
        v-model:status-filter="statusFilter"
        :level="level"
        :town-name="townName"
        :resource-name="resourceName"
        @breadcrumb-county="goCounty"
        @breadcrumb-town="goTownBreadcrumb"
        @switch-level="onSwitchLevel"
        @select-resource="onSelectResource"
      />
      <div class="er-main">
        <EmergencyRescueLeft :stats="overviewStats" @select-team="onSelectTeam" />
        <EmergencyRescueCenter
          :level="level"
          :town-name="townName"
          :resource-name="resourceName"
          :area-filter="areaFilter"
          :type-filter="typeFilter"
          :status-filter="statusFilter"
          @drill-town="onDrillTown"
        />
        <EmergencyRescueRight />
      </div>
    </div>
  </BigScreenShell>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import BigScreenShell from '../BigScreenShell.vue';
import EmergencyRescueCenter from './EmergencyRescueCenter.vue';
import EmergencyRescueLeft from './EmergencyRescueLeft.vue';
import EmergencyRescueRight from './EmergencyRescueRight.vue';
import EmergencyRescueTopBar from './EmergencyRescueTopBar.vue';
import type { MapLevel } from './mockData';
import { computeOverviewStats } from './mockData';

const level = ref<MapLevel>('county');
const townName = ref<string | null>(null);
const resourceName = ref<string | null>(null);
const areaFilter = ref('all');
const typeFilter = ref('all');
const statusFilter = ref('all');

const overviewStats = computed(() =>
  computeOverviewStats(level.value, townName.value, resourceName.value),
);

function goCounty() {
  level.value = 'county';
  townName.value = null;
  resourceName.value = null;
}

function goTownBreadcrumb() {
  if (!townName.value) return;
  level.value = 'town';
  resourceName.value = null;
}

function onDrillTown(name: string) {
  townName.value = name;
  level.value = 'town';
  resourceName.value = null;
}

function onSelectTeam(name: string, town: string) {
  townName.value = town;
  resourceName.value = name;
  level.value = 'resource';
}

function onSelectResource(name: string, town: string) {
  townName.value = town;
  resourceName.value = name;
  level.value = 'resource';
}

function onSwitchLevel(l: MapLevel) {
  if (l === 'county') {
    goCounty();
    return;
  }
  if (l === 'town') {
    if (!townName.value) return;
    level.value = 'town';
    resourceName.value = null;
    return;
  }
  if (!resourceName.value) return;
  level.value = 'resource';
}

</script>

<style scoped lang="less">
.er-page {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
    linear-gradient(180deg, #0a1628 0%, #050e1d 100%);
  color: #fff;
  overflow: hidden;
}

.er-main {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(0, 2fr) minmax(260px, 1fr);
  grid-template-rows: minmax(0, 1fr);
  gap: 16px;
  padding: 0 12px 12px;
  overflow: hidden;
  align-items: stretch;
}

.er-main > * {
  min-height: 0;
}

@media (max-width: 1400px) {
  .er-main {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    overflow-y: auto;
  }
}
</style>
