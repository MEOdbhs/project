<template>
  <Header :class="getHeaderClass">
    <!-- left start -->
    <div :class="`${prefixCls}-left`">
      <!-- logo -->
      <AppLogo v-if="getShowHeaderLogo || getIsMobile" :class="`${prefixCls}-logo`" :theme="getHeaderTheme" :style="getLogoWidth" />
      <LayoutTrigger
        v-if="(getShowContent && getShowHeaderTrigger && !getSplit && !getIsMixSidebar) || getIsMobile"
        :theme="getHeaderTheme"
        :sider="false"
      />
      <LayoutBreadcrumb v-if="getShowContent && getShowBread" :theme="getHeaderTheme" />
      <!-- 欢迎语 -->
      <span
        v-if="getShowContent && getShowBreadTitle && !getIsMobile"
        :class="[prefixCls, `${prefixCls}--${getHeaderTheme}`, 'headerIntroductionClass']"
      >
        {{ t('layout.header.welcomeIn') }} {{ title }}
      </span>
    </div>
    <!-- left end -->

    <!-- menu start -->
    <div :class="`${prefixCls}-menu`" v-if="getShowTopMenu && !getIsMobile">
      <LayoutMenu :isHorizontal="true" :theme="getHeaderTheme" :splitType="getSplitType" :menuMode="getMenuMode" />
    </div>
    <!-- menu-end -->

    <!-- action  -->
    <div :class="`${prefixCls}-action`">
       <a-select v-model:value="userStore.currentEnterpriseCode" style="width: 160px;">
        <a-select-option v-for="item in enterpriseList" :key="item.orgCode" :value="item.orgCode">
          {{ item.departName }}
        </a-select-option>
      </a-select>
       <router-link v-if="isSupervisor" to="/enterprise/statisticAnalysis" class="enterprise-analysis-icon">
        <img  src="/@/assets/svg/analysis.svg" alt="企业统计分析" style="width: 20px; height: 20px;" />
       </router-link>
      <AppSearch :class="`${prefixCls}-action__item `" v-if="getShowSearch" />

      <!-- <ErrorAction v-if="getUseErrorHandle" :class="`${prefixCls}-action__item error-action`" /> -->

      <Notify v-if="getShowNotice" :class="`${prefixCls}-action__item notify-item`" />

      <!-- <FullScreen v-if="getShowFullScreen" :class="`${prefixCls}-action__item fullscreen-item`" />

      <LockScreen v-if="getUseLockPage" />

      <AppLocalePicker v-if="getShowLocalePicker" :reload="true" :showText="false" :class="`${prefixCls}-action__item`" /> -->

      <UserDropDown :theme="getHeaderTheme" />

      <SettingDrawer v-if="getShowSetting" :class="`${prefixCls}-action__item`" />
      <!-- ai助手 -->
      <!-- <Aide v-if="getAiIconShow" /> -->
    </div>
  </Header>
  <LoginSelect ref="loginSelectRef" @success="loginSelectOk" />
</template>
<script lang="ts">
  import { defineComponent, unref, computed, ref, onMounted, toRaw, watchEffect } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { propTypes } from '/@/utils/propTypes';

  import { Layout } from 'ant-design-vue';
  import { AppLogo } from '/@/components/Application';
  import LayoutMenu from '../menu/index.vue';
  import LayoutTrigger from '../trigger/index.vue';

  import { AppSearch } from '/@/components/Application';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';
  import { SettingButtonPositionEnum } from '/@/enums/appEnum';
  import { AppLocalePicker } from '/@/components/Application';

  import { UserDropDown, LayoutBreadcrumb, FullScreen, Notify, ErrorAction, LockScreen } from './components';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useLocale } from '/@/locales/useLocale';

  import LoginSelect from '/@/views/sys/login/LoginSelect.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Aide from '@/views/dashboard/ai/components/aide/index.vue';
  import { getDictItems } from "@/api/common/api";
  const { t } = useI18n();

  export default defineComponent({
    name: 'LayoutHeader',
    components: {
      Header: Layout.Header,
      AppLogo,
      LayoutTrigger,
      LayoutBreadcrumb,
      LayoutMenu,
      UserDropDown,
      AppLocalePicker,
      FullScreen,
      Notify,
      AppSearch,
      ErrorAction,
      LockScreen,
      LoginSelect,
      SettingDrawer: createAsyncComponent(() => import('/@/layouts/default/setting/index.vue'), {
        loading: true,
      }),
      Aide,
    },
    props: {
      fixed: propTypes.bool,
    },
    setup(props) {
      const { prefixCls } = useDesign('layout-header');
      const userStore = useUserStore();
      console.log('userStore',userStore);
      // 使用 computed 响应式获取企业列表
      const enterpriseList = computed(() => userStore.getUserInfo?.enterpriseList);
      const isSupervisor = computed(() => userStore.getUserInfo?.userType == 1);
      // 监听企业列表变化
      watchEffect(() => {
        if (enterpriseList.value && enterpriseList.value.length > 0) {
          // 在这里可以执行企业列表加载完成后的逻辑
          userStore.setCurrentEnterpriseCode(enterpriseList.value[0].orgCode)
        }
      });
      
      const { getShowTopMenu, getShowHeaderTrigger, getSplit, getIsMixMode, getMenuWidth, getIsMixSidebar } = useMenuSetting();
      const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition, getAiIconShow } = useRootSetting();
      const { title } = useGlobSetting();

      const {
        getHeaderTheme,
        getShowFullScreen,
        getShowNotice,
        getShowContent,
        getShowBread,
        getShowHeaderLogo,
        getShowHeader,
        getShowSearch,
        getUseLockPage,
        getShowBreadTitle,
      } = useHeaderSetting();

      const { getShowLocalePicker } = useLocale();

      const { getIsMobile } = useAppInject();

      const getHeaderClass = computed(() => {
        const theme = unref(getHeaderTheme);
        return [
          prefixCls,
          {
            [`${prefixCls}--fixed`]: props.fixed,
            [`${prefixCls}--mobile`]: unref(getIsMobile),
            [`${prefixCls}--${theme}`]: theme,
          },
        ];
      });

      const getShowSetting = computed(() => {
        if (!unref(getShowSettingButton)) {
          return false;
        }
        const settingButtonPosition = unref(getSettingButtonPosition);

        if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
          return unref(getShowHeader);
        }
        return settingButtonPosition === SettingButtonPositionEnum.HEADER;
      });

      const getLogoWidth = computed(() => {
        if (!unref(getIsMixMode) || unref(getIsMobile)) {
          return {};
        }
        const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth);
        return { width: `${width}px` };
      });

      const getSplitType = computed(() => {
        return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
      });

      const getMenuMode = computed(() => {
        return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
      });

      /**
       * 初始化网络配置：获取内外网URL配置并存储到 sessionStorage
       */
      function initNetworkConfig() {
        console.log('初始化网络配置');
        getDictItems('hk_url').then((res) => {
          console.log('获取到网络配置:', res);
          
          if (res && res.length) {
            // 判断当前是内网还是外网
            const isIntranet = window.location.origin.includes('http://172')||window.location.origin.includes('https://172'); // 确认内网
            // 找到内网和外网配置
            const intranetConfig = res.find(
              (item: any) => typeof item.label === 'string' && item.label.includes('内网'),
            );
            const extranetConfig = res.find(
              (item: any) => typeof item.label === 'string' && item.label.includes('外网'),
            );
            
            // 存储内外网配置到 sessionStorage
            if (intranetConfig && intranetConfig.value) {
              sessionStorage.setItem('hk_intranet_url', intranetConfig.value);
              console.log('内网配置已存储:', intranetConfig.value);
            }
            if (extranetConfig && extranetConfig.value) {
              sessionStorage.setItem('hk_extranet_url', extranetConfig.value);
              console.log('外网配置已存储:', extranetConfig.value);
            }
            
            // 存储当前网络环境（内网/外网）
            const networkType = isIntranet ? 'intranet' : 'extranet';
            sessionStorage.setItem('network_type', networkType);
            console.log('当前网络环境:', networkType);
          }
        }).catch((error) => {
          console.error('获取网络配置失败:', error);
        });
      }

      /**
       * 首页多租户部门弹窗逻辑
       */
      const loginSelectRef = ref();

      function showLoginSelect() {
        //update-begin---author:liusq  Date:20220101  for：判断登录进来是否需要弹窗选择租户----
        //判断是否是登陆进来
        const loginInfo = toRaw(userStore.getLoginInfo) || {};
        if (!!loginInfo.isLogin) {
          loginSelectRef.value.show(loginInfo);
        }
        //update-end---author:liusq  Date:20220101  for：判断登录进来是否需要弹窗选择租户----
      }

      function loginSelectOk() {
        console.log('成功。。。。。');
      }


      onMounted(() => {
        // 初始化网络配置
        initNetworkConfig();
        // 显示登录选择弹窗
        showLoginSelect();
      });

      return {
        prefixCls,
        getHeaderClass,
        getShowHeaderLogo,
        getHeaderTheme,
        getShowHeaderTrigger,
        getIsMobile,
        getShowBreadTitle,
        getShowBread,
        getShowContent,
        getSplitType,
        getSplit,
        getMenuMode,
        getShowTopMenu,
        getShowLocalePicker,
        getShowFullScreen,
        getShowNotice,
        getUseErrorHandle,
        getLogoWidth,
        getIsMixSidebar,
        getShowSettingButton,
        getShowSetting,
        getShowSearch,
        getUseLockPage,
        loginSelectOk,
        loginSelectRef,
        title,
        userStore,
        t,
        isSupervisor,
        getAiIconShow,
        enterpriseList, // 导出企业列表供模板使用
      };
    },
  });
</script>
<style lang="less">
  @import './index.less';
  @prefix-cls: ~'@{namespace}-layout-header';

  .ant-layout .@{prefix-cls} {
    display: flex;
    padding: 0 8px;
    height: @header-height;
    align-items: center;

    .headerIntroductionClass {
      margin-right: 4px;
      margin-bottom: 2px;
      border-bottom: 0px;
      border-left: 0px;
      color: var(--header-text-color);
    }
  }
  .enterprise-analysis-icon{
    padding: 0 10px;
  }
  .enterprise-analysis-icon:hover {
    background-color:var(--header-bg-hover-color) !important;
  }
</style>
