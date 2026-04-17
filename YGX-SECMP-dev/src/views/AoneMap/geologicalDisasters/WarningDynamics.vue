<template>
  <div class="dyn">
    <div v-for="(item, i) in items" :key="i" class="dyn__row">
      <span :class="['dyn__dot', dotClass(item.type)]" />
      <div class="dyn__text">
        <p class="dyn__title">{{ item.title }}</p>
        <p class="dyn__time">{{ item.time }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
type DotType = 'red' | 'orange' | 'yellow' | 'info';

interface DynItem {
  time: string;
  title: string;
  type: DotType;
}

const items: DynItem[] = [
  { time: '09:30', title: '刘家峡镇黄河沿岸发布滑坡红色预警', type: 'red' },
  { time: '08:45', title: '盐锅峡镇库区边坡风险升级至橙色', type: 'orange' },
  { time: '07:20', title: '西河镇完成泥石流隐患点汛前排查', type: 'info' },
  { time: '昨日', title: '县政府召开地质灾害防治工作会议', type: 'info' },
];

function dotClass(t: DotType) {
  return {
    red: 'dyn__dot--red',
    orange: 'dyn__dot--orange',
    yellow: 'dyn__dot--yellow',
    info: 'dyn__dot--info',
  }[t];
}
</script>

<style lang="less" scoped>
.dyn {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dyn__row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.dyn__dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 999px;

  &--red {
    background: #ef4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.55);
  }
  &--orange {
    background: #f97316;
  }
  &--yellow {
    background: #eab308;
  }
  &--info {
    background: #38bdf8;
  }
}

.dyn__text {
  flex: 1;
  min-width: 0;
}

.dyn__title {
  margin: 0;
  font-size: 13px;
  color: #e2e8f0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dyn__time {
  margin: 4px 0 0;
  font-size: 12px;
  color: #64748b;
}
</style>
