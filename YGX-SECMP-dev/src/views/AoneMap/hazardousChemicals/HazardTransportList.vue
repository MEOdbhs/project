<template>
  <div class="hc-veh">
    <div v-for="v in vehicles" :key="v.id" class="hc-veh__row">
      <div class="hc-veh__ico" :class="icoClass(v.status)">
        <CarOutlined />
      </div>
      <div class="hc-veh__body">
        <div class="hc-veh__top">
          <span class="hc-veh__plate">{{ v.plate }}</span>
          <span class="hc-veh__st" :class="stClass(v.status)">{{ v.status }}</span>
        </div>
        <div class="hc-veh__ent">{{ v.enterprise }}</div>
        <div class="hc-veh__bot">
          <span>驾驶员: {{ v.driver }}</span>
          <span class="hc-veh__route">{{ v.route }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CarOutlined } from '@ant-design/icons-vue';
import type { TransportVehicle } from './types';

defineProps<{ vehicles: TransportVehicle[] }>();

function icoClass(s: TransportVehicle['status']) {
  if (s === '在途') return 'hc-veh__ico--green';
  if (s === '违规') return 'hc-veh__ico--red';
  return 'hc-veh__ico--muted';
}

function stClass(s: TransportVehicle['status']) {
  if (s === '在途') return 'hc-veh__st--green';
  if (s === '违规') return 'hc-veh__st--red';
  return 'hc-veh__st--muted';
}
</script>

<style lang="less" scoped>
.hc-veh {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hc-veh__row {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.hc-veh__ico {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;

  &--green {
    background: rgba(74, 222, 128, 0.15);
    color: #4ade80;
  }
  &--red {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    animation: hc-blink 1.5s ease-in-out infinite;
  }
  &--muted {
    background: #334155;
    color: #94a3b8;
  }
}

@keyframes hc-blink {
  50% {
    opacity: 0.75;
  }
}

.hc-veh__body {
  flex: 1;
  min-width: 0;
}

.hc-veh__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hc-veh__plate {
  font-size: 13px;
  font-weight: 700;
  color: #f8fafc;
}

.hc-veh__st {
  font-size: 10px;
  font-weight: 700;

  &--green {
    color: #4ade80;
  }
  &--red {
    color: #f87171;
  }
  &--muted {
    color: #94a3b8;
  }
}

.hc-veh__ent {
  font-size: 10px;
  color: #64748b;
  margin-top: 2px;
}

.hc-veh__bot {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #64748b;
  margin-top: 6px;
}

.hc-veh__route {
  color: #38bdf8;
}
</style>
