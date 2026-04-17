import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '队长姓名',
    dataIndex: 'captainName',
    width: 100,
  },
  {
    title: '队长职务',
    dataIndex: 'captainPosition',
    width: 120,
  },
  {
    title: '队长联系电话',
    dataIndex: 'captainPhone',
    width: 130,
  },
  {
    title: '副队长姓名',
    dataIndex: 'viceCaptainName',
    width: 100,
  },
  {
    title: '副队长分工',
    dataIndex: 'viceCaptainDuties',
    width: 150,
    ellipsis: true, // 内容过长时省略
  },
  {
    title: '组织结构',
    dataIndex: 'orgStructureName',
    width: 120,
  },
  {
    title: '职责分工说明',
    dataIndex: 'respDivisionDesc',
    width: 150,
    ellipsis: true,
  },
  {
    title: '管理制度名称',
    dataIndex: 'manageSystemName',
    width: 150,
    ellipsis: true,
  },
  {
    title: '管理制度版本',
    dataIndex: 'manageSystemVersion',
    width: 120,
  },
  {
    title: '训练演练计划',
    dataIndex: 'trainDrillPlan',
    width: 150,
    ellipsis: true,
  },
  {
    title: '应急联动单位',
    dataIndex: 'liaisonUnit',
    width: 150,
    ellipsis: true,
  },
  {
    title: '联络方式',
    dataIndex: 'contactMethod',
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
