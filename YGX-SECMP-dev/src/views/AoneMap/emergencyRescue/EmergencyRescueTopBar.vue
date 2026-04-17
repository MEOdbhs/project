<template>
  <header class="er-top">
    

    <div class="er-top__filters glass">
      <div class="er-filters-left">
        <span class="er-label">层级：</span>
        <button
          type="button"
          class="er-level-btn"
          :class="{ active: level === 'county' }"
          @click="emit('switchLevel', 'county')"
        >
          县级
        </button>
        <button
          type="button"
          class="er-level-btn"
          :class="{ active: level === 'town' }"
          @click="onTownLevel"
        >
          镇/乡级
        </button>
        <button
          type="button"
          class="er-level-btn"
          :class="{ active: level === 'resource' }"
          @click="onResourceLevel"
        >
          资源点位
        </button>
        <span class="er-vsep" />
        <select v-model="areaModel" class="er-select">
          <option value="all">全部区域</option>
          <option v-for="a in areaNames" :key="a" :value="a">{{ a }}</option>
        </select>
        <select v-model="typeModel" class="er-select">
          <option value="all">全部类型</option>
          <option value="救援队伍">救援队伍</option>
          <option value="物资仓库">物资仓库</option>
          <option value="医疗站点">医疗站点</option>
          <option value="应急通道">应急通道</option>
        </select>
        <select v-model="statusModel" class="er-select">
          <option value="all">全部状态</option>
          <option value="可用">可用</option>
          <option value="占用">占用</option>
          <option value="离线">离线</option>
        </select>
      </div>
      <div class="er-search">
        <input
          v-model="keywordModel"
          type="text"
          class="er-search-input"
          placeholder="搜索资源名称..."
          @input="onKeywordInput"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
        />
        <SearchOutlined class="er-search-ico" />
        <div v-show="dropdownOpen && searchResults.length" class="er-search-drop glass">
          <div
            v-for="r in searchResults"
            :key="r.name"
            class="er-search-item"
            @mousedown.prevent="pickResource(r)"
          >
            <div class="er-search-item__name">{{ r.name }}</div>
            <div class="er-search-item__meta">{{ r.town }} | {{ r.type }} | {{ r.status }}</div>
          </div>
        </div>
        <div v-show="dropdownOpen && keywordModel.trim() && !searchResults.length" class="er-search-drop glass">
          <div class="er-search-empty">未找到相关资源</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import type { MapLevel, ResourceRecord } from './mockData';
import { resourceData } from './mockData';

const props = defineProps<{
  level: MapLevel;
  townName: string | null;
  resourceName: string | null;
  areaFilter: string;
  typeFilter: string;
  statusFilter: string;
}>();

const emit = defineEmits<{
  breadcrumbCounty: [];
  breadcrumbTown: [];
  switchLevel: [level: MapLevel];
  selectResource: [name: string, town: string];
  'update:areaFilter': [v: string];
  'update:typeFilter': [v: string];
  'update:statusFilter': [v: string];
}>();

const { createMessage } = useMessage();

const areaModel = computed({
  get: () => props.areaFilter,
  set: (v: string) => emit('update:areaFilter', v),
});
const typeModel = computed({
  get: () => props.typeFilter,
  set: (v: string) => emit('update:typeFilter', v),
});
const statusModel = computed({
  get: () => props.statusFilter,
  set: (v: string) => emit('update:statusFilter', v),
});

const areaNames = [
  '刘家峡镇',
  '盐锅峡镇',
  '太极镇',
  '岘塬镇',
  '三塬镇',
  '王台镇',
  '红泉镇',
  '川城镇',
  '新寺乡',
  '小岭乡',
];

const keywordModel = ref('');
const dropdownOpen = ref(false);
const searchResults = ref<ResourceRecord[]>([]);

function onKeywordInput() {
  const k = keywordModel.value.trim().toLowerCase();
  if (!k) {
    searchResults.value = [];
    dropdownOpen.value = false;
    return;
  }
  searchResults.value = resourceData.filter((r) => r.name.toLowerCase().includes(k));
  dropdownOpen.value = true;
}

function onSearchFocus() {
  if (keywordModel.value.trim()) dropdownOpen.value = true;
}

function onSearchBlur() {
  setTimeout(() => {
    dropdownOpen.value = false;
  }, 200);
}

function pickResource(r: ResourceRecord) {
  keywordModel.value = r.name;
  dropdownOpen.value = false;
  emit('selectResource', r.name, r.town);
}

function onTownLevel() {
  if (!props.townName) {
    createMessage.warning('请先选择一个镇/乡');
    return;
  }
  emit('switchLevel', 'town');
}

function onResourceLevel() {
  if (!props.resourceName) {
    createMessage.warning('请先选择一个资源点位');
    return;
  }
  emit('switchLevel', 'resource');
}

watch(
  () => props.resourceName,
  (n) => {
    if (n) keywordModel.value = n;
  },
);

</script>

<style scoped lang="less">
@glass-bg: linear-gradient(135deg, rgba(13, 31, 60, 0.8) 0%, rgba(10, 22, 40, 0.9) 100%);
@border: rgba(64, 196, 255, 0.15);

.er-top {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 4px;
}

.glass {
  background: @glass-bg;
  border: 1px solid @border;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.er-top__bar {
  padding: 12px 20px;
}

.er-top__crumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 13px;
}

.er-crumb {
  cursor: pointer;
  color: rgba(148, 163, 184, 0.8);
  transition: color 0.2s;

  &:hover {
    color: #60a5fa;
  }
}

.er-crumb--end {
  cursor: default;
  color: #fbbf24;

  &:hover {
    color: #fbbf24;
  }
}

.er-crumb-sep {
  color: #475569;
}

.er-top__filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 12px 20px;
}

.er-filters-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.er-label {
  font-size: 13px;
  color: #94a3b8;
}

.er-level-btn {
  position: relative;
  overflow: hidden;
  padding: 6px 16px;
  border: 1px solid rgba(59, 130, 246, 0.4);
  border-radius: 8px;
  font-size: 13px;
  color: #bfdbfe;
  background: rgba(30, 58, 138, 0.25);
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;

  &:hover {
    border-color: rgba(59, 130, 246, 0.6);
  }

  &.active {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.3) 100%);
    border-color: #3b82f6;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
}

.er-vsep {
  width: 1px;
  height: 22px;
  background: rgba(59, 130, 246, 0.2);
  margin: 0 4px;
}

.er-select {
  background: rgba(30, 58, 138, 0.4);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
  color: #cbd5e1;
  outline: none;

  &:focus {
    border-color: #60a5fa;
  }
}

.er-search {
  position: relative;
  width: 256px;
  flex-shrink: 0;
}

.er-search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 36px 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(30, 58, 138, 0.4);
  font-size: 13px;
  color: #e2e8f0;
  outline: none;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    border-color: #60a5fa;
  }
}

.er-search-ico {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #64748b;
  pointer-events: none;
}

.er-search-drop {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  max-height: 280px;
  overflow-y: auto;
  z-index: 50;
  padding: 6px;
}

.er-search-item {
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: rgba(30, 64, 175, 0.4);
  }
}

.er-search-item__name {
  font-size: 13px;
  color: #e2e8f0;
}

.er-search-item__meta {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.er-search-empty {
  padding: 8px;
  font-size: 13px;
  color: #94a3b8;
}
</style>
