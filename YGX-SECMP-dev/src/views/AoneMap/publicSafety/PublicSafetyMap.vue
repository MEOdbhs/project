<template>
  <section class="ps-map">
    <div ref="mapRef" class="ps-map__leaflet" />

    <div class="ps-map__tabs">
      <button
        v-for="(name, i) in levels"
        :key="name"
        type="button"
        :class="{ on: currentLevel === i }"
        @click="currentLevel = i"
      >
        {{ name }}
      </button>
    </div>

    <div class="ps-map__info">
      当前：<b>{{ selectedLabel || '全县总览' }}</b>
    </div>

    <div class="ps-map__overview">
      <div class="ps-map__ov-title">永靖县 · 公共安全</div>
      <div class="ps-map__ov-row"><span>视联网点位</span><b>1,281 路</b></div>
      <div class="ps-map__ov-row"><span>乡镇综治单元</span><b>17 个</b></div>
      <div class="ps-map__ov-row"><span>一键报警柱</span><b>186 处</b></div>
    </div>

    <div class="ps-map__coord">
      <span>{{ coordsText }}</span>
    </div>

    <div class="ps-map__legend">
      <span><i class="r" />重点关切</span>
      <span><i class="o" />关注</span>
      <span><i class="b" />一般</span>
      <span><i class="g" />正常</span>
    </div>

    <div class="ps-map__foot">
      <span>展示点位：<b>{{ statCount }}</b></span>
      <span>关注级以上：<b>{{ statAlert }}</b></span>
    </div>
  </section>
</template>

<script lang="ts" setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import rawGeoStr from '../geoJson/index.geojson?raw';
import type { PublicSafetyMapPoint } from './mockData';
import { publicSafetyMapPoints } from './mockData';

const geoData: GeoJSON.FeatureCollection = JSON.parse(rawGeoStr);

const levels = ['全县总览', '镇/乡下钻', '重点区域', '监控点位'];

const mapRef = ref<HTMLDivElement | null>(null);
const coordsText = ref('东经 --  北纬 --');
const currentLevel = ref(0);
const selectedLabel = ref('');

let map: L.Map | null = null;
let geoJsonLayer: L.GeoJSON | null = null;
let markerLayer: L.LayerGroup | null = null;

const levelStroke: Record<PublicSafetyMapPoint['level'], string> = {
  red: '#ef4444',
  orange: '#f97316',
  blue: '#38bdf8',
  green: '#22c55e',
};

const filteredPoints = computed(() =>
  publicSafetyMapPoints.filter((p) => isPointVisible(p, currentLevel.value)),
);

const statCount = computed(() => filteredPoints.value.length);
const statAlert = computed(() =>
  filteredPoints.value.filter((p) => p.level === 'red' || p.level === 'orange').length,
);

function isPointVisible(p: PublicSafetyMapPoint, tab: number) {
  if (tab === 0) return true;
  if (tab === 1) return p.township !== '刘家峡镇';
  if (tab === 2) return p.level === 'red' || p.level === 'orange';
  if (tab === 3) return true;
  return true;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function levelLabel(lv: PublicSafetyMapPoint['level']) {
  if (lv === 'red') return '重点关切';
  if (lv === 'orange') return '关注';
  if (lv === 'blue') return '一般';
  return '正常';
}

function popupHtml(p: PublicSafetyMapPoint) {
  const s = p.summary;
  return `<div class="ps-pop">
    <div class="ps-pop__head">
      <div class="ps-pop__title">${escapeHtml(p.placeName)}</div>
      <div class="ps-pop__sub">${escapeHtml(p.township)}</div>
      <div class="ps-pop__badge" style="border-color:${levelStroke[p.level]}33;color:${levelStroke[p.level]}">${levelLabel(p.level)}</div>
    </div>
    <div class="ps-pop__grid">
      <div class="ps-pop__cell"><span>摄像机</span><em>${s.cameras} 路在线</em></div>
      <div class="ps-pop__cell"><span>人流态势</span><em>${escapeHtml(s.crowdLevel)}</em></div>
      <div class="ps-pop__cell ps-pop__cell--wide"><span>AI 研判</span><em>${escapeHtml(s.aiStatus)}</em></div>
      <div class="ps-pop__cell"><span>最近巡查</span><em>${escapeHtml(s.lastPatrol)}</em></div>
      <div class="ps-pop__cell ps-pop__cell--wide"><span>责任单位</span><em>${escapeHtml(s.dutyOrg)}</em></div>
    </div>
  </div>`;
}

function mapPointCaption(p: PublicSafetyMapPoint): string {
  if (p.placeName.includes(p.township)) return p.placeName;
  return `${p.township}${p.placeName}`;
}

/** 监控摄像机图标（Material 风格），随 currentColor 着色 */
const PS_MONITOR_SVG = `<svg class="ps-marker__svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
</svg>`;

function createPsIcon(p: PublicSafetyMapPoint): L.DivIcon {
  const c = levelStroke[p.level];
  const cap = escapeHtml(mapPointCaption(p));
  return L.divIcon({
    className: 'ps-marker-wrap',
    html: `<div class="ps-marker-stack">
      <div class="ps-marker" style="border-color:${c};box-shadow:0 0 12px ${c}44;color:${c}">${PS_MONITOR_SVG}</div>
      <div class="ps-marker__cap">${cap}</div>
    </div>`,
    iconSize: [200, 76],
    iconAnchor: [100, 18],
  });
}

function buildGeoJson() {
  if (!map) return;

  map.createPane('psGlowPane');
  const pane = map.getPane('psGlowPane')!;
  pane.style.zIndex = '402';
  pane.style.filter =
    'drop-shadow(0 0 10px rgba(99,102,241,0.75)) drop-shadow(0 0 22px rgba(59,130,246,0.28))';

  geoJsonLayer = L.geoJSON(geoData, {
    pane: 'psGlowPane',
    style: {
      color: '#818cf8',
      weight: 2,
      fillColor: '#312e81',
      fillOpacity: 0.14,
      opacity: 1,
    },
  }).addTo(map);

  L.geoJSON(geoData, {
    style: { color: 'transparent', fillColor: '#1e3a8a', fillOpacity: 0.06 },
  }).addTo(map);

  if (geoJsonLayer.getBounds().isValid()) {
    map.setView(geoJsonLayer.getBounds().getCenter(), 10);
  }
}

function buildMarkers() {
  if (!map) return;
  markerLayer?.clearLayers();
  if (!markerLayer) markerLayer = L.layerGroup();

  filteredPoints.value.forEach((p) => {
    const m = L.marker([p.lat, p.lng], { icon: createPsIcon(p) });
    m.bindPopup(popupHtml(p), { className: 'ps-leaflet-popup', maxWidth: 340, closeButton: true });
    m.on('click', () => {
      selectedLabel.value = mapPointCaption(p);
    });
    markerLayer!.addLayer(m);
  });
  markerLayer.addTo(map);
}

function initMap() {
  if (!mapRef.value) return;

  map = L.map(mapRef.value, {
    center: [35.938933, 103.319871],
    zoom: 11,
    zoomControl: false,
    attributionControl: false,
  });

  L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
    subdomains: '1234',
    maxZoom: 19,
    errorTileUrl: '',
  }).addTo(map);

  L.tileLayer(
    'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&scl=2&x={x}&y={y}&z={z}',
    { subdomains: '1234', maxZoom: 19, errorTileUrl: '', opacity: 0.85 },
  ).addTo(map);

  const tilePane = map.getPane('tilePane');
  if (tilePane) {
    /* 沉稳靛蓝：指挥调度 / 平安城市，与应急页同系但更偏蓝紫信任感 */
    tilePane.style.filter =
      'invert(1) hue-rotate(218deg) brightness(0.72) saturate(0.5) contrast(1.08)';
  }

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  buildGeoJson();
  buildMarkers();

  map.on('mousemove', (e) => {
    const { lat, lng } = e.latlng;
    coordsText.value = `东经 ${lng.toFixed(4)}°  北纬 ${lat.toFixed(4)}°`;
  });

  map.on('popupclose', () => {
    selectedLabel.value = '';
  });
}

onMounted(() => {
  initMap();
});

watch(currentLevel, () => {
  selectedLabel.value = '';
  buildMarkers();
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
  geoJsonLayer = null;
  markerLayer = null;
});
</script>

<style lang="less" scoped>
.ps-map {
  position: relative;
  flex: 1;
  min-height: 0;
  min-width: 0;
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.28);
  background: #0a0e1a;
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.06), inset 0 0 40px rgba(30, 27, 75, 0.35);
  overflow: hidden;
}

.ps-map__leaflet {
  position: absolute;
  inset: 0;
}

.ps-map__tabs {
  position: absolute;
  left: 12px;
  top: 12px;
  z-index: 800;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: min(92%, 520px);
}

.ps-map__tabs button {
  border: 1px solid rgba(129, 140, 248, 0.35);
  background: rgba(15, 23, 42, 0.88);
  color: #94a3b8;
  font-size: 10px;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: border-color 0.2s, color 0.2s, background 0.2s;

  &:hover {
    border-color: rgba(165, 180, 252, 0.5);
    color: #cbd5e1;
  }

  &.on {
    background: rgba(99, 102, 241, 0.22);
    border-color: rgba(129, 140, 248, 0.55);
    color: #c7d2fe;
  }
}

.ps-map__info {
  position: absolute;
  top: 52px;
  left: 12px;
  z-index: 800;
  font-size: 12px;
  color: #a5b4fc;
  padding: 8px 14px;
  border: 1px solid rgba(129, 140, 248, 0.35);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(8px);
  pointer-events: none;
  max-width: min(88%, 420px);
  line-height: 1.35;

  b {
    color: #e0e7ff;
    font-weight: 700;
  }
}

.ps-map__overview {
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 800;
  width: 176px;
  border-radius: 10px;
  border: 1px solid rgba(129, 140, 248, 0.28);
  background: rgba(15, 23, 42, 0.88);
  padding: 10px 12px;
  font-size: 11px;
  backdrop-filter: blur(8px);
  pointer-events: none;
}

.ps-map__ov-title {
  color: #a5b4fc;
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 12px;
}

.ps-map__ov-row {
  display: flex;
  justify-content: space-between;
  color: #64748b;
  margin-top: 5px;

  b {
    color: #e0e7ff;
    font-weight: 600;
  }
}

.ps-map__coord {
  position: absolute;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 800;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(129, 140, 248, 0.25);
  background: rgba(15, 23, 42, 0.88);
  font-size: 10px;
  color: rgba(199, 210, 254, 0.9);
  font-family: ui-monospace, monospace;
  pointer-events: none;
}

.ps-map__legend {
  position: absolute;
  left: 12px;
  bottom: 14px;
  z-index: 800;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 10px;
  color: #94a3b8;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(129, 140, 248, 0.22);
  border-radius: 8px;
  padding: 8px 10px;
  pointer-events: none;
}

.ps-map__legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.ps-map__legend i {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
}
.ps-map__legend .r {
  background: #ef4444;
}
.ps-map__legend .o {
  background: #f97316;
}
.ps-map__legend .b {
  background: #38bdf8;
}
.ps-map__legend .g {
  background: #22c55e;
}

.ps-map__foot {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  z-index: 800;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 11px;
  color: #94a3b8;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(129, 140, 248, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  backdrop-filter: blur(8px);
  pointer-events: none;

  b {
    color: #c7d2fe;
    font-weight: 600;
  }
}
</style>

<style lang="less">
.ps-marker-wrap {
  background: transparent !important;
  border: none !important;
}

.ps-marker-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: max-content;
  max-width: 200px;
}

.ps-marker {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 2px solid;
  background: rgba(15, 23, 42, 0.92);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ps-marker__svg {
  width: 17px;
  height: 17px;
  display: block;
  opacity: 0.98;
  filter: drop-shadow(0 0 6px currentColor);
}

.ps-marker__cap {
  font-size: 10px;
  font-weight: 600;
  line-height: 1.35;
  text-align: center;
  color: #e0e7ff;
  max-width: 196px;
  word-break: break-word;
  text-shadow:
    0 0 10px rgba(15, 23, 42, 0.95),
    0 1px 3px rgba(0, 0, 0, 0.9);
}

.ps-leaflet-popup {
  .leaflet-popup-content-wrapper {
    background: rgba(15, 23, 42, 0.96) !important;
    border: 1px solid rgba(129, 140, 248, 0.4) !important;
    border-radius: 10px !important;
    padding: 0 !important;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(79, 70, 229, 0.12) !important;
  }

  .leaflet-popup-content {
    margin: 0 !important;
    min-width: 280px;
  }

  .leaflet-popup-tip-container {
    display: none;
  }

  .leaflet-popup-close-button {
    color: #64748b !important;
    top: 8px !important;
    right: 8px !important;

    &:hover {
      color: #a5b4fc !important;
    }
  }
}

.ps-pop {
  padding: 12px 14px 14px;
}

.ps-pop__head {
  position: relative;
  margin-bottom: 10px;
  padding-right: 22px;
}

.ps-pop__title {
  font-size: 14px;
  font-weight: 800;
  color: #e0e7ff;
  line-height: 1.35;
}

.ps-pop__sub {
  margin-top: 4px;
  font-size: 11px;
  color: #818cf8;
}

.ps-pop__badge {
  margin-top: 8px;
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid;
  background: rgba(15, 23, 42, 0.6);
}

.ps-pop__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
}

.ps-pop__cell {
  font-size: 10px;
  color: #94a3b8;

  span {
    display: block;
    color: #64748b;
    margin-bottom: 2px;
  }

  em {
    font-style: normal;
    color: #e2e8f0;
    font-weight: 600;
    line-height: 1.35;
  }

  &--wide {
    grid-column: 1 / -1;
  }
}

.leaflet-control-zoom {
  border: 1px solid rgba(129, 140, 248, 0.35) !important;
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45) !important;
}

.leaflet-control-zoom a {
  background: rgba(15, 23, 42, 0.92) !important;
  color: #94a3b8 !important;
  border-bottom-color: rgba(129, 140, 248, 0.22) !important;

  &:hover {
    background: rgba(67, 56, 202, 0.35) !important;
    color: #e0e7ff !important;
  }
}
</style>
