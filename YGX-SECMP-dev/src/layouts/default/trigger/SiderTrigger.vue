<template>
  <div @click.stop="toggleCollapsed">
    <MenuUnfoldOutlined v-if="getCollapsed" />
    <MenuFoldOutlined v-else />
    {{ getCollapsed ? '' : '收起菜单' }}
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

  export default defineComponent({
    name: 'SiderTrigger',
    components: { MenuUnfoldOutlined, MenuFoldOutlined },
    setup() {
      const { getCollapsed, toggleCollapsed } = useMenuSetting();

      return { getCollapsed, toggleCollapsed };
    },
  });
</script>
