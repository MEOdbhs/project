import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '队伍名称',
    dataIndex: 'teamName',
    width: 150,
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'creditCode',
    width: 120,
  },
  {
    title: '行政区划',
    dataIndex: 'adminRegion',
    width: 150,
  },
  {
    title: '驻地详细地址',
    dataIndex: 'residAddress',
    width: 150,
  },
  {
    title: '成立日期',
    dataIndex: 'foundDate',
    width: 120,
  },
  {
    title: '队伍类型',
    dataIndex: 'teamTypeName',
    width: 120,
  },
  {
    title: '隶属单位',
    dataIndex: 'affilUnitName',
    width: 120,
  },
  {
    title: '队伍等级',
    dataIndex: 'teamGradeName',
    width: 120,
  },
  {
    title: '编制人数',
    dataIndex: 'authorizedNum',
    width: 120,
  },
  {
    title: '实有人数',
    dataIndex: 'actualNum',
    width: 120,
  },
 
  {
    title: '联络人姓名',
    dataIndex: 'contactName',
    width: 120,
  },
  {
    title: '联络人电话',
    dataIndex: 'contactPhone',
    width: 120,
  },
  {
    title: '应急响应时间承诺',
    dataIndex: 'responseTime',
    width: 120,
  },
  {
    title: '救援覆盖范围',
    dataIndex: 'coverageAreaName',
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
