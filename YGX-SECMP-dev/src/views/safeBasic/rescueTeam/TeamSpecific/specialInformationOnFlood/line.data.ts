import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '抢险船只/冲锋舟数量',
    dataIndex: 'rescueBoatNum',
    width: 160,
    align: 'right',
  },
  {
    title: '抢险船只/冲锋舟型号',
    dataIndex: 'rescueBoatModel',
    width: 150,
  },
  {
    title: '排水泵功率',
    dataIndex: 'pumpPower',
    width: 130,
    align: 'right',
  },
  {
    title: '排水泵数量',
    dataIndex: 'pumpNum',
    width: 120,
    align: 'right',
  },
  {
    title: '防汛沙袋储备量',
    dataIndex: 'sandbagStock',
    width: 140,
    align: 'right',
  },
  {
    title: '堤坝加固装备',
    dataIndex: 'damReinEquip',
    width: 200,
    ellipsis: true,
  },
  {
    title: '救生装备数量',
    dataIndex: 'lifeEquipNum',
    width: 140,
    align: 'right',
  },
  {
    title: '可处置险情类型',
    dataIndex: 'dangerTypeName',
    width: 150,
  },
  {
    title: '涉水救援训练时长',
    dataIndex: 'waterTrainingHours',
    width: 160,
    align: 'right',
  },
  {
    title: '与水文部门信息联动情况',
    dataIndex: 'hydrologyLink',
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
