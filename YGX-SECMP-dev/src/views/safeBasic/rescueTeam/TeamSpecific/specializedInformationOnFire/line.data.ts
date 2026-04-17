import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '消防车辆类型',
    dataIndex: 'truckTypeName',
    width: 120,
  },
  {
    title: '消防车辆数量',
    dataIndex: 'truckNum',
    width: 120,
    align: 'right',
  },
  {
    title: '消防水源接口位置',
    dataIndex: 'waterInterfaceLoc',
    width: 150,
    ellipsis: true,
  },
  {
    title: '消防水源接口容量',
    dataIndex: 'waterInterfaceCap',
    width: 150,
    align: 'right',
  },
  {
    title: '特种消防装备',
    dataIndex: 'specialEquipName',
    width: 120,
  },
  {
    title: '可处置火灾类型',
    dataIndex: 'fireTypeId',
    width: 130,
  },
  {
    title: '最大单次救援承载力',
    dataIndex: 'maxRescueBear',
    width: 150,
    align: 'right',
  },
  {
    title: '消防员持证上岗情况',
    dataIndex: 'firemanCertName',
    width: 150,
  },
  {
    title: '年均出警次数',
    dataIndex: 'annualAlarmNum',
    width: 130,
    align: 'right',
  },
  {
    title: '年均出警成功率(%)',
    dataIndex: 'annualAlarmSuccessRate',
    width: 150,
    align: 'right',
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
