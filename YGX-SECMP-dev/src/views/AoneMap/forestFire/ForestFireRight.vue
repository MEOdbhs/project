<template>
  <aside class="ff-right">
    <div class="ff-card">
      <div class="ff-card__head">
        <BarChartOutlined class="ff-card__hico ff-card__hico--emerald" />
        <span>应急资源统计</span>
      </div>
      <div class="ff-card__body">
        <ResourcePie :data="resourcePieData" />
      </div>
    </div>

    <div class="ff-card">
      <div class="ff-card__head ff-card__head--border">
        <div class="ff-card__title-row">
          <VideoCameraOutlined class="ff-card__hico ff-card__hico--cyan" />
          <span>无人机巡护动态</span>
        </div>
        <span class="ff-tag">实时在线: 2</span>
      </div>
      <div class="ff-card__body ff-card__body--tight">
        <div class="ff-uav-grid">
          <div class="ff-uav-cell">
            <div class="ff-uav-lbl">今日覆盖面积</div>
            <div class="ff-uav-val">135.8 <span class="ff-uav-unit">km²</span></div>
          </div>
          <div class="ff-uav-cell">
            <div class="ff-uav-lbl">发现隐患次数</div>
            <div class="ff-uav-val ff-uav-val--amber">3 <span class="ff-uav-unit">次</span></div>
          </div>
        </div>
        <div class="ff-uav-list">
          <div v-for="p in mockUAVPatrols.slice(0, 2)" :key="p.id" class="ff-uav-row">
            <div class="ff-uav-icon"><RadarChartOutlined /></div>
            <div class="ff-uav-info">
              <div class="ff-uav-route">{{ p.route }}</div>
              <div class="ff-uav-sub">覆盖 {{ p.coverage }}km²</div>
            </div>
            <span class="ff-uav-status">巡护中</span>
          </div>
        </div>
      </div>
    </div>

    <div class="ff-card ff-card--grow">
      <div class="ff-card__head ff-card__head--border">
        <InboxOutlined class="ff-card__hico ff-card__hico--blue" />
        <span>物资消耗及补充进度</span>
      </div>
      <div class="ff-card__scroll">
        <div v-for="s in supplyProgress" :key="s.name" class="ff-supply">
          <div class="ff-supply__row">
            <span>{{ s.name }}</span>
            <span class="ff-supply__pct">{{ s.current }}%</span>
          </div>
          <div class="ff-supply__bar">
            <div
              class="ff-supply__fill"
              :class="barClass(s.current)"
              :style="{ width: `${s.current}%` }"
            />
          </div>
        </div>

        <div class="ff-dispatch">
          <div class="ff-dispatch__title">实时调度指令</div>
          <div v-for="r in busyResources" :key="r.id" class="ff-dispatch__card">
            <div class="ff-dispatch__top">
              <span class="ff-dispatch__name">{{ r.name }}</span>
              <span class="ff-dispatch__time">10:25</span>
            </div>
            <p class="ff-dispatch__txt">
              指令：立即前往青龙山北坡建立隔离带，配合无人机进行火场侦察。
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="ff-right__foot">
      <div class="ff-foot-cell">
        <div class="ff-foot-lbl">闭环率</div>
        <div class="ff-foot-val ff-foot-val--emerald">98.5%</div>
      </div>
      <div class="ff-foot-cell">
        <div class="ff-foot-lbl">平均处置时长</div>
        <div class="ff-foot-val">4.2h</div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import {
  BarChartOutlined,
  InboxOutlined,
  RadarChartOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons-vue';
import { computed } from 'vue';
import ResourcePie from './ResourcePie.vue';
import { mockResources, mockUAVPatrols, resourcePieData, supplyProgress } from './mockData';

const busyResources = computed(() => mockResources.filter((r) => r.status === 'busy'));

function barClass(current: number) {
  if (current < 50) return 'ff-supply__fill--red';
  if (current < 80) return 'ff-supply__fill--amber';
  return 'ff-supply__fill--emerald';
}
</script>

<style lang="less" scoped>
.ff-right {
  width: min(400px, 32vw);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  background: #020617;
  border-left: 1px solid #1e293b;
  overflow: hidden;
  min-height: 0;
}

.ff-card {
  border-radius: 10px;
  border: 1px solid #1e293b;
  background: rgba(15, 23, 42, 0.5);
  overflow: hidden;

  &--grow {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
}

.ff-card__head {
  padding: 12px 14px 0;
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 8px;

  &--border {
    padding: 12px 14px;
    border-bottom: 1px solid #1e293b;
    justify-content: space-between;
  }
}

.ff-card__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ff-card__hico {
  font-size: 15px;
  color: #60a5fa;

  &--emerald {
    color: #34d399;
  }
  &--cyan {
    color: #22d3ee;
  }
  &--blue {
    color: #60a5fa;
  }
}

.ff-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(34, 211, 238, 0.45);
  color: #22d3ee;
}

.ff-card__body {
  padding: 12px 14px 14px;

  &--tight {
    padding: 12px 14px;
  }
}

.ff-uav-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}

.ff-uav-cell {
  padding: 10px;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(51, 65, 85, 0.5);
}

.ff-uav-lbl {
  font-size: 10px;
  color: #64748b;
  margin-bottom: 4px;
}

.ff-uav-val {
  font-size: 16px;
  font-weight: 700;
  color: #fff;

  &--amber {
    color: #fbbf24;
  }
}

.ff-uav-unit {
  font-size: 10px;
  font-weight: 400;
  color: #94a3b8;
}

.ff-uav-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ff-uav-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 6px;
  background: rgba(30, 41, 59, 0.25);
  border: 1px solid #1e293b;
}

.ff-uav-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(34, 211, 238, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22d3ee;
  font-size: 15px;
}

.ff-uav-info {
  flex: 1;
  min-width: 0;
}

.ff-uav-route {
  font-size: 11px;
  font-weight: 600;
  color: #fff;
}

.ff-uav-sub {
  font-size: 10px;
  color: #64748b;
}

.ff-uav-status {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 4px;
  background: #1e293b;
  color: #94a3b8;
}

.ff-card__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 14px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }
}

.ff-supply {
  margin-bottom: 18px;
}

.ff-supply__row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #cbd5e1;
  margin-bottom: 6px;
}

.ff-supply__pct {
  color: #64748b;
}

.ff-supply__bar {
  height: 6px;
  border-radius: 999px;
  background: #1e293b;
  overflow: hidden;
}

.ff-supply__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 1s ease-out;

  &--red {
    background: #ef4444;
  }
  &--amber {
    background: #f59e0b;
  }
  &--emerald {
    background: #10b981;
  }
}

.ff-dispatch {
  padding-top: 14px;
  border-top: 1px solid #1e293b;
}

.ff-dispatch__title {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 10px;
}

.ff-dispatch__card {
  padding: 10px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.22);
  margin-bottom: 10px;
}

.ff-dispatch__top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.ff-dispatch__name {
  font-size: 11px;
  font-weight: 700;
  color: #60a5fa;
}

.ff-dispatch__time {
  font-size: 10px;
  color: #64748b;
}

.ff-dispatch__txt {
  margin: 0;
  font-size: 10px;
  color: #cbd5e1;
  line-height: 1.5;
}

.ff-right__foot {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.ff-foot-cell {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #1e293b;
  background: #0f172a;
}

.ff-foot-lbl {
  font-size: 10px;
  color: #64748b;
  margin-bottom: 4px;
}

.ff-foot-val {
  font-size: 16px;
  font-weight: 700;
  color: #fff;

  &--emerald {
    color: #34d399;
  }
}
</style>
