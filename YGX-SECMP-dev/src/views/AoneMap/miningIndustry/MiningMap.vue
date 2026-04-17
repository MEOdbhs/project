<template>
  <section class="mi-map">
    <div ref="mapRef" class="mi-map__leaflet" />

    <div class="mi-map__info">
      当前区域：<b>{{ selectedTown || '全县' }}</b>
    </div>

    <div class="mi-map__overview">
      <div class="mi-map__ov-title">永靖县概况</div>
      <div class="mi-map__ov-row"><span>总面积</span><b>1,863.6km²</b></div>
      <div class="mi-map__ov-row"><span>乡镇</span><b>17个</b></div>
      <div class="mi-map__ov-row"><span>矿山监管对象</span><b>156处</b></div>
    </div>

    <div class="mi-map__coord">
      <span>{{ coordsText }}</span>
    </div>

    <div class="mi-map__legend">
      <span><i class="r" />高风险</span>
      <span><i class="o" />中风险</span>
      <span><i class="y" />一般</span>
      <span><i class="b" />低风险</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import rawGeoStr from '../geoJson/index.geojson?raw';
import type { MiningTownshipPoint } from './mockData';
import { townshipData } from './mockData';

const geoData: GeoJSON.FeatureCollection = JSON.parse(rawGeoStr);

const mapRef = ref<HTMLDivElement | null>(null);
const coordsText = ref('东经 --  北纬 --');
const selectedTown = ref('');

let map: L.Map | null = null;
let geoJsonLayer: L.GeoJSON | null = null;
let markerLayer: L.LayerGroup | null = null;

const riskStroke: Record<MiningTownshipPoint['risk'], string> = {
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

function riskLabel(r: MiningTownshipPoint['risk']) {
  if (r === 'red') return '高风险';
  if (r === 'orange') return '较大风险';
  if (r === 'yellow') return '一般风险';
  return '低风险';
}

function popupHtml(t: MiningTownshipPoint) {
  const s = t.summary;
  return `<div class="mi-pop">
    <div class="mi-pop__head">
      <div class="mi-pop__title">${escapeHtml(t.name)} · 矿山监管</div>
      <div class="mi-pop__badge">纳入矿山 ${t.mineCount} 处 · ${riskLabel(t.risk)}</div>
    </div>
    <div class="mi-pop__grid">
      <div class="mi-pop__cell"><span>主要矿种</span><em>${escapeHtml(s.mainMinerals)}</em></div>
    
      <div class="mi-pop__cell"><span>边坡 / 地质</span><em>${escapeHtml(s.slopeStatus)}</em></div>
      <div class="mi-pop__cell"><span>作业面粉尘</span><em>${escapeHtml(s.dustAvg)}</em></div>
      <div class="mi-pop__cell"><span>地下水</span><em>${escapeHtml(s.groundwaterM)}</em></div>
      <div class="mi-pop__cell"><span>最近巡查</span><em>${escapeHtml(s.lastInspect)}</em></div>
      <div class="mi-pop__cell"><span>采矿权证照</span><em>${escapeHtml(s.permitValid)}</em></div>
    </div>
  </div>`;
}

function createTownIcon(t: MiningTownshipPoint): L.DivIcon {
  const c = riskStroke[t.risk];
  return L.divIcon({
    className: 'mi-marker-wrap',
    html: `<div class="mi-marker" style="border-color:${c};box-shadow:0 0 14px ${c}55">
      <span class="mi-marker__n">${t.mineCount}</span>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function buildGeoJson() {
  if (!map) return;

  map.createPane('miGlowPane');
  const pane = map.getPane('miGlowPane')!;
  pane.style.zIndex = '402';
  pane.style.filter =
    'drop-shadow(0 0 10px rgba(212,175,112,0.85)) drop-shadow(0 0 20px rgba(180,83,9,0.35))';

  geoJsonLayer = L.geoJSON(geoData, {
    pane: 'miGlowPane',
    style: {
      color: '#c9a227',
      weight: 2,
      fillColor: '#451a03',
      fillOpacity: 0.2,
      opacity: 1,
    },
  }).addTo(map);

  L.geoJSON(geoData, {
    style: { color: 'transparent', fillColor: '#92400e', fillOpacity: 0.09 },
  }).addTo(map);

  if (geoJsonLayer.getBounds().isValid()) {
    map.setView(geoJsonLayer.getBounds().getCenter(), 9.5);
  }
}

function buildMarkers() {
  if (!map) return;
  markerLayer?.clearLayers();
  if (!markerLayer) markerLayer = L.layerGroup();

  townshipData.forEach((t) => {
    const m = L.marker([t.lat, t.lng], { icon: createTownIcon(t) });
    m.bindPopup(popupHtml(t), { className: 'mi-leaflet-popup', maxWidth: 340, closeButton: true });
    m.on('click', () => {
      selectedTown.value = t.name;
    });
    markerLayer!.addLayer(m);
  });
  markerLayer.addTo(map);

  map.on('popupclose', () => {
    selectedTown.value = '';
  });
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
    /* 暗金 / 暖褐调底图 */
    tilePane.style.filter =
      'invert(1) hue-rotate(28deg) brightness(0.7) saturate(0.46) contrast(1.1)';
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
  markerLayer = null;
});
</script>

<style scoped lang="less">
.mi-map {
  position: relative;
  flex: 1;
  min-height: 0;
  min-width: 0;
  border-radius: 10px;
  border: 1px solid rgba(201, 162, 39, 0.35);
  background: #0f0c08;
  box-shadow: 0 0 0 1px rgba(212, 175, 112, 0.08), inset 0 0 48px rgba(69, 26, 3, 0.35);
  overflow: hidden;
}

.mi-map__leaflet {
  position: absolute;
  inset: 0;
}

.mi-map__info {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 800;
  font-size: 12px;
  color: #fde68a;
  padding: 8px 14px;
  border: 1px solid rgba(201, 162, 39, 0.4);
  border-radius: 999px;
  background: rgba(15, 12, 8, 0.88);
  backdrop-filter: blur(8px);
  pointer-events: none;

  b {
    color: #fcd34d;
    font-weight: 700;
  }
}

.mi-map__overview {
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 800;
  width: 168px;
  border-radius: 10px;
  border: 1px solid rgba(201, 162, 39, 0.32);
  background: rgba(15, 12, 8, 0.88);
  padding: 10px 12px;
  font-size: 11px;
  backdrop-filter: blur(8px);
  pointer-events: none;
}

.mi-map__ov-title {
  color: #d4a574;
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 12px;
}

.mi-map__ov-row {
  display: flex;
  justify-content: space-between;
  color: #a8a29e;
  margin-top: 5px;

  b {
    color: #fde68a;
    font-weight: 600;
  }
}

.mi-map__coord {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 800;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(201, 162, 39, 0.28);
  background: rgba(15, 12, 8, 0.88);
  font-size: 10px;
  color: rgba(253, 230, 138, 0.85);
  font-family: ui-monospace, monospace;
  pointer-events: none;
}

.mi-map__legend {
  position: absolute;
  left: 12px;
  bottom: 14px;
  z-index: 800;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 10px;
  color: #d6d3d1;
  background: rgba(15, 12, 8, 0.88);
  border: 1px solid rgba(201, 162, 39, 0.28);
  border-radius: 8px;
  padding: 8px 10px;
  pointer-events: none;
}

.mi-map__legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.mi-map__legend i {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
}
.mi-map__legend .r {
  background: #ef4444;
}
.mi-map__legend .o {
  background: #f97316;
}
.mi-map__legend .y {
  background: #eab308;
}
.mi-map__legend .b {
  background: #3b82f6;
}
</style>

<style lang="less">
.mi-marker-wrap {
  background: transparent !important;
  border: none !important;
}

.mi-marker {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 2px solid;
  background: rgba(15, 12, 8, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mi-marker__n {
  font-size: 13px;
  font-weight: 800;
  color: #fef3c7;
  font-family: ui-monospace, monospace;
}

.mi-leaflet-popup {
  .leaflet-popup-content-wrapper {
    background: rgba(15, 12, 8, 0.96) !important;
    border: 1px solid rgba(201, 162, 39, 0.45) !important;
    border-radius: 10px !important;
    padding: 0 !important;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 0 24px rgba(180, 83, 9, 0.15) !important;
  }

  .leaflet-popup-content {
    margin: 0 !important;
    min-width: 300px;
  }

  .leaflet-popup-tip-container {
    display: none;
  }

  .leaflet-popup-close-button {
    color: #a8a29e !important;
    top: 8px !important;
    right: 8px !important;

    &:hover {
      color: #fcd34d !important;
    }
  }
}

.mi-pop {
  padding: 12px 14px 14px;
}

.mi-pop__head {
  margin-bottom: 10px;
  padding-right: 22px;
}

.mi-pop__title {
  font-size: 14px;
  font-weight: 800;
  color: #fde68a;
  line-height: 1.35;
}

.mi-pop__badge {
  margin-top: 6px;
  font-size: 11px;
  color: #d4a574;
}

.mi-pop__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
}

.mi-pop__cell {
  font-size: 10px;
  color: #a8a29e;

  span {
    display: block;
    color: #78716c;
    margin-bottom: 2px;
  }

  em {
    font-style: normal;
    color: #e7e5e4;
    font-weight: 600;
    line-height: 1.35;
  }
}

.leaflet-control-zoom {
  border: 1px solid rgba(201, 162, 39, 0.35) !important;
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.55) !important;
}

.leaflet-control-zoom a {
  background: rgba(15, 12, 8, 0.92) !important;
  color: #a8a29e !important;
  border-bottom-color: rgba(201, 162, 39, 0.25) !important;

  &:hover {
    background: rgba(120, 53, 15, 0.45) !important;
    color: #fcd34d !important;
  }
}
</style>
