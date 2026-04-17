import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '破拆救援装备',
    dataIndex: 'breachEquipName',
    width: 150,
  },
  {
    title: '生命探测仪类型',
    dataIndex: 'detectorTypeName',
    width: 150,
  },
  {
    title: '生命探测仪数量',
    dataIndex: 'detectorNum',
    width: 140,
    align: 'right',
  },
  {
    title: '废墟救援训练场地',
    dataIndex: 'rescueTrainingSite',
    width: 200,
    ellipsis: true,
  },
  {
    title: '队员搜救资质',
    dataIndex: 'staffEnvQual',
    width: 200,
    ellipsis: true,
  },
  {
    title: '可承受救援环境',
    dataIndex: 'rescueBearName',
    width: 150,
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
