<template>
  <header class="ps-top">
    <div class="ps-top__left">
      <div class="ps-top__title">公共安全一张图</div>
      <div class="ps-top__sub">PUBLIC SAFETY INTELLIGENT SUPERVISION PLATFORM</div>
    </div>
    <div class="ps-top__center">
      <div class="ps-top__time">{{ timeText }}</div>
      <div class="ps-top__date">{{ dateText }}</div>
    </div>
    <div class="ps-top__right">
      <span>24°C</span>
      <span>湿度 68%</span>
      <input class="ps-top__search" type="text" placeholder="搜索区域/点位..." />
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

const now = ref(new Date());
setInterval(() => { now.value = new Date(); }, 1000);

const dateText = computed(() => {
  const d = now.value;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
});
const timeText = computed(() => now.value.toLocaleTimeString('zh-CN', { hour12: false }));
</script>

<style lang="less" scoped>
.ps-top {
  height: 60px;
  flex-shrink: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.25));
}
.ps-top__title { font-size: 18px; font-weight: 700; color: #22d3ee; }
.ps-top__sub { font-size: 9px; letter-spacing: .12em; color: #64748b; }
.ps-top__center { text-align: center; }
.ps-top__time { font-size: 28px; font-weight: 700; color: #f8fafc; line-height: 1; }
.ps-top__date { font-size: 10px; color: #94a3b8; }
.ps-top__right { justify-self: end; display: flex; align-items: center; gap: 10px; font-size: 11px; color: #94a3b8; }
.ps-top__search {
  width: 170px;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(2,6,23,.55);
  color: #cbd5e1;
  font-size: 11px;
}
</style>
