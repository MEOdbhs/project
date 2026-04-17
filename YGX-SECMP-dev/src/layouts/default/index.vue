<template>
  <Layout :class="prefixCls" v-bind="lockEvents">
    <LayoutFeatures />
    <LayoutHeader fixed v-if="getShowFullHeaderRef && !isQD" />
    <LayoutHeaderQD fixed v-if="isQD" @change-app="changeApp" />
    <Layout :class="[layoutClass]">
      <LayoutSideBar v-if="(getShowSidebar || getIsMobile) && !isEnterpriseAnalysis" :currentPathObj="currentPathObj" />
      <Layout :class="`${prefixCls}-main`">
        <LayoutMultipleHeader />
        <LayoutContent />
        <LayoutFooter />
      </Layout>
    </Layout>
  </Layout>
</template>

<script lang="ts">
  import { defineComponent, computed, unref, ref } from 'vue';
  import { Layout } from 'ant-design-vue';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  import LayoutHeader from './header/index.vue';
  import LayoutHeaderQD from './header/indexQD.vue';
  import LayoutContent from './content/index.vue';
  import LayoutSideBar from './sider/index.vue';
  import LayoutMultipleHeader from './header/MultipleHeader.vue';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLockPage } from '/@/hooks/web/useLockPage';

  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { ThemeEnum } from '/@/enums/appEnum';
  import { useRouter } from 'vue-router';
  export default defineComponent({
    name: 'DefaultLayout',
    components: {
      LayoutFeatures: createAsyncComponent(() => import('/@/layouts/default/feature/index.vue')),
      LayoutFooter: createAsyncComponent(() => import('/@/layouts/default/footer/index.vue')),
      LayoutHeader,
      LayoutHeaderQD,
      LayoutContent,
      LayoutSideBar,
      LayoutMultipleHeader,
      Layout,
    },
    setup() {
      const { prefixCls } = useDesign('default-layout');
      const { getIsMobile } = useAppInject();
      const { getShowFullHeaderRef } = useHeaderSetting();
      const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting();
      const { currentRoute } = useRouter();
      // Create a lock screen monitor
      const lockEvents = useLockPage();
      const { getDarkMode } = useRootSetting();
      const isQD = computed(() => {
        return getDarkMode.value === ThemeEnum.LIGHT_QD;
      });

      const isEnterpriseAnalysis = computed(() => {
        return currentRoute.value.path === '/enterprise/statisticAnalysis' || currentRoute.value.path === '/statistics';
      });
      const layoutClass = computed(() => {
        let cls: string[] = ['ant-layout'];
        if (unref(getIsMixSidebar) || unref(getShowMenu)) {
          cls.push('ant-layout-has-sider');
        }
        return cls;
      });
      const currentPathObj = ref({
        currentAppPath: '',
        currentRoutePath: '',
      });
      const changeApp = (obj) => {
        currentPathObj.value = obj;
      };
      return {
        getShowFullHeaderRef,
        getShowSidebar,
        prefixCls,
        getIsMobile,
        getIsMixSidebar,
        layoutClass,
        lockEvents,
        isQD,
        changeApp,
        currentPathObj,
        isEnterpriseAnalysis
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-default-layout';

  .@{prefix-cls} {
    display: flex;
    width: 100%;
    min-height: 100%;
    height: 100%;
    background-color: @content-bg;
    flex-direction: column;

    > .ant-layout {
      min-height: 100%;
      flex: 1;
    }

    &-main {
      width: 100%;
      margin-left: 1px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
  
  // 在固定尺寸容器内，允许内容自然扩展和滚动
  .app-fixed-wrapper .@{prefix-cls} {
    min-height: 1080px;
    height: auto;
    // 不限制最大高度，允许内容超出时滚动
  }
  
  // 正常屏幕（非固定尺寸容器）确保占满高度
  .app-container:not(.app-container-fixed) .@{prefix-cls} {
    height: 100vh;
    min-height: 100vh;
  }
  html[data-theme='light'] .@{prefix-cls} {
    .ant-layout {
      background-color: #dce4ef !important;
    }
  }
  html[data-theme='lightQD'] .@{prefix-cls} {
    .ant-layout {
      background-color: #dce4ef !important;
    }
  }
  html[data-theme='dark'] .@{prefix-cls} {
    .ant-layout {
      background-color: #000000 !important;
    }
  }
</style>
