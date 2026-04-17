import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
export const columns = [
  {
    title: '监测对象',
    dataIndex: 'checkTarget',
  },
  {
    title: '重大危险源',
    dataIndex: 'seriousOriginal',
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
  },
  {
    title: '指标类型',
    dataIndex: 'quotaName',
  },
  {
    title: '指标名称',
    dataIndex: 'quotaName',
  },
  {
    title: '预警值',
    dataIndex: 'warningValue',
  },
  {
    title: '预警类型',
    dataIndex: 'warningType',
    // customRender: (text) => {
    //   const label = text.value == 1 ? '红色' : text.value == 2 ? '橙色' : text.value == 3 ? '黄色' : '蓝色';
    //   return label;
    // },
  },
  {
    title: '报警时间',
    dataIndex: 'alarmTime',
  },
  {
    title: '消警时间',
    dataIndex: 'cancellationTime',
  },
  {
    title: '预警时长',
    dataIndex: 'warningTimeText',
  },
  {
    title: '消警状态',
    dataIndex: 'cancellationType',
  },
  {
    title: '反馈结果',
    dataIndex: 'warningVerify',
    customRender: (text) => {
      const label = text.value == 1 ? '存在报警' : text.value == 0 ? '误报警' : '';
      return label;
    },
  },
  {
    title: '数据来源',
    dataIndex: 'dataSource',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'checkTarget',
    label: '监测对象',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'safe_device_check_target',
    },
  },
  {
    field: 'cancellationType',
    label: '消警状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '已消警', value: 1 },
        { label: '未消警', value: 0 },
      ],
    },
  },
  {
    field: 'warningType',
    label: '预警类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '红色', value: 1 },
        { label: '橙色', value: 2 },
        { label: '黄色', value: 3 },
        { label: '蓝色', value: 4 },
      ],
    },
  },
  {
    field: 'warningVerify',
    label: '反馈结果',
    component: 'Select',
    componentProps: {
      options: [
        { label: '存在报警', value: 1 },
        { label: '误报警', value: 0 },
      ],
    },
  },
  {
    field: 'alarmTime',
    label: '报警日期',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
  },
];
