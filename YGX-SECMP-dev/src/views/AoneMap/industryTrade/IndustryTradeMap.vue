<template>
  <div class="it-map">
    <div ref="mapRef" class="it-map__leaflet" />

    <div class="it-map__ctrl">
      <button type="button" class="it-map__btn" aria-label="图层"><ApartmentOutlined /></button>
      <button type="button" class="it-map__btn" aria-label="罗盘"><CompassOutlined /></button>
    </div>

    <div class="it-map__legend">
      <div class="it-map__legend-title">风险等级</div>
      <div class="it-map__legend-row"><span class="it-leg it-leg--red" />重大风险</div>
      <div class="it-map__legend-row"><span class="it-leg it-leg--orange" />较大风险</div>
      <div class="it-map__legend-row"><span class="it-leg it-leg--yellow" />一般风险</div>
      <div class="it-map__legend-row"><span class="it-leg it-leg--blue" />低风险</div>
    </div>

    <div class="it-map__coord">
      <EnvironmentOutlined />
      <span>{{ coordsText }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ApartmentOutlined, CompassOutlined, EnvironmentOutlined } from '@ant-design/icons-vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import rawGeoStr from '../geoJson/index.geojson?raw';
import type { Enterprise } from './types';
import { monitorStatusLabel } from './monitorLabels';
import { ENTERPRISES, townshipNameById } from './mockData';

const geoData: GeoJSON.FeatureCollection = JSON.parse(rawGeoStr);

const mapRef = ref<HTMLDivElement | null>(null);
const coordsText = ref('东经 --  北纬 --');

let map: L.Map | null = null;
let geoJsonLayer: L.GeoJSON | null = null;
let markerLayer: L.LayerGroup | null = null;

const riskBorder: Record<Enterprise['riskLevel'], string> = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  blue: '#3b82f6',
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTemp(t: number) {
  if (Math.abs(t) >= 100) return `${t.toFixed(0)} °C`;
  return `${t.toFixed(1)} °C`;
}

function enterprisePopupHtml(e: Enterprise) {
  const d = e.realTimeData;
  const town = townshipNameById(e.townshipId);
  const rows: string[] = [];
  if (d.temperature != null) rows.push(`<div class="it-pop__row"><span>温度</span><span>${formatTemp(d.temperature)}</span></div>`);
  if (d.humidity != null) rows.push(`<div class="it-pop__row"><span>湿度</span><span>${d.humidity.toFixed(0)} %RH</span></div>`);
  if (d.pressure != null) rows.push(`<div class="it-pop__row"><span>压力</span><span>${d.pressure.toFixed(3)} MPa</span></div>`);
  if (d.concentration != null)
    rows.push(`<div class="it-pop__row"><span>浓度</span><span>${d.concentration} mg/m³</span></div>`);
  const stClass = d.status === 'alarm' ? 'is-alarm' : d.status === 'warning' ? 'is-warn' : 'is-ok';
  return `<div class="it-pop">
    <div class="it-pop__head">
      <div class="it-pop__title">${escapeHtml(e.name)}</div>
      <div class="it-pop__sub">${escapeHtml(e.type)} · ${escapeHtml(town)}</div>
    </div>
    <div class="it-pop__status ${stClass}">监测：${monitorStatusLabel(d.status)}</div>
    ${rows.join('')}
    <div class="it-pop__foot">未处置报警 <b>${e.alarms.unhandled}</b></div>
  </div>`;
}

function createEntIcon(e: Enterprise): L.DivIcon {
  const c = riskBorder[e.riskLevel];
  return L.divIcon({
    className: 'it-marker-wrap',
    html: `<div class="it-ent-marker" style="border-color:${c};box-shadow:0 0 12px ${c}55">
      <span class="it-ent-marker__sq" style="background:${c}22;border-color:${c}"></span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function buildGeoJson() {
  if (!map) return;

  map.createPane('itGlowPane');
  const pane = map.getPane('itGlowPane')!;
  pane.style.zIndex = '402';
  pane.style.filter =
    'drop-shadow(0 0 8px rgba(52,211,153,0.85)) drop-shadow(0 0 18px rgba(16,185,129,0.45))';

  geoJsonLayer = L.geoJSON(geoData, {
    pane: 'itGlowPane',
    style: {
      color: '#4ade80',
      weight: 2,
      fillColor: '#064e3b',
      fillOpacity: 0.14,
      opacity: 1,
    },
  }).addTo(map);

  L.geoJSON(geoData, {
    style: { color: 'transparent', fillColor: '#047857', fillOpacity: 0.08 },
  }).addTo(map);

  if (geoJsonLayer.getBounds().isValid()) {
    map.setView(geoJsonLayer.getBounds().getCenter(), 10.5);
  }
}

function buildMarkers() {
  if (!map) return;
  markerLayer?.clearLayers();
  if (!markerLayer) markerLayer = L.layerGroup();

  ENTERPRISES.forEach((e) => {
    const m = L.marker([e.lat, e.lng], { icon: createEntIcon(e) });
    m.bindPopup(enterprisePopupHtml(e), { className: 'it-leaflet-popup', maxWidth: 320, closeButton: true });
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
    /* 浅绿 / 青绿调：相对原青蓝 hue-rotate 下调，略提亮、略降饱和 */
    tilePane.style.filter =
      'invert(1) hue-rotate(118deg) brightness(0.76) saturate(0.5) contrast(1.06)';
  }

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  buildGeoJson();
  buildMarkers();

  map.on('mousemove', (ev) => {
    const { lat, lng } = ev.latlng;
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
  markerLayer = null;
});
</script>

<style lang="less" scoped>
.it-map {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: #05150f;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid rgba(52, 211, 153, 0.28);
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.08), inset 0 0 48px rgba(5, 46, 22, 0.45);
}

.it-map__leaflet {
  position: absolute;
  inset: 0;
}

.it-map__ctrl {
  position: absolute;
  bottom: 28px;
  right: 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 800;
}

.it-map__btn {
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(52, 211, 153, 0.3);
  background: rgba(5, 26, 18, 0.9);
  backdrop-filter: blur(12px);
  color: #94a3b8;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #6ee7b7;
    border-color: rgba(52, 211, 153, 0.5);
  }
}

.it-map__legend {
  position: absolute;
  bottom: 28px;
  left: 24px;
  z-index: 800;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(5, 26, 18, 0.9);
  border: 1px solid rgba(52, 211, 153, 0.25);
  backdrop-filter: blur(8px);
  pointer-events: none;
}

.it-map__legend-title {
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.it-map__legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #cbd5e1;
  margin-top: 6px;
}

.it-leg {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  transform: rotate(45deg);
  flex-shrink: 0;
  &--red {
    background: #ef4444;
  }
  &--orange {
    background: #f97316;
  }
  &--yellow {
    background: #eab308;
  }
  &--blue {
    background: #3b82f6;
  }
}

.it-map__coord {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(52, 211, 153, 0.28);
  background: rgba(5, 26, 18, 0.88);
  font-size: 10px;
  color: rgba(167, 243, 208, 0.88);
  font-family: ui-monospace, monospace;
  pointer-events: none;
}
</style>

<style lang="less">
.it-marker-wrap {
  background: transparent !important;
  border: none !important;
}

.it-ent-marker {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid;
  background: rgba(5, 26, 18, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.it-ent-marker__sq {
  width: 12px;
  height: 12px;
  transform: rotate(45deg);
  border: 1px solid;
  border-radius: 2px;
}

.it-leaflet-popup {
  .leaflet-popup-content-wrapper {
    background: rgba(5, 26, 18, 0.96) !important;
    border: 1px solid rgba(52, 211, 153, 0.35) !important;
    border-radius: 10px !important;
    padding: 0 !important;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55) !important;
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
      color: #6ee7b7 !important;
    }
  }
}

.it-pop {
  padding: 12px 14px 14px;
}

.it-pop__head {
  margin-bottom: 8px;
  padding-right: 16px;
}

.it-pop__title {
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.it-pop__sub {
  margin-top: 4px;
  font-size: 11px;
  color: #64748b;
}

.it-pop__status {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 10px;
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;

  &.is-alarm {
    color: #f87171;
    background: rgba(248, 113, 113, 0.12);
  }
  &.is-warn {
    color: #facc15;
    background: rgba(250, 204, 21, 0.1);
  }
  &.is-ok {
    color: #4ade80;
    background: rgba(74, 222, 128, 0.1);
  }
}

.it-pop__row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  margin-bottom: 6px;
  color: #64748b;

  span:last-child {
    color: #e2e8f0;
    font-weight: 600;
    font-family: ui-monospace, monospace;
  }
}

.it-pop__foot {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(51, 65, 85, 0.6);
  font-size: 11px;
  color: #94a3b8;

  b {
    color: #f87171;
    font-size: 14px;
    margin-left: 4px;
  }
}

.leaflet-control-zoom {
  border: 1px solid rgba(52, 211, 153, 0.3) !important;
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5) !important;
}

.leaflet-control-zoom a {
  background: rgba(5, 26, 18, 0.92) !important;
  color: #94a3b8 !important;
  border-bottom-color: rgba(52, 211, 153, 0.22) !important;

  &:hover {
    background: rgba(5, 150, 105, 0.35) !important;
    color: #6ee7b7 !important;
  }
}
</style>
