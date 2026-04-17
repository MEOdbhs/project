<template>
  <div class="hc-stats">
    <div class="hc-stat">
      <div class="hc-stat__ico hc-stat__ico--blue"><DashboardOutlined /></div>
      <div>
        <div class="hc-stat__lbl">危化企业总数</div>
        <div class="hc-stat__val">515<span class="hc-stat__unit">家</span></div>
      </div>
    </div>
    <div class="hc-stat">
      <div class="hc-stat__ico hc-stat__ico--orange"><WarningOutlined /></div>
      <div>
        <div class="hc-stat__lbl">重大危险源</div>
        <div class="hc-stat__val">143<span class="hc-stat__unit">处</span></div>
      </div>
    </div>
    <div class="hc-stat">
      <div class="hc-stat__ico hc-stat__ico--red"><AlertOutlined /></div>
      <div>
        <div class="hc-stat__lbl">高危化学品</div>
        <div class="hc-stat__val">28<span class="hc-stat__unit">种</span></div>
      </div>
    </div>
    <div class="hc-stat">
      <div class="hc-stat__ico hc-stat__ico--cyan"><CarOutlined /></div>
      <div>
        <div class="hc-stat__lbl">在途运输车辆</div>
        <div class="hc-stat__val">86<span class="hc-stat__unit">辆</span></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AlertOutlined, CarOutlined, DashboardOutlined, WarningOutlined } from '@ant-design/icons-vue';
</script>

<style lang="less" scoped>
.hc-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.hc-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(56, 189, 248, 0.15);
  background: rgba(15, 23, 42, 0.35);
}

.hc-stat__ico {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #fff;

  &--blue {
    background: #2563eb;
  }
  &--orange {
    background: #ea580c;
  }
  &--red {
    background: #dc2626;
  }
  &--cyan {
    background: #0891b2;
  }
}

.hc-stat__lbl {
  font-size: 11px;
  color: #94a3b8;
}

.hc-stat__val {
  font-size: 17px;
  font-weight: 700;
  color: #f8fafc;
}

.hc-stat__unit {
  font-size: 11px;
  font-weight: 400;
  color: #64748b;
  margin-left: 2px;
}
</style>
