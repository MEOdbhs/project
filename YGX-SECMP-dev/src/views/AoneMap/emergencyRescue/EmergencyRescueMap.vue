<template>
  <div class="er-map-wrap">
    <div ref="mapRef" class="er-map" />
  </div>
</template>

<script lang="ts" setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import rawGeoStr from '../geoJson/index.geojson?raw';
import type { MapLevel, ResourceRecord, TownItem } from './mockData';
import { resourceData, townData } from './mockData';

const geoData: GeoJSON.FeatureCollection = JSON.parse(rawGeoStr);

const props = defineProps<{
  level: MapLevel;
  townName: string | null;
  resourceName: string | null;
  areaFilter: string;
  typeFilter: string;
  statusFilter: string;
}>();

const emit = defineEmits<{
  drillTown: [name: string];
}>();

const mapRef = ref<HTMLDivElement | null>(null);

let map: L.Map | null = null;
let geoJsonLayer: L.GeoJSON | null = null;
let markerLayer: L.LayerGroup | null = null;

function toLeafletLatLng(p: [number, number]): L.LatLngExpression {
  return [p[1], p[0]];
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function statusColor(status: string) {
  const m: Record<string, string> = { 可用: '#22c55e', 占用: '#f59e0b', 离线: '#6b7280', 畅通: '#22c55e', 施工: '#f59e0b' };
  return m[status] || '#6b7280';
}

function createTownIcon(total: number): L.DivIcon {
  return L.divIcon({
    className: 'er-marker-town-wrap',
    html: `<div class="er-marker-town"><span class="er-marker-town__n">${total}</span><span class="er-marker-town__t">资源</span></div>`,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  });
}

function createResourceIcon(resource: ResourceRecord): L.DivIcon {
  const colors: Record<string, [string, string]> = {
    救援队伍: ['#ef4444', '#f87171'],
    物资仓库: ['#f59e0b', '#fbbf24'],
    医疗站点: ['#22c55e', '#34d399'],
    应急通道: ['#a855f7', '#c084fc'],
  };
  const [bg, bd] = colors[resource.type] || ['#64748b', '#94a3b8'];
  const sc = statusColor(resource.status);
  const shortName = resource.name.length > 14 ? `${resource.name.slice(0, 14)}…` : resource.name;
  return L.divIcon({
    className: 'er-marker-res-wrap',
    html: `<div class="er-marker-res" style="background:${bg};border-color:${bd};box-shadow:0 0 12px ${bd}88">
      <span class="er-marker-res__name">${escapeHtml(shortName)}</span>
      <span class="er-marker-res__sub">${escapeHtml(resource.subType)} · <span style="color:${sc}">● ${escapeHtml(resource.status)}</span></span>
    </div>`,
    iconSize: [148, 44],
    iconAnchor: [74, 44],
  });
}

function townPopupHtml(town: TownItem): string {
  const total = town.teams + town.materials + town.medicals + town.channels;
  return `<div class="er-pop er-pop--town">
    <div class="er-pop__hero">
      <div class="er-pop__hero-bg" aria-hidden="true"></div>
      <div class="er-pop__hero-inner">
        <span class="er-pop__hero-ico" aria-hidden="true">◈</span>
        <div class="er-pop__hero-text">
          <div class="er-pop__hero-title">${escapeHtml(town.name)}</div>
          <div class="er-pop__hero-sub">应急救援资源 · 乡镇汇总</div>
        </div>
        <div class="er-pop__hero-pill"><span class="er-pop__hero-pill-n">${total}</span><span class="er-pop__hero-pill-t">合计</span></div>
      </div>
    </div>
    <div class="er-pop__grid4">
      <div class="er-pop__tile er-pop__tile--a"><span class="er-pop__tile-l">队伍</span><span class="er-pop__tile-v">${town.teams}<small>支</small></span></div>
      <div class="er-pop__tile er-pop__tile--b"><span class="er-pop__tile-l">仓库</span><span class="er-pop__tile-v">${town.materials}<small>个</small></span></div>
      <div class="er-pop__tile er-pop__tile--c"><span class="er-pop__tile-l">医疗</span><span class="er-pop__tile-v">${town.medicals}<small>个</small></span></div>
      <div class="er-pop__tile er-pop__tile--d"><span class="er-pop__tile-l">通道</span><span class="er-pop__tile-v">${town.channels}<small>条</small></span></div>
    </div>
    <div class="er-pop__foot"><span class="er-pop__foot-dot"></span>双击标记或此处提示 · 下钻至镇级资源分布</div>
  </div>`;
}

function resourceTypeClass(type: ResourceRecord['type']) {
  if (type === '救援队伍') return 'er-pop--res-team';
  if (type === '物资仓库') return 'er-pop--res-store';
  if (type === '医疗站点') return 'er-pop--res-med';
  return 'er-pop--res-route';
}

function resourcePopupHtml(resource: ResourceRecord): string {
  const sc = statusColor(resource.status);
  const tc = resourceTypeClass(resource.type);
  const badge = `<span class="er-pop__badge" style="--st:${sc}">${escapeHtml(resource.status)}</span>`;
  const head = `<div class="er-pop__res-head">
      <div class="er-pop__res-head-top">
        <span class="er-pop__res-kind">${escapeHtml(resource.type)}</span>
        ${badge}
      </div>
      <div class="er-pop__res-title">${escapeHtml(resource.name)}</div>
      <div class="er-pop__res-meta"><span class="er-pop__pin">▸</span>${escapeHtml(resource.town)}</div>
    </div>`;
  const row = (label: string, val: string, wide = false) =>
    `<div class="er-pop__kv ${wide ? 'er-pop__kv--wide' : ''}"><span class="er-pop__kv-k">${label}</span><span class="er-pop__kv-v">${val}</span></div>`;

  if (resource.type === '救援队伍') {
    return `<div class="er-pop er-pop--res ${tc}">${head}<div class="er-pop__body">
      ${row('队伍类型', escapeHtml(resource.subType))}
      ${row('在编人员', `${resource.personnel} 人`)}
      ${row('装备配置', escapeHtml(resource.equipment ?? ''), true)}
      ${row('资质等级', escapeHtml(resource.level ?? ''))}
    </div></div>`;
  }
  if (resource.type === '物资仓库') {
    const alertN = resource.expireAlert ?? 0;
    const alertHtml =
      alertN > 0
        ? `<span class="er-pop__warn">${alertN} 项临期</span>`
        : `<span class="er-pop__ok">无临期</span>`;
    return `<div class="er-pop er-pop--res ${tc}">${head}<div class="er-pop__body">
      ${row('仓库类型', escapeHtml(resource.subType))}
      ${row('临期预警', alertHtml)}
      ${row('储备概要', escapeHtml(resource.materials ?? ''), true)}
    </div></div>`;
  }
  if (resource.type === '医疗站点') {
    return `<div class="er-pop er-pop--res ${tc}">${head}<div class="er-pop__body">
      ${row('站点类型', escapeHtml(resource.subType))}
      ${row('床位 / ICU', `${resource.beds} / ${resource.icu}`)}
      ${row('急救车辆', `${resource.ambulances} 辆`)}
      ${row('救治能力', escapeHtml(resource.level ?? ''))}
    </div></div>`;
  }
  return `<div class="er-pop er-pop--res ${tc}">${head}<div class="er-pop__body">
    ${row('通道类型', escapeHtml(resource.subType))}
    ${row('终点位置', escapeHtml(resource.endpoint ?? ''), true)}
    ${row('通道里程', `${resource.distance} 公里`)}
    ${row('通行状态', `<strong style="color:${sc}">${escapeHtml(resource.status)}</strong>`)}
  </div></div>`;
}

function buildGeoJson() {
  if (!map) return;
  map.createPane('erGlowPane');
  const pane = map.getPane('erGlowPane')!;
  pane.style.zIndex = '402';
  pane.style.filter =
    'drop-shadow(0 0 10px rgba(129,140,248,0.85)) drop-shadow(0 0 22px rgba(99,102,241,0.35))';

  geoJsonLayer = L.geoJSON(geoData, {
    pane: 'erGlowPane',
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
}

function matchResourceFilters(resource: ResourceRecord, townOnly: string | null) {
  let areaMatch = props.areaFilter === 'all' || props.areaFilter === resource.town;
  if (townOnly) areaMatch = areaMatch && resource.town === townOnly;
  const typeMatch = props.typeFilter === 'all' || props.typeFilter === resource.type;
  const statusMatch = props.statusFilter === 'all' || props.statusFilter === resource.status;
  return areaMatch && typeMatch && statusMatch;
}

function redraw() {
  if (!map || !markerLayer) return;
  markerLayer.clearLayers();

  if (props.level === 'county') {
    townData.forEach((town) => {
      if (props.areaFilter !== 'all' && props.areaFilter !== town.name) return;
      const total = town.teams + town.materials + town.medicals + town.channels;
      const m = L.marker(toLeafletLatLng(town.center), { icon: createTownIcon(total) });
      m.bindPopup(townPopupHtml(town), { className: 'er-lf-popup', maxWidth: 320 });
      m.on('dblclick', () => emit('drillTown', town.name));
      markerLayer!.addLayer(m);
    });
    if (geoJsonLayer?.getBounds().isValid()) {
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [24, 24], maxZoom: 11 });
    }
    return;
  }

  if (props.level === 'town' && props.townName) {
    const town = townData.find((t) => t.name === props.townName);
    resourceData.forEach((resource) => {
      if (!matchResourceFilters(resource, props.townName)) return;
      const m = L.marker(toLeafletLatLng(resource.position), { icon: createResourceIcon(resource) });
      m.bindPopup(resourcePopupHtml(resource), { className: 'er-lf-popup', maxWidth: 340 });
      markerLayer!.addLayer(m);
    });
    if (town) {
      map.setView(toLeafletLatLng(town.center) as L.LatLngTuple, 14);
    }
    return;
  }

  if (props.level === 'resource' && props.resourceName) {
    const resource = resourceData.find((r) => r.name === props.resourceName);
    if (resource) {
      const m = L.marker(toLeafletLatLng(resource.position), { icon: createResourceIcon(resource) });
      m.bindPopup(resourcePopupHtml(resource), { className: 'er-lf-popup', maxWidth: 340 }).openPopup();
      markerLayer!.addLayer(m);
      map.setView(toLeafletLatLng(resource.position) as L.LatLngTuple, 16);
    }
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
    tilePane.style.filter =
      'invert(1) hue-rotate(218deg) brightness(0.72) saturate(0.5) contrast(1.08)';
  }

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  buildGeoJson();
  markerLayer = L.layerGroup().addTo(map);
  redraw();
}

onMounted(() => {
  initMap();
});

watch(
  () => [props.level, props.townName, props.resourceName, props.areaFilter, props.typeFilter, props.statusFilter],
  () => redraw(),
);

onBeforeUnmount(() => {
  map?.remove();
  map = null;
  geoJsonLayer = null;
  markerLayer = null;
});
</script>

<style scoped lang="less">
.er-map-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 280px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(129, 140, 248, 0.22);
  background: #0a0e1a;
  box-shadow:
    0 0 0 1px rgba(129, 140, 248, 0.06),
    inset 0 0 48px rgba(30, 27, 75, 0.2);
}

.er-map {
  width: 100%;
  height: 100%;
}
</style>

<style lang="less">
.er-marker-town-wrap {
  background: transparent !important;
  border: none !important;
}

.er-marker-town {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid rgba(129, 140, 248, 0.65);
  background: linear-gradient(145deg, rgba(79, 70, 229, 0.45), rgba(30, 27, 75, 0.92));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 22px rgba(99, 102, 241, 0.35);
  cursor: pointer;
}

.er-marker-town__n {
  font-size: 16px;
  font-weight: 800;
  color: #e0e7ff;
  line-height: 1.1;
}

.er-marker-town__t {
  font-size: 8px;
  color: rgba(199, 210, 254, 0.85);
}

.er-marker-res-wrap {
  background: transparent !important;
  border: none !important;
}

.er-marker-res {
  border: 2px solid;
  border-radius: 8px;
  padding: 6px 10px;
  width: 140px;
  box-sizing: border-box;
  cursor: pointer;
}

.er-marker-res__name {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}

.er-marker-res__sub {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.92);
  display: block;
  margin-top: 2px;
}

.er-lf-popup {
  .leaflet-popup-content-wrapper {
    background: transparent !important;
    border: none !important;
    border-radius: 12px !important;
    padding: 0 !important;
    box-shadow:
      0 24px 48px rgba(0, 0, 0, 0.65),
      0 0 0 1px rgba(129, 140, 248, 0.25),
      0 0 40px rgba(99, 102, 241, 0.12) !important;
    overflow: hidden;
  }

  .leaflet-popup-content {
    margin: 0 !important;
    min-width: 260px;
  }

  .leaflet-popup-tip-container {
    display: none;
  }

  .leaflet-popup-close-button {
    top: 10px !important;
    right: 10px !important;
    width: 22px !important;
    height: 22px !important;
    font-size: 16px !important;
    line-height: 20px !important;
    border-radius: 6px !important;
    background: rgba(15, 23, 42, 0.65) !important;
    color: #94a3b8 !important;
    z-index: 5;

    &:hover {
      color: #e0e7ff !important;
      background: rgba(79, 70, 229, 0.45) !important;
    }
  }
}

/* —— 乡镇汇总 —— */
.er-pop--town {
  background: linear-gradient(165deg, #0f172a 0%, #1e1b4b 48%, #0f172a 100%);
  border: 1px solid rgba(129, 140, 248, 0.35);
  border-radius: 12px;
  overflow: hidden;
}

.er-pop__hero {
  position: relative;
  padding: 14px 14px 12px;
}

.er-pop__hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 90% 80% at 20% 0%, rgba(129, 140, 248, 0.28), transparent 55%),
    radial-gradient(ellipse 70% 60% at 100% 100%, rgba(99, 102, 241, 0.18), transparent 50%);
  pointer-events: none;
}

.er-pop__hero-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.er-pop__hero-ico {
  font-size: 22px;
  color: #a5b4fc;
  filter: drop-shadow(0 0 8px rgba(129, 140, 248, 0.6));
  line-height: 1;
}

.er-pop__hero-text {
  flex: 1;
  min-width: 0;
}

.er-pop__hero-title {
  font-size: 15px;
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 12px rgba(129, 140, 248, 0.35);
}

.er-pop__hero-sub {
  margin-top: 3px;
  font-size: 10px;
  color: #94a3b8;
  letter-spacing: 0.06em;
}

.er-pop__hero-pill {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 6px 8px;
  border-radius: 10px;
  border: 1px solid rgba(129, 140, 248, 0.4);
  background: rgba(30, 27, 75, 0.65);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.er-pop__hero-pill-n {
  font-size: 20px;
  font-weight: 800;
  font-family: ui-monospace, monospace;
  color: #e0e7ff;
  line-height: 1.1;
}

.er-pop__hero-pill-t {
  font-size: 9px;
  color: #818cf8;
  margin-top: 2px;
}

.er-pop__grid4 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 0 12px 12px;
}

.er-pop__tile {
  border-radius: 8px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.er-pop__tile--a {
  border-color: rgba(239, 68, 68, 0.25);
  box-shadow: inset 0 0 20px rgba(239, 68, 68, 0.06);
}
.er-pop__tile--b {
  border-color: rgba(245, 158, 11, 0.25);
  box-shadow: inset 0 0 20px rgba(245, 158, 11, 0.06);
}
.er-pop__tile--c {
  border-color: rgba(34, 197, 94, 0.25);
  box-shadow: inset 0 0 20px rgba(34, 197, 94, 0.06);
}
.er-pop__tile--d {
  border-color: rgba(168, 85, 247, 0.25);
  box-shadow: inset 0 0 20px rgba(168, 85, 247, 0.06);
}

.er-pop__tile-l {
  font-size: 10px;
  color: #64748b;
  letter-spacing: 0.04em;
}

.er-pop__tile-v {
  font-size: 18px;
  font-weight: 800;
  color: #f1f5f9;
  font-family: ui-monospace, monospace;
}

.er-pop__tile-v small {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  margin-left: 2px;
}

.er-pop__foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px 12px;
  font-size: 10px;
  color: #64748b;
  border-top: 1px solid rgba(129, 140, 248, 0.15);
  background: rgba(2, 6, 23, 0.35);
}

.er-pop__foot-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.65);
  flex-shrink: 0;
}

/* —— 资源点（分类型强调色） —— */
.er-pop--res {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(129, 140, 248, 0.3);
  background: #0f172a;
}

.er-pop--res-team {
  --er-accent: #ef4444;
  --er-accent-dim: rgba(239, 68, 68, 0.15);
}
.er-pop--res-store {
  --er-accent: #f59e0b;
  --er-accent-dim: rgba(245, 158, 11, 0.15);
}
.er-pop--res-med {
  --er-accent: #22c55e;
  --er-accent-dim: rgba(34, 197, 94, 0.15);
}
.er-pop--res-route {
  --er-accent: #a855f7;
  --er-accent-dim: rgba(168, 85, 247, 0.15);
}

.er-pop__res-head {
  padding: 12px 36px 12px 14px;
  border-bottom: 1px solid rgba(129, 140, 248, 0.12);
  background:
    linear-gradient(135deg, var(--er-accent-dim), transparent 55%),
    linear-gradient(180deg, rgba(30, 27, 75, 0.5), rgba(15, 23, 42, 0.95));
  border-left: 3px solid var(--er-accent);
}

.er-pop__res-head-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.er-pop__res-kind {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--er-accent);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.5);
  box-shadow: inset 0 0 12px var(--er-accent-dim);
}

.er-pop__badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  color: var(--st, #e2e8f0);
  background: rgba(15, 23, 42, 0.75);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.35);
}

.er-pop__res-title {
  font-size: 14px;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.35;
  letter-spacing: 0.02em;
}

.er-pop__res-meta {
  margin-top: 6px;
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.er-pop__pin {
  color: #818cf8;
}

.er-pop__body {
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.er-pop__kv {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(148, 163, 184, 0.08);
  font-size: 11px;
}

.er-pop__kv--wide {
  flex-direction: column;
  gap: 4px;
}

.er-pop__kv--wide .er-pop__kv-v {
  text-align: left;
  line-height: 1.45;
}

.er-pop__kv-k {
  flex-shrink: 0;
  color: #64748b;
  min-width: 4.5em;
}

.er-pop__kv-v {
  color: #e2e8f0;
  font-weight: 600;
  text-align: right;
  word-break: break-word;
}

.er-pop__warn {
  color: #f87171;
  font-weight: 700;
}

.er-pop__ok {
  color: #4ade80;
  font-weight: 600;
}

.leaflet-control-zoom {
  border: 1px solid rgba(129, 140, 248, 0.35) !important;
  border-radius: 8px !important;
  overflow: hidden;
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
