import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
export const columns = [
  { title: '矿山类型', dataIndex: 'bigTypeName', width: 100 },
  { title: '企业名称', dataIndex: 'companyName', width: 180 },
  { title: '设备类型', dataIndex: 'deviceTypeName', width: 100 },
  { title: '设备名称', dataIndex: 'deviceName', width: 120 },
  { title: '设备编号', dataIndex: 'deviceCode', width: 150 },
  { title: '预警信息', dataIndex: 'warningMessage', width: 200, ellipsis: true },
  // { title: '预警等级', dataIndex: 'warningLevelName', width: 100 },
  {
    title: '预警等级',
    dataIndex: 'warningLevelName',
    width: 80,
    customRender: ({ record }) => {
      const warningLevel = record.warningLevel;
      const color = warningLevel == 'monitor_alarm_red' ? 'red' : warningLevel == 'monitor_alarm_blue' ? 'bule' : warningLevel == 'monitor_alarm_orange' ? 'orange' : 'yellow';
      const text = record.warningLevelName;
      return h(Tag, { color: color }, () => text);
    },
  },
  { title: '预警时间', dataIndex: 'warningTime', width: 160 },
  {
    title: '处置进度', dataIndex: 'disposalProgress', width: 100, customRender: ({ text }) => {
      if (text === 'S') return '待处置';
      if (text === 'Y') return '已解除';
      if (text === 'N') return '处置中';
      return '-';
    },
  },
  {
    title: '是否闭警', dataIndex: 'isDown', width: 100, customRender: ({ text }) => {
      if (text === 'Y') return '是';
      if (text === 'N') return '否';
      return '-';
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'bigType',
    label: '矿山类型',
    component: 'JDictSelectTag',
    componentProps: { dictCode: 'MineType' },
    colProps: { span: 6 },
  },
  {
    field: 'companyName',
    label: '企业名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'warningSource',
    label: '预警来源',
    component: 'JDictSelectTag',
    componentProps: {
      options: [
        { label: '系统', value: 1 },
        { label: '平台', value: 2 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'warningLevel',
    label: '预警等级',
    component: 'JDictSelectTag',
    componentProps: { dictCode: 'monitor_alarm_level' },
    colProps: { span: 6 },
  },
  {
    field: 'disposalProgress',
    label: '处置进度',
    component: 'JDictSelectTag',
    componentProps: {
      options: [
        { label: '待处置', value: 'S' },
        { label: '已解除', value: 'Y' },
        { label: '处置中', value: 'N' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'isClosed',
    label: '是否闭警',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '是', value: 'Y' },
        { label: '否', value: 'N' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'dateRange',
    label: '开始日期至结束日期',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 8 },
  },
];