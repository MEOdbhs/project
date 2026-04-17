import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '危化品处置专业人员数量',
    dataIndex: 'profStaffNum',
    width: 180,
    align: 'right',
  },
  {
    title: '专业资质',
    dataIndex: 'profQualName',
    width: 120,
  },
  {
    title: '防化服及防护装备等级',
    dataIndex: 'protectiveGrade',
    width: 180,
  },
  {
    title: '危化品侦检设备',
    dataIndex: 'detectEquipName',
    width: 150,
  },
  {
    title: '处置装备',
    dataIndex: 'disposeEquip',
    width: 200,
    ellipsis: true,
  },
  {
    title: '可处置危化品种类',
    dataIndex: 'chemTypeName',
    width: 150,
  },
  {
    title: '最大处置规模',
    dataIndex: 'maxDisposeScale',
    width: 150,
  },
  {
    title: '与化工园区联动机制',
    dataIndex: 'parkLinkage',
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
