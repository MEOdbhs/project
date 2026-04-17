import {BasicColumn, FormSchema } from '/@/components/Table';
import { getDictTextByCode } from '/@/utils/dict'
export const columns: BasicColumn[] = [

  {
    title: '类别',
    dataIndex: 'monitorCategoryName',
    width: 100,
  },
  {
    title: '设备类型',
    dataIndex: 'monitorTypeName',
    width: 100,
  },
  {
    title: '设备名称',
    dataIndex: 'monitorName',
    width: 150,
  },
  {
    title: '设备编号',
    dataIndex: 'monitorCode',
    width: 150,
  },
  {
    title: '计划开始时间',
    dataIndex: 'startPlan',
    width: 120,
  },
  {
    title: '校准时间',
    dataIndex: 'calibrationDate',
    width: 100,
  },
  {
    title: '有效期至',
    dataIndex: 'endPlan',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: 100,
    customRender: ({ value }) => (value === 'Y' ? '有效' : value === 'N' ? '无效' : '-'),
  },
  {
    title: '任务人员',
    dataIndex: 'userName',
    width: 160,
  },
 
];

export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'monitorCategoryId',
  //   label: '类别',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: '矿山', value: '矿山' },
  //       { label: '水利', value: '水利' },
  //       { label: '交通', value: '交通' },
  //     ],
  //     placeholder: '请选择',
  //   },
  //   colProps: { span: 6 },
  // },
  {
    label: '类别',
    field: 'monitorCategoryId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'monitor_category',
    },
    colProps: { span: 6 },
  },
  {
    field: 'monitorTypeId',
    label: '设备类型',
    component: 'JDictSelectTag',
    colProps: { span: 6 },
    componentProps: {
      dictCode: 'monitor_detector_type',
    },
  },
  {
    field: 'monitorTypeNameAndCode',
    label: '设备名称/编号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入设备名称或编号',
    },
    colProps: { span: 6 },
  },
  {
    field: 'state',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '有效', value: 'Y' },
        { label: '无效', value: 'N' },
      ],
      placeholder: '请选择',
    },
    colProps: { span: 6 },
  },
  {
    field: 'calibratioTime',
    label: '校准时间',
    component: 'RangePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    colProps: { span: 12 },
  },
  {
    field: 'RangeTime',
    label: '计划开始时间',
    component: 'RangePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    colProps: { span: 12 },
  },
];