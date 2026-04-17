import { FormSchema } from '/@/components/Table';
import { getHazardManageList } from './line.api';
import { useUserStore } from '/@/store/modules/user';
export const columns = [
  {
    title: '监测对象',
    dataIndex: 'checkTargetName',
  },
  {
    title: '重大危险源',
    dataIndex: 'seriousOriginalName',
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
  },
  {
    title: '指标类型',
    dataIndex: 'quotaTypeText',
  },
  {
    title: '指标名称',
    dataIndex: 'quotaName',
  },
  {
    title: '指标编码',
    dataIndex: 'quotaCode',
  },
  {
    title: '计量单位',
    dataIndex: 'unitText',
  },
  {
    title: '仪表量程上限',
    dataIndex: 'meterUpperLimit',
  },
  {
    title: '仪表量程下限',
    dataIndex: 'meterLowerLimit',
  },
  {
    title: '红色预警阈值',
    dataIndex: 'redThreshold',
  },
  {
    title: '橙色预警阈值',
    dataIndex: 'orangeThreshold',
  },
  {
    title: '黄色预警阈值',
    dataIndex: 'yellowThreshold',
  },
  {
    title: '蓝色预警阈值',
    dataIndex: 'blueThreshold',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'checkTargetId',
    label: '监测对象',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'safe_device_check_target',
    },
  },
  {
    field: 'seriousOriginalId',
    label: '重大危险源',
    component: 'ApiSelect',
    componentProps:() => {
        const userStore = useUserStore();
        return {
            api: getHazardManageList,
            labelField: 'hazardName',
            params: {
                orgCode: userStore.currentEnterpriseCode,
            },
            valueField: 'id',
            immediate: false,
        }
    },
  },
  // {
  //   field: 'deviceName',
  //   label: '设备名称',
  //   component: 'Input',
  // },
  {
    field: 'quotaName',
    label: '指标名称',
    component: 'Input',
  },
  {
    field: 'quotaType',
    label: '指标类型',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'safe_device_quota_type',
      placeholder: '请选择指标类型',
    },
  },
];
