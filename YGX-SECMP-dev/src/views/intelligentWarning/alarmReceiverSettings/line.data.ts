import { FormSchema } from '/@/components/Table';

export const columns = [
  {
    title: '区县',
    dataIndex: 'areaName',
    width: 120,
  },
  {
    title: '单位名称',
    dataIndex: 'unitName',
    width: 180,
  },
  {
    title: '红色预警',
    dataIndex: 'redCount',
    width: 100,
    align: 'center',
  },
  {
    title: '橙色预警',
    dataIndex: 'orangeCount',
    width: 100,
    align: 'center',
  },
  {
    title: '黄色预警',
    dataIndex: 'yellowCount',
    width: 100,
    align: 'center',
  },
  {
    title: '蓝色预警',
    dataIndex: 'blueCount',
    width: 100,
    align: 'center',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'areaId',
    label: '行政区划',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'area', // 请根据实际字典编码修改
      placeholder: '请选择区县',
    },
    colProps: { span: 6 },
  },
  {
    field: 'unitName',
    label: '单位名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入单位名称',
    },
    colProps: { span: 6 },
  },
];

export const column = [
  {
    title: '姓名', dataIndex: 'name', width: 120,
    align: 'center'
  },
  {
    title: '电话', dataIndex: 'phone', width: 120,
    align: 'center'
  },
  {
    title: '描述', dataIndex: 'memo', ellipsis: true,
    align: 'center'
  },
  {
    title: '预警等级', dataIndex: 'alarmLevelName', width: 100,
    align: 'center'
  },
];
export const searchFormSchemas: FormSchema[] = [
  // {
  //   field: 'areaId',
  //   label: '行政区划',
  //   component: 'JDictSelectTag',
  //   componentProps: {
  //     dictCode: 'area', // 请根据实际字典编码修改
  //     placeholder: '请选择区县',
  //   },
  //   colProps: { span: 6 },
  // },
  // {
  //   field: 'unitName',
  //   label: '单位名称',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '请输入单位名称',
  //   },
  //   colProps: { span: 6 },
  // },
];