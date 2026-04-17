<template>
  <aside class="it-right">
    <div class="it-search">
      <div class="it-search__wrap">
        <SearchOutlined class="it-search__icon" />
        <input
          v-model="searchQuery"
          type="text"
          class="it-search__input"
          placeholder="搜索企业名称..."
          autocomplete="off"
        />
      </div>
      <button type="button" class="it-search__filter">
        <FilterOutlined />
        筛选条件
      </button>
    </div>

    <div class="it-section">
      <h3 class="it-section__title"><span class="it-section__bar" />粉尘涉爆专项统计</h3>
      <IndustryBarCharts />
    </div>

    <div class="it-section it-section--grow">
      <h3 class="it-section__title"><span class="it-section__bar" />企业名录</h3>
      <div class="it-ent-list">
        <div
          v-for="e in filteredEnterprises"
          :key="e.id"
          class="it-ent"
        >
          <div class="it-ent__top">
            <span class="it-ent__name">{{ e.name }}</span>
            <span
              class="it-ent__status"
              :class="`it-ent__status--${e.realTimeData.status}`"
            >{{ monitorStatusLabel(e.realTimeData.status) }}</span>
          </div>
          <div class="it-ent__meta">
            <span><EnvironmentOutlined /> {{ townshipName(e.townshipId) }}</span>
            <span><InfoCircleOutlined /> 未处置: {{ e.alarms.unhandled }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { EnvironmentOutlined, FilterOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue';
import IndustryBarCharts from './IndustryBarCharts.vue';
import { monitorStatusLabel } from './monitorLabels';
import { ENTERPRISES, townshipNameById } from './mockData';

function townshipName(id: string) {
  return townshipNameById(id);
}

const searchQuery = ref('');

const filteredEnterprises = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return ENTERPRISES;
  return ENTERPRISES.filter((e) => e.name.toLowerCase().includes(q));
});
</script>

<style lang="less" scoped>
.it-right {
  width: min(320px, 28vw);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  overflow: hidden;
  min-height: 0;
  background: rgba(0, 0, 0, 0.2);
  border-left: 1px solid rgba(255, 255, 255, 0.05);
}

.it-search {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.it-search__wrap {
  position: relative;
}

.it-search__icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.35);
  font-size: 14px;
}

.it-search__input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px 8px 36px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 13px;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }

  &:focus {
    border-color: rgba(34, 211, 238, 0.45);
  }
}

.it-search__filter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 6px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

.it-section {
  padding: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &--grow {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
}

.it-section__title {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.it-section__bar {
  width: 4px;
  height: 14px;
  border-radius: 2px;
  background: #22d3ee;
}

.it-ent-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 4px;
  }
}

.it-ent {
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: rgba(34, 211, 238, 0.35);

    .it-ent__name {
      color: #22d3ee;
    }
  }
}

.it-ent__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.it-ent__name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  transition: color 0.2s;
}

.it-ent__status {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;

  &--alarm {
    background: rgba(239, 68, 68, 0.2);
    color: #f87171;
  }
  &--warning {
    background: rgba(234, 179, 8, 0.2);
    color: #facc15;
  }
  &--normal {
    background: rgba(34, 197, 94, 0.15);
    color: #4ade80;
  }
}

.it-ent__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);

  :deep(.anticon) {
    margin-right: 4px;
    font-size: 10px;
  }
}
</style>
