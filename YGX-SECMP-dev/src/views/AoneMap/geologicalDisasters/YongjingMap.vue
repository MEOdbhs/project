<template>
  <div class="yj-map">
    <div ref="mapRef" class="yj-map__leaflet" />

    <i class="yj-c yj-c--tl" aria-hidden="true" />
    <i class="yj-c yj-c--tr" aria-hidden="true" />
    <i class="yj-c yj-c--bl" aria-hidden="true" />
    <i class="yj-c yj-c--br" aria-hidden="true" />

    <div class="yj-coords">
      <span class="yj-coords-ico">◎</span>
      <span>{{ coords }}</span>
    </div>

    <div class="yj-map__legend">
      <p class="yj-map__legend-title">预警等级</p>
      <div v-for="row in legendRows" :key="row.key" class="yj-map__legend-row">
        <span class="dot" :class="row.dotClass" />
        {{ row.label }} ({{ row.count }})
      </div>
    </div>

    <div class="yj-map__stats">
      <p class="yj-map__stats-title">永靖县概况</p>
      <p>面积: 1,863.6 km²</p>
      <p>乡镇: 17个</p>
      <p>监测点: {{ disasterPoints.length }}处</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import rawGeoStr from '../geoJson/index.geojson?raw';

const geoData: GeoJSON.FeatureCollection = JSON.parse(rawGeoStr);

export interface DisasterPoint {
  name: string;
  coordinates: [number, number];
  type: string;
  level: 'red' | 'orange' | 'yellow' | 'blue';
  details: string;
}

/** 乡镇驻地经纬度参考 OpenStreetMap Nominatim（WGS-84），与高德瓦片存在少量偏移属正常现象 */
const disasterPoints: DisasterPoint[] = [
  { name: '刘家峡镇', coordinates: [103.30337, 35.93894], type: '滑坡', level: 'red', details: '黄河沿岸滑坡风险' },
  { name: '盐锅峡镇', coordinates: [103.28362, 36.07348], type: '滑坡', level: 'orange', details: '库区边坡不稳定' },
  { name: '西河镇', coordinates: [103.20886, 36.1636], type: '泥石流', level: 'yellow', details: '沟道泥石流隐患' },
  { name: '太极镇', coordinates: [103.26999, 35.9604], type: '滑坡', level: 'orange', details: '黄土滑坡风险' },
  { name: '三塬镇', coordinates: [103.20037, 35.89076], type: '崩塌', level: 'yellow', details: '黄土崩塌隐患' },
  { name: '岘塬镇', coordinates: [103.26986, 35.91197], type: '滑坡', level: 'blue', details: '小型滑坡风险' },
  { name: '陈井镇', coordinates: [103.46266, 36.04838], type: '泥石流', level: 'yellow', details: '山洪泥石流隐患' },
  { name: '杨塔乡', coordinates: [103.07716, 35.84394], type: '滑坡', level: 'blue', details: '黄土边坡不稳定' },
  { name: '王台镇', coordinates: [103.03425, 35.88155], type: '崩塌', level: 'orange', details: '高陡边坡崩塌' },
  { name: '红泉镇', coordinates: [103.05931, 35.91367], type: '滑坡', level: 'blue', details: '农田滑坡风险' },
  { name: '关山乡', coordinates: [103.58563, 36.00369], type: '泥石流', level: 'yellow', details: '沟道泥石流' },
  { name: '新寺乡', coordinates: [103.02426, 36.04378], type: '滑坡', level: 'blue', details: '村庄滑坡隐患' },
];

const levelColors: Record<DisasterPoint['level'], string> = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  blue: '#3b82f6',
};

const levelLabels: Record<DisasterPoint['level'], string> = {
  red: '红色预警',
  orange: '橙色预警',
  yellow: '黄色预警',
  blue: '蓝色预警',
};

const mapRef = ref<HTMLDivElement | null>(null);
const coords = ref('东经 -- · --  北纬 -- · --');
const hoveredPointName = ref<string | null>(null);
const selectedPoint = ref<DisasterPoint | null>(null);

const legendRows = computed(() => {
  const keys: DisasterPoint['level'][] = ['red', 'orange', 'yellow', 'blue'];
  const dotClass: Record<DisasterPoint['level'], string> = {
    red: 'dot-red',
    orange: 'dot-orange',
    yellow: 'dot-yellow',
    blue: 'dot-blue',
  };
  return keys.map((key) => ({
    key,
    label: levelLabels[key],
    count: disasterPoints.filter((p) => p.level === key).length,
    dotClass: dotClass[key],
  }));
});

let map: L.Map | null = null;
let geoJsonLayer: L.GeoJSON | null = null;
let markerGroup: L.LayerGroup | null = null;
const markerByName = new Map<string, L.Marker>();

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function createYjPointIcon(p: DisasterPoint): L.DivIcon {
  const c = levelColors[p.level];
  return L.divIcon({
    className: 'yj-marker-wrap',
    html: `<div class="yj-marker-root" data-yj-name="${escapeHtml(p.name)}">
      <div class="yj-marker__stack">
        <div class="yj-marker__ping" style="background:${c}"></div>
        <div class="yj-marker__ring" style="border-color:${c};background:${c}"></div>
        <div class="yj-marker__core" style="background:${c}"></div>
      </div>
      <div class="yj-marker__card" style="border-color:${c}">
        <div class="yj-marker__title">${escapeHtml(p.name)}</div>
        <div class="yj-marker__sub" style="color:${c}">${escapeHtml(levelLabels[p.level])} · ${escapeHtml(p.type)}</div>
        <div class="yj-marker__detail">${escapeHtml(p.details)}</div>
      </div>
    </div>`,
    iconSize: [140, 120],
    iconAnchor: [70, 88],
  });
}

function syncMarkerActiveStates() {
  for (const p of disasterPoints) {
    const m = markerByName.get(p.name);
    const el = m?.getElement()?.querySelector('.yj-marker-root');
    if (!el) continue;
    const active =
      hoveredPointName.value === p.name || selectedPoint.value?.name === p.name;
    el.classList.toggle('yj-marker-root--active', active);
  }
}

function buildGeoJson() {
  if (!map) return;

  map.createPane('glowPane');
  const pane = map.getPane('glowPane')!;
  pane.style.zIndex = '402';
  pane.style.filter =
    'drop-shadow(0 0 8px rgba(244,114,182,0.95)) drop-shadow(0 0 18px rgba(219,39,119,0.5))';

  geoJsonLayer = L.geoJSON(geoData, {
    pane: 'glowPane',
    style: {
      color: '#f472b6',
      weight: 2,
      fillColor: '#831843',
      fillOpacity: 0.14,
      opacity: 1,
    },
  }).addTo(map);

  L.geoJSON(geoData, {
    style: { color: 'transparent', fillColor: '#be185d', fillOpacity: 0.08 },
  }).addTo(map);

  if (geoJsonLayer.getBounds().isValid()) {
    const INITIAL_ZOOM = 9.5;
    map.setView(geoJsonLayer.getBounds().getCenter(), INITIAL_ZOOM);
  }
}

function buildMarkerLayer() {
  if (!map) return;
  markerGroup?.clearLayers();
  markerByName.clear();
  if (!markerGroup) markerGroup = L.layerGroup();

  disasterPoints.forEach((p) => {
    const [lng, lat] = p.coordinates;
    const marker = L.marker([lat, lng], {
      icon: createYjPointIcon(p),
      bubblingMouseEvents: false,
    });
    markerByName.set(p.name, marker);

    marker.on('mouseover', () => {
      hoveredPointName.value = p.name;
      syncMarkerActiveStates();
    });
    marker.on('mouseout', () => {
      hoveredPointName.value = null;
      syncMarkerActiveStates();
    });
    marker.on('click', (ev) => {
      L.DomEvent.stopPropagation(ev);
      selectedPoint.value = selectedPoint.value?.name === p.name ? null : p;
      syncMarkerActiveStates();
    });

    markerGroup!.addLayer(marker);
  });
  markerGroup.addTo(map);
  syncMarkerActiveStates();
}

onMounted(() => {
  if (!mapRef.value) return;

  map = L.map(mapRef.value, {
    center: [35.938933, 103.319871],
    zoom: 13,
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
    tilePane.style.filter =
      'invert(1) hue-rotate(305deg) brightness(0.74) saturate(0.52) contrast(1.08)';
  }

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  buildGeoJson();
  buildMarkerLayer();

  map.on('mousemove', (e) => {
    const { lat, lng } = e.latlng;
    coords.value = `东经 ${lng.toFixed(4)}°  北纬 ${lat.toFixed(4)}°`;
  });
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
  geoJsonLayer = null;
  markerGroup = null;
  markerByName.clear();
});
</script>

<style lang="less" scoped>
.yj-map {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  min-height: 0;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(244, 114, 182, 0.35);
  background: #1a0a12;
  box-shadow: 0 0 0 1px rgba(219, 39, 119, 0.12), inset 0 0 60px rgba(0, 0, 0, 0.45);
}

.yj-map__leaflet {
  position: absolute;
  inset: 0;
}

.yj-c {
  position: absolute;
  width: 18px;
  height: 18px;
  z-index: 800;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: #f472b6;
    box-shadow: 0 0 6px #ec4899;
  }

  &::before {
    width: 2px;
    height: 100%;
  }
  &::after {
    width: 100%;
    height: 2px;
  }

  &--tl {
    top: 8px;
    left: 8px;
    &::before {
      top: 0;
      left: 0;
    }
    &::after {
      top: 0;
      left: 0;
    }
  }
  &--tr {
    top: 8px;
    right: 8px;
    &::before {
      top: 0;
      right: 0;
    }
    &::after {
      top: 0;
      right: 0;
    }
  }
  &--bl {
    bottom: 8px;
    left: 8px;
    &::before {
      bottom: 0;
      left: 0;
    }
    &::after {
      bottom: 0;
      left: 0;
    }
  }
  &--br {
    bottom: 8px;
    right: 8px;
    &::before {
      bottom: 0;
      right: 0;
    }
    &::after {
      bottom: 0;
      right: 0;
    }
  }
}

.yj-coords {
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
  color: rgba(251, 207, 232, 0.85);
  background: rgba(24, 10, 18, 0.75);
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid rgba(244, 114, 182, 0.28);
  backdrop-filter: blur(4px);
  letter-spacing: 0.04em;
}

.yj-coords-ico {
  font-size: 9px;
  animation: yj-blink 2s ease-in-out infinite;
}

@keyframes yj-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.yj-map__legend {
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 800;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(244, 114, 182, 0.35);
  background: rgba(24, 10, 18, 0.9);
  backdrop-filter: blur(10px);
  pointer-events: none;
}

.yj-map__legend-title {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: #e2e8f0;
}

.yj-map__legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 12px;
  color: #cbd5e1;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex-shrink: 0;
}
.dot-red {
  background: #ef4444;
}
.dot-orange {
  background: #f97316;
}
.dot-yellow {
  background: #eab308;
}
.dot-blue {
  background: #3b82f6;
}

.yj-map__stats {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 800;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(244, 114, 182, 0.35);
  background: rgba(24, 10, 18, 0.9);
  backdrop-filter: blur(10px);
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.6;
  pointer-events: none;

  p {
    margin: 0;
  }
}

.yj-map__stats-title {
  margin-bottom: 8px !important;
  font-weight: 600;
  color: #e2e8f0;
}
</style>

<style lang="less">
.yj-marker-wrap {
  background: transparent !important;
  border: none !important;
}

.yj-marker-root {
  position: relative;
  width: 140px;
  height: 120px;
  pointer-events: auto;
}

.yj-marker__stack {
  position: absolute;
  left: 70px;
  top: 88px;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
}

.yj-marker__ping {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 30px;
  height: 30px;
  margin: -15px 0 0 -15px;
  border-radius: 50%;
  opacity: 0.2;
  transform-origin: center;
  animation: yj-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.yj-marker__ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border-radius: 50%;
  border-width: 1px;
  border-style: solid;
  opacity: 0.35;
}

.yj-marker__core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 12px;
  margin: -6px 0 0 -6px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-sizing: border-box;
  z-index: 2;
}

.yj-marker-root--active .yj-marker__ping {
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
}

.yj-marker-root--active .yj-marker__ring {
  width: 28px;
  height: 28px;
  margin: -14px 0 0 -14px;
}

.yj-marker-root--active .yj-marker__core {
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.45));
}

.yj-marker__card {
  position: absolute;
  left: 50%;
  bottom: 36px;
  transform: translateX(-50%);
  min-width: 140px;
  max-width: 220px;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid;
  background: rgba(0, 0, 0, 0.85);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease;
  pointer-events: none;
  z-index: 3;
}

.yj-marker-root--active .yj-marker__card {
  opacity: 1;
  visibility: visible;
}

.yj-marker__title {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  line-height: 1.3;
}

.yj-marker__sub {
  margin-top: 4px;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.3;
}

.yj-marker__detail {
  margin-top: 6px;
  font-size: 9px;
  color: #999;
  line-height: 1.35;
}

@keyframes yj-ping {
  0% {
    transform: scale(0.85);
    opacity: 0.9;
  }
  75%,
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

.leaflet-control-zoom {
  border: 1px solid rgba(244, 114, 182, 0.35) !important;
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5) !important;
}

.leaflet-control-zoom a {
  background: rgba(24, 10, 18, 0.92) !important;
  color: #f9a8d4 !important;
  border-bottom-color: rgba(244, 114, 182, 0.25) !important;
  transition: all 0.2s;

  &:hover {
    background: rgba(157, 23, 77, 0.45) !important;
    color: #fce7f3 !important;
  }
}
</style>
