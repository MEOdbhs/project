<template>
  <div class="hyd-card">
    <div class="hyd-card__head">
      <div class="hyd-card__title-row">
        <EnvironmentOutlined class="hyd-card__icon" />
        <span class="hyd-card__name">{{ station.name }}</span>
      </div>
      <div class="hyd-card__status">
        <span class="hyd-card__dot" :class="`hyd-card__dot--${station.status}`" />
        <span class="hyd-card__status-text" :class="`hyd-card__status-text--${station.status}`">{{
          statusLabel
        }}</span>
      </div>
    </div>
    <div class="hyd-card__river">{{ station.river }}</div>
    <div class="hyd-card__metrics">
      <div>
        <div class="hyd-card__metric-label">水位</div>
        <div
          class="hyd-card__metric-value"
          :class="station.status === 'danger' ? 'hyd-card__metric-value--danger' : 'hyd-card__metric-value--cyan'"
        >
          {{ station.waterLevel.toFixed(1) }}<span class="hyd-card__unit">m</span>
        </div>
        <div class="hyd-card__metric-sub">警戒 {{ station.warningLevel }}m</div>
      </div>
      <div>
        <div class="hyd-card__metric-label">流量</div>
        <div class="hyd-card__metric-value hyd-card__metric-value--cyan">
          {{ station.flow.toLocaleString() }}<span class="hyd-card__unit">m³/s</span>
        </div>
      </div>
    </div>
    <div ref="wrapRef" class="hyd-card__trend">
      <canvas ref="canvasRef" class="hyd-card__canvas" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EnvironmentOutlined } from '@ant-design/icons-vue';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import type { HydrologyStation } from './mockData';
import { stationStatusLabel } from './mockData';

const props = defineProps<{ station: HydrologyStation }>();

const wrapRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const statusLabel = computed(() => stationStatusLabel(props.station.status));

function drawTrend() {
  const canvas = canvasRef.value;
  const wrap = wrapRef.value;
  if (!canvas || !wrap) return;

  const width = wrap.clientWidth;
  const height = 40;
  if (width <= 0) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const data = props.station.trend;
  if (data.length < 2) return;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');

  ctx.beginPath();
  ctx.moveTo(0, height);
  data.forEach((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    ctx.lineTo(x, y);
  });
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  data.forEach((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

onMounted(() => {
  nextTick(drawTrend);
});

watch(
  () => props.station.trend,
  () => nextTick(drawTrend),
  { deep: true },
);

useResizeObserver(wrapRef, () => drawTrend());
</script>

<style lang="less" scoped>
.hyd-card {
  border-radius: 10px;
  padding: 14px;
  border: 1px solid rgba(56, 189, 248, 0.22);
  background: rgba(13, 31, 60, 0.35);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.06);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
}

.hyd-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.hyd-card__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.hyd-card__icon {
  flex-shrink: 0;
  font-size: 15px;
  color: #38bdf8;
}

.hyd-card__name {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hyd-card__status {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.hyd-card__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;

  &--normal {
    background: #22c55e;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
  }
  &--warning {
    background: #eab308;
    box-shadow: 0 0 8px rgba(234, 179, 8, 0.5);
  }
  &--danger {
    background: #ef4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.55);
  }
}

.hyd-card__status-text {
  font-size: 12px;

  &--normal {
    color: #4ade80;
  }
  &--warning {
    color: #facc15;
  }
  &--danger {
    color: #f87171;
  }
}

.hyd-card__river {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 10px;
}

.hyd-card__metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.hyd-card__metric-label {
  font-size: 11px;
  color: #64748b;
}

.hyd-card__metric-value {
  font-size: 17px;
  font-weight: 700;
  margin-top: 2px;

  &--cyan {
    color: #67e8f9;
  }
  &--danger {
    color: #f87171;
  }
}

.hyd-card__unit {
  font-size: 11px;
  font-weight: 400;
  margin-left: 2px;
}

.hyd-card__metric-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
}

.hyd-card__trend {
  margin-top: 10px;
  width: 100%;
  height: 40px;
}

.hyd-card__canvas {
  display: block;
  width: 100%;
  height: 40px;
}
</style>
