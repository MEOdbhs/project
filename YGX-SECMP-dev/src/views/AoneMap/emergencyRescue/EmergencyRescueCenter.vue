<template>
  <div class="er-center">
    <div class="glass er-map-panel">
      <div class="er-legend">
        <div class="er-legend-item">
          <span class="er-dot er-dot--red" />
          <span>救援队伍</span>
        </div>
        <div class="er-legend-item">
          <span class="er-dot er-dot--yellow" />
          <span>物资仓库</span>
        </div>
        <div class="er-legend-item">
          <span class="er-dot er-dot--green" />
          <span>医疗站点</span>
        </div>
        <div class="er-legend-item">
          <span class="er-dot er-dot--purple" />
          <span>应急通道</span>
        </div>
      </div>
      <EmergencyRescueMap
        :level="level"
        :town-name="townName"
        :resource-name="resourceName"
        :area-filter="areaFilter"
        :type-filter="typeFilter"
        :status-filter="statusFilter"
        @drill-town="emit('drillTown', $event)"
      />
    </div>

    <div class="er-bottom-stats">
      <div class="er-bcard">
        <div class="er-bcard-head">
          <span class="er-bcard-label">医疗救治能力</span>
          <HeartOutlined class="er-bcard-ico er-bcard-ico--green" />
        </div>
        <div class="er-bcard-val er-bcard-val--green">A级:2</div>
        <div class="er-bcard-sub">B级:3 | C级:1</div>
      </div>
      <div class="er-bcard">
        <div class="er-bcard-head">
          <span class="er-bcard-label">通道覆盖率</span>
          <DeploymentUnitOutlined class="er-bcard-ico er-bcard-ico--purple" />
        </div>
        <div class="er-bcard-val er-bcard-val--purple">92.5%</div>
        <div class="er-bcard-sub">畅通:14 | 施工:1</div>
      </div>
      <div class="er-bcard">
        <div class="er-bcard-head">
          <span class="er-bcard-label">资源调用</span>
          <FileTextOutlined class="er-bcard-ico er-bcard-ico--blue" />
        </div>
        <div class="er-bcard-val er-bcard-val--blue">156次</div>
        <div class="er-bcard-sub">本月调用 | 周转率78%</div>
      </div>
      <div class="er-bcard">
        <div class="er-bcard-head">
          <span class="er-bcard-label">可用资源</span>
          <CheckCircleOutlined class="er-bcard-ico er-bcard-ico--cyan" />
        </div>
        <div class="er-bcard-val er-bcard-val--cyan">35</div>
        <div class="er-bcard-sub">点位 | 可用率87.5%</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  CheckCircleOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  HeartOutlined,
} from '@ant-design/icons-vue';
import type { MapLevel } from './mockData';
import EmergencyRescueMap from './EmergencyRescueMap.vue';

defineProps<{
  level: MapLevel;
  townName: string | null;
  resourceName: string | null;
  areaFilter: string;
  typeFilter: string;
  statusFilter: string;
}>();

const emit = defineEmits<{
  drillTown: [name: string];
}>();
</script>

<style scoped lang="less">
@glass-bg: linear-gradient(135deg, rgba(13, 31, 60, 0.8) 0%, rgba(10, 22, 40, 0.9) 100%);
@border: rgba(64, 196, 255, 0.15);

.er-center {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.glass {
  background: @glass-bg;
  border: 1px solid @border;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.er-map-panel {
  position: relative;
  flex: 1;
  min-height: 0;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.er-legend {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  font-size: 11px;
  color: #cbd5e1;
  background: linear-gradient(135deg, rgba(13, 31, 60, 0.95) 0%, rgba(10, 22, 40, 0.98) 100%);
  border: 1px solid rgba(64, 196, 255, 0.2);
  border-radius: 10px;
  padding: 10px 16px;
  backdrop-filter: blur(10px);
}

.er-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.er-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: pulse-glow 2s infinite;

  &--red {
    background: #ef4444;
    color: #ef4444;
  }
  &--yellow {
    background: #eab308;
    color: #f59e0b;
  }
  &--green {
    background: #22c55e;
    color: #22c55e;
  }
  &--purple {
    background: #a855f7;
    color: #a855f7;
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 5px currentColor;
  }
  50% {
    box-shadow: 0 0 16px currentColor;
  }
}

.er-map-panel :deep(.er-map-wrap) {
  flex: 1;
  min-height: 280px;
}

.er-bottom-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  flex-shrink: 0;
}

.er-bcard {
  padding: 14px;
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.6) 0%, rgba(20, 40, 70, 0.8) 100%);
  border: 1px solid rgba(64, 196, 255, 0.1);
  border-radius: 12px;
  transition:
    border-color 0.2s,
    transform 0.2s;

  &:hover {
    border-color: rgba(64, 196, 255, 0.3);
    transform: translateY(-2px);
  }
}

.er-bcard-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.er-bcard-label {
  font-size: 11px;
  color: #94a3b8;
}

.er-bcard-ico {
  font-size: 18px;

  &--green {
    color: #4ade80;
  }
  &--purple {
    color: #c084fc;
  }
  &--blue {
    color: #60a5fa;
  }
  &--cyan {
    color: #22d3ee;
  }
}

.er-bcard-val {
  font-size: 26px;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  &--green {
    background: linear-gradient(135deg, #4ade80 0%, #34d399 100%);
    -webkit-background-clip: text;
    background-clip: text;
  }
  &--purple {
    background: linear-gradient(135deg, #c084fc 0%, #818cf8 100%);
    -webkit-background-clip: text;
    background-clip: text;
  }
  &--blue {
    background: linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%);
    -webkit-background-clip: text;
    background-clip: text;
  }
  &--cyan {
    background: linear-gradient(135deg, #22d3ee 0%, #14b8a6 100%);
    -webkit-background-clip: text;
    background-clip: text;
  }
}

.er-bcard-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
}
</style>
