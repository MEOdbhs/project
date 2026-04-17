<script lang="tsx">
  import type { PropType, CSSProperties } from 'vue';

  import { computed, defineComponent, unref, toRef, watch } from 'vue';
  import { BasicMenu } from '/@/components/Menu';
  import { SimpleMenu } from '/@/components/SimpleMenu';
  import { AppLogo } from '/@/components/Application';

  import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';

  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { ScrollContainer } from '/@/components/Container';

  import { useGo } from '/@/hooks/web/usePage';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useSplitMenu } from './useLayoutMenu';
  import { openWindow } from '/@/utils';
  import { propTypes } from '/@/utils/propTypes';
  import { isUrl } from '/@/utils/is';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLocaleStore } from '/@/store/modules/locale';
  import { ThemeEnum } from '/@/enums/appEnum';
  export default defineComponent({
    name: 'LayoutMenu',
    props: {
      theme: propTypes.oneOf(['light', 'dark']),

      splitType: {
        type: Number as PropType<MenuSplitTyeEnum>,
        default: MenuSplitTyeEnum.NONE,
      },

      isHorizontal: propTypes.bool,
      // menu Mode
      menuMode: {
        type: [String] as PropType<Nullable<MenuModeEnum>>,
        default: '',
      },
      currentPathObj: {
        type: Object as PropType<{
          currentAppPath: string;
          currentRoutePath: string;
        }>,
        default: () => {
          return {
            currentAppPath: '',
            currentRoutePath: '',
          };
        },
        required: true,
      },
    },
    setup(props) {
      const go = useGo();

      const {
        getMenuMode,
        getMenuType,
        getMenuTheme,
        getCollapsed,
        getCollapsedShowTitle,
        getAccordion,
        getIsHorizontal,
        getIsSidebarType,
        getSplit,
      } = useMenuSetting();
      const { getShowLogo, getDarkMode } = useRootSetting();

      const { prefixCls } = useDesign('layout-menu');

      const glob = useGlobSetting();

      const { menusRef } = useSplitMenu(toRef(props, 'splitType'));

      const { getIsMobile } = useAppInject();

      const getComputedMenuMode = computed(() => (unref(getIsMobile) ? MenuModeEnum.INLINE : props.menuMode || unref(getMenuMode)));

      const getComputedMenuTheme = computed(() => props.theme || unref(getMenuTheme));

      const getIsShowLogo = computed(() => unref(getShowLogo) && unref(getIsSidebarType));

      const getUseScroll = computed(() => {
        // 【JEECG作为乾坤子应用】在乾坤子应用下，菜单不固定
        if (glob.isQiankunMicro) {
          return false;
        }

        return (
          !unref(getIsHorizontal) &&
          (unref(getIsSidebarType) || props.splitType === MenuSplitTyeEnum.LEFT || props.splitType === MenuSplitTyeEnum.NONE)
        );
      });
      const isQD = computed(() => {
        return getDarkMode.value === ThemeEnum.LIGHT_QD;
      });
      const getWrapperStyle = computed((): CSSProperties => {
        const height = isQD.value ? '80px' : '64px';
        return {
          // update-begin--author:liaozhiyang---date:20241216---for：【issues/7548】侧边栏导航模式时会导致下面菜单滚动显示不全
          height: `calc(100% - ${unref(getIsShowLogo) ? height : '0px'})`,
          // update-end--author:liaozhiyang---date:20241216---for：【issues/7548】侧边栏导航模式时会导致下面菜单滚动显示不全
        };
      });

      const getLogoClass = computed(() => {
        return [
          `${prefixCls}-logo`,
          unref(getComputedMenuTheme),
          {
            [`${prefixCls}--mobile`]: unref(getIsMobile),
          },
        ];
      });

      const getCommonProps = computed(() => {
        const menus = unref(menusRef);
        if (isQD.value) {
          const filterMenus = menus.filter((item) => item.path === props.currentPathObj.currentAppPath);
          let filterMenu = [];
          if (filterMenus && filterMenus.length > 0) {
            const firstMenu = filterMenus[0];
            if (firstMenu && firstMenu.children && firstMenu.children.length > 0) {
              filterMenu = firstMenu.children;
            } else {
              filterMenu = [firstMenu];
            }
          }

          return {
            menus: filterMenu,
            beforeClickFn: beforeMenuClickFn,
            items: filterMenu,
            theme: unref(getComputedMenuTheme),
            accordion: unref(getAccordion),
            collapse: unref(getCollapsed),
            collapsedShowTitle: unref(getCollapsedShowTitle),
            onMenuClick: handleMenuClick,
          };
        }
        return {
          menus,
          beforeClickFn: beforeMenuClickFn,
          items: menus,
          theme: unref(getComputedMenuTheme),
          accordion: unref(getAccordion),
          collapse: unref(getCollapsed),
          collapsedShowTitle: unref(getCollapsedShowTitle),
          onMenuClick: handleMenuClick,
        };
      });
      const findLastChild = (menuItem) => {
        if (menuItem.children && menuItem.children.length > 0) {
          return findLastChild(menuItem.children[0]);
        }
        return menuItem;
      };
      const findMenuRecursive = (menusArray, currentRoutePath) => {
        for (const menu of menusArray) {
          if (menu.path === currentRoutePath) {
            return menu;
          }
          if (menu.children && menu.children.length > 0) {
            const found = findMenuRecursive(menu.children, currentRoutePath);
            if (found) {
              return found;
            }
          }
        }
        return null;
      };
      // watch props.currentPathObj 重新渲染菜单
      watch(
        () => props.currentPathObj,
        () => {
          if (isQD.value) {
            const menus = unref(menusRef);
            const filterMenus = menus.filter((item) => item.path === props.currentPathObj.currentAppPath);
            let filterMenu = [];
            if (filterMenus && filterMenus.length > 0) {
              const firstMenu = filterMenus[0];
              if (firstMenu && firstMenu.children && firstMenu.children.length > 0) {
                filterMenu = firstMenu.children;
              } else {
                filterMenu = [firstMenu];
              }
            }
            if (filterMenu && filterMenu.length > 0) {
              const fMenu = filterMenu[0];
              const currentRoutePath = props.currentPathObj.currentRoutePath;
              if (currentRoutePath) {
                // 找到当前路由的菜单
                // 递归查找filterMenu中path等于currentRoutePath的菜单
                const currentMenu = findMenuRecursive(filterMenu, currentRoutePath);
                handleMenuClick(currentRoutePath, currentMenu);
              } else {
                // 如果当前路由的菜单不存在，则找到第一个菜单
                // 判断fMenu是否包含有children属性，如果有则递归查找children[0]，找到最后一个节点，然后点击,如果没有children属性，则直接点击
                if (fMenu && fMenu.children && fMenu.children.length > 0) {
                  // 递归查找children[0]，找到最后一个节点
                  const lastChild = findLastChild(fMenu);
                  if (lastChild && lastChild.path) {
                    handleMenuClick(lastChild.path, lastChild);
                  }
                } else {
                  if (fMenu && fMenu.path) {
                    handleMenuClick(fMenu.path, fMenu);
                  }
                }
              }
            }
          }
        },
        { immediate: true }
      );
      /**
       * click menu
       * @param menu
       */
      //update-begin-author:taoyan date:2022-6-1 for: VUEN-1144 online 配置成菜单后，打开菜单，显示名称未展示为菜单名称
      const localeStore = useLocaleStore();
      function handleMenuClick(path: string, item) {
        if (item) {
          localeStore.setPathTitle(path, item.title || '');
        }
        go(path);
      }
      //update-end-author:taoyan date:2022-6-1 for: VUEN-1144 online 配置成菜单后，打开菜单，显示名称未展示为菜单名称

      /**
       * before click menu
       * @param menu
       */
      async function beforeMenuClickFn(path: string) {
        if (!isUrl(path)) {
          return true;
        }
        openWindow(path);
        return false;
      }

      function renderHeader() {
        if (!unref(getIsShowLogo) && !unref(getIsMobile)) return null;

        return <AppLogo showTitle={!unref(getCollapsed)} class={unref(getLogoClass)} theme={unref(getComputedMenuTheme)} />;
      }

      function renderMenu() {
        const { menus, ...menuProps } = unref(getCommonProps);
        // console.log(menus);
        if (!menus || !menus.length) return null;
        return !props.isHorizontal ? (
          <SimpleMenu {...menuProps} isSplitMenu={unref(getSplit)} items={menus} />
        ) : (
          <BasicMenu
            {...(menuProps as any)}
            isHorizontal={props.isHorizontal}
            type={unref(getMenuType)}
            showLogo={unref(getIsShowLogo)}
            mode={unref(getComputedMenuMode as any)}
            items={menus}
          />
        );
      }

      return () => {
        return (
          <>
            {renderHeader()}
            {unref(getUseScroll) ? <ScrollContainer style={unref(getWrapperStyle)}>{() => renderMenu()}</ScrollContainer> : renderMenu()}
          </>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  // update-begin--author:liaozhiyang---date:20230803---for：【QQYUN-5872】菜单优化，上下滚动条去掉
  .scroll-container :deep(.scrollbar__bar) {
    display: none;
  }
  // update-end--author:liaozhiyang---date:20230803---for：【QQYUN-5872】菜单优化，上下滚动条去掉
</style>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-menu';
  @logo-prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    &-logo {
      height: @header-height;
      padding: 10px 4px 10px 10px;

      img {
        width: @logo-width;
        height: @logo-width;
      }
    }

    &--mobile {
      .@{logo-prefix-cls} {
        &__title {
          opacity: 1;
        }
      }
    }
  }
</style>
