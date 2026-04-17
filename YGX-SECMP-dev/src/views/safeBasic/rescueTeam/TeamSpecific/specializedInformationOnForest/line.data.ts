import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '森林消防装备清单',
    dataIndex: 'forestFireEquipName',
    width: 150,
  },
  {
    title: '无人机巡护设备数量',
    dataIndex: 'uavNum',
    width: 150,
    align: 'right',
  },
  {
    title: '无人机巡护设备型号',
    dataIndex: 'uavModel',
    width: 150,
  },
  {
    title: '巡护路线规划',
    dataIndex: 'patrolRoute',
    width: 200,
    ellipsis: true,
  },
  {
    title: '可处置火情等级',
    dataIndex: 'fireGradeName',
    width: 130,
  },
  {
    title: '森林防火隔离带作业能力',
    dataIndex: 'firebeltCap',
    width: 200,
    ellipsis: true,
  },
  {
    title: '队员野外生存保障物资',
    dataIndex: 'survivalMat',
    width: 200,
    ellipsis: true,
  },
  {
    title: '与气象部门联动情况',
    dataIndex: 'weatherLink',
    width: 180,
    ellipsis: true,
  },
  {
    title: '年均火情处置次数',
    dataIndex: 'annualFireNum',
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
