<template>
  <div class="hc-map">
    <div class="hc-map__main glass">
      <div class="hc-map__tl">
        <div class="hc-map__crumb">
          <button type="button" class="hc-map__link" @click="setCounty">永靖县</button>
          <RightOutlined class="hc-map__chev" />
          <template v-if="drillLevel === 'COUNTY'">
            <span class="hc-map__muted">全域总览</span>
          </template>
          <template v-else>
            <button type="button" class="hc-map__link hc-map__link--on" @click="toTownView">{{ selectedTown }}</button>
            <template v-if="drillLevel === 'ENTERPRISE'">
              <RightOutlined class="hc-map__chev" />
              <span class="hc-map__amber">{{ enterpriseCrumb }}</span>
            </template>
          </template>
        </div>
        <div class="hc-map__search-wrap">
          <SearchOutlined class="hc-map__search-ico" />
          <input
            v-model="searchQuery"
            type="text"
            class="hc-map__search"
            placeholder="搜索企业、危化品、危险源..."
            @focus="dropdownOpen = true"
            @blur="onSearchBlur"
          />
          <div v-if="dropdownOpen && searchResults.length" class="hc-map__dropdown">
            <button
              v-for="(r, idx) in searchResults"
              :key="idx"
              type="button"
              class="hc-map__dd-item"
              @mousedown.prevent="pickSearch(r)"
            >
              <div class="hc-map__dd-row">
                <span class="hc-map__dd-name">{{ r.name }}</span>
                <span class="hc-map__dd-type">{{ r.type }}</span>
              </div>
              <div class="hc-map__dd-sub">{{ r.region || r.scale || r.level }}</div>
            </button>
          </div>
        </div>
      </div>

      <div ref="mapRef" class="hc-map__leaflet" />

      <div class="hc-map__coord">
        <span>{{ coordsText }}</span>
      </div>

      <div class="hc-map__legend glass">
        <div class="hc-map__leg"><span class="hc-dot hc-dot--blue" />生产企业</div>
        <div class="hc-map__leg"><span class="hc-dot hc-dot--orange" />储存企业</div>
        <div class="hc-map__leg"><span class="hc-dot hc-dot--red" />重大危险源</div>
        <div class="hc-map__leg"><span class="hc-dot hc-dot--green" />运输车辆</div>
      </div>
    </div>

    <div class="hc-map__bottom">
      <GeologicalPanel title="隐患处置进度" :icon="RadarChartOutlined" class="hc-bpanel">
        <HiddenDangerProgress />
      </GeologicalPanel>
      <GeologicalPanel title="运输违规统计" :icon="CarOutlined" class="hc-bpanel">
        <div class="hc-map__area-wrap">
          <TransportViolationAreaChart :data="transportViolationWeek" />
        </div>
      </GeologicalPanel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CarOutlined, RadarChartOutlined, RightOutlined, SearchOutlined } from '@ant-design/icons-vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import rawGeoStr from '../geoJson/index.geojson?raw';
import GeologicalPanel from '../geologicalDisasters/GeologicalPanel.vue';
import HiddenDangerProgress from './HiddenDangerProgress.vue';
import { HAZARD_MAP_POINTS, transportViolationWeek } from './mockData';
import type { DetailPayload, DrillLevel, HazardMapPoint } from './types';
import TransportViolationAreaChart from './TransportViolationAreaChart.vue';

const geoData: GeoJSON.FeatureCollection = JSON.parse(rawGeoStr);

const emit = defineEmits<{ 'open-detail': [DetailPayload] }>();

const mapRef = ref<HTMLDivElement | null>(null);
const drillLevel = ref<DrillLevel>('COUNTY');
const selectedTown = ref('刘家峡镇');
const enterpriseCrumb = ref('');
const searchQuery = ref('');
const dropdownOpen = ref(false);
const coordsText = ref('东经 --  北纬 --');

let map: L.Map | null = null;
let geoJsonLayer: L.GeoJSON | null = null;
let markerLayer: L.LayerGroup | null = null;

const searchPool = [
  { type: '企业', name: '永靖县恒兴化工有限公司', region: '刘家峡镇化工片区' },
  { type: '危化品', name: '液氨', scale: '县域流通登记' },
  { type: '危险源', name: '县级一级重大危险源罐区', level: '一级' },
  { type: '企业', name: '永靖县盐化仓储服务中心', region: '盐锅峡镇' },
];

const searchResults = computed(() => {
  const q = searchQuery.value.trim();
  if (!q) return [];
  return searchPool.filter((i) => i.name.includes(q));
});

function onSearchBlur() {
  setTimeout(() => {
    dropdownOpen.value = false;
  }, 150);
}

function pickSearch(r: (typeof searchPool)[0]) {
  emit('open-detail', { name: r.name, type: r.type, region: r.region || r.scale || r.level });
  searchQuery.value = r.name;
  dropdownOpen.value = false;
}

function setCounty() {
  drillLevel.value = 'COUNTY';
  enterpriseCrumb.value = '';
  if (map && geoJsonLayer?.getBounds().isValid()) {
    map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20], maxZoom: 10.5 });
  }
}

function toTownView() {
  drillLevel.value = 'TOWN';
  enterpriseCrumb.value = '';
}

const kindStroke: Record<HazardMapPoint['kind'], string> = {
  production: '#38bdf8',
  storage: '#f97316',
  majorHazard: '#ef4444',
  vehicle: '#22c55e',
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function kindLabel(k: HazardMapPoint['kind']) {
  if (k === 'production') return '生产企业';
  if (k === 'storage') return '储存企业';
  if (k === 'majorHazard') return '重大危险源';
  return '运输车辆';
}

function popupHtml(p: HazardMapPoint) {
  return `<div class="hc-mpop">
    <div class="hc-mpop__head" style="border-left:3px solid ${kindStroke[p.kind]}">
      <div class="hc-mpop__kind">${kindLabel(p.kind)}</div>
      <div class="hc-mpop__title">${escapeHtml(p.name)}</div>
      <div class="hc-mpop__ent">${escapeHtml(p.enterprise)}</div>
    </div>
    <div class="hc-mpop__body">${escapeHtml(p.summary)}</div>
    <div class="hc-mpop__region">${escapeHtml(p.region)}</div>
  </div>`;
}

function shortTitle(name: string, max = 11) {
  if (name.length <= max) return name;
  return `${name.slice(0, max)}…`;
}

function kindShort(k: HazardMapPoint['kind']) {
  if (k === 'production') return '生产';
  if (k === 'storage') return '储存';
  if (k === 'majorHazard') return '重大源';
  return '运输';
}

function createMarkerIcon(p: HazardMapPoint): L.DivIcon {
  const c = kindStroke[p.kind];
  const w = 152;
  const h = 68;
  const title = escapeHtml(shortTitle(p.name));
  const sub = escapeHtml(kindShort(p.kind));
  return L.divIcon({
    className: 'hc-lf-icon-wrap',
    html: `<div class="hc-lf-marker" style="width:${w}px">
      <div class="hc-lf-icon" style="border-color:${c};box-shadow:0 0 14px ${c}44">
        <span class="hc-lf-icon__dot" style="background:${c}"></span>
      </div>
      <div class="hc-lf-tag" style="border-color:${c}55;box-shadow:0 4px 14px rgba(0,0,0,.35)">
        <span class="hc-lf-tag__title">${title}</span>
        <span class="hc-lf-tag__sub" style="color:${c}">${sub}</span>
      </div>
    </div>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, 18],
    popupAnchor: [0, -10],
  });
}

function onPointClick(p: HazardMapPoint) {
  if (p.townDrill) {
    drillLevel.value = 'TOWN';
    selectedTown.value = p.townDrill;
    enterpriseCrumb.value = '';
    emit('open-detail', { name: p.townDrill, type: '行政区域', region: '永靖县' });
    return;
  }
  if (p.kind === 'majorHazard') {
    drillLevel.value = 'ENTERPRISE';
    selectedTown.value = p.region.includes('镇') ? p.region : '刘家峡镇';
    enterpriseCrumb.value = p.name.length > 12 ? `${p.name.slice(0, 12)}…` : p.name;
    emit('open-detail', {
      name: p.name,
      type: '重大危险源',
      enterprise: p.enterprise,
      region: p.region,
    });
    return;
  }
  emit('open-detail', {
    name: p.name,
    type: kindLabel(p.kind),
    enterprise: p.enterprise,
    region: p.region,
  });
}

function buildMarkers() {
  const group = markerLayer;
  if (!map || !group) return;
  group.clearLayers();
  HAZARD_MAP_POINTS.forEach((p) => {
    const m = L.marker([p.lat, p.lng], { icon: createMarkerIcon(p) });
    m.bindPopup(popupHtml(p), { className: 'hc-lf-popup', maxWidth: 300, closeButton: true });
    m.on('click', () => onPointClick(p));
    group.addLayer(m);
  });
}

function buildGeoJson() {
  if (!map) return;
  map.createPane('hcGlowPane');
  const pane = map.getPane('hcGlowPane')!;
  pane.style.zIndex = '402';
  pane.style.filter =
    'drop-shadow(0 0 10px rgba(234,88,12,0.75)) drop-shadow(0 0 20px rgba(180,83,9,0.3))';

  geoJsonLayer = L.geoJSON(geoData, {
    pane: 'hcGlowPane',
    style: {
      color: '#fb923c',
      weight: 2,
      fillColor: '#431407',
      fillOpacity: 0.18,
      opacity: 1,
    },
  }).addTo(map);

  L.geoJSON(geoData, {
    style: { color: 'transparent', fillColor: '#78350f', fillOpacity: 0.08 },
  }).addTo(map);

  if (geoJsonLayer.getBounds().isValid()) {
    map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20], maxZoom: 10.5 });
  }
}

function initMap() {
  if (!mapRef.value) return;

  map = L.map(mapRef.value, {
    center: [35.938933, 103.319871],
    zoom: 10.5,
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
    /* 危化监管：琥珀警示调 + 压暗，区别于综治靛蓝 */
    tilePane.style.filter =
      'invert(1) hue-rotate(28deg) brightness(0.71) saturate(0.52) contrast(1.09)';
  }

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  buildGeoJson();
  markerLayer = L.layerGroup().addTo(map);
  buildMarkers();

  map.on('mousemove', (e) => {
    const { lat, lng } = e.latlng;
    coordsText.value = `东经 ${lng.toFixed(4)}°  北纬 ${lat.toFixed(4)}°`;
  });
}

watch(drillLevel, (lv) => {
  if (lv === 'COUNTY' && map && geoJsonLayer?.getBounds().isValid()) {
    map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20], maxZoom: 10.5 });
  }
});

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
  geoJsonLayer = null;
  markerLayer = null;
});
</script>

<style lang="less" scoped>
.glass {
  border-radius: 12px;
  border: 1px solid rgba(251, 146, 60, 0.2);
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(12px);
}

.hc-bpanel {
  flex: 1;
  min-width: 0;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.hc-map {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.hc-map__main {
  position: relative;
  flex: 1;
  min-height: 280px;
  overflow: hidden;
}

.hc-map__leaflet {
  position: absolute;
  inset: 0;
}

.hc-map__tl {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 800;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;

  button,
  input {
    pointer-events: auto;
  }
}

.hc-map__crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(251, 146, 60, 0.22);
  font-size: 13px;
  pointer-events: auto;
}

.hc-map__link {
  background: none;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  padding: 0;
  font-size: 13px;

  &:hover {
    color: #fb923c;
  }

  &--on {
    color: #fdba74;
  }
}

.hc-map__chev {
  font-size: 11px;
  color: #64748b;
}

.hc-map__muted {
  color: #64748b;
}

.hc-map__amber {
  color: #fdba74;
  font-weight: 600;
}

.hc-map__search-wrap {
  position: relative;
  width: 260px;
  pointer-events: auto;
}

.hc-map__search-ico {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 14px;
}

.hc-map__search {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px 8px 36px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.88);
  color: #fff;
  font-size: 13px;
  outline: none;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    border-color: rgba(251, 146, 60, 0.45);
  }
}

.hc-map__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  border-radius: 10px;
  border: 1px solid rgba(251, 146, 60, 0.2);
  background: rgba(15, 23, 42, 0.96);
  overflow: hidden;
  z-index: 10;
}

.hc-map__dd-item {
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: transparent;
  cursor: pointer;
  color: inherit;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &:last-child {
    border-bottom: none;
  }
}

.hc-map__dd-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hc-map__dd-name {
  font-size: 13px;
  font-weight: 700;
  color: #f8fafc;
}

.hc-map__dd-type {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(251, 146, 60, 0.15);
  color: #fb923c;
}

.hc-map__dd-sub {
  font-size: 10px;
  color: #64748b;
  margin-top: 4px;
}

.hc-map__coord {
  position: absolute;
  bottom: 56px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 800;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 10px;
  font-family: ui-monospace, monospace;
  color: rgba(253, 186, 116, 0.9);
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(251, 146, 60, 0.2);
  pointer-events: none;
}

.hc-map__legend {
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 800;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 10px;
  color: #cbd5e1;
  pointer-events: none;
}

.hc-map__leg {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hc-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &--blue {
    background: #38bdf8;
  }
  &--orange {
    background: #f97316;
  }
  &--red {
    background: #ef4444;
  }
  &--green {
    background: #22c55e;
  }
}

.hc-map__bottom {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  min-height: 200px;
}

.hc-map__area-wrap {
  height: 140px;
}
</style>

<style lang="less">
.hc-lf-icon-wrap {
  background: transparent !important;
  border: none !important;
}

.hc-lf-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: auto;
}

.hc-lf-icon {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 2px solid;
  background: rgba(15, 23, 42, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hc-lf-icon__dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
}

.hc-lf-tag {
  margin-top: 4px;
  max-width: 100%;
  padding: 4px 8px 5px;
  border-radius: 6px;
  border: 1px solid;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
}

.hc-lf-tag__title {
  font-size: 10px;
  font-weight: 700;
  color: #fef3c7;
  line-height: 1.25;
  word-break: break-all;
}

.hc-lf-tag__sub {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.hc-lf-popup {
  .leaflet-popup-content-wrapper {
    background: rgba(15, 23, 42, 0.96) !important;
    border: 1px solid rgba(251, 146, 60, 0.35) !important;
    border-radius: 10px !important;
    padding: 0 !important;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55), 0 0 24px rgba(234, 88, 12, 0.12) !important;
  }

  .leaflet-popup-content {
    margin: 0 !important;
    min-width: 260px;
  }

  .leaflet-popup-tip-container {
    display: none;
  }

  .leaflet-popup-close-button {
    color: #64748b !important;
    top: 8px !important;
    right: 8px !important;

    &:hover {
      color: #fdba74 !important;
    }
  }
}

.hc-mpop {
  padding: 12px 14px 14px;
}

.hc-mpop__head {
  padding-left: 10px;
  margin-bottom: 8px;
}

.hc-mpop__kind {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 4px;
}

.hc-mpop__title {
  font-size: 14px;
  font-weight: 800;
  color: #fef3c7;
  line-height: 1.3;
}

.hc-mpop__ent {
  font-size: 11px;
  color: #fdba74;
  margin-top: 4px;
}

.hc-mpop__body {
  font-size: 11px;
  color: #cbd5e1;
  line-height: 1.45;
  padding: 8px 0;
  border-top: 1px solid rgba(251, 146, 60, 0.15);
  border-bottom: 1px solid rgba(251, 146, 60, 0.12);
}

.hc-mpop__region {
  font-size: 10px;
  color: #64748b;
  margin-top: 8px;
}

.leaflet-control-zoom {
  border: 1px solid rgba(251, 146, 60, 0.3) !important;
  border-radius: 8px !important;
  overflow: hidden;
}

.leaflet-control-zoom a {
  background: rgba(15, 23, 42, 0.92) !important;
  color: #94a3b8 !important;
  border-bottom-color: rgba(251, 146, 60, 0.2) !important;

  &:hover {
    background: rgba(154, 52, 18, 0.35) !important;
    color: #fdba74 !important;
  }
}
</style>
