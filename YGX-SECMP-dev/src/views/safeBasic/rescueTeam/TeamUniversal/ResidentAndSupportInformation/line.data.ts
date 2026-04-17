import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '驻地纬度',
    dataIndex: 'stationLat',
    width: 120,
  },
  {
    title: '驻地经度',
    dataIndex: 'stationLng',
    width: 120,
  },
  {
    title: '办公及训练场地面积(㎡)',
    dataIndex: 'officeTrainingArea',
    width: 160,
    align: 'right',
  },
  {
    title: '物资储备仓库地址',
    dataIndex: 'materialWarehouseAddr',
    width: 200,
    ellipsis: true,
  },
  {
    title: '物资储备仓库面积(㎡)',
    dataIndex: 'materialWarehouseArea',
    width: 160,
    align: 'right',
  },
  {
    title: '食宿保障人数',
    dataIndex: 'accommodationGuaranteeNum',
    width: 130,
    align: 'right',
  },
  {
    title: '应急供电供水能力',
    dataIndex: 'rescuePowerWaterCapacity',
    width: 150,
  },
  {
    title: '经费来源',
    dataIndex: 'fundSourceName',
    width: 120,
  },
  {
    title: '年度经费预算(元)',
    dataIndex: 'annualFundBudget',
    width: 150,
    align: 'right',
  },
  {
    title: '应急通道规划',
    dataIndex: 'rescueChannelPlan',
    width: 200,
    ellipsis: true,
  },
  {
    title: '保险投保情况',
    dataIndex: 'insuranceName',
    width: 120,
  },
];

export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'paramName',
  //   label: '参数名',
  //   component: 'Input',
  //   colProps: { span: 6 },
  // },
  // {
  //   field: 'paramTypeId',
  //   label: '参数类型',
  //   component: 'JDictSelectTag',
  //   componentProps: {
  //     dictCode: 'sys_param_type',
  //   },
  //   colProps: { span: 6 },
  // },
];
