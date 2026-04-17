<template>
  <div class="aone-map-shell">
    <ScreenHeader />
    <div class="aone-map-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ScreenHeader from './ScreenHeader.vue';

const route = useRoute();
const router = useRouter();

/** 默认进入应急安全一张图作为入口页 */
const defaultFirstPath = '/emergency-safety';

function normalizePath(p: string) {
  return p.replace(/\/+$/, '') || '/';
}

function goDefaultIfAoneMapRoot() {
  const p = normalizePath(route.path);
  if (p.toLowerCase() === '/aonemap') {
    router.replace(defaultFirstPath);
  }
}

onMounted(goDefaultIfAoneMapRoot);
watch(() => route.path, goDefaultIfAoneMapRoot);
</script>

<style lang="less" scoped>
.aone-map-shell {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-height: 100vh;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: #070b12;
  color: #e8eef7;
}

.aone-map-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
