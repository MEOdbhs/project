<template>
  <BigScreenShell>
    <div class="ps-page">
      <main class="ps-main">
        <PublicSafetyLeft />
        <section class="ps-center">
          <div class="ps-center__stats">
            <PublicSafetyStatCard title="今日实时告警" :value="42" unit="条" :trend="{ value: 5, isUp: true }" :icon="WarningOutlined" color="red" />
            <PublicSafetyStatCard title="告警处置闭环率" :value="98.5" unit="%" :trend="{ value: 0.5, isUp: true }" :icon="CheckCircleOutlined" color="green" />
            <PublicSafetyStatCard title="设备在线率" :value="96.2" unit="%" :trend="{ value: 1.2, isUp: false }" :icon="WifiOutlined" color="blue" />
            <PublicSafetyStatCard title="隐患排查数" :value="1256" unit="起" :trend="{ value: 8, isUp: true }" :icon="SafetyCertificateOutlined" color="orange" />
          </div>
          <PublicSafetyMap />
        </section>
        <PublicSafetyRight />
      </main>
      <footer class="ps-foot">
        <span>数据同步中: 124ms 延迟</span>
        <span>存储空间: 64.2TB / 128TB</span>
        <span>© 2026 公共安全一张图</span>
      </footer>
    </div>
  </BigScreenShell>
</template>

<script lang="ts" setup>
import { CheckCircleOutlined, SafetyCertificateOutlined, WarningOutlined, WifiOutlined } from '@ant-design/icons-vue';
import BigScreenShell from '../BigScreenShell.vue';
import PublicSafetyLeft from './PublicSafetyLeft.vue';
import PublicSafetyMap from './PublicSafetyMap.vue';
import PublicSafetyRight from './PublicSafetyRight.vue';
import PublicSafetyStatCard from './PublicSafetyStatCard.vue';
import PublicSafetyTopBar from './PublicSafetyTopBar.vue';
</script>

<style lang="less" scoped>
.ps-page {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse 80% 40% at 50% 0%, rgba(56, 189, 248, 0.12), transparent 55%),
    #020617;
  color: #e2e8f0;
}
.ps-main {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 12px;
  padding: 12px;
  overflow: hidden;
}
.ps-center {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ps-center__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.ps-foot {
  display: flex;
  gap: 20px;
  font-size: 10px;
  color: #94a3b8;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 8px 16px;
}
</style>
