<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getAvatarUrl" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.realname }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <!-- <MenuItem itemKey="doc" :text="t('layout.header.dropdownItemDoc')" icon="ion:document-text-outline" v-if="getShowDoc" />
        <MenuDivider v-if="getShowDoc" /> -->
       <MenuItem itemKey="account" :text="t('layout.header.dropdownItemSwitchAccount')" icon="ant -design:setting-outlined" />
       <!-- <MenuItem v-if="showCallStation" itemKey="callStation" text="融合通信平台" icon="ant -design:setting-outlined"  />
       <MenuItem itemKey="hkStation" text="海康融合平台" icon="ant -design:setting-outlined" /> -->
        <MenuItem itemKey="password" :text="t('layout.header.dropdownItemSwitchPassword')" icon="ant-design:edit-outlined" />
        <!-- <MenuItem itemKey="depart" :text="t('layout.header.dropdownItemSwitchDepart')" icon="ant-design:cluster-outlined" /> -->
        <!-- <MenuItem itemKey="cache" :text="t('layout.header.dropdownItemRefreshCache')" icon="ion:sync-outline" /> -->
        <!-- <MenuItem
            v-if="getUseLockPage"
            itemKey="lock"
            :text="t('layout.header.tooltipLock')"
            icon="ion:lock-closed-outline"
        />-->
        <MenuItem itemKey="logout" :text="t('layout.header.dropdownItemLoginOut')" icon="ion:power-outline" />
      </Menu>
    </template>
  </Dropdown>
  <LockAction v-if="lockActionVisible" ref="lockActionRef" @register="register" />
  <DepartSelect ref="loginSelectRef" />
  <UpdatePassword v-if="passwordVisible" ref="updatePasswordRef" />
</template>
<script lang="ts">
  // components
  import { Dropdown, Menu } from 'ant-design-vue';

  import { defineComponent, computed, ref } from 'vue';

  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import headerImg from '/@/assets/images/header.jpg';
  import { propTypes } from '/@/utils/propTypes';
  import { openWindow } from '/@/utils';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  import { refreshCache, queryAllDictItems } from '/@/views/system/dict/dict.api';
  import { DB_DICT_DATA_KEY } from '/@/enums/cacheEnum';
  import { removeAuthCache, setAuthCache } from '/@/utils/auth';
  import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
  import { getRefPromise } from '/@/utils/index';
  import {getDictItems,getHkToekn} from "@/api/common/api";

  type MenuEvent = 'logout' | 'doc' | 'lock' | 'cache' | 'depart' | 'password' | 'account' | 'callStation' | 'hkStation';
  const { createMessage } = useMessage();
  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Dropdown,
      Menu,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      MenuDivider: Menu.Divider,
      LockAction: createAsyncComponent(() => import('../lock/LockModal.vue')),
      DepartSelect: createAsyncComponent(() => import('./DepartSelect.vue')),
      UpdatePassword: createAsyncComponent(() => import('./UpdatePassword.vue')),
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light', 'lightQD']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { t } = useI18n();
      const { getShowDoc, getUseLockPage } = useHeaderSetting();
      const userStore = useUserStore();
      const go = useGo();
      
      // 获取当前用户角色列表
      const roleList = computed(() => userStore.getRoleList);
      
      // 打印 store 中的 roleList
      console.log('UserState roleList:', roleList.value);
      
      // 控制融合通信平台菜单项显示：只有当 userType === 1 时才显示
      const showCallStation = computed(() => {
        const userInfo = userStore.getUserInfo;
        return userInfo?.userType === 1;
      });
      
      const passwordVisible = ref(false);
      const lockActionVisible = ref(false);
      const lockActionRef = ref(null);
      const callStationUrl = ref('');
      const hkStationUrl = ref('');
      //账号、密码
      const callStationAccount = ref('');
      const callStationPassword = ref('');
      const getUserInfo = computed(() => {
        const { realname = '', avatar, desc } = userStore.getUserInfo || {};
        return { realname, avatar: avatar || headerImg, desc };
      });

      const getAvatarUrl = computed(() => {
        let { avatar } = getUserInfo.value;
        if (avatar == headerImg) {
          return avatar;
        } else {
          return getFileAccessHttpUrl(avatar);
        }
      });

      const [register, { openModal }] = useModal();
      /**
       * 多部门弹窗逻辑
       */
      const loginSelectRef = ref();
      // update-begin--author:liaozhiyang---date:20230901---for：【QQYUN-6333】空路由问题—首次访问资源太大
      async function handleLock() {
        await getRefPromise(lockActionRef);
        openModal(true);
      }
      // update-end--author:liaozhiyang---date:20230901---for：【QQYUN-6333】空路由问题—首次访问资源太大
      //  login out
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }

      // open doc
      function openDoc() {
        openWindow('');
      }

      // 清除缓存
      async function clearCache() {
        const result = await refreshCache();
        //TODO 当前版本还不支持刷新缓存，需要等jimibi升级
        // const dragRes = await refreshDragCache();
        // console.log('dragRes', dragRes);
        if (result.success) {
          const res = await queryAllDictItems();
          removeAuthCache(DB_DICT_DATA_KEY);
          setAuthCache(DB_DICT_DATA_KEY, res.result);
          // update-begin--author:liaozhiyang---date:20240124---for：【QQYUN-7970】国际化
          createMessage.success(t('layout.header.refreshCacheComplete'));
          // update-end--author:liaozhiyang---date:20240124---for：【QQYUN-7970】国际化
          // update-begin--author:wangshuai---date:20241112---for：【issues/7433】vue3 数据字典优化建议
          userStore.setAllDictItems(res.result);
          // update-end--author:wangshuai---date:20241112---for：【issues/7433】vue3 数据字典优化建议
        } else {
          // update-begin--author:liaozhiyang---date:20240124---for：【QQYUN-7970】国际化
          createMessage.error(t('layout.header.refreshCacheFailure'));
          // update-end--author:liaozhiyang---date:20240124---for：【QQYUN-7970】国际化
        }
      }
      // 切换部门
      function updateCurrentDepart() {
        loginSelectRef.value.show();
      }

      function openhkStation() {
        // 从 sessionStorage 获取网络配置
        const networkType = sessionStorage.getItem('network_type');
        const configUrl = sessionStorage.getItem(
          networkType === 'intranet' ? 'hk_intranet_url' : 'hk_extranet_url'
        );
        
        if (!configUrl) {
          createMessage.error('海康融合平台Url未配置');
          return;
        }
        
        hkStationUrl.value = configUrl;
        
        // 获取token并打开海康融合平台
        getHkToekn({ test: true }).then((tokenRes) => {
          console.log(tokenRes);
          if (tokenRes) {
            openWindow(`${hkStationUrl.value}?type=third&token=${tokenRes}`);
          } else {
            createMessage.error('获取海康融合平台token失败');
          }
        }).catch((error) => {
          console.error('获取海康融合平台token失败:', error);
          createMessage.error('获取海康融合平台token失败');
        });
      }

      function openCallStation() {
        getDictItems('callStationUrl').then(res => {
          //console.log(res);
          if(res&&res.length)
          callStationUrl.value=res[0].value
          //openWindow(res.result);
        });
        getDictItems('callStationPWD').then(res => {
          //console.log(res);
          if(res&&res.length)
          //map一下res找出label为user和password对应的value
          callStationAccount.value=res.find(item=>item.label==='user')?.value;
          callStationPassword.value=res.find(item=>item.label==='password')?.value;
          //console.log(callStationAccount.value);
          
          if(callStationUrl.value&&callStationAccount.value&&callStationPassword.value){
            openWindow(`${callStationUrl.value}?username=${callStationAccount.value}&password=${callStationPassword.value}`);
          }else{
            createMessage.error('融合通信平台Url账号或密码未配置');
          }
          
        });
      
        //openWindow('https://172.168.1.202/login2?username=diaodu&password=Wex@87667229');
      }
      // 修改密码
      const updatePasswordRef = ref();
      // update-begin--author:liaozhiyang---date:20230901---for：【QQYUN-6333】空路由问题—首次访问资源太大
      async function updatePassword() {
        passwordVisible.value = true;
        await getRefPromise(updatePasswordRef);
        updatePasswordRef.value.show(userStore.getUserInfo.username);
      }
      // update-end--author:liaozhiyang---date:20230901---for：【QQYUN-6333】空路由问题—首次访问资源太大
      function handleMenuClick(e: any) {
        switch (e.key) {
          case 'callStation':
            openCallStation();
            break;
          case 'hkStation':
            openhkStation();
            break;
          case 'logout':
            handleLoginOut();
            break;
          case 'doc':
            openDoc();
            break;
          case 'lock':
            handleLock();
            break;
          case 'cache':
            clearCache();
            break;
          case 'depart':
            updateCurrentDepart();
            break;
          case 'password':
            updatePassword();
            break;
          case 'account':
            //update-begin---author:wangshuai ---date:20221125  for：进入用户设置页面------------
            go(`/system/usersetting`);
            //update-end---author:wangshuai ---date:20221125  for：进入用户设置页面--------------
            break;
        }
      }

      return {
        prefixCls,
        t,
        getUserInfo,
        getAvatarUrl,
        handleMenuClick,
        getShowDoc,
        register,
        getUseLockPage,
        loginSelectRef,
        updatePasswordRef,
        passwordVisible,
        lockActionVisible,
        roleList, // 导出 roleList 供模板或其他地方使用
        showCallStation, // 导出 showCallStation 供模板使用
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: calc(@header-height - 1px);
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
      color: var(--header-text-color) !important;
    }
    &:hover {
      background-color: @header-dark-bg-hover-color;
    }

    &--light {
      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      // update-begin--author:liaozhiyang---date:20231226---for：【QQYUN-7512】顶部账号划过首次弹出时位置会变更一下
      width: 160px;
      // update-end--author:liaozhiyang---date:20231226---for：【QQYUN-7512】顶部账号划过首次弹出时位置会变更一下
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
  html[data-theme='lightQD'] {
    .@{prefix-cls} {
      height: calc(@header-height - 20px) !important;
    }
  }
</style>
