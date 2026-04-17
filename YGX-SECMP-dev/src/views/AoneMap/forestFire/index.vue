<template>
  <BigScreenShell>
    <div class="ff-page">
      <main class="ff-main">
        <ForestFireLeft />
        <ForestFireMap />
        <ForestFireRight />
      </main>
    </div>
  </BigScreenShell>
</template>

<script lang="ts" setup>
import BigScreenShell from '../BigScreenShell.vue';
import ForestFireLeft from './ForestFireLeft.vue';
import ForestFireMap from './ForestFireMap.vue';
import ForestFireRight from './ForestFireRight.vue';
</script>

<style lang="less" scoped>
.ff-page {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #020617;
  color: #f8fafc;
}

.ff-main {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}
</style>
