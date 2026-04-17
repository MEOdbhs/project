<template>
  <div class="hc-per">
    <div class="hc-per__grid">
      <div class="hc-per__cell">
        <div class="hc-per__n">98.5%</div>
        <div class="hc-per__t">特种作业证持证率</div>
      </div>
      <div class="hc-per__cell">
        <div class="hc-per__n hc-per__n--green">1,240</div>
        <div class="hc-per__t">培训合格人数</div>
      </div>
    </div>
    <div class="hc-per__warn">
      <WarningOutlined class="hc-per__wico" />
      <div>
        <div class="hc-per__wt">资质即将到期提醒</div>
        <div class="hc-per__ws">共有 12 名从业人员证书将在30天内到期</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { WarningOutlined } from '@ant-design/icons-vue';
</script>

<style lang="less" scoped>
.hc-per__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}

.hc-per__cell {
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  text-align: center;
}

.hc-per__n {
  font-size: 22px;
  font-weight: 800;
  color: #38bdf8;

  &--green {
    color: #4ade80;
  }
}

.hc-per__t {
  font-size: 10px;
  color: #64748b;
  margin-top: 4px;
}

.hc-per__warn {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.22);
}

.hc-per__wico {
  font-size: 20px;
  color: #f87171;
  flex-shrink: 0;
}

.hc-per__wt {
  font-size: 12px;
  font-weight: 700;
  color: #f87171;
}

.hc-per__ws {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 4px;
}
</style>
