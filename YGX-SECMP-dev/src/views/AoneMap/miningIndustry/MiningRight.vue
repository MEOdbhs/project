<template>
  <aside class="mi-side">
    <div class="mi-card mi-filter-card">
      <div class="mi-filter-head">
        <FilterOutlined class="mi-filter-head__icon" />
        <span class="mi-filter-head__text">生产状态筛选</span>
      </div>
      <div class="mi-filter-tags">
        <button
          v-for="s in statusOptions"
          :key="s"
          type="button"
          class="mi-filter-btn"
          :class="{ 'mi-filter-btn--active': activeStatus === s }"
          @click="activeStatus = s"
        >
          {{ s }}
        </button>
      </div>
      <div class="mi-search-wrap">
        <SearchOutlined class="mi-search-icon" />
        <input v-model="enterpriseKeyword" type="text" class="mi-search-input" placeholder="搜索企业名称..." />
      </div>
    </div>

    <div class="mi-card mi-grow">
      <h4>矿山区域分布排行</h4>
      <div class="mi-rank">
        <div v-for="(item, idx) in rankingData" :key="item.name" class="mi-rank__row">
          <span>{{ idx + 1 }}. {{ item.name }}</span>
          <b>{{ item.count }}座</b>
        </div>
      </div>
    </div>

    <div class="mi-card mi-grow">
      <h4>隐蔽致灾因素治理</h4>
      <div class="mi-gov">
        <div v-for="item in governanceData" :key="item.label">
          <div class="mi-gov__top"><span>{{ item.label }}</span><span>{{ item.value }}/{{ item.total }}</span></div>
          <div class="mi-gov__bar"><i :style="{ width: `${(item.value / item.total) * 100}%`, backgroundColor: item.color }" /></div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { governanceData, rankingData, statusOptions } from './mockData';

const activeStatus = ref('全部');
const enterpriseKeyword = ref('');
</script>

<style scoped lang="less">
@accent: #67e8f9;

.mi-side {
  width: min(360px, 28vw);
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.mi-card {
  border: 1px solid rgba(56, 189, 248, 0.15);
  border-radius: 8px;
  background: rgba(8, 17, 36, 0.72);
  padding: 10px;
  min-height: 0;
  box-shadow: inset 0 0 18px rgba(56, 189, 248, 0.06);
}

.mi-filter-card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mi-filter-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mi-filter-head__icon {
  font-size: 14px;
  color: @accent;
}

.mi-filter-head__text {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
}

.mi-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mi-filter-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 10px;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.mi-filter-btn--active {
  background: rgba(103, 232, 249, 0.15);
  color: @accent;
  border-color: rgba(103, 232, 249, 0.35);
}

.mi-search-wrap {
  position: relative;
}

.mi-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #64748b;
  pointer-events: none;
}

.mi-search-input {
  width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 16px 8px 36px;
  font-size: 12px;
  color: #e2e8f0;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    border-color: rgba(103, 232, 249, 0.45);
  }
}

.mi-card h4 {
  margin: 0 0 8px;
  font-size: 12px;
  color: #67e8f9;
}

.mi-grow {
  flex: 1;
}

.mi-rank {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 11px;
  color: #cbd5e1;
}

.mi-rank__row {
  display: flex;
  justify-content: space-between;
}

.mi-rank__row b {
  color: #67e8f9;
}

.mi-gov {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 11px;
  color: #cbd5e1;
}

.mi-gov__top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.mi-gov__bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.mi-gov__bar i {
  display: block;
  height: 100%;
}
</style>
