import { FormSchema } from '/@/components/Table';

export const columns =  [
  {
    title: '企业负责人',
    dataIndex: 'entPrincipal',
    width: 120,
  },
  {
    title: '企业负责人电话',
    dataIndex: 'entPrincipalPhone',
    width: 130,
  },
  {
    title: '安全责任人',
    dataIndex: 'safetyPrincipal',
    width: 120,
  },
  {
    title: '安全责任人电话',
    dataIndex: 'safetyPrincipalPhone',
    width: 130,
  },
  {
    title: '安全值班电话',
    dataIndex: 'safetyDutyPhone',
    width: 120,
  },
  {
    title: '安全生产标准化等级',
    dataIndex: 'safetyStdLevel',
    width: 150,
  },
  {
    title: '从业人员',
    dataIndex: 'workEmp',
    width: 120,
  },
  {
    title: '注册安全工程师',
    dataIndex: 'safetyEngineer',
    width: 150,
  },
  {
    title: '专职安全生产管理人',
    dataIndex: 'fulltimeSafetyAdmin',
    width: 180,
  },
  {
    title: '兼职安全生产管理人',
    dataIndex: 'parttimeSafetyAdmin',
    width: 180,
  },
  {
    title: '两重大一重点作业人',
    dataIndex: 'hazardOperationEmp',
    width: 180,
  },
  {
    title: '应急救援队伍专职人',
    dataIndex: 'rescueTeamEmp',
    width: 180,
  },
  {
    title: '剧毒化学品作业人',
    dataIndex: 'toxicChemEmp',
    width: 160,
  },
  {
    title: '危险化学品作业人',
    dataIndex: 'hazardChemEmp',
    width: 160,
  },
  {
    title: '特殊作业人',
    dataIndex: 'specialOperationEmp',
    width: 140,
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
