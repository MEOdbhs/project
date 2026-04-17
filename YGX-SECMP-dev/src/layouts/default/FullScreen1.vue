<!-- 全屏布局1，未完成————有需要后续再扩展 -->
<template>
  <Layout class="w-full h-full">
    <RouterView />
  </Layout>
</template>

<script setup>
  import { Layout } from 'ant-design-vue';
</script>
<style lang="less">
  .ant-layout {
    background-color: #dce4ef !important;
  }
</style>
