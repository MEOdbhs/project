import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '急救人员总数',
    dataIndex: 'staffTotal',
    width: 120,
    align: 'right',
  },
  {
    title: '医护人员资质',
    dataIndex: 'medQuaName',
    width: 120,
  },
  {
    title: '救护车配置数量',
    dataIndex: 'ambNum',
    width: 130,
    align: 'right',
  },
  {
    title: '救护车配置型号',
    dataIndex: 'ambModel',
    width: 150,
  },
  {
    title: '急救设备清单',
    dataIndex: 'equipTypeName',
    width: 120,
  },
  {
    title: '可开展救治类型',
    dataIndex: 'treatTypeName',
    width: 130,
  },
  {
    title: '平均急救响应时间',
    dataIndex: 'avgRespTime',
    width: 150,
    align: 'right',
  },
  {
    title: '与定点医院联动机制',
    dataIndex: 'hospLinkage',
    width: 200,
    ellipsis: true,
  },
  {
    title: '急救物资补充渠道',
    dataIndex: 'matSupply',
    width: 200,
    ellipsis: true,
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
