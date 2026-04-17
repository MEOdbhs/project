<template>
  <div class="hyd-map">
    <div ref="mapRef" class="hyd-map__leaflet" />

    <div class="hyd-map__legend hyd-map__legend--bl">
      <div class="hyd-map__legend-item">
        <span class="hyd-map__dot hyd-map__dot--normal" />
        <span class="hyd-map__legend-text">正常</span>
      </div>
      <div class="hyd-map__legend-item">
        <span class="hyd-map__dot hyd-map__dot--warning" />
        <span class="hyd-map__legend-text">预警</span>
      </div>
      <div class="hyd-map__legend-item">
        <span class="hyd-map__dot hyd-map__dot--danger" />
        <span class="hyd-map__legend-text">告警</span>
      </div>
      <div class="hyd-map__legend-divider" />
      <div class="hyd-map__legend-item">
        <div class="hyd-map__line hyd-map__line--main" />
        <span class="hyd-map__legend-text">黄河干流</span>
      </div>
      <div class="hyd-map__legend-item">
        <div class="hyd-map__line hyd-map__line--branch" />
        <span class="hyd-map__legend-text">支流</span>
      </div>
    </div>

    <div class="hyd-map__legend hyd-map__legend--br">
      <div class="hyd-map__res-item">
        <div class="hyd-map__res-swatch hyd-map__res-swatch--a" />
        <span>刘家峡水库</span>
      </div>
      <div class="hyd-map__res-item">
        <div class="hyd-map__res-swatch hyd-map__res-swatch--b" />
        <span>盐锅峡水库</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import rawGeoStr from '../geoJson/index.geojson?raw';
import type { HydrologyStation } from './mockData';

const props = defineProps<{ stations: HydrologyStation[] }>();

const geoData: GeoJSON.FeatureCollection = JSON.parse(rawGeoStr);

const mapRef = ref<HTMLDivElement | null>(null);

let map: L.Map | null = null;
let geoJsonLayer: L.GeoJSON | null = null;
let markerLayer: L.LayerGroup | null = null;

function markerColorHex(s: HydrologyStation) {
  if (s.status === 'normal') return '#00ff88';
  if (s.status === 'warning') return '#ffaa00';
  return '#ff4444';
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shortName(name: string) {
  return name.replace('站', '');
}

function createStationIcon(s: HydrologyStation): L.DivIcon {
  const c = markerColorHex(s);
  return L.divIcon({
    className: 'hyd-marker-wrap',
    html: `<div class="hyd-marker">
      <span class="hyd-marker__ping" style="background:${c}"></span>
      <span class="hyd-marker__dot" style="background:${c};box-shadow:0 0 10px ${c}"></span>
      <span class="hyd-marker__name">${escapeHtml(shortName(s.name))}</span>
      <span class="hyd-marker__wl" style="color:${c}">${s.waterLevel.toFixed(1)}m</span>
    </div>`,
    iconSize: [72, 56],
    iconAnchor: [36, 28],
  });
}

function stationPopupHtml(s: HydrologyStation) {
  const c = markerColorHex(s);
  const st =
    s.status === 'normal' ? '正常' : s.status === 'warning' ? '预警' : '告警';
  return `<div class="hyd-popup">
    <div class="hyd-popup__head" style="border-color:${c}40">
      <span class="hyd-popup__title">${escapeHtml(s.name)}</span>
      <span class="hyd-popup__badge" style="color:${c};border-color:${c}60">${st}</span>
    </div>
    <div class="hyd-popup__body">
      <div class="hyd-popup__row"><span>所属河流</span><span>${escapeHtml(s.river)}</span></div>
      <div class="hyd-popup__row"><span>水位</span><span>${s.waterLevel.toFixed(2)} m</span></div>
      <div class="hyd-popup__row"><span>流量</span><span>${s.flow} m³/s</span></div>
      <div class="hyd-popup__row"><span>警戒水位</span><span>${s.warningLevel} m</span></div>
    </div>
  </div>`;
}

function buildGeoJson() {
  if (!map) return;

  map.createPane('hydGlowPane');
  const pane = map.getPane('hydGlowPane')!;
  pane.style.zIndex = '402';
  pane.style.filter =
    'drop-shadow(0 0 8px rgba(34,211,238,0.9)) drop-shadow(0 0 18px rgba(34,211,238,0.45))';

  geoJsonLayer = L.geoJSON(geoData, {
    pane: 'hydGlowPane',
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
    map.setView(geoJsonLayer.getBounds().getCenter(), 9.5);
  }
}

function buildMarkers(stations: HydrologyStation[]) {
  if (!map) return;
  markerLayer?.clearLayers();
  if (!markerLayer) markerLayer = L.layerGroup();

  stations.forEach((s) => {
    const marker = L.marker([s.lat, s.lng], {
      icon: createStationIcon(s),
      bubblingMouseEvents: false,
    });
    marker.bindPopup(stationPopupHtml(s), {
      className: 'hyd-leaflet-popup',
      maxWidth: 280,
      closeButton: true,
    });
    markerLayer!.addLayer(marker);
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
    tilePane.style.filter =
      'invert(1) hue-rotate(200deg) brightness(0.72) saturate(0.55) contrast(1.08)';
  }

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  buildGeoJson();
  buildMarkers(props.stations);
}

onMounted(() => {
  initMap();
});

watch(
  () => props.stations,
  (list) => {
    if (map && markerLayer) buildMarkers(list);
  },
  { deep: true },
);

onBeforeUnmount(() => {
  map?.remove();
  map = null;
  geoJsonLayer = null;
  markerLayer = null;
});
</script>

<style lang="less" scoped>
.hyd-map {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 320px;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(34, 211, 238, 0.2);
  background: #060d1f;
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.06), inset 0 0 40px rgba(0, 0, 0, 0.35);
}

.hyd-map__leaflet {
  position: absolute;
  inset: 0;
}

.hyd-map__legend {
  position: absolute;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(10, 22, 40, 0.88);
  border: 1px solid rgba(56, 189, 248, 0.2);
  font-size: 11px;
  color: #94a3b8;
  z-index: 800;
  pointer-events: none;

  &--bl {
    bottom: 12px;
    left: 12px;
  }

  &--br {
    bottom: 12px;
    right: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

.hyd-map__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hyd-map__legend-text {
  white-space: nowrap;
}

.hyd-map__legend-divider {
  width: 1px;
  height: 14px;
  background: rgba(148, 163, 184, 0.35);
}

.hyd-map__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;

  &--normal {
    background: #00ff88;
  }
  &--warning {
    background: #ffaa00;
  }
  &--danger {
    background: #ff4444;
  }
}

.hyd-map__line {
  width: 32px;
  height: 2px;
  border-radius: 1px;

  &--main {
    background: #00d4ff;
  }
  &--branch {
    background: #00ff88;
  }
}

.hyd-map__res-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hyd-map__res-swatch {
  width: 16px;
  height: 8px;
  border-radius: 2px;

  &--a {
    background: rgba(0, 212, 255, 0.2);
    border: 1px solid #00d4ff;
  }
  &--b {
    background: rgba(0, 212, 255, 0.15);
    border: 1px solid rgba(0, 212, 255, 0.5);
  }
}
</style>

<style lang="less">
.hyd-marker-wrap {
  background: transparent !important;
  border: none !important;
}

.hyd-marker {
  position: relative;
  width: 72px;
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  pointer-events: auto;
}

.hyd-marker__ping {
  position: absolute;
  left: 50%;
  bottom: 10px;
  width: 24px;
  height: 24px;
  margin-left: -12px;
  border-radius: 50%;
  opacity: 0.25;
  transform-origin: center;
  animation: hyd-marker-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.hyd-marker__dot {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.85);
  z-index: 2;
}

.hyd-marker__name {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 600;
  color: #f8fafc;
  white-space: nowrap;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85);
}

.hyd-marker__wl {
  margin-top: 2px;
  font-size: 9px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
}

@keyframes hyd-marker-ping {
  0% {
    transform: scale(0.85);
    opacity: 0.45;
  }
  100% {
    transform: scale(2.1);
    opacity: 0;
  }
}

.hyd-leaflet-popup {
  .leaflet-popup-content-wrapper {
    background: rgba(10, 22, 40, 0.96) !important;
    border: 1px solid rgba(34, 211, 238, 0.35) !important;
    border-radius: 10px !important;
    padding: 0 !important;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.55) !important;
  }

  .leaflet-popup-content {
    margin: 0 !important;
    min-width: 200px;
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

.hyd-popup__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 28px 10px 12px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.2);
}

.hyd-popup__title {
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
}

.hyd-popup__badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid;
  font-weight: 600;
}

.hyd-popup__body {
  padding: 10px 12px 12px;
}

.hyd-popup__row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 11px;
  margin-bottom: 6px;
  color: #64748b;

  &:last-child {
    margin-bottom: 0;
  }

  span:last-child {
    color: #e2e8f0;
    font-weight: 500;
    text-align: right;
  }
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
