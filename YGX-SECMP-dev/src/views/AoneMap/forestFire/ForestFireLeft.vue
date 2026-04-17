<template>
  <aside class="ff-left">
    <div class="ff-left__stats">
      <div class="ff-stat ff-stat--red">
        <div class="ff-stat__row">
          <div class="ff-stat__ico ff-stat__ico--red"><ThunderboltOutlined /></div>
          <span class="ff-stat__badge">+12%</span>
        </div>
        <div class="ff-stat__val">12 <span class="ff-stat__unit">起</span></div>
        <div class="ff-stat__lbl">今日实时火情</div>
      </div>
      <div class="ff-stat ff-stat--amber">
        <div class="ff-stat__row">
          <div class="ff-stat__ico ff-stat__ico--amber"><WarningOutlined /></div>
          <span class="ff-stat__badge ff-stat__badge--amber">正常</span>
        </div>
        <div class="ff-stat__val">45 <span class="ff-stat__unit">处</span></div>
        <div class="ff-stat__lbl">巡护发现隐患</div>
      </div>
    </div>

    <div class="ff-card">
      <div class="ff-card__head">
        <RiseOutlined class="ff-card__hico" />
        <span>火情发生趋势 (24h)</span>
      </div>
      <FireTrendArea :data="fireTrend24h" />
    </div>

    <div class="ff-card ff-card--grow">
      <div class="ff-card__head ff-card__head--border">
        <div class="ff-card__title-row">
          <BellOutlined class="ff-card__hico ff-card__hico--danger" />
          <span>实时预警信息</span>
        </div>
        <span class="ff-card__sub">共 3 条待处理</span>
      </div>
      <div class="ff-card__scroll">
        <div v-for="fire in mockFirePoints" :key="fire.id" class="ff-alert">
          <div class="ff-alert__top">
            <div class="ff-alert__name-row">
              <span
                class="ff-alert__dot"
                :class="[
                  fire.status === 'confirmed' ? 'ff-alert__dot--red' : '',
                  fire.status === 'suspected' ? 'ff-alert__dot--amber' : '',
                  fire.status === 'extinguished' ? 'ff-alert__dot--green' : '',
                ]"
              />
              <span class="ff-alert__name">{{ fire.name }}</span>
            </div>
            <span class="ff-alert__lvl" :class="levelClass(fire.level)">{{ fire.level }}级响应</span>
          </div>
          <div class="ff-alert__meta">
            <span><FieldTimeOutlined /> {{ fire.startTime }}</span>
            <span><RiseOutlined /> 过火 {{ fire.area }}hm²</span>
          </div>
          <p class="ff-alert__desc">{{ fire.description }}</p>
          <div class="ff-alert__actions">
            <button type="button" class="ff-btn ff-btn--red">查看详情</button>
            <button type="button" class="ff-btn ff-btn--blue">调取预案</button>
            <span class="ff-alert__id">ID: {{ fire.id }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="ff-left__quick">
      <button type="button" class="ff-qbtn"><FieldTimeOutlined /> 轨迹追溯</button>
      <button type="button" class="ff-qbtn"><FileTextOutlined /> 预案调取</button>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import {
  BellOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue';
import FireTrendArea from './FireTrendArea.vue';
import { fireTrend24h, mockFirePoints } from './mockData';
import type { FireLevel } from './types';

function levelClass(level: FireLevel) {
  if (level === 'I') return 'ff-alert__lvl--i';
  if (level === 'II') return 'ff-alert__lvl--ii';
  if (level === 'III') return 'ff-alert__lvl--iii';
  return 'ff-alert__lvl--iv';
}
</script>

<style lang="less" scoped>
.ff-left {
  width: min(400px, 32vw);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  background: #020617;
  border-right: 1px solid #1e293b;
  overflow: hidden;
  min-height: 0;
}

.ff-left__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.ff-stat {
  border-radius: 10px;
  border: 1px solid #1e293b;
  background: rgba(15, 23, 42, 0.5);
  padding: 12px;

  &--red {
    border-color: rgba(239, 68, 68, 0.25);
  }
  &--amber {
    border-color: rgba(245, 158, 11, 0.25);
  }
}

.ff-stat__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ff-stat__ico {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  &--red {
    background: rgba(239, 68, 68, 0.12);
    color: #ef4444;
  }
  &--amber {
    background: rgba(245, 158, 11, 0.12);
    color: #f59e0b;
  }
}

.ff-stat__badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(239, 68, 68, 0.45);
  color: #f87171;

  &--amber {
    border-color: rgba(245, 158, 11, 0.45);
    color: #fbbf24;
  }
}

.ff-stat__val {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

.ff-stat__unit {
  font-size: 11px;
  font-weight: 400;
  color: #94a3b8;
}

.ff-stat__lbl {
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
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
    padding-bottom: 12px;
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

  &--danger {
    color: #f87171;
  }
}

.ff-card__sub {
  font-size: 10px;
  color: #64748b;
}

.ff-card__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }
}

.ff-alert {
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(51, 65, 85, 0.5);
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: rgba(239, 68, 68, 0.45);
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.ff-alert__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.ff-alert__name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ff-alert__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;
  animation: ff-pulse 2s ease-in-out infinite;

  &--red {
    background: #ef4444;
  }
  &--amber {
    background: #f59e0b;
  }
  &--green {
    background: #10b981;
  }
}

@keyframes ff-pulse {
  50% {
    opacity: 0.6;
  }
}

.ff-alert__name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.ff-alert__lvl {
  flex-shrink: 0;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  color: #fff;

  &--i {
    background: #dc2626;
  }
  &--ii {
    background: #ea580c;
  }
  &--iii {
    background: #d97706;
  }
  &--iv {
    background: #2563eb;
  }
}

.ff-alert__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 8px;

  :deep(.anticon) {
    margin-right: 4px;
    font-size: 11px;
  }
}

.ff-alert__desc {
  margin: 0;
  font-size: 11px;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ff-alert__actions {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ff-btn {
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  border: none;
  cursor: pointer;

  &--red {
    background: rgba(239, 68, 68, 0.12);
    color: #f87171;
  }
  &--blue {
    background: rgba(59, 130, 246, 0.12);
    color: #60a5fa;
  }
}

.ff-alert__id {
  font-size: 10px;
  color: #475569;
}

.ff-left__quick {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.ff-qbtn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #1e293b;
  background: #0f172a;
  color: #cbd5e1;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #1e293b;
  }
}
</style>
