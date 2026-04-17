// 主题风格设置
import { ThemeEnum } from '/@/enums/appEnum';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '/@/enums/menuEnum';

import { SIDE_BAR_BG_COLOR_LIST, HEADER_PRESET_BG_COLOR_LIST } from './designSetting';

export const ThemeList = [
  {
    theme: ThemeEnum.LIGHT,
    key: ThemeEnum.LIGHT,
    label: '明亮',
    configs: {},
    primaryColor: '#1890FF',
    headerSetting: {
      bgColor: '#018ffb',
      theme: ThemeEnum.LIGHT,
      hoverColor: '#109eff',
      textColor: '#ffffff',
    },
    menuSetting: {
      bgColor: '#001C40',
      trigger: TriggerEnum.HEADER,
    },
  },
  // 特定样式，这里的部分配置不会生效
  {
    theme: ThemeEnum.LIGHT_QD,
    key: ThemeEnum.LIGHT_QD,
    label: '明亮-蓝白', //蓝白风格
    configs: {},
    primaryColor: '#1890FF',
    headerSetting: {
      bgColor: '#5172DC',
      theme: ThemeEnum.LIGHT,
      hoverColor: '#f6f6f6',
      textColor: '#ffffff',
    },
    menuSetting: {
      bgColor: '#001C40',
      trigger: TriggerEnum.FOOTER,
    },
  },
  {
    theme: ThemeEnum.DARK,
    key: ThemeEnum.DARK,
    label: '深色',
    configs: {},
    primaryColor: '#338CFF',
    headerSetting: {
      bgColor: '#4275f2',
      theme: ThemeEnum.DARK,
      hoverColor: '#0B1C36',
      textColor: '#ffffff',
    },
    menuSetting: {
      bgColor: 'transparent',
      trigger: TriggerEnum.HEADER,
    },
  },
];
