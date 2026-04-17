/**
The routing of this file will not show the layout.
It is an independent new page.
the contents of the file still need to log in to access
 */
import type { AppRouteModule } from '/@/router/types';

// test
// http:ip:port/main-out
export const mainOutRoutes: AppRouteModule[] = [
  {
    path: '/AoneMap',
    name: 'AoneMapRedirect',
    redirect: '/emergency-safety',
    meta: {
      title: '一张图大屏',
      hideMenu: true,
    },
  },
  {
    path: '/geological',
    name: 'geological',
    component: () => import('/@/views/AoneMap/geologicalDisasters/index.vue'),
    meta: {
      title: '地质灾害一张图',
      hideMenu: true,
    },
  },
  {
    path: '/hydrology',
    name: 'hydrology',
    component: () => import('/@/views/AoneMap/hydrology/index.vue'),
    meta: {
      title: '水文监测一张图',
      hideMenu: true,
    },
  },
  {
    path: '/forest-fire',
    name: 'AoneMapForestFireRedirect',
    redirect: '/forestFire',
    meta: { title: '森林防火一张图', hideMenu: true },
  },
  {
    path: '/forestFire',
    name: 'AoneMapForestFire',
    component: () => import('/@/views/AoneMap/forestFire/index.vue'),
    meta: {
      title: '森林防火一张图',
      hideMenu: true,
    },
  },
  {
    path: '/industry-trade',
    name: 'AoneMapIndustryTrade',
    component: () => import('/@/views/AoneMap/industryTrade/index.vue'),
    meta: {
      title: '工贸行业监管一张图',
      hideMenu: true,
    },
  },
  {
    path: '/mining-industry',
    name: 'AoneMapMiningIndustry',
    component: () => import('/@/views/AoneMap/miningIndustry/index.vue'),
    meta: {
      title: '矿山行业监管一张图',
      hideMenu: true,
    },
  },
  {
    path: '/hazardous',
    name: 'AoneMapHazardous',
    component: () => import('/@/views/AoneMap/hazardousChemicals/index.vue'),
    meta: {
      title: '危险化学品监管一张图',
      hideMenu: true,
    },
  },
  {
    path: '/public-safety',
    name: 'AoneMapPublicSafety',
    component: () => import('/@/views/AoneMap/publicSafety/index.vue'),
    meta: {
      title: '公共安全一张图',
      hideMenu: true,
    },
  },
  {
    path: '/emergency-safety',
    name: 'AoneMapEmergencySafety',
    component: () => import('/@/views/AoneMap/emergencySafety/index.vue'),
    meta: {
      title: '应急安全一张图',
      hideMenu: true,
    },
  },
  {
    path: '/emergency-rescue',
    name: 'AoneMapEmergencyRescue',
    component: () => import('/@/views/AoneMap/emergencyRescue/index.vue'),
    meta: {
      title: '应急救援一张图',
      hideMenu: true,
    },
  },
  {
    path: '/main-out',
    name: 'MainOut',
    component: () => import('/@/views/demo/main-out/index.vue'),
    meta: {
      title: 'MainOut',
      ignoreAuth: true,
    },
  },
  //一张图路由
//   {
//     path: '/statistics',
//     name: 'Statistics',
//     // component: () => import('/@/views/statistics/index.vue'),
//     component: () => import('/@/views/common/index.vue'),
//     meta: {
//       title: '数据统计',
//       ignoreAuth: true,
//     },
//   },
];

export const mainOutRouteNames = mainOutRoutes.map((item) => item.name);
