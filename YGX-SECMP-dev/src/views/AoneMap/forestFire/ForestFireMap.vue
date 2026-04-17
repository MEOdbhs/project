<template>
  <div class="ff-map">
    <div ref="mapRef" class="ff-map__leaflet" />

    <div class="ff-map__ctrl">
      <button type="button" class="ff-map__btn" aria-label="图层"><ApartmentOutlined /></button>
      <button type="button" class="ff-map__btn" aria-label="筛选"><FilterOutlined /></button>
      <button type="button" class="ff-map__btn" aria-label="全图"><ExpandOutlined /></button>
    </div>

    <div class="ff-map__overlay">
      <InfoCircleOutlined class="ff-map__overlay-ico" />
      <span class="ff-map__overlay-t">当前层级：全县总览</span>
      <button type="button" class="ff-map__overlay-link">切换至乡镇级</button>
    </div>

    <div class="ff-map__bar">
      <div class="ff-map__legend">
        <div class="ff-map__legend-title">图例说明</div>
        <div class="ff-map__legend-grid">
          <div class="ff-map__leg-item"><span class="ff-map__leg-dot ff-map__leg-dot--red" />确认火情</div>
          <div class="ff-map__leg-item"><span class="ff-map__leg-dot ff-map__leg-dot--amber" />疑似火情</div>
          <div class="ff-map__leg-item"><span class="ff-map__leg-dot ff-map__leg-dot--green" />已扑灭</div>
          <div class="ff-map__leg-item"><span class="ff-map__leg-sq ff-map__leg-sq--blue" />救援队伍</div>
          <div class="ff-map__leg-item"><span class="ff-map__leg-sq ff-map__leg-sq--emerald" />物资储备</div>
          <div class="ff-map__leg-item"><span class="ff-map__leg-sq ff-map__leg-sq--amber" />设施监控</div>
        </div>
      </div>
      <div class="ff-map__coord">
        <AimOutlined />
        <span>{{ coordsText }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AimOutlined,
  ApartmentOutlined,
  ExpandOutlined,
  FilterOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import rawGeoStr from '../geoJson/index.geojson?raw';
import type { EmergencyResource, FirePoint } from './types';
import { mockFirePoints, mockResources } from './mockData';

const geoData: GeoJSON.FeatureCollection = JSON.parse(rawGeoStr);

const mapRef = ref<HTMLDivElement | null>(null);
const coordsText = ref('东经 --  北纬 --');

let map: L.Map | null = null;
let geoJsonLayer: L.GeoJSON | null = null;
let overlayGroup: L.LayerGroup | null = null;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fireStatusLabel(status: FirePoint['status']) {
  if (status === 'confirmed') return '确认火情';
  if (status === 'suspected') return '疑似火情';
  return '已扑灭';
}

function firePopupHtml(f: FirePoint) {
  return `<div class="ff-popup">
    <div class="ff-popup__title">${escapeHtml(f.name)}</div>
    <div class="ff-popup__row"><span>状态</span><span>${fireStatusLabel(f.status)}</span></div>
    <div class="ff-popup__row"><span>等级</span><span>${f.level} 级</span></div>
    <div class="ff-popup__row"><span>过火面积</span><span>${f.area} hm²</span></div>
    <div class="ff-popup__row"><span>开始时间</span><span>${escapeHtml(f.startTime)}</span></div>
    <div class="ff-popup__desc">${escapeHtml(f.description)}</div>
  </div>`;
}

function resourcePopupHtml(r: EmergencyResource) {
  const st = r.status === 'available' ? '待命' : r.status === 'busy' ? '执行中' : '离线';
  let extra = '';
  if (r.details.count != null) extra += `<div class="ff-popup__row"><span>人数</span><span>${r.details.count} 人</span></div>`;
  if (r.details.equipment?.length)
    extra += `<div class="ff-popup__muted">${escapeHtml(r.details.equipment.join(' · '))}</div>`;
  if (r.details.items?.length) {
    extra += r.details.items
      .map((it) => `<div class="ff-popup__row"><span>${escapeHtml(it.name)}</span><span>${it.quantity} ${it.unit}</span></div>`)
      .join('');
  }
  const typeLabel =
    r.type === 'team' ? '救援队伍' : r.type === 'supply' ? '物资储备' : r.type === 'facility' ? '设施' : '装备';
  return `<div class="ff-popup">
    <div class="ff-popup__title">${escapeHtml(r.name)}</div>
    <div class="ff-popup__row"><span>类型</span><span>${typeLabel}</span></div>
    <div class="ff-popup__row"><span>状态</span><span>${st}</span></div>
    ${extra}
  </div>`;
}

function createFireIcon(f: FirePoint): L.DivIcon {
  const cls =
    f.status === 'confirmed' ? 'is-confirmed' : f.status === 'suspected' ? 'is-suspected' : 'is-extinguished';
  return L.divIcon({
    className: 'ff-marker-wrap',
    html: `<div class="ff-fire-icon ${cls}">
      <span class="ff-fire-icon__ping"></span>
      <span class="ff-fire-icon__dot">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c0 4-4 6-4 10a4 4 0 108 0c0-4-4-6-4-10z"/></svg>
      </span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function createResourceIcon(r: EmergencyResource): L.DivIcon {
  const cls = r.type === 'team' ? 'is-team' : r.type === 'supply' ? 'is-supply' : 'is-facility';
  const sym =
    r.type === 'team'
      ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>'
      : r.type === 'supply'
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>'
        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2"/></svg>';
  return L.divIcon({
    className: 'ff-marker-wrap',
    html: `<div class="ff-res-icon ${cls}">${sym}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function buildGeoJson() {
  if (!map) return;

  map.createPane('ffGlowPane');
  const pane = map.getPane('ffGlowPane')!;
  pane.style.zIndex = '402';
  pane.style.filter =
    'drop-shadow(0 0 8px rgba(34,211,238,0.9)) drop-shadow(0 0 18px rgba(34,211,238,0.45))';

  geoJsonLayer = L.geoJSON(geoData, {
    pane: 'ffGlowPane',
    style: {
      color: '#22d3ee',
      weight: 2,
      fillColor: '#0c4a6e',
      fillOpacity: 0.12,
      opacity: 1,
    },
  }).addTo(map);

  L.geoJSON(geoData, {
    style: { color: 'transparent', fillColor: '#0e7490', fillOpacity: 0.07 },
  }).addTo(map);

  if (geoJsonLayer.getBounds().isValid()) {
    map.setView(geoJsonLayer.getBounds().getCenter(), 10.5);
  }
}

function buildMarkers() {
  if (!map) return;
  overlayGroup?.clearLayers();
  if (!overlayGroup) overlayGroup = L.layerGroup();

  mockFirePoints.forEach((f) => {
    const [lng, lat] = f.location;
    const m = L.marker([lat, lng], { icon: createFireIcon(f) });
    m.bindPopup(firePopupHtml(f), { className: 'ff-leaflet-popup', maxWidth: 300, closeButton: true });
    overlayGroup!.addLayer(m);
  });

  mockResources.forEach((r) => {
    const [lng, lat] = r.location;
    const m = L.marker([lat, lng], { icon: createResourceIcon(r) });
    m.bindPopup(resourcePopupHtml(r), { className: 'ff-leaflet-popup', maxWidth: 300, closeButton: true });
    overlayGroup!.addLayer(m);
  });

  overlayGroup.addTo(map);
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
    tilePane.style.filter =
      'invert(1) hue-rotate(200deg) brightness(0.72) saturate(0.55) contrast(1.08)';
  }

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  buildGeoJson();
  buildMarkers();

  map.on('mousemove', (e) => {
    const { lat, lng } = e.latlng;
    coordsText.value = `东经 ${lng.toFixed(4)}°  北纬 ${lat.toFixed(4)}°`;
  });
}

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
  geoJsonLayer = null;
  overlayGroup = null;
});
</script>

<style lang="less" scoped>
.ff-map {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: #0f172a;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid rgba(34, 211, 238, 0.2);
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.06), inset 0 0 40px rgba(0, 0, 0, 0.35);
}

.ff-map__leaflet {
  position: absolute;
  inset: 0;
}

.ff-map__ctrl {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 800;
}

.ff-map__btn {
  padding: 8px;
  background: rgba(2, 6, 23, 0.88);
  border: 1px solid #1e293b;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  backdrop-filter: blur(8px);
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #fff;
    border-color: rgba(34, 211, 238, 0.35);
  }
}

.ff-map__bar {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  pointer-events: none;
  z-index: 800;
}

.ff-map__legend {
  pointer-events: auto;
  background: rgba(2, 6, 23, 0.88);
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 14px 16px;
  backdrop-filter: blur(8px);
}

.ff-map__legend-title {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}

.ff-map__legend-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 20px;
  font-size: 11px;
  color: #cbd5e1;
}

.ff-map__leg-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ff-map__leg-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex-shrink: 0;
  &--red {
    background: #dc2626;
  }
  &--amber {
    background: #d97706;
  }
  &--green {
    background: #059669;
  }
}

.ff-map__leg-sq {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
  &--blue {
    background: #2563eb;
  }
  &--emerald {
    background: #059669;
  }
  &--amber {
    background: #d97706;
  }
}

.ff-map__coord {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: rgba(2, 6, 23, 0.88);
  border: 1px solid #1e293b;
  border-radius: 8px;
  font-size: 11px;
  color: #94a3b8;
  font-family: ui-monospace, monospace;
  backdrop-filter: blur(8px);
}

.ff-map__overlay {
  position: absolute;
  top: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: rgba(37, 99, 235, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: 8px;
  backdrop-filter: blur(8px);
  z-index: 800;
}

.ff-map__overlay-ico {
  color: #60a5fa;
  font-size: 16px;
}

.ff-map__overlay-t {
  font-size: 13px;
  font-weight: 600;
  color: #f8fafc;
}

.ff-map__overlay-link {
  margin-left: 4px;
  font-size: 10px;
  color: #60a5fa;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}
</style>

<style lang="less">
.ff-marker-wrap {
  background: transparent !important;
  border: none !important;
}

.ff-fire-icon {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ff-fire-icon__ping {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.25;
  animation: ff-fire-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.ff-fire-icon.is-confirmed .ff-fire-icon__ping {
  background: #ef4444;
}
.ff-fire-icon.is-suspected .ff-fire-icon__ping {
  background: #f59e0b;
}
.ff-fire-icon.is-extinguished .ff-fire-icon__ping {
  background: #10b981;
}

.ff-fire-icon__dot {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  z-index: 1;
}

.ff-fire-icon.is-confirmed .ff-fire-icon__dot {
  background: #dc2626;
  border-color: #f87171;
  color: #fff;
}
.ff-fire-icon.is-suspected .ff-fire-icon__dot {
  background: #d97706;
  border-color: #fbbf24;
  color: #fff;
}
.ff-fire-icon.is-extinguished .ff-fire-icon__dot {
  background: #059669;
  border-color: #34d399;
  color: #fff;
}

@keyframes ff-fire-ping {
  75%,
  100% {
    transform: scale(1.45);
    opacity: 0;
  }
}

.ff-res-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  background: rgba(15, 23, 42, 0.92);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

.ff-res-icon.is-team {
  border-color: #3b82f6;
  color: #60a5fa;
}
.ff-res-icon.is-supply {
  border-color: #10b981;
  color: #34d399;
}
.ff-res-icon.is-facility {
  border-color: #f59e0b;
  color: #fbbf24;
}

.ff-leaflet-popup {
  .leaflet-popup-content-wrapper {
    background: rgba(2, 6, 23, 0.96) !important;
    border: 1px solid rgba(34, 211, 238, 0.3) !important;
    border-radius: 10px !important;
    padding: 0 !important;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55) !important;
  }

  .leaflet-popup-content {
    margin: 0 !important;
    min-width: 220px;
  }

  .leaflet-popup-tip-container {
    display: none;
  }

  .leaflet-popup-close-button {
    color: #64748b !important;
    top: 8px !important;
    right: 8px !important;

    &:hover {
      color: #22d3ee !important;
    }
  }
}

.ff-popup {
  padding: 12px 14px 14px;
}

.ff-popup__title {
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 10px;
  padding-right: 20px;
}

.ff-popup__row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  margin-bottom: 6px;
  color: #64748b;

  span:last-child {
    color: #e2e8f0;
    font-weight: 500;
    text-align: right;
  }
}

.ff-popup__desc {
  margin-top: 8px;
  font-size: 11px;
  line-height: 1.45;
  color: #94a3b8;
}

.ff-popup__muted {
  margin-top: 6px;
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
}

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

  &:hover {
    background: rgba(14, 116, 144, 0.35) !important;
    color: #22d3ee !important;
  }
}
</style>
