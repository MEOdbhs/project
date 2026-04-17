<template>
  <Header :class="getHeaderClass">
    <!-- left start -->
    <div :class="`${prefixCls}-left`">
      <div class="new-logo">
        <img src="@/assets/business/img/logo_no_text.svg" alt="" class="h-36px ml-8px mr-8px" />
        <span class="font-bold font-size-32px cursor-pointer w-400px overflow-hidden whitespace-nowrap" @click="goToBigScreen">{{ title }}</span>
      </div>
    </div>
    <!-- left end -->

    <div :class="`${prefixCls}-right`">
      <div class="app-top-line"></div>
      <div class="header-right-content">
        <div class="apps-box">
          <div
            v-for="i in appList"
            :key="i.path"
            :class="['app-item', currentAppPath === i.path ? 'app-item-active' : '']"
            @click="handleAppClick(i)"
          >
            {{ i.name }}
          </div>
        </div>
        <div calss="actions">
          <!-- action  -->
          <div :class="`${prefixCls}-action`">
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
        </div>
      </div>
    </div>
  </Header>
  <LoginSelect ref="loginSelectRef" @success="loginSelectOk" />
</template>
<script lang="ts">
  import { defineComponent, unref, computed, ref, onMounted, toRaw, watch } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { propTypes } from '/@/utils/propTypes';

  import { Layout } from 'ant-design-vue';

  import { AppSearch } from '/@/components/Application';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';
  import { SettingButtonPositionEnum } from '/@/enums/appEnum';
  import { AppLocalePicker } from '/@/components/Application';

  import { UserDropDown, FullScreen, Notify, ErrorAction, LockScreen } from './components';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useLocale } from '/@/locales/useLocale';

  import LoginSelect from '/@/views/sys/login/LoginSelect.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Aide from '@/views/dashboard/ai/components/aide/index.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useSplitMenu } from '../menu/useLayoutMenu';
  import { listenerRouteChange } from '/@/logics/mitt/routeChange';
  import { REDIRECT_NAME } from '/@/router/constant';
  import { getAllParentPath } from '/@/router/helper/menuHelper';
  const { t } = useI18n();

  export default defineComponent({
    name: 'LayoutHeader',
    components: {
      Header: Layout.Header,
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
    emits: ['changeApp'],
    setup(props, { emit }) {
      const { prefixCls } = useDesign('layout-header');
      const userStore = useUserStore();
      const { getShowTopMenu, getShowHeaderTrigger, getSplit, getIsMixMode, getMenuWidth, getIsMixSidebar } = useMenuSetting();
      const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition, getAiIconShow } = useRootSetting();
      const { title } = useGlobSetting();
      const go = useGo();

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
        // const theme = unref(getHeaderTheme);
        return [
          prefixCls,
          {
            [`${prefixCls}--fixed`]: props.fixed,
            [`${prefixCls}--mobile`]: unref(getIsMobile),
            // [`${prefixCls}--${theme}`]: theme,
            [`${prefixCls}--lightQD`]: true,
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
      //
      const { menusRef } = useSplitMenu(getSplitType);

      const appList = computed(() => {
        const menus = menusRef.value;
        return menus;
      });
      const currentAppPath = ref('');
      const currentRoutePath = ref('');
      listenerRouteChange((route) => {
        if (route.name === REDIRECT_NAME) return;
        const { path } = route;
        currentRoutePath.value = path;
      });
      watch(
        () => [appList.value],
        (val) => {
          if (!val) return;
          if (!appList.value.length) return;
          if (!currentAppPath.value && !currentRoutePath.value) {
            // 默认取第一个
            currentAppPath.value = appList.value[0].path;
          }
          if (currentRoutePath.value) {
            const parentPathList = getAllParentPath(appList.value, currentRoutePath.value);
            if (parentPathList && parentPathList.length > 0) {
              const firstPath = parentPathList[0];
              currentAppPath.value = firstPath;
            }
          }
          emit('changeApp', {
            currentAppPath: currentAppPath.value,
            currentRoutePath: currentRoutePath.value,
          });
        },
        {
          immediate: true,
        }
      );
      watch(
        () => [currentRoutePath.value],
        (val) => {
          if (!val) return;
          if (!appList.value.length) return;
          if (appList.value) {
            const parentPathList = getAllParentPath(appList.value, currentRoutePath.value);
            if (parentPathList && parentPathList.length > 0) {
              const firstPath = parentPathList[0];
              currentAppPath.value = firstPath;
              emit('changeApp', {
                currentAppPath: currentAppPath.value,
                currentRoutePath: currentRoutePath.value,
              });
            }
          }
        },
        {
          immediate: true,
        }
      );
      //
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

      const handleAppClick = (i) => {
        if (currentAppPath.value === i.path) return;
        currentAppPath.value = i.path;
        currentRoutePath.value = '';
        emit('changeApp', {
          currentAppPath: currentAppPath.value,
          currentRoutePath: currentRoutePath.value,
        });
      };

      const goToBigScreen = () => {
        go(userStore.getUserInfo.homePath || PageEnum.BASE_HOME);
      };
      onMounted(() => {
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
        t,
        getAiIconShow,
        appList,
        handleAppClick,
        goToBigScreen,
        currentAppPath,
      };
    },
  });
</script>
<style lang="less">
  @import './index.less';
  @prefix-cls: ~'@{namespace}-layout-header';
  html[data-theme='lightQD'] {
    .ant-layout .@{prefix-cls} {
      display: flex;
      padding: 0 !important;
      height: @header-height;
      align-items: center;
      background: transparent !important;
      border: none !important;
      // position: relative;
      .headerIntroductionClass {
        color: #000;
      }
      .anticon,
      .truncate {
        color: #333 !important;
      }
      .headerIntroductionClass {
        margin-right: 4px;
        margin-bottom: 2px;
        border-bottom: 0px;
        border-left: 0px;
        color: var(--header-text-color);
      }
      .new-logo {
        width: 600px;
        height: 100%;
        display: flex;
        align-items: center;
        color: #fff;
        background: url('@/assets/business/img/logo_light_bg.webp') no-repeat left center;
        background-size: 100% 100%;
        padding: 0 8px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
        padding-bottom: 10px;
      }
      .@{prefix-cls}-right {
        height: 100%;
        position: absolute;
        width: calc(100% - 521px);
        left: 521px;
        z-index: 1;
      }
      .app-top-line {
        height: 10px;
        background: #0448ad;
        border-bottom: 1px solid transparent;
      }
      .header-right-content {
        height: calc(100% - 20px);
        background: #fff;
        border-bottom: 1px solid #9dafd5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 60px;
      }
      .apps-box {
        height: 100%;
        font-size: 20px;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        max-width: 1000px;
        overflow-x: auto;
        overflow-y: hidden;
        .app-item {
          height: 100%;
          min-width: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-right: 16px;
        }
        .app-item-active {
          border-bottom: 2px solid #2c73d4;
          color: #2c73d4;
          font-weight: bold;
        }
        .app-item:hover {
          color: #2c73d4;
        }
      }
    }
  }
</style>
