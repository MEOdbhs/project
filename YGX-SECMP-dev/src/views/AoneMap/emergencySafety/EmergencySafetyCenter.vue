<template>
  <section class="es-center">
    <!-- 地图主体 -->
    <div class="es-map-wrap">
      <div ref="mapRef" class="es-leaflet" />

      <!-- 科技扫描线 -->
      <!-- <div class="es-scan" aria-hidden="true" /> -->

      <!-- 四角装饰 -->
      <i class="es-c es-c--tl" aria-hidden="true" />
      <i class="es-c es-c--tr" aria-hidden="true" />
      <i class="es-c es-c--bl" aria-hidden="true" />
      <i class="es-c es-c--br" aria-hidden="true" />

      <!-- 坐标显示 -->
      <div class="es-coords">
        <span class="es-coords-ico">◎</span>
        <span>{{ coords }}</span>
      </div>

      <!-- 顶部居中筛选条（悬浮在地图上） -->
      <div class="es-filter-bar">
        <select v-model="filterType" class="es-select">
          <option value="">全部类型</option>
          <option v-for="t in disasterTypes" :key="t" :value="t">{{ t }}</option>
        </select>
        <div class="es-filter-divider" />
        <select v-model="filterLevel" class="es-select">
          <option value="">全部等级</option>
          <option value="高">高风险</option>
          <option value="中">中风险</option>
          <option value="低">低风险</option>
        </select>
        <button class="es-btn es-btn--pri" type="button" @click="applyFilter">查 询</button>
        <button class="es-btn es-btn--ghost" type="button" @click="resetFilter">重 置</button>
      </div>

      <!-- 左上角统计 -->
      <div class="es-stats-float">
        <div v-for="s in floatStats" :key="s.label" class="es-sf">
          <span class="es-sf-v" :style="{ color: s.color }">{{ s.value }}</span>
          <span class="es-sf-l">{{ s.label }}</span>
        </div>
      </div>

      <!-- 图例 -->
      <div class="es-legend">
        <p class="es-legend-title">图 例</p>
        <div v-for="item in legendItems" :key="item.label" class="es-lg-row">
          <span class="es-lg-dot" :style="{ background: item.color, boxShadow: `0 0 6px ${item.color}` }" />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- 底部标签页 -->
    <div class="es-tabs">
      <button
        v-for="(item, idx) in tabItems"
        :key="item.key"
        type="button"
        class="es-tab"
        :class="{ 'es-tab--on': activeTab === idx }"
        @click="switchTab(idx)"
      >
        <component :is="tabIcons[idx]" class="es-tab-ico" />
        <span>{{ item.label }}</span>
      </button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  EnvironmentOutlined,
  InboxOutlined,
  NodeIndexOutlined,
  RadarChartOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import rawGeoStr from '../geoJson/index.geojson?raw';

const geoData: GeoJSON.FeatureCollection = JSON.parse(rawGeoStr);

interface HazardPoint {
  id: number;
  lat: number;
  lng: number;
  type: string;
  level: '高' | '中' | '低';
  location: string;
  population: number;
  property: string;
  unit: string;
  contact: string;
}

interface MonitorStation {
  id: number;
  lat: number;
  lng: number;
  name: string;
  status: 'online' | 'warning' | 'offline';
  sensors: number;
}

// ---- 永靖县隐患点 / 监测站：经纬度与乡镇驻地参考 OSM Nominatim（WGS-84），与县域 GeoJSON 一致 ----
const hazardPoints: HazardPoint[] = [
  { id: 1, lat: 35.93894, lng: 103.30337, type: '滑坡', level: '高', location: '刘家峡镇黄河沿岸', population: 256, property: '1200万元', unit: '县自然资源局', contact: '13800138000' },
  { id: 2, lat: 36.07348, lng: 103.28362, type: '崩塌', level: '高', location: '盐锅峡镇库区边坡', population: 189, property: '860万元', unit: '盐锅峡监测站', contact: '13900139000' },
  { id: 3, lat: 35.9604, lng: 103.26999, type: '泥石流', level: '中', location: '太极镇黄土台塬', population: 134, property: '420万元', unit: '太极镇政府', contact: '13700137000' },
  { id: 4, lat: 36.1636, lng: 103.20886, type: '滑坡', level: '中', location: '西河镇山体滑坡', population: 98, property: '230万元', unit: '西河镇政府', contact: '13600136000' },
  { id: 5, lat: 35.89076, lng: 103.20037, type: '地面塌陷', level: '低', location: '三塬镇坡面', population: 45, property: '95万元', unit: '三塬镇政府', contact: '13500135000' },
  { id: 6, lat: 36.04838, lng: 103.46266, type: '地裂缝', level: '低', location: '陈井镇黄土台地', population: 32, property: '68万元', unit: '陈井镇政府', contact: '13400134000' },
  { id: 7, lat: 35.91197, lng: 103.26986, type: '滑坡', level: '中', location: '岘塬镇黄土坡', population: 76, property: '180万元', unit: '岘塬镇政府', contact: '13300133000' },
  { id: 8, lat: 35.88155, lng: 103.03425, type: '崩塌', level: '高', location: '王台镇黄土崩塌', population: 212, property: '780万元', unit: '王台镇政府', contact: '13200132000' },
  { id: 9, lat: 36.04378, lng: 103.02426, type: '泥石流', level: '中', location: '新寺乡沟道', population: 88, property: '310万元', unit: '新寺乡政府', contact: '13100131000' },
  { id: 10, lat: 35.84394, lng: 103.07716, type: '滑坡', level: '低', location: '杨塔乡坡体', population: 29, property: '52万元', unit: '杨塔乡政府', contact: '13000130000' },
];

const monitorStations: MonitorStation[] = [
  { id: 101, lat: 35.9412, lng: 103.3065, name: '刘家峡监测站', status: 'online', sensors: 24 },
  { id: 102, lat: 36.0758, lng: 103.2865, name: '盐锅峡监测站', status: 'online', sensors: 18 },
  { id: 103, lat: 35.9578, lng: 103.2732, name: '太极镇监测站', status: 'warning', sensors: 12 },
  { id: 104, lat: 36.1608, lng: 103.2115, name: '西河镇监测站', status: 'online', sensors: 16 },
  { id: 105, lat: 35.8882, lng: 103.1975, name: '三塬镇监测站', status: 'offline', sensors: 8 },
  { id: 106, lat: 35.9145, lng: 103.2672, name: '岘塬镇监测站', status: 'online', sensors: 10 },
];

const levelColor: Record<string, string> = { 高: '#f43f5e', 中: '#f59e0b', 低: '#3b82f6' };
const levelGlow: Record<string, string> = {
  高: 'rgba(244,63,94,0.55)',
  中: 'rgba(245,158,11,0.55)',
  低: 'rgba(59,130,246,0.55)',
};
const stationStatusColor: Record<string, string> = { online: '#22d3ee', warning: '#f59e0b', offline: '#64748b' };

const floatStats = [
  { label: '隐患总数', value: '131', color: '#f8fafc' },
  { label: '高风险', value: '28', color: '#f43f5e' },
  { label: '中风险', value: '56', color: '#f59e0b' },
  { label: '低风险', value: '47', color: '#3b82f6' },
];

const legendItems = [
  { label: '高风险点位', color: '#f43f5e' },
  { label: '中风险点位', color: '#f59e0b' },
  { label: '低风险点位', color: '#3b82f6' },
  { label: '监测站点', color: '#22d3ee' },
  { label: '县域边界', color: '#22d3ee' },
];

const tabItems = [
  { key: 'hazard', label: '隐患点' },
  { key: 'station', label: '监测站' },
  { key: 'alert', label: '预警信息' },
  { key: 'threat', label: '威胁范围' },
  { key: 'resource', label: '应急资源' },
  { key: 'route', label: '路线规划' },
];
const tabIcons = [EnvironmentOutlined, RadarChartOutlined, WarningOutlined, SafetyCertificateOutlined, InboxOutlined, NodeIndexOutlined];
const disasterTypes = ['滑坡', '崩塌', '泥石流', '地面塌陷', '地裂缝'];

// ---- state ----
const mapRef = ref<HTMLDivElement | null>(null);
const filterType = ref('');
const filterLevel = ref('');
const activeTab = ref(0);
const coords = ref('东经 -- · --  北纬 -- · --');

let map: L.Map | null = null;
let geoJsonLayer: L.GeoJSON | null = null;
let hazardGroup: L.LayerGroup | null = null;
let stationGroup: L.LayerGroup | null = null;
let threatGroup: L.LayerGroup | null = null;

// ---- marker 工厂 ----
function createHazardIcon(h: HazardPoint): L.DivIcon {
  const c = levelColor[h.level];
  const g = levelGlow[h.level];
  const cls = h.level === '高' ? 'h' : h.level === '中' ? 'm' : 'l';
  /* 截取地名：超过 6 字显示省略 */
  const shortName = h.location.length > 7 ? h.location.slice(0, 7) + '…' : h.location;
  return L.divIcon({
    className: '',
    html: `<div class="lfm lfm--${cls}">
      <span class="lfm-ring" style="border-color:${c}60"></span>
      <span class="lfm-ping" style="background:${g}"></span>
      <span class="lfm-dot" style="background:${c};box-shadow:0 0 14px ${c},0 0 28px ${c}60">
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 1l1.2 2.5L9 4.1 6.9 6.2l.5 3L5 7.8l-2.4 1.4.5-3L1 4.1l2.8-.6z" fill="#fff"/></svg>
      </span>
      <div class="lfm-tag" style="border-color:${c}50;box-shadow:0 0 8px ${c}20">
        <span class="lfm-name">${shortName}</span>
        <span class="lfm-type" style="color:${c}">${h.type} · ${h.level}风险</span>
      </div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

function createStationIcon(s: MonitorStation): L.DivIcon {
  const c = stationStatusColor[s.status];
  const statusText: Record<string, string> = { online: '在线', warning: '告警', offline: '离线' };
  return L.divIcon({
    className: '',
    html: `<div class="lfs" style="border-color:${c};box-shadow:0 0 12px ${c}60,inset 0 0 8px ${c}20">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5" fill="${c}"/>
      </svg>
      <div class="lfs-tag" style="border-color:${c}50">
        <span class="lfs-name">${s.name.replace('监测站', '')}</span>
        <span class="lfs-status" style="color:${c}">◉ ${statusText[s.status]}</span>
      </div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });
}

function makeHazardPopup(h: HazardPoint): string {
  const c = levelColor[h.level];
  return `<div class="lfp">
    <div class="lfp-head">
      <span class="lfp-title">${h.location}</span>
      <span class="lfp-badge" style="background:${c}25;color:${c};border-color:${c}50">${h.level}风险</span>
    </div>
    <div class="lfp-body">
      <div class="lfp-row"><span>灾害类型</span><span class="lfp-val">${h.type}</span></div>
      <div class="lfp-row"><span>威胁人口</span><span class="lfp-val">${h.population} 人</span></div>
      <div class="lfp-row"><span>威胁财产</span><span class="lfp-val">${h.property}</span></div>
      <div class="lfp-row"><span>监测单位</span><span class="lfp-val">${h.unit}</span></div>
      <div class="lfp-row"><span>联系方式</span><span class="lfp-val lfp-link">${h.contact}</span></div>
    </div>
  </div>`;
}

function makeStationPopup(s: MonitorStation): string {
  const c = stationStatusColor[s.status];
  const statusText: Record<string, string> = { online: '在线', warning: '告警', offline: '离线' };
  return `<div class="lfp">
    <div class="lfp-head">
      <span class="lfp-title">${s.name}</span>
      <span class="lfp-badge" style="background:${c}25;color:${c};border-color:${c}50">${statusText[s.status]}</span>
    </div>
    <div class="lfp-body">
      <div class="lfp-row"><span>传感器数</span><span class="lfp-val">${s.sensors} 个</span></div>
    </div>
  </div>`;
}

// ---- 构建图层 ----
function buildGeoJson() {
  if (!map) return;

  /* 发光描边面板 */
  map.createPane('glowPane');
  const pane = map.getPane('glowPane')!;
  pane.style.zIndex = '402';
  pane.style.filter = 'drop-shadow(0 0 8px rgba(34,211,238,0.9)) drop-shadow(0 0 18px rgba(34,211,238,0.45))';

  geoJsonLayer = L.geoJSON(geoData as GeoJSON.FeatureCollection, {
    pane: 'glowPane',
    style: {
      color: '#22d3ee',
      weight: 2,
      fillColor: '#0c4a6e',
      fillOpacity: 0.12,
      opacity: 1,
    },
  }).addTo(map);

  /* 内层淡蓝填充 */
  L.geoJSON(geoData as GeoJSON.FeatureCollection, {
    style: { color: 'transparent', fillColor: '#0e7490', fillOpacity: 0.07 },
  }).addTo(map);

  if (geoJsonLayer.getBounds().isValid()) {
    /* 先居中到边界中心，再用 setZoom 设置固定缩放级别 */
    /* ↓↓ 调整这里的数字来控制缩放大小（数字越大越近） ↓↓ */
    const INITIAL_ZOOM = 10.5;
    map.setView(geoJsonLayer.getBounds().getCenter(), INITIAL_ZOOM);
  }
}

function buildHazardLayer(levelFilter = '', typeFilter = '') {
  if (!map) return;
  hazardGroup?.clearLayers();
  if (!hazardGroup) hazardGroup = L.layerGroup();

  const filtered = hazardPoints.filter(
    (h) => (!levelFilter || h.level === levelFilter) && (!typeFilter || h.type === typeFilter),
  );

  filtered.forEach((h) => {
    const marker = L.marker([h.lat, h.lng], { icon: createHazardIcon(h) });
    marker.bindPopup(makeHazardPopup(h), { className: 'lf-popup-wrap', maxWidth: 280, closeButton: true });
    hazardGroup!.addLayer(marker);
  });
}

function buildStationLayer() {
  if (!map) return;
  stationGroup?.clearLayers();
  if (!stationGroup) stationGroup = L.layerGroup();

  monitorStations.forEach((s) => {
    const marker = L.marker([s.lat, s.lng], { icon: createStationIcon(s) });
    marker.bindPopup(makeStationPopup(s), { className: 'lf-popup-wrap', maxWidth: 240, closeButton: true });
    stationGroup!.addLayer(marker);
  });
}

function buildThreatLayer() {
  if (!map) return;
  threatGroup?.clearLayers();
  if (!threatGroup) threatGroup = L.layerGroup();

  hazardPoints
    .filter((h) => h.level === '高')
    .forEach((h) => {
      L.circle([h.lat, h.lng], {
        radius: 2000,
        color: '#f43f5e',
        fillColor: '#f43f5e',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '6 4',
        opacity: 0.6,
      }).addTo(threatGroup!);
    });

  hazardPoints
    .filter((h) => h.level === '中')
    .forEach((h) => {
      L.circle([h.lat, h.lng], {
        radius: 1500,
        color: '#f59e0b',
        fillColor: '#f59e0b',
        fillOpacity: 0.06,
        weight: 1,
        dashArray: '4 4',
        opacity: 0.5,
      }).addTo(threatGroup!);
    });
}

function clearDataLayers() {
  hazardGroup?.remove();
  stationGroup?.remove();
  threatGroup?.remove();
}

function switchTab(idx: number) {
  activeTab.value = idx;
  if (!map) return;
  clearDataLayers();

  if (idx === 0) {
    hazardGroup?.addTo(map);
  } else if (idx === 1) {
    stationGroup?.addTo(map);
  } else if (idx === 3) {
    hazardGroup?.addTo(map);
    threatGroup?.addTo(map);
  } else {
    /* 其他标签暂时回退到隐患点 */
    hazardGroup?.addTo(map);
  }
}

function applyFilter() {
  buildHazardLayer(filterLevel.value, filterType.value);
  if (activeTab.value === 0) hazardGroup?.addTo(map!);
}

function resetFilter() {
  filterType.value = '';
  filterLevel.value = '';
  buildHazardLayer();
  if (activeTab.value === 0) hazardGroup?.addTo(map!);
}

onMounted(() => {
  if (!mapRef.value) return;

  map = L.map(mapRef.value, {
    center: [35.938933, 103.319871],
    zoom: 13,
    zoomControl: false,
    attributionControl: false,
  });

  /*
   * 双图层方案——简洁备注：
   *   第一层：高德卫星底图（style=6），纯影像无任何文字标注
   *   第二层：高德路网层（style=8 + scl=2），只含道路骨架与极少主要地名，去掉大量 POI
   */
  L.tileLayer(
    'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    { subdomains: '1234', maxZoom: 19, errorTileUrl: '' },
  ).addTo(map);

  L.tileLayer(
    'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&scl=2&x={x}&y={y}&z={z}',
    { subdomains: '1234', maxZoom: 19, errorTileUrl: '', opacity: 0.85 },
  ).addTo(map);

  /*
   * 暗色科技主题滤镜（作用于整个瓦片面板）：
   *   invert(1)           → 色彩翻转，浅底变深底
   *   hue-rotate(200deg)  → 偏蓝科技色调
   *   brightness(0.72)    → 整体压暗
   *   saturate(0.55)      → 降饱和，融入 HUD 风格
   *   contrast(1.08)      → 轻微提对比，保留道路轮廓
   */
  const tilePane = map.getPane('tilePane');
  if (tilePane) {
    tilePane.style.filter =
      'invert(1) hue-rotate(200deg) brightness(0.72) saturate(0.55) contrast(1.08)';
  }

  /* 缩放控件 */
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  buildGeoJson();
  buildHazardLayer();
  buildStationLayer();
  buildThreatLayer();
  hazardGroup?.addTo(map);

  /* 坐标跟踪 */
  map.on('mousemove', (e) => {
    const { lat, lng } = e.latlng;
    coords.value = `东经 ${lng.toFixed(4)}°  北纬 ${lat.toFixed(4)}°`;
  });
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});
</script>

<style scoped lang="less">
.es-center {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

/* ---- 顶部悬浮筛选条 ---- */
.es-filter-bar {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  /* Leaflet 面板 z-index 最高为 700(popupPane)，必须高于它才可见 */
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(2, 6, 23, 0.88);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(34, 211, 238, 0.28);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(34, 211, 238, 0.06);
  white-space: nowrap;
}

.es-filter-divider {
  width: 1px;
  height: 18px;
  background: rgba(51, 65, 85, 0.9);
  flex-shrink: 0;
}

.es-select {
  height: 30px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(15, 23, 42, 0.7);
  color: #94a3b8;
  font-size: 11px;
  outline: none;
  cursor: pointer;
  appearance: none;
  min-width: 90px;

  option {
    background: #0f172a;
    color: #e2e8f0;
  }
}

.es-btn {
  height: 30px;
  padding: 0 14px;
  border-radius: 6px;
  font-size: 11px;
  letter-spacing: 0.05em;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;

  &--pri {
    background: linear-gradient(135deg, #0e7490, #2563eb);
    color: #fff;
    border-color: rgba(34, 211, 238, 0.4);
    box-shadow: 0 0 10px rgba(34, 211, 238, 0.2);

    &:hover {
      box-shadow: 0 0 16px rgba(34, 211, 238, 0.4);
    }
  }

  &--ghost {
    background: transparent;
    border-color: #334155;
    color: #94a3b8;

    &:hover {
      border-color: #64748b;
      color: #cbd5e1;
    }
  }
}

/* ---- 地图主体 ---- */
.es-map-wrap {
  flex: 1;
  min-height: 0;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(34, 211, 238, 0.2);
  background: #060d1f;
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.06), inset 0 0 60px rgba(0, 0, 0, 0.4);
}

.es-leaflet {
  position: absolute;
  inset: 0;
}

/* ---- 科技扫描线 ---- */
// .es-scan {
//   position: absolute;
//   left: 0;
//   right: 0;
//   height: 2px;
//   background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.6), transparent);
//   animation: scan 4s linear infinite;
//   z-index: 800;
//   pointer-events: none;
// }

@keyframes scan {
  0% { top: 0%; opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* ---- 四角装饰 ---- */
.es-c {
  position: absolute;
  width: 18px;
  height: 18px;
  z-index: 800;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: #22d3ee;
    box-shadow: 0 0 6px #22d3ee;
  }

  &::before { width: 2px; height: 100%; }
  &::after { width: 100%; height: 2px; }

  &--tl { top: 8px; left: 8px; &::before { top: 0; left: 0; } &::after { top: 0; left: 0; } }
  &--tr { top: 8px; right: 8px; &::before { top: 0; right: 0; } &::after { top: 0; right: 0; } }
  &--bl { bottom: 8px; left: 8px; &::before { bottom: 0; left: 0; } &::after { bottom: 0; left: 0; } }
  &--br { bottom: 8px; right: 8px; &::before { bottom: 0; right: 0; } &::after { bottom: 0; right: 0; } }
}

/* ---- 坐标显示 ---- */
.es-coords {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 800;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-family: ui-monospace, monospace;
  color: rgba(34, 211, 238, 0.7);
  background: rgba(2, 6, 23, 0.7);
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid rgba(34, 211, 238, 0.15);
  backdrop-filter: blur(4px);
  letter-spacing: 0.04em;
}

.es-coords-ico {
  font-size: 9px;
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ---- 统计悬浮 ---- */
.es-stats-float {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 800;
  display: flex;
  gap: 6px;
  pointer-events: none;
}

.es-sf {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7px 11px;
  background: rgba(2, 6, 23, 0.82);
  border: 1px solid rgba(51, 65, 85, 0.7);
  border-radius: 7px;
  backdrop-filter: blur(8px);
  min-width: 56px;
}

.es-sf-v {
  font-size: 18px;
  font-weight: 700;
  font-family: ui-monospace, monospace;
  line-height: 1.1;
}

.es-sf-l {
  font-size: 9px;
  color: #64748b;
  margin-top: 2px;
  white-space: nowrap;
}

/* ---- 图例 ---- */
.es-legend {
  position: absolute;
  bottom: 36px;
  right: 14px;
  z-index: 800;
  padding: 10px 12px;
  background: rgba(2, 6, 23, 0.85);
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(8px);
  pointer-events: none;
}

.es-legend-title {
  font-size: 9px;
  color: rgba(34, 211, 238, 0.7);
  letter-spacing: 0.12em;
  margin: 0 0 8px;
}

.es-lg-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  color: #94a3b8;
  margin-bottom: 5px;

  &:last-child { margin-bottom: 0; }
}

.es-lg-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ---- 底部标签 ---- */
.es-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 0 4px;
  flex-shrink: 0;
}

.es-tab {
  flex: 1;
  min-width: 68px;
  max-width: 120px;
  height: 38px;
  border-radius: 7px;
  border: 1px solid rgba(51, 65, 85, 0.8);
  background: rgba(15, 23, 42, 0.6);
  color: #64748b;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 10px;
  transition: all 0.2s;

  &:hover {
    background: rgba(14, 116, 144, 0.15);
    border-color: rgba(34, 211, 238, 0.35);
    color: #94a3b8;
  }

  &--on {
    background: rgba(14, 116, 144, 0.2);
    border-color: rgba(34, 211, 238, 0.6);
    color: #22d3ee;
    box-shadow: 0 0 10px rgba(34, 211, 238, 0.15);
  }
}

.es-tab-ico {
  font-size: 13px;
}
</style>

<!-- Leaflet DOM 节点不在 scoped 范围内，需要全局覆盖 -->
<style lang="less">
/* ---- 隐患点标记 ---- */
.lfm {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lfm-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid;
  animation: lfm-ring 2.4s ease-out infinite;
  opacity: 0;
}

.lfm-ping {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  animation: lfm-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.lfm-dot {
  position: relative;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.5);
  z-index: 2;
}

/* 高风险额外脉冲动画加快 */
.lfm--h .lfm-ping { animation-duration: 1.2s; }
.lfm--m .lfm-ping { animation-duration: 1.8s; }
.lfm--l .lfm-ping { animation-duration: 2.8s; }

@keyframes lfm-ping {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
}

@keyframes lfm-ring {
  0% { transform: scale(0.6); opacity: 0.8; }
  100% { transform: scale(2.6); opacity: 0; }
}

/* ---- 隐患点 文字标注 ---- */
.lfm-tag {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: rgba(2, 6, 23, 0.88);
  border: 1px solid;
  border-radius: 5px;
  padding: 2px 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  pointer-events: none;
  backdrop-filter: blur(6px);
}

.lfm-name {
  font-size: 10px;
  color: #e2e8f0;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.lfm-type {
  font-size: 9px;
  font-weight: 500;
}

/* ---- 监测站点标记 ---- */
.lfs {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid;
  background: rgba(2, 6, 23, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  position: relative;
}

.lfs-tag {
  position: absolute;
  top: 26px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: rgba(2, 6, 23, 0.88);
  border: 1px solid;
  border-radius: 5px;
  padding: 2px 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  pointer-events: none;
  backdrop-filter: blur(6px);
}

.lfs-name {
  font-size: 10px;
  color: #e2e8f0;
  font-weight: 600;
}

.lfs-status {
  font-size: 9px;
  font-weight: 500;
}

/* ---- Popup 容器 ---- */
.lf-popup-wrap {
  .leaflet-popup-content-wrapper {
    background: rgba(2, 6, 23, 0.95) !important;
    border: 1px solid rgba(34, 211, 238, 0.3) !important;
    border-radius: 10px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(34, 211, 238, 0.1) !important;
    padding: 0 !important;
    backdrop-filter: blur(12px);
  }

  .leaflet-popup-content {
    margin: 0 !important;
    width: auto !important;
  }

  .leaflet-popup-tip-container {
    display: none;
  }

  .leaflet-popup-close-button {
    color: #64748b !important;
    font-size: 14px !important;
    top: 7px !important;
    right: 8px !important;

    &:hover {
      color: #22d3ee !important;
    }
  }
}

/* ---- Popup 内容 ---- */
.lfp {
  min-width: 230px;
}

.lfp-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 32px 10px 14px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.15);
  background: rgba(14, 116, 144, 0.12);
  border-radius: 10px 10px 0 0;
}

.lfp-title {
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: 0.03em;
}

.lfp-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid;
  font-weight: 600;
  flex-shrink: 0;
  margin-left: 8px;
}

.lfp-body {
  padding: 10px 14px 12px;
}

.lfp-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 11px;

  &:last-child { margin-bottom: 0; }

  > span:first-child {
    color: #64748b;
    flex-shrink: 0;
  }
}

.lfp-val {
  color: #e2e8f0;
  font-weight: 500;
  text-align: right;
}

.lfp-link {
  color: #60a5fa;
}

/* ---- Leaflet 缩放控件覆盖 ---- */
.leaflet-control-zoom {
  border: 1px solid rgba(34, 211, 238, 0.25) !important;
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5) !important;
}

.leaflet-control-zoom a {
  background: rgba(2, 6, 23, 0.9) !important;
  color: #94a3b8 !important;
  border-bottom-color: rgba(34, 211, 238, 0.2) !important;
  transition: all 0.2s;

  &:hover {
    background: rgba(14, 116, 144, 0.3) !important;
    color: #22d3ee !important;
  }
}
</style>
