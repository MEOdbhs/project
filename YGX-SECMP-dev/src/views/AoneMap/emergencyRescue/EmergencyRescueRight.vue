<template>
  <div class="er-col">
    <div class="glass er-panel">
      <div class="er-panel-head">
        <span class="er-panel-bar er-panel-bar--green" />
        <span class="er-panel-title">医疗站点能力</span>
      </div>
      <div class="er-med-grid">
        <div class="er-med-cell er-med--g">
          <div class="er-med-label">站点总数</div>
          <div class="er-med-val">6</div>
        </div>
        <div class="er-med-cell er-med--b">
          <div class="er-med-label">床位数</div>
          <div class="er-med-val">320</div>
        </div>
        <div class="er-med-cell er-med--p">
          <div class="er-med-label">急救车</div>
          <div class="er-med-val">18</div>
        </div>
        <div class="er-med-cell er-med--c">
          <div class="er-med-label">ICU</div>
          <div class="er-med-val">45</div>
        </div>
      </div>
      <div class="er-med-list custom-scrollbar">
        <div class="list-item er-row border-l-green">
          <div>
            <div class="er-row-title">永靖县人民医院</div>
            <div class="er-row-sub">A级 | 床位120 | ICU 20</div>
          </div>
          <span class="er-stat er-stat--ok">可用</span>
        </div>
        <div class="list-item er-row border-l-green">
          <div>
            <div class="er-row-title">刘家峡镇卫生院</div>
            <div class="er-row-sub">B级 | 床位60 | ICU 8</div>
          </div>
          <span class="er-stat er-stat--busy">占用</span>
        </div>
      </div>
    </div>

    <div class="glass er-panel er-panel--grow">
      <div class="er-panel-head">
        <span class="er-panel-bar er-panel-bar--violet" />
        <span class="er-panel-title">应急通道状态</span>
      </div>
      <div class="er-scroll custom-scrollbar">
        <div v-for="c in channelRows" :key="c.name" class="list-item er-ch-row" :class="c.border">
          <div class="er-ch-main">
            <div class="er-row-title">{{ c.name }}</div>
            <div class="er-row-sub">{{ c.route }}</div>
          </div>
          <div class="er-ch-status" :class="c.statusClass">{{ c.statusText }}</div>
        </div>
      </div>
    </div>

    <div class="glass er-panel er-panel--grow">
      <div class="er-panel-head">
        <span class="er-panel-bar er-panel-bar--cyan" />
        <span class="er-panel-title">资源调用记录</span>
        <span class="er-panel-extra">近7天</span>
      </div>
      <div class="er-scroll custom-scrollbar">
        <div v-for="r in callRows" :key="r.title + r.date" class="list-item er-call-row border-l-cyan">
          <div>
            <div class="er-row-title">{{ r.title }}</div>
            <div class="er-row-sub">{{ r.date }} | {{ r.action }}</div>
          </div>
          <div class="er-call-flag">{{ r.flag }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const channelRows = [
  { name: 'G213国道-永靖段', route: '刘家峡镇 → 盐锅峡镇', statusText: '畅通', statusClass: 'is-green', border: 'border-l-green' },
  { name: '永靖县主干道A线', route: '县城 → 太极镇', statusText: '畅通', statusClass: 'is-green', border: 'border-l-green' },
  { name: '乡村公路B线', route: '岘塬镇 → 三塬镇', statusText: '施工', statusClass: 'is-yellow', border: 'border-l-yellow' },
  { name: '应急疏散通道1号', route: '县城东部区域', statusText: '畅通', statusClass: 'is-green', border: 'border-l-green' },
  { name: '森林消防专用道', route: '北部林区', statusText: '畅通', statusClass: 'is-green', border: 'border-l-green' },
];

const callRows = [
  { title: '永靖县消防救援大队', date: '2024-04-09', action: '火灾救援', flag: '已归队' },
  { title: '县级物资仓库', date: '2024-04-08', action: '物资调拨', flag: '已完成' },
  { title: '刘家峡镇卫生院', date: '2024-04-07', action: '医疗救治', flag: '已完成' },
  { title: '盐锅峡镇救援队', date: '2024-04-06', action: '洪涝抢险', flag: '已完成' },
  { title: '永靖县人民医院', date: '2024-04-05', action: '应急演练', flag: '已完成' },
];
</script>

<style scoped lang="less">
@glass-bg: linear-gradient(135deg, rgba(13, 31, 60, 0.8) 0%, rgba(10, 22, 40, 0.9) 100%);
@border: rgba(64, 196, 255, 0.15);

.er-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.glass {
  background: @glass-bg;
  border: 1px solid @border;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.er-panel {
  padding: 14px;
}

.er-col > .glass:first-child {
  flex-shrink: 0;
}

.er-panel--grow {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.er-panel-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(64, 196, 255, 0.1);
  flex-shrink: 0;
}

.er-panel-bar {
  width: 4px;
  height: 16px;
  border-radius: 2px;
  background: linear-gradient(180deg, #3b82f6 0%, #06b6d4 100%);

  &--green {
    background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  }
  &--violet {
    background: linear-gradient(180deg, #8b5cf6 0%, #6366f1 100%);
  }
  &--cyan {
    background: linear-gradient(180deg, #06b6d4 0%, #0891b2 100%);
  }
}

.er-panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #60a5fa;
  letter-spacing: 1px;
}

.er-panel-extra {
  margin-left: auto;
  font-size: 11px;
  color: #64748b;
}

.er-med-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}

.er-med-cell {
  text-align: center;
  padding: 8px 4px;
  border-radius: 8px;
}

.er-med--g {
  background: rgba(6, 78, 59, 0.3);
}
.er-med--b {
  background: rgba(30, 58, 138, 0.3);
}
.er-med--p {
  background: rgba(88, 28, 135, 0.3);
}
.er-med--c {
  background: rgba(14, 116, 144, 0.3);
}

.er-med-label {
  font-size: 10px;
  color: #94a3b8;
}

.er-med-val {
  font-size: 15px;
  font-weight: 700;
  margin-top: 2px;
}

.er-med--g .er-med-val {
  color: #4ade80;
}
.er-med--b .er-med-val {
  color: #60a5fa;
}
.er-med--p .er-med-val {
  color: #c084fc;
}
.er-med--c .er-med-val {
  color: #22d3ee;
}

.er-med-list {
  max-height: min(88px, 15vh);
  overflow-y: auto;
}

.list-item {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
  border-left: 3px solid;
  transition: background 0.2s;

  &:hover {
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
  }
}

.border-l-green {
  border-left-color: #22c55e;
}
.border-l-yellow {
  border-left-color: #eab308;
}
.border-l-cyan {
  border-left-color: #06b6d4;
}

.er-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 8px;
}

.er-row-title {
  font-size: 13px;
  color: #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

.er-row-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.er-stat {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 500;
  flex-shrink: 0;

  &--ok {
    background: rgba(16, 185, 129, 0.9);
    color: #fff;
  }
  &--busy {
    background: rgba(245, 158, 11, 0.9);
    color: #fff;
  }
}

.er-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.er-ch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 8px;
}

.er-ch-status {
  font-size: 11px;
  text-align: right;
  flex-shrink: 0;
  margin-left: 8px;

  &.is-green {
    color: #4ade80;
  }
  &.is-yellow {
    color: #fbbf24;
  }
}

.er-call-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 8px;
}

.er-call-flag {
  font-size: 11px;
  color: #22d3ee;
  flex-shrink: 0;
}

.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #3b82f6 0%, #06b6d4 100%);
    border-radius: 2px;
  }
}
</style>
